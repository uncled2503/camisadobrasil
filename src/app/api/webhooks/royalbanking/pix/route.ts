import { NextResponse } from "next/server";

import { parseRoyalBankingPixWebhook } from "@/lib/royalbanking-webhook-parse";
import { markPixGatewayPaymentPaid, markPixGatewayPaymentFailed } from "@/lib/supabase/pix-payment-store";
import { markPixVendaPaidByGatewayId, markPixVendaCanceledByGatewayId } from "@/lib/supabase/pending-venda-pix";

/**
 * Cash In — URL em `callbackUrl` na criação do Pix.
 * Royal Banking reenvia até 3× se não receber HTTP 200; corpo JSON `200` conforme manual.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.info("[royalbanking webhook pix]", JSON.stringify(payload));

    const { idTransaction, paid, failed } = parseRoyalBankingPixWebhook(payload);
    
    if (idTransaction) {
      if (paid) {
        // Fluxo de SUCESSO
        const pixR = await markPixGatewayPaymentPaid(idTransaction, payload);
        if (!pixR.ok) {
          console.warn("[royalbanking webhook pix] pix_gateway_payments (paid):", pixR.error);
        }

        const vendaR = await markPixVendaPaidByGatewayId(idTransaction);
        if (!vendaR.ok) {
          console.warn("[royalbanking webhook pix] vendas (paid):", vendaR.error);
        } else if (vendaR.updated > 0) {
          console.info("[royalbanking webhook pix] venda(s) marcada(s) como paga:", vendaR.updated);
        }
      } else if (failed) {
        // Fluxo de FALHA / CANCELAMENTO
        const pixR = await markPixGatewayPaymentFailed(idTransaction, payload);
        if (!pixR.ok) {
          console.warn("[royalbanking webhook pix] pix_gateway_payments (failed):", pixR.error);
        }

        const vendaR = await markPixVendaCanceledByGatewayId(idTransaction);
        if (!vendaR.ok) {
          console.warn("[royalbanking webhook pix] vendas (canceled):", vendaR.error);
        } else if (vendaR.updated > 0) {
          console.info("[royalbanking webhook pix] venda(s) marcada(s) como cancelada:", vendaR.updated);
        }
      }
    }
  } catch {
    /* corpo vazio ou não-JSON — ainda respondemos 200 para evitar reenvios infinitos */
  }

  return new NextResponse(JSON.stringify(200), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}