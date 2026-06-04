import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, X, FileText } from "lucide-react";
import ModifierModal from "../components/ModifierModal";
import { AppContext } from "../context/Context";
import axios from "axios"
import  {  Bed, 
          Ruler, 
          Calendar,
          ClipboardList,
          Circle,
          CheckCircle2,
          CreditCard,
          Lock} from "lucide-react";



const useFont = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
};

const STATUT_CFG = {
  "PENDING":   { value: "En attente", badge: "bg-amber-100 text-amber-700 border-amber-200",    dot: "bg-amber-400",  glow: "rgba(245,158,11,.15)" },
  "CONFIRMED": { value: "Confirmée",  badge: "bg-violet-100 text-violet-700 border-violet-200", dot: "bg-violet-500", glow: "rgba(124,58,237,.12)" },
  "Terminée":  { value: "Terminée",   badge: "bg-slate-100 text-slate-500 border-slate-200",    dot: "bg-slate-400",  glow: "rgba(100,116,139,.08)" },
  "CANCELLED": { value: "Annulée",    badge: "bg-red-100 text-red-600 border-red-200",          dot: "bg-red-400",    glow: "rgba(239,68,68,.1)" },
};

const PAIE_CFG = {
  "UNPAID": "bg-red-50 text-red-600 border-red-200",
  "PAID":   "bg-emerald-50 text-emerald-600 border-emerald-200",
};

