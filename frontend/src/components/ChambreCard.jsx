import { useState } from "react";
import { useNavigate } from "react-router-dom";



const STATUT_CFG = {
  "Disponible": { dot: "bg-emerald-400", badge: "bg-emerald-400/15 text-emerald-400 border-emerald-400/20", glow: "shadow-emerald-400/20" },
  "Occupée":    { dot: "bg-blue-400",    badge: "bg-blue-400/15 text-blue-400 border-blue-400/20",       glow: "shadow-blue-400/20" },
  "À nettoyer": { dot: "bg-amber-400",   badge: "bg-amber-400/15 text-amber-400 border-amber-400/20",   glow: "shadow-amber-400/20" },
  "Maintenance":{ dot: "bg-red-400",     badge: "bg-red-400/15 text-red-400 border-red-400/20",         glow: "shadow-red-400/20" },
};

const EQUIP_ICONS = { "WiFi":"📶","TV":"📺","TV 4K":"📺","Clim":"❄️","Minibar":"🥂","Balcon":"🌅","Jacuzzi":"🛁","Salon":"🛋️","Butler":"🎩","Terrasse":"☀️","Cuisine":"🍳","Spa privé":"🌿","Sèche-cheveux":"💨" };

/* ── Helpers ────────────────────────────────────────── */
function Stars({ note }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-amber-400 text-sm">★</span>
      <span className="text-sm font-semibold text-slate-200">{note?.toFixed(1)}</span>
    </div>
  );
}

/* ── Chambre Card ───────────────────────────────────── */
export default function ChambreCard({ c, onReserver }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate()
  const sc = STATUT_CFG[c.statut] || STATUT_CFG["Disponible"];
  const dispo = c.statut === "Disponible";
  const user = "nada";

  const handleReservation = (c) => {
  if (!user) {
    navigate("/login");
    return;
  }

  onReserver(c)
};
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 cursor-pointer"
      style={{
        background: hovered ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.03)",
        border: hovered ? "1px solid rgba(255,255,255,.14)" : "1px solid rgba(255,255,255,.07)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 40px rgba(0,0,0,.4)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img src={c.img} alt={c.type}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(10,12,20,.7) 0%,transparent 50%)" }} />

        {/* Status badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${sc.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} style={{ boxShadow: `0 0 6px currentColor` }} />
          {c.statut}
        </div>

        {/* Floor badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md"
          style={{ background: "rgba(0,0,0,.5)", color: "rgba(255,255,255,.7)", border: "1px solid rgba(255,255,255,.1)" }}>
          Étage {c.etage}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div>
            <p className="text-white font-semibold text-base" style={{ fontFamily: "'Playfair Display',serif" }}>{c.type}</p>
            <p className="text-white/60 text-xs">Ch. {c.numero} · {c.superficie} m² · {c.lit}</p>
          </div>
          <Stars note={c.note} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Equipements */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {c.equipements.slice(0, 4).map(e => (
            <span key={e.nom} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
              style={{ background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.5)", border: "1px solid rgba(255,255,255,.06)" }}>
              <span className="text-xs">{EQUIP_ICONS[e] || "•"}</span> {e.nom}
            </span>
          ))}
          {c.equipements.length > 4 && (
            <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.35)" }}>
              +{c.equipements.length - 4}
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">€{c.prix_nuit}</span>
              <span className="text-slate-500 text-sm">/nuit</span>
            </div>
            <p className="text-emerald-400 text-xs font-medium mt-0.5">✓ Annulation gratuite</p>
          </div>
          {dispo ? (
            <button
              onClick={() => handleReservation(c)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: hovered ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "rgba(124,58,237,.8)",
                boxShadow: hovered ? "0 8px 20px rgba(124,58,237,.4)" : "none",
              }}
            >
              Réserver <span className="text-xs">›</span>
            </button>
          ) : (
            <button disabled className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
              style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)" }}>
              Indisponible
            </button>
          )}
        </div>
      </div>
    </div>
  );
}