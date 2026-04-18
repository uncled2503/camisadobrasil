"use client";

import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/types/admin";

const chevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

const OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "em_contato", label: "Em contato" },
  { value: "convertido", label: "Convertido" },
  { value: "perdido", label: "Perdido" },
];

type AdminLeadStatusSelectProps = {
  leadId: string;
  value: LeadStatus;
  disabled?: boolean;
  onChange: (next: LeadStatus) => void | Promise<void>;
};

export function AdminLeadStatusSelect({ leadId, value, disabled, onChange }: AdminLeadStatusSelectProps) {
  return (
    <select
      id={`lead-status-${leadId}`}
      aria-label="Alterar status do lead"
      value={value}
      disabled={disabled}
      onChange={(e) => void onChange(e.target.value as LeadStatus)}
      className={cn(
        "admin-control h-9 min-w-[9.5rem] max-w-[11rem] cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.5rem_center] bg-no-repeat py-0 pl-2.5 pr-9 text-[13px]",
        "hover:border-white/[0.12]",
        disabled && "cursor-wait opacity-60"
      )}
      style={{ backgroundImage: chevron }}
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[#060910] text-foreground">
          {opt.label}
        </option>
      ))}
    </select>
  );
}