import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/Context";
import { useToast } from "../components/useToast";
const statutConfig = {
  "Disponible":  { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Occupée":     { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500"    },
  "À nettoyer":  { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-400"   },
  "Maintenance": { bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-500"     },
};

const typeColors = {
  "Standard":             "from-slate-400 to-slate-600",
  "Supérieure":           "from-blue-400 to-blue-600",
  "Deluxe":               "from-violet-400 to-violet-600",
  "Suite":                "from-amber-400 to-orange-500",
  "Suite Présidentielle": "from-yellow-400 to-amber-600",
};

function StarRating({ note }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(note) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs ml-0.5" style={{ color: "#a8968a" }}>{note?.toFixed(1)}</span>
    </div>
  );
}

// ── Confirm Delete Modal ───────────────────────────────────────────────────────
function ConfirmDeleteModal({ chambre, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(44,26,14,0.55)" }} />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        style={{ border: "1px solid #ede5db" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-center mb-1" style={{ color: "#2c1a0e" }}>
          Supprimer la chambre ?
        </h3>
        <p className="text-sm text-center mb-1" style={{ color: "#a8968a" }}>
          Chambre <span className="font-semibold" style={{ color: "#3d2614" }}>#{chambre.numero}</span> — {chambre.type}
        </p>
        <p className="text-xs text-center mb-6" style={{ color: "#ef4444" }}>
          Cette action est irréversible.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: "#faf7f4", color: "#6b5b52", border: "1px solid #ddd5c8" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f0e6db"}
            onMouseLeave={e => e.currentTarget.style.background = "#faf7f4"}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
            style={{
              background: loading ? "#fca5a5" : "linear-gradient(135deg,#ef4444,#dc2626)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Chambre Card ──────────────────────────────────────────────────────────────
function ChambreCard({ chambre, onSelect, onDeleteClick }) {
  const sc = statutConfig[chambre.statut];
  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group"
      style={{ border: "1px solid #ede5db" }}
    >
      {/* Image */}
      <div className="h-40 relative overflow-hidden" onClick={() => onSelect(chambre)}>
        <img src={`https://hotel-reservation-platform-dgtp.onrender.com${chambre.images[0]}`} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-bold text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
            Ch. {chambre.numero}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {chambre.statut}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Body */}
      <div className="px-4 pt-2 pb-4" onClick={() => onSelect(chambre)}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "#a8968a" }}>{chambre.type}</p>
            <p className="font-bold text-base" style={{ color: "#2c1a0e" }}>Chambre {chambre.numero}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg" style={{ color: "#a07850" }}>€{chambre.prix_nuit}</p>
            <p className="text-xs" style={{ color: "#a8968a" }}>/nuit</p>
          </div>
        </div>

        <StarRating note={chambre.note} />

        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: "Étage",    val: chambre.etage },
            { label: "Capacité", val: `${chambre.capacite} pers.` },
            { label: "Surface",  val: `${chambre.superficie}m²` },
          ].map(s => (
            <div key={s.label} className="rounded-lg px-2 py-1.5 text-center" style={{ background: "#faf7f4" }}>
              <p className="text-xs" style={{ color: "#a8968a" }}>{s.label}</p>
              <p className="font-semibold text-sm" style={{ color: "#3d2614" }}>{s.val}</p>
            </div>
          ))}
        </div>

        {chambre.client && (
          <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "#faf7f4" }}>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)" }}
            >
              {chambre.client.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: "#3d2614" }}>{chambre.client}</p>
              <p className="text-xs" style={{ color: "#a8968a" }}>{chambre.checkIn} → {chambre.checkOut}</p>
            </div>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-1">
          {chambre.equipements.slice(0, 3).map(e => (
            <span key={e.nom} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f0e6db", color: "#7c5a38" }}>
              {e.nom}
            </span>
          ))}
          {chambre.equipements.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f0e6db", color: "#7c5a38" }}>
              +{chambre.equipements.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* ── Delete button at bottom of card ── */}
      <div className="px-4 pb-4 pt-0">
        <button
          onClick={e => { e.stopPropagation(); onDeleteClick(chambre); }}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ background: "#fff1f1", color: "#ef4444", border: "1px solid #fecaca" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.borderColor = "#fca5a5"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fff1f1"; e.currentTarget.style.borderColor = "#fecaca"; }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Supprimer
        </button>
      </div>
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────
function DetailPanel({ chambre, onClose, onDeleteClick }) {
  const navigate = useNavigate();
  if (!chambre) return null;
  const sc = statutConfig[chambre.statut];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end" onClick={onClose}>
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(44,26,14,0.4)" }} />
      <div
        className="relative bg-white h-full w-full max-w-md shadow-2xl overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-40 relative overflow-hidden">
          <img className="w-full h-full object-cover block" src={`https://hotel-reservation-platform-dgtp.onrender.com${chambre.images[0]}`} />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >✕</button>
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{chambre.type}</p>
              <p className="text-white font-bold text-2xl">Chambre {chambre.numero}</p>
            </div>
            <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${sc.bg} ${sc.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{chambre.statut}
            </span>
          </div>
        </div>

        <div className="p-6 flex-1">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Étage",    val: chambre.etage },
              { label: "Surface",  val: `${chambre.superficie}m²` },
              { label: "Capacité", val: `${chambre.capacite}p` },
              { label: "Prix/nuit",val: `€${chambre.prix_nuit}` },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "#faf7f4" }}>
                <p className="text-xs mb-0.5" style={{ color: "#a8968a" }}>{s.label}</p>
                <p className="font-bold" style={{ color: "#2c1a0e" }}>{s.val}</p>
              </div>
            ))}
          </div>

          {/* Vue & Note */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: "#a8968a" }}>🌅</span>
              <span className="text-sm font-medium" style={{ color: "#6b5b52" }}>Vue {chambre.vue}</span>
            </div>
            <StarRating note={chambre.note} />
          </div>

          {/* Client */}
          {chambre.client ? (
            <div className="rounded-2xl p-4 mb-5" style={{ background: "#faf7f4", border: "1px solid #ede5db" }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#a07850" }}>Client actuel</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)" }}
                >
                  {chambre.client.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "#2c1a0e" }}>{chambre.client}</p>
                  <p className="text-sm" style={{ color: "#a8968a" }}>📅 {chambre.checkIn} → {chambre.checkOut}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-2xl p-4 mb-5 flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <p className="text-emerald-700 font-medium text-sm">Chambre disponible pour réservation</p>
            </div>
          )}

          {/* Équipements */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#a8968a" }}>Équipements</p>
            <div className="flex flex-wrap gap-2">
              {chambre.equipements.map(e => (
                <span
                  key={e.nom}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl font-medium"
                  style={{ background: "#f0e6db", color: "#7c5a38" }}
                >
                  ✓ {e.nom}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-auto">
            {chambre.statut === "À nettoyer" && (
              <button className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors">
                ✓ Marquer comme propre
              </button>
            )}
            {chambre.statut === "Maintenance" && (
              <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                ✓ Fin de maintenance
              </button>
            )}
            <button
              onClick={() => navigate(`/dashboard/edit-room/${chambre._id}`)}
              className="w-full py-3 rounded-xl font-semibold transition-colors hover:opacity-90"
              style={{ background: "#faf7f4", color: "#7c5a38", border: "1px solid #ddd5c8" }}
            >
              ✏️ Modifier la chambre
            </button>

            {/* ── DELETE button in panel ── */}
            <button
              onClick={() => onDeleteClick(chambre)}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)" }}
              onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
              onMouseLeave={e => e.currentTarget.style.filter = "none"}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer la chambre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ChambresAdmin() {
  const [search,        setSearch]        = useState("");
  const [filterStatut,  setFilterStatut]  = useState("Tous");
  const [filterType,    setFilterType]    = useState("Tous");
  const [viewMode,      setViewMode]      = useState("grid");
  const [selected,      setSelected]      = useState(null);
  const [toDelete,      setToDelete]      = useState(null);   // chambre à supprimer
  const [deleteLoading, setDeleteLoading] = useState(false);
  // const [toast,         setToast]         = useState(null);   // { type: 'success'|'error', msg }
  const { toast, ToastPortal } = useToast();
  const { chambres, lenChambres, fetchChambres } = useContext(AppContext);
  const navigate = useNavigate();

  const statuts = ["Tous", "Disponible", "Occupée", "À nettoyer", "Maintenance"];
  const types   = ["Tous", "Standard", "Supérieure", "Deluxe", "Suite", "Suite Présidentielle"];

  const filtered = chambres?.filter(c => {
    const matchSearch = c.numero.includes(search) || c.type.toLowerCase().includes(search.toLowerCase()) || (c.client && c.client.toLowerCase().includes(search.toLowerCase()));
    const matchStatut = filterStatut === "Tous" || c.statut === filterStatut;
    const matchType   = filterType   === "Tous" || c.type   === filterType;
    return matchSearch && matchStatut && matchType;
  });

  const stats = {
    total:       lenChambres,
    disponibles: chambres?.filter(c => c.statut === "Disponible").length,
    occupees:    chambres?.filter(c => c.statut === "Occupée").length,
    nettoyage:   chambres?.filter(c => c.statut === "À nettoyer").length,
    maintenance: chambres?.filter(c => c.statut === "Maintenance").length,
  };

  const statBars = [
    { label: "Total",       val: stats.total,       bg: "#3d2614", color: "#fff" },
    { label: "Disponibles", val: stats.disponibles, bg: "#059669", color: "#fff" },
    { label: "Occupées",    val: stats.occupees,    bg: "#3b82f6", color: "#fff" },
    { label: "À nettoyer",  val: stats.nettoyage,   bg: "#f59e0b", color: "#fff" },
    { label: "Maintenance", val: stats.maintenance, bg: "#ef4444", color: "#fff" },
  ];

  // ── Show toast ──────────────────────────────────────────────────────────────
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Delete handler ──────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleteLoading(true);
    try {
      await axios.delete(
        `https://hotel-reservation-platform-dgtp.onrender.com/api/chambres/delete/${toDelete._id}`,
        { withCredentials: true }
      );
     toast.success("success", `Chambre #${toDelete.numero} supprimée avec succès.`);
      setToDelete(null);
      setSelected(null);
      // Rafraîchit la liste depuis le contexte
      if (typeof fetchChambres === "function") fetchChambres();
    } catch (err) {
      toast.error("error", err.response?.data?.message || "Erreur lors de la suppression.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
     <ToastPortal />
   
    <div className="flex h-screen overflow-hidden" style={{ background: "#faf7f4", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <main className="flex-1 overflow-y-auto">

        {/* ── Topbar ── */}
        <div
          className="sticky top-0 z-20 px-8 pt-6 pb-4 backdrop-blur-sm"
          style={{ background: "rgba(250,247,244,0.95)", borderBottom: "1px solid #ede5db" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#2c1a0e" }}>Gestion des chambres 🛏️</h1>
              <p className="text-sm mt-0.5" style={{ color: "#a8968a" }}>{lenChambres} chambres au total · {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</p>
            </div>
            <button
              onClick={() => navigate("/dashboard/createroom")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)" }}
            >
              + Ajouter une chambre
            </button>
          </div>

          {/* Stats bar */}
          <div className="flex gap-3 mb-4">
            {statBars.map(s => (
              <div
                key={s.label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold"
                style={{ background: s.bg, color: s.color }}
              >
                <span className="text-lg font-bold">{s.val}</span>
                <span className="font-normal opacity-90">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#a8968a" }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="N°, type, client..."
                className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-sm focus:outline-none shadow-sm"
                style={{ border: "1px solid #ddd5c8" }}
              />
            </div>

            <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm" style={{ border: "1px solid #ddd5c8" }}>
              {statuts.map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatut(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={
                    filterStatut === s
                      ? { background: "linear-gradient(135deg,#a07850,#7c5a38)", color: "#fff" }
                      : { color: "#a8968a" }
                  }
                  onMouseEnter={e => { if (filterStatut !== s) e.currentTarget.style.background = "#faf7f4"; }}
                  onMouseLeave={e => { if (filterStatut !== s) e.currentTarget.style.background = ""; }}
                >
                  {s}
                </button>
              ))}
            </div>

            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="bg-white rounded-xl px-3 py-2 text-sm focus:outline-none shadow-sm"
              style={{ border: "1px solid #ddd5c8", color: "#6b5b52" }}
            >
              {types.map(t => <option key={t}>{t}</option>)}
            </select>

            <div className="flex items-center bg-white rounded-xl p-1 shadow-sm gap-1" style={{ border: "1px solid #ddd5c8" }}>
              <button
                onClick={() => setViewMode("grid")}
                className="p-1.5 rounded-lg transition-all"
                style={viewMode === "grid" ? { background: "linear-gradient(135deg,#a07850,#7c5a38)", color: "#fff" } : { color: "#a8968a" }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm8 0a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm8 0a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className="p-1.5 rounded-lg transition-all"
                style={viewMode === "list" ? { background: "linear-gradient(135deg,#a07850,#7c5a38)", color: "#fff" } : { color: "#a8968a" }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          <p className="text-sm mb-4" style={{ color: "#a8968a" }}>
            {filtered?.length} chambre{filtered?.length > 1 ? "s" : ""} affichée{filtered?.length > 1 ? "s" : ""}
          </p>

          {/* ── Grid view ── */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered?.map(c => (
                <ChambreCard
                  key={c._id}
                  chambre={c}
                  onSelect={setSelected}
                  onDeleteClick={setToDelete}
                />
              ))}
            </div>
          ) : (
            /* ── List view ── */
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #ede5db" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #ede5db", background: "#faf7f4" }}>
                    {["Chambre","Type","Statut","Étage","Capacité","Surface","Vue","Prix/nuit","Client","Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "#a8968a" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered?.map((c, i) => {
                    const sc = statutConfig[c.statut];
                    const tc = typeColors[c.type];
                    return (
                      <tr
                        key={c._id}
                        className="cursor-pointer transition-colors"
                        style={{ borderBottom: i !== filtered.length - 1 ? "1px solid #faf7f4" : "none" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#faf7f4"}
                        onMouseLeave={e => e.currentTarget.style.background = ""}
                      >
                        <td className="px-4 py-3" onClick={() => setSelected(c)}>
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tc} flex items-center justify-center text-sm`} />
                            <span className="font-bold" style={{ color: "#2c1a0e" }}>#{c.numero}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: "#6b5b52" }} onClick={() => setSelected(c)}>{c.type}</td>
                        <td className="px-4 py-3" onClick={() => setSelected(c)}>
                          <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${sc.bg} ${sc.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{c.statut}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#6b5b52" }} onClick={() => setSelected(c)}>{c.etage}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#6b5b52" }} onClick={() => setSelected(c)}>{c.capacite} pers.</td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#6b5b52" }} onClick={() => setSelected(c)}>{c.superficie}m²</td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: "#6b5b52" }} onClick={() => setSelected(c)}>{c.vue}</td>
                        <td className="px-4 py-3 text-sm font-bold" style={{ color: "#a07850" }} onClick={() => setSelected(c)}>€{c.prix_nuit}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#6b5b52" }} onClick={() => setSelected(c)}>
                          {c.client || <span style={{ color: "#ddd5c8" }}>—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelected(c)}
                              className="text-xs font-medium hover:opacity-70 transition-opacity"
                              style={{ color: "#a07850" }}
                            >
                              Voir →
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); setToDelete(c); }}
                              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                              style={{ background: "#fff1f1", color: "#ef4444", border: "1px solid #fecaca" }}
                              onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                              onMouseLeave={e => e.currentTarget.style.background = "#fff1f1"}
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ── Detail panel ── */}
      {selected && (
        <DetailPanel
          chambre={selected}
          onClose={() => setSelected(null)}
          onDeleteClick={setToDelete}
        />
      )}

      {/* ── Confirm delete modal ── */}
      {toDelete && (
        <ConfirmDeleteModal
          chambre={toDelete}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          loading={deleteLoading}
        />
      )}

    

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
    </>
  );
}