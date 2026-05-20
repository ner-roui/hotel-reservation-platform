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


export default function StepDates({
  dateIn,
  dateOut,
  voyageurs,
  notes,
  onChange,
}) {

  console.log('dateIn', dateIn, 'dateOut', dateOut)
  // FORMAT POUR INPUT DATE
  const toInputDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  // SAFE DATES
  const safeIn = dateIn ? new Date(dateIn) : null;
  const safeOut = dateOut ? new Date(dateOut) : null;

  // NIGHTS
  const nights =
    safeIn && safeOut ? diffDays(safeIn, safeOut) : 0;

  return (
    <div style={{ animation: "fadeUp .4s ease both" }}>
      <h2
        className="text-lg font-semibold text-white mb-1"
        style={{ fontFamily: "'Playfair Display',serif" }}
      >
        Dates & Voyageurs
      </h2>

      <p
        className="text-sm mb-6"
        style={{ color: "rgba(100,116,139,.7)" }}
      >
        Modifiez vos dates de séjour et le nombre de voyageurs.
      </p>

      {/* DATES */}
      <div className="flex gap-4 mb-5">
        <DateField
          label="Arrivée"
          value={toInputDate(safeIn)}
          min={toInputDate(new Date())}
          onChange={(v) =>
            onChange("arrivee", new Date(v))
          }
        />

        <DateField
          label="Départ"
          value={toInputDate(safeOut)}
          min={toInputDate(safeIn || new Date())}
          onChange={(v) =>
            onChange("depart", new Date(v))
          }
        />
      </div>

      {/* DURATION */}
      <div
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl mb-5"
        style={{
          background: "rgba(124,58,237,.08)",
          border: "1px solid rgba(124,58,237,.15)",
        }}
      >
        <span style={{ color: "#a78bfa", fontSize: 14 }}>
          🌙
        </span>

        <span
          className="text-sm font-semibold"
          style={{ color: "#c4b5fd" }}
        >
          {nights} nuit{nights > 1 ? "s" : ""}
        </span>

        <span
          style={{ color: "rgba(100,116,139,.5)", fontSize: 12 }}
        >
          ·
        </span>

        <span
          className="text-xs"
          style={{ color: "rgba(100,116,139,.6)" }}
        >
          {safeIn
            ? safeIn.toLocaleDateString("fr-FR")
            : "--"}{" "}
          →{" "}
          {safeOut
            ? safeOut.toLocaleDateString("fr-FR")
            : "--"}
        </span>
      </div>

      {/* VOYAGEURS */}
      <div className="mb-5">
        <label
          className="block text-xs font-semibold uppercase tracking-widest mb-3"
          style={{
            color: "rgba(148,163,184,.5)",
            fontSize: 9,
            letterSpacing: ".14em",
          }}
        >
          Nombre de voyageurs
        </label>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              onChange(
                "voyageurs",
                Math.max(1, voyageurs - 1)
              )
            }
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.09)",
              color: "rgba(148,163,184,.8)",
            }}
          >
            −
          </button>

          <div
            className="flex-1 text-center py-2.5 rounded-xl"
            style={{
              background: "rgba(124,58,237,.08)",
              border: "1px solid rgba(124,58,237,.2)",
            }}
          >
            <span
              className="text-xl font-bold"
              style={{
                color: "#c4b5fd",
                fontFamily: "'Playfair Display',serif",
              }}
            >
              {voyageurs}
            </span>

            <span
              className="text-xs ml-2"
              style={{ color: "rgba(100,116,139,.6)" }}
            >
              voyageur{voyageurs > 1 ? "s" : ""}
            </span>
          </div>

          <button
            onClick={() =>
              onChange(
                "voyageurs",
                Math.min(6, voyageurs + 1)
              )
            }
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.09)",
              color: "rgba(148,163,184,.8)",
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* NOTES */}
      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-widest mb-2"
          style={{
            color: "rgba(148,163,184,.5)",
            fontSize: 9,
            letterSpacing: ".14em",
          }}
        >
          Demandes spéciales (optionnel)
        </label>

        <textarea
          rows={3}
          value={notes}
          onChange={(e) =>
            onChange("notes", e.target.value)
          }
          placeholder="Ex : chambre haute, lit bébé..."
          className="w-full rounded-xl px-4 py-3 text-sm resize-none"
          style={{
            background: "rgba(255,255,255,.04)",
            border: "1.5px solid rgba(255,255,255,.09)",
            color: "#f8fafc",
          }}
        />
      </div>
    </div>
  );
}