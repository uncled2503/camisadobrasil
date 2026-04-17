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
    const leadId = crypto.randomUUID();

    // ====== MODO MOCK PARA TESTES SEM API KEY ======
    if (!apiKey) {
      console.warn("[API Pix] ROYALBANKING_API_KEY não encontrada. Usando MODO MOCK.");
      const mockId = `mock_${crypto.randomUUID().split("-")[0]}`;
      
      await insertCheckoutLead({
        id: leadId,
        name: client.name,
        email: client.email,
        phoneDigits: client.telefone,
        productInterest: body.productSummary || PRODUCT.name,
        status: "em_contato",
        cpf: client.document.replace(/\D/g, ""),
      });

      await insertPendingPixVenda({
        leadId,
        customerName: client.name,
        amountCents: body.amountCents || Math.round(amount * 100),
        productSummary: body.productSummary || PRODUCT.name,
        idTransaction: mockId,
        shippingSummary: body.shippingSummary,
      });

      // Aprova o pagamento automaticamente 4 segundos depois
      setTimeout(async () => {
        console.info(`[Mock] Aprovando Pix automaticamente: ${mockId}`);
        await markPixGatewayPaymentPaid(mockId, { mock: true });
        await markPixVendaPaidByGatewayId(mockId);
      }, 4000);

      // QR Code em PNG puro (imagem pequena e limpa válida) para evitar bloqueios e ícone quebrado
      const mockQrBase64 = "iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAIRJREFUGNNjYMANWBoYEEw1yhhE/29g+P+fgfk/A8P/Awz/8zP8z87AkMHAwJDGwNDAwMDBwMAAB0zIgA2MWAE+MGIyMBxgYAhmYDjBwHCdgWE5A8NGBoZ1DAwbGBi2MTAcYGBYxsBwmIFhFwPDLQYGFwYGdwYGHwYGFwYGHwYGdwYGFwZ8AABjHSl+d26GwgAAAABJRU5ErkJggg==";

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
      await insertCheckoutLead({
        id: leadId,
        name: client.name,
        email: client.email,
        phoneDigits: client.telefone,
        productInterest: body.productSummary || PRODUCT.name,
        status: "em_contato",
        cpf: client.document.replace(/\D/g, ""), 
      });
      
      await insertPendingPixVenda({
        leadId,
        customerName: client.name,
        amountCents: body.amountCents || Math.round(amount * 100),
        productSummary: body.productSummary || PRODUCT.name,
        idTransaction: idTx,
        shippingSummary: body.shippingSummary,
      });
    }

    return NextResponse.json({ ...normalized, trackingCode });
  } catch (e) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}