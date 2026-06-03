import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaApple, FaPaypal} from "react-icons/fa";

import {
  CreditCard,
  Wallet,
  Banknote,
  Smartphone,
  CalendarDays, Bed ,
  DollarSign
} from "lucide-react";

const useFont = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
};

const RESERVATION = {
  id: "RES-2843",
  chambre: { type: "Standard", numero: "101", lit: "1 lit double", capacite: 2 },
  dates: "14 → 18 Avr 2026",
  nights: 4,
  prixNuit: 120,
  taxes: 48,
  img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
};



const METHODS = [
  {
    id: "carte",
    label: "Carte",
    icon: CreditCard,
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: Wallet,
  },
  {
    id: "apple",
    label: "Apple Pay",
    icon: Smartphone,
  },
  {
    id: "especes",
    label: "Espèces",
    icon: Banknote,
  },
];

/* ── Input field ───────────────────────────────────── */
function Field({ label, placeholder, icon, type = "text", half = false, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={half ? "flex-1" : "w-full"}>
      <label
        className="block text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: "#7a6050", letterSpacing: ".14em", fontSize: 10 }}
      >{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#a8968a" }}>{icon}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl py-3 text-sm transition-all duration-200 focus:outline-none"
          style={{
            paddingLeft: icon ? 42 : 16,
            paddingRight: 16,
            background: focused ? "rgba(160,120,80,.06)" : "#faf7f4",
            border: focused ? "1.5px solid #a07850" : "1.5px solid #ddd5c8",
            color: "#1c1917",
            boxShadow: focused ? "0 0 0 3px rgba(160,120,80,.1)" : "none",
            fontFamily: "'DM Sans', sans-serif",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
}

/* ── Method button ─────────────────────────────────── */
function MethodBtn({ m, active, onClick }) {
  const Icon = m.icon; 

  return (
    <button
      onClick={() => onClick(m.id)}
      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-200"
      style={{
        background: active ? "rgba(160,120,80,.1)" : "#faf7f4",
        border: active ? "1.5px solid #a07850" : "1.5px solid #ddd5c8",
        color: active ? "#7c5a38" : "#a8968a",
        boxShadow: active ? "0 0 0 3px rgba(160,120,80,.1)" : "none",
      }}
    >
      <span
        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          border: active ? "1.5px solid #a07850" : "1.5px solid #c8b8a8",
        }}
      >
        {active && (
          <span className="w-2 h-2 rounded-full" style={{ background: "#a07850" }} />
        )}
      </span>

     
      <Icon size={16} />

      <span>{m.label}</span>
    </button>
  );
}

/* ── Summary card ──────────────────────────────────── */
function Summary({ reservation }) {
  

  const formatDate = (dateString) => {
    const months = [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
      "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
    ];
  
    const date = new Date(dateString);
  
    return `${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  const total = reservation?.prixParNuit  * reservation?.nuits;
  return (
    <div
      className="rounded-2xl overflow-hidden sticky top-24"
      style={{ background: "#fff", border: "1px solid #ddd5c8", boxShadow: "0 4px 20px rgba(60,30,10,.07)" }}
    >
      <p
        className="px-5 pt-5 pb-3 font-bold text-base"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1c1917", fontSize: 18 }}
      >
        Récapitulatif
      </p>
      <div className="h-px" style={{ background: "#ede5db" }} />

      <div className="overflow-hidden" style={{ height: 140 }}>
        <img src={`http://localhost:3000${reservation?.chambre?.images?.[0]}`} alt={reservation?.chambre.type} className="w-full h-full object-cover" style={{ filter: "brightness(.92)" }} />
      </div>

      <div className="p-5">
        <h3 className="font-bold mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1c1917", fontSize: 17 }}>
          {reservation?.chambre.type} · Chambre {reservation?.chambre.numero}
        </h3>
        <div className="space-y-2 mb-5">
        <div className="flex items-center gap-2.5">
          <CalendarDays size={14} style={{ color: "#a07850" }} />
          <span className="text-sm" style={{ color: "#6b5244" }}>
            {/* {res.dates} */}
            {formatDate(reservation?.arrivee)} → {formatDate(reservation?.depart)}
            {/* "14 → 18 Avr 2026", */}
            
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Bed size={14} style={{ color: "#a07850" }} />
          <span className="text-sm" style={{ color: "#6b5244" }}>
            {reservation?.chambre.lit} · {reservation?.chambre.capacite} personnes
          </span>
        </div>
      </div>

        <div className="h-px mb-4" style={{ background: "#ede5db" }} />

        <div className="space-y-2.5 mb-4">
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: "#a8968a" }}>€{reservation?.prixParNuit} × {reservation?.nuits} nuits</span>
            <span className="text-sm font-semibold" style={{ color: "#1c1917" }}>€ {reservation?.prixParNuit * reservation?.nuits}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: "#a8968a" }}>Taxes & frais</span>
            <span className="text-sm font-semibold" style={{ color: "#1c1917" }}>€ 0</span>
          </div>
        </div>

        <div className="h-px mb-4" style={{ background: "#ede5db" }} />

        <div className="flex justify-between items-center">
          <span className="font-semibold" style={{ color: "#1c1917" }}>Total</span>
          <span className="font-bold text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d2614" }}>€ {total}</span>
        </div>

        <div
          className="mt-5 flex items-center justify-center gap-2 py-2.5 rounded-xl"
          style={{ background: "rgba(160,120,80,.08)", border: "1px solid rgba(160,120,80,.2)" }}
        >
          <span className="text-xs">🔒</span>
          <span className="text-xs font-medium" style={{ color: "#7c5a38" }}>Paiement 100% sécurisé</span>
        </div>
      </div>
    </div>
  );
}

