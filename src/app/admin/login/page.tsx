"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  return (
    <div className="admin-shell-bg flex min-h-[100dvh] items-center justify-center px-4 py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="admin-settings-surface w-full max-w-md p-8"
      >
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">Alpha Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Aceda à gestão da sua loja
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          providers={[]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#D4AF37',
                  brandAccent: '#C5A028',
                  inputBackground: 'rgba(255, 255, 255, 0.04)',
                  inputText: 'white',
                  inputPlaceholder: 'rgba(255, 255, 255, 0.4)',
                  inputBorder: 'rgba(255, 255, 255, 0.1)',
                }
              }
            },
            className: {
              container: 'auth-container',
              button: 'auth-button',
              input: 'admin-control',
              label: 'admin-field-label',
            }
          }}
          theme="dark"
          localization={{
            variables: {
              sign_in: {
                email_label: 'E-mail',
                password_label: 'Senha',
                button_label: 'Entrar',
                loading_button_label: 'A entrar...',
                link_text: 'Já tem uma conta? Entre',
              },
              sign_up: {
                email_label: 'E-mail',
                password_label: 'Crie uma senha',
                button_label: 'Criar conta',
                loading_button_label: 'A criar conta...',
                link_text: 'Não tem uma conta? Registe-se',
              }
            }
          }}
        />
      </motion.div>
    </div>
  );
}