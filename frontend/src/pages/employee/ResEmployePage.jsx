import { useContext, useState, useMemo } from "react";
import { AppContext } from "../../context/Context";
import axios from "axios";
// AllReservationsPage.jsx — line 5
import { DetailModal } from "../../components/DetailModal"
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
      await axios.patch(`https://hotel-reservation-platform-dgtp.onrender.com/api/reservations/checkin/${id}`, {}, { withCredentials: true });
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
      await axios.patch(`https://hotel-reservation-platform-dgtp.onrender.com/api/reservations/checkout/${id}`, {}, { withCredentials: true });
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