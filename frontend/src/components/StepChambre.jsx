/* ── Step 2: Choose room ────────────────────────────── */
import { useState } from "react";
const CHAMBRES_DISPO = [
  { type: "Standard",       numero: "101", prixNuit: 120, superficie: 22,  lit: "1 lit double",        img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80" },
  { type: "Standard",       numero: "103", prixNuit: 120, superficie: 22,  lit: "1 lit double",        img: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&q=80" },
  { type: "Deluxe",         numero: "202", prixNuit: 220, superficie: 32,  lit: "1 lit king",          img: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400&q=80" },
  { type: "Deluxe",         numero: "203", prixNuit: 220, superficie: 32,  lit: "2 lits queen",        img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&q=80" },
  { type: "Suite",          numero: "301", prixNuit: 380, superficie: 55,  lit: "1 lit king + canapé", img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=80" },
  { type: "Présidentielle", numero: "501", prixNuit: 680, superficie: 120, lit: "2 lits king",         img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=80" },
];

const TYPE_COLORS = {
  "Standard":       { bg: "rgba(96,165,250,.12)",  border: "rgba(96,165,250,.25)",  text: "#93c5fd" },
  "Deluxe":         { bg: "rgba(167,139,250,.12)", border: "rgba(167,139,250,.25)", text: "#c4b5fd" },
  "Suite":          { bg: "rgba(251,191,36,.12)",  border: "rgba(251,191,36,.25)",  text: "#fde68a" },
  "Présidentielle": { bg: "rgba(52,211,153,.12)",  border: "rgba(52,211,153,.25)",  text: "#6ee7b7" },
};

export default function StepChambre({ selected, onSelect, voyageurs }) {
  const [hov, setHov] = useState(null);
  return (
    <div style={{ animation: "fadeUp .4s ease both" }}>
      <h2 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>Choisir une chambre</h2>
      <p className="text-sm mb-6" style={{ color: "rgba(100,116,139,.7)" }}>Sélectionnez la chambre souhaitée pour votre séjour.</p>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(124,58,237,.3) transparent" }}>
        {CHAMBRES_DISPO.map((c, i) => {
          const tc = TYPE_COLORS[c.type] || TYPE_COLORS["Standard"];
          const isSelected = selected?.numero === c.numero;
          return (
            <div key={i} onClick={() => onSelect(c)}
              className="flex items-center gap-4 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
              style={{
                background: isSelected ? "rgba(124,58,237,.14)" : hov === i ? "rgba(255,255,255,.055)" : "rgba(255,255,255,.03)",
                border: isSelected ? "1.5px solid rgba(124,58,237,.5)" : hov === i ? "1px solid rgba(255,255,255,.14)" : "1px solid rgba(255,255,255,.07)",
                boxShadow: isSelected ? "0 0 0 3px rgba(124,58,237,.12)" : "none",
                transform: hov === i && !isSelected ? "translateX(2px)" : "none",
              }}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            >
              {/* Image */}
              <div className="w-20 h-16 shrink-0 overflow-hidden">
                <img src={c.img} alt={c.type} className="w-full h-full object-cover transition-transform duration-300"
                  style={{ transform: hov === i ? "scale(1.08)" : "scale(1)" }} />
              </div>
              {/* Info */}
              <div className="flex-1 py-3 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-white text-sm" style={{ fontFamily: "'Playfair Display',serif" }}>{c.type} {c.numero}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>{c.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: "rgba(100,116,139,.6)" }}>🛏️ {c.lit}</span>
                  <span className="text-xs" style={{ color: "rgba(100,116,139,.6)" }}>📐 {c.superficie}m²</span>
                </div>
              </div>
              {/* Price */}
              <div className="pr-4 text-right">
                <p className="font-bold text-white" style={{ fontFamily: "'Playfair Display',serif" }}>€{c.prixNuit}</p>
                <p className="text-xs" style={{ color: "rgba(100,116,139,.5)" }}>/nuit</p>
              </div>
              {/* Radio */}
              <div className="pr-4">
                <div className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{ border: isSelected ? "1.5px solid #7c3aed" : "1.5px solid rgba(255,255,255,.18)", background: "transparent" }}>
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
