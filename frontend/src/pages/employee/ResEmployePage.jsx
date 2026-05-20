import { useContext } from "react";
import { useState } from "react";
import { AppContext } from "../../context/Context";

const initialReservations = [
  {
    id: "RES-2841",
    initials: "ÉR",
    name: "Émile Rousseau",
    room: "Suite 402",
    from: "12 Avr",
    to: "15 Avr",
    status: "confirmed",
    avatarColor: "bg-blue-50 text-blue-600",
  },
  {
    id: "RES-2848",
    initials: "LB",
    name: "Léa Bernard",
    room: "Deluxe 202",
    from: "13 Avr",
    to: "14 Avr",
    status: "checkin",
    avatarColor: "bg-green-50 text-green-700",
  },
  {
    id: "RES-2839",
    initials: "HM",
    name: "Hugo Martin",
    room: "Standard 101",
    from: "11 Avr",
    to: "13 Avr",
    status: "pending",
    avatarColor: "bg-orange-50 text-orange-600",
  },
  {
    id: "RES-2838",
    initials: "CP",
    name: "Camille Petit",
    room: "Présidentielle 501",
    from: "14 Avr",
    to: "18 Avr",
    status: "confirmed",
    avatarColor: "bg-purple-50 text-purple-600",
  },
];

const STATUS_LABELS = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  CHECKIN: "Check-in",
  CHECKOUT: "Check-out",
  CANCELLED: "Annulée",
};

// const STATUS_LABELS = {
//   confirmed: "Confirmée",
//   checkin: "Check-in",
//   pending: "En attente",
//   checkout: "Check-out",
// };

const STATUS_STYLES = {
  confirmed: "bg-blue-50 text-blue-700 border border-blue-100",
  checkin: "bg-green-50 text-green-700 border border-green-100",
  pending: "bg-orange-50 text-orange-600 border border-orange-100",
  checkout: "bg-emerald-50 text-emerald-700 border border-emerald-100",
};

const STATUS_ICONS = {
  confirmed: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  checkin: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  ),
  pending: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-none transition-colors ${
      active
        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`}
  >
    {icon}
    {label}
  </button>
);

const FilterButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
      active
        ? "bg-blue-600 text-white shadow-sm"
        : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
    }`}
  >
    {label}
  </button>
);

const RoleButton = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
      active ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {icon}
    {label}
  </button>
);

const ReservationCard = ({ res, onCheckin, onCheckout }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-4 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${res.avatarColor}`}>
        {res.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">{res.name}</span>
          <span className="text-xs text-gray-400 font-normal">{res.id}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
          </svg>
          {res.room}
          <span className="text-gray-300">·</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
          </svg>
          {res.from} → {res.to}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[res.status]}`}>
          {STATUS_ICONS[res.status] || STATUS_ICONS.confirmed}
          {STATUS_LABELS[res.status]}
        </span>
        {res.status === "confirmed" && (
          <button
            onClick={(e) => { e.stopPropagation(); onCheckin(res.id); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Check-in
          </button>
        )}
        {res.status === "checkin" && (
          <button
            onClick={(e) => { e.stopPropagation(); onCheckout(res.id); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3H15" />
            </svg>
            Check-out
          </button>
        )}
        <button
          onClick={(e) => e.stopPropagation()}
          className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-500 text-xs font-medium rounded-lg transition-colors"
        >
          Détails
        </button>
      </div>
    </div>
  );
};

export default function ResEmployePage() {
  // const [reservations, setReservations] = useState(initialReservations);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeRole, setActiveRole] = useState("reception");
  const [activeNav, setActiveNav] = useState("reservations");
  const [search, setSearch] = useState("");
  const {reservations} = useContext(AppContext)

  const handleCheckin = (id) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "CHECKIN" } : r))
    );
  };

  const handleCheckout = (id) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "CHECKOUT" } : r))
    );
  };

  const filtered = reservations?.filter((r) => {
    const matchFilter =
      activeFilter === "all" ||
      (activeFilter === "pending" && r.status === "pending") ||
      (activeFilter === "confirmed" && r.status === "confirmed") ||
      (activeFilter === "checkin" && r.status === "checkin");
    const matchSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: reservations?.length,
    pending: reservations?.filter((r) => r.status === "pending").length,
    confirmed: reservations?.filter((r) => r.status === "confirmed").length,
    checkin: reservations?.filter((r) => r.status === "checkin").length,
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher chambres, clients, réservations…"
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="relative w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-4.5 h-4.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-5">
            <h1 className="text-xl font-semibold text-gray-900">File de réservations</h1>
            <p className="text-sm text-gray-400 mt-0.5">Validez les réservations, gérez check-in et check-out.</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {[
              { key: "all", label: "Tout" },
              { key: "pending", label: "En attente" },
              { key: "confirmed", label: "Confirmée" },
              { key: "checkin", label: "Check-in" },
            ].map(({ key, label }) => (
              <FilterButton
                key={key}
                label={`${label}${counts[key] ? ` (${counts[key]})` : ""}`}
                active={activeFilter === key}
                onClick={() => setActiveFilter(key)}
              />
            ))}
            <div className="ml-auto flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Client ou n°…"
                className="text-xs outline-none bg-transparent text-gray-600 placeholder-gray-400 w-28"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Reservation list */}
          <div className="flex flex-col gap-2.5">
            {filtered?.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">
                Aucune réservation trouvée.
              </div>
            ) : (
              filtered.map((res) => (
                <ReservationCard
                  key={res.id}
                  res={res}
                  onCheckin={handleCheckin}
                  onCheckout={handleCheckout}
                />
              ))
            )}
          </div>
        </div>

    
       
   
      </main>
    </div>
  );
}