import { Bell, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";

const links = [
  { name: "Chambres", to: "/meschambres" },
  { name: "Home", to: "/home" },
  { name: "MesSejours", to: "/messejours" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      // On déconnecte côté client même si le serveur échoue
      console.error("Erreur logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLoggingOut(false);
      navigate("/login");
    }
  };

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
            <p className="text-xs text-slate-500">Luxury Experience</p>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `relative text-sm font-medium transition duration-300 ${
                  isActive ? "text-white" : "text-slate-300 hover:text-white"
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
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">

          {/* Notification */}
          <button className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white md:flex">
            <Bell size={18} />
          </button>

       

          {/* LOGOUT BUTTON — Desktop */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Se déconnecter"
            className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 md:flex"
          >
            {loggingOut ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-red-400" />
            ) : (
              <LogOut size={18} />
            )}
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
        <div className="space-y-2 bg-[#070b14] px-6 py-5">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-white/5 ${
                  isActive ? "text-white bg-white/5" : "text-slate-300 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="flex items-center gap-3 pt-3">
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-300">
              <Bell size={18} />
            </button>

            <button className="flex-1 rounded-2xl bg-gradient-to-r from-[#a07850] to-[#7c5a38] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#a07850]/20 transition-all duration-200 hover:brightness-110">
              Réserver
            </button>

            {/* LOGOUT BUTTON — Mobile */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Se déconnecter"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
            >
              {loggingOut ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-transparent" />
              ) : (
                <LogOut size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}