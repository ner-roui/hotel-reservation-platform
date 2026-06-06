import { useContext, useState, useMemo } from "react";
import { AppContext } from "../../context/Context";
import axios from "axios";
// import { useToast } from "../components/useToast";
const STATUS_LABELS = {
  PENDING:   "En attente",
  CONFIRMED: "Confirmée",
  CHECKIN:   "En cours",
  CHECKOUT:  "Terminée",
  CANCELLED: "Annulée",
};

const STATUS_STYLES = {
  PENDING:   "bg-amber-100 text-amber-700 border border-amber-200",
  CONFIRMED: "bg-violet-100 text-violet-700 border border-violet-200",
  CHECKIN:   "bg-green-100 text-green-700 border border-green-200",
  CHECKOUT:  "bg-slate-100 text-slate-500 border border-slate-200",
  CANCELLED: "bg-red-100 text-red-600 border border-red-200",
};

const STATUS_ICONS = {
  CONFIRMED: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CHECKIN: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  ),
  PENDING: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CHECKOUT: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9l3-3m0 0l3 3m-3-3v12.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CANCELLED: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

const AVATAR_COLORS = {
  PENDING:   "bg-amber-50 text-amber-600",
  CONFIRMED: "bg-violet-50 text-violet-600",
  CHECKIN:   "bg-green-50 text-green-700",
  CHECKOUT:  "bg-slate-50 text-slate-500",
  CANCELLED: "bg-red-50 text-red-500",
};

