"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopBar } from "@/components/admin/admin-top-bar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="admin-shell-bg">
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-[#03050a]/75 backdrop-blur-md transition-opacity md:hidden"
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <AdminSidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />

      <div className="flex min-h-[100dvh] flex-col md:pl-[17rem]">
        <AdminTopBar mobileMenuOpen={mobileOpen} onMenuOpen={() => setMobileOpen(true)} />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
