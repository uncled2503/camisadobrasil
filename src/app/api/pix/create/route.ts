import { NextResponse } from "next/server";
import {
  extractPixGatewayPayload,
  formatRoyalBankingMinPixAmountPt,
  humanizePixGatewayError,
  isPixAmountBelowGatewayMin,
} from "@/lib/pix-gateway-response";
import { PRODUCT } from "@/lib/product";
import { insertCheckoutLead } from "@/lib/supabase/insert-lead-from-checkout";
import { insertPendingPixVenda } from "@/lib/supabase/pending-venda-pix";

const GATEWAY_URL = "https://api.royalbanking.com.br/v1/gateway/";

type ClientPayload = {
  name?: string;
  document?: string;
  telefone?: string;
  email?: string;
};

type Body = {
  amount?: number;
  client?: ClientPayload;
  split?: { email?: string; percentage?: string };
  /** Resumo para o painel (ex.: produto + qtd). */
  productSummary?: string;
  /** Centavos BRL; se omitido, usa `Math.round(amount * 100)`. */
  amountCents?: number;
  /** Uma linha com CEP e morada, se disponível no checkout. */
  shippingSummary?: string;
};

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

function webhookPath() {
  return "/api/webhooks/royalbanking/pix";
}

/**
 * URL pública do webhook (Cash In).
 * Ordem: ROYALBANKING_PIX_CALLBACK_URL → SITE_URL / APP_URL / NEXT_PUBLIC_APP_URL → VERCEL_URL
 * → em não-produção, localhost (só dev; a Royal Banking precisa de URL acessível na internet — use ngrok + ROYALBANKING_PIX_CALLBACK_URL).
 */
function resolveCallbackUrl(): string | null {
  const explicit = process.env.ROYALBANKING_PIX_CALLBACK_URL?.trim();
  if (explicit) return explicit;

  const site =
    process.env.SITE_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (site) {
    return `${site.replace(/\/$/, "")}${webhookPath()}`;
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const origin = vercel.startsWith("http") ? vercel : `https://${vercel}`;
    return `${origin.replace(/\/$/, "")}${webhookPath()}`;
  }

  if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT?.trim() || "3000";
    return `http://127.0.0.1:${port}${webhookPath()}`;
  }

  return null;
}

export async function POST(request: Request) {
  const apiKey = process.env.ROYALBANKING_API_KEY;
  const callbackUrl = resolveCallbackUrl();

  if (!apiKey?.trim()) {
    return NextResponse.json(
      {
        error:
          "Configure ROYALBANKING_API_KEY no ambiente (Vercel → Settings → Environment Variables).",
      },
      { status: 503 }
    );
  }
  if (!callbackUrl) {
    return NextResponse.json(
      {
        error:
          "URL do webhook não definida. Em produção (Vercel): defina SITE_URL ou NEXT_PUBLIC_APP_URL com o domínio público (ex.: https://camisa-brasil-landing.vercel.app), ou ROYALBANKING_PIX_CALLBACK_URL com a URL completa do webhook. Em local, use ngrok e aponte ROYALBANKING_PIX_CALLBACK_URL para …/api/webhooks/royalbanking/pix. Redeploy após alterar variáveis na Vercel.",
      },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Corpo JSON inválido" }, { status: 400 });
  }

  const amount = body.amount;
  const c = body.client;
  if (
    amount == null ||
    typeof amount !== "number" ||
    amount <= 0 ||
    !c?.name?.trim() ||
    !c?.document?.trim() ||
    !c?.telefone?.trim() ||
    !c?.email?.trim()
  ) {
    return NextResponse.json(
      { error: "amount e client (name, document, telefone, email) são obrigatórios" },
      { status: 400 }
    );
  }

  if (isPixAmountBelowGatewayMin(amount)) {
    return NextResponse.json(
      {
        error: `O valor mínimo para gerar Pix é ${formatRoyalBankingMinPixAmountPt()}. Aumente o total do pedido ou escolha cartão.`,
      },
      { status: 400 }
    );
  }

  const payload: Record<string, unknown> = {
    "api-key": apiKey,
    amount,
    client: {
      name: c.name.trim(),
      document: onlyDigits(c.document),
      telefone: onlyDigits(c.telefone),
      email: c.email.trim(),
    },
    callbackUrl: callbackUrl.trim(),
  };

  if (body.split?.email != null || body.split?.percentage != null) {
    payload.split = {
      ...(body.split.email != null ? { email: body.split.email } : {}),
      ...(body.split.percentage != null ? { percentage: body.split.percentage } : {}),
    };
  }

  const upstream = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await upstream.text();
  let data: unknown;
  try {
    data = JSON.parse(text) as unknown;
  } catch {
    return NextResponse.json(
      { error: "Resposta inválida do gateway", status: upstream.status, raw: text.slice(0, 500) },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    const base =
      typeof data === "object" && data !== null && !Array.isArray(data)
        ? ({ ...(data as Record<string, unknown>) } as Record<string, unknown>)
        : { detail: data };

    if (upstream.status === 401 || upstream.status === 403) {
      return NextResponse.json(
        {
          ...base,
          error:
            "Royal Banking recusou a chave (401/403). Confirme ROYALBANKING_API_KEY no .env.local ou na Vercel — copie a API key correta do painel Royal Banking (Cash In / gateway) e reinicie o servidor.",
        },
        { status: upstream.status }
      );
    }

    const friendly = humanizePixGatewayError(data);
    if (friendly) {
      base.error = friendly;
    }

    return NextResponse.json(base, { status: upstream.status });
  }

  const obj =
    typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {};
  const normalized = extractPixGatewayPayload(obj);

  const idTx = normalized.idTransaction?.trim();
  if (idTx) {
    const amountCents =
      typeof body.amountCents === "number" && Number.isFinite(body.amountCents)
        ? Math.round(body.amountCents)
        : Math.round(amount * 100);
    const productSummary =
      typeof body.productSummary === "string" && body.productSummary.trim()
        ? body.productSummary.trim()
        : `${PRODUCT.name} · Pix`;
    const shippingSummary =
      typeof body.shippingSummary === "string" && body.shippingSummary.trim()
        ? body.shippingSummary.trim()
        : undefined;

    const ins = await insertPendingPixVenda({
      customerName: c.name.trim(),
      email: c.email.trim().toLowerCase(),
      phone: onlyDigits(c.telefone),
      amountCents,
      productSummary,
      idTransaction: idTx,
      shippingSummary,
    });
    if (!ins.ok) {
      console.warn("[pix/create] venda pendente não gravada:", ins.error);
    } else {
      const lead = await insertCheckoutLead({
        name: c.name.trim(),
        email: c.email.trim().toLowerCase(),
        phoneDigits: onlyDigits(c.telefone),
        productInterest: productSummary,
        source: "site",
        status: "em_contato",
      });
      if (!lead.ok) {
        console.warn("[pix/create] lead não gravado:", lead.error);
      }
    }
  }

  return NextResponse.json({
    ...obj,
    paymentCode: normalized.paymentCode,
    paymentCodeBase64: normalized.paymentCodeBase64,
    ...(normalized.idTransaction ? { idTransaction: normalized.idTransaction } : {}),
  });
}
