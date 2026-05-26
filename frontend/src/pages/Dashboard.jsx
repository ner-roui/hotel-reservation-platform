import { useState, useContext, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { AppContext } from "../context/Context";
import { useEffect } from "react";
import axios from "axios"

// const revenueData = [
//   { month: "Jan", value: 2800 },
//   { month: "Fév", value: 2200 },
//   { month: "Mar", value: 3100 },
//   { month: "Avr", value: 5700 },
//   { month: "Mai", value: 4900 },
//   { month: "Juin", value: 3800 },
//   { month: "Juil", value: 4200 },
//   { month: "Août", value: 3600 },
//   { month: "Sep", value: 3000 },
//   { month: "Oct", value: 2700 },
//   { month: "Nov", value: 2400 },
//   { month: "Déc", value: 2100 },
// ];

const roomData = [
  { name: "Disponibles", value: 4, color: "#2DD4BF" },
  { name: "Occupées", value: 2, color: "#818CF8" },
  { name: "À nettoyer", value: 1, color: "#FB923C" },
];



const reservations = [
  { id: "RES-2841", client: "Émile Rousseau", initials: "ÉR", color: "#6366f1", chambre: "Chambre 402", dates: "12 Avr → 15 Avr", montant: "€ 1 560", statut: "Confirmée", statutColor: "bg-emerald-100 text-emerald-700" },
  { id: "RES-2840", client: "Léa Bernard", initials: "LB", color: "#ec4899", chambre: "Chambre 202", dates: "13 Avr → 14 Avr", montant: "€ 220", statut: "Check-in", statutColor: "bg-blue-100 text-blue-700" },
  { id: "RES-2839", client: "Hugo Martin", initials: "HM", color: "#f59e0b", chambre: "Chambre 101", dates: "11 Avr → 13 Avr", montant: "€ 240", statut: "En attente", statutColor: "bg-orange-100 text-orange-700" },
  { id: "RES-2838", client: "Camille Petit", initials: "CP", color: "#10b981", chambre: "Chambre 501", dates: "14 Avr → 18 Avr", montant: "€ 3 920", statut: "Confirmée", statutColor: "bg-emerald-100 text-emerald-700" },
];

const STATUS_LABELS = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  CHECKIN: "Checkin",
  CHECKOUT: "Checkout",
  CANCELLED: "Annulée",
};

const STATUS_STYLES = {
  PENDING: "bg-orange-50 text-orange-600 border border-orange-100",
  CONFIRMED: "bg-blue-50 text-blue-700 border border-blue-100",
  CHECKIN: "bg-green-50 text-green-700 border border-green-100",
  CHECKOUT: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  CANCELLED: "bg-red-50 text-red-700 border border-red-100",
};



const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-xl px-4 py-3 border border-slate-100">
        <p className="text-sm font-bold text-slate-800">€ {payload[0].value.toLocaleString()}</p>
        <p className="text-xs text-slate-500">{label} 2026</p>
      </div>
    );
  }
  return null;
};

