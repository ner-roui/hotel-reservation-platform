import { useState, useContext, useMemo, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { AppContext } from "../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const STATUS_LABELS = {
  PENDING:   "En attente",
  CONFIRMED: "Confirmée",
  CHECKIN:   "Checkin",
  CHECKOUT:  "Checkout",
  CANCELLED: "Annulée",
};

const STATUS_STYLES = {
  PENDING:   "bg-amber-50 text-amber-700 border border-amber-200",
  CONFIRMED: "bg-[#f0e6db] text-[#7c5a38] border border-[#ddd5c8]",
  CHECKIN:   "bg-green-50 text-green-700 border border-green-200",
  CHECKOUT:  "bg-slate-100 text-slate-500 border border-slate-200",
  CANCELLED: "bg-red-50 text-red-600 border border-red-200",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-xl px-4 py-3" style={{ border: "1px solid #ede5db" }}>
        <p className="text-sm font-bold" style={{ color: "#3d2614" }}>€ {payload[0].value.toLocaleString()}</p>
        <p className="text-xs" style={{ color: "#a8968a" }}>{label} 2026</p>
      </div>
    );
  }
  return null;
};

function generateColor(text = "") {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = text.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash % 360)}, 70%, 55%)`;
}

function generateReservationCode(id) {
  const hex = id.replace(/[^a-fA-F0-9]/g, "");
  const number = parseInt(hex.slice(-6), 16);
  return `RES-${(number % 10000).toString().padStart(4, "0")}`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export default function LumiereHotelsDashboard() {
  const { reservations, chambres } = useContext(AppContext);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [occupiedRooms,  setOccupiedRooms]  = useState([]);
  const [roomsToClean,   setRoomsToClean]   = useState([]);
  const [total,          setTotal]          = useState(0);
  const [resAnnule,      setResAnnule]      = useState([]);
  const [revenueData,    setRevenueData]    = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const get = (url, setter, key) =>
      axios.get(url).then(({ data }) => setter(data[key])).catch(console.error);

    get("https://hotel-reservation-platform-dgtp.onrender.com/api/chambres/available",                  setAvailableRooms, "chambres");
    get("https://hotel-reservation-platform-dgtp.onrender.com/api/chambres/to-clean",                   setRoomsToClean,   "chambres");
    get("https://hotel-reservation-platform-dgtp.onrender.com/api/chambres/not-available",              setOccupiedRooms,  "chambres");
    get("https://hotel-reservation-platform-dgtp.onrender.com/api/payments/total",                      setTotal,          "totalMontantPaye");
    get("https://hotel-reservation-platform-dgtp.onrender.com/api/reservations/getreservationsannule",  setResAnnule,      "reservations");
    axios.get("https://hotel-reservation-platform-dgtp.onrender.com/api/reservations/monthly-revenue")
      .then(({ data }) => setRevenueData(data.revenueData)).catch(console.error);
  }, []);

  const occupationRate = useMemo(() => {
    const tot = chambres?.length || 0;
    return tot > 0 ? ((occupiedRooms.length / tot) * 100).toFixed(1) : 0;
  }, [occupiedRooms, chambres]);

  // ← couleurs originales conservées
  const roomData = [
    { name: "Disponibles", value: availableRooms.length || 1, color: "#2DD4BF" },
    { name: "Occupées",    value: occupiedRooms.length  || 1, color: "#818CF8" },
    { name: "À nettoyer",  value: roomsToClean.length   || 1, color: "#FB923C" },
  ];

  const kpis = [
    {
      icon: "💳", label: "Revenu total",
      value: `€ ${total.toLocaleString()}`, sub: "vs mois dernier",
      badge: "↗ +12.4%", badgeType: "green", accent: true,
    },
    {
      icon: "📊", label: "Taux d'occupation",
      value: `${occupationRate}%`, sub: `${occupiedRooms.length} / ${chambres?.length ?? 0} chambres`,
      badge: "↗ +4.1%", badgeType: "green",
    },
    {
      icon: "📅", label: "Réservations",
      value: reservations?.length ?? 0, sub: "actives",
      badge: "↗ +8.2%", badgeType: "green",
    },
    {
      icon: "🗑️", label: "Annulations",
      value: resAnnule?.length ?? 0, sub: "ce mois",
      badge: "↘ -0.6%", badgeType: "red",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#faf7f4", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <main className="flex-1 overflow-y-auto">

        {/* Topbar */}
        <div className="sticky top-0 z-10 px-8 pt-6 pb-2" style={{ background: "#faf7f4" }}>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#a8968a" }}>🔍</span>
              <input
                type="text"
                placeholder="Rechercher chambres, clients, réservations..."
                className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none shadow-sm"
                style={{ border: "1px solid #ddd5c8", color: "#3d2614" }}
              />
            </div>
           
          </div>
        </div>

        <div className="px-8 py-5">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#2c1a0e" }}>Tableau de bord</h1>
              <p className="text-sm mt-0.5" style={{ color: "#a8968a" }}>
                Vue d'ensemble — {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
              </p>
            </div>
        
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {kpis.map((k, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 relative overflow-hidden"
                style={
                  k.accent
                    ? { background: "linear-gradient(135deg,#3d2614,#7c5a38)" }
                    : { background: "#fff", border: "1px solid #ede5db" }
                }
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: k.accent ? "rgba(255,255,255,0.15)" : "#faf7f4" }}
                  >
                    {k.icon}
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={
                      k.badgeType === "green"
                        ? k.accent
                          ? { background: "rgba(160,120,80,0.25)", color: "#e7d8c7" }
                          : { background: "#f0fdf4", color: "#15803d" }
                        : { background: "#fef2f2", color: "#dc2626" }
                    }
                  >
                    {k.badge}
                  </span>
                </div>
                <p className="text-sm mb-1" style={{ color: k.accent ? "#c4a882" : "#a8968a" }}>{k.label}</p>
                <p className="text-3xl font-bold mb-1" style={{ color: k.accent ? "#fff" : "#2c1a0e" }}>{k.value}</p>
                <p className="text-xs" style={{ color: "#a8968a" }}>{k.sub}</p>
                {k.accent && (
                  <div className="absolute bottom-4 right-4 opacity-30">
                    <svg width="80" height="30" viewBox="0 0 80 30">
                      <polyline points="0,25 15,20 30,22 45,15 60,10 75,8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-3 gap-4 mb-6">

            {/* Area chart */}
            <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid #ede5db" }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold" style={{ color: "#2c1a0e" }}>Revenu mensuel</h3>
                  <p className="text-xs mt-0.5" style={{ color: "#a8968a" }}>Montant total perçu (€)</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1 text-sm bg-white px-3 py-1.5 rounded-lg"
                    style={{ border: "1px solid #ddd5c8", color: "#7c5a38" }}
                  >
                    2026 <span className="text-xs">▾</span>
                  </button>
                  <button className="px-1" style={{ color: "#a8968a" }}>•••</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#a07850" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#a07850" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a8968a" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#a8968a" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone" dataKey="value"
                    stroke="#a07850" strokeWidth={2.5}
                    fill="url(#revenueGrad)"
                    dot={{ fill: "#a07850", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#7c5a38" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart — couleurs originales */}
            <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid #ede5db" }}>
              <h3 className="font-semibold mb-0.5" style={{ color: "#2c1a0e" }}>État des chambres</h3>
              <p className="text-xs mb-4" style={{ color: "#a8968a" }}>Temps réel</p>
              <div className="flex justify-center mb-4 relative">
                <PieChart width={160} height={160}>
                  <Pie data={roomData} cx={75} cy={75} innerRadius={50} outerRadius={70} dataKey="value" strokeWidth={0}>
                    {roomData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-slate-800">{chambres?.length}</span>
                  <span className="text-xs text-slate-400">chambres</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-teal-50 rounded-xl p-2.5 text-center">
                  <div className="text-teal-500 text-base mb-1">🛋️</div>
                  <p className="text-xs text-slate-500">Disponibles</p>
                  <p className="text-lg font-bold text-teal-600">{availableRooms.length}</p>
                </div>
                <div className="bg-violet-50 rounded-xl p-2.5 text-center">
                  <div className="text-violet-500 text-base mb-1">📋</div>
                  <p className="text-xs text-slate-500">Occupées</p>
                  <p className="text-lg font-bold text-violet-600">{occupiedRooms.length}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-2.5 text-center">
                  <div className="text-orange-500 text-base mb-1">✨</div>
                  <p className="text-xs text-slate-500">À nettoyer</p>
                  <p className="text-lg font-bold text-orange-500">{roomsToClean.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid #ede5db" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #ede5db" }}>
              <h3 className="font-semibold" style={{ color: "#2c1a0e" }}>Réservations récentes</h3>
              <button
                onClick={() => navigate("/dashboard/reservations")}
                className="text-sm font-medium flex items-center gap-1 hover:opacity-75 transition-opacity"
                style={{ color: "#a07850" }}
              >
                Voir tout <span>›</span>
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #ede5db", background: "#faf7f4" }}>
                  {["N°", "Client", "Chambre", "Dates", "Montant", "Statut"].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#a8968a" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservations?.map((r, i) => (
                  <tr
                    key={r._id}
                    className="transition-colors cursor-pointer"
                    style={{ borderBottom: i !== reservations.length - 1 ? "1px solid #faf7f4" : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#faf7f4"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    <td className="px-6 py-4 text-sm font-mono" style={{ color: "#a8968a" }}>
                      {generateReservationCode(r._id)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: generateColor(`${r.user?.prenom || ""}${r.user?.name || ""}`) }}
                        >
                          {r.user?.prenom?.[0]}{r.user?.name?.[0]}
                        </div>
                        <span className="text-sm font-medium" style={{ color: "#2c1a0e" }}>
                          {r.user?.prenom} {r.user?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm" style={{ color: "#6b5b52" }}>
                        <span>🛏</span> Chambre {r.chambre?.numero}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm" style={{ color: "#6b5b52" }}>
                        <span>📅</span> {formatDate(r.arrivee)} → {formatDate(r.depart)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#3d2614" }}>
                      €{r.total}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status]}`}>
                        {STATUS_LABELS[r.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}