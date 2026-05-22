import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
const initialPending = [
  {
    id: 1,
    room: "Chambre 201",
    floor: "Étage 2",
    type: "Deluxe",
    size: "32 m²",
    priority: "Priorité après check-out",
  },
];

const initialDone = [
  { id: 2, room: "Chambre 101", type: "Standard", status: "Disponible", time: "08:45" },
  { id: 3, room: "Chambre 202", type: "Deluxe", status: "Disponible", time: "09:12" },
  { id: 4, room: "Chambre 402", type: "Suite", status: "Disponible", time: "09:58" },
];

/* ── icons ── */
const IconSparkle = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
);
const IconCheck = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);
const IconClock = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconAlert = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);
const IconSearch = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);
const IconBell = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);
const IconLogout = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3H15" />
  </svg>
);

/* ── sidebar nav item ── */
const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
      active
        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`}
  >
    {icon}
    {label}
  </button>
);

/* ── role pill ── */
const RolePill = ({ label, icon, active, onClick }) => (
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

/* ══════════════════════════════════════════════ */
export default function Nettoyage() {
  const [pending, setPending] = useState([]);
  const [done, setDone] = useState([]);
  const [activeNav, setActiveNav] = useState("cleaning");
  const [marking, setMarking] = useState(null);

  function formatTime(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const handleMark = async (item) => {

    setMarking(item._id);
    await new Promise((r) => setTimeout(r, 600));
    const res = await fetch(
      `http://localhost:5000/api/rooms/${item._id}/clean`,
      {
        method: "PUT",
      }
    );
  
    const updatedRoom = await res.json();
  
    setPending((p) =>
      p.filter((x) => x._id !== item._id)
    );
  
    setDone((d) => [updatedRoom, ...d]);
  
    setMarking(null);
  };

  
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        
        // Chambres à nettoyer
        const resPending = await axios.get("http://localhost:3000/api/chambres/to-clean");
        setPending(resPending.data.chambres);
        
        // Chambres nettoyées
        const resDone = await axios.get("http://localhost:3000/api/chambres/cleaned");
        setDone(resDone.data);
 
        console.log('Pending==>', resPending.data.chambres, "resDone", resDone)
  
      } catch (error) {
        console.error("Erreur lors de la récupération des chambres :", error);
      }
    };
  
    fetchRooms();
  }, []);

  // const handleMark = async (item) => {
  //   setMarking(item.id);
  //   await new Promise((r) => setTimeout(r, 600));
  //   setPending((p) => p.filter((x) => x.id !== item.id));
  //   const now = new Date();
  //   const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  //   setDone((d) => [{ id: item.id, room: item.room, type: item.type, status: "Disponible", time }, ...d]);
  //   setMarking(null);
  // };

  const toClean = pending.length;
  const available = done.length;

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <IconSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input type="text" placeholder="Rechercher chambres, clients, réservations…"
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none" />
          </div>
          <button className="relative w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <IconBell className="w-4 h-4 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Hero banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-6 text-white shadow-lg shadow-blue-200">
            {/* decorative circles */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute top-6 -right-2 w-16 h-16 bg-white/10 rounded-full" />

            <p className="text-xs font-semibold tracking-widest uppercase text-blue-200 mb-1">Aujourd'hui</p>
            <h1 className="text-2xl font-bold mb-5">Chambres à nettoyer</h1>

            <div className="flex items-center gap-6">
              <div>
                <p className="text-4xl font-bold leading-none">{toClean}</p>
                <p className="text-sm text-blue-200 mt-1">à terminer</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div>
                <p className="text-4xl font-bold leading-none">{available}</p>
                <p className="text-sm text-blue-200 mt-1">disponibles</p>
              </div>
              {toClean === 0 && (
                <div className="ml-auto flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
                  <IconCheck className="w-5 h-5" />
                  <span className="text-sm font-medium">Tout est propre !</span>
                </div>
              )}
            </div>
          </div>

          {/* Pending cards */}
          {pending.length > 0 && (
            <div className="space-y-3">
              {pending.map((item) => (
                <div key={item._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start gap-4 mb-4">
                    {/* icon */}
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <IconSparkle className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-semibold text-gray-800"> Chambre {item.numero}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 rounded-md px-2 py-0.5"> Étage {item.etage}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-0.5">{item.type} · {item.superficie} m² </p>
                        <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
                          <IconAlert className="w-3.5 h-3.5" />
                          Priorité après check-out
                        </span>
                    
                    </div>
                  </div>

                  {/* CTA button */}
                  <button
                    onClick={() => handleMark(item)}
                    disabled={marking === item._id}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                      marking === item._id
                        ? "bg-emerald-400 text-white cursor-wait"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200"
                    }`}
                  >
                    {marking === item._id ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Enregistrement…
                      </>
                    ) : (
                      <>
                        <IconCheck className="w-4 h-4" />
                        Marquer comme nettoyé
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Recently done */}
          {done.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2.5 px-1">Récemment terminées</p>
              <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50 shadow-sm overflow-hidden">
                {done.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50/60 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <IconCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700"> Chambre {item.numero}</p>
                      <p className="text-xs text-gray-400">{item.statut} · {item.type}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-300">
                      <IconClock className="w-3.5 h-3.5" />
                      {formatTime(item.updatedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

   
      </main>
    </div>
  );
}