import { useState } from "react";
import { useNavigate } from "react-router-dom";

const chambres = [
  { id: 1, numero: "101", type: "Standard", etage: 1, capacite: 2, prix: 80, statut: "Disponible", superficie: 22, vue: "Jardin", equipements: ["WiFi", "TV", "Climatisation", "Sèche-cheveux"], client: null, checkIn: null, checkOut: null, note: 4.2, image: "🛏️" },
  { id: 2, numero: "102", type: "Standard", etage: 1, capacite: 2, prix: 80, statut: "Occupée", superficie: 22, vue: "Jardin", equipements: ["WiFi", "TV", "Climatisation"], client: "Marc Dupont", checkIn: "08 Mai", checkOut: "11 Mai", note: 4.5, image: "🛏️" },
  { id: 3, numero: "201", type: "Supérieure", etage: 2, capacite: 2, prix: 120, statut: "Disponible", superficie: 30, vue: "Piscine", equipements: ["WiFi", "TV", "Climatisation", "Minibar", "Coffre-fort"], client: null, checkIn: null, checkOut: null, note: 4.7, image: "🛏️" },
  { id: 4, numero: "202", type: "Supérieure", etage: 2, capacite: 3, prix: 140, statut: "Occupée", superficie: 34, vue: "Piscine", equipements: ["WiFi", "TV", "Climatisation", "Minibar", "Baignoire"], client: "Léa Bernard", checkIn: "13 Avr", checkOut: "14 Mai", note: 4.8, image: "🛏️" },
  { id: 5, numero: "301", type: "Deluxe", etage: 3, capacite: 2, prix: 180, statut: "À nettoyer", superficie: 40, vue: "Mer", equipements: ["WiFi", "TV 4K", "Climatisation", "Minibar", "Jacuzzi", "Balcon"], client: null, checkIn: null, checkOut: null, note: 4.9, image: "✨" },
  { id: 6, numero: "302", type: "Deluxe", etage: 3, capacite: 2, prix: 180, statut: "Disponible", superficie: 40, vue: "Mer", equipements: ["WiFi", "TV 4K", "Climatisation", "Minibar", "Jacuzzi", "Balcon"], client: null, checkIn: null, checkOut: null, note: 4.6, image: "🛏️" },
  { id: 7, numero: "401", type: "Suite", etage: 4, capacite: 4, prix: 320, statut: "Occupée", superficie: 65, vue: "Panoramique", equipements: ["WiFi", "TV 4K", "Climatisation", "Minibar", "Jacuzzi", "Salon", "Cuisine", "Balcon"], client: "Émile Rousseau", checkIn: "12 Avr", checkOut: "15 Mai", note: 5.0, image: "👑" },
  { id: 8, numero: "402", type: "Suite", etage: 4, capacite: 4, prix: 320, statut: "Maintenance", superficie: 65, vue: "Panoramique", equipements: ["WiFi", "TV 4K", "Climatisation", "Minibar", "Jacuzzi", "Salon"], client: null, checkIn: null, checkOut: null, note: 4.9, image: "🔧" },
  { id: 9, numero: "501", type: "Suite Présidentielle", etage: 5, capacite: 6, prix: 680, statut: "Occupée", superficie: 120, vue: "Panoramique 360°", equipements: ["WiFi", "TV 4K", "Climatisation", "Minibar", "Jacuzzi", "Salon", "Cuisine", "Salle à manger", "Terrasse"], client: "Camille Petit", checkIn: "14 Avr", checkOut: "18 Mai", note: 5.0, image: "👑" },
];

