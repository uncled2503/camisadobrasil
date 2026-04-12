"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminSearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  label: string;
  className?: string;
};

/**
 * Campo de busca do painel — reutilizável em vendas, clientes, etc.
 */
export function AdminSearchField({
  value,
  onChange,
  placeholder = "Buscar…",
  id = "admin-search",
  label,
  className,
}: AdminSearchFieldProps) {
  return (
    <div className={cn("w-full min-w-0", className)}>
      <label htmlFor={id} className="admin-field-label">
        {label}
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-muted-foreground/65"
          aria-hidden
        />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="admin-control pl-11 pr-3.5"
        />
      </div>
    </div>
  );
}
