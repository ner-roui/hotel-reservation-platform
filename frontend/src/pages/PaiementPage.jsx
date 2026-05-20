import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

const useFont = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
};

/* ── Reservation context ───────────────────────────── */
const RESERVATION = {
  id: "RES-2843",
  chambre: { type: "Standard", numero: "101", lit: "1 lit double", capacite: 2 },
  dates: "14 → 18 Avr 2026",
  nights: 4,
  prixNuit: 120,
  taxes: 48,
  img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
};

/* ── Nav items ─────────────────────────────────────── */
const NAV = [
  { label: "Réserver",    icon: "🔍" },
  { label: "Mes séjours", icon: "📅" },
  { label: "Favoris",     icon: "♡" },
  { label: "Paramètres",  icon: "⚙️" },
];

/* ── Payment methods ───────────────────────────────── */
const METHODS = [
  { id: "carte",  label: "Carte",     icon: "💳" },
  { id: "paypal", label: "PayPal",    icon: "🅿️" },
  { id: "apple",  label: "Apple Pay", icon: "🍎" },
];

/* ── Input component ───────────────────────────────── */
function Field({ label, placeholder, icon, type = "text", half = false, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={half ? "flex-1" : "w-full"}>
      <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: "rgba(148,163,184,.55)", letterSpacing: ".14em", fontSize: 10 }}>{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "rgba(100,116,139,.6)" }}>{icon}</span>
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
            background: focused ? "rgba(124,58,237,.08)" : "rgba(255,255,255,.04)",
            border: focused ? "1.5px solid rgba(124,58,237,.5)" : "1.5px solid rgba(255,255,255,.09)",
            color: "#f8fafc",
            boxShadow: focused ? "0 0 0 3px rgba(124,58,237,.1)" : "none",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
}

/* ── Payment Method Selector ───────────────────────── */
function MethodBtn({ m, active, onClick }) {
  return (
    <button
      onClick={() => onClick(m.id)}
      className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium transition-all duration-200"
      style={{
        background: active ? "rgba(124,58,237,.18)" : "rgba(255,255,255,.03)",
        border: active ? "1.5px solid rgba(124,58,237,.55)" : "1.5px solid rgba(255,255,255,.08)",
        color: active ? "#c4b5fd" : "rgba(148,163,184,.65)",
        boxShadow: active ? "0 0 0 3px rgba(124,58,237,.1)" : "none",
      }}
    >
      {/* Radio dot */}
      <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
        style={{
          border: active ? "1.5px solid #7c3aed" : "1.5px solid rgba(255,255,255,.2)",
          background: "transparent",
        }}>
        {active && <span className="w-2 h-2 rounded-full" style={{ background: "#7c3aed" }} />}
      </span>
      <span>{m.icon}</span>
      <span>{m.label}</span>
    </button>
  );
}

/* ── Summary Card ──────────────────────────────────── */
function Summary({ res }) {
  const total = res.prixNuit * res.nights + res.taxes;
  return (
    <div className="rounded-2xl overflow-hidden sticky top-24"
      style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
      <p className="px-5 pt-5 pb-3 font-semibold text-white text-base" style={{ fontFamily: "'Playfair Display',serif" }}>
        Récapitulatif
      </p>
      <div className="h-px mx-0" style={{ background: "rgba(255,255,255,.06)" }} />

      {/* Room image */}
      <div className="overflow-hidden" style={{ height: 140 }}>
        <img src={res.img} alt={res.chambre.type} className="w-full h-full object-cover" style={{ filter: "brightness(.85)" }} />
      </div>

      <div className="p-5">
        {/* Room info */}
        <h3 className="font-semibold text-white mb-3" style={{ fontFamily: "'Playfair Display',serif", fontSize: 17 }}>
          {res.chambre.type} · Chambre {res.chambre.numero}
        </h3>
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2.5">
            <span style={{ color: "rgba(124,58,237,.8)", fontSize: 14 }}>📅</span>
            <span className="text-sm" style={{ color: "rgba(148,163,184,.8)" }}>{res.dates}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span style={{ color: "rgba(124,58,237,.8)", fontSize: 14 }}>🛏️</span>
            <span className="text-sm" style={{ color: "rgba(148,163,184,.8)" }}>{res.chambre.lit} · {res.chambre.capacite} personnes</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-4" style={{ background: "rgba(255,255,255,.06)" }} />

        {/* Price breakdown */}
        <div className="space-y-2.5 mb-4">
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: "rgba(148,163,184,.7)" }}>€{res.prixNuit} × {res.nights} nuits</span>
            <span className="text-sm font-medium text-white">€ {res.prixNuit * res.nights}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: "rgba(148,163,184,.7)" }}>Taxes & frais</span>
            <span className="text-sm font-medium text-white">€ {res.taxes}</span>
          </div>
        </div>

        <div className="h-px mb-4" style={{ background: "rgba(255,255,255,.06)" }} />

        <div className="flex justify-between items-center">
          <span className="font-semibold text-white text-base">Total</span>
          <span className="font-bold text-white text-xl" style={{ fontFamily: "'Playfair Display',serif" }}>€ {total}</span>
        </div>

        {/* Security note */}
        <div className="mt-5 flex items-center justify-center gap-2 py-2.5 rounded-xl"
          style={{ background: "rgba(124,58,237,.08)", border: "1px solid rgba(124,58,237,.15)" }}>
          <span className="text-xs">🔒</span>
          <span className="text-xs font-medium" style={{ color: "rgba(167,139,250,.8)" }}>Paiement 100% sécurisé</span>
        </div>
      </div>
    </div>
  );
}

