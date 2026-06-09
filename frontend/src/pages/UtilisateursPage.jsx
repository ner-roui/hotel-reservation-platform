import { useState, useEffect } from "react";
import axios from "axios";

const useFont = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
};

const ROLE_CFG = {
  Admin:     { bg: "#f0e6db", border: "#c4a882", text: "#7c5a38", icon: "🛡" },
  Réception: { bg: "#faf7f4", border: "#ddd5c8", text: "#a07850", icon: "🪪" },
  Nettoyage: { bg: "#fef3c7", border: "#fde68a", text: "#92400e", icon: "✨" },
  Client:    { bg: "#f0fdf4", border: "#86efac", text: "#166534", icon: "👤" },
};

const ROLES = ["Admin", "Réception", "Nettoyage", "Client"];

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#a07850,#7c5a38)",
  "linear-gradient(135deg,#c4a882,#a07850)",
  "linear-gradient(135deg,#7c5a38,#3d2614)",
  "linear-gradient(135deg,#d4b896,#a07850)",
  "linear-gradient(135deg,#6b4a2e,#3d2614)",
  "linear-gradient(135deg,#b8956a,#7c5a38)",
  "linear-gradient(135deg,#e8d5bf,#c4a882)",
];

const initials = (u) => ((u?.prenom?.[0] || "") + (u?.name?.[0] || "")).toUpperCase();

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className="fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white shadow-xl"
      style={{
        background: toast.type === "error"
          ? "linear-gradient(135deg,#dc2626,#b91c1c)"
          : "linear-gradient(135deg,#a07850,#7c5a38)",
        animation: "fadeUp .3s ease both",
      }}
    >
      <span>{toast.type === "error" ? "🗑️" : "✓"}</span>
      {toast.msg}
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────
function Field({ label, field, placeholder, type = "text", value, onChange, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex-1">
      <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#a8968a" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(field, e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
        style={{
          background: "#faf7f4",
          color: "#2c1a0e",
          border: error ? "1px solid #ef4444" : focused ? "1px solid #a07850" : "1px solid #ddd5c8",
          boxShadow: focused ? "0 0 0 3px rgba(160,120,80,0.12)" : "none",
        }}
      />
      {error && <p className="text-xs mt-1 text-red-500">{error}</p>}
    </div>
  );
}