/* ── Success screen ────────────────────────────────── */
function SuccessScreen() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-5"
        style={{ background: "rgba(34,197,90,.1)", border: "1.5px solid rgba(34,197,90,.3)" }}
      >
        ✓
      </div>
      <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1c1917" }}>
        Réservation confirmée !
      </h2>
      <p className="text-sm mb-1" style={{ color: "#6b5244" }}>
        Réservation <span className="font-semibold" style={{ color: "#a07850" }}>{RESERVATION.id}</span> — Paiement accepté
      </p>
      <p className="text-sm" style={{ color: "#a8968a" }}>Un email de confirmation a été envoyé à votre adresse.</p>
      <div className="flex gap-3 mt-8">
        <button
          onClick={() => navigate('/messejours')}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)", boxShadow: "0 4px 15px rgba(160,120,80,.3)" }}
        >
          Voir mes séjours
        </button>
        <button
          onClick={() => navigate('/home')}
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ background: "#faf7f4", border: "1px solid #ddd5c8", color: "#6b5244" }}
          onMouseEnter={e => e.currentTarget.style.background = "#f0e8e0"}
          onMouseLeave={e => e.currentTarget.style.background = "#faf7f4"}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────── */
export default function PaiementPage() {
  useFont();

  const [method, setMethod] = useState("carte");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);
  const [search, setSearch] = useState("");

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const total = reservation?.prixParNuit * reservation?.nuits ;


  function formatReservationId(id) {
    const num = parseInt(id.slice(-4), 16); // convertit les 4 derniers caractères hexadécimaux
    const code = num.toString(36).toUpperCase();
  
    return `RES-${code}`;
  }
  
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);

        const {data} = await axios.get(
          `http://localhost:3000/api/reservations/getonereservation/${id}`
        );
        console.log('one res', data )
        setReservation(data.reservation);
      } catch (err) {
        setError(
          err.data?.message || "Erreur lors du chargement"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReservation();
    }
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  

  const handlePay = async () => {
    try {
      setPaying(true);
      const res = await axios.post(
        `http://localhost:3000/api/payments/createpayment/${id}`,
        {
          methode:
            method === "carte"   ? "Carte bancaire" :
            method === "paypal"  ? "PayPal" :
            method === "apple"   ? "Apple Pay" :
                                   "Espèces",
          montant_paye: total,
          taxe: 0,
          reduction: 0,
          transaction_id: `TXN-${Date.now()}`,
          notes: "Paiement depuis frontend",
        },
        { withCredentials: true }
      );
      setTimeout(() => { setPaying(false); setPaid(true); }, 800);
    } catch (error) {
      console.log("Erreur paiement:", error.response?.data || error.message);
      setPaying(false);
    }
  };

  const formatCard   = v => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = v => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f5f0eb", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>

      <main className="flex-1 overflow-y-auto flex flex-col">

        {/* Topbar */}
        <div
          className="sticky top-0 z-20 px-8 py-4"
          style={{ background: "rgba(245,240,235,.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #ddd5c8" }}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#a8968a" }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher chambres, clients, réservations..."
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl focus:outline-none transition-all"
                style={{ background: "#fff", border: "1px solid #ddd5c8", color: "#1c1917" }}
                onFocus={e => { e.target.style.borderColor = "#a07850"; e.target.style.boxShadow = "0 0 0 3px rgba(160,120,80,.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#ddd5c8"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div
              className="relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all"
              style={{ background: "#fff", border: "1px solid #ddd5c8" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0e8e0"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              <span style={{ color: "#a8968a" }}>🔔</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#f5f0eb]" style={{ background: "#a07850" }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-7 flex-1">

          {/* Header */}
          <div className="mb-6" style={{ animation: "fadeUp .5s ease both" }}>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1c1917" }}>
              Paiement
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#a8968a" }}>Finalisez votre réservation en toute sécurité.</p>
          </div>

          {/* Alert banner */}
          {!paid && (
            <div
              className="flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-7"
              style={{ background: "rgba(245,158,11,.07)", border: "1px solid rgba(245,158,11,.25)", animation: "fadeUp .5s .05s ease both" }}
            >
              <span style={{ color: "#d97706", fontSize: 16 }}>⏱</span>
              <p className="text-sm">
                <span style={{ color: "#6b5244" }}>Réservation </span>
                <span className="font-semibold" style={{ color: "#a07850" }}>{formatReservationId(reservation._id)}</span>
                <span style={{ color: "#6b5244" }}> créée — statut </span>
                <span className="font-semibold" style={{ color: "#d97706" }}>En attente</span>
                <span style={{ color: "#6b5244" }}> jusqu'au paiement.</span>
              </p>
            </div>
          )}

          {paid ? (
            <SuccessScreen />
          ) : (
            <div className="flex gap-6" style={{ animation: "fadeUp .5s .1s ease both" }}>

              {/* ── Payment form ── */}
              <div className="flex-1 min-w-0">
                <div
                  className="rounded-2xl p-6"
                  style={{ background: "#fff", border: "1px solid #ddd5c8", boxShadow: "0 2px 12px rgba(60,30,10,.05)" }}
                >
                  <p className="font-bold mb-4 text-base" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1c1917", fontSize: 18 }}>
                    Méthode de paiement
                  </p>

                  {/* Method selector — 2×2 grid to fit 4 options */}
                  <div className="grid grid-cols-2 gap-3 mb-7">
                    {METHODS.map(m => <MethodBtn key={m.id} m={m} active={method === m.id} onClick={setMethod} />)}
                  </div>  

                  {/* Card form */}
                  {method === "carte" && (
                    <div className="space-y-4">
                      <Field label="Numéro de carte" placeholder="4242 4242 4242 4242" 
                        value={cardNum} onChange={v => setCardNum(formatCard(v))} />
                      <div className="flex gap-3">
                        <Field label="Expiration" placeholder="MM/AA" half value={expiry} onChange={v => setExpiry(formatExpiry(v))} />
                        <Field label="CVC" placeholder="123"  half value={cvc} onChange={v => setCvc(v.replace(/\D/g, "").slice(0, 3))} />
                      </div>
                      <Field label="Nom sur la carte" placeholder="Élise Moreau" value={name} onChange={setName} />
                    </div>
                  )}

                  {method === "paypal" && (
                    <div
                      className="rounded-xl py-8 text-center"
                      style={{ background: "#faf7f4", border: "1px solid #ddd5c8" }}
                    >
                      <div className="flex items-center justify-center text-3xl mb-3">
                        <FaPaypal size={32} />
                    </div>
                      <p className="text-sm font-semibold mb-1" style={{ color: "#1c1917" }}>Se connecter à PayPal</p>
                      <p className="text-xs" style={{ color: "#a8968a" }}>Vous serez redirigé vers PayPal pour compléter votre paiement.</p>
                    </div>
                  )}

                  {method === "apple" && (
                    <div
                      className="rounded-xl py-8 text-center"
                      style={{ background: "#faf7f4", border: "1px solid #ddd5c8" }}
                    >
                      <div className="flex items-center justify-center text-3xl mb-3"> <FaApple /> </div>           
                      <p className="text-sm font-semibold mb-1" style={{ color: "#1c1917" }}>Payer avec Apple Pay</p>
                      <p className="text-xs" style={{ color: "#a8968a" }}>Utilisez Face ID ou Touch ID pour confirmer.</p>
                    </div>
                  )}

                  {method === "especes" && (
                    <div
                      className="rounded-xl py-8 px-6 text-center"
                      style={{ background: "#faf7f4", border: "1px solid #ddd5c8" }}
                    >
                      <div className="flex items-center justify-center text-3xl mb-4">
                          <Banknote size={32} />
                        </div>
                      <p className="text-sm font-semibold mb-2" style={{ color: "#1c1917" }}>Paiement en espèces à la réception</p>
                      <p className="text-xs mb-5" style={{ color: "#a8968a" }}>
                        Présentez-vous à l'accueil avec le montant exact. Votre réservation sera confirmée à réception du paiement.
                      </p>
                      <div
                        className="flex items-center justify-center gap-6 py-4 rounded-xl"
                        style={{ background: "rgba(160,120,80,.07)", border: "1px solid rgba(160,120,80,.15)" }}
                      >
                        {[
                          { icon: "🕐", label: "Réception 24h/24" },
                          { icon: "📍", label: "Hall principal" },
                          { icon: "🧾", label: "Reçu fourni" },
                        ].map(item => (
                          <div key={item.label} className="flex flex-col items-center gap-1">
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-xs font-medium" style={{ color: "#7c5a38" }}>{item.label}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs mt-4" style={{ color: "#a8968a" }}>
                        Montant à régler : <span className="font-bold text-sm" style={{ color: "#3d2614" }}>€ {total}</span>
                      </p>
                    </div>
                  )}

                  {/* Pay button */}
                  <button
                    onClick={handlePay}
                    disabled={paying}
                    className="w-full mt-6 py-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2.5"
                    style={{
                      background: paying
                        ? "rgba(160,120,80,.5)"
                        : "linear-gradient(135deg,#a07850,#7c5a38)",
                      boxShadow: paying ? "none" : "0 6px 24px rgba(160,120,80,.35)",
                      cursor: paying ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={e => { if (!paying) e.currentTarget.style.filter = "brightness(1.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}
                  >
                    {paying ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Traitement en cours…
                      </>
                    ) : method === "especes" ? (
                      <>
                        <span>💵</span>
                        Confirmer — paiement à la réception
                      </>
                    ) : (
                      <>
                        <span>🔒</span>
                        Payer € {total}
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs mt-3" style={{ color: "#b8a898" }}>
                    Transaction sécurisée · SSL 256-bit
                  </p>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 mt-5">
                  {["🔐 Paiement chiffré", "✅ Sans frais cachés", "↩️ Annulation gratuite"].map(b => (
                    <span key={b} className="text-xs flex items-center gap-1.5" style={{ color: "#a8968a" }}>{b}</span>
                  ))}
                </div>
              </div>

              {/* ── Summary ── */}
              <div className="w-72 shrink-0">
               <Summary reservation={reservation} />
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin .7s linear infinite; }
        input::placeholder { color: #b8a898; }
      `}</style>
    </div>
  );
}