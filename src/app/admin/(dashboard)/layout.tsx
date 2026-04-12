import { AdminShell } from "@/components/admin";

/**
 * Shell (sidebar, top bar) apenas para rotas autenticadas do painel.
 * A rota `/admin/login` fica fora deste layout — ver `app/admin/layout.tsx`.
 */
export default function AdminDashboardShellLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
