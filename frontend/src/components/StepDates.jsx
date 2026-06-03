import { useState } from "react";
import DateField from "./DateField";

function diffDays(a, b) {
  return Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000));
}

export default function StepDates({ dateIn, dateOut, voyageurs, notes, onChange }) {
  const toInputDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const safeIn  = dateIn  ? new Date(dateIn)  : null;
  const safeOut = dateOut ? new Date(dateOut) : null;
  const nights  = safeIn && safeOut ? diffDays(safeIn, safeOut) : 0;

  return (
    <div style={{ animation: "fadeUp .4s ease both" }}>
      <h2
        className="text-lg font-bold mb-1"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1c1917" }}
      >
        Dates & Voyageurs
      </h2>
      <p className="text-sm mb-6" style={{ color: "#a8968a" }}>
        Modifiez vos dates de séjour et le nombre de voyageurs.
      </p>

      {/* DATES */}
      <div className="flex gap-4 mb-5">
        <DateField
          label="Arrivée"
          value={toInputDate(safeIn)}
          min={toInputDate(new Date())}
          onChange={(v) => onChange("arrivee", new Date(v))}
        />
        <DateField
          label="Départ"
          value={toInputDate(safeOut)}
          min={toInputDate(safeIn || new Date())}
          onChange={(v) => onChange("depart", new Date(v))}
        />
      </div>

      {/* DURATION */}
      <div
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl mb-5"
        style={{
          background: "rgba(160,120,80,.07)",
          border: "1px solid rgba(160,120,80,.2)",
        }}
      >
        <span style={{ color: "#a07850", fontSize: 14 }}>🌙</span>
        <span className="text-sm font-semibold" style={{ color: "#7c5a38" }}>
          {nights} nuit{nights > 1 ? "s" : ""}
        </span>
        <span style={{ color: "#c8b8a8", fontSize: 12 }}>·</span>
        <span className="text-xs" style={{ color: "#a8968a" }}>
          {safeIn  ? safeIn.toLocaleDateString("fr-FR")  : "--"}{" "}→{" "}
          {safeOut ? safeOut.toLocaleDateString("fr-FR") : "--"}
        </span>
      </div>

      {/* VOYAGEURS */}
      <div className="mb-5">
        <label
          className="block text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: "#7a6050", fontSize: 9, letterSpacing: ".14em" }}
        >
          Nombre de voyageurs
        </label>

        <div className="flex items-center gap-3">
          {/* − */}
          <button
            onClick={() => onChange("voyageurs", Math.max(1, voyageurs - 1))}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all"
            style={{ background: "#faf7f4", border: "1px solid #ddd5c8", color: "#6b5244" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f0e8e0"; e.currentTarget.style.borderColor = "#c8a880"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#faf7f4"; e.currentTarget.style.borderColor = "#ddd5c8"; }}
          >−</button>

          {/* Counter */}
          <div
            className="flex-1 text-center py-2.5 rounded-xl"
            style={{ background: "rgba(160,120,80,.07)", border: "1px solid rgba(160,120,80,.2)" }}
          >
            <span
              className="text-xl font-bold"
              style={{ color: "#3d2614", fontFamily: "'Cormorant Garamond', serif" }}
            >
              {voyageurs}
            </span>
            <span className="text-xs ml-2" style={{ color: "#a8968a" }}>
              voyageur{voyageurs > 1 ? "s" : ""}
            </span>
          </div>

          {/* + */}
          <button
            onClick={() => onChange("voyageurs", Math.min(6, voyageurs + 1))}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all"
            style={{ background: "#faf7f4", border: "1px solid #ddd5c8", color: "#6b5244" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f0e8e0"; e.currentTarget.style.borderColor = "#c8a880"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#faf7f4"; e.currentTarget.style.borderColor = "#ddd5c8"; }}
          >+</button>
        </div>
      </div>

      {/* NOTES */}
      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: "#7a6050", fontSize: 9, letterSpacing: ".14em" }}
        >
          Demandes spéciales (optionnel)
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Ex : chambre haute, lit bébé..."
          className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition-all"
          style={{
            background: "#faf7f4",
            border: "1.5px solid #ddd5c8",
            color: "#1c1917",
            fontFamily: "'DM Sans', sans-serif",
          }}
          onFocus={e => { e.target.style.borderColor = "#a07850"; e.target.style.boxShadow = "0 0 0 3px rgba(160,120,80,.1)"; }}
          onBlur={e => { e.target.style.borderColor = "#ddd5c8"; e.target.style.boxShadow = "none"; }}
        />
      </div>
    </div>
  );
}