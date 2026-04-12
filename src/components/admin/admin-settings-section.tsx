import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminSettingsSectionProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
};

export const adminSettingsInputClass = cn(
  "admin-control placeholder:text-muted-foreground/50 read-only:cursor-default"
);

export const AdminSettingsFieldLabel = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="admin-field-label normal-case tracking-normal">
    {children}
  </label>
);

/**
 * Card de seção para telas de configuração — mesmo vocabulário visual do restante do /admin.
 */
export function AdminSettingsSection({ title, description, icon: Icon, children, className }: AdminSettingsSectionProps) {
  return (
    <section className={cn("admin-settings-surface", className)}>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        {Icon ? (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/[0.12] text-gold ring-1 ring-gold/15">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">{title}</h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
              {description}
            </p>
          ) : null}
          <div className="mt-7 space-y-6">{children}</div>
        </div>
      </div>
    </section>
  );
}
