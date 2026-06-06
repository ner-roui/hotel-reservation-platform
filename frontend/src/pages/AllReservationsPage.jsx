// pages/AllReservationsPage.jsx
import { useContext, useState, useMemo } from "react";
import { AppContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
// AllReservationsPage.jsx — line 5
import { DetailModal } from "../components/DetailModal";

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
  CONFIRMED: <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  CHECKIN:   <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>,
  PENDING:   <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  CHECKOUT:  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9l3-3m0 0l3 3m-3-3v12.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  CANCELLED: <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
};

function generateColor(text = "") {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = text.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash % 360)}, 70%, 55%)`;
}

function generateReservationCode(id) {
  const hex = id.replace(/[^a-fA-F0-9]/g, "");
  const number = parseInt(hex.slice(-6), 16);
  return `RES-${(number % 10000).toString().padStart(4, "0")}`;
}


/* ══════════════════════════════════════════════ */
export default function AllReservationsPage() {
  const { reservations } = useContext(AppContext);
  const navigate         = useNavigate();
  const [search,        setSearch]        = useState("");
  const [activeFilter,  setActiveFilter]  = useState("all");
  const [selectedRes,   setSelectedRes]   = useState(null);

  const counts = {
    all:       reservations?.length || 0,
    PENDING:   reservations?.filter((r) => r.status === "PENDING").length   || 0,
    CONFIRMED: reservations?.filter((r) => r.status === "CONFIRMED").length || 0,
    CHECKIN:   reservations?.filter((r) => r.status === "CHECKIN").length   || 0,
    CHECKOUT:  reservations?.filter((r) => r.status === "CHECKOUT").length  || 0,
    CANCELLED: reservations?.filter((r) => r.status === "CANCELLED").length || 0,
  };

  const filtered = useMemo(() => {
    return reservations?.filter((r) => {
      const matchFilter = activeFilter === "all" || r.status === activeFilter;
      const matchSearch =
        !search ||
        `${r.user?.prenom} ${r.user?.name}`.toLowerCase().includes(search.toLowerCase()) ||
        r._id.toString().toLowerCase().includes(search.toLowerCase()) ||
        r.chambre?.numero?.toString().includes(search);
      return matchFilter && matchSearch;
    });
  }, [reservations, activeFilter, search]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

  const filters = [
    { key: "all",       label: "Toutes" },
    { key: "PENDING",   label: "En attente" },
    { key: "CONFIRMED", label: "Confirmée" },
    { key: "CHECKIN",   label: "En cours" },
    { key: "CHECKOUT",  label: "Terminée" },
    { key: "CANCELLED", label: "Annulée" },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f4] font-sans">

      {selectedRes && <DetailModal res={selectedRes} onClose={() => setSelectedRes(null)} />}

      {/* Topbar */}
      <header className="bg-white border-b border-[#ede5db] px-8 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#a8968a] hover:text-[#3d2614] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Retour
        </button>

        <div className="w-px h-5 bg-[#ddd5c8]" />

        <h1 className="text-lg font-bold text-[#3d2614]">Toutes les réservations</h1>

        <div className="ml-auto flex items-center gap-2 bg-[#faf7f4] border border-[#ddd5c8] rounded-lg px-3 py-2 w-72">
          <svg className="w-4 h-4 text-[#a8968a] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Client, chambre, n° réservation…"
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-[#a8968a] outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="px-8 py-6">

        {/* Stats rapides */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`rounded-2xl p-4 text-left transition-all border ${
                activeFilter === key
                  ? "border-[#a07850] shadow-md"
                  : "bg-white border-[#ede5db] hover:border-[#ddd5c8] hover:shadow-sm"
              }`}
              style={activeFilter === key ? { background: "linear-gradient(135deg,#a07850,#7c5a38)" } : {}}
            >
              <p className={`text-2xl font-bold ${activeFilter === key ? "text-white" : "text-[#3d2614]"}`}>
                {counts[key] ?? counts.all}
              </p>
              <p className={`text-xs mt-1 ${activeFilter === key ? "text-[#e7d8c7]" : "text-[#a8968a]"}`}>
                {label}
              </p>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#ede5db] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#faf7f4]">
                {["N° Réservation", "Client", "Chambre", "Dates", "Montant", "Statut", "Action"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#a8968a] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-[#a8968a] text-sm">
                    Aucune réservation trouvée.
                  </td>
                </tr>
              ) : (
                filtered?.map((r, i) => {
                  const nights = Math.ceil((new Date(r.depart) - new Date(r.arrivee)) / (1000 * 60 * 60 * 24));
                  return (
                    <tr
                      key={r._id}
                      className={`hover:bg-[#faf7f4] transition-colors cursor-pointer ${i !== filtered.length - 1 ? "border-b border-[#faf7f4]" : ""}`}
                      onClick={() => setSelectedRes(r)}
                    >
                      {/* N° */}
                      <td className="px-5 py-4 text-sm text-[#a8968a] font-mono">
                        {generateReservationCode(r._id)}
                      </td>

                      {/* Client */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: generateColor(`${r.user?.prenom}${r.user?.name}`) }}
                          >
                            {r.user?.prenom?.[0]}{r.user?.name?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{r.user?.prenom} {r.user?.name}</p>
                            <p className="text-xs text-[#a8968a]">{r.user?.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Chambre */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-800">Ch. {r.chambre?.numero}</p>
                        <p className="text-xs text-[#a8968a]">{r.chambre?.type}</p>
                      </td>

                      {/* Dates */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">{formatDate(r.arrivee)} → {formatDate(r.depart)}</p>
                        <p className="text-xs text-[#a8968a]">{nights} nuit{nights > 1 ? "s" : ""}</p>
                      </td>

                      {/* Montant */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-[#3d2614]">€{r.prixParNuit * nights}</p>
                        <p className="text-xs text-[#a8968a]">€{r.prixParNuit}/nuit</p>
                      </td>

                      {/* Statut */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[r.status]}`}>
                          {STATUS_ICONS[r.status]}
                          {STATUS_LABELS[r.status]}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedRes(r)}
                          className="px-3 py-1.5 border border-[#ddd5c8] hover:bg-[#faf7f4] text-[#a07850] text-xs font-medium rounded-lg transition-colors"
                        >
                          Détails
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}