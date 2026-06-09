import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Pencil, X, FileText, Bed, Ruler, Calendar,
  ClipboardList, Circle, CheckCircle2, CreditCard, Lock,
} from "lucide-react";
import ModifierModal from "../components/ModifierModal";
import { AppContext } from "../context/Context";
import { useToast } from "../components/useToast";

/* ── Google Fonts ───────────────────────────────────── */
const useFont = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
};

/* ── Config ─────────────────────────────────────────── */
const STATUT_CFG = {
  PENDING:   { value: "En attente", badge: "bg-amber-100 text-amber-700 border-amber-200",    dot: "bg-amber-400" },
  CHECKIN:   { value: "En cours",   badge: "bg-green-100 text-green-700 border-green-200",    dot: "bg-green-500" },
  CONFIRMED: { value: "Confirmée",  badge: "bg-violet-100 text-violet-700 border-violet-200", dot: "bg-violet-500" },
  CHECKOUT:  { value: "Terminée",   badge: "bg-slate-100 text-slate-500 border-slate-200",    dot: "bg-slate-400" },
  CANCELLED: { value: "Annulée",    badge: "bg-red-100 text-red-600 border-red-200",          dot: "bg-red-400" },
};

const PAIE_CFG = {
  UNPAID: "bg-red-50 text-red-600 border-red-200",
  PAID:   "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const formatDate = (d, opts) =>
  d ? new Date(d).toLocaleDateString("fr-FR", opts || { day: "2-digit", month: "short", year: "numeric" }) : "";

function formatReservationId(id) {
  const num = parseInt(id.slice(-4), 16);
  return `RES-${num.toString(36).toUpperCase()}`;
}

/* ══════════════════════════════════════════════════════
   INVOICE MODAL
══════════════════════════════════════════════════════ */
function InvoiceModal({ reservation, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  console.log('reservation-->', reservation);
  const invoiceNum = `FAC-${reservation._id.slice(-6).toUpperCase()}`;
  const nights     = reservation.nuits || Math.max(1, Math.ceil(
    (new Date(reservation.depart) - new Date(reservation.arrivee)) / 86400000
  ));
  const totalTTC = reservation.total || (reservation.chambre?.prix_nuit || 0) * nights;


  const fmtLong = (d) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `https://hotel-reservation-platform-dgtp.onrender.com/api/reservations/invoice/${reservation._id}/download`,
        { responseType: "blob", withCredentials: true }
      );
      const url  = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", `facture-${invoiceNum}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Impossible de télécharger la facture.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ background: "rgba(44,26,14,0.5)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl bg-white"
        style={{ border: "1px solid #ede5db" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div className="h-1" style={{ background: "linear-gradient(90deg,#a07850,#c4a882,#7c5a38)" }} />

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #ede5db", background: "#fdfbf8" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)" }}
            >L</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a07850" }}>
                Lumière Hotels
              </p>
              <p className="text-base font-semibold" style={{ fontFamily: "'Cormorant Garamond',serif", color: "#2c1a0e" }}>
                Facture {invoiceNum}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
            style={{ background: "#faf7f4", border: "1px solid #ddd5c8", color: "#a8968a" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#dc2626"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#faf7f4"; e.currentTarget.style.color = "#a8968a"; }}
          >✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a8968a" }}>
              Émise le {fmtLong(new Date())}
            </p>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" }}
            >✓ Payée</span>
          </div>

          {/* Client + Chambre */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Client",
                main: `${reservation.user?.prenom || ""} ${reservation.user?.name || ""}`.trim() || "—",
                sub: reservation.user?.email,
              },
              {
                label: "Chambre",
                main: `${reservation.chambre?.type || ""} — Ch. ${reservation.chambre?.numero || ""}`,
                sub: `Étage ${reservation.chambre?.etage || "—"} · ${reservation.chambre?.superficie || "—"} m²`,
              },
            ].map((card) => (
              <div key={card.label} className="rounded-xl p-3" style={{ background: "#faf7f4", border: "1px solid #ede5db" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#a8968a" }}>{card.label}</p>
                <p className="text-sm font-semibold" style={{ color: "#2c1a0e" }}>{card.main}</p>
                {card.sub && <p className="text-xs mt-0.5" style={{ color: "#a8968a" }}>{card.sub}</p>}
              </div>
            ))}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Arrivée", val: fmtLong(reservation.arrivee) },
              { label: "Départ",  val: fmtLong(reservation.depart)  },
              { label: "Durée",   val: `${nights} nuit${nights > 1 ? "s" : ""}` },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-2.5 text-center"
                style={{ background: "#faf7f4", border: "1px solid #ede5db" }}
              >
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#a8968a" }}>{item.label}</p>
                <p className="text-xs font-semibold" style={{ color: "#2c1a0e" }}>{item.val}</p>
              </div>
            ))}
          </div>

          {/* Line item */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #ede5db" }}>
            <div className="grid grid-cols-4 px-4 py-2" style={{ background: "#3d2614" }}>
              {["Description", "Qté", "P.U.", "Total"].map((h) => (
                <p key={h} className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#c4a882" }}>{h}</p>
              ))}
            </div>
            <div className="grid grid-cols-4 px-4 py-3 items-center" style={{ background: "#fdfbf8" }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#2c1a0e" }}>
                  {reservation.chambre?.type} — {reservation.chambre?.numero}
                </p>
                <p className="text-xs" style={{ color: "#a8968a" }}>Séjour</p>
              </div>
              <p className="text-sm" style={{ color: "#6b5b52" }}>{nights} n.</p>
              <p className="text-sm" style={{ color: "#6b5b52" }}>
                €{(reservation.chambre?.prix_nuit || reservation.prixParNuit || 0).toLocaleString("fr-FR")}
              </p>
              <p className="text-sm font-bold" style={{ color: "#2c1a0e", fontFamily: "'Cormorant Garamond',serif", fontSize: 15 }}>
                €{totalTTC.toLocaleString("fr-FR")}
              </p>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div
              className="flex justify-between items-center px-4 py-3 rounded-xl"
              style={{ background: "linear-gradient(135deg,#3d2614,#7c5a38)", minWidth: 220 }}
            >
              <span className="text-xs font-semibold" style={{ color: "#e7d8c7" }}>Total</span>
              <span className="text-base font-bold text-white" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
                €{totalTTC.toLocaleString("fr-FR")}
              </span>
            </div>
          </div>

          {/* Méthode */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "#faf7f4", border: "1px solid #ede5db" }}
          >
            <span className="text-base">💳</span>
            <p className="text-xs" style={{ color: "#a8968a" }}>
              Payé par{" "}
              <span className="font-semibold" style={{ color: "#7c5a38" }}>
                {reservation.paymentMethod || "Carte bancaire"}
              </span>
            </p>
          </div>

          {error && <p className="text-xs text-center text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3" style={{ borderTop: "1px solid #ede5db", paddingTop: 16 }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ background: "#faf7f4", border: "1px solid #ddd5c8", color: "#7c5a38" }}
          >Fermer</button>
          <button
            onClick={handleDownload}
            disabled={loading}
            className="flex-[2] py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)" }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Génération…
              </>
            ) : (
              <>⬇️ Télécharger la facture PDF</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   CANCEL MODAL
══════════════════════════════════════════════════════ */
function CancelModal({ sejour, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 bg-red-50 border border-red-200">✕</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>
            Annuler la réservation ?
          </h3>
          <p className="text-sm mb-1 text-slate-500">
            <span className="text-amber-800 font-semibold">{formatReservationId(sejour._id)}</span> — {sejour.chambre?.type} {sejour.chambre?.numero}
          </p>
          <p className="text-xs mb-6 text-slate-400">Cette action est irréversible.</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition-all"
            >Garder</button>
            <button
              onClick={() => { onConfirm(sejour._id); onClose(); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", boxShadow: "0 4px 14px rgba(220,38,38,.2)" }}
            >Oui, annuler</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SEJOUR CARD
══════════════════════════════════════════════════════ */
function SejourCard({ s, onCancel, onInvoice, onModify, style }) {

  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const chambre  = s.chambre;
  const sc       = STATUT_CFG[s.status] || STATUT_CFG["PENDING"];
  const pc       = PAIE_CFG[s.paymentStatus] || PAIE_CFG["UNPAID"];
  const isActive = s.status === "PENDING" || s.status === "CONFIRMED";
  const isDone   = s.status === "CHECKOUT" || s.status === "CHECKIN";

  const nights = Math.max(1, Math.ceil(
    (new Date(s.depart) - new Date(s.arrivee)) / 86400000
  ));

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 bg-white"
      style={{
        border:    hovered ? "1px solid rgba(124,58,237,.25)" : "1px solid #e2e8f0",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 32px rgba(0,0,0,.08), 0 0 0 1px rgba(124,58,237,.08)"
          : "0 1px 4px rgba(0,0,0,.05)",
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-stretch gap-0">

        {/* Image strip */}
        <div className="relative overflow-hidden shrink-0" style={{ width: 140 }}>
          <img
            src={`https://hotel-reservation-platform-dgtp.onrender.com${chambre?.images?.[0]}`}
            alt={chambre?.type}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{
              transform: hovered ? "scale(1.06)" : "scale(1)",
              filter: s.status === "CANCELLED" ? "brightness(.7) saturate(.6)" : "brightness(.95)",
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
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: isActive ? "rgba(124,58,237,.08)" : "#f8fafc",
                border:     isActive ? "1px solid rgba(124,58,237,.2)" : "1px solid #e2e8f0",
              }}
            >
              <Calendar size={16} className={isActive ? "text-violet-500" : "text-slate-400"} />
            </div>
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="font-semibold text-slate-900 text-base" style={{ fontFamily: "'Playfair Display',serif" }}>
                {chambre?.type} — Ch. {chambre?.numero}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${sc.badge}`}>{sc.value}</span>
              {s.paymentStatus === "UNPAID" && s.status !== "CANCELLED" && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${pc}`}>Paiement requis</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-1">
              <span>{formatDate(s.arrivee)} → {formatDate(s.depart)}</span>
              <span className="text-slate-300">·</span>
              <span>{nights} nuits</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs">{formatReservationId(s._id)}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-xs text-slate-400"><Bed size={14} />{chambre?.lit}</span>
              <span className="flex items-center gap-1 text-xs text-slate-400"><Ruler size={14} />{chambre?.superficie} m²</span>
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
            {/* Payer */}
            {s.paymentStatus === "UNPAID" && s.status !== "CANCELLED" && (
              <button
                onClick={() => navigate(`/payementpage/${s._id}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)", boxShadow: "0 4px 14px rgba(160,120,80,.25)" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(160,120,80,.4)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 14px rgba(160,120,80,.25)")}
              >
                <Lock size={16} /> Payer
              </button>
            )}

            {/* Modifier */}
            {isActive && (
              <button
                onClick={() => onModify(s)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all duration-200"
              >
                <Pencil size={16} /> Modifier
              </button>
            )}

            {/* Annuler */}
            {isActive && (
              <button
                onClick={() => onCancel(s)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
              >
                <X size={16} /> Annuler
              </button>
            )}

            {/* Facture — disponible si statut CHECKOUT ou CHECKIN et payé */}
            {(isDone || s.paymentStatus === "PAID") && s.status !== "CANCELLED" && (
              <button
                onClick={() => onInvoice(s)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg,#fdfbf8,#faf3ec)",
                  border: "1px solid #ddd5c8",
                  color: "#7c5a38",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg,#f5ede2,#ede1d0)";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(160,120,80,.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg,#fdfbf8,#faf3ec)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <FileText size={16} /> Facture
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 bg-violet-50 border border-violet-200">🛏️</div>
      <p className="font-semibold text-slate-900 text-lg mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>Aucune réservation</p>
      <p className="text-sm text-slate-400">Vous n'avez pas encore de séjours dans cet onglet.</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ROOT — MesSejours
══════════════════════════════════════════════════════ */
export default function MesSejours() {
  useFont();

  const [search,         setSearch]         = useState("");
  const [activeTab,      setActiveTab]       = useState("Tous");
  const [selectedSejour, setSelectedSejour]  = useState(null); // pour ModifierModal
  const [cancelTarget,   setCancelTarget]    = useState(null); // pour CancelModal
  const [invoiceTarget,  setInvoiceTarget]   = useState(null); // pour InvoiceModal ← NEW
  const [notification,   setNotification]    = useState(null);

  const { sejours, fetchSejours } = useContext(AppContext);
  const { toast, ToastPortal } = useToast();
  const tabs = ["Tous", "En attente", "En cours", "Confirmée", "Terminée", "Annulée"];

  const handleCancel = async (id) => {
    try {
      await axios.patch(`https://hotel-reservation-platform-dgtp.onrender.com/api/reservations/cancel/${id}`, {}, { withCredentials: true });
      fetchSejours();
      toast.success("Réservation annulée avec succès.");
     
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  const filtered = sejours?.filter((s) => {
    const mTab    = activeTab === "Tous" || (STATUT_CFG[s.status]?.value === activeTab);
    const mSearch = !search ||
      s.chambre?.type?.toLowerCase().includes(search.toLowerCase()) ||
      s._id?.includes(search);
    return mTab && mSearch;
  });

  const stats = {
    total:      sejours?.length || 0,
    actives:    sejours?.filter((s) => s.status === "PENDING" || s.status === "CONFIRMED").length || 0,
    terminees:  sejours?.filter((s) => s.status === "CHECKOUT").length || 0,
    totalSpent: sejours?.filter((s) => s.paymentStatus === "PAID").reduce((a, s) => a + (s.total || 0), 0) || 0,
  };

  const statsCards = [
    { label: "Réservations",  val: stats.total,               icon: ClipboardList, color: "#7c3aed" },
    { label: "En cours",      val: stats.actives,             icon: Circle,        color: "#059669" },
    { label: "Terminées",     val: stats.terminees,           icon: CheckCircle2,  color: "#2563eb" },
    { label: "Total dépensé", val: `€${stats.totalSpent.toLocaleString()}`, icon: CreditCard, color: "#d97706" },
  ];

  return (
    <>
     <ToastPortal />
    
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 300 }}>
      <main className="flex-1 overflow-y-auto flex flex-col">

        {/* Topbar */}
        <div className="sticky top-0 z-20 px-8 py-4 bg-white/90 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">🔍</span>
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher chambres, clients, réservations…"
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl bg-slate-100 border border-slate-200 text-slate-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>
           
          </div>
        </div>

        <div className="px-8 py-7 flex-1">

          {/* Header */}
          <div className="mb-7" style={{ animation: "fadeUp .5s ease both" }}>
            <h1 className="text-2xl font-semibold text-slate-900" style={{ fontFamily: "'Playfair Display',serif" }}>Mes séjours</h1>
            <p className="text-sm mt-0.5 text-slate-400">Historique, modification et factures.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-7" style={{ animation: "fadeUp .5s .05s ease both" }}>
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
                    <p className="font-bold text-lg" style={{ color: s.color, lineHeight: 1 }}>{s.val}</p>
                    <p className="text-xs mt-0.5 text-slate-400">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-5 p-1 rounded-xl w-fit bg-slate-100 border border-slate-200" style={{ animation: "fadeUp .5s .1s ease both" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: activeTab === tab ? "white" : "transparent",
                  color:      activeTab === tab ? "#7c3aed" : "#94a3b8",
                  border:     activeTab === tab ? "1px solid #e2e8f0" : "1px solid transparent",
                  boxShadow:  activeTab === tab ? "0 1px 4px rgba(0,0,0,.06)" : "none",
                }}
              >
                {tab}
                {tab !== "Tous" && (
                  <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-500">
                    {sejours?.filter((s) => STATUT_CFG[s.status]?.value === tab).length || 0}
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
                <SejourCard
                  key={s._id}
                  s={s}
                  onCancel={() => setCancelTarget(s)}
                  onModify={() => setSelectedSejour(s)}
                  onInvoice={() => setInvoiceTarget(s)}
                  style={{ animation: `fadeUp .4s ${i * 0.07}s ease both` }}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {cancelTarget  && <CancelModal  sejour={cancelTarget}  onConfirm={handleCancel} onClose={() => setCancelTarget(null)} />}
      {selectedSejour && <ModifierModal sejour={selectedSejour} onClose={() => setSelectedSejour(null)} />}
      {invoiceTarget  && <InvoiceModal  reservation={invoiceTarget} onClose={() => setInvoiceTarget(null)} />}

      {/* Toast */}
      {notification && (
        <div
          className="fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-sm font-medium text-white shadow-lg"
          style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 8px 24px rgba(124,58,237,.3)", animation: "fadeUp .3s ease both" }}
        >
          ✓ {notification}
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color:#94a3b8; }
      `}</style>
    </div>
    </>
  );
}