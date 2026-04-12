import type { Client } from "@/types/admin";

export type ClientSortOption =
  | "last_purchase_desc"
  | "last_purchase_asc"
  | "spent_desc"
  | "spent_asc";

export const DEFAULT_CLIENTS_PAGE_SIZE = 8;

function normalize(s: string) {
  return s.trim().toLowerCase();
}

/** Busca por nome, e-mail ou telefone (painel de clientes). */
export function clientMatchesContactSearch(client: Client, rawQuery: string): boolean {
  const q = normalize(rawQuery);
  if (!q) return true;
  const haystack = [client.name, client.email, client.phone].join(" ").toLowerCase();
  return haystack.includes(q);
}

export function filterClientsBySearch(clients: Client[], search: string): Client[] {
  return clients.filter((c) => clientMatchesContactSearch(c, search));
}

export function sortClientsList(clients: Client[], sort: ClientSortOption): Client[] {
  const copy = [...clients];
  switch (sort) {
    case "last_purchase_desc":
      return copy.sort((a, b) => new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime());
    case "last_purchase_asc":
      return copy.sort((a, b) => new Date(a.lastOrderAt).getTime() - new Date(b.lastOrderAt).getTime());
    case "spent_desc":
      return copy.sort((a, b) => b.lifetimeCents - a.lifetimeCents);
    case "spent_asc":
      return copy.sort((a, b) => a.lifetimeCents - b.lifetimeCents);
    default:
      return copy;
  }
}
