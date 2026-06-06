import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/login";
import Dashboard from "./pages/Dashboard";
import CreateRoomPage from "./pages/AddChambre";
import ChambresAdmin from "./pages/ListRoom";
import Home from "./pages/Home";
import ReservationPage from "./pages/HotelBookingPage";
import Navbar from "./components/Navbar";
import { Layout } from "./pages/Layout";
import PaiementPage from "./pages/PaiementPage";
import MesSejours from "./pages/MesSejours";
import EditReservation from "./pages/EditReservation";
import UtilisateursPage from "./pages/UtilisateursPage";
import PaiementsPage from "./pages/PaiementsDahsboard";
import ResEmployePage from "./pages/employee/ResEmployePage";
import Nettoyage from "./pages/employee/Nettoyage";
import EmployeLayout from "./pages/employee/EmployeLayout";
import PlanChambres from "./pages/employee/Planchambres";
import AdminRoute from "./utiles/isAdmin";
import EmployeeRoute from "./utiles/EmployeeRoute";
import AllReservationsPage from "./pages/AllReservationsPage";


function App() {
  return (
    <Routes>
      {/* REDIRECTION DE / VERS /home */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* PUBLIC PAGES AVEC NAVBAR */}
      <Route
        path="/home"
        element={
          <>
            <Navbar />
            <Home />
          </>
        }
      />
      <Route
        path="/meschambres"
        element={
          <>
            <Navbar />
            <ReservationPage />
          </>
        }
      />
      <Route
        path="/payementpage/:id"
        element={
          <>
            <Navbar />
            <PaiementPage />
          </>
        }
      />
      <Route
        path="/messejours"
        element={
          <>
            <Navbar />
            <MesSejours />
          </>
        }
      />
      <Route path="/reservations/:id/edit" element={<EditReservation />} />

      {/* EMPLOYEE ROUTES */}
      <Route element={<EmployeeRoute />}>
        <Route path="resemployepage" element={<EmployeLayout />}>
          <Route index element={<ResEmployePage />} />
          <Route path="nettoyagepage" element={<Nettoyage />} />
          <Route path="planchambres" element={<PlanChambres />} />
        </Route>
      </Route>

      {/* ADMIN ROUTES */}
      <Route element={<AdminRoute />}>
        <Route path="dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="createroom" element={<CreateRoomPage />} />
          <Route path="edit-room/:id" element={<CreateRoomPage />} />
          <Route path="listroom" element={<ChambresAdmin />} />
          <Route path="listusers" element={<UtilisateursPage />} />
          <Route path="paiements" element={<PaiementsPage />} />
          <Route path="reservations" element={<AllReservationsPage />} />
        </Route>
      </Route>

  

      {/* PAGE 404 */}
      {/* <Route path="*" element={<Navigate to="/home" replace />} /> */}
    </Routes>
  );
}

export default App;