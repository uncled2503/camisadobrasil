type AdminSectionTitleProps = {
  title: string;
  subtitle?: string;
  /** Conteúdo à direita (ex.: filtros) — opcional. */
  action?: React.ReactNode;
};

export function AdminSectionTitle({ title, subtitle, action }: AdminSectionTitleProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h2 className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">{title}</h2>
        {subtitle ? (
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
