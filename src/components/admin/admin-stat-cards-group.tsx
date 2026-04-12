import { cn } from "@/lib/utils";

type AdminStatCardsGroupProps = {
  children: React.ReactNode;
  className?: string;
  /** Número de colunas em telas grandes (padrão 4). */
  columns?: 2 | 3 | 4;
};

const colsClass: Record<NonNullable<AdminStatCardsGroupProps["columns"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 xl:grid-cols-3",
  4: "sm:grid-cols-2 xl:grid-cols-4",
};

/**
 * Grade responsiva para `AdminStatCard` — reutilizável no dashboard e em páginas de detalhe.
 */
export function AdminStatCardsGroup({ children, className, columns = 4 }: AdminStatCardsGroupProps) {
  return <div className={cn("grid gap-4 sm:gap-5", colsClass[columns], className)}>{children}</div>;
}
