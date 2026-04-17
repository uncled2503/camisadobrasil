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
import { generateMockTrackingCode } from "@/lib/tracking-utils";

const GATEWAY_URL = "https://api.royalbanking.com.br/v1/gateway/";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ROYALBANKING_API_KEY;
    const callbackUrl = process.env.ROYALBANKING_PIX_CALLBACK_URL || process.env.VERCEL_URL;

    if (!apiKey) return NextResponse.json({ error: "API Key não configurada." }, { status: 503 });

    const body = await request.json();
    const { amount, client } = body;

    if (isPixAmountBelowGatewayMin(amount)) {
      return NextResponse.json({ error: `Mínimo ${formatRoyalBankingMinPixAmountPt()}` }, { status: 400 });
    }

    const trackingCode = generateMockTrackingCode();

    const upstream = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "api-key": apiKey,
        amount,
        client: {
          name: client.name,
          document: client.document.replace(/\D/g, ""),
          telefone: client.telefone.replace(/\D/g, ""),
          email: client.email,
        },
        callbackUrl,
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) return NextResponse.json(data, { status: upstream.status });

    const normalized = extractPixGatewayPayload(data);
    const idTx = normalized.idTransaction;

    if (idTx) {
      await insertPendingPixVenda({
        customerName: client.name,
        email: client.email,
        phone: client.telefone,
        amountCents: body.amountCents || Math.round(amount * 100),
        productSummary: body.productSummary || PRODUCT.name,
        idTransaction: idTx,
        codigoRastreio: trackingCode,
        shippingSummary: body.shippingSummary,
      });

      await insertCheckoutLead({
        name: client.name,
        email: client.email,
        phoneDigits: client.telefone,
        productInterest: body.productSummary || PRODUCT.name,
        status: "em_contato",
        codigoRastreio: trackingCode,
        cpf: client.document.replace(/\D/g, ""), // Salva o CPF no Lead também
      });
    }

    return NextResponse.json({ ...normalized, trackingCode });
  } catch (e) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}