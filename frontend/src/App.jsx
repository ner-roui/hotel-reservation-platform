import "./App.css";

import { Routes, Route } from "react-router-dom";

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
import Sidebar from "./components/SidebarReservation";
import SidebarEmp from "./pages/employee/SidebarEmp";
import EmployeLayout from "./pages/employee/EmployeLayout";
import PlanChambres from "./pages/employee/Planchambres";

function App() {
  return (
    
    
    // <ResEmployePage/>
    // <Nettoyage/>
    <Routes>
      <Route path="/" element={<EmployeLayout/>}>
        <Route path="resemployepage" element={<ResEmployePage/>} />
        <Route path="nettoyagepage" element={<Nettoyage/>} />
        <Route path="planchambres" element={<PlanChambres/>} />
      </Route>
      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* PUBLIC PAGES WITH NAVBAR */}
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
            <PaiementPage/>
          </>
        }
      />

      <Route
        path="/messejours"
        element={
          <>
            <Navbar />
            <MesSejours/>
          </>
        }
      />
      <Route
        path="/reservations/:id/edit"
        element={<EditReservation />}
      />
      {/* ADMIN LAYOUT */}
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="createroom" element={<CreateRoomPage />} />
        <Route path="edit-room/:id" element={<CreateRoomPage />} />
        <Route path="listroom" element={<ChambresAdmin />} />
        <Route path="Listusers" element={<UtilisateursPage/>}/>
        <Route path="Paiements" element={<PaiementsPage/>} />
      </Route>

    </Routes>
  );
}

export default App;