type AdminErrorBannerProps = {
  /** Uma ou várias mensagens (ex.: falhas em paralelo no dashboard). */
  messages: string[];
  title?: string;
};

/**
 * Aviso de falha ao buscar dados — mantém o layout do painel legível.
 */
export function AdminErrorBanner({
  messages,
  title = "Não foi possível carregar parte dos dados",
}: AdminErrorBannerProps) {
  const list = messages.filter(Boolean);
  if (list.length === 0) return null;

  return (
    <div
      className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.08] px-4 py-3.5 text-sm text-amber-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:px-5"
      role="alert"
    >
      <p className="font-semibold text-amber-50">{title}</p>
      <ul className="mt-2 list-inside list-disc space-y-1 text-[13px] leading-relaxed text-amber-100/90">
        {list.map((msg) => (
          <li key={msg}>{msg}</li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-amber-200/70">
        Verifique variáveis de ambiente, políticas RLS e nomes das tabelas no Supabase.
      </p>
    </div>
  );
}
