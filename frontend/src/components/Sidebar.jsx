import { NavLink } from "react-router-dom";
import { FaThLarge, FaBed, FaUsers, FaCalendarAlt, FaCreditCard, FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
const navItems = [
  { label: "Dashboard",       icon: <FaThLarge />,    path: "/dashboard" },
  { label: "Ajouter Chambre", icon: <FaBed />,         path: "createroom" },
  { label: "List Chambres",   icon: <FaList />,        path: "listroom" },
  { label: "Utilisateurs",    icon: <FaUsers />,       path: "listusers" },
  { label: "Réservations",    icon: <FaCalendarAlt />, path: "reservations" },
  { label: "Paiements",       icon: <FaCreditCard />,  path: "paiements" },
];

export default function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      localStorage.removeItem("token");
      sessionStorage.clear();

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <aside
      className="w-56 flex flex-col py-5 px-3 shrink-0"
      style={{ background: "#2c1a0e" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)" }}
        >
          L
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">Lumière Hotels</p>
          <p className="text-xs" style={{ color: "#a8968a" }}>Admin • Power user</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.label}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? "text-white" : "hover:text-white"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { background: "linear-gradient(135deg,#a07850,#7c5a38)" }
                : { color: "#a8968a" }
            }
            onMouseEnter={e => {
              if (!e.currentTarget.classList.contains("text-white"))
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.style.backgroundImage?.includes("linear-gradient(135deg,#a07850"))
                e.currentTarget.style.background = "";
            }}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Hotel card */}
      <div className="rounded-2xl overflow-hidden mt-4">
        <div
          className="h-28 flex flex-col justify-end p-3"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(44,26,14,0.5), rgba(44,26,14,0.97)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex gap-1 justify-center mb-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: i === 0 ? "#a07850" : "#3d2614" }}
              />
            ))}
          </div>
          <div className="text-xs mb-0.5" style={{ color: "#a07850" }}>👑</div>
          <p className="text-white text-xs font-bold">Lumière Hotels</p>
          <p className="text-xs" style={{ color: "#a8968a" }}>L'excellence à chaque séjour.</p>
        </div>
      </div>

      {/* User */}
      <div
        className="flex items-center gap-2 mt-4 px-2 pt-4"
        style={{ borderTop: "1px solid #3d2614" }}
      >
       
        <button
    onClick={handleLogout}
    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:text-white mt-4"
    style={{
      color: "#a8968a",
      background: "rgba(255,255,255,0.06)",
    }}
  >
    <FaSignOutAlt className="text-base" />
    Déconnexion
  </button>
      </div>
    </aside>
  );
}