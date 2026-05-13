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
            <PaiementPage/>
          </>
        }
      />

      {/* ADMIN LAYOUT */}
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="createroom" element={<CreateRoomPage />} />
        <Route path="edit-room/:id" element={<CreateRoomPage />} />
        <Route path="listroom" element={<ChambresAdmin />} />
      </Route>

    </Routes>
  );
}

export default App;