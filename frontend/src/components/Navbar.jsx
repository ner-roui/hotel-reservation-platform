import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { NavLink } from "react-router-dom";

const links = [
  { name: "Chambres", to: "/meschambres" },
  { name: "Home", to: "/home" },
  { name: "MesSejours", to: "/messejours" },
];


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()



  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#070b14]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        
        {/* LOGO */}
        <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#a07850] to-[#7c5a38] shadow-lg shadow-[#a07850]/20">
          <span className="text-lg font-bold text-white">L</span>
        </div>

          <div>
            <h2
              className="text-lg font-semibold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Lumière Hotels
            </h2>

            <p className="text-xs text-slate-500">
              Luxury Experience
            </p>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-10 md:flex">
        {
  links.map((link) => (
    <NavLink
      key={link.name}
      to={link.to}
      className={({ isActive }) =>
        `relative text-sm font-medium transition duration-300 ${
          isActive
            ? "text-white"
            : "text-slate-300 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {link.name}

          <span
            className={`absolute -bottom-2 left-0 h-[2px] rounded-full bg-gradient-to-r from-amber-600 to-yellow-800 transition-all duration-300 ${
              isActive ? "w-full" : "w-0"
            }`}
            ></span>
        </>
      )}
    </NavLink>
  ))
}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          
          {/* Notification */}
          <button className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white md:flex">
            <Bell size={18} />
          </button>

          {/* CTA */}
            <button className="flex-1 rounded-2xl bg-gradient-to-r from-[#a07850] to-[#7c5a38] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#a07850]/20 transition-all duration-200 hover:brightness-110">
              Réserver
            </button>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          open ? "max-h-96 border-t border-white/5" : "max-h-0"
        }`}
      >
        <div className="space-y-2 px-6 py-5 bg-[#070b14]">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {link.name}
            </a>
          ))}

          <div className="flex items-center gap-3 pt-3">
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-300">
              <Bell size={18} />
            </button>

            <button className="flex-1 rounded-2xl bg-gradient-to-r from-[#a07850] to-[#7c5a38] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#a07850]/20 transition-all duration-200 hover:brightness-110">
              Réserver
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}