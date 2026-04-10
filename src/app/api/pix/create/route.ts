import { NextResponse } from "next/server";
import { extractPixGatewayPayload } from "@/lib/pix-gateway-response";

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
};

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

function webhookPath() {
  return "/api/webhooks/royalbanking/pix";
}

/**
 * URL pública do webhook (Cash In).
 * SITE_URL / APP_URL são lidos em runtime (definir na Vercel sem prefixo NEXT_PUBLIC).
 * NEXT_PUBLIC_APP_URL só entra num novo build depois de definida no painel.
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
          "URL do webhook não definida. Na Vercel: SITE_URL ou NEXT_PUBLIC_APP_URL = https://camisa-brasil-landing.vercel.app (ou ROYALBANKING_PIX_CALLBACK_URL completo). Faça Redeploy após alterar variáveis.",
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
    return NextResponse.json(data, { status: upstream.status });
  }

  const obj =
    typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {};
  const normalized = extractPixGatewayPayload(obj);

  return NextResponse.json({
    ...obj,
    paymentCode: normalized.paymentCode,
    paymentCodeBase64: normalized.paymentCodeBase64,
    ...(normalized.idTransaction ? { idTransaction: normalized.idTransaction } : {}),
  });
}
