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

export default function Sidebar({ active = "Dashboard" }) {
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Chambres", icon: BedDouble },
    { name: "Utilisateurs", icon: Users },
    { name: "Paiements", icon: CreditCard },
    { name: "Rapports", icon: BarChart3 },
    { name: "Paramètres", icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-[280px] bg-[#071028] text-white p-5 lg:min-h-screen border-r border-white/10">
      
      {/* LOGO */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
          <Hotel />
        </div>

        <div>
          <h1 className="text-2xl font-bold">Lumière Hotels</h1>
          <p className="text-gray-400 text-sm">Admin • Power user</p>
        </div>
      </div>

      {/* MENU */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = item.name === active;

          return (
            <button
              key={item.name}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition
              ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-violet-600"
                  : "hover:bg-white/10 text-gray-300"
              }`}
            >
              <Icon size={22} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}