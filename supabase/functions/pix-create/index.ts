import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Gera o código de rastreio
function generateMockTrackingCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const num4 = Math.floor(1000 + Math.random() * 9000).toString();
  const char = letters.charAt(Math.floor(Math.random() * letters.length));
  const num3 = Math.floor(100 + Math.random() * 900).toString();
  return `BR${num4}${char}${num3}BR`;
}

serve(async (req) => {
  // Trata o preflight CORS que os navegadores enviam
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("[pix-create] Iniciando requisição...");
    const body = await req.json();
    const { amount, amountCents, productSummary, shippingSummary, client } = body;

    // Busca a chave diretamente dos SECRETS do Supabase
    const apiKey = Deno.env.get("ROYALBANKING_API_KEY");
    if (!apiKey) {
      console.error("[pix-create] ROYALBANKING_API_KEY não encontrada nos secrets.");
      return new Response(JSON.stringify({ error: "API Key da gateway não configurada nos Secrets do Supabase." }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // O Webhook agora aponta para a Edge Function de webhook que vamos criar
    const callbackUrl = "https://ulrigywayovxuyiktnlr.supabase.co/functions/v1/pix-webhook";
    const trackingCode = generateMockTrackingCode();
    const leadId = crypto.randomUUID();

    console.log("[pix-create] Chamando Royal Banking API...");
    const upstream = await fetch("https://api.royalbanking.com.br/v1/gateway/", {
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
    
    if (!upstream.ok) {
      console.error("[pix-create] Erro na gateway:", data);
      return new Response(JSON.stringify(data), { 
        status: upstream.status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Extrai dados da resposta
    const paymentCode = String(data.paymentCode ?? data.payment_code ?? data.copyPaste ?? data.emv ?? "").trim();
    const rawB64 = data.paymentCodeBase64 ?? data.payment_code_base64 ?? data.qrCodeBase64 ?? data.qrcode;
    const paymentCodeBase64 = rawB64 == null ? "" : String(rawB64).trim().replace(/\s/g, "");
    const idTxRaw = data.idTransaction ?? data.id_transaction ?? data.transactionId;
    const idTransaction = idTxRaw == null ? undefined : String(idTxRaw);

    if (idTransaction) {
      console.log(`[pix-create] Inserindo dados no banco (tx: ${idTransaction})...`);
      
      // As variáveis abaixo existem de forma nativa e automática em todas as Edge Functions
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Insere Lead
      await supabase.from("leads").insert({
        id: leadId,
        nome: client.name.trim(),
        email: client.email.trim().toLowerCase(),
        telefone: client.telefone.replace(/\D/g, ""),
        produto_interesse: productSummary || "Camisa do Brasil",
        status: "em_contato",
        cpf: client.document.replace(/\D/g, ""),
        codigo_rastreio: trackingCode
      });

      // Insere Venda Pendente
      const base = `${productSummary} · Pix`;
      const line = shippingSummary ? `${base} · Entrega: ${shippingSummary}` : base;
      
      await supabase.from("vendas").insert({
        id: crypto.randomUUID(),
        lead_id: leadId,
        cliente_nome: client.name,
        produto: line,
        valor: amountCents || Math.round(amount * 100),
        status_pagamento: "pendente",
        pedido_codigo: idTransaction,
      });
    }

    console.log("[pix-create] Sucesso!");
    return new Response(JSON.stringify({ paymentCode, paymentCodeBase64, idTransaction, trackingCode }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error("[pix-create] Erro interno:", err);
    return new Response(JSON.stringify({ error: "Erro interno ao gerar Pix" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})