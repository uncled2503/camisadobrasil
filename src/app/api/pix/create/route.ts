import { NextResponse } from "next/server";
import {
  extractPixGatewayPayload,
  formatRoyalBankingMinPixAmountPt,
  humanizePixGatewayError,
  isPixAmountBelowGatewayMin,
} from "@/lib/pix-gateway-response";
import { PRODUCT } from "@/lib/product";
import { insertCheckoutLead } from "@/lib/supabase/insert-lead-from-checkout";
import { insertPendingPixVenda, markPixVendaPaidByGatewayId } from "@/lib/supabase/pending-venda-pix";
import { markPixGatewayPaymentPaid } from "@/lib/supabase/pix-payment-store";
import { generateMockTrackingCode } from "@/lib/tracking-utils";

const GATEWAY_URL = "https://api.royalbanking.com.br/v1/gateway/";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ROYALBANKING_API_KEY;
    const callbackUrl = process.env.ROYALBANKING_PIX_CALLBACK_URL || process.env.VERCEL_URL;

    const body = await request.json();
    const { amount, client } = body;

    if (isPixAmountBelowGatewayMin(amount)) {
      return NextResponse.json({ error: `Mínimo ${formatRoyalBankingMinPixAmountPt()}` }, { status: 400 });
    }

    const trackingCode = generateMockTrackingCode();

    // ====== MODO MOCK PARA TESTES SEM API KEY ======
    if (!apiKey) {
      console.warn("[API Pix] ROYALBANKING_API_KEY não encontrada. Usando MODO MOCK.");
      const mockId = `mock_${crypto.randomUUID().split("-")[0]}`;
      
      await insertPendingPixVenda({
        customerName: client.name,
        email: client.email,
        phone: client.telefone,
        amountCents: body.amountCents || Math.round(amount * 100),
        productSummary: body.productSummary || PRODUCT.name,
        idTransaction: mockId,
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
        cpf: client.document.replace(/\D/g, ""),
      });

      // Aprova o pagamento automaticamente 4 segundos depois para simular o Webhook
      setTimeout(async () => {
        console.info(`[Mock] Aprovando Pix automaticamente: ${mockId}`);
        await markPixGatewayPaymentPaid(mockId, { mock: true });
        await markPixVendaPaidByGatewayId(mockId);
      }, 4000);

      // Imagem SVG Base64 de Placeholder (Evita a imagem quebrada)
      const mockQrBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzAwMCI+TU9DSyBRUjwvdGV4dD48L3N2Zz4=";

      return NextResponse.json({
        paymentCode: "00020101021126580014br.gov.bcb.pix0136mock@pix.com.br52040000530398654041.505802BR5909MOCK TEST6009SAO PAULO62070503***6304FC71",
        paymentCodeBase64: mockQrBase64,
        idTransaction: mockId,
        trackingCode
      });
    }
    // ===============================================

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
        cpf: client.document.replace(/\D/g, ""), 
      });
    }

    return NextResponse.json({ ...normalized, trackingCode });
  } catch (e) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}