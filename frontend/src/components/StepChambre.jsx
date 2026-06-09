import { useContext, useState } from "react";
import { AppContext } from "../context/Context";
import { AlertTriangle, TrendingUp, TrendingDown, X } from "lucide-react";

const TYPE_COLORS = {
  "Standard":       { bg: "rgba(37,99,235,.08)",   border: "rgba(37,99,235,.2)",   text: "#1d4ed8" },
  "Deluxe":         { bg: "rgba(124,58,237,.08)",  border: "rgba(124,58,237,.2)",  text: "#6d28d9" },
  "Suite":          { bg: "rgba(180,130,40,.1)",   border: "rgba(180,130,40,.25)", text: "#92650a" },
  "Présidentielle": { bg: "rgba(5,150,105,.08)",   border: "rgba(5,150,105,.2)",   text: "#065f46" },
};

/* ── Bannière d'avertissement prix ─────────────────────────────── */
function PriceWarningBanner({ currentPrice, newPrice, nights, onDismiss }) {
  const diff      = newPrice - currentPrice;
  const isHigher  = diff > 0;
  const diffNight = Math.abs(diff);
  const diffTotal = diffNight * (nights || 1);

  return (
    <div
      className="rounded-2xl overflow-hidden mb-4"
      style={{
        border: `1.5px solid ${isHigher ? "rgba(220,38,38,.25)" : "rgba(5,150,105,.25)"}`,
        background: isHigher ? "rgba(254,242,242,.9)" : "rgba(240,253,244,.9)",
        animation: "slideDown .3s ease both",
      }}
    >
      {/* Top accent */}
      <div
        className="h-1"
        style={{
          background: isHigher
            ? "linear-gradient(90deg,#dc2626,#ef4444)"
            : "linear-gradient(90deg,#059669,#10b981)",
        }}
      />

      <div className="px-4 py-3">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background: isHigher ? "rgba(220,38,38,.1)" : "rgba(5,150,105,.1)",
              border: `1px solid ${isHigher ? "rgba(220,38,38,.2)" : "rgba(5,150,105,.2)"}`,
            }}
          >
            {isHigher
              ? <TrendingUp size={16} color="#dc2626" />
              : <TrendingDown size={16} color="#059669" />
            }
          </div>

          {/* Text */}
          <div className="flex-1">
            <p
              className="text-sm font-semibold mb-0.5"
              style={{ color: isHigher ? "#991b1b" : "#065f46", fontFamily: "'Cormorant Garamond', serif", fontSize: 15 }}
            >
              {isHigher ? "Chambre plus chère" : "Chambre moins chère"}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: isHigher ? "#b91c1c" : "#047857" }}>
              Cette chambre est{" "}
              <strong>€{diffNight}/nuit {isHigher ? "plus chère" : "moins chère"}</strong>{" "}
              que votre réservation actuelle
              {nights > 1 ? ` (€${diffTotal} sur ${nights} nuits)` : ""}.
            </p>

            {/* Alert box */}
            <div
              className="mt-2.5 flex items-start gap-2 px-3 py-2.5 rounded-xl"
              style={{
                background: isHigher ? "rgba(220,38,38,.06)" : "rgba(5,150,105,.06)",
                border: `1px solid ${isHigher ? "rgba(220,38,38,.15)" : "rgba(5,150,105,.15)"}`,
              }}
            >
              <AlertTriangle size={13} color={isHigher ? "#dc2626" : "#059669"} className="mt-0.5 shrink-0" />
              <p className="text-xs" style={{ color: isHigher ? "#991b1b" : "#065f46", lineHeight: 1.5 }}>
                {isHigher
                  ? "Pour changer vers une chambre plus chère, vous devez annuler votre réservation actuelle et effectuer une nouvelle réservation."
                  : "Pour changer vers une chambre moins chère, vous devez annuler votre réservation actuelle et effectuer une nouvelle réservation."
                }
              </p>
            </div>
          </div>

          {/* Dismiss */}
          <button
            onClick={onDismiss}
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all"
            style={{ background: "transparent", border: "none", color: isHigher ? "#dc2626" : "#059669", opacity: 0.6 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}
          >
            <X size={13} />
          </button>
        </div>

        {/* Price comparison pills */}
        <div className="flex items-center gap-2 mt-3 ml-12">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
            style={{ background: "rgba(148,163,184,.12)", border: "1px solid rgba(148,163,184,.2)", color: "#64748b" }}
          >
            <span>Actuel</span>
            <strong>€{currentPrice}/nuit</strong>
          </div>
          <span style={{ color: "#94a3b8", fontSize: 12 }}>→</span>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: isHigher ? "rgba(220,38,38,.1)" : "rgba(5,150,105,.1)",
              border: `1px solid ${isHigher ? "rgba(220,38,38,.2)" : "rgba(5,150,105,.2)"}`,
              color: isHigher ? "#dc2626" : "#059669",
            }}
          >
            <span>Nouveau</span>
            <strong>€{newPrice}/nuit</strong>
            <span>{isHigher ? "▲" : "▼"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── StepChambre ────────────────────────────────────────────────── */
export default function StepChambre({ selected, onSelect, voyageurs, currentReservation }) {
  const [hov,          setHov]          = useState(null);
  const [warningData,  setWarningData]  = useState(null); // { currentPrice, newPrice, nights, chambre }
  const { chambres } = useContext(AppContext);

  // Prix de la réservation en cours (passé en prop depuis le parent)
  const currentPrice = currentReservation?.chambre?.prix_nuit || currentReservation?.prixParNuit || null;
  const nights = currentReservation?.nuits || Math.max(1, Math.ceil(
    (new Date(currentReservation?.depart) - new Date(currentReservation?.arrivee)) / 86400000
  )) || 1;

  const handleSelect = (c) => {
    // Pas de réservation actuelle → sélection normale
    if (!currentPrice || c.prix_nuit === currentPrice) {
      setWarningData(null);
      onSelect(c);
      return;
    }

    // Prix différent → afficher l'avertissement et NE PAS sélectionner
    setWarningData({
      currentPrice,
      newPrice: c.prix_nuit,
      nights,
      chambre: c,
    });
  };

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

      {/* Bannière d'avertissement prix */}
      {warningData && (
        <PriceWarningBanner
          currentPrice={warningData.currentPrice}
          newPrice={warningData.newPrice}
          nights={warningData.nights}
          onDismiss={() => setWarningData(null)}
        />
      )}

      <div
        className="space-y-3 max-h-96 overflow-y-auto pr-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(160,120,80,.3) transparent" }}
      >
        {chambres.map((c, i) => {
          const tc         = TYPE_COLORS[c.type] || TYPE_COLORS["Standard"];
          const isSelected = selected?.numero === c.numero;
          const isHov      = hov === i;
          const isWarned   = warningData?.chambre?.numero === c.numero;

          // Différence de prix par rapport à la réservation actuelle
          const priceDiff   = currentPrice ? c.prix_nuit - currentPrice : null;
          const isHigher    = priceDiff > 0;
          const isLower     = priceDiff < 0;
          const hasDiff     = priceDiff !== null && priceDiff !== 0;

          return (
            <div
              key={i}
              onClick={() => handleSelect(c)}
              className="flex items-center gap-4 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
              style={{
                background: isWarned
                  ? isHigher ? "rgba(254,242,242,.6)" : "rgba(240,253,244,.6)"
                  : isSelected ? "rgba(160,120,80,.08)" : isHov ? "#faf7f4" : "#fff",
                border: isWarned
                  ? `1.5px solid ${isHigher ? "rgba(220,38,38,.3)" : "rgba(5,150,105,.3)"}`
                  : isSelected
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
                  src={`https://hotel-reservation-platform-dgtp.onrender.com${c.images[0]}`}
                  alt={c.type}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{ transform: isHov ? "scale(1.08)" : "scale(1)", filter: "brightness(.95)" }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 py-3 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
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
                  {/* Badge de différence de prix */}
                  {hasDiff && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                      style={{
                        background: isHigher ? "rgba(220,38,38,.1)" : "rgba(5,150,105,.1)",
                        color: isHigher ? "#dc2626" : "#059669",
                        border: `1px solid ${isHigher ? "rgba(220,38,38,.2)" : "rgba(5,150,105,.2)"}`,
                      }}
                    >
                      {isHigher ? "▲" : "▼"} €{Math.abs(priceDiff)}/nuit
                    </span>
                  )}
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
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: hasDiff ? (isHigher ? "#dc2626" : "#059669") : "#1c1917",
                  }}
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

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}