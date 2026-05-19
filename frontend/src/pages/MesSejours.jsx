import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import ModifierModal from "../components/ModifierModal";
import { AppContext } from "../context/Context";


const useFont = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
};

/* ── Data ───────────────────────────────────────────── */
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



/* ── Data ───────────────────────────────────────────── */
const SEJOURS = [
  {
    id: "RES-2842", type: "Deluxe", numero: "202", etage: 2,
    dateIn: "14 Avr", dateOut: "17 Avr", year: "2026",
    nuits: 3, prix: 726, statut: "En attente", paiement: "Paiement requis",
    img: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&q=80",
    lit: "1 lit king", superficie: 32,
  },
  {
    id: "RES-2801", type: "Suite", numero: "301", etage: 3,
    dateIn: "02 Mar", dateOut: "05 Mar", year: "2026",
    nuits: 3, prix: 1140, statut: "Confirmée", paiement: "Payé",
    img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80",
    lit: "1 lit king + canapé", superficie: 55,
  },
  {
    id: "RES-2756", type: "Standard", numero: "101", etage: 1,
    dateIn: "10 Jan", dateOut: "13 Jan", year: "2026",
    nuits: 3, prix: 360, statut: "Terminée", paiement: "Payé",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    lit: "1 lit double", superficie: 22,
  },
  {
    id: "RES-2710", type: "Présidentielle", numero: "501", etage: 5,
    dateIn: "22 Nov", dateOut: "26 Nov", year: "2025",
    nuits: 4, prix: 2720, statut: "Terminée", paiement: "Payé",
    img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80",
    lit: "2 lits king", superficie: 120,
  },
];

// const STATUT_CFG = {
//   "En attente": { badge: "bg-amber-400/12 text-amber-400 border-amber-400/25",  dot: "bg-amber-400",   glow: "rgba(245,158,11,.3)" },
//   "Confirmée":  { badge: "bg-violet-400/12 text-violet-400 border-violet-400/25",dot: "bg-violet-400", glow: "rgba(167,139,250,.3)" },
//   "Terminée":   { badge: "bg-slate-400/12 text-slate-400 border-slate-400/20",   dot: "bg-slate-500",  glow: "rgba(100,116,139,.2)" },
//   "Annulée":    { badge: "bg-red-400/12 text-red-400 border-red-400/25",          dot: "bg-red-400",    glow: "rgba(239,68,68,.2)" },
// };


// const PAIE_CFG = {
//   "Paiement requis": "bg-red-400/10 text-red-400 border-red-400/20",
//   "Payé":            "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
// };

const STATUT_CFG = {
  "PENDING": { value : "En attente" ,badge: "bg-amber-400/12 text-amber-400 border-amber-400/25",  dot: "bg-amber-400",   glow: "rgba(245,158,11,.3)" },
  "CONFIRMED":  { value : "Confirmée" , badge: "bg-violet-400/12 text-violet-400 border-violet-400/25",dot: "bg-violet-400", glow: "rgba(167,139,250,.3)" },
  "Terminée":   { value : "Terminée" , badge: "bg-slate-400/12 text-slate-400 border-slate-400/20",   dot: "bg-slate-500",  glow: "rgba(100,116,139,.2)" },
  "CANCELLED":    { value : "Annulée" ,badge: "bg-red-400/12 text-red-400 border-red-400/25",          dot: "bg-red-400",    glow: "rgba(239,68,68,.2)" },
};



const PAIE_CFG = {
  "UNPAID": "bg-red-400/10 text-red-400 border-red-400/20",
  "PAID": "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
};

const NAV = [
  { label: "Réserver",    icon: "🔍" },
  { label: "Mes séjours", icon: "📅" },
  { label: "Favoris",     icon: "♡" },
  { label: "Paramètres",  icon: "⚙️" },
];

