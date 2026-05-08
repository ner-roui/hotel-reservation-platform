import React from "react";
import {
  LayoutDashboard,
  BedDouble,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  Wallet,
  TrendingUp,
  CalendarDays,
  Trash2,
  Hotel,
  Shield,
  User,
  MoreHorizontal,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Revenu total",
      value: "€ 5 700",
      sub: "vs mois dernier",
      icon: Wallet,
      badge: "+12.4%",
      primary: true,
    },
    {
      title: "Taux d'occupation",
      value: "29%",
      sub: "2 / 7 chambres",
      icon: TrendingUp,
      badge: "+4.1%",
    },
    {
      title: "Réservations",
      value: "4",
      sub: "actives",
      icon: CalendarDays,
      badge: "+8.2%",
    },
    {
      title: "Annulations",
      value: "0",
      sub: "ce mois",
      icon: Trash2,
      badge: "-0.6%",
      danger: true,
    },
  ];

  const reservations = [
    {
      id: "RES-2841",
      client: "Émile Rousseau",
      room: "Chambre 402",
      date: "12 Avr → 15 Avr",
      amount: "€ 1560",
      status: "Confirmée",
    },
    {
      id: "RES-2840",
      client: "Léa Bernard",
      room: "Chambre 202",
      date: "13 Avr → 14 Avr",
      amount: "€ 220",
      status: "Check-in",
    },
    {
      id: "RES-2839",
      client: "Hugo Martin",
      room: "Chambre 101",
      date: "11 Avr → 13 Avr",
      amount: "€ 240",
      status: "En attente",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7ff] flex flex-col lg:flex-row">
      {/* SIDEBAR */}


      
      {/* MAIN */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* TOPBAR */}
        <div className="flex flex-col xl:flex-row justify-between gap-5 mb-8">
          <div className="relative w-full xl:w-[500px]">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Rechercher chambres, clients, réservations..."
              className="w-full h-14 bg-white rounded-2xl border border-gray-200 pl-14 pr-5 outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center relative">
              <Bell size={20} />

              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="h-14 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold flex items-center gap-2">
              <Plus size={18} />
              Nouvelle réservation
            </button>
          </div>
        </div>

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#111827]">
            Tableau de bord 
          </h1>

          <p className="text-gray-500 text-lg mt-2">
            Vue d'ensemble — Avril 2026
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className={`rounded-[30px] p-6 border relative overflow-hidden
                ${
                  item.primary
                    ? "bg-gradient-to-br from-blue-600 to-violet-600 text-white border-transparent"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center
                    ${
                      item.primary
                        ? "bg-white/20"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    <Icon size={24} />
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${
                      item.danger
                        ? "bg-red-100 text-red-500"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {item.badge}
                  </div>
                </div>

                <div className="mt-8">
                  <p
                    className={`text-sm ${
                      item.primary
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    {item.title}
                  </p>

                  <h2 className="text-4xl font-bold mt-2">
                    {item.value}
                  </h2>

                  <p
                    className={`mt-2 ${
                      item.primary
                        ? "text-white/70"
                        : "text-gray-400"
                    }`}
                  >
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CHART + STATUS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* CHART */}
          <div className="xl:col-span-2 bg-white rounded-[32px] p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  Revenu mensuel
                </h2>

                <p className="text-gray-400">
                  Montant total perçu (€)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-5 py-3 rounded-2xl border border-gray-200">
                  2026
                </button>

                <button className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            {/* GRAPH */}
            <div className="relative h-[350px] bg-gradient-to-b from-violet-50 to-white rounded-[28px] overflow-hidden border border-gray-100">
              {/* GRID */}
              <div className="absolute inset-0 flex flex-col justify-between px-6 py-8">
                {[1, 2, 3, 4, 5].map((line) => (
                  <div
                    key={line}
                    className="border-t border-dashed border-gray-200"
                  ></div>
                ))}
              </div>

              {/* SVG */}
              <svg
                viewBox="0 0 800 300"
                className="absolute inset-0 w-full h-full"
              >
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>

                  <linearGradient
                    id="fillGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor="#8b5cf6"
                      stopOpacity="0.35"
                    />

                    <stop
                      offset="100%"
                      stopColor="#8b5cf6"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M40 250 C120 220 170 170 240 180 C300 190 360 60 430 90 C500 120 560 40 630 70 C700 100 740 80 780 60 L780 300 L40 300 Z"
                  fill="url(#fillGradient)"
                />

                <path
                  d="M40 250 C120 220 170 170 240 180 C300 190 360 60 430 90 C500 120 560 40 630 70 C700 100 740 80 780 60"
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>

              {/* MONTHS */}
              <div className="absolute bottom-5 left-0 right-0 flex justify-around text-sm text-gray-400 px-4">
                {[
                  "Jan",
                  "Fév",
                  "Mar",
                  "Avr",
                  "Mai",
                  "Jun",
                  "Jul",
                  "Aoû",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Déc",
                ].map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>

              {/* ANALYTICS */}
              <div className="absolute top-24 left-[45%] bg-white shadow-2xl rounded-3xl px-6 py-5 border border-gray-100">
                <h3 className="text-3xl font-bold">€ 5 700</h3>

                <p className="text-gray-400 mt-1">
                  Avril 2026
                </p>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div className="bg-white rounded-[32px] p-6 border border-gray-200">
            <h2 className="text-2xl font-bold">
              État des chambres
            </h2>

            <p className="text-gray-400 mt-1">
              Temps réel
            </p>

            {/* DONUT */}
            <div className="flex justify-center mt-10">
              <div className="relative w-60 h-60">
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(#06b6d4_0deg,#8b5cf6_140deg,#fb923c_260deg,#06b6d4_360deg)]"></div>

                <div className="absolute inset-5 rounded-full bg-white flex flex-col items-center justify-center">
                  <h3 className="text-5xl font-bold">7</h3>

                  <p className="text-gray-400 mt-2">
                    chambres
                  </p>
                </div>
              </div>
            </div>

            {/* STATUS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-4 mt-10">
              <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5 flex items-center justify-between">
                <div>
                  <p className="text-gray-500">
                    Disponibles
                  </p>

                  <h3 className="text-4xl font-bold text-cyan-600 mt-2">
                    4
                  </h3>
                </div>

                <BedDouble className="text-cyan-500" />
              </div>

              <div className="rounded-3xl border border-violet-100 bg-violet-50 p-5 flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Occupées</p>

                  <h3 className="text-4xl font-bold text-violet-600 mt-2">
                    2
                  </h3>
                </div>

                <Shield className="text-violet-500" />
              </div>

              <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5 flex items-center justify-between">
                <div>
                  <p className="text-gray-500">À nettoyer</p>

                  <h3 className="text-4xl font-bold text-orange-500 mt-2">
                    1
                  </h3>
                </div>

                <Trash2 className="text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[32px] p-6 border border-gray-200 overflow-x-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              Réservations récentes
            </h2>

            <button className="text-blue-600 font-semibold">
              Voir tout
            </button>
          </div>

          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b text-left text-gray-400">
                <th className="pb-5">N°</th>
                <th className="pb-5">Client</th>
                <th className="pb-5">Chambre</th>
                <th className="pb-5">Dates</th>
                <th className="pb-5">Montant</th>
                <th className="pb-5">Statut</th>
              </tr>
            </thead>

            <tbody>
              {reservations.map((item, index) => (
                <tr
                  key={index}
                  className="border-b last:border-0"
                >
                  <td className="py-6 text-gray-500">
                    {item.id}
                  </td>

                  <td className="py-6 font-semibold">
                    {item.client}
                  </td>

                  <td className="py-6 text-gray-500">
                    {item.room}
                  </td>

                  <td className="py-6 text-gray-500">
                    {item.date}
                  </td>

                  <td className="py-6 font-bold">
                    {item.amount}
                  </td>

                  <td className="py-6">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold
                      ${
                        item.status === "Confirmée"
                          ? "bg-emerald-100 text-emerald-600"
                          : item.status === "Check-in"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-orange-100 text-orange-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}