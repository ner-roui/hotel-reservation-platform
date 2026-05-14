import React from "react";
import { NavLink } from "react-router-dom";

/* ───────────────── Nav Item ───────────────── */
function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl transition-all duration-200 text-sm font-medium ${
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }`
      }
    >
      <span className="flex-shrink-0">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

/* ───────────────── Sidebar ───────────────── */
export default function SidebarEmp() {
  return (
    <aside className="w-52 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21"
              />
            </svg>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              Lumière Hotels
            </p>
            <p className="text-xs text-gray-400">
              Réception · Employé
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 flex flex-col gap-1">
        <NavItem
          to="/resemployepage"
          label="Réservations"
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5"
              />
            </svg>
          }
        />

        <NavItem
          to="/planchambres"
          label="Plan des chambres"
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25"
              />
            </svg>
          }
        />

        <div className="h-px bg-gray-100 mx-4 my-1" />

        <NavItem
          to="/nettoyagepage"
          label="Nettoyage"
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
        />
      </nav>

      {/* User */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
          MD
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800 truncate">
            Marc Dubois
          </p>
          <p className="text-xs text-gray-400">Employé</p>
        </div>
      </div>
    </aside>
  );
}