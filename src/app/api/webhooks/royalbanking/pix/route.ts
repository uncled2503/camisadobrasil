import { NextResponse } from "next/server";

import { parseRoyalBankingPixWebhook } from "@/lib/royalbanking-webhook-parse";
import { markPixGatewayPaymentPaid, markPixGatewayPaymentFailed } from "@/lib/supabase/pix-payment-store";
import { markPixVendaPaidByGatewayId, markPixVendaCanceledByGatewayId } from "@/lib/supabase/pending-venda-pix";
import { markLeadConvertedById } from "@/lib/supabase/lead-mutations";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.info("[royalbanking webhook pix]", JSON.stringify(payload));

    const { idTransaction, paid, failed } = parseRoyalBankingPixWebhook(payload);
    
    if (idTransaction) {
      if (paid) {
        // Fluxo de SUCESSO
        const pixR = await markPixGatewayPaymentPaid(idTransaction, payload);
        if (!pixR.ok) console.warn("[webhook pix] pix_gateway_payments (paid):", pixR.error);

        const vendaR = await markPixVendaPaidByGatewayId(idTransaction);
        if (!vendaR.ok) {
          console.warn("[webhook pix] vendas (paid):", vendaR.error);
        } else if (vendaR.updated > 0) {
          console.info("[webhook pix] venda(s) marcada(s) como paga:", vendaR.updated);
          
          // Se recebemos a ligação ao lead da venda, o webhook também atualiza o lead
          if (vendaR.leadId) {
            const leadR = await markLeadConvertedById(vendaR.leadId);
            if (!leadR.ok) console.warn("[webhook pix] falha ao converter lead:", leadR.error);
            else console.info(`[webhook pix] lead atualizado para convertido.`);
          }
        }
      } else if (failed) {
        // Fluxo de FALHA / CANCELAMENTO
        const pixR = await markPixGatewayPaymentFailed(idTransaction, payload);
        if (!pixR.ok) console.warn("[webhook pix] pix_gateway_payments (failed):", pixR.error);

        const vendaR = await markPixVendaCanceledByGatewayId(idTransaction);
        if (!vendaR.ok) console.warn("[webhook pix] vendas (canceled):", vendaR.error);
      }
    }
  } catch {
    /* erro silencioso */
  }

  return new NextResponse(JSON.stringify(200), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}