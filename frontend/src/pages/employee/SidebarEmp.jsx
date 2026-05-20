import React from "react";
import { NavLink } from "react-router-dom";

/* ───────────── Nav Item ───────────── */
function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }`
      }
    >
      <span className="w-5 h-5 flex items-center justify-center">
        {icon}
      </span>
      <span>{label}</span>
    </NavLink>
  );
}

/* ───────────── Sidebar ───────────── */
export default function SidebarEmp() {
  return (
    <aside className="w-56 h-screen bg-white border-r border-gray-100 flex flex-col">
      
      {/* BRAND */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 21h18M4 21V7l8-4 8 4v14"
              />
            </svg>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Lumière Hotels
            </p>
            <p className="text-xs text-gray-400">
              Réception · Employé
            </p>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 py-4 space-y-1">
        
        <NavItem
          to="/resemployepage"
          label="Réservations"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />

        <NavItem
          to="/planchambres"
          label="Plan des chambres"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
          }
        />

        <div className="mx-4 my-2 h-px bg-gray-100" />

        <NavItem
          to="/nettoyagepage"
          label="Nettoyage"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 3v18m9-9H3"
              />
            </svg>
          }
        />
      </nav>

      {/* USER */}
      <div className="border-t border-gray-100 px-5 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
          MD
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            Marc Dubois
          </p>
          <p className="text-xs text-gray-400">Employé</p>
        </div>
      </div>
    </aside>
  );
}