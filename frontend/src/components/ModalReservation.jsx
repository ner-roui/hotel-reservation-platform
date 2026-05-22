import { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios"
import { AppContext } from "../context/Context";


/* ── Stars ──────────────────────────────── */
function Stars({ note }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      <span className="text-amber-400 text-sm">★</span>
      <span className="text-sm font-semibold text-slate-200">
        {note?.toFixed(1)}
      </span>
    </div>
  );
}

/* ── Modal Réservation ──────────────────────────────── */
export default function ModalReservation({ chambre, onClose }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const {setSejours} = useContext(AppContext)

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


  const reserver = async (c) => {
  try {
    const { data } = await axios.post(
      `http://localhost:3000/api/reservations/${c._id}`,
      {
        arrivee,
        depart,
        prixParNuit: c.prix_nuit,
      },
      {
        withCredentials: true,
      }
    );
    console.log('[[[[[[[]]]]]]]', data.reservation)
    // setSejours(prev => ([...prev, {
    //   chambre : c, 
    //   arrivee, 
    //   depart, 
    //   nuits: nights,
    //   prixParNuit : c.prix_nuit,
    //   total: c.prix_nuit * nights,
    //   status: "PENDING",
    //   paymentStatus : "UNPAID",
    //   paymentMethod: "Carte bancaire",
    // } ]))

    setSejours(prev => ([...prev, data.reservation]))

    console.log(data.reservation);

    navigate(`/payementpage/${data.reservation._id}`);
  } catch (e) {
    console.log(e);

    alert(e.response?.data?.message || e.message);
  }
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
                src={`http://localhost:3000${chambre.images[0]}`}
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
                €{chambre.prix_nuit} × {nights} nuits
              </span>

              <span className="text-white text-lg font-bold">
                €{chambre.prix_nuit * nights}
              </span>
            </div>

            {/* Button */}
            <button
              onClick={() => reserver(chambre)}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 text-white"
              style={{
                background:
                  "linear-gradient(135deg,#7c3aed,#4f46e5)",
              }}
            >
              Continuer →
            </button>
          </div>
      
      </div>
    </div>
  );
}