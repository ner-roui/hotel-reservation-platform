import React, { useState } from "react";
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
  const [role, setRole] = useState("Client");

  const roles = [
    {
      name: "Admin",
      icon: Shield,
    },
    {
      name: "Réception",
      icon: ConciergeBell,
    },
    {
      name: "Client",
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-500 to-cyan-400 flex items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Blur circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-300/20 blur-3xl rounded-full"></div>

      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT SIDE */}
        <div className="text-white space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Building2 size={24} />
            </div>

            <h2 className="text-3xl font-semibold">Lumière Hotels</h2>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold leading-tight max-w-xl">
              Bon retour parmi nous.
            </h1>

            <p className="text-xl text-white/80 max-w-lg">
              Sélectionnez votre rôle et accédez à votre espace dédié.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-12 pt-6">
            <div>
              <h3 className="text-5xl font-bold">128</h3>
              <p className="text-white/70 mt-1">chambres</p>
            </div>

            <div>
              <h3 className="text-5xl font-bold">94%</h3>
              <p className="text-white/70 mt-1">occupation</p>
            </div>

            <div>
              <h3 className="text-5xl font-bold">4.9★</h3>
              <p className="text-white/70 mt-1">satisfaction</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-xl bg-white rounded-[32px] p-10 shadow-2xl">
            {/* Title */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900">
                Connexion
              </h2>

              <p className="text-gray-500 mt-2 text-lg">
                Sélectionnez votre rôle pour continuer.
              </p>
            </div>

            {/* Role selector */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {roles.map((item) => {
                const Icon = item.icon;
                const active = role === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => setRole(item.name)}
                    className={`border rounded-2xl py-5 flex flex-col items-center justify-center gap-2 transition-all duration-300
                    ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-200 hover:border-blue-300 text-gray-500"
                    }`}
                  >
                    <Icon size={22} />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 uppercase mb-3">
                  Email
                </label>

                <div className="flex items-center border border-gray-200 rounded-2xl px-4 h-16 focus-within:border-blue-500 transition">
                  <Mail className="text-gray-400" size={20} />

                  <input
                    type="email"
                    placeholder="guest@lumiere.com"
                    className="w-full h-full px-3 outline-none text-gray-700 bg-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 uppercase mb-3">
                  Mot de passe
                </label>

                <div className="flex items-center border border-gray-200 rounded-2xl px-4 h-16 focus-within:border-blue-500 transition">
                  <Lock className="text-gray-400" size={20} />

                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-full px-3 outline-none text-gray-700 bg-transparent"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-500">
                  <input type="checkbox" className="accent-blue-600" />
                  Se souvenir de moi
                </label>

                <button
                  type="button"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Submit */}
              <button className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30">
                Se connecter
                <ArrowRight size={20} />
              </button>

              {/* Footer */}
              <p className="text-center text-gray-500 pt-4">
                Pas de compte ?{" "}
                <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                  Créer un compte
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Role Tabs */}
     
    </div>
  );
}