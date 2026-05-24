import { useState, useEffect } from "react";
import axios from "axios"

/* ── Fonts ── */
const useFont = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
};

/* ── Data ── */
const INITIAL_USERS = [
  { id: 1, prenom: "Sophie",  name: "Laurent", email: "sophie@lumiere.com",  role: "Admin",     statut: "Actif",   createdAt: "12 Jan 2025", lastSeen: "Aujourd'hui", reservations: 0 },
  { id: 2, prenom: "Marc",    name: "Dubois",  email: "marc@lumiere.com",    role: "Réception", statut: "Actif",   createdAt: "03 Mar 2025", lastSeen: "Hier",        reservations: 0 },
  { id: 3, prenom: "Amélie",  name: "Roy",     email: "amelie@lumiere.com",  role: "Nettoyage", statut: "Actif",   createdAt: "18 Juin 2025",lastSeen: "Il y a 2j",  reservations: 0 },
  { id: 4, prenom: "Élise",   name: "Moreau",  email: "elise@gmail.com",     role: "Client",    statut: "Actif",   createdAt: "01 Avr 2026", lastSeen: "Aujourd'hui", reservations: 4 },
  { id: 5, prenom: "Julien",  name: "Caron",   email: "julien@lumiere.com",  role: "Réception", statut: "Inactif", createdAt: "22 Fév 2025", lastSeen: "Il y a 12j", reservations: 0 },
  { id: 6, prenom: "Camille", name: "Petit",   email: "camille@gmail.com",   role: "Client",    statut: "Actif",   createdAt: "14 Avr 2026", lastSeen: "Aujourd'hui", reservations: 2 },
  { id: 7, prenom: "Hugo",    name: "Martin",  email: "hugo@lumiere.com",    role: "Admin",     statut: "Actif",   createdAt: "05 Nov 2024", lastSeen: "Il y a 3j",  reservations: 0 },
];

const ROLE_CFG = {
  Admin:     { bg: "bg-violet-100",  border: "border-violet-300",  text: "text-violet-800",  icon: "🛡" },
  Réception: { bg: "bg-blue-100",    border: "border-blue-300",    text: "text-blue-800",    icon: "🪪" },
  Nettoyage: { bg: "bg-amber-100",   border: "border-amber-300",   text: "text-amber-800",   icon: "✨" },
  Client:    { bg: "bg-emerald-100", border: "border-emerald-300", text: "text-emerald-800", icon: "👤" },
};

const ROLES = ["Admin", "Réception", "Nettoyage", "Client"];

const AVATAR_COLORS = [
  "from-violet-500 to-indigo-600",
  "from-sky-400 to-blue-600",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-600",
  "from-pink-400 to-rose-600",
  "from-purple-500 to-violet-600",
  "from-cyan-400 to-sky-600",
];

const initials = (u) =>
  ((u?.prenom?.[0] || "") + (u?.name?.[0] || "")).toUpperCase(); 
/* ── Toast ── */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white shadow-xl transition-all ${
        toast.type === "error"
          ? "bg-gradient-to-r from-red-600 to-red-700"
          : "bg-gradient-to-r from-violet-600 to-indigo-600"
      }`}
      style={{ animation: "fadeUp .3s ease both" }}
    >
      <span>{toast.type === "error" ? "🗑️" : "✓"}</span>
      {toast.msg}
    </div>
  );
}

/* ── Field (outside modal to avoid remount on every keystroke) ── */
function Field({ label, field, placeholder, type = "text", value, onChange, error }) {
  return (
    <div className="flex-1">
      <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5 text-slate-400">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl px-4 py-2.5 text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 border focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all ${
          error ? "border-red-400" : "border-slate-200"
        }`}
      />
      {error && <p className="text-xs mt-1 text-red-500">{error}</p>}
    </div>
  );
}
 
