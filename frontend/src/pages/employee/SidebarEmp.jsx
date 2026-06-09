import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/Context";
import axios from "axios";
function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-white/15 text-white shadow-sm border border-white/20"
            : "text-[#d4b896] hover:bg-white/10 hover:text-white"
        }`
      }
    >
      <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function SidebarEmp() {
  const navigate = useNavigate();
  const {user} = useContext(AppContext);
  


  const logout = async () => {
    try {
      const response = await axios.post(
        "https://hotel-reservation-platform-dgtp.onrender.com/api/auth/logout",
        {},
        {
          withCredentials: true, 
        }
      );



     

      // Redirection éventuelle
     navigate('/login')
    } catch (error) {
      console.error(
        "Erreur lors de la déconnexion",
        error.response?.data || error.message
      );
    }
  };
  return (
    <aside className="w-56 h-screen bg-gradient-to-b from-[#3d2614] via-[#6b4a2e] to-[#a07850] flex flex-col shadow-lg shadow-[#a07850]/20">

      {/* BRAND */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center shadow-sm">
            {/* Clé d'hôtel */}
            <svg className="w-5 h-5 text-[#e8c99a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Lumière Hotels</p>
            <p className="text-xs text-[#c4a882]">Réception · Employé</p>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 py-4 space-y-1">

        {/* Réservations */}
        <NavItem
          to="/resemployepage"
          label="Réservations"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          }
        />

        {/* Plan des chambres */}
        <NavItem
          to="/resemployepage/planchambres"
          label="Plan des chambres"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
              />
            </svg>
          }
        />

        <div className="mx-4 my-2 h-px bg-white/10" />

        {/* Nettoyage */}
        <NavItem
          to="/resemployepage/nettoyagepage"
          label="Nettoyage"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.25 48.25 0 01-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
              />
            </svg>
          }
        />
      </nav>

      {/* USER */}
      <div className="border-t border-white/10 px-5 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-sm font-semibold text-[#e8c99a]">
          {user?.prenom?.[0]}{user?.name?.[0]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">{user?.prenom} {user?.name}</p>
          <p className="text-xs text-[#c4a882]">Employé</p>
        </div>
        {/* Logout */}
        <button
          onClick={logout}
          className="text-[#c4a882] hover:text-white transition-colors"
          title="Déconnexion"
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25"
            />
          </svg>
        </button>
      </div>

    </aside>
  );
}