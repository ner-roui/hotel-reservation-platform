const RESERVATION = {
  id: "RES-2842",
  type: "Deluxe", numero: "202", etage: 2,
  lit: "1 lit king", superficie: 32,
  dateIn: "2026-04-14", dateOut: "2026-04-17",
  voyageurs: 2, prixNuit: 220,
  img: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&q=80",
  equipements: ["WiFi", "TV 4K", "Minibar", "Spa privé"],
  statut: "En attente",
  notes: "",
};

const TYPE_COLORS = {
  "Standard":       { bg: "rgba(37,99,235,.08)",  border: "rgba(37,99,235,.2)",   text: "#1d4ed8" },
  "Deluxe":         { bg: "rgba(124,58,237,.08)", border: "rgba(124,58,237,.2)",  text: "#6d28d9" },
  "Suite":          { bg: "rgba(180,130,40,.1)",  border: "rgba(180,130,40,.25)", text: "#92650a" },
  "Présidentielle": { bg: "rgba(5,150,105,.08)",  border: "rgba(5,150,105,.2)",   text: "#065f46" },
};

function diffDays(a, b) {
  return Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000));
}
function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function StepRecap({ res, chambre, dateIn, dateOut, voyageurs, notes }) {
  const nights   = diffDays(dateIn, dateOut);
  const prixBase = chambre.prix_nuit * nights;
  const taxes    = Math.round(prixBase * 0.1);
  const total    = prixBase + taxes;
  const tc       = TYPE_COLORS[chambre.type] || TYPE_COLORS["Standard"];

  const hasChanged =
    chambre.numero !== RESERVATION.numero ||
    dateIn  !== RESERVATION.dateIn  ||
    dateOut !== RESERVATION.dateOut ||
    voyageurs !== RESERVATION.voyageurs;

  return (
    <div style={{ animation: "fadeUp .4s ease both" }}>
      <h2
        className="text-lg font-bold mb-1"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1c1917" }}
      >
        Récapitulatif des modifications
      </h2>
      <p className="text-sm mb-6" style={{ color: "#a8968a" }}>
        Vérifiez les changements avant de confirmer.
      </p>

      {/* ── Diff block ── */}
      {hasChanged && (
        <div
          className="rounded-2xl p-4 mb-5"
          style={{ background: "rgba(160,120,80,.06)", border: "1px solid rgba(160,120,80,.2)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#a07850", letterSpacing: ".12em" }}
          >
            Modifications détectées
          </p>
          <div className="space-y-2">
            {chambre.numero !== RESERVATION.numero && (
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span>🛏️</span>
                <span style={{ color: "#a8968a" }}>Chambre :</span>
                <span style={{ textDecoration: "line-through", color: "#dc2626" }}>
                  {RESERVATION.type} {RESERVATION.numero}
                </span>
                <span style={{ color: "#c8b8a8" }}>→</span>
                <span style={{ color: "#059669", fontWeight: 600 }}>
                  {chambre.type} {chambre.numero}
                </span>
              </div>
            )}
            {(dateIn !== RESERVATION.dateIn || dateOut !== RESERVATION.dateOut) && (
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span>📅</span>
                <span style={{ color: "#a8968a" }}>Dates :</span>
                <span style={{ textDecoration: "line-through", color: "#dc2626" }}>
                  {formatDate(RESERVATION.dateIn)} → {formatDate(RESERVATION.dateOut)}
                </span>
                <span style={{ color: "#c8b8a8" }}>→</span>
                <span style={{ color: "#059669", fontWeight: 600 }}>
                  {formatDate(dateIn)} → {formatDate(dateOut)}
                </span>
              </div>
            )}
            {voyageurs !== RESERVATION.voyageurs && (
              <div className="flex items-center gap-2 text-xs">
                <span>👥</span>
                <span style={{ color: "#a8968a" }}>Voyageurs :</span>
                <span style={{ textDecoration: "line-through", color: "#dc2626" }}>
                  {RESERVATION.voyageurs}
                </span>
                <span style={{ color: "#c8b8a8" }}>→</span>
                <span style={{ color: "#059669", fontWeight: 600 }}>{voyageurs}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Room card ── */}
      <div
        className="flex gap-4 rounded-2xl overflow-hidden mb-5"
        style={{ background: "#faf7f4", border: "1px solid #ddd5c8" }}
      >
        <img
          src={`http://localhost:3000${chambre.images[0]}`}
          className="w-28 h-24 object-cover shrink-0"
          alt=""
          style={{ filter: "brightness(.95)" }}
        />
        <div className="py-3 pr-3 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="font-bold text-sm"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1c1917" }}
            >
              {chambre.type} · Chambre {chambre.numero}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}
            >
              {chambre.type}
            </span>
          </div>
          <p className="text-xs mb-1" style={{ color: "#a8968a" }}>
            🛏️ {chambre.lit} · 📐 {chambre.superficie}m² · Étage {RESERVATION.etage}
          </p>
          <p className="text-xs" style={{ color: "#b8a898" }}>
            📅 {formatDate(dateIn)} → {formatDate(dateOut)} · 🌙 {nights} nuits · 👥 {voyageurs} pers.
          </p>
          {notes && (
            <p className="text-xs mt-1 italic" style={{ color: "#a07850" }}>"{notes}"</p>
          )}
        </div>
      </div>

      {/* ── Price breakdown ── */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "#fff", border: "1px solid #ddd5c8", boxShadow: "0 1px 4px rgba(60,30,10,.04)" }}
      >
        <div className="space-y-2.5 mb-3">
          <div className="flex justify-between text-sm">
            <span style={{ color: "#a8968a" }}>€{chambre.prix_nuit} × {nights} nuits</span>
            <span className="font-semibold" style={{ color: "#1c1917" }}>€ {prixBase}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "#a8968a" }}>Taxes & frais (10%)</span>
            <span className="font-semibold" style={{ color: "#1c1917" }}>€ {taxes}</span>
          </div>
        </div>
        <div className="h-px mb-3" style={{ background: "#ede5db" }} />
        <div className="flex justify-between items-center">
          <span className="font-semibold" style={{ color: "#1c1917" }}>Nouveau total</span>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2614" }}
          >
            € {total}
          </span>
        </div>
      </div>
    </div>
  );
}