/* ── Cancel Modal ───────────────────────────────────── */
function CancelModal({ sejour, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 bg-red-50 border border-red-200">✕</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>Annuler la réservation ?</h3>
          <p className="text-sm mb-1 text-slate-500">
            <span className="text-violet-600 font-semibold">{sejour._id}</span> — {sejour.type} {sejour.numero}
          </p>
          <p className="text-xs mb-6 text-slate-400">Cette action est irréversible.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition-all">Garder</button>
            <button onClick={() => { onConfirm(sejour._id); onClose(false); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", boxShadow: "0 4px 14px rgba(220,38,38,.2)" }}>Oui, annuler</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sejour Card ────────────────────────────────────── */
function SejourCard({ s, onCancel, style, setOpen }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();


  const chambre = s.chambre;
  const sc = STATUT_CFG[s.status] || STATUT_CFG["PENDING"];
  const pc = PAIE_CFG[s.paymentStatus] || PAIE_CFG["UNPAID"];
  const isActive = s.status === "PENDING" || s.status === "CONFIRMED";

  const nights = Math.max(1, Math.ceil((new Date(s.depart) - new Date(s.arrivee)) / (1000 * 60 * 60 * 24)));


  function formatReservationId(id) {
    const num = parseInt(id.slice(-4), 16); // convertit les 4 derniers caractères hexadécimaux
    const code = num.toString(36).toUpperCase();
  
    return `RES-${code}`;
  }
  


  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  };

  const onPay = (id) => navigate(`/payementpage/${id}`);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 bg-white"
      style={{
        border: hovered ? "1px solid rgba(124,58,237,.25)" : "1px solid #e2e8f0",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,.08), 0 0 0 1px rgba(124,58,237,.08)" : "0 1px 4px rgba(0,0,0,.05)",
        cursor: "pointer",
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-stretch gap-0">

        {/* Image strip */}
        <div className="relative overflow-hidden shrink-0" style={{ width: 140 }}>
          <img
            src={`http://localhost:3000${chambre?.images?.[0]}`}
            alt={chambre?.type}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{
              transform: hovered ? "scale(1.06)" : "scale(1)",
              filter: s.status === "COMPLETED" ? "brightness(.7) saturate(.6)" : "brightness(.95)",
            }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right,transparent 60%,rgba(255,255,255,.85))" }} />
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-medium bg-white/80 text-slate-600 border border-slate-200 backdrop-blur-sm">
            Étage {chambre?.etage}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-4 flex items-center gap-6 min-w-0">

          {/* Icon */}
          <div className="shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{
                background: isActive ? "rgba(124,58,237,.08)" : "#f8fafc",
                border: isActive ? "1px solid rgba(124,58,237,.2)" : "1px solid #e2e8f0",
              }}>
             <span className="flex items-center gap-1">
              <Calendar size={16} />
            </span>
            </div>
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="font-semibold text-slate-900 text-base" style={{ fontFamily: "'Playfair Display',serif" }}>
                {chambre?.type} — Ch. {chambre?.numero}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${sc.badge}`}>{sc.value}</span>
              {s.paymentStatus === "UNPAID" && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${pc}`}>Paiement requis</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <span>{formatDate(s.arrivee)} → {formatDate(s.depart)}</span>
              <span className="text-slate-300">·</span>
              <span>{nights} nuits</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-400 text-xs">{formatReservationId(s._id)}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Bed size={14} />
                {chambre?.lit}
              </span>

              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Ruler size={14} />
                {chambre?.superficie} m²
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display',serif" }}>
              €{((chambre?.prix_nuit || 0) * nights).toLocaleString()}
            </p>
            <p className="text-xs mt-0.5">
              {s.status === "CANCELLED" ? (
                <span className="text-red-500 font-medium">❌ Annulée</span>
              ) : s.paymentStatus === "PAID" ? (
                <span className="text-emerald-600 font-medium">✓ Payé</span>
              ) : (
                <span className="text-amber-500">En attente</span>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {s.paymentStatus === "UNPAID" && s.status !== "CANCELLED" && (
              <button
                  onClick={() => onPay(s._id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg,#a07850,#7c5a38)",
                    boxShadow: "0 4px 14px rgba(160,120,80,.25)"
                  }}
                  onMouseEnter={e => (
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(160,120,80,.4)"
                  )}
                  onMouseLeave={e => (
                    e.currentTarget.style.boxShadow =
                      "0 4px 14px rgba(160,120,80,.25)"
                  )}
                >
                  <Lock size={16} />
                  Payer
                </button>
            )}

            {isActive && (
              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all duration-200"
              >
                 <Pencil size={16} /> 
                 Modifier
              </button>
            )}

            {isActive && (
              <button
                onClick={() => onCancel(s)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
              >
                 <X size={16} /> 
                 Annuler
              </button>
            )}

            {s.status === "COMPLETED" && (
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all duration-200">
                 <FileText size={16} /> 
                 Facture
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
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 bg-violet-50 border border-violet-200">🛏️</div>
      <p className="font-semibold text-slate-900 text-lg mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>Aucune réservation</p>
      <p className="text-sm text-slate-400">Vous n'avez pas encore de séjours dans cet onglet.</p>
    </div>
  );
}

/* ── Root ───────────────────────────────────────────── */
export default function MesSejours() {
  useFont();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Tous");
  const { sejours, fetchSejours } = useContext(AppContext);
  const [selectedSejour, setSelectedSejour] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [notification, setNotification] = useState(null);

  const tabs = ["Tous", "En attente", "Confirmée", "Terminée", "Annulée"];

  const handleCancel = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/api/reservations/cancel/${id}`, {}, { withCredentials: true });
      fetchSejours();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  const filtered = sejours?.filter(s => {
    console.log('status', s.status, 'activite', activeTab);
    const mTab = activeTab === "Tous" || STATUT_CFG[s.status].value === activeTab;
    const mSearch = !search || s.type?.toLowerCase().includes(search.toLowerCase()) || s._id?.includes(search);
    return mTab && mSearch;
  });
  console.log('filtered=======================>', filtered);

  const stats = {
    total:      sejours?.length || 0,
    actives:    sejours?.filter(s => s.status === "PENDING" || s.status === "CONFIRMED").length || 0,
    terminees:  sejours?.filter(s => s.status === "CHECKOUT").length || 0,
    totalSpent: sejours?.filter(s => s.paymentStatus === "PAID").reduce((a, s) => a + (s.prixParNuit || 0), 0),
  };

  const statsCards = [
    {
      label: "Réservations",
      val: stats.total,
      icon: ClipboardList,
      color: "#7c3aed",
    },
    {
      label: "En cours",
      val: stats.actives,
      icon: Circle,
      color: "#059669",
    },
    {
      label: "Terminées",
      val: stats.terminees,
      icon: CheckCircle2,
      color: "#2563eb",
    },
    {
      label: "Total dépensé",
      val: `€${(stats.totalSpent || 0).toLocaleString()}`,
      icon: CreditCard,
      color: "#d97706",
    },
  ];
  

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 300 }}>

      <main className="flex-1 overflow-y-auto flex flex-col">

        {/* Topbar */}
        <div className="sticky top-0 z-20 px-8 py-4 bg-white/90 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher chambres, clients, réservations..."
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl bg-slate-100 border border-slate-200 text-slate-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 border border-slate-200 cursor-pointer hover:bg-slate-200 transition-all">
              <span className="text-slate-500">🔔</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-violet-500 border-2 border-white" />
            </div>
          </div>
        </div>

        <div className="px-8 py-7 flex-1">

          {/* Header */}
          <div className="mb-7" style={{ animation: "fadeUp .5s ease both" }}>
            <h1 className="text-2xl font-semibold text-slate-900" style={{ fontFamily: "'Playfair Display',serif" }}>Mes séjours</h1>
            <p className="text-sm mt-0.5 text-slate-400">Historique, modification et factures.</p>
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-4 gap-3 mb-7"
            style={{ animation: "fadeUp .5s .05s ease both" }}
          >
            {statsCards.map((s, i) => {
              const Icon = s.icon;

              return (
                <div
                  key={s.label}
                  className="rounded-2xl p-4 flex items-center gap-3 bg-white border border-slate-200 shadow-sm"
                  style={{ animation: `fadeUp .5s ${0.05 + i * 0.06}s ease both` }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-200 shrink-0">
                    <Icon size={18} color={s.color} />
                  </div>

                  <div>
                    <p
                      className="font-bold text-lg"
                      style={{ color: s.color, lineHeight: 1 }}
                    >
                      {s.val}
                    </p>

                    <p className="text-xs mt-0.5 text-slate-400">
                      {s.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-5 p-1 rounded-xl w-fit bg-slate-100 border border-slate-200" style={{ animation: "fadeUp .5s .1s ease both" }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: activeTab === tab ? "white" : "transparent",
                  color: activeTab === tab ? "#7c3aed" : "#94a3b8",
                  border: activeTab === tab ? "1px solid #e2e8f0" : "1px solid transparent",
                  boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,.06)" : "none",
                }}>
                {tab}
                {tab !== "Tous" && (
                  <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-500">
                    {
                      sejours?.filter((s) => {
                  
                        return STATUT_CFG[s.status].value === tab;
                      }).length || 0
                    }
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
                <SejourCard key={s._id} s={s} setOpen={() => setSelectedSejour(s)}
                  onCancel={() => setCancelTarget(s)}
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
          style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 8px 24px rgba(124,58,237,.3)", animation: "fadeUp .3s ease both" }}>
          ✓ {notification}
        </div>
      )}

      {selectedSejour && (
        <ModifierModal sejour={selectedSejour} onClose={() => setSelectedSejour(null)} />
      )}

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color:#94a3b8; }
      `}</style>
    </div>
  );
}