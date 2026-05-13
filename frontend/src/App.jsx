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

function App() {
  return (
    <Routes>

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
        path="/payementpage"
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
      </Route>

    </Routes>
  );
}

export default App;