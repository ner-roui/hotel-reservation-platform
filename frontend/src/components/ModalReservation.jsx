import { useContext, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/Context";
import { useToast } from "../components/useToast";

/* ── Stars ──────────────────────────────── */
function Stars({ note }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      <span className="text-amber-500 text-sm">★</span>
      <span className="text-sm font-semibold" style={{ color: "#1c1917" }}>
        {note?.toFixed(1)}
      </span>
    </div>
  );
}

/* ── Modal Réservation ──────────────────────────────── */
export default function ModalReservation({ chambre, onClose }) {
  const navigate = useNavigate();
  const { fetchSejours } = useContext(AppContext);
  const { toast, ToastPortal } = useToast();

  const [arrivee, setArrivee] = useState(new Date());
  const [depart, setDepart] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000)
  );
  const [openArrivee, setOpenArrivee] = useState(false);
  const [openDepart, setOpenDepart] = useState(false);

  // Intervalles de dates indisponibles (payées)
  const [excludedIntervals, setExcludedIntervals] = useState([]);
  const [loadingDates, setLoadingDates] = useState(true);

  // Fetch des dates bloquées dès l'ouverture
  useEffect(() => {
    if (!chambre?._id) return;

    setLoadingDates(true);
    axios
      .get(
        `http://localhost:3000/api/chambres/unavailable-dates/${chambre._id}`,
        { withCredentials: true }
      )
      // .then(({ data }) => {
      //   // data.intervals = [{ start: "ISO string", end: "ISO string" }, ...]
      //   const parsed = (data.intervals || []).map((r) => ({
      //     start: new Date(r.start), // ← objet Date obligatoire pour excludeDateIntervals
      //     end: new Date(r.end),
      //   }));
      //   setExcludedIntervals(parsed);
      // })
      .then(({ data }) => {
        const parsed = (data.intervals || []).map((r) => {
          const start = new Date(r.start);
          const end = new Date(r.end);
      
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
      
          return { start, end };

        });
        console.log(parsed);
        setExcludedIntervals(parsed);
      })
      .catch(() => {
        // Silencieux : le backend re-vérifie de toute façon
        setExcludedIntervals([]);
      })
      .finally(() => setLoadingDates(false));
  }, [chambre?._id]);

  // Quand l'arrivée change, on s'assure que le départ reste valide
  // (pas dans une période bloquée et > arrivée)
  const handleArriveeChange = (date) => {
    setArrivee(date);

    // Calculer le prochain départ valide : J+1 après l'arrivée
    const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);

    // Si ce nextDay tombe dans un intervalle bloqué, avancer jusqu'après
    const safe = getNextAvailableDate(nextDay, excludedIntervals);
    setDepart(safe);
    setOpenArrivee(false);
  };

  if (!chambre) return null;

  const nights =
    arrivee && depart
      ? Math.max(0, Math.ceil((depart - arrivee) / (1000 * 60 * 60 * 24)))
      : 0;

  const formatDate = (date) => {
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
        { arrivee, depart, prixParNuit: c.prix_nuit },
        { withCredentials: true }
      );
      toast.success("Réservation créée avec succès.");
      await fetchSejours();
      setTimeout(() => {
        navigate(`/payementpage/${data.reservation._id}`);
      }, 4000);
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  return (
    <>
      <ToastPortal />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 backdrop-blur-md"
          style={{ background: "rgba(44,26,14,.45)" }}
        />

        {/* Modal */}
        <div
          className="relative w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: "#fff",
            border: "1px solid #ddd5c8",
            boxShadow:
              "0 32px 64px rgba(60,30,10,.18), 0 0 0 1px rgba(160,120,80,.1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress bar */}
          <div className="h-0.5" style={{ background: "#ede5db" }}>
            <div
              className="h-full transition-all duration-500"
              style={{
                width: "50%",
                background: "linear-gradient(to right,#a07850,#c8903c)",
              }}
            />
          </div>

          <div className="p-6">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
              style={{
                background: "#f5f0eb",
                border: "1px solid #ddd5c8",
                color: "#a8968a",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ede5db";
                e.currentTarget.style.color = "#3d2614";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f5f0eb";
                e.currentTarget.style.color = "#a8968a";
              }}
            >
              ✕
            </button>

            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "#a07850", letterSpacing: ".14em" }}
            >
              Étape 1 / 2
            </p>

            <h3
              className="text-xl font-bold mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#1c1917",
              }}
            >
              Récapitulatif
            </h3>

            {/* Chambre preview */}
            <div
              className="flex gap-4 rounded-2xl overflow-hidden mb-5"
              style={{ background: "#faf7f4", border: "1px solid #ede5db" }}
            >
              <img
                src={`http://localhost:3000${chambre.images[0]}`}
                className="w-28 h-24 object-cover flex-shrink-0"
                alt=""
                style={{ filter: "brightness(.95)" }}
              />
              <div className="py-3 pr-3">
                <p
                  className="font-bold text-sm"
                  style={{
                    color: "#1c1917",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 15,
                  }}
                >
                  {chambre.type} — Ch. {chambre.numero}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#a8968a" }}>
                  {chambre.superficie} m² · {chambre.lit}
                </p>
                <Stars note={chambre.note} />
              </div>
            </div>

            {/* Loader pendant le fetch des dates */}
            {loadingDates && (
              <p
                className="text-xs text-center mb-3"
                style={{ color: "#a8968a" }}
              >
                Chargement des disponibilités…
              </p>
            )}

            {/* Date chips */}
            <div className="grid grid-cols-3 gap-2 mb-5">

              {/* ARRIVÉE */}
              <div
                className="rounded-xl py-2.5 text-center relative cursor-pointer transition-all"
                style={{ background: "#faf7f4", border: "1px solid #ddd5c8" }}
                onClick={() => setOpenArrivee(true)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#a07850")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#ddd5c8")
                }
              >
                <p className="text-xs mb-0.5" style={{ color: "#a8968a" }}>
                  Arrivée
                </p>
                <p
                  className="text-xs font-semibold"
                  style={{ color: "#1c1917" }}
                >
                  {formatDate(arrivee)}
                </p>
                <DatePicker
                  selected={arrivee}
                  onChange={handleArriveeChange}
                  open={openArrivee}
                  minDate={new Date()}
                  // calendarStartDay={1}   // ← 0 = Dim, 1 = Lun
                  excludeDateIntervals={excludedIntervals}
                  onClickOutside={() => setOpenArrivee(false)}
                  popperPlacement="bottom"
                  customInput={<div />}
                />
              </div>

              {/* DÉPART */}
              <div
                className="rounded-xl py-2.5 text-center relative cursor-pointer transition-all"
                style={{ background: "#faf7f4", border: "1px solid #ddd5c8" }}
                onClick={() => setOpenDepart(true)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#a07850")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#ddd5c8")
                }
              >
                <p className="text-xs mb-0.5" style={{ color: "#a8968a" }}>
                  Départ
                </p>
                <p
                  className="text-xs font-semibold"
                  style={{ color: "#1c1917" }}
                >
                  {formatDate(depart)}
                </p>
                <DatePicker
                  selected={depart}
                  onChange={(date) => {
                    setDepart(date);
                    setOpenDepart(false);
                  }}
                  open={openDepart}
                  minDate={new Date(arrivee.getTime() + 24 * 60 * 60 * 1000)}
              
                  excludeDateIntervals={excludedIntervals}
                  onClickOutside={() => setOpenDepart(false)}
                  popperPlacement="bottom"
                  customInput={<div />}
                />
              </div>

              {/* DURÉE */}
              <div
                className="rounded-xl py-2.5 text-center"
                style={{
                  background: "rgba(160,120,80,.07)",
                  border: "1px solid rgba(160,120,80,.2)",
                }}
              >
                <p className="text-xs mb-0.5" style={{ color: "#a8968a" }}>
                  Durée
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: "#7c5a38" }}
                >
                  {nights} nuits
                </p>
              </div>
            </div>

            {/* Total */}
            <div
              className="flex justify-between items-center py-3 mb-5"
              style={{
                borderTop: "1px solid #ede5db",
                borderBottom: "1px solid #ede5db",
              }}
            >
              <span className="text-sm" style={{ color: "#a8968a" }}>
                €{chambre.prix_nuit} × {nights} nuits
              </span>
              <span
                className="text-lg font-bold"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#1c1917",
                }}
              >
                €{chambre.prix_nuit * nights}
              </span>
            </div>

            {/* Annulation note */}
            <p
              className="text-xs mb-4 text-center"
              style={{ color: "#22a75a" }}
            >
              ✓ Annulation gratuite avant l'arrivée
            </p>

            {/* CTA button */}
            <button
              onClick={() => reserver(chambre)}
              disabled={nights === 0}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg,#a07850,#7c5a38)",
                boxShadow: "0 4px 16px rgba(160,120,80,.35)",
              }}
              onMouseEnter={(e) => {
                if (nights > 0) e.currentTarget.style.filter = "brightness(1.08)";
              }}
              onMouseLeave={(e) =>
                (e.currentTarget.style.filter = "none")
              }
            >
              Continuer →
            </button>
          </div>
        </div>

        <style>{`
        
          .react-datepicker {
            font-family: 'DM Sans', sans-serif !important;
            border: 1px solid #ddd5c8 !important;
            border-radius: 12px !important;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(60,30,10,.12) !important;
          }
          .react-datepicker__header {
            background: #faf7f4 !important;
            border-bottom: 1px solid #ede5db !important;
          }
          .react-datepicker__current-month,
          .react-datepicker__day-name {
            color: #3d2614 !important;
          }
          .react-datepicker__day--selected,
          .react-datepicker__day--in-range {
            background: #a07850 !important;
            color: #fff !important;
            border-radius: 6px !important;
          }
          .react-datepicker__day:hover:not(.react-datepicker__day--excluded) {
            background: #f0e8e0 !important;
            color: #3d2614 !important;
            border-radius: 6px !important;
          }
          .react-datepicker__day--keyboard-selected {
            background: rgba(160,120,80,.15) !important;
            color: #3d2614 !important;
          }
          .react-datepicker__navigation-icon::before {
            border-color: #a07850 !important;
          }

          /* ✅ Toute la période indisponible : grisée + barrée + curseur interdit */
          .react-datepicker__day--excluded {
            background: #f5eeeb !important;
            color: #c9a99a !important;
            text-decoration: line-through !important;
            cursor: not-allowed !important;
            border-radius: 6px !important;
            opacity: 0.7;
          }
          .react-datepicker__day--excluded:hover {
            background: #f5eeeb !important;
            color: #c9a99a !important;
          }
          
        `}</style>
      </div>
    </>
  );
}

/* ── Utilitaire : trouver la prochaine date disponible ── */
function getNextAvailableDate(date, intervals) {
  let current = new Date(date);
  let maxIterations = 365; // sécurité

  while (maxIterations-- > 0) {
    const blocked = intervals.some(
      ({ start, end }) => current >= start && current <= end
    );
    if (!blocked) return current;
    // Avancer d'un jour
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
  }

  return current;
}