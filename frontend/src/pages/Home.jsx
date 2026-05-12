import { useState } from "react";
import ChambreCard from '../components/ChambreCard'

// ─── Data ────────────────────────────────────────────────────────────────────

const chambres = [
  {
    id: 1, numero: "101", type: "Standard", superficie: 22, lit: "1 lit double",
    prix: 120, note: 4.8, statut: "Disponible",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    equipements: ["WiFi", "TV", "Climatisation", "Sèche-cheveux"],
    description: "Chambre élégante avec vue jardin, idéale pour un séjour en couple."
  },
  {
    id: 2, numero: "102", type: "Standard", superficie: 22, lit: "1 lit double",
    prix: 120, note: 4.8, statut: "Occupée",
    img: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80",
    equipements: ["WiFi", "TV", "Climatisation"],
    description: "Chambre confortable avec décor moderne et lumières tamisées."
  },
  {
    id: 3, numero: "201", type: "Deluxe", superficie: 32, lit: "2 lits queen",
    prix: 220, note: 4.8, statut: "À nettoyer",
    img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80",
    equipements: ["WiFi", "TV 4K", "Minibar", "Balcon"],
    description: "Suite deluxe avec salon séparé et vue panoramique sur la piscine."
  },
  {
    id: 4, numero: "202", type: "Deluxe", superficie: 32, lit: "1 lit king",
    prix: 220, note: 4.8, statut: "Disponible",
    img: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&q=80",
    equipements: ["WiFi", "TV 4K", "Minibar", "Spa privé"],
    description: "Chambre king size avec baignoire balnéo et terrasse privée."
  },
  {
    id: 5, numero: "301", type: "Suite", superficie: 55, lit: "1 lit king + canapé-lit",
    prix: 380, note: 4.9, statut: "Occupée",
    img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80",
    equipements: ["WiFi", "TV 4K", "Minibar", "Jacuzzi", "Salon"],
    description: "Suite luxueuse avec salon indépendant et jacuzzi privatif."
  },
  {
    id: 6, numero: "501", type: "Présidentielle", superficie: 120, lit: "2 lits king",
    prix: 680, note: 5.0, statut: "Disponible",
    img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80",
    equipements: ["WiFi", "TV 4K", "Minibar", "Jacuzzi", "Terrasse", "Cuisine"],
    description: "La suite ultime avec terrasse 360°, cuisine privée et service butler 24h/24."
  },
];




// ─── Modal Réservation ────────────────────────────────────────────────────────