const statutConfig = {
  "Disponible":  { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", badge: "bg-emerald-500" },
  "Occupée":     { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500",    badge: "bg-blue-500" },
  "À nettoyer":  { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-400",   badge: "bg-amber-400" },
  "Maintenance": { bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-500",     badge: "bg-red-500" },
};

const typeColors = {
  "Standard":            "from-slate-400 to-slate-600",
  "Supérieure":          "from-blue-400 to-blue-600",
  "Deluxe":              "from-violet-400 to-violet-600",
  "Suite":               "from-amber-400 to-orange-500",
  "Suite Présidentielle":"from-yellow-400 to-amber-600",
};

const navItems = [
  { label: "Dashboard", icon: "⊞" },
  { label: "Chambres", icon: "🛏", active: true },
  { label: "Utilisateurs", icon: "👤" },
  { label: "Réservations", icon: "📅" },
  { label: "Paiements", icon: "💳" },
  { label: "Rapports", icon: "📊" },
  { label: "Paramètres", icon: "⚙️" },
];

function StarRating({ note }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(note) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="text-xs text-slate-500 ml-0.5">{note.toFixed(1)}</span>
    </div>
  );
}

function ChambreCard({ chambre, onSelect }) {
  const sc = statutConfig[chambre.statut];
  const tc = typeColors[chambre.type];
  return (
    <div
      onClick={() => onSelect(chambre)}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      {/* Top gradient band */}
      <div className={`h-24 bg-gradient-to-br ${tc} relative flex items-center justify-center`}>
        <span className="text-4xl opacity-80">{chambre.image}</span>
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full`}>
            Ch. {chambre.numero}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {chambre.statut}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Body */}
      <div className="px-4 pt-2 pb-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{chambre.type}</p>
            <p className="text-slate-800 font-bold text-base">Chambre {chambre.numero}</p>
          </div>
          <div className="text-right">
            <p className="text-indigo-600 font-bold text-lg">€{chambre.prix}</p>
            <p className="text-slate-400 text-xs">/nuit</p>
          </div>
        </div>

        <StarRating note={chambre.note} />

        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-slate-50 rounded-lg px-2 py-1.5 text-center">
            <p className="text-slate-400 text-xs">Étage</p>
            <p className="text-slate-700 font-semibold text-sm">{chambre.etage}</p>
          </div>
          <div className="bg-slate-50 rounded-lg px-2 py-1.5 text-center">
            <p className="text-slate-400 text-xs">Capacité</p>
            <p className="text-slate-700 font-semibold text-sm">{chambre.capacite} pers.</p>
          </div>
          <div className="bg-slate-50 rounded-lg px-2 py-1.5 text-center">
            <p className="text-slate-400 text-xs">Surface</p>
            <p className="text-slate-700 font-semibold text-sm">{chambre.superficie}m²</p>
          </div>
        </div>

        {chambre.client && (
          <div className="mt-3 flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {chambre.client.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">{chambre.client}</p>
              <p className="text-xs text-slate-400">{chambre.checkIn} → {chambre.checkOut}</p>
            </div>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-1">
          {chambre.equipements.slice(0, 3).map(e => (
            <span key={e} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{e}</span>
          ))}
          {chambre.equipements.length > 3 && (
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">+{chambre.equipements.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ chambre, onClose }) {
  const navigate = useNavigate()
  if (!chambre) return null;
  const sc = statutConfig[chambre.statut];
  const tc = typeColors[chambre.type];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div
        className="relative bg-white h-full w-full max-w-md shadow-2xl overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header image */}
        <div className={`h-48 bg-gradient-to-br ${tc} flex items-center justify-center relative shrink-0`}>
          <span className="text-7xl opacity-70">{chambre.image}</span>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">✕</button>
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{chambre.type}</p>
              <p className="text-white font-bold text-2xl">Chambre {chambre.numero}</p>
            </div>
            <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${sc.bg} ${sc.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{chambre.statut}
            </span>
          </div>
        </div>

        <div className="p-6 flex-1">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Étage", val: chambre.etage },
              { label: "Surface", val: `${chambre.superficie}m²` },
              { label: "Capacité", val: `${chambre.capacite}p` },
              { label: "Prix/nuit", val: `€${chambre.prix}` },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-slate-400 text-xs mb-0.5">{s.label}</p>
                <p className="text-slate-800 font-bold">{s.val}</p>
              </div>
            ))}
          </div>

          {/* Vue & Note */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">🌅</span>
              <span className="text-slate-600 text-sm font-medium">Vue {chambre.vue}</span>
            </div>
            <StarRating note={chambre.note} />
          </div>

          {/* Client actuel */}
          {chambre.client ? (
            <div className="bg-indigo-50 rounded-2xl p-4 mb-5">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-3">Client actuel</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                  {chambre.client.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{chambre.client}</p>
                  <p className="text-slate-500 text-sm">📅 {chambre.checkIn} → {chambre.checkOut}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-2xl p-4 mb-5 flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <p className="text-emerald-700 font-medium text-sm">Chambre disponible pour réservation</p>
            </div>
          )}

          {/* Équipements */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Équipements</p>
            <div className="flex flex-wrap gap-2">
              {chambre.equipements.map(e => (
                <span key={e} className="flex items-center gap-1.5 text-sm bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl font-medium">
                  ✓ {e}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-auto">
            {chambre.statut === "Disponible" && (
              <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                + Nouvelle réservation
              </button>
            )}
            {chambre.statut === "À nettoyer" && (
              <button className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors">
                ✓ Marquer comme propre
              </button>
            )}
            {chambre.statut === "Maintenance" && (
              <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                ✓ Fin de maintenance
              </button>
            )}
            <button onClick={() => navigate(`/edit-room/${chambre.id}`)}
            className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
              ✏️ Modifier la chambre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChambresAdmin() {
  const [activeNav, setActiveNav] = useState("Chambres");
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [filterType, setFilterType] = useState("Tous");
  const [viewMode, setViewMode] = useState("grid");
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate()

  const statuts = ["Tous", "Disponible", "Occupée", "À nettoyer", "Maintenance"];
  const types = ["Tous", "Standard", "Supérieure", "Deluxe", "Suite", "Suite Présidentielle"];

  const filtered = chambres.filter(c => {
    const matchSearch = c.numero.includes(search) || c.type.toLowerCase().includes(search.toLowerCase()) || (c.client && c.client.toLowerCase().includes(search.toLowerCase()));
    const matchStatut = filterStatut === "Tous" || c.statut === filterStatut;
    const matchType = filterType === "Tous" || c.type === filterType;
    return matchSearch && matchStatut && matchType;
  });

  const stats = {
    total: chambres.length,
    disponibles: chambres.filter(c => c.statut === "Disponible").length,
    occupees: chambres.filter(c => c.statut === "Occupée").length,
    nettoyage: chambres.filter(c => c.statut === "À nettoyer").length,
    maintenance: chambres.filter(c => c.statut === "Maintenance").length,
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
     
      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm px-8 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Gestion des chambres 🛏️</h1>
              <p className="text-slate-400 text-sm mt-0.5">{chambres.length} chambres au total · Mai 2026</p>
            </div>
            <button onClick={() => {navigate('/Createroom')}}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 rounded-xl text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
              + Ajouter une chambre
            </button>
          </div>

          {/* Stats bar */}
          <div className="flex gap-3 mb-4">
            {[
              { label: "Total", val: stats.total, color: "bg-slate-800 text-white" },
              { label: "Disponibles", val: stats.disponibles, color: "bg-emerald-500 text-white" },
              { label: "Occupées", val: stats.occupees, color: "bg-blue-500 text-white" },
              { label: "À nettoyer", val: stats.nettoyage, color: "bg-amber-400 text-white" },
              { label: "Maintenance", val: stats.maintenance, color: "bg-red-500 text-white" },
            ].map(s => (
              <div key={s.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold ${s.color}`}>
                <span className="text-lg font-bold">{s.val}</span>
                <span className="font-normal opacity-90">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="N°, type, client..."
                className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              {statuts.map(s => (
                <button key={s} onClick={() => setFilterStatut(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatut === s ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}>
                  {s}
                </button>
              ))}
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none shadow-sm">
              {types.map(t => <option key={t}>{t}</option>)}
            </select>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm gap-1">
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-indigo-600 text-white" : "text-slate-400"}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm8 0a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm8 0a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z"/></svg>
              </button>
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-indigo-600 text-white" : "text-slate-400"}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          <p className="text-sm text-slate-400 mb-4">{filtered.length} chambre{filtered.length > 1 ? "s" : ""} affichée{filtered.length > 1 ? "s" : ""}</p>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(c => <ChambreCard key={c.id} chambre={c} onSelect={setSelected} />)}
            </div>
          ) : (
            /* List view */
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {["Chambre", "Type", "Statut", "Étage", "Capacité", "Surface", "Vue", "Prix/nuit", "Client", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => {
                    const sc = statutConfig[c.statut];
                    const tc = typeColors[c.type];
                    return (
                      <tr key={c.id} onClick={() => setSelected(c)}
                        className={`hover:bg-indigo-50/40 cursor-pointer transition-colors ${i !== filtered.length - 1 ? "border-b border-slate-50" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tc} flex items-center justify-center text-sm`}>
                              {c.image}
                            </div>
                            <span className="font-bold text-slate-800">#{c.numero}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{c.type}</td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${sc.bg} ${sc.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{c.statut}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{c.etage}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{c.capacite} pers.</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{c.superficie}m²</td>
                        <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{c.vue}</td>
                        <td className="px-4 py-3 text-sm font-bold text-indigo-600">€{c.prix}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{c.client || <span className="text-slate-300">—</span>}</td>
                        <td className="px-4 py-3">
                          <button className="text-xs text-indigo-600 font-medium hover:underline">Voir →</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Panel */}
      {selected && <DetailPanel chambre={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}