/* ── Modal Détails ── */
const DetailModal = ({ res, onClose }) => {
  if (!res) return null;

  console.log('resssssss===>', res);
  const start = new Date(res.arrivee).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const end = new Date(res.depart).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const nights = Math.ceil(
    (new Date(res.depart) - new Date(res.arrivee)) / (1000 * 60 * 60 * 24)
  );
  const total = res.prixParNuit * nights;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(44,26,14,.45)" }} />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "#fff", border: "1px solid #ddd5c8" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-[#3d2614] via-[#6b4a2e] to-[#a07850] px-6 pt-6 pb-8 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute top-4 -right-2 w-12 h-12 bg-white/10 rounded-full" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/25 transition-colors text-xs"
          >
            ✕
          </button>

          <p className="text-xs font-semibold uppercase tracking-widest text-[#e7d8c7] mb-2">
            RES-{res._id.toString().slice(-4).toUpperCase()}
          </p>

          {/* Avatar + nom */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-lg font-bold text-white">
              {res.user?.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">{res.user?.name}</p>
              <p className="text-[#c4a882] text-sm">{res.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Badge statut centré entre header et body */}
        <div className="flex justify-center -mt-4 mb-2 relative z-10">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${STATUS_STYLES[res.status]}`}>
            {STATUS_ICONS[res.status]}
            {STATUS_LABELS[res.status]}
          </span>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-4">

          {/* Chambre */}
          <div className="rounded-2xl p-4" style={{ background: "#faf7f4", border: "1px solid #ede5db" }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a8968a] mb-3">Chambre</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#f0e6db" }}>
                <svg className="w-4 h-4 text-[#a07850]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{res.chambre?.type} — Ch. {res.chambre?.numero}</p>
                <p className="text-xs text-[#a8968a]">{res.chambre?.superficie} m² · {res.chambre?.lit}</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="rounded-2xl p-4" style={{ background: "#faf7f4", border: "1px solid #ede5db" }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a8968a] mb-3">Séjour</p>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#a8968a] flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
                  </svg>
                  Arrivée
                </span>
                <span className="text-sm font-semibold text-gray-800 capitalize">{start}</span>
              </div>
              <div className="h-px" style={{ background: "#ede5db" }} />
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#a8968a] flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
                  </svg>
                  Départ
                </span>
                <span className="text-sm font-semibold text-gray-800 capitalize">{end}</span>
              </div>
              <div className="h-px" style={{ background: "#ede5db" }} />
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#a8968a]">Durée</span>
                <span className="text-sm font-semibold text-gray-800">{nights} nuit{nights > 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>

          {/* Prix */}
          <div className="rounded-2xl p-4" style={{ background: "#faf7f4", border: "1px solid #ede5db" }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a8968a] mb-3">Facturation</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#a8968a]">€{res.prixParNuit} × {nights} nuit{nights > 1 ? "s" : ""}</span>
              <span className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2614" }}>
                €{total}
              </span>
            </div>
          </div>
    {/* Paiement */}
        <div className="rounded-2xl p-4" style={{ background: "#faf7f4", border: "1px solid #ede5db" }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#a8968a] mb-3">Paiement</p>
          <div className="space-y-2.5">

            <div className="flex justify-between items-center">
              <span className="text-xs text-[#a8968a] flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
                Méthode
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f0e6db] text-[#7c5a38] border border-[#ddd5c8]">
                {res.paymentMethod === "Espèces"  && "💵 Espèce"}
                {res.paymentMethod === "Carte bancaire"   && "💳 Carte bancaire"}
                {res.paymentMethod === "Virement bancaire" && "🏦 Virement"}
                {!res.paymentMethod      && "—"}
              </span>
            </div>

            <div className="h-px" style={{ background: "#ede5db" }} />

            <div className="flex justify-between items-center">
              <span className="text-xs text-[#a8968a]">Statut paiement</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                res.paymentStatus === "PAID"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}>
                {res.paymentStatus === "PAID" ? "✓ Payée" : "⏳ En attente"}
              </span>
            </div>

            <div className="h-px" style={{ background: "#ede5db" }} />

            <div className="flex justify-between items-center">
              <span className="text-xs text-[#a8968a]">€{res.prixParNuit} × {Math.ceil((new Date(res.depart) - new Date(res.arrivee)) / (1000*60*60*24))} nuits</span>
              <span className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2614" }}>
                €{res.prixParNuit * Math.ceil((new Date(res.depart) - new Date(res.arrivee)) / (1000*60*60*24))}
              </span>
            </div>

  </div>
</div>
          {/* Fermer */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)", color: "#fff" }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Filter Button ── */
const FilterButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
      active
        ? "text-white shadow-sm"
        : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
    }`}
    style={active ? { background: "linear-gradient(135deg,#a07850,#7c5a38)" } : {}}
  >
    {label}
  </button>
);

/* ── Reservation Card ── */
const ReservationCard = ({ res, onCheckin, onCheckout, onDetail }) => {
  const start = new Date(res.arrivee).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  const end   = new Date(res.depart).toLocaleDateString("fr-FR",  { day: "numeric", month: "long" });
  const avatarColor = AVATAR_COLORS[res.status] || "bg-gray-50 text-gray-600";

  return (
    <div className="bg-white border border-[#ede5db] rounded-xl px-4 py-3.5 flex items-center gap-4 hover:border-[#ddd5c8] hover:shadow-sm transition-all cursor-pointer">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${avatarColor}`}>
        {res.user?.name[0].toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">{res.user?.name}</span>
          <span className="text-xs text-gray-400 font-normal">{`RES-${res._id.toString().slice(-4).toUpperCase()}`}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
          </svg>
          {res.chambre.type}
          <span className="text-gray-300">·</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
          </svg>
          {start} → {end}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[res.status]}`}>
          {STATUS_ICONS[res.status] || STATUS_ICONS.CONFIRMED}
          {STATUS_LABELS[res.status]}
        </span>

        {res.status === "CONFIRMED" && (
          <button
            onClick={(e) => { e.stopPropagation(); onCheckin(res._id); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-medium rounded-lg transition-colors active:scale-95"
            style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Check-in
          </button>
        )}

        {res.status === "CHECKIN" && (
          <button
            onClick={(e) => { e.stopPropagation(); onCheckout(res._id); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3H15" />
            </svg>
            Check-out
          </button>
        )}

        {/* ← Bouton Détails maintenant fonctionnel */}
        <button
          onClick={(e) => { e.stopPropagation(); onDetail(res); }}
          className="px-3 py-1.5 border border-[#ddd5c8] hover:bg-[#faf7f4] text-[#a07850] text-xs font-medium rounded-lg transition-colors"
        >
          Détails
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════ */
export default function ResEmployePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch]             = useState("");
  const [selectedRes, setSelectedRes]   = useState(null); // ← état modal
  const { reservations, setReservations } = useContext(AppContext);

  const handleCheckin = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/api/reservations/checkin/${id}`, {}, { withCredentials: true });
        setReservations((prev) =>
        prev.map((r) => {
          if (r._id === id) {
            return {
              ...r,
              status: "CHECKIN",
              paymentStatus:
                r.paymentMethod === "Espèces" ? "PAID" : r.paymentStatus,
            };
          }
          return r;
        })
      );
    } catch (err) { console.error("Checkin error:", err); }
  };

  const handleCheckout = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/api/reservations/checkout/${id}`, {}, { withCredentials: true });
      setReservations((prev) => prev.map((r) => (r._id === id ? { ...r, status: "CHECKOUT" } : r)));
    } catch (err) { console.error("Checkout error:", err); }
  };

  const filtered = useMemo(() => {
    return reservations?.filter((r) => {
      const matchFilter =
        activeFilter === "all" ||
        (activeFilter === "pending"   && r.status === "PENDING") ||
        (activeFilter === "confirmed" && r.status === "CONFIRMED") ||
        (activeFilter === "checkin"   && r.status === "CHECKIN");
      const matchSearch =
        !search ||
        r.user?.name.toLowerCase().includes(search.toLowerCase()) ||
        r._id.toString().toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [reservations, activeFilter, search]);

  const counts = {
    all:       reservations?.length,
    pending:   reservations?.filter((r) => r.status === "PENDING").length,
    confirmed: reservations?.filter((r) => r.status === "CONFIRMED").length,
    checkin:   reservations?.filter((r) => r.status === "CHECKIN").length,
  };

  return (
    <div className="flex h-screen bg-[#faf7f4] font-sans text-gray-900 overflow-hidden">

      {/* Modal détails */}
      {selectedRes && (
        <DetailModal res={selectedRes} onClose={() => setSelectedRes(null)} />
      )}

      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-[#ede5db] px-6 py-3 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-[#faf7f4] border border-[#ddd5c8] rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-[#a8968a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher chambres, clients, réservations…"
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-[#a8968a] outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="relative w-9 h-9 flex items-center justify-center border border-[#ddd5c8] rounded-lg hover:bg-[#faf7f4] transition-colors">
            <svg className="w-4 h-4 text-[#a8968a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border-2 border-white" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-5">
            <h1 className="text-xl font-semibold text-gray-900">File de réservations</h1>
            <p className="text-sm text-[#a8968a] mt-0.5">Validez les réservations, gérez check-in et check-out.</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {[
              { key: "all",       label: "Tout" },
              { key: "pending",   label: "En attente" },
              { key: "confirmed", label: "Confirmée" },
              { key: "checkin",   label: "En cours" },
            ].map(({ key, label }) => (
              <FilterButton
                key={key}
                label={`${label}${counts[key] ? ` (${counts[key]})` : ""}`}
                active={activeFilter === key}
                onClick={() => setActiveFilter(key)}
              />
            ))}
            <div className="ml-auto flex items-center gap-1.5 border border-[#ddd5c8] rounded-lg px-3 py-1.5 bg-white">
              <svg className="w-3.5 h-3.5 text-[#a8968a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Client ou n°…"
                className="text-xs outline-none bg-transparent text-gray-600 placeholder-[#a8968a] w-28"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Reservation list */}
          <div className="flex flex-col gap-2.5">
            {filtered?.length === 0 ? (
              <div className="text-center py-16 text-[#a8968a] text-sm">
                Aucune réservation trouvée.
              </div>
            ) : (
              filtered?.map((res) => (
                <ReservationCard
                  key={res._id}
                  res={res}
                  onCheckin={handleCheckin}
                  onCheckout={handleCheckout}
                  onDetail={setSelectedRes}  // ← passe la fonction
                />
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}