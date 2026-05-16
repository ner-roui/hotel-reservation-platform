import { useState, useEffect, useRef, useMemo, useContext } from "react";
import ChambreCard from '../components/ChambreCard'
import Sidebar from "../components/SidebarReservation";
import ModalReservation from "../components/ModalReservation";
import { AppContext } from "../context/Context";

/* ── Font injection ─────────────────────────────────── */
const useFont = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
};

/* ── Data ───────────────────────────────────────────── */
const CHAMBRES = [
  {
    id: 1, numero: "101", type: "Standard", superficie: 22, lit: "1 lit double",
    prix: 120, note: 4.8, statut: "Disponible", etage: 1, capacite: 2,
    equipements: ["TV", "Clim", "Sèche-cheveux"],
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80",
  },
  {
    id: 2, numero: "102", type: "Standard", superficie: 22, lit: "1 lit double",
    prix: 120, note: 4.8, statut: "Occupée", etage: 1, capacite: 2,
    equipements: ["TV", "Clim"],
    img: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=700&q=80",
  },
  {
    id: 3, numero: "201", type: "Deluxe", superficie: 32, lit: "2 lits queen",
    prix: 220, note: 4.8, statut: "À nettoyer", etage: 2, capacite: 3,
    equipements: ["WiFi", "TV 4K", "Minibar", "Balcon"],
    img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=700&q=80",
  },
  {
    id: 4, numero: "202", type: "Deluxe", superficie: 32, lit: "1 lit king",
    prix: 220, note: 4.8, statut: "Disponible", etage: 2, capacite: 2,
    equipements: ["WiFi", "TV 4K", "Minibar", "Spa privé"],
    img: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=700&q=80",
  },
  {
    id: 5, numero: "301", type: "Suite", superficie: 55, lit: "1 lit king + canapé",
    prix: 380, note: 4.9, statut: "Occupée", etage: 3, capacite: 4,
    equipements: ["WiFi", "TV 4K", "Jacuzzi", "Salon", "Minibar"],
    img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=700&q=80",
  },
  {
    id: 6, numero: "302", type: "Suite", superficie: 55, lit: "1 lit king",
    prix: 380, note: 4.9, statut: "Disponible", etage: 3, capacite: 2,
    equipements: ["WiFi", "TV 4K", "Jacuzzi", "Salon"],
    img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=700&q=80",
  },
  {
    id: 7, numero: "501", type: "Présidentielle", superficie: 120, lit: "2 lits king",
    prix: 680, note: 5.0, statut: "Disponible", etage: 5, capacite: 6,
    equipements: ["WiFi", "TV 4K", "Jacuzzi", "Terrasse", "Cuisine", "Butler"],
    img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=700&q=80",
  },
  {
    id: 8, numero: "502", type: "Présidentielle", superficie: 120, lit: "2 lits king",
    prix: 680, note: 5.0, statut: "Occupée", etage: 5, capacite: 6,
    equipements: ["WiFi", "TV 4K", "Jacuzzi", "Terrasse", "Butler"],
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&q=80",
  },
];






