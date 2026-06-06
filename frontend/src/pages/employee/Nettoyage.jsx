import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useToast } from "../../components/useToast";
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

export default function Nettoyage() {
  const [pending, setPending] = useState([]);
  const [done, setDone]       = useState([]);
  const [marking, setMarking] = useState(null);
  const { toast, ToastPortal } = useToast();

  function formatTime(dateString) {
    const date = new Date(dateString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
  }

  const handleMark = async (item) => {
    setMarking(item._id);
    await new Promise((r) => setTimeout(r, 600));
    const res  = await fetch(`http://localhost:3000/api/chambres/clean/${item._id}`, { method: "PUT" });
    const data = await res.json();
   
    toast.success(data.message);
    setPending((p) => p.filter((x) => x._id !== item._id));
    setDone((d) => [data.chambre, ...d]);
    setMarking(null);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const resPending = await axios.get("http://localhost:3000/api/chambres/to-clean");
        setPending(resPending.data.chambres);
        const resDone = await axios.get("http://localhost:3000/api/chambres/cleaned");
        setDone(resDone.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des chambres :", error);
      }
    };
    fetchRooms();
  }, []);

  const toClean   = pending.length;
  const available = done.length;

  return (
    <>
     <ToastPortal />
   
    <div className="flex h-screen bg-[#faf7f4] font-sans text-gray-900 overflow-hidden">

      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-[#ede5db] px-6 py-3 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-[#faf7f4] border border-[#ddd5c8] rounded-lg px-3 py-2">
            <IconSearch className="w-4 h-4 text-[#a8968a] flex-shrink-0" />
            <input
              type="text"
              placeholder="Rechercher chambres, clients, réservations…"
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-[#a8968a] outline-none"
            />
          </div>
          <button className="relative w-9 h-9 flex items-center justify-center border border-[#ddd5c8] rounded-lg hover:bg-[#faf7f4] transition-colors">
            <IconBell className="w-4 h-4 text-[#a8968a]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border-2 border-white" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Hero banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#3d2614] via-[#6b4a2e] to-[#a07850] shadow-lg shadow-[#a07850]/20 p-6">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute top-6 -right-2 w-16 h-16 bg-white/10 rounded-full" />

            <p className="text-xs font-semibold tracking-widest uppercase text-[#e7d8c7] mb-1">
              Aujourd'hui
            </p>
            <h1 className="text-2xl font-bold mb-5 text-white">
              Chambres à nettoyer
            </h1>

            <div className="flex items-center gap-6 text-[#f5eeeb]">
              <div>
                <p className="text-4xl font-bold leading-none text-white">{toClean}</p>
                <p className="text-sm text-[#e7d8c7] mt-1">à terminer</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div>
                <p className="text-4xl font-bold leading-none text-white">{available}</p>
                <p className="text-sm text-[#e7d8c7] mt-1">disponibles</p>
              </div>
              {toClean === 0 && (
                <div className="ml-auto flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 text-[#f5eeeb]">
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
                <div
                  key={item._id}
                  className="bg-white border border-[#ede5db] rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {/* icon — marron clair */}
                    <div className="w-11 h-11 rounded-xl bg-[#f5eeeb] flex items-center justify-center flex-shrink-0">
                      <IconSparkle className="w-5 h-5 text-[#a07850]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-semibold text-gray-800">
                          Chambre {item.numero}
                        </span>
                        <span className="text-xs text-[#a8968a] bg-[#faf7f4] border border-[#ddd5c8] rounded-md px-2 py-0.5">
                          Étage {item.etage}
                        </span>
                      </div>
                      <p className="text-sm text-[#a8968a] mt-0.5">
                        {item.type} · {item.superficie} m²
                      </p>
                      <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                        <IconAlert className="w-3.5 h-3.5" />
                        Priorité après check-out
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleMark(item)}
                    disabled={marking === item._id}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                      marking === item._id
                        ? "bg-[#c8a87a] text-white cursor-wait"
                        : "bg-gradient-to-r from-[#6b4a2e] to-[#a07850] hover:from-[#3d2614] hover:to-[#6b4a2e] text-white shadow-md shadow-[#a07850]/25"
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
              <p className="text-sm font-semibold text-[#a8968a] mb-2.5 px-1">
                Récemment terminées
              </p>
              <div className="bg-white border border-[#ede5db] rounded-2xl divide-y divide-[#faf7f4] shadow-sm overflow-hidden">
                {done.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 px-4 py-3.5 hover:bg-[#faf7f4] transition-colors"
                  >
                    {/* icône verte — on garde le vert car c'est sémantique (terminé = ✓) */}
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <IconCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700">
                        Chambre {item.numero}
                      </p>
                      <p className="text-xs text-[#a8968a]">
                        {item.statut} · {item.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#c4b09a]">
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
    </>
  );
}