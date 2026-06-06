export default function LumiereFooter() {
    const navLinks = ["Accueil", "Chambres", "Services", "Contact", "Offres spéciales"];
  
    const services = [
      "Wi-Fi très haut débit",
      "Petit-déjeuner gourmet",
      "Spa & bien-être",
      "TV 4K & streaming",
      "Service en chambre",
    ];
  
    const roles = [
      { label: "Client", icon: "👤", desc: "Réservez et suivez vos séjours" },
      { label: "Réception", icon: "🪪", desc: "Validez, check-in et check-out" },
      { label: "Nettoyage", icon: "🧹", desc: "Mettez à jour l'état des chambres" },
      { label: "Admin", icon: "🛡️", desc: "Pilotez tout le système" },
    ];
  
    return (
      <footer className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-gray-950 to-black text-gray-300 px-10 pt-16 pb-8 border-t border-white/10">
        
        {/* Halo décoratif */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-blue-500/10 blur-[140px] pointer-events-none" />
  
        <div className="relative z-10">
  
          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-white/10">
  
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  🏨
                </div>
  
                <span className="text-white font-semibold text-lg tracking-wide">
                  Lumière Hotels
                </span>
              </div>
  
              <p className="text-sm text-white/50 leading-relaxed max-w-[260px] mb-6">
                Une expérience hôtelière tout inclus, pensée pour le confort,
                l'élégance et l'excellence du service.
              </p>
  
              <ul className="space-y-3">
                {[
                  { icon: "📍", text: "12 rue des Étoiles, Paris" },
                  { icon: "✉️", text: "contact@lumiere.com" },
                  { icon: "📞", text: "+33 1 23 45 67 89" },
                ].map(({ icon, text }) => (
                  <li
                    key={text}
                    className="flex items-center gap-3 text-sm text-white/50"
                  >
                    <span className="text-base">{icon}</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Navigation */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/30 mb-5">
                Navigation
              </p>
  
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="inline-block text-sm text-white/60 hover:text-blue-400 hover:translate-x-1 transition-all duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Services */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/30 mb-5">
                Services
              </p>
  
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service}>
                    <a
                      href="#"
                      className="inline-block text-sm text-white/60 hover:text-blue-400 hover:translate-x-1 transition-all duration-300"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Roles */}
      
           
          </div>
  
          {/* Bottom Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pt-6 gap-4">
  
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white">
                🏨
              </div>
  
              <span className="text-xs text-white/40">
                © 2025 Lumière Hotels — 12 rue des Étoiles, Paris ·
                contact@lumiere.com
              </span>
            </div>
  
            <div className="flex flex-wrap gap-6">
              {["Mentions légales", "Confidentialité", "CGU"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs text-white/40 hover:text-blue-400 transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </div>
  
          </div>
        </div>
      </footer>
    );
  }