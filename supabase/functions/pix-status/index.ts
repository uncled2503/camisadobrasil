import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url);
    const transactionId = url.searchParams.get("transactionId")?.trim();

    if (!transactionId) {
      console.error("[pix-status] Faltou transactionId");
      return new Response(JSON.stringify({ error: "transactionId ausente" }), { 
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("pix_gateway_payments")
      .select("status")
      .eq("id_transaction", transactionId)
      .maybeSingle();

    if (error) {
      console.error("[pix-status] Erro DB:", error);
      return new Response(JSON.stringify({ paid: false, trackingAvailable: true }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const paid = data?.status === "paid";
    console.log(`[pix-status] Tx ${transactionId} -> paid: ${paid}`);
    
    return new Response(JSON.stringify({ paid, trackingAvailable: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error("[pix-status] Erro:", err);
    return new Response(JSON.stringify({ paid: false, trackingAvailable: false }), { 
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
})