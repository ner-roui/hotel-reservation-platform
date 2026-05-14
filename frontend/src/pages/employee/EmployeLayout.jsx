import { Route, Routes, Outlet } from "react-router-dom";
import SidebarEmp from "./SidebarEmp";

export default function EmployeLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarEmp />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
