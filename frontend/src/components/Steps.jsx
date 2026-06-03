export default function Steps({ current }) {
  const steps = ["Dates & Voyageurs", "Chambre", "Récapitulatif"];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Circle */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              style={{
                background: i < current
                  ? "linear-gradient(135deg,#a07850,#7c5a38)"
                  : i === current
                  ? "rgba(160,120,80,.12)"
                  : "#f5f0eb",
                border: i <= current
                  ? "1.5px solid #a07850"
                  : "1.5px solid #ddd5c8",
                color: i < current
                  ? "#fff"
                  : i === current
                  ? "#7c5a38"
                  : "#c8b8a8",
              }}
            >
              {i < current ? "✓" : i + 1}
            </div>
            {/* Label */}
            <span
              className="text-xs font-medium transition-colors duration-300"
              style={{
                color: i === current
                  ? "#7c5a38"
                  : i < current
                  ? "#a07850"
                  : "#c8b8a8",
              }}
            >
              {s}
            </span>
          </div>
          {/* Connector line */}
          {i < steps.length - 1 && (
            <div
              className="flex-1 h-px mx-3 transition-all duration-500"
              style={{
                background: i < current
                  ? "linear-gradient(to right,#a07850,rgba(160,120,80,.25))"
                  : "#ede5db",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}