export default function LumiereHotelsDashboard() {
const {reservations, chambres} = useContext(AppContext);
const [avaibaleRoms, setAvaibaleRoms] = useState([]);
const [notavaibaleRoms, setNotAvaibaleRoms] = useState([]);
 const [roomsToClean, setRoomsToClean] = useState([])
const [total, setTotal] = useState(0);
const [resAnnule, setResAnnule] = useState([])

const [revenueData, setRevenueData] = useState([]);

const fetchRevenueData = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:3000/api/payments/monthly-revenue"
    );

    setRevenueData(data.revenueData);

  } catch (error) {
    console.log(error);
  }
};


 const generateColor = (text = "") => {
  let hash = 0;

  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash % 360);

  return `hsl(${hue}, 70%, 55%)`;
};



 function generateReservationCode(id) {
  // garder uniquement les chiffres hexadécimaux
  const hex = id.replace(/[^a-fA-F0-9]/g, "");

  // convertir une partie de l'id en nombre
  const number = parseInt(hex.slice(-6), 16);

  // limiter à 4 chiffres
  const code = (number % 10000).toString().padStart(4, "0");

  return `RES-${code}`;
}

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      
    });
  };

  const stats = useMemo(() => {
  const occupiedRooms = notavaibaleRoms?.length || 0;
  const totalRooms = chambres?.length || 0;

  const occupationRate =
    totalRooms > 0
      ? ((occupiedRooms / totalRooms) * 100).toFixed(1)
      : 0;

  return {
    occupiedRooms,
    totalRooms,
    occupationRate,
  };
}, [notavaibaleRoms, chambres]);

  

    const fetchReservationsAnnule = async () => {
    try {
      const {data} = await axios.get("http://localhost:3000/api/reservations/getreservationsannule");
      console.log('reservations annulee-->', data);
      setResAnnule(data.reservations);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalPayments = async () => {
    try {
      const {data} = await axios.get("http://localhost:3000/api/payments/total");
      console.log('total-->', data);
      setTotal(data.totalMontantPaye);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const {data} = await axios.get("http://localhost:3000/api/chambres/available");
      console.log('chambres-->', data);
      setAvaibaleRoms(data.chambres);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoomsToClean  = async () => {
    try {
      const {data} = await axios.get("http://localhost:3000/api/chambres/to-clean");
      console.log('chambres-->', data);
      setRoomsToClean(data.chambres);
    } catch (error) {
      console.log(error);
    }
  };


  const fetchOccupiedRooms  = async () => {
    try {
      const {data} = await axios.get("http://localhost:3000/api/chambres/not-available");
      console.log('chambres-->', data);
      setNotAvaibaleRoms(data.chambres);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() =>{
    fetchAvailableRooms();
    fetchRoomsToClean();
    fetchOccupiedRooms();
    fetchTotalPayments();
    fetchReservationsAnnule();
    fetchRevenueData();
  }, [])



 console.log('reservations ===>', reservations);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
    
      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-slate-50 px-8 pt-6 pb-2">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Rechercher chambres, clients, réservations..."
                className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-sm"
              />
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm cursor-pointer">
                <span className="text-slate-500">🔔</span>
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-50" />
            </div>
          </div>
        </div>

        <div className="px-8 py-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Tableau de bord </h1>
              <p className="text-slate-400 text-sm mt-0.5">Vue d'ensemble — Avril 2026</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                Exporter <span className="text-xs">▾</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 rounded-xl text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors">
                <span>+</span> Nouvelle réservation
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* Revenu total */}
            <div className="col-span-1 bg-indigo-600 rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-lg">💳</div>
                <span className="text-xs bg-emerald-400/20 text-emerald-300 px-2 py-1 rounded-full font-medium">↗ +12.4%</span>
              </div>
              <p className="text-indigo-200 text-sm mb-1">Revenu total</p>
              <p className="text-3xl font-bold mb-1">€ {total}</p>
              <p className="text-indigo-300 text-xs">vs mois dernier</p>
              <div className="absolute bottom-4 right-4 opacity-40">
                <svg width="80" height="30" viewBox="0 0 80 30"><polyline points="0,25 15,20 30,22 45,15 60,10 75,8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
            </div>

            {/* Taux d'occupation */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 text-lg">📊</div>
                <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-medium">↗ +4.1%</span>
              </div>
              <p className="text-slate-500 text-sm mb-1">
                Taux d'occupation
              </p>

              <p className="text-3xl font-bold text-slate-800 mb-1">
                {stats.occupationRate}%
              </p>

              <p className="text-slate-400 text-xs">
                {stats.occupiedRooms} / {stats.totalRooms} chambres
              </p>
            </div>

            {/* Réservations */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-500 text-lg">📅</div>
                <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-medium">↗ +8.2%</span>
              </div>
              <p className="text-slate-500 text-sm mb-1">Réservations</p>
              <p className="text-3xl font-bold text-slate-800 mb-1">{reservations?.length}</p>
              <p className="text-slate-400 text-xs">actives</p>
            </div>

            {/* Annulations */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-400 text-lg">🗑️</div>
                <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-full font-medium">↘ -0.6%</span>
              </div>
              <p className="text-slate-500 text-sm mb-1">Annulations</p>
              <p className="text-3xl font-bold text-slate-800 mb-1">{resAnnule?.length}</p>
              <p className="text-slate-400 text-xs">ce mois</p>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Revenue chart */}
            <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800">Revenu mensuel</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Montant total perçu (€)</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 text-sm text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                    2026 <span className="text-xs">▾</span>
                  </button>
                  <button className="text-slate-400 hover:text-slate-600 px-1">•••</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: "#6366f1", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#6366f1" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Room status */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-0.5">État des chambres</h3>
              <p className="text-slate-400 text-xs mb-4">Temps réel</p>
              <div className="flex justify-center mb-4 relative">
                <PieChart width={160} height={160}>
                  <Pie
                    data={roomData}
                    cx={75}
                    cy={75}
                    innerRadius={50}
                    outerRadius={70}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {roomData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-slate-800">{chambres?.length}</span>
                  <span className="text-slate-400 text-xs">chambres</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-teal-50 rounded-xl p-2.5 text-center">
                  <div className="text-teal-500 text-base mb-1">🛋️</div>
                  <p className="text-xs text-slate-500">Disponibles</p>
                  <p className="text-lg font-bold text-teal-600">{avaibaleRoms?.length}</p>
                </div>
                <div className="bg-violet-50 rounded-xl p-2.5 text-center">
                  <div className="text-violet-500 text-base mb-1">📋</div>
                  <p className="text-xs text-slate-500">Occupées</p>
                  <p className="text-lg font-bold text-violet-600">{notavaibaleRoms?.length}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-2.5 text-center">
                  <div className="text-orange-500 text-base mb-1">✨</div>
                  <p className="text-xs text-slate-500">À nettoyer</p>
                  <p className="text-lg font-bold text-orange-500">{roomsToClean?.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent reservations */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Réservations récentes</h3>
              <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center gap-1">
                Voir tout <span>›</span>
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50">
                  {["N°", "Client", "Chambre", "Dates", "Montant", "Statut"].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservations.map((r, i) => (
                  <tr key={r._id} className={`hover:bg-slate-50 transition-colors ${i !== reservations.length - 1 ? 'border-b border-slate-50' : ''}`}>
                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">{generateReservationCode(r._id)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{
                          backgroundColor: generateColor(
                            `${r.user?.prenom || ""}${r.user?.name || ""}`
                          ),
                        }}
                      >
                        {r.user?.prenom?.[0]}
                        {r.user?.name?.[0]}
                      </div>
                        <span className="text-sm font-medium text-slate-800">{r.user?.prenom} {r.user?.name} </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>🛏</span> Chambre {r.chambre.numero}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>📅</span> {formatDate(r.arrivee)} → {formatDate(r.depart)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800"> €{r.total}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ STATUS_STYLES[r.status]}`}>
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