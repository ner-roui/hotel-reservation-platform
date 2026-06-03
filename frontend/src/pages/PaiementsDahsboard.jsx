import { useState, useEffect, useRef } from "react";
import axios from "axios"

const useFont = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
};



const STATUT_CFG = {
  "Payé":        { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0", dot: "#22c55e" },
  "En attente":  { bg: "#fef9c3", text: "#a16207", border: "#fde68a", dot: "#eab308" },
  "Remboursé":   { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0", dot: "#94a3b8" },
  "Échoué":      { bg: "#fee2e2", text: "#b91c1c", border: "#fecaca", dot: "#ef4444" },
};

const METHODE_ICONS = {
  "Carte Visa": "💳", "Carte Mastercard": "💳",
  "Espèces": "💵", "Virement": "🏦",
  "Apple Pay": "🍎", "PayPal": "🅿️",
};

const NAV = [
  { label: "Dashboard",    icon: "⊞" },
  { label: "Chambres",     icon: "🛏" },
  { label: "Utilisateurs", icon: "👥" },
  { label: "Paiements",    icon: "💳" },
  { label: "Réservations", icon: "📅" },
  { label: "Rapports",     icon: "📊" },
  { label: "Paramètres",   icon: "⚙️" },
];

/* ── Animated counter ───────────────────────────────── */
function AnimCounter({ target, prefix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <>{prefix}{val.toLocaleString("fr-FR")}</>;
}

/* ── Sparkline SVG ──────────────────────────────────── */
function Sparkline({ data, color }) {
  const w = 80, h = 28;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity=".08" stroke="none" />
    </svg>
  );
}

/* ── KPI Card ───────────────────────────────────────── */
function KpiCard({ title, value, prefix, badge, badgeColor, sparkData, sparkColor, accent, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 relative overflow-hidden"
      style={{
        background: hov ? "#ffffff" : "#fafafa",
        border: hov ? `1.5px solid ${accent}40` : "1.5px solid #e8ecf0",
        boxShadow: hov ? `0 12px 40px ${accent}18, 0 2px 8px rgba(0,0,0,.06)` : "0 1px 4px rgba(0,0,0,.05)",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        animation: `fadeUp .5s ${delay}s ease both`,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, ${accent}, ${accent}00)`, opacity: hov ? 1 : 0 }} />

      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>💳</div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
          style={{ background: `${badgeColor}12`, color: badgeColor, border: `1px solid ${badgeColor}25` }}>
          ↗ {badge}
        </span>
      </div>

      <div>
        <p className="text-sm font-medium mb-1" style={{ color: "#94a3b8" }}>{title}</p>
        <p className="text-3xl font-bold tracking-tight" style={{ color: "#0f172a", fontFamily: "'Instrument Serif',serif" }}>
          <AnimCounter target={value} prefix={prefix} />
        </p>
      </div>

      <div className="flex items-end justify-between">
        <Sparkline data={sparkData} color={accent} />
        <span className="text-xs" style={{ color: "#94a3b8" }}>30 derniers jours</span>
      </div>
    </div>
  );
}

/* ── Transaction row ────────────────────────────────── */
function TxRow({ tx, idx }) {
  const [hov, setHov] = useState(false);
  const sc = STATUT_CFG[tx.statut] || STATUT_CFG["Payé"];

  const generatePaymentRef = (id) => {
    const shortId = id.slice(-4).toUpperCase();
  
    return `PAY-${shortId}`;
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

 
  return (
    <tr
      className="transition-all duration-150"
      style={{
        background: hov ? "#f8faff" : "transparent",
        borderBottom: "1px solid #f1f5f9",
        animation: `fadeUp .35s ${.08 + idx * .05}s ease both`,
        opacity: 0,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* ID */}
      <td className="px-5 py-3.5">
        <span className="text-xs font-mono font-semibold px-2 py-1 rounded-lg"
          style={{ background: "#f1f5f9", color: "#64748b" }}>{generatePaymentRef(tx._id)}</span>
      </td>

      {/* Client */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: tx.color }}>
           {tx.user?.prenom?.[0]} {tx.user?.name?.[0] } 
          </div>
          <span className="text-sm font-semibold" style={{ color: "#0f172a" }}> {tx.user?.prenom} {tx.user?.name } </span>
        </div>
      </td>

      {/* Méthode */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="text-base">{METHODE_ICONS[tx.methode] || "💳"}</span>
          <span className="text-sm" style={{ color: "#64748b" }}>{tx.methode}</span>
        </div>
      </td>

      {/* Date */}
      <td className="px-4 py-3.5">
        <span className="text-sm" style={{ color: "#94a3b8" }}>{formatDate(tx.date_paiement)}</span>
      </td>

      {/* Montant */}
      <td className="px-4 py-3.5">
        <span className="text-sm font-bold" style={{ color: "#0f172a", fontFamily: "'Instrument Serif',serif", fontSize: 16 }}>
          € {tx.montant_paye.toLocaleString("fr-FR")}
        </span>
      </td>

      {/* Statut */}
      <td className="px-4 py-3.5">
        <span className="flex items-center gap-1.5 w-fit text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
          {tx.statut}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ opacity: hov ? 1 : 0 }}>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all"
            style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}
            onMouseEnter={e => { e.currentTarget.style.background="#ede9fe"; e.currentTarget.style.color="#7c3aed"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#f1f5f9"; e.currentTarget.style.color="#64748b"; }}
          >📄</button>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all"
            style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}
            onMouseEnter={e => { e.currentTarget.style.background="#fef3c7"; e.currentTarget.style.color="#d97706"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#f1f5f9"; e.currentTarget.style.color="#64748b"; }}
          >↩</button>
        </div>
      </td>
    </tr>
  );
}

/* ── Main ───────────────────────────────────────────── */
export default function PaiementsPage() {
  useFont();
  const [activeNav, setActiveNav] = useState("Paiements");
  const [activeRole, setActiveRole] = useState("Admin");
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [payments, setPayments] = useState([])

  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  // const [refunds, setRefunds] = useState(0);
  

  const fetchTotalPayments = async () => {
    try {
      const {data} = await axios.get("http://localhost:3000/api/payments/total-month");
      console.log('payments-total', data.totalMontantPaye )
      setTotal(data.totalMontantPaye);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const {data} = await axios.get("http://localhost:3000/api/payments/pending");
    
      setPending(data.totalPending);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPayments = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/payments/getpayments"
      );
  
      console.log(data);
  
      // liste des paiements
      setPayments(data.payments);
  
      // nombre total
      setCount(data.count);
  
    } catch (error) {
      console.log(error);
    }
  };
    useEffect(() => {
      fetchTotalPayments();
      fetchPendingPayments();
      fetchPayments();
      // fetchRefunds();
    }, []);

  const filtered = payments.filter(t => {
    const mSearch = !search || t.client.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search) || t.methode.toLowerCase().includes(search.toLowerCase());
    const mStatut = filterStatut === "Tous" || t.statut === filterStatut;
    return mSearch && mStatut;
  });

  // const total   = TRANSACTIONS.reduce((s, t) => t.statut === "Payé" ? s + t.montant : s, 0);
  // const pending = TRANSACTIONS.reduce((s, t) => t.statut === "En attente" ? s + t.montant : s, 0);
  const refunds = TRANSACTIONS?.reduce((s, t) => t.statut === "Remboursé" ? s + t.montant : s, 0);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f4f6f9", fontFamily: "'DM Sans',sans-serif", fontWeight: 300 }}>
        {/* Divider */}
        <div className="h-px mx-3 mb-4" style={{ background: "#f1f5f9" }} />

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto flex flex-col">

        {/* Topbar */}
        <div className="sticky top-0 z-20 px-8 py-4"
          style={{ background: "rgba(244,246,249,.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e8ecf0" }}>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#94a3b8" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher chambres, clients, réservations..."
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl focus:outline-none transition-all"
                style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", color: "#0f172a" }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all"
              style={{ background: "#ffffff", border: "1.5px solid #e2e8f0" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#6366f1"}
              onMouseLeave={e => e.currentTarget.style.borderColor="#e2e8f0"}>
              <span style={{ color: "#64748b" }}>🔔</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: "#6366f1" }} />
            </div>
          </div>
        </div>

        <div className="px-8 py-7 flex-1">

          {/* Page header */}
          <div className="flex items-start justify-between mb-7" style={{ animation: "fadeUp .5s ease both" }}>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#0f172a", fontFamily: "'Instrument Serif',serif", fontWeight: 400, fontSize: 28 }}>
                Paiements
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>Suivi des transactions et factures.</p>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-3 gap-4 mb-7">
            <KpiCard title="Total perçu" value={total} prefix="€ " badge="+12%" badgeColor="#22c55e"
              sparkData={[2100,3400,2800,4200,3800,5100,4700,6200,5800,total/100]}
              sparkColor="#6366f1" accent="#6366f1" delay={0} />
            <KpiCard title="En attente" value={pending} prefix="€ " badge="8 paiements" badgeColor="#eab308"
              sparkData={[800,1200,900,1500,1100,1800,1400,2100,1800,pending/10]}
              sparkColor="#f59e0b" accent="#f59e0b" delay={0.06} />
            <KpiCard title="Remboursements" value={refunds} prefix="€ " badge="ce mois" badgeColor="#94a3b8"
              sparkData={[200,400,300,500,400,600,500,700,600,refunds/2]}
              sparkColor="#94a3b8" accent="#94a3b8" delay={0.12} />
          </div>

          {/* Transactions table */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "#ffffff", border: "1.5px solid #e8ecf0", boxShadow: "0 2px 12px rgba(0,0,0,.05)", animation: "fadeUp .5s .18s ease both", opacity: 0 }}>

            {/* Table header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <div>
                <h2 className="font-semibold text-base" style={{ color: "#0f172a" }}>Transactions récentes</h2>
                <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{filtered.length} transactions</p>
              </div>
              <div className="flex items-center gap-2.5">
                {/* Filter tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e8ecf0" }}>
                  {["Tous", "Payé", "En attente", "Remboursé"].map(s => (
                    <button key={s} onClick={() => setFilterStatut(s)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        background: filterStatut === s ? "#ffffff" : "transparent",
                        color: filterStatut === s ? "#6366f1" : "#64748b",
                        boxShadow: filterStatut === s ? "0 1px 4px rgba(0,0,0,.08)" : "none",
                        fontWeight: filterStatut === s ? 600 : 400,
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
                {/* Export */}
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                  style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#64748b" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="#6366f1"; e.currentTarget.style.color="#6366f1"; e.currentTarget.style.background="#ede9fe"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.color="#64748b"; e.currentTarget.style.background="#f8fafc"; }}
                >↓ Export CSV</button>
              </div>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #f8fafc" }}>
                  {["N°", "Client", "Méthode", "Date", "Montant", "Statut", ""].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "#cbd5e1", letterSpacing: ".09em", background: "#fafbfc" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="text-3xl mb-3">💳</div>
                      <p className="text-sm font-medium" style={{ color: "#64748b" }}>Aucune transaction trouvée</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx, i) => <TxRow key={tx._id} tx={tx} idx={i} />)
                )}
              </tbody>
            </table>

            {/* Table footer */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: "1px solid #f1f5f9", background: "#fafbfc" }}>
              <p className="text-xs" style={{ color: "#94a3b8" }}>Affichage de {filtered.length} sur {TRANSACTIONS.length} transactions</p>
              <div className="flex items-center gap-2">
                {["←", "1", "2", "3", "→"].map((p, i) => (
                  <button key={i} className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-all"
                    style={{
                      background: p === "1" ? "#6366f1" : "#f8fafc",
                      color: p === "1" ? "#ffffff" : "#64748b",
                      border: "1px solid #e2e8f0",
                    }}
                    onMouseEnter={e => { if(p !== "1"){ e.currentTarget.style.borderColor="#6366f1"; e.currentTarget.style.color="#6366f1"; }}}
                    onMouseLeave={e => { if(p !== "1"){ e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.color="#64748b"; }}}
                  >{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

      
      </main>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color:#cbd5e1; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:2px; }
      `}</style>
    </div>
  );
}