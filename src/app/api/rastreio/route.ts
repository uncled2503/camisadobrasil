import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { generateTimeline } from "@/lib/tracking-utils";
import { mapLeadRow } from "@/lib/supabase/mappers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code")?.trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ error: "Código de rastreio não fornecido." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Serviço indisponível no momento." }, { status: 500 });
  }

  try {
    // Procura no Supabase para saber para onde a encomenda vai
    const { data: leadData } = await admin
      .from("leads")
      .select("*")
      .eq("codigo_rastreio", code)
      .maybeSingle();

    let destCity = "Rio de Janeiro";
    let destState = "RJ";
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 3); // Valor padrão se não existir: há 3 dias

    if (leadData) {
      const lead = mapLeadRow(leadData);
      if (lead.city) destCity = lead.city;
      if (lead.state) destState = lead.state;
      if (lead.createdAt) startDate = new Date(lead.createdAt);
    }

    // Gera o itinerário temporal realista
    const timeline = generateTimeline(code, destCity, destState, startDate.toISOString());

    return NextResponse.json({
      code,
      destCity,
      destState,
      timeline
    });

  } catch (error) {
    return NextResponse.json({ error: "Erro ao consultar rastreio." }, { status: 500 });
  }
}