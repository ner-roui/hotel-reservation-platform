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

/* ── Data ───────────────────────────────────────────── */
const RESERVATION = {
  id: "RES-2842",
  type: "Deluxe", numero: "202", etage: 2,
  lit: "1 lit king", superficie: 32,
  dateIn: "2026-04-14", dateOut: "2026-04-17",
  voyageurs: 2, prixNuit: 220,
  img: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&q=80",
  equipements: ["WiFi", "TV 4K", "Minibar", "Spa privé"],
  statut: "En attente",
  notes: "",
};

const CHAMBRES_DISPO = [
  { type: "Standard",       numero: "101", prixNuit: 120, superficie: 22,  lit: "1 lit double",        img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80" },
  { type: "Standard",       numero: "103", prixNuit: 120, superficie: 22,  lit: "1 lit double",        img: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&q=80" },
  { type: "Deluxe",         numero: "202", prixNuit: 220, superficie: 32,  lit: "1 lit king",          img: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400&q=80" },
  { type: "Deluxe",         numero: "203", prixNuit: 220, superficie: 32,  lit: "2 lits queen",        img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&q=80" },
  { type: "Suite",          numero: "301", prixNuit: 380, superficie: 55,  lit: "1 lit king + canapé", img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=80" },
  { type: "Présidentielle", numero: "501", prixNuit: 680, superficie: 120, lit: "2 lits king",         img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=80" },
];

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