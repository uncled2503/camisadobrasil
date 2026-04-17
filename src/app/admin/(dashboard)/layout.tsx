"use client";

import { AdminShell } from "@/components/admin";
import { useSession } from "@/components/auth/SessionContextProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminDashboardShellLayout({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/admin/login');
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return (
      <div className="admin-shell-bg flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!session) return null;

  return <AdminShell>{children}</AdminShell>;
}