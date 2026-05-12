import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/* ── Stars ──────────────────────────────── */
function Stars({ note }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      <span className="text-amber-400 text-sm">★</span>
      <span className="text-sm font-semibold text-slate-200">
        {note.toFixed(1)}
      </span>
    </div>
  );
}

/* ── Modal Réservation ──────────────────────────────── */
export default function ModalReservation({ chambre, onClose }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

    const [arrivee, setArrivee] = useState(new Date());

    const [depart, setDepart] = useState(
      new Date(Date.now() + 24 * 60 * 60 * 1000)
    );

  const [openArrivee, setOpenArrivee] = useState(false);
  const [openDepart, setOpenDepart] = useState(false);

  if (!chambre) return null;

  

  /* ── Calcul nuits ── */
  const nights =
    arrivee && depart
      ? Math.max(
          0,
          Math.ceil((depart - arrivee) / (1000 * 60 * 60 * 24))
        )
      : 0;

  /* ── Format date ── */
  const formatDate = (date) => {
    console.log(date, 'date')
    if (!date) return "";

   
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  console.log('arriverrrr=>', arrivee, formatDate(arrivee), 'asasassa', new Date())
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background:
            "linear-gradient(145deg, #1a1f2e 0%, #0f1420 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress */}
        <div className="h-0.5 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-500"
            style={{
              width: done ? "100%" : step === 1 ? "50%" : "100%",
            }}
          />
        </div>

        {/* ───────────────── DONE ───────────────── */}
        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-3xl mx-auto mb-4">
              ✓
            </div>

            <h3
              className="text-xl font-semibold text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Réservation confirmée !
            </h3>

            <p className="text-slate-400 text-sm mb-6">
              Un email de confirmation vous a été envoyé.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : step === 1 ? (
          /* ───────────────── STEP 1 ───────────────── */
          <div className="p-6">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors text-sm"
            >
              ✕
            </button>

            <p className="text-xs font-medium text-violet-400 uppercase tracking-widest mb-1">
              Étape 1 / 2
            </p>

            <h3
              className="text-xl font-semibold text-white mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Récapitulatif
            </h3>

            {/* Chambre preview */}
            <div
              className="flex gap-4 rounded-2xl overflow-hidden mb-5"
              style={{
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.07)",
              }}
            >
              <img
                src={chambre.img}
                className="w-28 h-24 object-cover flex-shrink-0"
                alt=""
              />

              <div className="py-3 pr-3">
                <p className="font-semibold text-white text-sm">
                  {chambre.type} — Ch. {chambre.numero}
                </p>

                <p className="text-slate-400 text-xs mt-0.5">
                  {chambre.superficie} m² · {chambre.lit}
                </p>

                <Stars note={chambre.note} />
              </div>
            </div>

            {/* Date chips */}
            <div className="grid grid-cols-3 gap-2 mb-5">

              {/* ARRIVÉE */}
              <div
                className="rounded-xl py-2.5 text-center relative cursor-pointer"
                style={{
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.07)",
                }}
                onClick={() => setOpenArrivee(true)}
              >
                <p className="text-xs text-slate-500 mb-0.5">
                  Arrivée
                </p>

                <p className="text-sm font-medium text-white">
                  {formatDate(arrivee)}
                </p>

                <DatePicker
                  selected={arrivee}
                  onChange={(date) => {
                    setArrivee(date);
                    setDepart(new Date(date.getTime() + 24 * 60 * 60 * 1000));
                    setOpenArrivee(false);
                  }}
                  open={openArrivee}
                   minDate={new Date()}
                  onClickOutside={() => setOpenArrivee(false)}
                  popperPlacement="bottom"
                  customInput={<div />}
                />
              </div>

              {/* DÉPART */}
              <div
                className="rounded-xl py-2.5 text-center relative cursor-pointer"
                style={{
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.07)",
                }}
                onClick={() => setOpenDepart(true)}
              >
                <p className="text-xs text-slate-500 mb-0.5">
                  Départ
                </p>

                <p className="text-sm font-medium text-white">
                  {formatDate(depart)}
                </p>

                <DatePicker
                  selected={depart}
                  onChange={(date) => {
                    setDepart(date);
                    setOpenDepart(false);
                  }}
                  open={openDepart}
                  minDate={arrivee}
                  onClickOutside={() => setOpenDepart(false)}
                  popperPlacement="bottom"
                  customInput={<div />}
                />
              </div>

              {/* DURÉE */}
              <div
                className="rounded-xl py-2.5 text-center"
                style={{
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.07)",
                }}
              >
                <p className="text-xs text-slate-500 mb-0.5">
                  Durée
                </p>

                <p className="text-sm font-medium text-white">
                  {nights} nuits
                </p>
              </div>
            </div>

            {/* Total */}
            <div
              className="flex justify-between items-center py-3 mb-5"
              style={{
                borderTop: "1px solid rgba(255,255,255,.06)",
                borderBottom: "1px solid rgba(255,255,255,.06)",
              }}
            >
              <span className="text-slate-400 text-sm">
                €{chambre.prix} × {nights} nuits
              </span>

              <span className="text-white text-lg font-bold">
                €{chambre.prix * nights}
              </span>
            </div>

            {/* Button */}
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 text-white"
              style={{
                background:
                  "linear-gradient(135deg,#7c3aed,#4f46e5)",
              }}
            >
              Continuer →
            </button>
          </div>
        ) : (
          /* ───────────────── STEP 2 ───────────────── */
          <div className="p-6">
            {/* Back */}
            <button
              onClick={() => setStep(1)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors text-sm"
            >
              ←
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors text-sm"
            >
              ✕
            </button>

            <p className="text-xs font-medium text-violet-400 uppercase tracking-widest mb-1">
              Étape 2 / 2
            </p>

            <h3
              className="text-xl font-semibold text-white mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Paiement
            </h3>

            {/* Form */}
            <div className="space-y-3 mb-5">
              {[
                {
                  l: "Nom complet",
                  ph: "Sophie Laurent",
                  t: "text",
                },
                {
                  l: "Email",
                  ph: "sophie@email.com",
                  t: "email",
                },
                {
                  l: "N° de carte",
                  ph: "•••• •••• •••• 4242",
                  t: "text",
                },
                {
                  l: "Expiration / CVV",
                  ph: "04/28   •   •••",
                  t: "text",
                },
              ].map((f) => (
                <div key={f.l}>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    {f.l}
                  </label>

                  <input
                    placeholder={f.ph}
                    type={f.t}
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,.05)",
                      border:
                        "1px solid rgba(255,255,255,.08)",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Total */}
            <div
              className="flex justify-between items-center py-3 rounded-xl px-4 mb-4"
              style={{
                background: "rgba(124,58,237,.12)",
                border: "1px solid rgba(124,58,237,.2)",
              }}
            >
              <span className="text-violet-300 text-sm font-medium">
                Total à payer
              </span>

              <span className="text-white font-bold text-lg">
                €{chambre.prix * nights}
              </span>
            </div>

            {/* Confirm */}
            <button
              onClick={() => setDone(true)}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 text-white"
              style={{
                background:
                  "linear-gradient(135deg,#7c3aed,#4f46e5)",
              }}
            >
              ✓ Confirmer la réservation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}