function ModalReservation({ chambre, arrivee, depart, onClose }) {
  const [step, setStep] = useState(1);
  const nights = 4;
  if (!chambre) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: step === 1 ? "50%" : "100%", transition: "width 0.4s ease" }} />
        <div className="p-6">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">✕</button>
          {step === 1 ? (
            <>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Étape 1 / 2 — Récapitulatif</p>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Confirmez votre chambre</h3>
              <div className="flex gap-4 bg-slate-50 rounded-2xl p-4 mb-4">
                <img src={chambre.img} className="w-24 h-20 object-cover rounded-xl shrink-0" alt="" />
                <div>
                  <p className="font-bold text-slate-800">{chambre.type} — Ch. {chambre.numero}</p>
                  <p className="text-slate-500 text-sm">{chambre.superficie} m² · {chambre.lit}</p>
                  <Stars note={chambre.note} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[{ l: "Arrivée", v: arrivee }, { l: "Départ", v: depart }, { l: "Durée", v: `${nights} nuits` }].map(i => (
                  <div key={i.l} className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-400">{i.l}</p>
                    <p className="font-semibold text-slate-800 text-sm">{i.v}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mb-4">
                <span className="text-slate-500">€{chambre.prix} × {nights} nuits</span>
                <span className="text-xl font-bold text-slate-800">€{chambre.prix * nights}</span>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors">
                Continuer →
              </button>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Étape 2 / 2 — Paiement</p>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Informations de paiement</h3>
              <div className="space-y-3 mb-4">
                {[["Nom complet", "Sophie Laurent"], ["Email", "sophie@lumiere.fr"], ["N° de carte", "•••• •••• •••• 4242"], ["Expiration / CVV", "04/28  •  •••"]].map(([label, ph]) => (
                  <div key={label}>
                    <label className="text-xs font-medium text-slate-500 block mb-1">{label}</label>
                    <input defaultValue={ph} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3 mb-4">
                <span className="text-blue-700 font-medium text-sm">Total à payer</span>
                <span className="text-blue-700 font-bold text-lg">€{chambre.prix * nights}</span>
              </div>
              <button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors">
                ✓ Confirmer la réservation
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page Publique ────────────────────────────────────────────────────────────

function PagePublique({ onLogin }) {
  const [arrivee, setArrivee] = useState("14 Avr 2026");
  const [depart, setDepart] = useState("18 Avr 2026");
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">L</div>
            <span className="font-bold text-slate-800 text-base" style={{ fontFamily: "sans-serif" }}>Lumière Hotels</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-500" style={{ fontFamily: "sans-serif" }}>
            <a href="#" className="hover:text-slate-800 transition-colors">Chambres</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Services</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3" style={{ fontFamily: "sans-serif" }}>
            <button onClick={onLogin} className="text-sm text-slate-600 hover:text-slate-800 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors border border-slate-200">Se connecter</button>
            <button onClick={onLogin} className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors font-medium">Inscription</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative h-[520px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80"
          className="w-full h-full object-cover"
          alt="hero"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 flex flex-col justify-center px-12 pt-14" style={{ maxWidth: 680 }}>
          <span className="inline-flex items-center gap-2 text-white/80 text-xs font-medium mb-4 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit" style={{ fontFamily: "sans-serif" }}>
            ★ Élu hôtel de l'année 2026
          </span>
          <h1 className="text-5xl font-bold text-white leading-tight mb-3">
            L'art de recevoir,<br />réinventé.
          </h1>
          <p className="text-white/70 text-base leading-relaxed mb-8" style={{ fontFamily: "sans-serif", fontStyle: "normal" }}>
            Consultez nos chambres, réservez en quelques clics, et laissez-vous porter par une expérience hôtelière sans pareille.
          </p>
          {/* Search bar */}
          <div className="flex flex-wrap items-center gap-2 bg-white rounded-2xl p-2 shadow-xl max-w-2xl" style={{ fontFamily: "sans-serif" }}>
            <div className="flex-1 min-w-32 px-3 py-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Arrivée</p>
              <input value={arrivee} onChange={e => setArrivee(e.target.value)} className="text-sm font-semibold text-slate-800 bg-transparent focus:outline-none w-full" />
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex-1 min-w-32 px-3 py-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Départ</p>
              <input value={depart} onChange={e => setDepart(e.target.value)} className="text-sm font-semibold text-slate-800 bg-transparent focus:outline-none w-full" />
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex-1 min-w-28 px-3 py-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Voyageurs</p>
              <p className="text-sm font-semibold text-slate-800">2 adultes</p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors shrink-0">
              🔍 Rechercher
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-4 gap-8 border-b border-slate-100" style={{ fontFamily: "sans-serif" }}>
        {[
          { val: "128", label: "Chambres & suites" },
          { val: "4.9★", label: "Satisfaction client" },
          { val: "24/7", label: "Conciergerie" },
          { val: "12", label: "Années d'excellence" },
        ].map(s => (
          <div key={s.label}>
            <p className="text-3xl font-bold text-slate-800">{s.val}</p>
            <p className="text-slate-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Catalogue */}
      <div className="max-w-6xl mx-auto px-6 py-12" style={{ fontFamily: "sans-serif" }}>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Catalogue</p>
        <h2 className="text-3xl font-bold text-slate-800 mb-1" style={{ fontFamily: "Georgia, serif" }}>Nos chambres</h2>
        <p className="text-slate-500 text-sm mb-8 max-w-md">Consultez prix et disponibilité — la connexion n'est requise qu'au moment de réserver.</p>
        <div className="grid grid-cols-3 gap-6">
          {chambres.map(c => (
            <ChambreCard key={c.id} c={c} onReserver={setSelected} />
          ))}
        </div>
      </div>

      {selected && <ModalReservation chambre={selected} arrivee={arrivee} depart={depart} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ─── Espace Client (connecté) ─────────────────────────────────────────────────

function EspaceClient({ onLogout }) {
  const [activeNav, setActiveNav] = useState("Réserver");
  const [activeRole, setActiveRole] = useState("Client");
  const [arrivee, setArrivee] = useState("14 Avr 2026");
  const [depart, setDepart] = useState("18 Avr 2026");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [filterTypes, setFilterTypes] = useState(["Standard", "Deluxe", "Suite", "Présidentielle"]);
  const [prixMax, setPrixMax] = useState(1000);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const types = ["Standard", "Deluxe", "Suite", "Présidentielle"];
  const equipsFiltres = ["Wi-Fi", "Petit-déj inclus", "Spa privé", "TV 4K"];

  const toggleType = t => setFilterTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const filtered = chambres.filter(c => {
    const matchType = filterTypes.some(t => c.type.includes(t));
    const matchPrix = c.prix <= prixMax;
    const matchStatut = filterStatut === "Tous" || c.statut === filterStatut;
    const matchSearch = !search || c.type.toLowerCase().includes(search.toLowerCase()) || c.numero.includes(search);
    return matchType && matchPrix && matchStatut && matchSearch;
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-slate-100 flex flex-col py-5 px-3 shrink-0">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">L</div>
          <div>
            <p className="font-bold text-slate-800 text-sm">Lumière Hotels</p>
            <p className="text-slate-400 text-xs">Espace client · Client</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {[
            { label: "Réserver", icon: "🔍" },
            { label: "Mes séjours", icon: "📅" },
          ].map(item => (
            <button key={item.label} onClick={() => setActiveNav(item.label)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${activeNav === item.label ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="text-xs text-slate-400 hover:text-slate-600 px-3 py-2 text-left">← Déconnexion</button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher chambres, clients, réservations..."
                className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm" />
            </div>
            <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm cursor-pointer relative">
              🔔
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-50" />
            </div>
          </div>
        </div>

        <div className="px-6 pb-8">
          {/* Hero banner bleu */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-6 mb-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-full opacity-10">
              <div className="w-48 h-48 rounded-full bg-white absolute -right-10 -top-10" />
              <div className="w-32 h-32 rounded-full bg-white absolute right-10 bottom-0" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Trouvez votre prochain séjour</h2>
            <p className="text-blue-100 text-sm mb-5">Consultez nos chambres disponibles et réservez en quelques clics.</p>
            <div className="flex flex-wrap items-center gap-2 bg-white rounded-xl p-2 max-w-2xl">
              <div className="flex-1 min-w-28 px-3 py-1.5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Arrivée</p>
                <input value={arrivee} onChange={e => setArrivee(e.target.value)} className="text-sm font-semibold text-slate-800 bg-transparent focus:outline-none w-full" />
              </div>
              <div className="w-px h-7 bg-slate-200" />
              <div className="flex-1 min-w-28 px-3 py-1.5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Départ</p>
                <input value={depart} onChange={e => setDepart(e.target.value)} className="text-sm font-semibold text-slate-800 bg-transparent focus:outline-none w-full" />
              </div>
              <div className="w-px h-7 bg-slate-200" />
              <div className="flex-1 min-w-24 px-3 py-1.5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Voyageurs</p>
                <p className="text-sm font-semibold text-slate-800">2 adultes</p>
              </div>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0">
                🔍 Rechercher
              </button>
            </div>
          </div>

          {/* Filtres + Grille */}
          <div className="flex gap-5">
            {/* Panneau filtres */}
            <div className="w-48 shrink-0">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sticky top-24">
                <p className="font-bold text-slate-800 text-sm mb-0.5">Filtres</p>
                <p className="text-slate-400 text-xs mb-4">Affinez votre recherche</p>

                {/* Prix */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Prix max / nuit</p>
                  <input type="range" min={80} max={1000} step={10} value={prixMax} onChange={e => setPrixMax(Number(e.target.value))}
                    className="w-full accent-blue-600 mb-1" />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>€80</span><span>€{prixMax}</span>
                  </div>
                </div>

                {/* Type */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Type</p>
                  {types.map(t => (
                    <label key={t} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input type="checkbox" checked={filterTypes.includes(t)} onChange={() => toggleType(t)}
                        className="accent-blue-600 w-4 h-4 rounded" />
                      <span className="text-sm text-slate-600">{t}</span>
                    </label>
                  ))}
                </div>

                {/* Équipements */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Équipements</p>
                  {equipsFiltres.map(e => (
                    <label key={e} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input type="checkbox" className="accent-blue-600 w-4 h-4 rounded" />
                      <span className="text-sm text-slate-600">{e}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Grille chambres */}
            <div className="flex-1">
              <p className="text-sm text-slate-400 mb-4">{filtered.length} chambre{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}</p>
              <div className="grid grid-cols-2 gap-4">
                {filtered.map(c => (
                  <ChambreCard key={c.id} c={c} onReserver={setSelected} compact />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer rôles */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 py-2.5 flex justify-center gap-2">
          {["Admin", "Réception", "Client"].map(role => (
            <button key={role} onClick={() => setActiveRole(role)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${activeRole === role ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`}>
              {role === "Admin" ? "🛡" : role === "Réception" ? "🪪" : "👤"} {role}
            </button>
          ))}
        </div>
      </main>

      {selected && <ModalReservation chambre={selected} arrivee={arrivee} depart={depart} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn
    ? <EspaceClient onLogout={() => setLoggedIn(false)} />
    : <PagePublique onLogin={() => setLoggedIn(true)} />;
}
