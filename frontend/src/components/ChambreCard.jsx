const statutCfg = {
  "Disponible":  { dot: "bg-emerald-500", bg: "bg-emerald-500/90", text: "text-white" },
  "Occupée":     { dot: "bg-blue-400",    bg: "bg-blue-500/90",    text: "text-white" },
  "À nettoyer":  { dot: "bg-amber-400",   bg: "bg-amber-400/90",   text: "text-white" },
  "Maintenance": { dot: "bg-red-500",     bg: "bg-red-500/90",     text: "text-white" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Stars({ note }) {
  return (
    <span className="flex items-center gap-1 text-amber-400 font-semibold text-sm">
      ★ {note.toFixed(1)}
    </span>
  );
}


export default function ChambreCard({ c, onReserver, compact = false }) {
  const sc = statutCfg[c.statut];
  const dispo = c.statut === "Disponible";
  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${compact ? "" : "flex flex-col"}`}>
      <div className="relative overflow-hidden" style={{ height: compact ? 160 : 200 }}>
        <img src={c.img} alt={c.type} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text} backdrop-blur-sm`}>
          <span className={`w-1.5 h-1.5 rounded-full bg-white`} />
          {c.statut}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="font-bold text-slate-800 text-base">{c.type}</p>
            <p className="text-slate-400 text-xs">Chambre {c.numero} · {c.superficie} m² · {c.lit}</p>
          </div>
          <Stars note={c.note} />
        </div>
        <div className="flex items-end justify-between mt-auto pt-3">
          <div>
            <span className="text-2xl font-bold text-slate-900">€{c.prix}</span>
            <span className="text-slate-400 text-sm">/nuit</span>
            <p className="text-emerald-600 text-xs font-medium mt-0.5">Annulation gratuite</p>
          </div>
          {dispo ? (
            <button onClick={() => onReserver(c)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-200">
              Réserver <span>›</span>
            </button>
          ) : (
            <button disabled className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 bg-slate-100 cursor-not-allowed">
              Indisponible
            </button>
          )}
        </div>
      </div>
    </div>
  );
}