// ── User Modal ────────────────────────────────────────────────────────────────
function UserModal({ user, onSave, onClose }) {
  const isEdit = !!user;
  const [form, setForm] = useState(
    user ? { ...user } : { prenom: "", name: "", email: "", role: "Client", statut: "Actif" }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const validate = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = "Requis";
    if (!form.name.trim())   e.name   = "Requis";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Email invalide";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, id: user?.id, createdAt: user?.createdAt || "Aujourd'hui", lastSeen: "Aujourd'hui", reservations: user?.reservations ?? 0 });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
      style={{ background: "rgba(44,26,14,0.55)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white"
        style={{ border: "1px solid #ede5db" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div className="h-0.5" style={{ background: "linear-gradient(90deg,#a07850,#c4a882,#7c5a38)" }} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#a07850" }}>
                {isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
              </p>
              <h3 className="text-lg font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2c1a0e" }}>
                {isEdit ? `${user.prenom} ${user.name}` : "Ajouter un compte"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
              style={{ background: "#faf7f4", border: "1px solid #ddd5c8", color: "#a8968a" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.borderColor = "#fca5a5"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#faf7f4"; e.currentTarget.style.color = "#a8968a"; e.currentTarget.style.borderColor = "#ddd5c8"; }}
            >✕</button>
          </div>

          {/* Avatar preview */}
          {(form.prenom || form.name) && (
            <div className="flex items-center gap-3 p-3 rounded-2xl mb-5" style={{ background: "#faf7f4", border: "1px solid #ede5db" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: AVATAR_GRADIENTS[0] }}>
                {(form.prenom?.[0] || "") + (form.name?.[0] || "")}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "#2c1a0e" }}>{form.prenom} {form.name}</p>
                <p className="text-xs" style={{ color: "#a8968a" }}>{form.email || "—"}</p>
              </div>
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <Field label="Prénom" field="prenom" placeholder="Sophie" value={form.prenom || ""} onChange={handleChange} error={errors.prenom} />
              <Field label="Nom"    field="name"   placeholder="Laurent" value={form.name   || ""} onChange={handleChange} error={errors.name}   />
            </div>
            <Field label="Email" field="email" placeholder="sophie@lumiere.com" type="email" value={form.email || ""} onChange={handleChange} error={errors.email} />

            {/* Role */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#a8968a" }}>Rôle</label>
              <div className="grid grid-cols-4 gap-2">
                {ROLES.map(r => {
                  const rc = ROLE_CFG[r];
                  const active = form.role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setForm(f => ({ ...f, role: r }))}
                      className="py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: active ? rc.bg : "#faf7f4",
                        border: `1px solid ${active ? rc.border : "#ddd5c8"}`,
                        color: active ? rc.text : "#a8968a",
                      }}
                    >
                      <div className="text-base mb-0.5">{rc.icon}</div>
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#a8968a" }}>Statut</label>
              <div className="flex gap-2">
                {["Actif", "Inactif"].map(s => {
                  const active = form.statut === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setForm(f => ({ ...f, statut: s }))}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: active ? (s === "Actif" ? "#f0fdf4" : "#faf7f4") : "#faf7f4",
                        border: `1px solid ${active ? (s === "Actif" ? "#86efac" : "#ddd5c8") : "#ddd5c8"}`,
                        color: active ? (s === "Actif" ? "#166534" : "#7c5a38") : "#a8968a",
                      }}
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
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: "#faf7f4", border: "1px solid #ddd5c8", color: "#7c5a38" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0e6db"}
              onMouseLeave={e => e.currentTarget.style.background = "#faf7f4"}
            >Annuler</button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)" }}
            >
              {isEdit ? "Enregistrer" : "Créer le compte"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({ user, onConfirm, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
      style={{ background: "rgba(44,26,14,0.55)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-white"
        style={{ border: "1px solid #ede5db" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4" style={{ background: "#fee2e2", border: "1px solid #fca5a5" }}>
            🗑️
          </div>
          <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2c1a0e" }}>
            Supprimer l'utilisateur ?
          </h3>
          <p className="text-sm mb-1" style={{ color: "#6b5b52" }}>
            <span className="font-semibold" style={{ color: "#a07850" }}>{user.prenom} {user.name}</span>
          </p>
          <p className="text-xs mb-6" style={{ color: "#a8968a" }}>Cette action est irréversible.</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: "#faf7f4", border: "1px solid #ddd5c8", color: "#7c5a38" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0e6db"}
              onMouseLeave={e => e.currentTarget.style.background = "#faf7f4"}
            >Annuler</button>
            <button
              onClick={() => onConfirm(user.id)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)" }}
            >Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── User Row ──────────────────────────────────────────────────────────────────
function UserRow({ user, idx, onEdit, onDelete }) {
  const rc    = ROLE_CFG[user.role] || ROLE_CFG["Client"];
  const av    = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];
  const actif = user.statut === "Actif";

  return (
    <tr
      className="transition-colors"
      style={{ borderBottom: "1px solid #faf7f4" }}
      onMouseEnter={e => e.currentTarget.style.background = "#faf7f4"}
      onMouseLeave={e => e.currentTarget.style.background = ""}
    >
      {/* Name */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: av }}>
            {initials(user)}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#2c1a0e" }}>{user.prenom} {user.name}</p>
            <p className="text-xs" style={{ color: "#a8968a" }}>Créé le {user.createdAt}</p>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-4 py-3.5">
        <span className="text-sm" style={{ color: "#6b5b52" }}>{user.email}</span>
      </td>

      {/* Role */}
      <td className="px-4 py-3.5">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: rc.bg, border: `1px solid ${rc.border}`, color: rc.text }}
        >
          {rc.icon} {user.role}
        </span>
      </td>

      {/* Statut */}
      <td className="px-4 py-3.5">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
          style={
            actif
              ? { background: "#f0fdf4", border: "1px solid #86efac", color: "#166534" }
              : { background: "#faf7f4", border: "1px solid #ddd5c8", color: "#a8968a" }
          }
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: actif ? "#22c55e" : "#a8968a" }} />
          {user.statut}
        </span>
      </td>

      {/* Last seen */}
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <span className="text-xs" style={{ color: "#a8968a" }}>{user.lastSeen}</span>
      </td>

      {/* Reservations */}
      <td className="px-4 py-3.5 hidden lg:table-cell">
        {user.reservations > 0 ? (
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-lg"
            style={{ background: "#f0e6db", color: "#7c5a38", border: "1px solid #ddd5c8" }}
          >
            {user.reservations} rés.
          </span>
        ) : (
          <span style={{ color: "#ddd5c8", fontSize: 12 }}>—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onEdit(user)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all"
            style={{ background: "#faf7f4", border: "1px solid #ddd5c8", color: "#a8968a" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f0e6db"; e.currentTarget.style.borderColor = "#c4a882"; e.currentTarget.style.color = "#7c5a38"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#faf7f4"; e.currentTarget.style.borderColor = "#ddd5c8"; e.currentTarget.style.color = "#a8968a"; }}
          >✏️</button>
          <button
            onClick={() => onDelete(user)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all"
            style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#f87171" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fecaca"; e.currentTarget.style.color = "#dc2626"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#f87171"; }}
          >🗑️</button>
        </div>
      </td>
    </tr>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function UtilisateursPage() {
  useFont();

  const [users,        setUsers]        = useState([]);
  const [search,       setSearch]       = useState("");
  const [filterRole,   setFilterRole]   = useState("Tous");
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAdd,      setShowAdd]      = useState(false);
  const [toast,        setToast]        = useState(null);
  const [loading,      setLoading]      = useState(true);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    axios.get("https://hotel-reservation-platform-dgtp.onrender.com/api/auth/users").then(({ data }) => {
      setUsers(data.users.map(u => ({
        id: u._id, prenom: u.prenom, name: u.name, email: u.email,
        role: u.role || "Client", statut: u.status || "Actif",
        createdAt: new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
        lastSeen: "Aujourd'hui",
        reservations: u.reservations?.length || 0,
      })));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSave = async (u) => {
    try {
      if (editTarget) {
        const { data } = await axios.put(`https://hotel-reservation-platform-dgtp.onrender.com/api/auth/users/updateuser/${u.id}`, { prenom: u.prenom, name: u.name, email: u.email, role: u.role || "Client", statut: u.status || "Actif" });
        if (!data.success) throw new Error(data.message);
        setUsers(prev => prev.map(x => x.id === u.id ? u : x));
        showToast(`${u.prenom} ${u.name} mis à jour`);
      } else {
        const { data } = await axios.post("https://hotel-reservation-platform-dgtp.onrender.com/api/auth/users/createuser", u);
        if (!data.success) throw new Error(data.message);
        setUsers(prev => [...prev, { id: data.user._id, ...u }]);
        showToast(`${u.prenom} ${u.name} créé avec succès`);
      }
      setEditTarget(null); setShowAdd(false);
    } catch (error) {
      showToast(error.response?.data?.message || error.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const u = users.find(x => x.id === id);
      const { data } = await axios.delete(`https://hotel-reservation-platform-dgtp.onrender.com/api/auth/users/deleteuser/${id}`);
      if (!data.success) throw new Error(data.message);
      setUsers(prev => prev.filter(x => x.id !== id));
      setDeleteTarget(null);
      showToast(`${u.prenom} ${u.name} supprimé`, "error");
    } catch (error) {
      showToast(error.response?.data?.message || error.message, "error");
    }
  };

  const filtered = users.filter(u => {
    const mSearch = !search || `${u.prenom} ${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const mRole   = filterRole === "Tous" || u.role === filterRole;
    return mSearch && mRole;
  });

  const stats = [
    { label: "Total",   val: users.length,                                    icon: "👥", color: "#a07850" },
    { label: "Actifs",  val: users.filter(u => u.statut === "Actif").length,  icon: "🟢", color: "#166534" },
    { label: "Admins",  val: users.filter(u => u.role === "Admin").length,    icon: "🛡",  color: "#7c5a38" },
    { label: "Clients", val: users.filter(u => u.role === "Client").length,   icon: "👤", color: "#3d2614" },
  ];

  return (
    <div className="min-h-screen w-full" style={{ background: "#faf7f4", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: "#2c1a0e" }}>

      {/* Topbar */}
      <div className="sticky top-0 z-20 px-8 py-4 bg-white" style={{ borderBottom: "1px solid #ede5db" }}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#a8968a" }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher chambres, clients, réservations..."
              className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all"
              style={{ background: "#faf7f4", border: "1px solid #ddd5c8", color: "#2c1a0e" }}
            />
          </div>

        </div>
      </div>

      <div className="px-8 py-7">

        {/* Header */}
        <div className="flex items-start justify-between mb-7" style={{ animation: "fadeUp .5s ease both" }}>
          <div>
            <h1 className="text-2xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2c1a0e" }}>
              Utilisateurs
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#a8968a" }}>Gérez les comptes et les rôles.</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)" }}
          >
            + Ajouter Utilisateur
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-7" style={{ animation: "fadeUp .5s .04s ease both" }}>
          {stats.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 flex items-center gap-3 bg-white shadow-sm hover:shadow-md transition-shadow"
              style={{ border: "1px solid #ede5db", animation: `fadeUp .5s ${0.04 + i * 0.06}s ease both` }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0" style={{ background: "#faf7f4", border: "1px solid #ddd5c8" }}>
                {s.icon}
              </div>
              <div>
                <p className="font-bold text-xl leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", color: s.color }}>{s.val}</p>
                <p className="text-xs mt-0.5" style={{ color: "#a8968a" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #ede5db", animation: "fadeUp .5s .1s ease both" }}>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #ede5db" }}>
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "#faf7f4", border: "1px solid #ddd5c8" }}>
              {["Tous", ...ROLES].map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRole(r)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={
                    filterRole === r
                      ? { background: "linear-gradient(135deg,#a07850,#7c5a38)", color: "#fff" }
                      : { color: "#a8968a" }
                  }
                  onMouseEnter={e => { if (filterRole !== r) e.currentTarget.style.background = "#f0e6db"; }}
                  onMouseLeave={e => { if (filterRole !== r) e.currentTarget.style.background = ""; }}
                >
                  {r}
                  {r !== "Tous" && (
                    <span className="ml-1.5 text-xs" style={{ color: filterRole === r ? "rgba(255,255,255,0.7)" : "#c4a882" }}>
                      {users.filter(u => u.role === r).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs" style={{ color: "#a8968a" }}>
              {filtered.length} utilisateur{filtered.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #ede5db", background: "#faf7f4" }}>
                {["Nom", "Email", "Rôle", "Statut", "Dernière activité", "Réservations", ""].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#a8968a" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="text-3xl mb-3">👥</div>
                    <p className="text-sm font-medium" style={{ color: "#2c1a0e" }}>Aucun utilisateur trouvé</p>
                    <p className="text-xs mt-1" style={{ color: "#a8968a" }}>Modifiez votre recherche ou vos filtres</p>
                  </td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <UserRow key={u.id} user={u} idx={i} onEdit={u => setEditTarget(u)} onDelete={u => setDeleteTarget(u)} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(showAdd || editTarget) && (
        <UserModal user={editTarget} onSave={handleSave} onClose={() => { setEditTarget(null); setShowAdd(false); }} />
      )}
      {deleteTarget && (
        <DeleteModal user={deleteTarget} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />
      )}

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