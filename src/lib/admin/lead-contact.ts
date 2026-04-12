/** Links de contato rápido a partir dos dados do lead (Brasil: DDI 55 quando faltando). */

export function leadWhatsAppHref(phone: string): string | null {
  const d = phone.replace(/\D/g, "");
  if (d.length < 10) return null;
  const withCountry = d.length <= 11 ? `55${d}` : d;
  return `https://wa.me/${withCountry}`;
}

export function leadTelHref(phone: string): string | null {
  const d = phone.replace(/\D/g, "");
  if (d.length < 10) return null;
  return `tel:+${d.length <= 11 ? `55${d}` : d}`;
}

export function leadMailtoHref(email: string): string | null {
  const e = email.trim();
  if (!e || !e.includes("@")) return null;
  return `mailto:${encodeURIComponent(e)}`;
}
