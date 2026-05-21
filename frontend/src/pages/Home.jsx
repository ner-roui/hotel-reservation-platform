import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Bell,
  Calendar,
  Users,
  Wifi,
  Tv,
  Coffee,
  Waves,
  Star,
  ChevronRight,
} from "lucide-react";

import ChambreCard from '../components/ChambreCard'
import ModalReservation from "../components/ModalReservation";
import Navbar from "../components/Navbar";
import { useContext } from "react";
import { AppContext } from "../context/Context";

/* ─────────────────────────────────────────────
   GOOGLE FONT
───────────────────────────────────────────── */
const useFont = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap";

    document.head.appendChild(link);
  }, []);
};

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
// const chambres = [
//   {
//     id: 1,
//     type: "Suite Royale",
//     numero: "501",
//     prix: 680,
//     note: 5.0,
//     statut: "Disponible",
//     img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop",
//     equipements: ["WiFi", "TV 4K", "Petit-déjeuner"],
//   },
//   {
//     id: 2,
//     type: "Deluxe",
//     numero: "203",
//     prix: 320,
//     note: 4.9,
//     statut: "Occupée",
//     img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
//     equipements: ["WiFi", "TV 4K"],
//   },
//   {
//     id: 3,
//     type: "Suite Spa",
//     numero: "301",
//     prix: 480,
//     note: 4.8,
//     statut: "Disponible",
//     img: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=1400&auto=format&fit=crop",
//     equipements: ["WiFi", "Spa", "TV 4K"],
//   },
//   {
//     id: 4,
//     type: "Standard",
//     numero: "105",
//     prix: 140,
//     note: 4.7,
//     statut: "À nettoyer",
//     img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1400&auto=format&fit=crop",
//     equipements: ["WiFi", "Petit-déjeuner"],
//   },
// ];




/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function HomePage() {
  useFont();

  const [search, setSearch] = useState("");
  const [arrivee, setArrivee] = useState("14 Avr 2026");
  const [depart, setDepart] = useState("18 Avr 2026");
  const [voyageurs, setVoyageurs] = useState("2 Adultes");
  const [selected, setSelected] = useState(null);
   
   const {chambres, loading} = useContext(AppContext);
   
  const filtered = useMemo(() => {
    return chambres.filter(
      (c) =>
        c.type.toLowerCase().includes(search.toLowerCase()) ||
        c.numero.includes(search)
    );
  }, [search, chambres]);
  
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
        </div>
      );
}

  return (
    <div
      className="min-h-screen bg-[#070b14] text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* NAVBAR */}


      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop"
            alt=""
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#070b14]/70" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#070b14] via-[#070b14]/50 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[760px] max-w-7xl items-center px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 backdrop-blur-xl">
              ✨ Hôtel premium de l’année 2026
            </div>

            <h1
              className="mb-6 text-6xl font-bold leading-tight md:text-7xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              L’art du séjour,
              <br />
              réinventé.
            </h1>

            <p className="mb-10 max-w-2xl text-lg leading-8 text-slate-300">
              Découvrez une expérience hôtelière moderne avec des chambres
              luxueuses, des services premium et une réservation en quelques
              clics.
            </p>

            {/* BOOKING */}
            <div className="rounded-[32px] border border-white/10 bg-white/[0.06] p-3 backdrop-blur-2xl">
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                    <Calendar size={14} />
                    Arrivée
                  </div>

                  <input
                    value={arrivee}
                    onChange={(e) => setArrivee(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold outline-none"
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                   
                    <Calendar size={14} />
                    Départ
                  </div>

                  <input
                    value={depart}
                    onChange={(e) => setDepart(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold outline-none"
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                    <Users size={14} />
                    Voyageurs
                  </div>

                  <input
                    value={voyageurs}
                    onChange={(e) => setVoyageurs(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold outline-none"
                  />
                </div>

                <button className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-sm font-semibold transition hover:scale-[1.02]">
                  <Search size={18} />
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-10 md:grid-cols-4">
          {[
            { value: "128", label: "Chambres & suites" },
            { value: "4.9★", label: "Satisfaction client" },
            { value: "24/7", label: "Conciergerie" },
            { value: "12", label: "Années d’excellence" },
          ].map((s) => (
            <div key={s.label}>
              <h3 className="text-5xl font-bold">{s.value}</h3>
              <p className="mt-2 text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CHAMBRES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">
              Catalogue
            </p>

            <h2
              className="text-5xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Nos chambres
            </h2>
          </div>

          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une chambre..."
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-12 pr-4 text-sm outline-none backdrop-blur-xl transition focus:border-violet-500/40"
            />
          </div>
        </div>
      <div className="grid gap-7 md:grid-cols-3 xl:grid-cols-3 items-stretch">
        {filtered.map((c, i) => (
          <div
            key={c._id}
            className="h-full"
            style={{ animation: `fadeUp .4s ${i * 0.05}s ease both` }}
          >
            <ChambreCard c={c} onReserver={setSelected} />
          </div>
        ))}
      </div>
      </section>
        {/* Modal */}
            {selected && <ModalReservation chambre={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}