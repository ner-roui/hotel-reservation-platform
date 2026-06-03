import { useContext, useState } from "react";
import { AppContext } from "../context/Context";

const TYPE_COLORS = {
  "Standard":       { bg: "rgba(37,99,235,.08)",   border: "rgba(37,99,235,.2)",   text: "#1d4ed8" },
  "Deluxe":         { bg: "rgba(124,58,237,.08)",  border: "rgba(124,58,237,.2)",  text: "#6d28d9" },
  "Suite":          { bg: "rgba(180,130,40,.1)",   border: "rgba(180,130,40,.25)", text: "#92650a" },
  "Présidentielle": { bg: "rgba(5,150,105,.08)",   border: "rgba(5,150,105,.2)",   text: "#065f46" },
};

export default function StepChambre({ selected, onSelect, voyageurs }) {
  const [hov, setHov] = useState(null);
  const { chambres } = useContext(AppContext);

  return (
    <div style={{ animation: "fadeUp .4s ease both" }}>
      <h2
        className="text-lg font-bold mb-1"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1c1917" }}
      >
        Choisir une chambre
      </h2>
      <p className="text-sm mb-6" style={{ color: "#a8968a" }}>
        Sélectionnez la chambre souhaitée pour votre séjour.
      </p>

      <div
        className="space-y-3 max-h-96 overflow-y-auto pr-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(160,120,80,.3) transparent" }}
      >
        {chambres.map((c, i) => {
          const tc = TYPE_COLORS[c.type] || TYPE_COLORS["Standard"];
          const isSelected = selected?.numero === c.numero;
          const isHov = hov === i;

          return (
            <div
              key={i}
              onClick={() => onSelect(c)}
              className="flex items-center gap-4 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
              style={{
                background: isSelected ? "rgba(160,120,80,.08)" : isHov ? "#faf7f4" : "#fff",
                border: isSelected
                  ? "1.5px solid #a07850"
                  : isHov
                  ? "1px solid #c8a880"
                  : "1px solid #ddd5c8",
                boxShadow: isSelected
                  ? "0 0 0 3px rgba(160,120,80,.1)"
                  : isHov
                  ? "0 4px 12px rgba(60,30,10,.06)"
                  : "0 1px 4px rgba(60,30,10,.04)",
                transform: isHov && !isSelected ? "translateX(2px)" : "none",
              }}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
            >
              {/* Image */}
              <div className="w-20 h-16 shrink-0 overflow-hidden">
                <img
                  src={`http://localhost:3000${c.images[0]}`}
                  alt={c.type}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{ transform: isHov ? "scale(1.08)" : "scale(1)", filter: "brightness(.95)" }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 py-3 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="font-bold text-sm"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1c1917" }}
                  >
                    {c.type} {c.numero}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}
                  >
                    {c.type}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: "#a8968a" }}>🛏️ {c.lit}</span>
                  <span className="text-xs" style={{ color: "#a8968a" }}>📐 {c.superficie}m²</span>
                </div>
              </div>

              {/* Price */}
              <div className="pr-4 text-right">
                <p
                  className="font-bold"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1c1917" }}
                >
                  €{c.prix_nuit}
                </p>
                <p className="text-xs" style={{ color: "#a8968a" }}>/nuit</p>
              </div>

              {/* Radio */}
              <div className="pr-4">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    border: isSelected ? "1.5px solid #a07850" : "1.5px solid #c8b8a8",
                    background: "transparent",
                  }}
                >
                  {isSelected && (
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)" }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}