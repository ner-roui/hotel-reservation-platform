import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/Context";

const EmployeeRoute = () => {

  const { user, loading } = useContext(AppContext);

  if (loading) {
    return <p>Loading...</p>;
  }

  console.log("useremployee", user);

  // utilisateur non connecté
  if (!user) {
    return <Navigate to="/login" />;
  }

  // utilisateur connecté mais pas employé
  if (user.role !== "Réception") {
    return <Navigate to="/login" />;
  }

  // employé autorisé
  return <Outlet />;
};

export default EmployeeRoute;