import { useContext, useState } from "react";
import Steps from "./Steps";
import StepDates from "./StepDates";
import StepChambre from "./StepChambre";
import StepRecap from "./StepRecap";
import { AppContext } from "../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/useToast";
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

function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ModifierModal({ sejour, onClose }) {
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { setSejours } = useContext(AppContext);
  const { toast, ToastPortal } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    arrivee:   new Date(sejour.arrivee),
    depart:    new Date(sejour.depart),
    voyageurs: sejour.voyageurs || 1,
    notes:     "",
    chambre:   sejour.chambre,
  });

  const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
 
    try {
      setSaving(true);
      const isSame =
      new Date(sejour.arrivee).getTime() === new Date(form.arrivee).getTime() &&
      new Date(sejour.depart).getTime() === new Date(form.depart).getTime() &&
      sejour.voyageurs === form.voyageurs &&
      sejour.chambre?._id === form.chambre?._id;

    if (isSame) {
      setSaving(false);
      toast.info("Aucune modification détectée");
      setTimeout(() =>{
        onClose(false)
      }, 4000)
      
      return;
    }
      const { data } = await axios.put(
        `http://localhost:3000/api/reservations/updatereservation/${sejour._id}`,
        {
          arrivee:      form.arrivee,
          depart:       form.depart,
          prixParNuit:  form.chambre.prix_nuit,
          chambre:      form.chambre._id,
          voyageurs:    form.voyageurs,
        },
        { withCredentials: true }
      );

      setSejours(prev =>
        prev.map(s =>
          s._id === sejour._id
            ? { ...s, arrivee: form.arrivee, depart: form.depart, voyageurs: form.voyageurs }
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

  const nights = Math.max(0, Math.ceil((form.depart - form.arrivee) / (1000 * 60 * 60 * 24)));
  const total  = (form.chambre?.prix_nuit || 0) * nights + Math.round((form.chambre?.prix_nuit || 0) * nights * 0.1);

  return (
    <>
    <ToastPortal />
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0 backdrop-blur-md" style={{ background: "rgba(44,26,14,.45)" }} />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "#fff",
          border: "1px solid #ddd5c8",
          boxShadow: "0 32px 64px rgba(60,30,10,.18), 0 0 0 1px rgba(160,120,80,.08)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="h-0.5" style={{ background: "#ede5db" }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: saved ? "100%" : `${((step + 1) / 3) * 100}%`,
              background: "linear-gradient(to right,#a07850,#c8903c,#d4a855)",
            }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-0 shrink-0">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-0.5"
              style={{ color: "#a07850", letterSpacing: ".14em", fontSize: 10 }}
            >
              Modifier la réservation
            </p>
            <div className="flex items-center gap-2">
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center text-xs"
                style={{ background: "rgba(160,120,80,.12)", color: "#a07850" }}
              >✏️</span>
              <span
                className="font-bold text-base"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1c1917" }}
              >
                {RESERVATION.id}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
            style={{ background: "#f5f0eb", border: "1px solid #ddd5c8", color: "#a8968a" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,.08)"; e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.borderColor = "rgba(239,68,68,.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f5f0eb"; e.currentTarget.style.color = "#a8968a"; e.currentTarget.style.borderColor = "#ddd5c8"; }}
          >✕</button>
        </div>

        {/* Body — scrollable */}
        <div
          className="flex-1 overflow-y-auto px-7 py-6"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(160,120,80,.3) transparent" }}
        >
          {saved ? (
            /* ── Success ── */
            <div className="flex flex-col items-center justify-center py-10 text-center" style={{ animation: "fadeUp .4s ease both" }}>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-5"
                style={{ background: "rgba(34,167,90,.1)", border: "1.5px solid rgba(34,167,90,.3)" }}
              >✓</div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1c1917" }}
              >
                Modifications enregistrées !
              </h3>
              <p className="text-sm mb-1" style={{ color: "#6b5244" }}>
                <span className="font-semibold" style={{ color: "#a07850" }}>{RESERVATION.id}</span> a été mis à jour avec succès.
              </p>
              <p className="text-xs mb-6" style={{ color: "#a8968a" }}>
                {form.chambre.type} {form.chambre.numero} · {formatDate(form.arrivee)} → {formatDate(form.depart)} · {nights} nuits
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)", boxShadow: "0 4px 15px rgba(160,120,80,.3)" }}
                >
                  Voir mes séjours
                </button>
                <button onClick={() => navigate(`/payementpage/${sejour._id}`)}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: "#faf7f4", border: "1px solid #ddd5c8", color: "#6b5244" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0e8e0"}
                  onMouseLeave={e => e.currentTarget.style.background = "#faf7f4"}
                >
                  Payer maintenant
                </button>
              </div>
            </div>
          ) : (
            <>
              <Steps current={step} />
              {step === 0 && (
                <StepDates
                  dateIn={form.arrivee} dateOut={form.depart}
                  voyageurs={form.voyageurs} notes={form.notes}
                  onChange={handleChange}
                />
              )}
              {step === 1 && (
                <StepChambre
                  selected={form.chambre}
                  onSelect={c => handleChange("chambre", c)}
                  voyageurs={form.voyageurs}
                />
              )}
              {step === 2 && (
                <StepRecap
                  res={sejour} chambre={form.chambre}
                  dateIn={form.arrivee} dateOut={form.depart}
                  voyageurs={form.voyageurs} notes={form.notes}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!saved && (
          <div
            className="px-7 py-5 shrink-0 flex items-center justify-between"
            style={{
              borderTop: "1px solid #ede5db",
              background: "rgba(245,240,235,.85)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div>
              {step === 2 && (
                <div>
                  <p className="text-xs" style={{ color: "#a8968a" }}>Nouveau total</p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "#3d2614", fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    € {total}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: "#faf7f4", border: "1px solid #ddd5c8", color: "#6b5244" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f0e8e0"; e.currentTarget.style.color = "#3d2614"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#faf7f4"; e.currentTarget.style.color = "#6b5244"; }}
                >← Retour</button>
              )}

              {step < 2 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="px-7 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)", boxShadow: "0 4px 14px rgba(160,120,80,.3)" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(160,120,80,.45)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(160,120,80,.3)"}
                >Continuer →</button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{
                    background: saving ? "rgba(160,120,80,.5)" : "linear-gradient(135deg,#a07850,#7c5a38)",
                    boxShadow: saving ? "none" : "0 4px 14px rgba(160,120,80,.3)",
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={e => { if (!saving) e.currentTarget.style.filter = "brightness(1.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}
                >
                  {saving ? (
                    <>
                      <span
                        className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                        style={{ animation: "spin .7s linear infinite" }}
                      />
                      Enregistrement…
                    </>
                  ) : "✓ Confirmer les modifications"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
    </>
  );
}