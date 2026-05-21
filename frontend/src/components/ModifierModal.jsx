/* ── Modal ──────────────────────────────────────────── */

import { useContext, useState } from "react";
import Steps from "./Steps";
import StepDates from "./StepDates";
import StepChambre from "./StepChambre";
import StepRecap from "./StepRecap";
import { AppContext } from "../context/Context";
import axios from "axios"

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

/* ── Helpers ────────────────────────────────────────── */
function diffDays(a, b) {
  return Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000));
}
function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ModifierModal({sejour, onClose }) {
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const {setSejours} = useContext(AppContext)
  console.log('iwwaa sejouuurrr', sejour);
    const [form, setForm] = useState({
      arrivee: new Date(sejour.arrivee),
      depart: new Date(sejour.depart),
      voyageurs: sejour.voyageurs || 1,
      notes: "",
      chambre: sejour.chambre,
    });

  
  const handleChange = (key, val) => {
    setForm(prev => ({
      ...prev,
      [key]: val,
    }));
  };


  const handleSave = async () => {
    try {
      setSaving(true);

      const { data } = await axios.put(
        `http://10.12.1.3:3000/api/reservations/updatereservation/${sejour._id}`,
        {
          arrivee: form.arrivee,
          depart: form.depart,
          prixParNuit : form.chambre.prix_nuit,
          chambre : form.chambre._id,
          voyageurs: form.voyageurs,
        },
        { withCredentials: true }
      );

      setSejours(prev =>
        prev.map(s =>
          s._id === sejour._id
            ? {
                ...s,
                arrivee: form.arrivee,
                depart: form.depart,
                voyageurs: form.voyageurs,
              }
            : s
        )
      );

      setSaved(true);
    } catch (e) {
      console.log(e);
    } finally {
      setSaving(false);
    }
  };

  const nights = Math.max(
    0,
    Math.ceil((form.depart - form.arrivee) / (1000 * 60 * 60 * 24))
  );

  const total =
    (form.chambre?.prix_nuit || 0) * nights +
    Math.round((form.chambre?.prix_nuit || 0) * nights * 0.1);


  // const handleSave = () => {
  //   setSaving(true);
  //   setTimeout(() => { setSaving(false); setSaved(true); }, 1600);
  // };

  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" />
      <div
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(160deg,#131827 0%,#0b0f1c 100%)", border: "1px solid rgba(255,255,255,.09)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="h-0.5" style={{ background: "rgba(255,255,255,.06)" }}>
          <div className="h-full transition-all duration-500"
            style={{ width: saved ? "100%" : `${((step + 1) / 3) * 100}%`, background: "linear-gradient(to right,#7c3aed,#6366f1,#a78bfa)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-0 shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#a78bfa", letterSpacing: ".14em", fontSize: 10 }}>
              Modifier la réservation
            </p>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs" style={{ background: "rgba(124,58,237,.2)", color: "#a78bfa" }}>✏️</span>
              <span className="font-semibold text-white text-base" style={{ fontFamily: "'Playfair Display',serif" }}>{RESERVATION.id}</span>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
            style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", color: "rgba(148,163,184,.7)" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,.1)"; e.currentTarget.style.color="#f87171"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.05)"; e.currentTarget.style.color="rgba(148,163,184,.7)"; }}
          >✕</button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-7 py-6" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(124,58,237,.3) transparent" }}>
          {saved ? (
            /* Success */
            <div className="flex flex-col items-center justify-center py-10 text-center" style={{ animation: "fadeUp .4s ease both" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-5"
                style={{ background: "rgba(52,211,153,.12)", border: "1.5px solid rgba(52,211,153,.3)" }}>✓</div>
              <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>Modifications enregistrées !</h3>
              <p className="text-sm mb-1" style={{ color: "rgba(148,163,184,.7)" }}>
                <span style={{ color: "#a78bfa", fontWeight: 600 }}>{RESERVATION.id}</span> a été mis à jour avec succès.
              </p>
              <p className="text-xs mb-6" style={{ color: "rgba(100,116,139,.6)" }}>
                {form.chambre.type} {form.chambre.numero} · {formatDate(form.arrivee)} → {formatDate(form.depart)} · {nights} nuits
              </p>
              <div className="flex gap-3">
                <button onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 4px 15px rgba(124,58,237,.35)" }}>
                  Voir mes séjours
                </button>
                <button
                  className="px-6 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", color: "rgba(148,163,184,.7)" }}>
                  Payer maintenant
                </button>
              </div>
            </div>
          ) : (
            <>
        
              <Steps current={step} />
              {step === 0 && <StepDates dateIn={form.arrivee} dateOut={form.depart} voyageurs={form.voyageurs} notes={form.notes} onChange={handleChange} />}
              {step === 1 && <StepChambre selected={form.chambre} onSelect={c => handleChange("chambre", c)} voyageurs={form.voyageurs} />}
              {step === 2 && <StepRecap res={sejour} chambre={form.chambre} dateIn={form.arrivee} dateOut={form.depart} voyageurs={form.voyageurs} notes={form.notes} />}
            </>
          )}
        </div>

        {/* Footer */}
        {!saved && (
          <div className="px-7 py-5 shrink-0 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,.06)", background: "rgba(8,11,20,.5)", backdropFilter: "blur(8px)" }}>
            <div>
              {step === 2 && (
                <div>
                  <p className="text-xs" style={{ color: "rgba(100,116,139,.6)" }}>Nouveau total</p>
                  <p className="text-lg font-bold" style={{ color: "#c4b5fd", fontFamily: "'Playfair Display',serif" }}>€ {total}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", color: "rgba(148,163,184,.7)" }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,.09)"; e.currentTarget.style.color="#f8fafc"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.05)"; e.currentTarget.style.color="rgba(148,163,184,.7)"; }}
                >← Retour</button>
              )}
              {step < 2 ? (
                <button onClick={() => setStep(s => s + 1)}
                  className="px-7 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 4px 14px rgba(124,58,237,.35)" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,58,237,.55)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(124,58,237,.35)"}
                >Continuer →</button>
              ) : (
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: saving ? "rgba(124,58,237,.6)" : "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: saving ? "none" : "0 4px 14px rgba(124,58,237,.35)", cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? (
                    <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" style={{ animation: "spin .7s linear infinite" }} />Enregistrement…</>
                  ) : "✓ Confirmer les modifications"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