/* ── Cancel Modal ───────────────────────────────────── */
function CancelModal({ sejour, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(145deg,#1a1f2e,#0f1420)", border: "1px solid rgba(255,255,255,.08)" }} onClick={e => e.stopPropagation()}>
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4" style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)" }}>✕</div>
          <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>Annuler la réservation ?</h3>
          <p className="text-sm mb-1" style={{ color: "rgba(148,163,184,.7)" }}>
            <span style={{ color: "#a78bfa", fontWeight: 600 }}>{sejour.id}</span> — {sejour.type} {sejour.numero}
          </p>
          <p className="text-xs mb-6" style={{ color: "rgba(100,116,139,.6)" }}>Cette action est irréversible.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", color: "rgba(148,163,184,.8)" }}>Garder</button>
            <button onClick={() => onConfirm(sejour._id)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", boxShadow: "0 4px 14px rgba(220,38,38,.3)" }}>Oui, annuler</button>
          </div>
        </div>
      </div>
    </div>
  );
}

  /* ── Format date ── */
  const formatDate = (date) => {
    console.log(date, 'date')
    if (!date) return "";

   
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  /* ── Sejour Card ────────────────────────────────────── */
function SejourCard({ s, onPay, onCancel, style, setOpen }) {
  const [hovered, setHovered] = useState(false);

  console.log('sssss', s)
  const chambre = s.chambre;

  const sc = STATUT_CFG[s.status] || STATUT_CFG["PENDING"];
  const pc = PAIE_CFG[s.paymentStatus ] || PAIE_CFG["UNPAID"];

  const isActive = s.status === "PENDING" ||  s.status  === "CONFIRMED";

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(s.depart) - new Date(s.arrivee)) /
        (1000 * 60 * 60 * 24)
    )
  );

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: hovered
          ? "rgba(255,255,255,.06)"
          : "rgba(255,255,255,.03)",
        border: hovered
          ? "1px solid rgba(167,139,250,.22)"
          : "1px solid rgba(255,255,255,.08)",
        transform: hovered
          ? "translateY(-2px)"
          : "translateY(0)",
        boxShadow: hovered
          ? `0 16px 40px rgba(0,0,0,.4), 0 0 0 1px rgba(167,139,250,.1)`
          : "none",
        cursor: "pointer",
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-stretch gap-0">

        {/* Image strip */}
        <div
          className="relative overflow-hidden shrink-0"
          style={{ width: 140 }}
        >
          <img
            src={`http://localhost:3000${chambre?.images?.[0]}`}
            alt={chambre?.type}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{
              transform: hovered
                ? "scale(1.06)"
                : "scale(1)",
              filter:
                s.statut === "COMPLETED"
                  ? "brightness(.6) saturate(.6)"
                  : "brightness(.85)",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right,transparent 60%,rgba(8,11,20,.9))",
            }}
          />

          {/* Floor badge */}
          <div
            className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              background: "rgba(0,0,0,.55)",
              color: "rgba(255,255,255,.7)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,.1)",
            }}
          >
            Étage {chambre?.etage}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-4 flex items-center gap-6 min-w-0">

          {/* Icon */}
          <div className="shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-0"
              style={{
                background: isActive
                  ? "rgba(124,58,237,.15)"
                  : "rgba(255,255,255,.04)",
                border: isActive
                  ? "1px solid rgba(124,58,237,.3)"
                  : "1px solid rgba(255,255,255,.08)",
              }}
            >
              📅
            </div>
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">

              <span
                className="font-semibold text-white text-base"
                style={{
                  fontFamily: "'Playfair Display',serif",
                }}
              >
                {chambre?.type} — Ch. {chambre?.numero}
              </span>

              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${sc.badge}`}
              >
                {sc.value}
              </span>

              {s.paymentStatus === "UNPAID" && (
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${pc}`}
                >
                  Paiement requis
                </span>
              )}
            </div>

            <div
              className="flex items-center gap-1.5 text-sm"
              style={{ color: "rgba(148,163,184,.6)" }}
            >
              <span>
                {formatDate(s.arrivee)} →{" "}
                {formatDate(s.depart)}
              </span>

              <span
                style={{ color: "rgba(100,116,139,.4)" }}
              >
                ·
              </span>

              <span>{nights} nuits</span>

              <span
                style={{ color: "rgba(100,116,139,.4)" }}
              >
                ·
              </span>

              <span
                style={{
                  color: "rgba(100,116,139,.5)",
                  fontSize: 12,
                }}
              >
                {s._id}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <span
                className="text-xs"
                style={{ color: "rgba(100,116,139,.5)" }}
              >
                🛏️ {chambre?.lit}
              </span>

              <span
                className="text-xs"
                style={{ color: "rgba(100,116,139,.5)" }}
              >
                📐 {chambre?.superficie} m²
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <p
              className="text-xl font-bold text-white"
              style={{
                fontFamily: "'Playfair Display',serif",
              }}
            >
              €
              {(
                (chambre?.prix_nuit || 0) * nights
              ).toLocaleString()}
            </p>

            <p
              className="text-xs mt-0.5"
              style={{
                color: "rgba(100,116,139,.6)",
              }}
            >
              {s.paymentStatus === "PAID" ? (
                <span className="text-emerald-400 font-medium">
                  ✓ Payé
                </span>
              ) : (
                <span style={{ color: "#fbbf24" }}>
                  En attente
                </span>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">

            {s.paymentStatus === "UNPAID" && (
              <button
                onClick={() => onPay(s)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg,#7c3aed,#4f46e5)",
                  boxShadow:
                    "0 4px 14px rgba(124,58,237,.4)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(124,58,237,.6)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 14px rgba(124,58,237,.4)")
                }
              >
                🔒 Payer
              </button>
            )}

            {isActive && (
              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,.05)",
                  border:
                    "1px solid rgba(255,255,255,.09)",
                  color: "rgba(148,163,184,.7)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,.09)";
                  e.currentTarget.style.color =
                    "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,.05)";
                  e.currentTarget.style.color =
                    "rgba(148,163,184,.7)";
                }}
              >
                ✏️ Modifier
              </button>
            )}

            {isActive && (
              <button
                onClick={() => onCancel(s)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: "rgba(239,68,68,.08)",
                  border:
                    "1px solid rgba(239,68,68,.2)",
                  color: "rgba(248,113,113,.8)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(239,68,68,.15)";
                  e.currentTarget.style.color =
                    "#f87171";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(239,68,68,.08)";
                  e.currentTarget.style.color =
                    "rgba(248,113,113,.8)";
                }}
              >
                ✕ Annuler
              </button>
            )}

            {s.status === "COMPLETED" && (
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,.04)",
                  border:
                    "1px solid rgba(255,255,255,.07)",
                  color: "rgba(100,116,139,.6)",
                }}
              >
                📄 Facture
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Empty state ────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5" style={{ background: "rgba(124,58,237,.1)", border: "1px solid rgba(124,58,237,.2)" }}>🛏️</div>
      <p className="font-semibold text-white text-lg mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>Aucune réservation</p>
      <p className="text-sm" style={{ color: "rgba(100,116,139,.7)" }}>Vous n'avez pas encore de séjours dans cet onglet.</p>
    </div>
  );
}

