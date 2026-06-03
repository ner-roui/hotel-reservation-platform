import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/Context";
import { useContext } from "react";


import {
  Wifi,
  Tv,
  Snowflake,
  Wine,
  Sunrise,
  Bath,
  Sofa,
  ConciergeBell,
  Sun,
  CookingPot,
  Leaf,
  Wind,
} from "lucide-react";

 const EQUIP_ICONS = {
  "WiFi": Wifi,
  "TV": Tv,
  "TV 4K": Tv,
  "Clim": Snowflake,
  "Minibar": Wine,
  "Balcon": Sunrise,
  "Jacuzzi": Bath,
  "Salon": Sofa,
  "Butler": ConciergeBell,
  "Terrasse": Sun,
  "Cuisine": CookingPot,
  "Spa privé": Leaf,
  "Sèche-cheveux": Wind,
};

const STATUT_CFG = {
  "Disponible": { dot: "#22c55e", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "Occupée":    { dot: "#3b82f6", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  "À nettoyer": { dot: "#f59e0b", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  "Maintenance":{ dot: "#ef4444", badge: "bg-red-50 text-red-700 border-red-200" },
};



function Stars({ note }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-amber-500 text-sm">★</span>
      <span className="text-sm font-semibold" style={{ color: "#1c1917" }}>{note?.toFixed(1)}</span>
    </div>
  );
}

export default function ChambreCard({ c, onReserver }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  const sc = STATUT_CFG[c.statut] || STATUT_CFG["Disponible"];

  const handleReservation = (c) => {
    if (!user) { navigate("/login"); return; }
    onReserver(c);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 cursor-pointer"
      style={{
        background: "#fff",
        border: hovered ? "1px solid #c8a880" : "1px solid #ddd5c8",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 40px rgba(60,30,10,.12), 0 0 0 1px rgba(160,120,80,.08)"
          : "0 2px 8px rgba(60,30,10,.06)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img
          src={`http://localhost:3000${c.images[0]}`}
          alt={c.type}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
        />
        {/* subtle bottom gradient for text readability */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(20,10,5,.65) 0%,transparent 55%)" }} />

        {/* Status badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${sc.badge}`}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot, boxShadow: `0 0 5px ${sc.dot}` }} />
          {c.statut}
        </div>

        {/* Floor badge */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md"
          style={{ background: "rgba(255,255,255,.75)", color: "#3d2614", border: "1px solid rgba(255,255,255,.9)" }}
        >
          Étage {c.etage}
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div>
            <p className="text-white font-semibold text-base" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {c.type}
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,.65)" }}>
              Ch. {c.numero} · {c.superficie} m² · {c.lit}
            </p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,.85)" }}>
            <span className="text-amber-500 text-xs">★</span>
            <span className="text-xs font-semibold" style={{ color: "#1c1917" }}>{c.note?.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Equipements */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {c.equipements.slice(0, 4).map(e => (
            <span
              key={e.nom}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
              style={{
                background: "#f5f0eb",
                color: "#7a6050",
                border: "1px solid #e8ddd4",
              }}
            >
              <span className="text-xs">{EQUIP_ICONS[e] || "•"}</span> {e.nom}
            </span>
          ))}
          {c.equipements.length > 4 && (
            <span
              className="text-xs px-2 py-1 rounded-lg"
              style={{ background: "#f5f0eb", color: "#a8968a", border: "1px solid #e8ddd4" }}
            >
              +{c.equipements.length - 4}
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold" style={{ color: "#1c1917", fontFamily: "'Cormorant Garamond', serif" }}>
                €{c.prix_nuit}
              </span>
              <span className="text-sm" style={{ color: "#a8968a" }}>/nuit</span>
            </div>
            <p className="text-xs font-medium mt-0.5" style={{ color: "#22a75a" }}>✓ Annulation gratuite</p>
          </div>

          <button
            onClick={() => handleReservation(c)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
            style={{
              background: hovered
                ? "linear-gradient(135deg,#a07850,#7c5a38)"
                : "linear-gradient(135deg,#b8906a,#9a7050)",
              boxShadow: hovered ? "0 8px 20px rgba(160,120,80,.35)" : "0 2px 8px rgba(160,120,80,.15)",
            }}
          >
            Réserver <span className="text-xs">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}