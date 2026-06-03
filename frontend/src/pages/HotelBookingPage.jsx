import { useState, useEffect, useRef, useMemo, useContext } from "react";
import ChambreCard from '../components/ChambreCard';
import Sidebar from "../components/SidebarReservation";
import ModalReservation from "../components/ModalReservation";
import { AppContext } from "../context/Context";

const useFont = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
};

export default function ReservationPage() {
  useFont();

  const [arrivee, setArrivee] = useState("14 Avr 2026");
  const [depart, setDepart] = useState("18 Avr 2026");
  const [voyageurs, setVoyageurs] = useState("2 adultes");
  const [search, setSearch] = useState("");
  const [prixMax, setPrixMax] = useState(1000);
  const [price, setPrice] = useState("note");
  const [filterTypes, setFilterTypes] = useState(["Standard", "Deluxe", "Suite", "Présidentielle"]);
  const [filterEquip, setFilterEquip] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { chambres } = useContext(AppContext);
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

  const filtered = useMemo(() => {
    let filterrooms = [...chambres];
    const searchValue = search.toLowerCase();
    if (search) {
      filterrooms = filterrooms.filter(item =>
        item.type.toLowerCase().includes(searchValue) ||
        item.numero.includes(search) ||
        item.statut?.toLowerCase().includes(searchValue)
      );
    }
    if (filterEquip.length > 0) {
      filterrooms = filterrooms.filter(item =>
        (item.equipements || []).some(eq => filterEquip.includes(eq.nom))
      );
    }
    if (filterTypes.length > 0) {
      filterrooms = filterrooms.filter(item => filterTypes.includes(item.type));
    }
    filterrooms = filterrooms.filter(item => item.prix_nuit <= prixMax);
    if (price === "asc") return [...filterrooms].sort((a, b) => a.prix - b.prix);
    if (price === "desc") return [...filterrooms].sort((a, b) => b.prix - a.prix);
    return filterrooms;
  }, [filterTypes, filterEquip, prixMax, search, price, chambres]);

  const stats = {
    dispo:     chambres?.filter(c => c.statut === "Disponible").length,
    occupee:   chambres?.filter(c => c.statut === "Occupée").length,
    nettoyage: chambres?.filter(c => c.statut === "À nettoyer").length,
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#f5f0eb", fontFamily: "'DM Sans', sans-serif" }}
    >
      <main ref={mainRef} className="flex-1 overflow-y-auto flex flex-col">

        {/* ── Topbar ── */}
        <div
          className="sticky top-0 z-20 px-8 py-4 transition-all duration-300"
          style={{
            background: scrolled ? "rgba(245,240,235,.97)" : "transparent",
            backdropFilter: scrolled ? "blur(16px)" : "none",
            borderBottom: scrolled ? "1px solid #ddd5c8" : "none",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une chambre, un numéro..."
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl transition-all focus:outline-none"
                style={{
                  background: "#fff",
                  border: "1px solid #ddd5c8",
                  color: "#1c1917",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onFocus={e => { e.target.style.borderColor = "#a07850"; e.target.style.boxShadow = "0 0 0 3px rgba(160,120,80,.12)"; }}
                onBlur={e => { e.target.style.borderColor = "#ddd5c8"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div
              className="relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all"
              style={{ background: "#fff", border: "1px solid #ddd5c8" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0e8e0"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              <span className="text-stone-500">🔔</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#f5f0eb]" style={{ background: "#a07850" }} />
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)" }}
            >SL</div>
          </div>
        </div>

        <div className="px-8 pb-10 flex-1">

          {/* ── Hero banner ── */}
          <div
            className="relative overflow-hidden rounded-3xl mb-8 mt-2"
            style={{
              minHeight: 240,
              background: "linear-gradient(135deg,#2c1a0e 0%,#4a2e18 40%,#3d2614 100%)",
            }}
          >
            {/* Texture overlay */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            />
            {/* Gold shimmer */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle,#d4a855,transparent)", filter: "blur(60px)", transform: "translate(30%,-30%)" }} />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle,#c8903c,transparent)", filter: "blur(40px)", transform: "translateY(40%)" }} />

            <div className="relative z-10 p-8">
              {/* Stats badges */}
              <div className="flex gap-3 mb-6 flex-wrap">
                {[
                  { label: "Disponibles", val: stats.dispo,     bg: "rgba(134,197,124,.15)", border: "rgba(134,197,124,.35)", text: "#86c57c" },
                  { label: "Occupées",    val: stats.occupee,   bg: "rgba(147,172,209,.15)", border: "rgba(147,172,209,.35)", text: "#93acd1" },
                  { label: "À nettoyer",  val: stats.nettoyage, bg: "rgba(212,168,85,.15)",  border: "rgba(212,168,85,.35)",  text: "#d4a855" },
                ].map(s => (
                  <div key={s.label}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
                  >
                    <span className="text-sm font-bold">{s.val}</span> {s.label}
                  </div>
                ))}
              </div>

              <h1
                className="text-4xl font-bold mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f5ece0", letterSpacing: "-0.01em", lineHeight: 1.15 }}
              >
                Trouvez votre prochain{" "}
                <em style={{ color: "#d4a855", fontStyle: "italic" }}>séjour</em>
              </h1>
              <p className="text-sm mb-7 max-w-md" style={{ color: "rgba(245,236,224,.5)" }}>
                Consultez nos chambres disponibles et réservez en quelques clics.
              </p>

              {/* Booking form */}
              <div
                className="flex items-stretch gap-0 flex-wrap overflow-hidden"
                style={{
                  background: "rgba(255,255,255,.06)",
                  backdropFilter: "blur(16px)",
                  borderRadius: 14,
                  border: "1px solid rgba(212,168,85,.2)",
                  maxWidth: 740,
                  boxShadow: "0 8px 32px rgba(0,0,0,.2)",
                }}
              >
                {[
                  { label: "ARRIVÉE",   val: arrivee,   set: setArrivee,   icon: "📅" },
                  { label: "DÉPART",    val: depart,    set: setDepart,    icon: "📅" },
                  { label: "VOYAGEURS", val: voyageurs, set: setVoyageurs, icon: "👥" },
                ].map((f, i) => (
                  <div key={i}
                    className="flex-1 min-w-32 flex items-center gap-2.5 px-5 py-3.5 cursor-text"
                    style={{ borderRight: i < 2 ? "1px solid rgba(212,168,85,.15)" : "none" }}
                  >
                    <span className="text-base">{f.icon}</span>
                    <div className="flex-1">
                      <p style={{ fontSize: 9, fontWeight: 600, color: "rgba(212,168,85,.7)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 2 }}>{f.label}</p>
                      <input
                        value={f.val}
                        onChange={e => f.set(e.target.value)}
                        className="bg-transparent text-sm font-semibold focus:outline-none w-full"
                        style={{ color: "#f5ece0", fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>
                  </div>
                ))}
                <button
                  className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold whitespace-nowrap transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg,#a07850,#7c5a38)",
                    color: "#fff",
                    borderLeft: "1px solid rgba(212,168,85,.2)",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
                  onMouseLeave={e => e.currentTarget.style.filter = "none"}
                >
                  🔍 Rechercher
                </button>
              </div>
            </div>
          </div>

          {/* ── Content row ── */}
          <div className="flex gap-6">
            <Sidebar
              prixMax={prixMax} setPrixMax={setPrixMax}
              filterTypes={filterTypes} toggleType={toggleType}
              filterEquip={filterEquip} toggleEquip={toggleEquip}
            />

            <div className="flex-1">
              {/* Result header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="font-semibold" style={{ color: "#1c1917", fontSize: 15 }}>
                    {filtered.length} chambre{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#a8968a" }}>Pour vos dates sélectionnées</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: "#a8968a" }}>Trier par</span>
                  <select
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="text-xs rounded-lg px-3 py-1.5 focus:outline-none transition-all"
                    style={{
                      background: "#fff",
                      border: "1px solid #ddd5c8",
                      color: "#1c1917",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <option value="note">Note</option>
                    <option value="asc">Prix croissant</option>
                    <option value="desc">Prix décroissant</option>
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
                  <div className="text-4xl mb-4">🛏️</div>
                  <p className="font-semibold" style={{ color: "#3d2614" }}>Aucune chambre ne correspond</p>
                  <p className="text-sm mt-1" style={{ color: "#a8968a" }}>Essayez de modifier vos filtres</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {selected && <ModalReservation chambre={selected} onClose={() => setSelected(null)} />}

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance:none; appearance:none;
          width:14px; height:14px; border-radius:50%;
          background:#a07850; cursor:pointer;
          box-shadow:0 0 8px rgba(160,120,80,.4);
        }
        input::placeholder { color:#b8a898; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}