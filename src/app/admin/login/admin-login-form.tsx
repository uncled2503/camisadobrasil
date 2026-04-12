"use client";

import { useActionState } from "react";

import { loginAdmin, type LoginActionState } from "./actions";

const initial: LoginActionState = { error: null };

type AdminLoginFormProps = {
  redirectTo: string;
  showConfigHint: boolean;
};

export function AdminLoginForm({ redirectTo, showConfigHint }: AdminLoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAdmin, initial);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">Alpha Admin</h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
          Entre com a senha do painel para continuar.
        </p>
      </div>

      {showConfigHint ? (
        <div
          className="rounded-xl border border-amber-500/30 bg-amber-500/[0.08] px-4 py-3 text-[13px] leading-relaxed text-amber-100/95"
          role="status"
        >
          Defina <code className="rounded bg-black/20 px-1 py-0.5 text-[12px]">ADMIN_PASSWORD</code> e{" "}
          <code className="rounded bg-black/20 px-1 py-0.5 text-[12px]">ADMIN_SESSION_SECRET</code> no ambiente do
          servidor (nunca no cliente). O segredo da sessão deve ter pelo menos 16 caracteres.
        </div>
      ) : null}

      {state.error ? (
        <div
          className="rounded-xl border border-red-500/30 bg-red-500/[0.08] px-4 py-3 text-[13px] text-red-100/95"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      <div>
        <label htmlFor="admin-login-password" className="admin-field-label">
          Senha
        </label>
        <input
          id="admin-login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="admin-control"
          disabled={pending}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex h-11 w-full items-center justify-center rounded-xl border border-gold/30 bg-gold/15 text-[13px] font-semibold text-gold-bright shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-colors hover:bg-gold/22 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
