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

export default function Sidebar() {
  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      active: true,
    
    },
    {
      name: "Chambres",
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
    <aside className="w-[280px] bg-gradient-to-b from-[#050b2c] via-[#09143d] to-[#07112f] text-white p-6 flex flex-col justify-between">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Hotel />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Lumière Hotels</h1>
            <p className="text-gray-400 text-sm">Admin • Power user</p>
          </div>
        </div>

        {/* MENU */}
        <nav className="space-y-3">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300
                ${
                  item.active
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-500/20"
                    : "hover:bg-white/10 text-gray-300"
                }`}
              >
                <Icon size={22} />
                <span className="text-lg">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* CARD PROMO */}
        <div className="mt-14 rounded-[32px] overflow-hidden bg-white/5 border border-white/10 p-4 backdrop-blur-xl">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop"
            alt="hotel"
            className="rounded-2xl h-52 w-full object-cover"
          />

          <div className="mt-5">
            <h3 className="text-2xl font-bold">Lumière Hotels</h3>
            <p className="text-gray-400 mt-2">
              L'excellence à chaque séjour.
            </p>
          </div>
        </div>
      </div>

      {/* USER */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 mt-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center font-bold text-xl">
            SL
          </div>

          <div>
            <h4 className="font-semibold text-lg">Sophie Laurent</h4>
            <p className="text-gray-400 text-sm">Power user</p>
          </div>
        </div>

        <button className="text-gray-400 hover:text-white">
          →
        </button>
      </div>
    </aside>
  );
}