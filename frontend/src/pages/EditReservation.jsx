import { useState, useEffect } from "react";
import ModifierModal from "../components/ModifierModal";


const useFont = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
};



const TYPE_COLORS = {
  "Standard":       { bg: "rgba(96,165,250,.12)",  border: "rgba(96,165,250,.25)",  text: "#93c5fd" },
  "Deluxe":         { bg: "rgba(167,139,250,.12)", border: "rgba(167,139,250,.25)", text: "#c4b5fd" },
  "Suite":          { bg: "rgba(251,191,36,.12)",  border: "rgba(251,191,36,.25)",  text: "#fde68a" },
  "Présidentielle": { bg: "rgba(52,211,153,.12)",  border: "rgba(52,211,153,.25)",  text: "#6ee7b7" },
};

/* ── Helpers ────────────────────────────────────────── */
function diffDays(a, b) {
  return Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000));
}
function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}








/* ── Demo wrapper ───────────────────────────────────── */
export default function EditReservation() {
  useFont();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "#080b14", fontFamily: "'Outfit',sans-serif" }}>
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(124,58,237,.08),transparent)", filter: "blur(60px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(79,70,229,.06),transparent)", filter: "blur(50px)" }} />



      {open && <ModifierModal onClose={() => setOpen(false)} />}
        

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        input::placeholder, textarea::placeholder { color:rgba(100,116,139,.4); }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(124,58,237,.3); border-radius:2px; }
      `}</style>
    </div>
  );
}