import { useState, useEffect } from "react";

const useFont = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
};

/* ── Data ───────────────────────────────────────────── */
const INITIAL_USERS = [
  { id: 1, prenom: "Sophie",  nom: "Laurent", email: "sophie@lumiere.com", role: "Admin",     statut: "Actif",   createdAt: "12 Jan 2025", lastSeen: "Aujourd'hui",  reservations: 0 },
  { id: 2, prenom: "Marc",    nom: "Dubois",  email: "marc@lumiere.com",   role: "Réception", statut: "Actif",   createdAt: "03 Mar 2025", lastSeen: "Hier",          reservations: 0 },
  { id: 3, prenom: "Amélie",  nom: "Roy",     email: "amelie@lumiere.com", role: "Nettoyage", statut: "Actif",   createdAt: "18 Juin 2025",lastSeen: "Il y a 2j",    reservations: 0 },
  { id: 4, prenom: "Élise",   nom: "Moreau",  email: "elise@gmail.com",    role: "Client",    statut: "Actif",   createdAt: "01 Avr 2026", lastSeen: "Aujourd'hui",  reservations: 4 },
  { id: 5, prenom: "Julien",  nom: "Caron",   email: "julien@lumiere.com", role: "Réception", statut: "Inactif", createdAt: "22 Fév 2025", lastSeen: "Il y a 12j",   reservations: 0 },
  { id: 6, prenom: "Camille", nom: "Petit",   email: "camille@gmail.com",  role: "Client",    statut: "Actif",   createdAt: "14 Avr 2026", lastSeen: "Aujourd'hui",  reservations: 2 },
  { id: 7, prenom: "Hugo",    nom: "Martin",  email: "hugo@lumiere.com",   role: "Admin",     statut: "Actif",   createdAt: "05 Nov 2024", lastSeen: "Il y a 3j",    reservations: 0 },
];

const ROLE_CFG = {
  "Admin":     { bg: "rgba(124,58,237,.15)",  border: "rgba(124,58,237,.35)",  text: "#c4b5fd", icon: "🛡" },
  "Réception": { bg: "rgba(96,165,250,.12)",  border: "rgba(96,165,250,.3)",   text: "#93c5fd", icon: "🪪" },
  "Nettoyage": { bg: "rgba(251,191,36,.12)",  border: "rgba(251,191,36,.28)",  text: "#fde68a", icon: "✨" },
  "Client":    { bg: "rgba(52,211,153,.1)",   border: "rgba(52,211,153,.28)",  text: "#6ee7b7", icon: "👤" },
};

const ROLES = ["Admin", "Réception", "Nettoyage", "Client"];

const NAV = [
  { label: "Dashboard",    icon: "⊞" },
  { label: "Chambres",     icon: "🛏" },
  { label: "Utilisateurs", icon: "👥" },
  { label: "Paiements",    icon: "💳" },
  { label: "Réservations", icon: "📅" },
  { label: "Rapports",     icon: "📊" },
  { label: "Paramètres",   icon: "⚙️" },
];

function initials(u) { return (u.prenom[0] + u.nom[0]).toUpperCase(); }

const AVATAR_COLORS = [
  "linear-gradient(135deg,#7c3aed,#4f46e5)",
  "linear-gradient(135deg,#0ea5e9,#2563eb)",
  "linear-gradient(135deg,#f59e0b,#d97706)",
  "linear-gradient(135deg,#10b981,#059669)",
  "linear-gradient(135deg,#ec4899,#be185d)",
  "linear-gradient(135deg,#8b5cf6,#7c3aed)",
  "linear-gradient(135deg,#06b6d4,#0891b2)",
];