/* ── User Modal (Add / Edit) ── */
function UserModal({ user, onSave, onClose }) {
  const isEdit = !!user;
  const [form, setForm] = useState(
    user
      ? { ...user }
      : { prenom: "", name: "", email: "", role: "Client", statut: "Actif" }
  );
  const [errors, setErrors] = useState({});
 
  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));
 
  const validate = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = "Requis";
    if (!form.name.trim()) e.name = "Requis";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Email invalide";
    return e;
  };
 
  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      ...form,
      id: user?.id,
      createdAt: user?.createdAt || "Aujourd'hui",
      lastSeen: "Aujourd'hui",
      reservations: user?.reservations ?? 0,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="h-0.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-400" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-500 mb-0.5">
                {isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
              </p>
              <h3
                className="text-lg font-semibold text-slate-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {isEdit ? `${user.prenom} ${user.name}` : "Ajouter un compte"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-slate-400 bg-slate-100 border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
            >
              ✕
            </button>
          </div>

          {/* Avatar preview */}
          {(form.prenom || form.name) && (
            <div className="flex items-center gap-3 p-3 rounded-2xl mb-5 bg-slate-50 border border-slate-200">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br ${AVATAR_COLORS[0]}`}
              >
                {(form.prenom?.[0] || "") + (form.name?.[0] || "")}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {form.prenom} {form.name}
                </p>
                <p className="text-xs text-slate-400">{form.email || "—"}</p>
              </div>
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4">
            <div className="flex gap-3">
            <Field
                label="Prénom"
                field="prenom"
                placeholder="Sophie"
                value={form.prenom || ""}
                onChange={handleChange}
                error={errors.prenom}
              />
            <Field
                  label="Nom"
                  field="name"
                  placeholder="Laurent"
                  value={form.name || ""}
                  onChange={handleChange}
                  error={errors.name}
                />
            </div>
            <Field
                label="Email"
                field="email"
                placeholder="sophie@lumiere.com"
                type="email"
                value={form.email || ""}
                onChange={handleChange}
                error={errors.email}
              />

            {/* Role selector */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest mb-2 text-slate-400">
                Rôle
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ROLES.map((r) => {
                  const rc = ROLE_CFG[r];
                  const active = form.role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setForm((f) => ({ ...f, role: r }))}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                        active
                          ? `${rc.bg} ${rc.border} ${rc.text}`
                          : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      <div className="text-base mb-0.5">{rc.icon}</div>
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Statut selector */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest mb-2 text-slate-400">
                Statut
              </label>
              <div className="flex gap-2">
                {["Actif", "Inactif"].map((s) => {
                  const active = form.statut === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setForm((f) => ({ ...f, statut: s }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        active
                          ? s === "Actif"
                            ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                            : "bg-slate-100 border-slate-300 text-slate-600"
                          : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {s === "Actif" ? "● Actif" : "○ Inactif"}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all"
            >
              {isEdit ? "Enregistrer" : "Créer le compte"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Modal ── */
function DeleteModal({ user, onConfirm, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 bg-red-50 border border-red-200">
            🗑️
          </div>
          <h3
            className="text-lg font-semibold text-slate-900 mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Supprimer l'utilisateur ?
          </h3>
          <p className="text-sm text-slate-600 mb-1">
            <span className="font-semibold text-violet-700">
              {user.prenom} {user.name}
            </span>
          </p>
          <p className="text-xs text-slate-400 mb-6">Cette action est irréversible.</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={() => onConfirm(user.id)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-100 hover:shadow-red-200 transition-all"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── User Row ── */
function UserRow({ user, idx, onEdit, onDelete }) {
  const rc = ROLE_CFG[user.role] || ROLE_CFG["Client"];
  const av = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  const actif = user.statut === "Actif";
  console.log('waudserrrr' , user)
  return (
    <tr className="border-b border-slate-100 hover:bg-violet-50/40 transition-colors">
      {/* Name */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-gradient-to-br ${av}`}
          >
            {initials(user)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {user.prenom} {user.name}
            </p>
            <p className="text-xs text-slate-400">Créé le {user.createdAt}</p>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-4 py-3.5">
        <span className="text-sm text-slate-500">{user.email}</span>
      </td>

      {/* Role */}
      <td className="px-4 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${rc.bg} ${rc.border} ${rc.text}`}
        >
          {rc.icon} {user.role}
        </span>
      </td>

      {/* Statut */}
      <td className="px-4 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
            actif
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-slate-100 border-slate-200 text-slate-500"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${actif ? "bg-emerald-500" : "bg-slate-400"}`}
          />
          {user.statut}
        </span>
      </td>

      {/* Last seen */}
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <span className="text-xs text-slate-400">{user.lastSeen}</span>
      </td>

      {/* Reservations */}
      <td className="px-4 py-3.5 hidden lg:table-cell">
        {user.reservations > 0 ? (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-violet-100 text-violet-700 border border-violet-200">
            {user.reservations.length} rés.
          </span>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onEdit(user)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm border border-slate-200 bg-slate-50 text-slate-500 hover:bg-violet-100 hover:text-violet-700 hover:border-violet-200 transition-all"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(user)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 hover:border-red-200 transition-all"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ── Main ── */
export default function UtilisateursPage() {
  useFont();

  // const [users, setUsers] = useState(INITIAL_USERS);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("Tous");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
  
        const {data} = await axios.get("http://localhost:3000/api/auth/users");
        
        const formattedUsers = data.users.map((u) => ({
          id: u._id,
          prenom: u.prenom,
          name: u.name,
          email: u.email,
          role: u.role || "Client",
          statut: u.status || "Actif",
  
          createdAt: new Date(u.createdAt).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
  
          lastSeen: "Aujourd'hui",
  
          reservations: u.reservations?.length || 0,
        }));
  
        setUsers(formattedUsers);
  
      } catch (error) {
        console.log(error);
  
      } finally {
  
        setLoading(false);
  
      }
    };
  
    fetchUsers();
  }, []);

  const handleSave = async (u) => {
    console.log('uouoiu-->', u);
    try {
      if (editTarget) {
        // UPDATE USER
        const res = await axios.put(
          `http://localhost:3000/api/auth/users/updateuser/${u.id}`,
          {
            prenom: u.prenom,
            name: u.name,
            email: u.email,
            role: u.role || "Client",
            statut: u.status || "Actif",
          }
        );
          
        const data = res.data;
        console.log('iupdateuser---->', data )
        if (!data.success) throw new Error(data.message);
  
        setUsers((prev) =>
          prev.map((x) => (x.id === u.id ? u : x))
        );
  
        showToast(`${u.prenom} ${u.name} mis à jour`);
      } else {
        console.log('eww', u)
        // CREATE USER
        const res = await axios.post(
          "http://localhost:3000/api/auth/users/createuser",
          u
        );
        
        const data = res.data;
        console.log('create user-->>', data)
  
        if (!data.success) throw new Error(data.message);
  
        const newUser = {
          id: data.user._id,
          ...u,
        };
  
        setUsers((prev) => [...prev, newUser]);
  
        showToast(`${u.prenom} ${u.name} créé avec succès`);
      }
  
      setEditTarget(null);
      setShowAdd(false);
    } catch (error) {
      showToast(error.response?.data?.message || error.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const u = users.find((x) => x.id === id);
  
      const res = await axios.delete(
        `http://localhost:3000/api/auth/users/deleteuser/${id}`
      );
  
      const data = res.data;
  
      if (!data.success) throw new Error(data.message);
  
      setUsers((prev) => prev.filter((x) => x.id !== id));
  
      setDeleteTarget(null);
  
      showToast(`${u.prenom} ${u.name} supprimé`, "error");
  
    } catch (error) {
      showToast(
        error.response?.data?.message || error.message,
        "error"
      );
    }
  };

  const filtered = users.filter((u) => {
    const mSearch =
      !search ||
      `${u.prenom} ${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const mRole = filterRole === "Tous" || u.role === filterRole;
    return mSearch && mRole;
  });

  const stats = [
    { label: "Total",   val: users.length,                               icon: "👥", color: "text-violet-700" },
    { label: "Actifs",  val: users.filter((u) => u.statut === "Actif").length, icon: "🟢", color: "text-emerald-600" },
    { label: "Admins",  val: users.filter((u) => u.role === "Admin").length,   icon: "🛡",  color: "text-violet-600" },
    { label: "Clients", val: users.filter((u) => u.role === "Client").length,  icon: "👤", color: "text-teal-600" },
  ];

  return (
    <div
      className="min-h-screen w-full bg-white text-slate-900"
      style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}
    >
      {/* Topbar */}
      <div className="sticky top-0 z-20 px-8 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher chambres, clients, réservations..."
              className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
            />
          </div>
          <div className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-200 cursor-pointer">
            <span className="text-slate-500">🔔</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-violet-600 border-2 border-white" />
          </div>
        </div>
      </div>

      <div className="px-8 py-7">
        {/* Page header */}
        <div
          className="flex items-start justify-between mb-7"
          style={{ animation: "fadeUp .5s ease both" }}
        >
          <div>
            <h1
              className="text-2xl font-semibold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Utilisateurs
            </h1>
            <p className="text-sm mt-0.5 text-slate-500">
              Gérez les comptes et les rôles.
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all"
          >
            + Ajouter Utilisateur
          </button>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-4 gap-3 mb-7"
          style={{ animation: "fadeUp .5s .04s ease both" }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 flex items-center gap-3 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              style={{ animation: `fadeUp .5s ${0.04 + i * 0.06}s ease both` }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base bg-slate-50 border border-slate-200 shrink-0">
                {s.icon}
              </div>
              <div>
                <p
                  className={`font-bold text-xl leading-none ${s.color}`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.val}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div
          className="rounded-2xl overflow-hidden border border-slate-200 bg-white"
          style={{ animation: "fadeUp .5s .1s ease both" }}
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-50 border border-slate-200">
              {["Tous", ...ROLES].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRole(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterRole === r
                      ? "bg-violet-100 text-violet-700 border border-violet-200"
                      : "text-slate-500 border border-transparent hover:bg-slate-100"
                  }`}
                >
                  {r}
                  {r !== "Tous" && (
                    <span
                      className={`ml-1.5 text-xs ${
                        filterRole === r ? "text-violet-400" : "text-slate-400"
                      }`}
                    >
                      {users.filter((u) => u.role === r).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              {filtered.length} utilisateur{filtered.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["name", "Email", "Rôle", "Statut", "Dernière activité", "Réservations", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-400"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="text-3xl mb-3">👥</div>
                    <p className="text-sm font-medium text-slate-900">
                      Aucun utilisateur trouvé
                    </p>
                    <p className="text-xs mt-1 text-slate-400">
                      Modifiez votre recherche ou vos filtres
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <UserRow
                    key={u.id}
                    user={u}
                    idx={i}
                    onEdit={(u) => setEditTarget(u)}
                    onDelete={(u) => setDeleteTarget(u)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {(showAdd || editTarget) && (
        <UserModal
          user={editTarget}
          onSave={handleSave}
          onClose={() => { setEditTarget(null); setShowAdd(false); }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {/* Toast */}
      <Toast toast={toast} />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}