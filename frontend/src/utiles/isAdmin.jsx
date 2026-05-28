import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/Context";

const AdminRoute = () => {

  const { user , loading} = useContext(AppContext);

  if (loading) {
    return <p>Loading...</p>;
}
console.log('useradmin', user)
  // utilisateur non connecté
  if (!user) {
    return <Navigate to="/login" />;
  }

  // utilisateur connecté mais pas admin
  if (user.role !== "Admin") {
    return <Navigate to="/" />;
  }

  // admin autorisé
  return <Outlet />;
};

export default AdminRoute;