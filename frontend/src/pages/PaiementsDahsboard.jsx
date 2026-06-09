import { useState, useEffect } from "react";
import axios from "axios";

const useFont = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
};

const STATUT_CFG = {
  "Payé":       { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0", dot: "#22c55e" },
  "En attente": { bg: "#fef9c3", text: "#a16207", border: "#fde68a", dot: "#eab308" },
  "Remboursé":  { bg: "#faf7f4", text: "#7c5a38", border: "#ddd5c8", dot: "#a8968a" },
  "Échoué":     { bg: "#fee2e2", text: "#b91c1c", border: "#fecaca", dot: "#ef4444" },
};

const METHODE_ICONS = {
  "Carte Visa": "💳", "Carte Mastercard": "💳",
  "Espèces": "💵", "Virement": "🏦",
  "Apple Pay": "🍎", "PayPal": "🅿️",
};

const ITEMS_PER_PAGE = 10;

/* ── Animated counter ─────────────────────────────── */
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

/* ── Sparkline ────────────────────────────────────── */
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
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} fillOpacity=".1" stroke="none" />
    </svg>
  );
}

/* ── KPI Card ─────────────────────────────────────── */
function KpiCard({ title, value, prefix, badge, badgeColor, sparkData, sparkColor, accent, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 relative overflow-hidden"
      style={{
        background: hov ? "#fff" : "#fdfbf8",
        border: hov ? `1.5px solid ${accent}60` : "1.5px solid #ede5db",
        boxShadow: hov ? `0 12px 40px ${accent}20, 0 2px 8px rgba(44,26,14,.06)` : "0 1px 4px rgba(44,26,14,.05)",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        animation: `fadeUp .5s ${delay}s ease both`,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, ${accent}, ${accent}00)`, opacity: hov ? 1 : 0 }} />

      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>💳</div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
          style={{ background: `${badgeColor}15`, color: badgeColor, border: `1px solid ${badgeColor}30` }}>
          ↗ {badge}
        </span>
      </div>

      <div>
        <p className="text-sm font-medium mb-1" style={{ color: "#a8968a" }}>{title}</p>
        <p className="text-3xl font-bold tracking-tight" style={{ color: "#2c1a0e", fontFamily: "'Cormorant Garamond',serif" }}>
          <AnimCounter target={value} prefix={prefix} />
        </p>
      </div>

      <div className="flex items-end justify-between">
        <Sparkline data={sparkData} color={accent} />
        <span className="text-xs" style={{ color: "#a8968a" }}>30 derniers jours</span>
      </div>
    </div>
  );
}

/* ── Transaction Row ──────────────────────────────── */
function TxRow({ tx, idx }) {
  const [hov, setHov] = useState(false);
  const sc = STATUT_CFG[tx.statut] || STATUT_CFG["Payé"];

  const generatePaymentRef = (id) => `PAY-${id.slice(-4).toUpperCase()}`;
  const formatDate = (date) => new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <tr
      className="transition-all duration-150"
      style={{
        background: hov ? "#faf7f4" : "transparent",
        borderBottom: "1px solid #faf7f4",
        animation: `fadeUp .35s ${.08 + idx * .04}s ease both`,
        opacity: 0,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <td className="px-5 py-3.5">
        <span className="text-xs font-mono font-semibold px-2 py-1 rounded-lg"
          style={{ background: "#f0e6db", color: "#7c5a38" }}>
          {generatePaymentRef(tx._id)}
        </span>
      </td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: tx.color || "linear-gradient(135deg,#a07850,#7c5a38)" }}>
            {tx.user?.prenom?.[0]}{tx.user?.name?.[0]}
          </div>
          <span className="text-sm font-semibold" style={{ color: "#2c1a0e" }}>
            {tx.user?.prenom} {tx.user?.name}
          </span>
        </div>
      </td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="text-base">{METHODE_ICONS[tx.methode] || "💳"}</span>
          <span className="text-sm" style={{ color: "#6b5b52" }}>{tx.methode}</span>
        </div>
      </td>

      <td className="px-4 py-3.5">
        <span className="text-sm" style={{ color: "#a8968a" }}>{formatDate(tx.date_paiement)}</span>
      </td>

      <td className="px-4 py-3.5">
        <span className="font-bold" style={{ color: "#2c1a0e", fontFamily: "'Cormorant Garamond',serif", fontSize: 16 }}>
          € {tx.montant_paye?.toLocaleString("fr-FR")}
        </span>
      </td>

      <td className="px-4 py-3.5">
        <span className="flex items-center gap-1.5 w-fit text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
          {tx.statut}
        </span>
      </td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5 justify-end transition-opacity" style={{ opacity: hov ? 1 : 0 }}>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all"
            style={{ background: "#f0e6db", color: "#7c5a38", border: "1px solid #ddd5c8" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#e8d5bf"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f0e6db"; }}
          >📄</button>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all"
            style={{ background: "#fef9c3", color: "#a16207", border: "1px solid #fde68a" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fef08a"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fef9c3"; }}
          >↩</button>
        </div>
      </td>
    </tr>
  );
}

/* ── Pagination Button ────────────────────────────── */
function PageBtn({ label, active, disabled, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-all"
      style={{
        background: active
          ? "linear-gradient(135deg,#a07850,#7c5a38)"
          : disabled
            ? "#faf7f4"
            : hov ? "#f0e6db" : "#faf7f4",
        color: active ? "#fff" : disabled ? "#ddd5c8" : hov ? "#a07850" : "#a8968a",
        border: active ? "none" : disabled ? "1px solid #ede5db" : hov ? "1px solid #a07850" : "1px solid #ddd5c8",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={() => !disabled && !active && setHov(true)}
      onMouseLeave={() => setHov(false)}
    >{label}</button>
  );
}

/* ── Main ─────────────────────────────────────────── */
export default function PaiementsPage() {
  useFont();

  const [search,       setSearch]       = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [payments,     setPayments]     = useState([]);
  const [total,        setTotal]        = useState(0);
  const [pending,      setPending]      = useState(0);
  const [currentPage,  setCurrentPage]  = useState(1);

  useEffect(() => {
    axios.get("https://hotel-reservation-platform-dgtp.onrender.com/api/payments/total-month")
      .then(({ data }) => setTotal(data.totalMontantPaye)).catch(console.error);
    axios.get("https://hotel-reservation-platform-dgtp.onrender.com/api/payments/pending")
      .then(({ data }) => setPending(data.totalPending)).catch(console.error);
    axios.get("https://hotel-reservation-platform-dgtp.onrender.com/api/payments/getpayments")
      .then(({ data }) => setPayments(data.payments)).catch(console.error);
  }, []);

  // Reset page on filter/search change
  useEffect(() => { setCurrentPage(1); }, [search, filterStatut]);

  const filtered = payments.filter(t => {
    const mSearch = !search ||
      `${t.user?.prenom} ${t.user?.name}`.toLowerCase().includes(search.toLowerCase()) ||
      t._id.includes(search) ||
      (t.methode || "").toLowerCase().includes(search.toLowerCase());
    const mStatut = filterStatut === "Tous" || t.statut === filterStatut;
    return mSearch && mStatut;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const rangeEnd   = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#faf7f4", fontFamily: "'DM Sans',sans-serif", fontWeight: 300 }}>
      <main className="flex-1 overflow-y-auto flex flex-col">

        {/* Topbar */}
        <div className="sticky top-0 z-20 px-8 py-4"
          style={{ background: "rgba(250,247,244,.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #ede5db" }}>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#a8968a" }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher client, méthode, référence..."
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl focus:outline-none transition-all"
                style={{ background: "#fff", border: "1.5px solid #ddd5c8", color: "#2c1a0e" }}
                onFocus={e => { e.target.style.borderColor = "#a07850"; e.target.style.boxShadow = "0 0 0 3px rgba(160,120,80,0.12)"; }}
                onBlur={e =>  { e.target.style.borderColor = "#ddd5c8"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all"
              style={{ background: "#fff", border: "1.5px solid #ddd5c8" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#a07850"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#ddd5c8"}>
              
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: "#a07850" }} />
            </div>
          </div>
        </div>

        <div className="px-8 py-7 flex-1">

          {/* Header */}
          <div className="flex items-start justify-between mb-7" style={{ animation: "fadeUp .5s ease both" }}>
            <div>
              <h1 style={{ color: "#2c1a0e", fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 28 }}>
                Paiements
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "#a8968a" }}>Suivi des transactions et factures.</p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)" }}
            >↓ Export CSV</button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 mb-7">
            <KpiCard
              title="Total perçu" value={total} prefix="€ " badge="+12%" badgeColor="#22c55e"
              sparkData={[2100,3400,2800,4200,3800,5100,4700,6200,5800, total / 100 || 1]}
              sparkColor="#a07850" accent="#a07850" delay={0}
            />
            <KpiCard
              title="En attente" value={pending} prefix="€ " badge="En cours" badgeColor="#eab308"
              sparkData={[800,1200,900,1500,1100,1800,1400,2100,1800, pending / 10 || 1]}
              sparkColor="#c4a882" accent="#c4a882" delay={0.06}
            />
          </div>

          {/* Table card */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "#fff", border: "1.5px solid #ede5db", boxShadow: "0 2px 12px rgba(44,26,14,.05)", animation: "fadeUp .5s .18s ease both", opacity: 0 }}>

            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #faf7f4" }}>
              <div>
                <h2 className="font-semibold text-base" style={{ color: "#2c1a0e" }}>Transactions récentes</h2>
                <p className="text-xs mt-0.5" style={{ color: "#a8968a" }}>{filtered.length} transactions</p>
              </div>
              <div className="flex items-center gap-2.5">
                {/* Filter tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "#faf7f4", border: "1px solid #ede5db" }}>
                  {["Tous", "Payé", "En attente"].map(s => (
                    <button
                      key={s}
                      onClick={() => setFilterStatut(s)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        background: filterStatut === s ? "#fff" : "transparent",
                        color: filterStatut === s ? "#a07850" : "#a8968a",
                        boxShadow: filterStatut === s ? "0 1px 4px rgba(44,26,14,.08)" : "none",
                        fontWeight: filterStatut === s ? 600 : 400,
                        border: filterStatut === s ? "1px solid #ddd5c8" : "1px solid transparent",
                      }}
                    >{s}</button>
                  ))}
                </div>
                {/* Export */}
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                  style={{ background: "#faf7f4", border: "1.5px solid #ddd5c8", color: "#7c5a38" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f0e6db"; e.currentTarget.style.borderColor = "#a07850"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#faf7f4"; e.currentTarget.style.borderColor = "#ddd5c8"; }}
                >↓ Export CSV</button>
              </div>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #faf7f4" }}>
                  {["N°", "Client", "Méthode", "Date", "Montant", "Statut", ""].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "#c4a882", background: "#fdfbf8", letterSpacing: ".09em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="text-3xl mb-3">💳</div>
                      <p className="text-sm font-medium" style={{ color: "#a8968a" }}>Aucune transaction trouvée</p>
                    </td>
                  </tr>
                ) : (
                  paginated.map((tx, i) => <TxRow key={tx._id} tx={tx} idx={i} />)
                )}
              </tbody>
            </table>

            {/* Footer + Pagination */}
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderTop: "1px solid #faf7f4", background: "#fdfbf8" }}>
              <p className="text-xs" style={{ color: "#a8968a" }}>
                {filtered.length === 0
                  ? "Aucune transaction"
                  : `Affichage de ${rangeStart}–${rangeEnd} sur ${filtered.length} transactions`}
              </p>

              <div className="flex items-center gap-2">
                {/* Précédent */}
                <PageBtn
                  label="←"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                />

                {/* Pages numérotées */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <PageBtn
                    key={p}
                    label={p}
                    active={currentPage === p}
                    onClick={() => setCurrentPage(p)}
                  />
                ))}

                {/* Suivant */}
                <PageBtn
                  label="→"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        input::placeholder { color: #c4a882; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #ddd5c8; border-radius: 2px; }
      `}</style>
    </div>
  );
}