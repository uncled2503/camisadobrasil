import { NextResponse } from "next/server";

import { PRODUCT } from "@/lib/product";
import { insertPendingCardVenda } from "@/lib/supabase/pending-venda-card";

const FORBIDDEN_BODY_KEYS = new Set(
  ["cvv", "cardcvv", "card_cvv", "cvc", "cardnumber", "card_number", "pan", "full_card", "numero_cartao"].map((k) =>
    k.toLowerCase()
  )
);

function badKeys(body: Record<string, unknown>): string[] {
  return Object.keys(body).filter((k) => FORBIDDEN_BODY_KEYS.has(k.toLowerCase()));
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/** MM/AA com dígitos */
function validExpiry(s: string): boolean {
  return /^\d{2}\/\d{2}$/.test(s);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const forbidden = badKeys(body);
  if (forbidden.length > 0) {
    return NextResponse.json(
      {
        error:
          "Não envie número completo do cartão nem CVV. O servidor só aceita últimos 4 dígitos e dados não sensíveis.",
      },
      { status: 400 }
    );
  }

  const name = isNonEmptyString(body.name) ? body.name.trim() : "";
  const email = isNonEmptyString(body.email) ? body.email.trim().toLowerCase() : "";
  const confirmEmail = isNonEmptyString(body.confirmEmail) ? body.confirmEmail.trim().toLowerCase() : "";
  const phone = isNonEmptyString(body.phone) ? body.phone.trim() : "";
  const cpf = isNonEmptyString(body.cpf) ? body.cpf.trim() : "";
  const cardLast4 = isNonEmptyString(body.cardLast4) ? body.cardLast4.trim() : "";
  const cardExpiry = isNonEmptyString(body.cardExpiry) ? body.cardExpiry.trim() : "";
  const cardholderName = isNonEmptyString(body.cardholderName) ? body.cardholderName.trim() : "";
  const amountCents = typeof body.amountCents === "number" && Number.isFinite(body.amountCents) ? Math.round(body.amountCents) : NaN;
  const quantity = typeof body.quantity === "number" && body.quantity > 0 ? Math.floor(body.quantity) : 1;

  if (!name || !email || !phone || !cpf) {
    return NextResponse.json({ error: "Preencha nome, e-mail, telefone e CPF/CNPJ." }, { status: 400 });
  }
  if (email !== confirmEmail) {
    return NextResponse.json({ error: "Os e-mails não coincidem." }, { status: 400 });
  }
  const docDigits = cpf.replace(/\D/g, "");
  if (docDigits.length !== 11 && docDigits.length !== 14) {
    return NextResponse.json({ error: "CPF ou CNPJ inválido." }, { status: 400 });
  }
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    return NextResponse.json({ error: "Telefone inválido." }, { status: 400 });
  }
  if (!/^\d{4}$/.test(cardLast4)) {
    return NextResponse.json({ error: "Informe apenas os últimos 4 dígitos do cartão (validação no servidor)." }, { status: 400 });
  }
  if (!validExpiry(cardExpiry)) {
    return NextResponse.json({ error: "Validade inválida (use MM/AA)." }, { status: 400 });
  }
  if (!cardholderName) {
    return NextResponse.json({ error: "Informe o nome no cartão." }, { status: 400 });
  }
  if (!Number.isFinite(amountCents) || amountCents < 100 || amountCents > 50_000_000) {
    return NextResponse.json({ error: "Valor do pedido inválido." }, { status: 400 });
  }

  const productSummary = `${PRODUCT.name} (${quantity} un.)`;

  const result = await insertPendingCardVenda({
    customerName: name,
    email,
    phone: phoneDigits,
    amountCents,
    productSummary,
    cardLast4,
    cardExpiry,
    cardholderName,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id: result.id });
}
