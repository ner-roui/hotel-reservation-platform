/* ── Step 1: Dates & Voyageurs ──────────────────────── */
import { useState } from "react";

import DateField from "./DateField";



/* ── Helpers ────────────────────────────────────────── */
function diffDays(a, b) {
  return Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000));
}
function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}


export default function StepDates({ dateIn, dateOut, voyageurs, notes, onChange }) {
  const nights = diffDays(dateIn, dateOut);
  return (
    <div style={{ animation: "fadeUp .4s ease both" }}>
      <h2 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>Dates & Voyageurs</h2>
      <p className="text-sm mb-6" style={{ color: "rgba(100,116,139,.7)" }}>Modifiez vos dates de séjour et le nombre de voyageurs.</p>
    
      {/* Dates */}
      <div className="flex gap-4 mb-5">
        <DateField label="Arrivée" value={dateIn} onChange={v => onChange("dateIn", v)} min="2026-01-01" />
        <DateField label="Départ"  value={dateOut} onChange={v => onChange("dateOut", v)} min={dateIn} />
      </div>

      {/* Duration pill */}
      <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl mb-5"
        style={{ background: "rgba(124,58,237,.08)", border: "1px solid rgba(124,58,237,.15)" }}>
        <span style={{ color: "#a78bfa", fontSize: 14 }}>🌙</span>
        <span className="text-sm font-semibold" style={{ color: "#c4b5fd" }}>{nights} nuit{nights > 1 ? "s" : ""}</span>
        <span style={{ color: "rgba(100,116,139,.5)", fontSize: 12 }}>·</span>
        <span className="text-xs" style={{ color: "rgba(100,116,139,.6)" }}>{formatDate(dateIn)} → {formatDate(dateOut)}</span>
      </div>

      {/* Voyageurs */}
      <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(148,163,184,.5)", fontSize: 9, letterSpacing: ".14em" }}>Nombre de voyageurs</label>
        <div className="flex items-center gap-3">
          <button onClick={() => onChange("voyageurs", Math.max(1, voyageurs - 1))}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-200"
            style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", color: "rgba(148,163,184,.8)" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(124,58,237,.15)"; e.currentTarget.style.borderColor="rgba(124,58,237,.4)"; e.currentTarget.style.color="#c4b5fd"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.05)"; e.currentTarget.style.borderColor="rgba(255,255,255,.09)"; e.currentTarget.style.color="rgba(148,163,184,.8)"; }}
          >−</button>
          <div className="flex-1 text-center py-2.5 rounded-xl" style={{ background: "rgba(124,58,237,.08)", border: "1px solid rgba(124,58,237,.2)" }}>
            <span className="text-xl font-bold" style={{ color: "#c4b5fd", fontFamily: "'Playfair Display',serif" }}>{voyageurs}</span>
            <span className="text-xs ml-2" style={{ color: "rgba(100,116,139,.6)" }}>voyageur{voyageurs > 1 ? "s" : ""}</span>
          </div>
          <button onClick={() => onChange("voyageurs", Math.min(6, voyageurs + 1))}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-200"
            style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", color: "rgba(148,163,184,.8)" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(124,58,237,.15)"; e.currentTarget.style.borderColor="rgba(124,58,237,.4)"; e.currentTarget.style.color="#c4b5fd"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.05)"; e.currentTarget.style.borderColor="rgba(255,255,255,.09)"; e.currentTarget.style.color="rgba(148,163,184,.8)"; }}
          >+</button>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(148,163,184,.5)", fontSize: 9, letterSpacing: ".14em" }}>Demandes spéciales (optionnel)</label>
        <textarea rows={3} value={notes} onChange={e => onChange("notes", e.target.value)}
          placeholder="Ex : chambre haute, lit bébé, arrivée tardive..."
          className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-200 resize-none"
          style={{ background: "rgba(255,255,255,.04)", border: "1.5px solid rgba(255,255,255,.09)", color: "#f8fafc" }}
          onFocus={e => { e.target.style.borderColor="rgba(124,58,237,.5)"; e.target.style.background="rgba(124,58,237,.06)"; }}
          onBlur={e => { e.target.style.borderColor="rgba(255,255,255,.09)"; e.target.style.background="rgba(255,255,255,.04)"; }}
        />
      </div>
    </div>
  );
}
