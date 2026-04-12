"use client";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
};

/**
 * Cabeçalho da página dentro da área principal (abaixo do top bar global).
 */
export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="shrink-0 border-b border-white/[0.07] bg-[#060910]/40 backdrop-blur-sm">
      <div className="admin-content-container px-4 pb-8 pt-7 sm:px-6 sm:pb-9 sm:pt-8 lg:px-8 lg:pb-10 lg:pt-9">
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-[1.65rem] sm:leading-tight lg:text-[1.75rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px] sm:leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
