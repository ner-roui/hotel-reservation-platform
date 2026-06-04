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
import LumiereFooter from "../components/Footer";

const useFont = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
};

export default function HomePage() {
  useFont();

  const [search, setSearch] = useState("");
  const [arrivee, setArrivee] = useState("14 Avr 2026");
  const [depart, setDepart] = useState("18 Avr 2026");
  const [voyageurs, setVoyageurs] = useState("2 Adultes");
  const [selected, setSelected] = useState(null);

  const { chambres, loading } = useContext(AppContext);

  const filtered = useMemo(() => {
    return chambres.filter(
      (c) =>
        c.type.toLowerCase().includes(search.toLowerCase()) ||
        c.numero.includes(search)
    );
  }, [search, chambres]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-white/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[760px] max-w-7xl items-center px-6">
          <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
            ✨ Hôtel premium de l'année 2026
          </div>

            <h1
              className="mb-6 text-6xl font-bold leading-tight text-slate-900 md:text-7xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              L'art du séjour,
              <br />
              réinventé.
            </h1>

            <p className="mb-10 max-w-2xl text-lg leading-8 text-slate-600">
              Découvrez une expérience hôtelière moderne avec des chambres
              luxueuses, des services premium et une réservation en quelques clics.
            </p>

            {/* BOOKING */}
            <div className="rounded-[32px] border border-slate-200 bg-white/80 p-3 shadow-xl backdrop-blur-2xl">
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
                    <Calendar size={14} />
                    Arrivée
                  </div>
                  <input
                    value={arrivee}
                    onChange={(e) => setArrivee(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
                    <Calendar size={14} />
                    Départ
                  </div>
                  <input
                    value={depart}
                    onChange={(e) => setDepart(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
                    <Users size={14} />
                    Voyageurs
                  </div>
                  <input
                    value={voyageurs}
                    onChange={(e) => setVoyageurs(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
                  />
                </div>

                <button className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#a07850] to-[#7c5a38] px-6 py-4 text-sm font-semibold text-white transition hover:scale-[1.02] shadow-md shadow-[#a07850]/30">
                  <Search size={18} />
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-10 md:grid-cols-4">
          {[
            { value: "128", label: "Chambres & suites" },
            { value: "4.9★", label: "Satisfaction client" },
            { value: "24/7", label: "Conciergerie" },
            { value: "12", label: "Années d'excellence" },
          ].map((s) => (
            <div key={s.label}>
              <h3 className="text-5xl font-bold text-slate-900">{s.value}</h3>
              <p className="mt-2 text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CHAMBRES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#a07850]">
              Catalogue
          </p>
            <h2
              className="text-5xl font-bold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Nos chambres
            </h2>
          </div>

          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une chambre..."
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 outline-none shadow-sm transition focus:border-[#a07850] focus:ring-2 focus:ring-[#a07850]/20"
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
      {selected && (
        <ModalReservation chambre={selected} onClose={() => setSelected(null)} />
      )}

      <LumiereFooter />
    </div>
  );
}