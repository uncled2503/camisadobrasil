import type { Metadata } from "next";

/**
 * Layout raiz de `/admin`: metadados e modo dinâmico compartilhados.
 * O chrome do painel (sidebar) está em `(dashboard)/layout.tsx` para não envolver o login.
 */
export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Alpha Admin" },
  description: "Área administrativa Alpha Brasil",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
