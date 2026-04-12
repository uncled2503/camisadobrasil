"use client";

import { cn } from "@/lib/utils";

export type AdminSelectOption<T extends string> = {
  value: T;
  label: string;
};

type AdminFilterSelectProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: AdminSelectOption<T>[];
  id?: string;
  label: string;
  className?: string;
};

const chevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

/**
 * Select nativo estilizado para filtros de listagem (status, período, etc.).
 */
export function AdminFilterSelect<T extends string>({
  value,
  onChange,
  options,
  id = "admin-filter-select",
  label,
  className,
}: AdminFilterSelectProps<T>) {
  return (
    <div className={cn("w-full min-w-[200px]", className)}>
      <label htmlFor={id} className="admin-field-label">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(
          "admin-control cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat py-0 pr-10",
          "hover:border-white/[0.12]"
        )}
        style={{ backgroundImage: chevron }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
