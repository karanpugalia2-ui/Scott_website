"use client";

import type { ReactNode } from "react";

export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="block text-[10px] tracking-[0.2em] uppercase text-[#666] mb-1.5">
      {children}
    </span>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#ededed] focus:border-[#c8ff00]/50 focus:outline-none transition-colors ${
          mono ? "font-mono text-xs" : ""
        }`}
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  mono,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  mono?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#ededed] focus:border-[#c8ff00]/50 focus:outline-none transition-colors resize-y ${
          mono ? "font-mono text-xs leading-relaxed" : ""
        }`}
      />
      {hint && <p className="text-[10px] text-[#555] mt-1">{hint}</p>}
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#ededed] focus:border-[#c8ff00]/50 focus:outline-none transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[#c8ff00] w-4 h-4"
      />
      <span className="text-sm text-[#ccc]">{label}</span>
    </label>
  );
}

export function Btn({
  children,
  onClick,
  variant = "ghost",
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-[#c8ff00] text-[#0a0a0a] hover:bg-[#d4ff33] font-semibold"
      : variant === "danger"
      ? "border border-red-500/30 text-red-400 hover:bg-red-500/10"
      : "border border-white/10 text-[#ccc] hover:border-[#c8ff00]/40 hover:text-[#c8ff00]";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-lg text-xs tracking-wide transition-colors disabled:opacity-40 disabled:pointer-events-none ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Section({
  title,
  children,
  right,
}: {
  title: string;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <details open className="group border border-white/10 rounded-xl bg-[#0c0c0c] overflow-hidden">
      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-white/[0.02]">
        <span className="text-sm font-semibold text-[#ededed] tracking-tight">
          {title}
        </span>
        <div className="flex items-center gap-3" onClick={(e) => e.preventDefault()}>
          {right}
          <span className="text-[#555] group-open:rotate-180 transition-transform">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </summary>
      <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
        {children}
      </div>
    </details>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <p className="text-[#555] text-xs tracking-wide py-6 text-center">
      {text}
    </p>
  );
}
