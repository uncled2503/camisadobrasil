import { AdminPage } from "./admin-page";
import { cn } from "@/lib/utils";

type Variant = "dashboard" | "list" | "clients" | "settings";

type AdminLoadingShellProps = {
  title: string;
  description?: string;
  variant?: Variant;
};

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-white/[0.06]", className)} />;
}

/** Fallback interno para `<Suspense>` (sem repetir o cabeçalho da página). */
export function AdminDashboardSkeletonBlocks() {
  return (
    <div className="space-y-10 animate-pulse sm:space-y-12">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <PulseBlock className="h-[7.5rem]" />
        <PulseBlock className="h-[7.5rem]" />
        <PulseBlock className="h-[7.5rem]" />
        <PulseBlock className="h-[7.5rem]" />
      </div>
      <PulseBlock className="h-[22rem] sm:h-[24rem]" />
      <PulseBlock className="h-56" />
      <PulseBlock className="h-56" />
    </div>
  );
}

export function AdminListPageSkeletonBlocks() {
  return (
    <div className="animate-pulse space-y-7 sm:space-y-8">
      <PulseBlock className="h-[7.5rem] sm:h-28" />
      <PulseBlock className="min-h-[16rem]" />
    </div>
  );
}

export function AdminClientsSkeletonBlocks() {
  return (
    <div className="animate-pulse space-y-10 sm:space-y-11">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <PulseBlock className="h-[7.5rem]" />
        <PulseBlock className="h-[7.5rem]" />
        <PulseBlock className="h-[7.5rem]" />
        <PulseBlock className="h-[7.5rem]" />
      </div>
      <PulseBlock className="min-h-[18rem]" />
    </div>
  );
}

export function AdminLoadingShell({
  title,
  description = "Carregando dados do Supabase…",
  variant = "list",
}: AdminLoadingShellProps) {
  return (
    <AdminPage title={title} description={description}>
      {variant === "dashboard" ? <AdminDashboardSkeletonBlocks /> : null}
      {variant === "list" ? <AdminListPageSkeletonBlocks /> : null}
      {variant === "clients" ? <AdminClientsSkeletonBlocks /> : null}

      {variant === "settings" ? (
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <PulseBlock className="h-14" />
          <PulseBlock className="h-64" />
          <PulseBlock className="h-64" />
        </div>
      ) : null}
    </AdminPage>
  );
}
