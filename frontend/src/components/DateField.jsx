/* ── Date input ─────────────────────────────────────── */
import { useState } from "react";

export default function DateField({ label, value, onChange, min }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex-1">
      <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(148,163,184,.5)", fontSize: 9, letterSpacing: ".14em" }}>{label}</label>
      <input type="date" value={value} min={min} onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl py-3 px-4 text-sm transition-all duration-200 focus:outline-none"
        style={{
          background: focused ? "rgba(124,58,237,.08)" : "rgba(255,255,255,.04)",
          border: focused ? "1.5px solid rgba(124,58,237,.5)" : "1.5px solid rgba(255,255,255,.09)",
          color: "#f8fafc",
          boxShadow: focused ? "0 0 0 3px rgba(124,58,237,.1)" : "none",
          colorScheme: "dark",
        }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      />
    </div>
  );
}