/* ── Main App ───────────────────────────────────────── */
export default function ReservationPage() {
  useFont();

  const [activeNav, setActiveNav] = useState("Réserver");
  const [activeRole, setActiveRole] = useState("Client");
  const [arrivee, setArrivee] = useState("14 Avr 2026");
  const [depart, setDepart] = useState("18 Avr 2026");
  const [voyageurs, setVoyageurs] = useState("2 adultes");
  const [search, setSearch] = useState("");
  const [prixMax, setPrixMax] = useState(1000);
  const [price, setPrice] = useState("note")
  const [filterTypes, setFilterTypes] = useState(["Standard","Deluxe","Suite","Présidentielle"]);
  const [filterEquip, setFilterEquip] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const {chambres} = useContext(AppContext)
  const mainRef = useRef(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const h = () => setScrolled(el.scrollTop > 10);
    el.addEventListener("scroll", h);
    return () => el.removeEventListener("scroll", h);
  }, []);

  const toggleType = t => setFilterTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const toggleEquip = e => setFilterEquip(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);

 

  // const filtered = CHAMBRES.filter(c => {
  //   const mType = filterTypes.some(t => c.type === t || c.type.includes(t));
  //   const mPrix = c.prix <= prixMax;
  //   const mSearch = !search || c.type.toLowerCase().includes(search.toLowerCase()) || c.numero.includes(search) || (c.statut.toLowerCase().includes(search.toLowerCase()));
  //   return mType && mPrix && mSearch;
  // });

    const filtered = useMemo(() => {
      console.log('lllllllll', chambres)
      let filterrooms = [...chambres];

      const searchValue = search.toLowerCase();

      // SEARCH
      if (search) {
        filterrooms = filterrooms.filter(item =>
          item.type.toLowerCase().includes(searchValue) ||
          item.numero.includes(search) ||
          item.statut?.toLowerCase().includes(searchValue)
        );
      }

      // EQUIPMENTS
      if (filterEquip.length > 0) {
        filterrooms = filterrooms.filter(item =>
          (item.equipements || []).some(eq =>
            filterEquip.includes(eq)
          )
        );
      }

      // TYPES
      if (filterTypes.length > 0) {
        filterrooms = filterrooms.filter(item =>
          filterTypes.includes(item.type)
        );
      }

      // PRICE FILTER
      filterrooms = filterrooms.filter(item =>
        item.prix_nuit <= prixMax
      );
      // SORT
      if (price === "asc") {
        return [...filterrooms].sort((a, b) => a.prix - b.prix);
      }

      else if (price === "desc") {
        return [...filterrooms].sort((a, b) => b.prix - a.prix);
      }else{
        return [...filterrooms];
      }

      return filterrooms;
    }, [filterTypes, filterEquip, prixMax, search, price, chambres]);

  
  console.log('chmabres,===>', chambres);
   console.log('filtered,===>', filtered);
   
  const stats = {
    dispo: chambres?.filter(c => c.statut === "Disponible").length,
    occupee: chambres?.filter(c => c.statut === "Occupée").length,
    nettoyage: chambres?.filter(c => c.statut === "À nettoyer").length,
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#080b14", fontFamily: "'Outfit',sans-serif" }}>

      {/* ── Main ── */}
      <main ref={mainRef} className="flex-1 overflow-y-auto flex flex-col">

        {/* Top search bar */}
        <div className="sticky top-0 z-20 px-8 py-4 transition-all duration-300"
          style={{
            background: scrolled ? "rgba(8,11,20,.95)" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,.06)" : "none",
          }}>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher chambres, clients, réservations..."
                className="w-full pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 rounded-xl focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.08)",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(124,58,237,.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.08)"}
              />
            </div>
            {/* Notif */}
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
              style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}>
              <span className="text-slate-400">🔔</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-violet-500 border-2 border-slate-900" />
            </div>
            {/* Avatar */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>SL</div>
          </div>
        </div>

        <div className="px-8 pb-8 flex-1">
          {/* ── Hero banner ── */}
          <div className="relative overflow-hidden rounded-3xl mb-8 mt-2"
            style={{ minHeight: 220, background: "linear-gradient(135deg,#1a0533 0%,#0e1640 50%,#051025 100%)" }}>

            {/* Animated blobs */}
            <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle,#7c3aed,transparent)", filter: "blur(40px)" }} />
            <div className="absolute -bottom-10 right-20 w-48 h-48 rounded-full opacity-15"
              style={{ background: "radial-gradient(circle,#4f46e5,transparent)", filter: "blur(30px)" }} />
            <div className="absolute top-10 right-40 w-32 h-32 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle,#a78bfa,transparent)", filter: "blur(25px)" }} />

            {/* Decorative grid */}
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

            <div className="relative z-10 p-8">
              {/* Mini stats */}
              <div className="flex gap-3 mb-5">
                {[
                  { label: "Disponibles", val: stats.dispo,    color: "bg-emerald-400/15 text-emerald-400 border-emerald-400/20" },
                  { label: "Occupées",    val: stats.occupee,  color: "bg-blue-400/15 text-blue-400 border-blue-400/20" },
                  { label: "À nettoyer",  val: stats.nettoyage,color: "bg-amber-400/15 text-amber-400 border-amber-400/20" },
                ].map(s => (
                  <div key={s.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${s.color}`}>
                    <span className="text-base font-bold">{s.val}</span> {s.label}
                  </div>
                ))}
              </div>

              <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>
                Trouvez votre prochain <em className="text-violet-400 not-italic">séjour</em>
              </h1>
              <p className="text-slate-400 text-sm mb-7 max-w-md">
                Consultez nos chambres disponibles et réservez en quelques clics.
              </p>

              {/* Booking form */}
              <div className="flex items-stretch gap-2 flex-wrap"
                style={{ background: "rgba(255,255,255,.07)", backdropFilter: "blur(12px)", borderRadius: 16, padding: 6, border: "1px solid rgba(255,255,255,.1)", maxWidth: 720 }}>
                {[
                  { label: "ARRIVÉE",    val: arrivee,    set: setArrivee,    icon: "📅" },
                  { label: "DÉPART",     val: depart,     set: setDepart,     icon: "📅" },
                  { label: "VOYAGEURS",  val: voyageurs,  set: setVoyageurs,  icon: "👥" },
                ].map((f, i) => (
                  <div key={i} className="flex-1 min-w-32 flex items-center gap-2 px-4 py-2 rounded-xl cursor-text transition-colors"
                    style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,.08)" : "none" }}>
                    <span className="text-sm">{f.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest" style={{ fontSize: 9 }}>{f.label}</p>
                      <input value={f.val} onChange={e => f.set(e.target.value)}
                        className="bg-transparent text-white text-sm font-semibold focus:outline-none w-full" />
                    </div>
                  </div>
                ))}
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 4px 15px rgba(124,58,237,.4)" }}>
                  🔍 Rechercher
                </button>
              </div>
            </div>
          </div>

          {/* ── Content row ── */}
          <div className="flex gap-6">
            {/* Filtres */}
            <Sidebar
              prixMax={prixMax} setPrixMax={setPrixMax}
              filterTypes={filterTypes} toggleType={toggleType}
              filterEquip={filterEquip} toggleEquip={toggleEquip}
            />

            {/* Grille */}
            <div className="flex-1">
              {/* Result header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-white font-semibold">{filtered.length} chambre{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}</p>
                  <p className="text-slate-500 text-xs mt-0.5">Pour vos dates sélectionnées</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Trier par</span>
                  <select value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none"
                    style={{
                      background: "rgba(255,255,255,.06)",
                      border: "1px solid rgba(255,255,255,.08)",
                    }}
                  >
                     <option className="bg-slate-900 text-white" value="note">
                      Note
                    </option>

                    <option className="bg-slate-900 text-white" value="asc">
                      Prix croissant
                    </option>

                    <option className="bg-slate-900 text-white" value="desc">
                      Prix décroissant
                    </option>

                   
                  </select>
                </div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-3 gap-4">
                {filtered.map((c, i) => (
                  <div key={c.id} style={{ animation: `fadeUp .4s ${i * 0.05}s ease both` }}>
                    <ChambreCard c={c} onReserver={setSelected} />
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-4xl mb-3">🛏️</div>
                  <p className="text-slate-400 font-medium">Aucune chambre ne correspond</p>
                  <p className="text-slate-600 text-sm mt-1">Essayez de modifier vos filtres</p>
                </div>
              )}
            </div>
          </div>
        </div>


      </main>

      {/* Modal */}
      {selected && <ModalReservation chambre={selected} onClose={() => setSelected(null)} />}

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance:none; appearance:none;
          width:14px; height:14px; border-radius:50%;
          background:#7c3aed; cursor:pointer;
          box-shadow:0 0 8px rgba(124,58,237,.6);
        }
      `}</style>
    </div>
  );
}