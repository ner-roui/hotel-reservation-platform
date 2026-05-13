/* ── Step indicator ─────────────────────────────────── */
function Steps({ current }) {
  const steps = ["Dates & Voyageurs", "Chambre", "Récapitulatif"];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              style={{
                background: i < current ? "linear-gradient(135deg,#7c3aed,#4f46e5)"
                           : i === current ? "rgba(124,58,237,.25)"
                           : "rgba(255,255,255,.06)",
                border: i <= current ? "1.5px solid rgba(124,58,237,.6)" : "1.5px solid rgba(255,255,255,.1)",
                color: i <= current ? (i < current ? "#fff" : "#c4b5fd") : "rgba(100,116,139,.5)",
              }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span className="text-xs font-medium transition-colors duration-300"
              style={{ color: i === current ? "#c4b5fd" : i < current ? "rgba(167,139,250,.7)" : "rgba(100,116,139,.5)" }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-px mx-3 transition-all duration-500"
              style={{ background: i < current ? "linear-gradient(to right,rgba(124,58,237,.6),rgba(124,58,237,.2))" : "rgba(255,255,255,.06)" }} />
          )}
        </div>
      ))}
    </div>
  );
}