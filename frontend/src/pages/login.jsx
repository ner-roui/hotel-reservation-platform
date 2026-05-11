import React, { useState } from "react";
import axios from "axios";
import {
  Shield,
  ConciergeBell,
  User,
  Mail,
  Lock,
  ArrowRight,
  Building2,
} from "lucide-react";

export default function LoginPage() {
  // ─────────────────────────────
  // STATE
  // ─────────────────────────────
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [role, setRole] = useState("Client");
  const [mode, setMode] = useState("login"); // login | signup
  const [loading, setLoading] = useState(false);

  const set = (k, v) =>
    setForm((prev) => ({
      ...prev,
      [k]: v,
    }));

  const roles = [
    { name: "Admin", icon: Shield },
    { name: "Réception", icon: ConciergeBell },
    { name: "Client", icon: User },
  ];

  // ─────────────────────────────
  // SUBMIT
  // ─────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // validation
      if (mode === "signup" && !form.name) {
        return alert("Veuillez entrer votre nom");
      }

      if (!form.email || !form.password) {
        return alert("Veuillez remplir tous les champs");
      }

      setLoading(true);

      const url =
        mode === "login"
          ? "http://localhost:3000/api/auth/login"
          : "http://localhost:3000/api/auth/register";

      const res = await axios.post(url, {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      });

      console.log(res.data);

      alert(
        mode === "login"
          ? "✅ Connexion réussie"
          : "✅ Compte créé"
      );

   
4  

    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Erreur serveur";

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-500 to-cyan-400 flex items-center justify-center px-6 py-10 relative overflow-hidden">

      {/* background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-300/20 blur-3xl rounded-full"></div>

      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* LEFT */}
        <div className="text-white space-y-8 hidden lg:block">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Building2 size={28} />
            </div>

            <h2 className="text-4xl font-bold">
              Lumière Hotels
            </h2>
          </div>

          {/* Hero */}
          <div className="space-y-5">
            <h1 className="text-6xl font-bold leading-tight max-w-xl">
              Bon retour parmi nous.
            </h1>

            <p className="text-xl text-white/80 max-w-lg leading-relaxed">
              Connectez-vous à votre espace
              sécurisé et gérez votre hôtel
              facilement.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-14 pt-8">
            <div>
              <h3 className="text-5xl font-bold">
                128
              </h3>

              <p className="text-white/70 mt-2">
                chambres
              </p>
            </div>

            <div>
              <h3 className="text-5xl font-bold">
                94%
              </h3>

              <p className="text-white/70 mt-2">
                occupation
              </p>
            </div>

            <div>
              <h3 className="text-5xl font-bold">
                4.9★
              </h3>

              <p className="text-white/70 mt-2">
                satisfaction
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-xl bg-white rounded-[36px] p-10 shadow-2xl">
            {/* Header */}
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-gray-900">
                Connexion
              </h2>

              <p className="text-gray-500 mt-3 text-lg">
                Sélectionnez votre rôle pour
                continuer.
              </p>
            </div>
            {/* ROLES */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {roles.map((item) => {
                const Icon = item.icon;
                const active = role === item.name;

                return (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setRole(item.name)}
                    className={`border rounded-2xl py-5 flex flex-col items-center gap-2 transition
                    ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    <Icon size={22} />
                    {item.name}
                  </button>
                );
              })}
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* NAME (signup only) */}
              {mode === "signup" && (
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase">
                    Nom complet
                  </label>

                  <div className="flex items-center border rounded-2xl px-4 h-16 mt-2">
                    <User size={20} className="text-gray-400" />

                    <input
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      type="text"
                      placeholder="Votre nom"
                      className="w-full h-full px-3 outline-none bg-transparent"
                    />
                  </div>
                </div>
              )}

              {/* EMAIL */}
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase">
                  Email
                </label>

                <div className="flex items-center border rounded-2xl px-4 h-16 mt-2">
                  <Mail size={20} className="text-gray-400" />

                  <input
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    type="email"
                    placeholder="guest@hotel.com"
                    className="w-full h-full px-3 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase">
                  Mot de passe
                </label>

                <div className="flex items-center border rounded-2xl px-4 h-16 mt-2">
                  <Lock size={20} className="text-gray-400" />

                  <input
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-full px-3 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-2xl bg-blue-600 text-white font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading
                  ? "Chargement..."
                  : mode === "login"
                  ? "Se connecter"
                  : "Créer compte"}

                <ArrowRight size={20} />
              </button>

              {/* SWITCH */}
              <p className="text-center text-gray-500 pt-4">
                {mode === "login" ? (
                  <>
                    Pas de compte ?{" "}
                    <span
                      onClick={() => setMode("signup")}
                      className="text-blue-600 font-semibold cursor-pointer hover:underline"
                    >
                      Créer un compte
                    </span>
                  </>
                ) : (
                  <>
                    Déjà un compte ?{" "}
                    <span
                      onClick={() => setMode("login")}
                      className="text-blue-600 font-semibold cursor-pointer hover:underline"
                    >
                      Se connecter
                    </span>
                  </>
                )}
              </p>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}