/* ── Success Screen ────────────────────────────────── */
function SuccessScreen() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-5"
        style={{ background: "rgba(16,185,129,.12)", border: "1.5px solid rgba(16,185,129,.3)" }}>
        ✓
      </div>
      <h2 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>
        Réservation confirmée !
      </h2>
      <p className="text-sm mb-1" style={{ color: "rgba(148,163,184,.7)" }}>
        Réservation <span className="font-semibold" style={{ color: "#a78bfa" }}>{RESERVATION.id}</span> — Paiement accepté
      </p>
      <p className="text-sm" style={{ color: "rgba(100,116,139,.7)" }}>Un email de confirmation a été envoyé à votre adresse.</p>
      <div className="flex gap-3 mt-8">
        <button onClick={() => navigate('/messejours')}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 4px 15px rgba(124,58,237,.3)" }}>
          Voir mes séjours
        </button>
        <button onClick={() => navigate('/home')}
        className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(148,163,184,.8)" }}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────── */
export default function PaiementPage() {
  useFont();

  const [activeNav, setActiveNav] = useState("Mes séjours");
  const [activeRole, setActiveRole] = useState("Client");
  const [method, setMethod] = useState("carte");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const total = RESERVATION.prixNuit * RESERVATION.nights + RESERVATION.taxes;

  // const handlePay = () => {
  //   setPaying(true);
  //   setTimeout(() => { setPaying(false); setPaid(true); }, 1800);
  // };

  const { id } = useParams(); // reservation id depuis URL

const handlePay = async () => {
  try {
    setPaying(true);

    // const token = localStorage.getItem("token"); // si auth

    const res = await axios.post(
      `http://localhost:3000/api/payments/createpayment/${id}`,
      {

        methode:
          method === "carte"
            ? "Carte bancaire"
            : method === "paypal"
            ? "PayPal"
            : "Espèces",

        montant_paye: total,
        taxe: 0,
        reduction: 0,
        transaction_id: `TXN-${Date.now()}`,
        notes: "Paiement depuis frontend",
      },
      {
       withCredentials : true
      }
    );

    console.log("Paiement success:", res.data);

    setTimeout(() => {
      setPaying(false);
      setPaid(true);
    }, 800);
  } catch (error) {
    console.log("Erreur paiement:", error.response?.data || error.message);

    setPaying(false);
  }
};

  const formatCard = v => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = v => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#080b14", fontFamily: "'Outfit',sans-serif", fontWeight: 300 }}>

   
      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto flex flex-col">

        {/* Topbar */}
        <div className="sticky top-0 z-20 px-8 py-4 transition-all duration-300"
          style={{
            background: "rgba(8,11,20,.95)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,.06)",
          }}>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "rgba(100,116,139,.6)" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher chambres, clients, réservations..."
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl focus:outline-none transition-all"
                style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", color: "#f8fafc" }}
                onFocus={e => e.target.style.borderColor = "rgba(124,58,237,.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.08)"}
              />
            </div>
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
              style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}>
              <span style={{ color: "rgba(148,163,184,.7)" }}>🔔</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2"
                style={{ background: "#7c3aed", borderColor: "#080b14" }} />
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="px-8 py-7 flex-1">

          {/* Header */}
          <div className="mb-6" style={{ animation: "fadeUp .5s ease both" }}>
            <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "'Playfair Display',serif" }}>
              Paiement
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "rgba(100,116,139,.75)" }}>Finalisez votre réservation en toute sécurité.</p>
          </div>

          {/* Alert banner */}
          {!paid && (
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-7"
              style={{
                background: "rgba(245,158,11,.07)",
                border: "1px solid rgba(245,158,11,.2)",
                animation: "fadeUp .5s .05s ease both",
              }}>
              <span style={{ color: "#f59e0b", fontSize: 16 }}>⏱</span>
              <p className="text-sm">
                <span style={{ color: "rgba(148,163,184,.7)" }}>Réservation </span>
                <span className="font-semibold" style={{ color: "#a78bfa" }}>{RESERVATION.id}</span>
                <span style={{ color: "rgba(148,163,184,.7)" }}> créée — statut </span>
                <span className="font-semibold" style={{ color: "#f59e0b" }}>En attente</span>
                <span style={{ color: "rgba(148,163,184,.7)" }}> jusqu'au paiement.</span>
              </p>
            </div>
          )}

          {paid ? (
            <SuccessScreen />
          ) : (
            <div className="flex gap-6" style={{ animation: "fadeUp .5s .1s ease both" }}>
              {/* ── Payment form ── */}
              <div className="flex-1 min-w-0">
                <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)" }}>

                  {/* Method selector */}
                  <p className="font-semibold text-white mb-4 text-base" style={{ fontFamily: "'Playfair Display',serif" }}>
                    Méthode de paiement
                  </p>
                  <div className="flex gap-3 mb-7">
                    {METHODS.map(m => <MethodBtn key={m.id} m={m} active={method === m.id} onClick={setMethod} />)}
                  </div>

                  {/* Card form */}
                  {method === "carte" && (
                    <div className="space-y-4">
                      <Field label="Numéro de carte" placeholder="4242 4242 4242 4242" icon="💳"
                        value={cardNum} onChange={v => setCardNum(formatCard(v))} />
                      <div className="flex gap-3">
                        <Field label="Expiration" placeholder="MM/AA" half
                          value={expiry} onChange={v => setExpiry(formatExpiry(v))} />
                        <Field label="CVC" placeholder="123" icon="🔒" half
                          value={cvc} onChange={v => setCvc(v.replace(/\D/g, "").slice(0, 3))} />
                      </div>
                      <Field label="Nom sur la carte" placeholder="Élise Moreau"
                        value={name} onChange={setName} />
                    </div>
                  )}

                  {method === "paypal" && (
                    <div className="rounded-xl py-8 text-center" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.07)" }}>
                      <div className="text-3xl mb-3">🅿️</div>
                      <p className="text-sm font-medium text-white mb-1">Se connecter à PayPal</p>
                      <p className="text-xs" style={{ color: "rgba(100,116,139,.7)" }}>Vous serez redirigé vers PayPal pour compléter votre paiement.</p>
                    </div>
                  )}

                  {method === "apple" && (
                    <div className="rounded-xl py-8 text-center" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.07)" }}>
                      <div className="text-3xl mb-3">🍎</div>
                      <p className="text-sm font-medium text-white mb-1">Payer avec Apple Pay</p>
                      <p className="text-xs" style={{ color: "rgba(100,116,139,.7)" }}>Utilisez Face ID ou Touch ID pour confirmer.</p>
                    </div>
                  )}

                  {/* Pay button */}
                  <button
                    onClick={handlePay}
                    disabled={paying}
                    className="w-full mt-6 py-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2.5 relative overflow-hidden"
                    style={{
                      background: paying ? "rgba(124,58,237,.6)" : "linear-gradient(135deg,#7c3aed,#4f46e5)",
                      boxShadow: paying ? "none" : "0 6px 24px rgba(124,58,237,.4)",
                      cursor: paying ? "not-allowed" : "pointer",
                    }}
                  >
                    {paying ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Traitement en cours…
                      </>
                    ) : (
                      <>
                        <span>🔒</span>
                        Payer € {total}
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs mt-3" style={{ color: "rgba(100,116,139,.5)" }}>
                    Transaction sécurisée · SSL 256-bit
                  </p>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 mt-5">
                  {["🔐 Paiement chiffré","✅ Sans frais cachés","↩️ Annulation gratuite"].map(b => (
                    <span key={b} className="text-xs flex items-center gap-1.5" style={{ color: "rgba(100,116,139,.6)" }}>{b}</span>
                  ))}
                </div>
              </div>

              {/* ── Summary ── */}
              <div className="w-72 shrink-0">
                <Summary res={RESERVATION} />
              </div>
            </div>
          )}
        </div>

     
      </main>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin .7s linear infinite; }
        input::placeholder { color: rgba(100,116,139,.45); }
      `}</style>
    </div>
  );
}