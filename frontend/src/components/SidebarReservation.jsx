
import { useState } from "react";

/* ── Sidebar Filtres ────────────────────────────────── */
export default function Sidebar({ prixMax, setPrixMax, filterTypes, toggleType, filterEquip, toggleEquip }) {
  const types = ["Standard", "Deluxe", "Suite", "Présidentielle"];
  const equips = [
    { label: "WiFi", icon: "📶" },
    { label: "Petit-déj inclus", icon: "🥐" },
    { label: "Spa privé", icon: "🌿" },
    { label: "TV 4K", icon: "📺" },
  ];

  return (
    <aside className="w-64 shrink-0 sticky top-28 self-start">
      <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
        <p className="font-semibold text-white text-base mb-0.5" style={{ fontFamily: "'Playfair Display',serif" }}>Filtres</p>
        <p className="text-slate-500 text-xs mb-6">Affinez votre recherche</p>

        {/* Prix */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Prix max / nuit</p>
          <div className="relative mb-2">
            <input type="range" min={80} max={1000} step={20} value={prixMax}
              onChange={e => setPrixMax(Number(e.target.value))}
              className="w-full h-1 appearance-none rounded-full outline-none"
              style={{
                background: `linear-gradient(to right, #7c3aed ${((prixMax-80)/920)*100}%, rgba(255,255,255,.1) 0%)`,
                accentColor: "#7c3aed",
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>€80</span>
            <span className="text-violet-400 font-semibold">€{prixMax}</span>
          </div>
        </div>

        {/* Type */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Type</p>
          <div className="space-y-2">
            {types.map(t => (
              <label key={t} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => toggleType(t)}
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer"
                  style={{
                    background: filterTypes.includes(t) ? "#7c3aed" : "transparent",
                    border: filterTypes.includes(t) ? "none" : "1.5px solid rgba(255,255,255,.15)",
                    boxShadow: filterTypes.includes(t) ? "0 0 10px rgba(124,58,237,.5)" : "none",
                  }}
                >
                  {filterTypes.includes(t) && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors select-none" onClick={() => toggleType(t)}>{t}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Équipements */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Équipements</p>
          <div className="space-y-2">
            {equips.map(e => (
              <label key={e.label} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => toggleEquip(e.label)}
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer"
                  style={{
                    background: filterEquip.includes(e.label) ? "#7c3aed" : "transparent",
                    border: filterEquip.includes(e.label) ? "none" : "1.5px solid rgba(255,255,255,.15)",
                    boxShadow: filterEquip.includes(e.label) ? "0 0 10px rgba(124,58,237,.5)" : "none",
                  }}
                >
                  {filterEquip.includes(e.label) && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors select-none flex items-center gap-1.5" onClick={() => toggleEquip(e.label)}>
                  <span>{e.icon}</span> {e.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={() => { setPrixMax(1000); }}
          className="w-full mt-6 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
          style={{ border: "1px solid rgba(255,255,255,.07)" }}
        >Réinitialiser les filtres</button>
      </div>
    </aside>
  );
}
