/* ── Step 3: Recap ──────────────────────────────────── */
function StepRecap({ res, chambre, dateIn, dateOut, voyageurs, notes }) {
  const nights = diffDays(dateIn, dateOut);
  const prixBase = chambre.prixNuit * nights;
  const taxes = Math.round(prixBase * 0.1);
  const total = prixBase + taxes;
  const hasChanged = chambre.numero !== RESERVATION.numero || dateIn !== RESERVATION.dateIn || dateOut !== RESERVATION.dateOut || voyageurs !== RESERVATION.voyageurs;
  const tc = TYPE_COLORS[chambre.type] || TYPE_COLORS["Standard"];

  return (
    <div style={{ animation: "fadeUp .4s ease both" }}>
      <h2 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>Récapitulatif des modifications</h2>
      <p className="text-sm mb-6" style={{ color: "rgba(100,116,139,.7)" }}>Vérifiez les changements avant de confirmer.</p>

      {/* Change diff */}
      {hasChanged && (
        <div className="rounded-2xl p-4 mb-5" style={{ background: "rgba(124,58,237,.07)", border: "1px solid rgba(124,58,237,.18)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa", letterSpacing: ".12em" }}>Modifications détectées</p>
          <div className="space-y-2">
            {chambre.numero !== RESERVATION.numero && (
              <div className="flex items-center gap-2 text-xs">
                <span>🛏️</span>
                <span style={{ color: "rgba(100,116,139,.6)" }}>Chambre :</span>
                <span style={{ textDecoration: "line-through", color: "rgba(239,68,68,.6)" }}>{RESERVATION.type} {RESERVATION.numero}</span>
                <span style={{ color: "rgba(100,116,139,.4)" }}>→</span>
                <span style={{ color: "#86efac" }}>{chambre.type} {chambre.numero}</span>
              </div>
            )}
            {(dateIn !== RESERVATION.dateIn || dateOut !== RESERVATION.dateOut) && (
              <div className="flex items-center gap-2 text-xs">
                <span>📅</span>
                <span style={{ color: "rgba(100,116,139,.6)" }}>Dates :</span>
                <span style={{ textDecoration: "line-through", color: "rgba(239,68,68,.6)" }}>{formatDate(RESERVATION.dateIn)} → {formatDate(RESERVATION.dateOut)}</span>
                <span style={{ color: "rgba(100,116,139,.4)" }}>→</span>
                <span style={{ color: "#86efac" }}>{formatDate(dateIn)} → {formatDate(dateOut)}</span>
              </div>
            )}
            {voyageurs !== RESERVATION.voyageurs && (
              <div className="flex items-center gap-2 text-xs">
                <span>👥</span>
                <span style={{ color: "rgba(100,116,139,.6)" }}>Voyageurs :</span>
                <span style={{ textDecoration: "line-through", color: "rgba(239,68,68,.6)" }}>{RESERVATION.voyageurs}</span>
                <span style={{ color: "rgba(100,116,139,.4)" }}>→</span>
                <span style={{ color: "#86efac" }}>{voyageurs}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Room card */}
      <div className="flex gap-4 rounded-2xl overflow-hidden mb-5" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)" }}>
        <img src={chambre.img} className="w-28 h-24 object-cover shrink-0" alt="" />
        <div className="py-3 pr-3 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white text-sm" style={{ fontFamily: "'Playfair Display',serif" }}>{chambre.type} · Chambre {chambre.numero}</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>{chambre.type}</span>
          </div>
          <p className="text-xs mb-1" style={{ color: "rgba(100,116,139,.6)" }}>🛏️ {chambre.lit} · 📐 {chambre.superficie}m² · Étage {RESERVATION.etage}</p>
          <p className="text-xs" style={{ color: "rgba(100,116,139,.5)" }}>📅 {formatDate(dateIn)} → {formatDate(dateOut)} · 🌙 {nights} nuits · 👥 {voyageurs} pers.</p>
          {notes && <p className="text-xs mt-1 italic" style={{ color: "rgba(167,139,250,.6)" }}>"{notes}"</p>}
        </div>
      </div>

      {/* Price */}
      <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}>
        <div className="space-y-2.5 mb-3">
          <div className="flex justify-between text-sm">
            <span style={{ color: "rgba(148,163,184,.65)" }}>€{chambre.prixNuit} × {nights} nuits</span>
            <span className="text-white font-medium">€ {prixBase}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "rgba(148,163,184,.65)" }}>Taxes & frais (10%)</span>
            <span className="text-white font-medium">€ {taxes}</span>
          </div>
        </div>
        <div className="h-px mb-3" style={{ background: "rgba(255,255,255,.07)" }} />
        <div className="flex justify-between items-center">
          <span className="font-semibold text-white">Nouveau total</span>
          <span className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display',serif", color: "#c4b5fd" }}>€ {total}</span>
        </div>
      </div>
    </div>
  );
}
