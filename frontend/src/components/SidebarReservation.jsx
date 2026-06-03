import { useState } from "react";

export default function Sidebar({ prixMax, setPrixMax, filterTypes, toggleType, filterEquip, toggleEquip }) {
  const types = [ "Standard",
                  "Supérieure",
                  "Deluxe",
                  "Suite",
                  "Suite Présidentielle"];
                  
  const equips = [
    { icon: "📶", label: "Wi-Fi" },
    { icon: "❄️", label: "Climatisation" },
    { icon: "🛁", label: "Baignoire" },
    { icon: "🚿", label: "Douche" },
    { icon: "📺", label: "TV 4K" },
    { icon: "☕", label: "Machine café" },
    { icon: "🧊", label: "Minibar" },
    { icon: "👔", label: "Dressing" },
    { icon: "🛋️", label: "Salon" },
    { icon: "🌅", label: "Balcon" },
    { icon: "🏊", label: "Piscine" },
    { icon: "💼", label: "Bureau" },
    { icon: "🔒", label: "Coffre-fort" },
    { icon: "♿", label: "Accès PMR" },
  ];

  return (
    <aside className="w-64 shrink-0 sticky top-28 self-start">
      <div
        className="rounded-2xl p-5"
        style={{
          background: "#fff",
          border: "1px solid #ddd5c8",
          boxShadow: "0 2px 12px rgba(60,30,10,.06)",
        }}
      >
        <p
          className="font-bold text-base mb-0.5"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1c1917", fontSize: 18 }}
        >
          Filtres
        </p>
        <p className="text-xs mb-6" style={{ color: "#a8968a" }}>Affinez votre recherche</p>

        {/* Prix */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7a6050" }}>
            Prix max / nuit
          </p>
          <div className="relative mb-2">
            <input
              type="range" min={80} max={1000} step={20} value={prixMax}
              onChange={e => setPrixMax(Number(e.target.value))}
              className="w-full h-1 appearance-none rounded-full outline-none"
              style={{
                background: `linear-gradient(to right, #a07850 ${((prixMax - 80) / 920) * 100}%, #e8ddd4 0%)`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs" style={{ color: "#a8968a" }}>
            <span>€80</span>
            <span className="font-semibold" style={{ color: "#a07850" }}>€{prixMax}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-5" style={{ height: 1, background: "#ede5db" }} />

        {/* Type */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7a6050" }}>
            Type
          </p>
          <div className="space-y-2.5">
            {types.map(t => (
              <label key={t} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleType(t)}>
                <div
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    background: filterTypes.includes(t) ? "#a07850" : "transparent",
                    border: filterTypes.includes(t) ? "none" : "1.5px solid #c8b8a8",
                    boxShadow: filterTypes.includes(t) ? "0 0 8px rgba(160,120,80,.3)" : "none",
                  }}
                >
                  {filterTypes.includes(t) && <span className="text-white text-xs">✓</span>}
                </div>
                <span
                  className="text-sm select-none transition-colors"
                  style={{ color: filterTypes.includes(t) ? "#1c1917" : "#6b5244" }}
                >
                  {t}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-5" style={{ height: 1, background: "#ede5db" }} />

        {/* Équipements */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7a6050" }}>
            Équipements
          </p>
          <div className="space-y-2.5">
            {equips.map(e => (
              <label key={e.label} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleEquip(e.label)}>
                <div
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    background: filterEquip.includes(e.label) ? "#a07850" : "transparent",
                    border: filterEquip.includes(e.label) ? "none" : "1.5px solid #c8b8a8",
                    boxShadow: filterEquip.includes(e.label) ? "0 0 8px rgba(160,120,80,.3)" : "none",
                  }}
                >
                  {filterEquip.includes(e.label) && <span className="text-white text-xs">✓</span>}
                </div>
                <span
                  className="text-sm select-none flex items-center gap-1.5 transition-colors"
                  style={{ color: filterEquip.includes(e.label) ? "#1c1917" : "#6b5244" }}
                >
                  <span>{e.icon}</span> {e.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={() => setPrixMax(1000)}
          className="w-full mt-6 py-2 rounded-xl text-xs font-medium transition-all duration-200"
          style={{
            border: "1px solid #ddd5c8",
            color: "#a8968a",
            background: "transparent",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#f5ede4";
            e.currentTarget.style.color = "#7c5a38";
            e.currentTarget.style.borderColor = "#c8a880";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#a8968a";
            e.currentTarget.style.borderColor = "#ddd5c8";
          }}
        >
          Réinitialiser les filtres
        </button>
      </div>
    </aside>
  );
}