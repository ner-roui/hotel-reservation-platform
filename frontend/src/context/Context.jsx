import axios from "axios";
import { useEffect, useState, createContext } from "react";
import { useLocation } from "react-router-dom";


export const AppContext = createContext();

// ─────────────────────────────────────────────────────────────────────────────
// Intercepteur global : supprime les logs rouges 401/403 dans la console
// ─────────────────────────────────────────────────────────────────────────────
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      return Promise.reject(error); // rejeté silencieusement
    }
    console.error("[API Error]", error?.response?.status, error?.config?.url);
    return Promise.reject(error);
  }
);

export default function ContextProvider({ children }) {

  const [chambres,     setChambres]     = useState([]);
  const [lenChambres,  setLenChambres]  = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [user,         setUser]         = useState(null);
  const [sejours,      setSejours]      = useState([]);
  const [reservations, setReservations] = useState([]);

  // ── 1. Profil connecté ───────────────────────────────────────────────────
  const getUserData = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/auth/getuserdata",
        { withCredentials: true }
      );
      setUser(data.user);
      return data.user;
    } catch (e) {
      // 401 visiteur = normal, aucun log
      setUser(null);
      return null;
    }
  };

  // ── 2. Chambres (public) ─────────────────────────────────────────────────
  const fetchChambres = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/chambres/get-room"
      );
      setChambres(data.chambres);
      setLenChambres(data.count);
    } catch (err) {
      console.error("Erreur fetchChambres:", err);
    }
  };

  // ── 3. Séjours du client (auth requise) ──────────────────────────────────
  const fetchSejours = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/reservations/myreservation",
        { withCredentials: true }
      );
      setSejours(data.reservations);
    } catch (e) {
      setSejours([]);
    }
  };

  // ── 4. Toutes réservations (Admin / Réception) ───────────────────────────
  const fetchAllReservations = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/reservations/getallreservations",
        { withCredentials: true }
      );
      setReservations(data.reservations);
    } catch (err) {
      setReservations([]);
    }
  };

  // ── Init ─────────────────────────────────────────────────────────────────
  const location = useLocation();
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchChambres();
      const loggedUser = await getUserData();
      if (loggedUser) {
        await fetchSejours();
        if (loggedUser.role === "Admin" || loggedUser.role === "Réception") {
          await fetchAllReservations();
        }
      }
      setLoading(false);
    };
    if (location.pathname !== "/login") {
      init();
    }
  }, [location.pathname]);

  const value = {
    chambres, lenChambres, loading,
    user, setUser, getUserData,
    sejours, setSejours, fetchSejours,
    reservations, setReservations, fetchAllReservations,
    fetchChambres,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}