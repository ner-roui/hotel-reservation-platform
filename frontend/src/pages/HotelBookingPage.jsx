// ReservationPage.jsx — Recherche de chambres disponibles par dates

import { useState, useEffect, useRef, useMemo, useContext } from "react";
import ChambreCard from "../components/ChambreCard";
import Sidebar from "../components/SidebarReservation";
import ModalReservation from "../components/ModalReservation";
import { AppContext } from "../context/Context";

const useFont = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
};

export default function ReservationPage() {
  useFont();

  // ── Dates (format ISO YYYY-MM-DD pour l'API) ──────────────────────────
  const today    = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [arrivee,   setArrivee]   = useState(today.toISOString().split("T")[0]);
  const [depart,    setDepart]    = useState(tomorrow.toISOString().split("T")[0]);
  const [voyageurs, setVoyageurs] = useState(2);

  // ── Chambres : context (toutes) + résultats API (disponibles) ─────────
  const { chambres } = useContext(AppContext);

  const [chambresDisponibles, setChambresDisponibles] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchDone,    setSearchDone]    = useState(false);
  const [nbNuits,       setNbNuits]       = useState(null);

  // ── Filtres locaux ────────────────────────────────────────────────────
  const [search,       setSearch]       = useState("");
  const [prixMax,      setPrixMax]      = useState(1000);
  const [price,        setPrice]        = useState("note");
  const [filterTypes,  setFilterTypes]  = useState([
    "Standard", "Supérieure", "Deluxe", "Suite", "Suite Présidentielle",
  ]);
  const [filterEquip,  setFilterEquip]  = useState([]);
  const [selected,     setSelected]     = useState(null);
  const [scrolled,     setScrolled]     = useState(false);
  const mainRef = useRef(null);

  // ── Scroll sticky topbar ──────────────────────────────────────────────
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const h = () => setScrolled(el.scrollTop > 10);
    el.addEventListener("scroll", h);
    return () => el.removeEventListener("scroll", h);
  }, []);

  // ── Helpers filtres ───────────────────────────────────────────────────
  const toggleType  = (t) => setFilterTypes((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]);
  const toggleEquip = (e) => setFilterEquip((p) => p.includes(e) ? p.filter((x) => x !== e) : [...p, e]);

  // ──  Appel API disponibilité ────────────────────────────────────────
  const rechercherChambres = async () => {
    if (!arrivee || !depart) return;

    setLoadingSearch(true);
    try {
      const response = await fetch(
        `https://hotel-reservation-platform-dgtp.onrender.com/api/chambres/disponibles?arrivee=${arrivee}&depart=${depart}&capacite=${voyageurs}`
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();

      setChambresDisponibles(data.chambres || []);
      setNbNuits(data.nb_nuits || null);
      setSearchDone(true);
    } catch (error) {
      console.error("Erreur recherche disponibilités :", error);
      alert("Impossible de récupérer les disponibilités. Vérifiez votre connexion.");
    } finally {
      setLoadingSearch(false);
    }
  };

  // ── Source : API si recherche faite, sinon toutes les chambres ────────
  const chambresSource = searchDone ? chambresDisponibles : (chambres || []);

  // ── Filtres locaux appliqués sur la source ────────────────────────────
  const filtered = useMemo(() => {
    let result = [...chambresSource];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.type.toLowerCase().includes(s) ||
          c.numero.includes(search) ||
          c.statut?.toLowerCase().includes(s)
      );
    }

    if (filterEquip.length > 0)
      result = result.filter((c) =>
        (c.equipements || []).some((eq) => filterEquip.includes(eq.nom))
      );

    if (filterTypes.length > 0)
      result = result.filter((c) => filterTypes.includes(c.type));

    result = result.filter((c) => c.prix_nuit <= prixMax);

    if (price === "asc")  result.sort((a, b) => a.prix_nuit - b.prix_nuit);
    if (price === "desc") result.sort((a, b) => b.prix_nuit - a.prix_nuit);

    return result;
  }, [chambresSource, search, filterEquip, filterTypes, prixMax, price]);

  // ── Stats ─────────────────────────────────────────────────────────────
  const stats = {
    dispo:     (chambres || []).filter((c) => c.statut === "Disponible").length,
    occupee:   (chambres || []).filter((c) => c.statut === "Occupée").length,
    nettoyage: (chambres || []).filter((c) => c.statut === "À nettoyer").length,
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
            background:   scrolled ? "rgba(245,240,235,.97)" : "transparent",
            backdropFilter: scrolled ? "blur(16px)" : "none",
            borderBottom: scrolled ? "1px solid #ddd5c8" : "none",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une chambre, un numéro..."
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl transition-all focus:outline-none"
                style={{
                  background: "#fff",
                  border:     "1px solid #ddd5c8",
                  color:      "#1c1917",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#a07850"; e.target.style.boxShadow = "0 0 0 3px rgba(160,120,80,.12)"; }}
                onBlur={(e)  => { e.target.style.borderColor = "#ddd5c8"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            
            
          </div>
        </div>

        <div className="px-8 pb-10 flex-1">

          {/* ── Hero banner ── */}
          <div
            className="relative overflow-hidden rounded-3xl mb-8 mt-2"
            style={{
              minHeight: 260,
              background: "linear-gradient(135deg,#2c1a0e 0%,#4a2e18 40%,#3d2614 100%)",
            }}
          >
            {/* Texture */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            />
            {/* Gold glow */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle,#d4a855,transparent)", filter: "blur(60px)", transform: "translate(30%,-30%)" }} />

            <div className="relative z-10 p-8">
              {/* Stats badges */}
              <div className="flex gap-3 mb-6 flex-wrap">
                {[
                  { label: "Disponibles", val: stats.dispo,     bg: "rgba(134,197,124,.15)", border: "rgba(134,197,124,.35)", text: "#86c57c" },
                  { label: "Occupées",    val: stats.occupee,   bg: "rgba(147,172,209,.15)", border: "rgba(147,172,209,.35)", text: "#93acd1" },
                  { label: "À nettoyer",  val: stats.nettoyage, bg: "rgba(212,168,85,.15)",  border: "rgba(212,168,85,.35)",  text: "#d4a855" },
                ].map((s) => (
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
                <em style={{ color: "#d4a855" }}>séjour</em>
              </h1>
              <p className="text-sm mb-7 max-w-md" style={{ color: "rgba(245,236,224,.5)" }}>
                Sélectionnez vos dates pour voir les chambres disponibles.
              </p>

              {/* ── Formulaire de recherche par dates ── */}
              <div
                className="flex items-stretch gap-0 flex-wrap overflow-hidden"
                style={{
                  background:    "rgba(255,255,255,.06)",
                  backdropFilter:"blur(16px)",
                  borderRadius:  14,
                  border:        "1px solid rgba(212,168,85,.2)",
                  maxWidth:      740,
                  boxShadow:     "0 8px 32px rgba(0,0,0,.2)",
                }}
              >
                {/* Arrivée */}
                <div
                  className="flex-1 min-w-36 flex items-center gap-2.5 px-5 py-3.5"
                  style={{ borderRight: "1px solid rgba(212,168,85,.15)" }}
                >
                  <span className="text-base">📅</span>
                  <div className="flex-1">
                    <p style={{ fontSize: 9, fontWeight: 600, color: "rgba(212,168,85,.7)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 2 }}>
                      ARRIVÉE
                    </p>
                    <input
                      type="date"
                      value={arrivee}
                      min={today.toISOString().split("T")[0]}
                      onChange={(e) => {
                        const val = e.target.value;
                        setArrivee(val);
                        // Auto-ajuster départ au lendemain si besoin
                        const d = new Date(val);
                        d.setDate(d.getDate() + 1);
                        if (!depart || new Date(depart) <= new Date(val)) {
                          setDepart(d.toISOString().split("T")[0]);
                        }
                        setSearchDone(false); // reset résultats si dates changent
                      }}
                      className="bg-transparent text-sm font-semibold focus:outline-none w-full"
                      style={{ color: "#f5ece0", fontFamily: "'DM Sans', sans-serif", colorScheme: "dark" }}
                    />
                  </div>
                </div>

                {/* Départ */}
                <div
                  className="flex-1 min-w-36 flex items-center gap-2.5 px-5 py-3.5"
                  style={{ borderRight: "1px solid rgba(212,168,85,.15)" }}
                >
                  <span className="text-base">📅</span>
                  <div className="flex-1">
                    <p style={{ fontSize: 9, fontWeight: 600, color: "rgba(212,168,85,.7)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 2 }}>
                      DÉPART
                    </p>
                    <input
                      type="date"
                      value={depart}
                      min={arrivee || today.toISOString().split("T")[0]}
                      onChange={(e) => {
                        setDepart(e.target.value);
                        setSearchDone(false);
                      }}
                      className="bg-transparent text-sm font-semibold focus:outline-none w-full"
                      style={{ color: "#f5ece0", fontFamily: "'DM Sans', sans-serif", colorScheme: "dark" }}
                    />
                  </div>
                </div>

             
                  {/* Voyageurs */}
                  <div
                    className="flex-1 min-w-32 flex items-center gap-2.5 px-5 py-3.5"
                    style={{ borderRight: "1px solid rgba(212,168,85,.15)" }}
                  >
                    <span className="text-base">👥</span>

                    <div className="flex-1">
                      <p
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          color: "rgba(212,168,85,.7)",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          marginBottom: 2,
                        }}
                      >
                        VOYAGEURS
                      </p>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setVoyageurs((v) => Math.max(1, v - 1))}
                          className="h-7 w-7 rounded-full border flex items-center justify-center"
                          style={{
                            borderColor: "rgba(212,168,85,.3)",
                            color: "#f5ece0",
                          }}
                        >
                          −
                        </button>

                        <span
                          className="font-semibold min-w-[20px] text-center"
                          style={{ color: "#f5ece0" }}
                        >
                          {voyageurs}
                        </span>

                        <button
                          type="button"
                          onClick={() => setVoyageurs((v) => v + 1)}
                          className="h-7 w-7 rounded-full border flex items-center justify-center"
                          style={{
                            borderColor: "rgba(212,168,85,.3)",
                            color: "#f5ece0",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                {/* Bouton Rechercher */}
                <button
                  onClick={rechercherChambres}
                  disabled={loadingSearch}
                  className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold whitespace-nowrap transition-all duration-200"
                  style={{
                    background:  loadingSearch
                      ? "rgba(160,120,80,.5)"
                      : "linear-gradient(135deg,#a07850,#7c5a38)",
                    color:       "#fff",
                    cursor:      loadingSearch ? "not-allowed" : "pointer",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) => { if (!loadingSearch) e.currentTarget.style.filter = "brightness(1.12)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
                >
                  {loadingSearch ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Recherche...
                    </>
                  ) : (
                    <>🔍 Rechercher</>
                  )}
                </button>
              </div>

              {/* Badge résultat après recherche */}
              {searchDone && (
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(134,197,124,.15)", border: "1px solid rgba(134,197,124,.3)", color: "#86c57c" }}
                  >
                    ✅ {chambresDisponibles.length} chambre{chambresDisponibles.length > 1 ? "s" : ""} disponible{chambresDisponibles.length > 1 ? "s" : ""}
                    {nbNuits && ` · ${nbNuits} nuit${nbNuits > 1 ? "s" : ""}`}
                  </span>
                  <button
                    onClick={() => { setSearchDone(false); setChambresDisponibles([]); }}
                    className="text-xs px-3 py-1.5 rounded-full transition-all"
                    style={{ color: "rgba(245,236,224,.5)", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#f5ece0"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(245,236,224,.5)"}
                  >
                    ✕ Réinitialiser
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Content row ── */}
          <div className="flex gap-6">
            <Sidebar
              prixMax={prixMax}      setPrixMax={setPrixMax}
              filterTypes={filterTypes} toggleType={toggleType}
              filterEquip={filterEquip} toggleEquip={toggleEquip}
            />

            <div className="flex-1">
              {/* Entête résultats */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="font-semibold" style={{ color: "#1c1917", fontSize: 15 }}>
                    {filtered.length} chambre{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#a8968a" }}>
                    {searchDone
                      ? `Disponibles du ${arrivee} au ${depart}`
                      : "Toutes les chambres"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: "#a8968a" }}>Trier par</span>
                  <select
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="text-xs rounded-lg px-3 py-1.5 focus:outline-none"
                    style={{ background: "#fff", border: "1px solid #ddd5c8", color: "#1c1917", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <option value="note">Note</option>
                    <option value="asc">Prix croissant</option>
                    <option value="desc">Prix décroissant</option>
                  </select>
                </div>
              </div>

              {/* Grille de cartes */}
              <div className="grid grid-cols-3 gap-4">
                {filtered.map((c, i) => (
                  <div key={c._id} style={{ animation: `fadeUp .4s ${i * 0.05}s ease both` }}>
                    <ChambreCard c={c} onReserver={setSelected} />
                  </div>
                ))}
              </div>

              {filtered.length === 0 && !loadingSearch && (
                <div className="text-center py-20">
                  <div className="text-4xl mb-4">🛏️</div>
                  <p className="font-semibold" style={{ color: "#3d2614" }}>
                    {searchDone
                      ? "Aucune chambre disponible pour ces dates"
                      : "Aucune chambre ne correspond aux filtres"}
                  </p>
                  <p className="text-sm mt-1" style={{ color: "#a8968a" }}>
                    {searchDone
                      ? "Essayez d'autres dates"
                      : "Modifiez vos filtres"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {selected && (
        <ModalReservation chambre={selected} onClose={() => setSelected(null)} />
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px; border-radius: 50%;
          background: #a07850; cursor: pointer;
          box-shadow: 0 0 8px rgba(160,120,80,.4);
        }
        input[type=date]::-webkit-calendar-picker-indicator {
          filter: invert(1) opacity(0.5);
          cursor: pointer;
        }
        input::placeholder { color: #b8a898; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}