/* ── Add/Edit Modal ─────────────────────────────────── */
function UserModal({ user, onSave, onClose }) {
  const isEdit = !!user;
  const [form, setForm] = useState(user ? { ...user } : { prenom: "", nom: "", email: "", role: "Client", statut: "Actif" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = "Requis";
    if (!form.nom.trim()) e.nom = "Requis";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Email invalide";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, id: user?.id || Date.now(), createdAt: user?.createdAt || "Aujourd'hui", lastSeen: "Aujourd'hui", reservations: user?.reservations || 0 });
  };

  const Field = ({ label, field, placeholder, type = "text" }) => {
    const [foc, setFoc] = useState(false);
    return (
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
          style={{ color: "rgba(148,163,184,.5)", fontSize: 9, letterSpacing: ".14em" }}>{label}</label>
        <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
          placeholder={placeholder}
          className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all duration-200"
          style={{
            background: foc ? "rgba(124,58,237,.08)" : "rgba(255,255,255,.04)",
            border: errors[field] ? "1.5px solid rgba(239,68,68,.5)" : foc ? "1.5px solid rgba(124,58,237,.5)" : "1.5px solid rgba(255,255,255,.09)",
            color: "#f8fafc",
            boxShadow: foc ? "0 0 0 3px rgba(124,58,237,.1)" : "none",
          }}
          onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
        />
        {errors[field] && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors[field]}</p>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" />
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(160deg,#131827,#0b0f1c)", border: "1px solid rgba(255,255,255,.09)" }}
        onClick={e => e.stopPropagation()}>

        {/* Top bar */}
        <div className="h-0.5" style={{ background: "linear-gradient(to right,#7c3aed,#6366f1,#a78bfa)" }} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#a78bfa", fontSize: 10 }}>
                {isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
              </p>
              <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Playfair Display',serif" }}>
                {isEdit ? `${user.prenom} ${user.nom}` : "Ajouter un compte"}
              </h3>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
              style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", color: "rgba(148,163,184,.7)" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,.1)"; e.currentTarget.style.color="#f87171"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.05)"; e.currentTarget.style.color="rgba(148,163,184,.7)"; }}
            >✕</button>
          </div>

          {/* Avatar preview */}
          {(form.prenom || form.nom) && (
            <div className="flex items-center gap-3 p-3 rounded-2xl mb-5" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                style={{ background: AVATAR_COLORS[0] }}>
                {(form.prenom[0] || "") + (form.nom[0] || "")}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{form.prenom} {form.nom}</p>
                <p className="text-xs" style={{ color: "rgba(100,116,139,.6)" }}>{form.email || "—"}</p>
              </div>
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <Field label="Prénom" field="prenom" placeholder="Sophie" />
              <Field label="Nom" field="nom" placeholder="Laurent" />
            </div>
            <Field label="Email" field="email" placeholder="sophie@lumiere.com" type="email" />

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(148,163,184,.5)", fontSize: 9 }}>Rôle</label>
              <div className="grid grid-cols-4 gap-2">
                {ROLES.map(r => {
                  const rc = ROLE_CFG[r];
                  return (
                    <button key={r} onClick={() => setForm(f => ({ ...f, role: r }))}
                      className="py-2 rounded-xl text-xs font-semibold transition-all duration-200 text-center"
                      style={{
                        background: form.role === r ? rc.bg : "rgba(255,255,255,.03)",
                        border: form.role === r ? `1.5px solid ${rc.border}` : "1.5px solid rgba(255,255,255,.08)",
                        color: form.role === r ? rc.text : "rgba(100,116,139,.6)",
                      }}>
                      <div className="text-base mb-0.5">{rc.icon}</div>
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(148,163,184,.5)", fontSize: 9 }}>Statut</label>
              <div className="flex gap-2">
                {["Actif", "Inactif"].map(s => (
                  <button key={s} onClick={() => setForm(f => ({ ...f, statut: s }))}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                    style={{
                      background: form.statut === s ? (s === "Actif" ? "rgba(52,211,153,.12)" : "rgba(100,116,139,.12)") : "rgba(255,255,255,.03)",
                      border: form.statut === s ? (s === "Actif" ? "1.5px solid rgba(52,211,153,.35)" : "1.5px solid rgba(100,116,139,.3)") : "1.5px solid rgba(255,255,255,.08)",
                      color: form.statut === s ? (s === "Actif" ? "#6ee7b7" : "#94a3b8") : "rgba(100,116,139,.6)",
                    }}>
                    {s === "Actif" ? "● Actif" : "○ Inactif"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", color: "rgba(148,163,184,.7)" }}>
              Annuler
            </button>
            <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 4px 14px rgba(124,58,237,.35)" }}>
              {isEdit ? "Enregistrer" : "Créer le compte"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Delete confirm ─────────────────────────────────── */
function DeleteModal({ user, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" />
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(145deg,#1a1f2e,#0b0f1c)", border: "1px solid rgba(255,255,255,.09)" }}
        onClick={e => e.stopPropagation()}>
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)" }}>🗑️</div>
          <h3 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>Supprimer l'utilisateur ?</h3>
          <p className="text-sm mb-1" style={{ color: "rgba(148,163,184,.7)" }}>
            <span style={{ color: "#c4b5fd", fontWeight: 600 }}>{user.prenom} {user.nom}</span>
          </p>
          <p className="text-xs mb-6" style={{ color: "rgba(100,116,139,.55)" }}>Cette action est irréversible.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", color: "rgba(148,163,184,.8)" }}>
              Annuler
            </button>
            <button onClick={() => onConfirm(user.id)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", boxShadow: "0 4px 14px rgba(220,38,38,.3)" }}>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── User Row ───────────────────────────────────────── */
function UserRow({ user, idx, onEdit, onDelete }) {
  const [hov, setHov] = useState(false);
  const rc = ROLE_CFG[user.role] || ROLE_CFG["Client"];
  const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

  return (
    <tr
      className="transition-all duration-200"
      style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: hov ? "rgba(124,58,237,.05)" : "transparent", cursor: "pointer" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      {/* Name */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: avatarColor }}>
            {initials(user)}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user.prenom} {user.nom}</p>
            <p className="text-xs" style={{ color: "rgba(100,116,139,.6)" }}>Créé le {user.createdAt}</p>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-4 py-3.5">
        <span className="text-sm" style={{ color: "rgba(148,163,184,.7)" }}>{user.email}</span>
      </td>

      {/* Role */}
      <td className="px-4 py-3.5">
        <span className="flex items-center gap-1.5 w-fit text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: rc.bg, border: `1px solid ${rc.border}`, color: rc.text }}>
          {rc.icon} {user.role}
        </span>
      </td>

      {/* Statut */}
      <td className="px-4 py-3.5">
        <span className="flex items-center gap-1.5 w-fit text-xs font-semibold px-3 py-1 rounded-full"
          style={{
            background: user.statut === "Actif" ? "rgba(52,211,153,.1)" : "rgba(100,116,139,.1)",
            border: user.statut === "Actif" ? "1px solid rgba(52,211,153,.25)" : "1px solid rgba(100,116,139,.2)",
            color: user.statut === "Actif" ? "#6ee7b7" : "#94a3b8",
          }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: user.statut === "Actif" ? "#34d399" : "#64748b" }} />
          {user.statut}
        </span>
      </td>

      {/* Last seen */}
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <span className="text-xs" style={{ color: "rgba(100,116,139,.55)" }}>{user.lastSeen}</span>
      </td>

      {/* Reservations */}
      <td className="px-4 py-3.5 hidden lg:table-cell">
        {user.reservations > 0 ? (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
            style={{ background: "rgba(124,58,237,.12)", color: "#a78bfa", border: "1px solid rgba(124,58,237,.2)" }}>
            {user.reservations} rés.
          </span>
        ) : (
          <span className="text-xs" style={{ color: "rgba(100,116,139,.3)" }}>—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2 justify-end">
          <button onClick={() => onEdit(user)}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", color: "rgba(148,163,184,.6)" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(124,58,237,.15)"; e.currentTarget.style.color="#a78bfa"; e.currentTarget.style.borderColor="rgba(124,58,237,.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.05)"; e.currentTarget.style.color="rgba(148,163,184,.6)"; e.currentTarget.style.borderColor="rgba(255,255,255,.08)"; }}
          >✏️</button>
          <button onClick={() => onDelete(user)}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.15)", color: "rgba(248,113,113,.6)" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,.15)"; e.currentTarget.style.color="#f87171"; e.currentTarget.style.borderColor="rgba(239,68,68,.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(239,68,68,.06)"; e.currentTarget.style.color="rgba(248,113,113,.6)"; e.currentTarget.style.borderColor="rgba(239,68,68,.15)"; }}
          >🗑️</button>
        </div>
      </td>
    </tr>
  );
}

/* ── Main ───────────────────────────────────────────── */
export default function UtilisateursPage() {
  useFont();

  const [activeNav, setActiveNav] = useState("Utilisateurs");
  const [activeRole, setActiveRole] = useState("Admin");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("Tous");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (u) => {
    if (editTarget) {
      setUsers(prev => prev.map(x => x.id === u.id ? u : x));
      showToast(`${u.prenom} ${u.nom} mis à jour`);
    } else {
      setUsers(prev => [...prev, u]);
      showToast(`${u.prenom} ${u.nom} créé avec succès`);
    }
    setEditTarget(null);
    setShowAdd(false);
  };

  const handleDelete = (id) => {
    const u = users.find(x => x.id === id);
    setUsers(prev => prev.filter(x => x.id !== id));
    setDeleteTarget(null);
    showToast(`${u.prenom} ${u.nom} supprimé`, "error");
  };

  const filtered = users.filter(u => {
    const mSearch = !search || `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const mRole = filterRole === "Tous" || u.role === filterRole;
    return mSearch && mRole;
  });

  const stats = {
    total:   users.length,
    actifs:  users.filter(u => u.statut === "Actif").length,
    admins:  users.filter(u => u.role === "Admin").length,
    clients: users.filter(u => u.role === "Client").length,
  };

  return (
   <div
  className="flex min-h-screen w-full overflow-hidden"
  style={{
    background: "#ffffff",
    fontFamily: "'Outfit',sans-serif",
    fontWeight: 300,
    color: "#0f172a",
  }}
>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto flex flex-col">

        {/* Topbar */}
        <div className="sticky top-0 z-20 px-8 py-4" style={{ background: "#ffffff", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "rgba(100,116,139,.6)" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher chambres, clients, réservations..."
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl focus:outline-none transition-all"
                style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", color: "#f8fafc" }}
                onFocus={e => e.target.style.borderColor = "rgba(124,58,237,.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.08)"}
              />
            </div>
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
              style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}>
              <span style={{ color: "rgba(148,163,184,.7)" }}>🔔</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2" style={{ background: "#7c3aed", borderColor: "#080b14" }} />
            </div>
          </div>
        </div>

        <div className="px-8 py-7 flex-1">

          {/* Page header */}
          <div className="flex items-start justify-between mb-7" style={{ animation: "fadeUp .5s ease both" }}>
            <div>
              <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "'Playfair Display',serif" }}>Utilisateurs</h1>
              <p className="text-sm mt-0.5" style={{ color: "rgba(100,116,139,.7)" }}>Gérez les comptes et les rôles.</p>
            </div>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 4px 16px rgba(124,58,237,.35)" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 22px rgba(124,58,237,.55)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,.35)"}
            >+ Ajouter Utilisateur</button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-7" style={{ animation: "fadeUp .5s .04s ease both" }}>
            {[
              { label: "Total",      val: stats.total,   icon: "👥", color: "#a78bfa" },
              { label: "Actifs",     val: stats.actifs,  icon: "🟢", color: "#34d399" },
              { label: "Admins",     val: stats.admins,  icon: "🛡",  color: "#c4b5fd" },
              { label: "Clients",    val: stats.clients, icon: "👤", color: "#6ee7b7" },
            ].map((s, i) => (
             <div
  key={i}
  className="rounded-2xl p-4 flex items-center gap-3 transition-all duration-200"
  style={{
    background: "#ffffff",
    border: "1.5px solid #e2e8f0",
    boxShadow: "0 4px 14px rgba(15,23,42,.05)",
    animation: `fadeUp .5s ${.04 + i * .06}s ease both`,
  }}
>
  <div
    className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
    style={{
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
    }}
  >
    {s.icon}
  </div>

  <div>
    <p
      className="font-bold text-xl"
      style={{
        color: s.color,
        lineHeight: 1,
        fontFamily: "'Playfair Display',serif",
      }}
    >
      {s.val}
    </p>

    <p
      className="text-xs mt-0.5"
      style={{ color: "rgba(100,116,139,.7)" }}
    >
      {s.label}
    </p>
  </div>
</div>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", animation: "fadeUp .5s .1s ease both" }}>

            {/* Table toolbar */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,.06)" }}>
              <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)" }}>
                {["Tous", ...ROLES].map(r => (
                  <button key={r} onClick={() => setFilterRole(r)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                    style={{
                      background: filterRole === r ? "rgba(124,58,237,.25)" : "transparent",
                      color: filterRole === r ? "#c4b5fd" : "rgba(100,116,139,.6)",
                      border: filterRole === r ? "1px solid rgba(124,58,237,.35)" : "1px solid transparent",
                    }}>
                    {r}
                    {r !== "Tous" && (
                      <span className="ml-1.5 text-xs"
                        style={{ color: filterRole === r ? "rgba(167,139,250,.6)" : "rgba(100,116,139,.4)" }}>
                        {users.filter(u => u.role === r).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs" style={{ color: "rgba(100,116,139,.5)" }}>
                {filtered.length} utilisateur{filtered.length > 1 ? "s" : ""}
              </p>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                  {["Nom", "Email", "Rôle", "Statut", "Dernière activité", "Réservations", ""].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "rgba(100,116,139,.5)", letterSpacing: ".1em", fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="text-3xl mb-3">👥</div>
                      <p className="text-sm font-medium text-white">Aucun utilisateur trouvé</p>
                      <p className="text-xs mt-1" style={{ color: "rgba(100,116,139,.5)" }}>Modifiez votre recherche ou vos filtres</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((u, i) => (
                    <UserRow key={u.id} user={u} idx={i}
                      onEdit={u => setEditTarget(u)}
                      onDelete={u => setDeleteTarget(u)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Modals */}
      {(showAdd || editTarget) && (
        <UserModal user={editTarget} onSave={handleSave} onClose={() => { setEditTarget(null); setShowAdd(false); }} />
      )}
      {deleteTarget && (
        <DeleteModal user={deleteTarget} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium text-white shadow-xl"
          style={{
            background: toast.type === "error" ? "linear-gradient(135deg,#dc2626,#b91c1c)" : "linear-gradient(135deg,#7c3aed,#4f46e5)",
            boxShadow: toast.type === "error" ? "0 8px 24px rgba(220,38,38,.4)" : "0 8px 24px rgba(124,58,237,.45)",
            animation: "fadeUp .3s ease both",
          }}>
          <span>{toast.type === "error" ? "🗑️" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color:rgba(100,116,139,.4); }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(124,58,237,.3); border-radius:2px; }
      `}</style>
    </div>
  );
}