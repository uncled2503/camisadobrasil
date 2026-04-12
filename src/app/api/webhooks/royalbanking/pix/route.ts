import { NextResponse } from "next/server";

import { parseRoyalBankingPixWebhook } from "@/lib/royalbanking-webhook-parse";
import { markPixGatewayPaymentPaid } from "@/lib/supabase/pix-payment-store";
import { markPixVendaPaidByGatewayId } from "@/lib/supabase/pending-venda-pix";

/**
 * Cash In — URL em `callbackUrl` na criação do Pix.
 * Royal Banking reenvia até 3× se não receber HTTP 200; corpo JSON `200` conforme manual.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.info("[royalbanking webhook pix]", JSON.stringify(payload));

    const { idTransaction, paid } = parseRoyalBankingPixWebhook(payload);
    if (paid && idTransaction) {
      const pixR = await markPixGatewayPaymentPaid(idTransaction, payload);
      if (!pixR.ok) {
        console.warn("[royalbanking webhook pix] pix_gateway_payments:", pixR.error);
      }

      const vendaR = await markPixVendaPaidByGatewayId(idTransaction);
      if (!vendaR.ok) {
        console.warn("[royalbanking webhook pix] vendas:", vendaR.error);
      } else if (vendaR.updated > 0) {
        console.info("[royalbanking webhook pix] venda(s) marcada(s) como paga:", vendaR.updated);
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