/* ── Root ───────────────────────────────────────────── */
export default function MesSejours() {
  useFont();

  const [activeNav, setActiveNav] = useState("Mes séjours");
  const [activeRole, setActiveRole] = useState("Client");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Tous");
  const {sejours, setSejours} = useContext(AppContext);
  // const [sejours, setSejours] = useState(SEJOURS);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [notification, setNotification] = useState(null);
  
 const [open, setOpen] = useState(false);
  const tabs = ["Tous", "En attente", "Confirmée", "Terminée", "Annulée"];

  const handleCancel = (id) => {
    setSejours(prev => prev.map(s => s._id === id ? { ...s, status: "CANCELLED"} : s));
    console.log(sejours, 'seeeeeeeeeeejoooooooooours')
    // try{
    //     const {data} = await axios.get("http://localhost:3000/api/reservations/myreservation",{
    //       withCredentials : true
    //     })
    //     console.log(data.reservations);
    //     setSejours(data.reservations)
    //   }catch(e){
    //     console.error("Error fetching chambres:", err);
    // }
    setCancelTarget(null);
    showNotif("Réservation annulée avec succès.");
  };

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filtered = sejours?.filter(s => {
    const mTab = activeTab === "Tous" || s.statut === activeTab;
    const mSearch = !search || s.type.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search) || s.numero.includes(search);
    return mTab && mSearch;
  });

  const stats = {
    total:      sejours?.length || 0,
    actives:    sejours?.filter(s => s.statut === "En attente" || s.statut === "Confirmée").length || 0,
    terminees:  sejours?.filter(s => s.statut === "Terminée").length || 0,
    totalSpent: sejours?.filter(s => s.paiement === "Payé").reduce((a, s) => a + s.prix, 0),
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#080b14", fontFamily: "'Outfit',sans-serif", fontWeight: 300 }}>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto flex flex-col">

        {/* Topbar */}
        <div className="sticky top-0 z-20 px-8 py-4" style={{ background: "rgba(8,11,20,.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "rgba(100,116,139,.6)" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher chambres, clients, réservations..."
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl focus:outline-none transition-all"
                style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", color: "#f8fafc" }}
                onFocus={e => e.target.style.borderColor = "rgba(124,58,237,.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.08)"}
              />
            </div>
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", cursor: "pointer" }}>
              <span style={{ color: "rgba(148,163,184,.7)" }}>🔔</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2" style={{ background: "#7c3aed", borderColor: "#080b14" }} />
            </div>
          </div>
        </div>

        <div className="px-8 py-7 flex-1">

          {/* Header */}
          <div className="mb-7" style={{ animation: "fadeUp .5s ease both" }}>
            <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "'Playfair Display',serif" }}>Mes séjours</h1>
            <p className="text-sm mt-0.5" style={{ color: "rgba(100,116,139,.7)" }}>Historique, modification et factures.</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mb-7" style={{ animation: "fadeUp .5s .05s ease both" }}>
            {[
              { label: "Réservations",  val: stats.total,      icon: "📋", color: "#a78bfa" },
              { label: "En cours",      val: stats.actives,    icon: "🟢", color: "#34d399" },
              { label: "Terminées",     val: stats.terminees,  icon: "✅", color: "#60a5fa" },
              { label: "Total dépensé", val: `€${(stats.totalSpent || 0).toLocaleString()}`, icon: "💳", color: "#fbbf24" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", animation: `fadeUp .5s ${.05 + i*.06}s ease both` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}>{s.icon}</div>
                <div>
                  <p className="font-bold text-lg text-white" style={{ color: s.color, lineHeight: 1 }}>{s.val}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(100,116,139,.65)" }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-5 p-1 rounded-xl w-fit" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", animation: "fadeUp .5s .1s ease both" }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: activeTab === tab ? "rgba(124,58,237,.25)" : "transparent",
                  color: activeTab === tab ? "#c4b5fd" : "rgba(100,116,139,.7)",
                  border: activeTab === tab ? "1px solid rgba(124,58,237,.35)" : "1px solid transparent",
                }}>
                {tab}
                {tab !== "Tous" && (
                  <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,.07)", color: "rgba(148,163,184,.5)" }}>
                    {sejours?.filter(s => s.statut === tab).length || 0}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="space-y-3" style={{ animation: "fadeUp .5s .15s ease both" }}>
            {filtered?.length === 0 ? (
              <EmptyState />
            ) : (
              filtered?.map((s, i) => (
                <SejourCard key={s._id} s={s} setOpen={setOpen}
                  onPay={() => {}}
                  onCancel={(sej) => setCancelTarget(sej)}
                  style={{ animation: `fadeUp .4s ${i * .07}s ease both` }}
                />
              ))
            )}
          </div>
        </div>

      </main>

      {/* Cancel modal */}
      {cancelTarget && (
        <CancelModal sejour={cancelTarget} onConfirm={handleCancel} onClose={() => setCancelTarget(null)} />
      )}

      {/* Toast notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-sm font-medium text-white shadow-lg"
          style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 8px 24px rgba(124,58,237,.5)", animation: "fadeUp .3s ease both" }}>
          ✓ {notification}
        </div>
      )}
        {open && <ModifierModal onClose={() => setOpen(false)} />}
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color:rgba(100,116,139,.45); }
      `}</style>


    </div>
  );
}