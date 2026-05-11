import { useState } from "react";
import React from "react";
import {
  LayoutDashboard,
  BedDouble,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Hotel,
} from "lucide-react";
import { NavLink } from "react-router-dom";


const navItems = [
  { label: "Dashboard", icon: "⊞", active: true , path : "/Dashboard"},
  { label: "Ajouter Chambre", icon: "🛏" , path : "/Createroom"},
  { label: "Chambres", icon: "👤" , path : "/Listroom"},
  { label: "Utilisateurs", icon: "👤" , path : "/Listusers"},
  { label: "Réservations", icon: "📅" },
  { label: "Paiements", icon: "💳" },
  { label: "Rapports", icon: "📊" },
  { label: "Paramètres", icon: "⚙️" },
];


export default function Sidebar() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      active: true,
    
    },
    {
      name: "Ajouter Chambre",
      icon: BedDouble,
    },
    {
      name: "List Chambre",
      icon: BedDouble,
    },
    {
      name: "Utilisateurs",
      icon: Users,
    },
    {
      name: "Paiements",
      icon: CreditCard,
    },
    {
      name: "Rapports",
      icon: BarChart3,
    },
    {
      name: "Paramètres",
      icon: Settings,
    },
  ];

  return (
        <aside className="w-56 bg-slate-900 flex flex-col py-5 px-3 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">L</div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Lumière Hotels</p>
            <p className="text-slate-400 text-xs">Admin • Power user</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink to={item.path}
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                activeNav === item.label
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Hotel card */}
        <div className="rounded-2xl overflow-hidden mt-4 relative">
          <div
            className="h-28 bg-gradient-to-b from-indigo-900 to-slate-900 flex flex-col justify-end p-3"
            style={{
              backgroundImage: "linear-gradient(to bottom, rgba(30,27,75,0.6), rgba(15,23,42,0.95)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="flex gap-1 justify-center mb-2">
              {[0,1,2].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-slate-600'}`} />)}
            </div>
            <div className="text-yellow-400 text-xs mb-0.5">👑</div>
            <p className="text-white text-xs font-bold">Lumière Hotels</p>
            <p className="text-slate-400 text-xs">L'excellence à chaque séjour.</p>
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 mt-4 px-2 pt-4 border-t border-slate-800">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">SL</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">Sophie Laurent</p>
            <p className="text-slate-400 text-xs">Power user</p>
          </div>
          <span className="text-slate-400 text-xs">▾</span>
        </div>
      </aside>
  );
}