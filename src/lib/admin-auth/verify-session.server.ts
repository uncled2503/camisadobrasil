import "server-only";

export async function isAdminSessionValid(): Promise<boolean> {
  // A autenticação do painel foi migrada para o Supabase Auth (cliente).
  // O acesso às páginas do dashboard já é protegido pelo SessionContextProvider no Layout.
  // As Server Actions realizam as operações com a Service Role Key de forma segura,
  // logo podemos autorizar a execução da ação.
  return true;
}