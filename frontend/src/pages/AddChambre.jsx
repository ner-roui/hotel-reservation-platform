import { useState, useCallback, useRef } from "react";
import axios from "axios"
import { useParams } from "react-router-dom";
// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV = [
  { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Dashboard", badge: null, section: "Principal" },
  { icon: "M3 10h18M3 6h18M3 14h18M3 18h18", label: "Chambres", badge: "7", active: true, section: null },
  { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0", label: "Utilisateurs", badge: null, section: null },
  { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Réservations", badge: "4", section: "Gestion" },
  { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", label: "Paiements", badge: null, section: null },
  { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", label: "Rapports", badge: null, section: null },
  { icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", label: "Paramètres", badge: null, section: "Système" },
];

const AMENITIES = [
  { icon: "📶", label: "Wi-Fi" },
  { icon: "❄️", label: "Climatisation" },
  { icon: "🛁", label: "Baignoire" },
  { icon: "🚿", label: "Douche" },
  { icon: "📺", label: "TV 4K" },
  { icon: "☕", label: "Machine café" },
  { icon: "🧊", label: "Minibar" },
  { icon: "👔", label: "Dressing" },
  { icon: "🛋️", label: "Salon" },
  { icon: "🌅", label: "Balcon" },
  { icon: "🏊", label: "Piscine" },
  { icon: "💼", label: "Bureau" },
  { icon: "🔒", label: "Coffre-fort" },
  { icon: "♿", label: "Accès PMR" },
];

// ─── SVG Icon helper ──────────────────────────────────────────────────────────
function Icon({ path, className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
      {path.split(" M").map((p, i) => (
        <path key={i} strokeLinecap="round" strokeLinejoin="round" d={i === 0 ? p : "M" + p} />
      ))}
    </svg>
  );
}


// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#eeecff" }}>
          <span style={{ color: "#6c63ff", fontSize: 18 }}>{icon}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="px-5 pb-5">{children}</div>
    </div>
  );
}

// ─── Form field ───────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CreateRoomPage() {
  const [form, setForm] = useState({ num: "", type: "", floor: "", capacity: "", area: "", view: "", description: "", checkin: "14h00", checkout: "12h00", pets: "Non autorisés", smoking: "Non-fumeur", notes: "", bedType: "Grand lit (160×200)", beds: "1", bathroom: "Privée", priceWeek: "", priceWE: "", discount: "" });
  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState("Disponible");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();
  const {id} = useParams()
  console.log(id)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // const handleFiles = useCallback((files) => {
  //   Array.from(files).forEach(f => {
  //     // FileReader est une API JavaScript du navigateur qui permet de lire des fichiers côté client.
  //     const reader = new FileReader();


  //     reader.onload = e => setImages(prev => [...prev, { src: e.target.result, name: f.name }]);


  //     reader.readAsDataURL(f);
  //     // Cela transforme l’image en : data:image/png;base64,... => 

  //   });
  // }, []);


  const handleFiles = (files) => {
  Array.from(files).forEach(file => {
    const preview = URL.createObjectURL(file);

    setImages(prev => [
      ...prev,
      {
        src: preview,
        file,
        name: file.name
      }
    ]);
  });
};

  const toggleAmenity = (label) => setAmenities(prev => prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]);

  const addTag = () => {
    const v = tagInput.trim();
    if (v && !tags.includes(v)) { setTags(t => [...t, v]); setTagInput(""); }
  };

  const p1 = parseFloat(form.priceWeek) || 0;
  const p2 = parseFloat(form.priceWE) || 0;
  const disc = parseFloat(form.discount) || 0;
  const week7 = p1 ? Math.round(p1 * 7 * (1 - disc / 100)) : 0;

  const progress = [form.num, form.type, form.capacity, form.description.length > 10, images.length > 0].filter(Boolean).length;
  const progPct = Math.round((progress / 5) * 100);

  const statusConfig = {
    Disponible: { label: "Disponible", sub: "Ouverte aux réservations", bg: "bg-emerald-50", border: "border-emerald-400", icon: "✅", iconBg: "bg-emerald-100" },
    Maintenance: { label: "Maintenance", sub: "Temporairement fermée", bg: "bg-amber-50", border: "border-amber-400", icon: "🔧", iconBg: "bg-amber-100" },
    Inactive: { label: "Inactive", sub: "Masquée du catalogue", bg: "bg-red-50", border: "border-red-400", icon: "🚫", iconBg: "bg-red-100" },
  };

  const publish = async () => {
  try {

    const missingFields = [];

if (!form.num) missingFields.push("Numéro");
if (!form.type) missingFields.push("Type");
if (!form.capacity) missingFields.push("Capacité");
if (!form.priceWeek) missingFields.push("Prix semaine");
if (!form.priceWE) missingFields.push("Prix week-end");

  if (missingFields.length > 0) {
    return alert(
      "❌ Champs manquants : " + missingFields.join(", ")
    );
  }

    if (images.length === 0) {
      return alert("❌ Ajoutez au moins une image");
    }

    if (!amenities.length) {
      return alert("❌ Sélectionnez au moins un équipement");
    }

    const formData = new FormData();

    // Champs
    formData.append("numero", form.num);

    formData.append("type", form.type);
    formData.append("etage", form.floor);

    formData.append("capacite", form.capacity);

    formData.append("superficie", form.area);

    formData.append("vue", form.view);

    formData.append("prix_nuit", form.priceWeek);

    formData.append("prix_week", form.priceWE);
    console.log('statussssssssss', status);
    formData.append("statut", status);

    // Equipements
    formData.append(
      "equipements",
      JSON.stringify(amenities)
    );

    // Images
    images.forEach((img) => {
      formData.append("images", img.file);
    });
    if(id){

    const res = await axios.post("http://localhost:3000/api/chambres/update-room",
      formData
    )

   
    console.log(res);


    alert("✅ Chambre modifiée");
    }else{
      const res = await axios.post("http://localhost:3000/api/chambres/add-room",
      formData
    )

   
    console.log(res);


    alert("✅ Chambre créée");
    }

 

  } catch (err) {
    const message =
    err.response?.data?.message || "Erreur serveur";

  alert(message);
  }
};

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif", background: "#f0f1f5" }}>
    

      <div className="flex-1 flex flex-col overflow-auto">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 flex items-center justify-between px-7 h-16">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-gray-500 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Chambres
            </button>
            <div>
              <h1 className="text-base font-semibold text-gray-900">Nouvelle chambre</h1>
              <p className="text-xs text-gray-400">Remplissez les informations et ajoutez vos photos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => alert("Brouillon sauvegardé")} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              💾 Brouillon
            </button>
            <button onClick={publish} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors" style={{ background: "#6c63ff" }}
              onMouseEnter={e => e.currentTarget.style.background = "#5b52ee"}
              onMouseLeave={e => e.currentTarget.style.background = "#6c63ff"}>
              ✓ Publier la chambre
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-7 grid gap-5" style={{ gridTemplateColumns: "1fr 320px", alignItems: "start" }}>

          {/* LEFT */}
          <div className="flex flex-col gap-5">

            {/* Infos générales */}
            <Card icon="ℹ️" title="Informations générales" subtitle="Identité et caractéristiques de la chambre">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Numéro de chambre">
                  <input className={inputCls} value={form.num} onChange={e => set("num", e.target.value)} placeholder="ex. 402" />
                </Field>
                <Field label="Type de chambre">
                  <select className={inputCls} value={form.type} onChange={e => set("type", e.target.value)}>
                    <option value="">Sélectionner...</option>
                    {["Standard","Supérieure","Deluxe","Suite","Suite Présidentielle",].map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Étage">
                  <input className={inputCls} type="number" value={form.floor} onChange={e => set("floor", e.target.value)} placeholder="ex. 4" min="0" />
                </Field>
                <Field label="Capacité (personnes)">
                  <input className={inputCls} type="number" value={form.capacity} onChange={e => set("capacity", e.target.value)} placeholder="ex. 2" min="1" max="10" />
                </Field>
                <Field label="Superficie (m²)">
                  <input className={inputCls} type="number" value={form.area} onChange={e => set("area", e.target.value)} placeholder="ex. 35" />
                </Field>
                <Field label="Vue">
                  <select className={inputCls} value={form.view} onChange={e => set("view", e.target.value)}>
                    <option value="">Sélectionner...</option>
                    {["Vue mer", "Vue piscine", "Vue jardin", "Vue ville", "Vue intérieure"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <div className="col-span-2">
                  <Field label="Description">
                    <textarea className={inputCls} rows={3} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Décrivez l'ambiance, les atouts, l'expérience client..." style={{ resize: "vertical" }} />
                  </Field>
                </div>
              </div>
            </Card>

            {/* Galerie photos */}
            <Card icon="📷" title="Galerie photos" subtitle="Plus de photos = plus de réservations">
              {/* Drop zone */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragging ? "border-violet-400 bg-violet-50" : "border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/50"}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => fileRef.current.click()}
              >
                <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl" style={{ background: "#eeecff" }}>📤</div>
                <p className="text-sm font-medium text-gray-700"><span style={{ color: "#6c63ff" }}>Cliquez</span> ou glissez vos photos ici</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — recommandé min. 1200×800px</p>
              </div>

              {/* Gallery grid */}
              {images.length > 0 && (
                <>
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                        <img src={img.src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        {i === 0 && (
                          <span className="absolute bottom-2 left-2 text-xs font-semibold text-white px-2 py-0.5 rounded-full" style={{ background: "#6c63ff" }}>Couverture</span>
                        )}
                        <button
                          onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >✕</button>
                      </div>
                    ))}
                    <div
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 text-xs cursor-pointer hover:border-violet-300 hover:text-violet-400 transition-all"
                      onClick={() => fileRef.current.click()}
                    >
                      <span className="text-2xl">+</span>
                      <span>Ajouter</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <span style={{ color: "#6c63ff" }}>📸</span>
                    {images.length} photo{images.length > 1 ? "s" : ""} ajoutée{images.length > 1 ? "s" : ""}
                  </p>
                </>
              )}

              {/* Tips */}
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                {["Lumière naturelle", "Résolution 1200px+", "Plusieurs angles", "Salle de bain incluse"].map(t => (
                  <p key={t} className="text-xs text-gray-400 flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span>{t}
                  </p>
                ))}
              </div>
            </Card>

            {/* Équipements */}
            <Card icon="⭐" title="Équipements & services" subtitle="Cliquez pour sélectionner">
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map(a => (
                  <button
                    key={a.label}
                    onClick={() => toggleAmenity(a.label)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${amenities.includes(a.label) ? "border-violet-400 text-violet-700" : "border-gray-200 text-gray-500 hover:border-violet-200 hover:text-violet-500"}`}
                    style={{ background: amenities.includes(a.label) ? "#eeecff" : "#fff" }}
                  >
                    <span>{a.icon}</span>{a.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tags personnalisés</p>
                <div className="flex gap-2">
                  <input
                    className={inputCls}
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="Ajouter un tag... (Entrée)"
                  />
                  <button onClick={addTag} className="px-3 py-2 rounded-lg text-white text-sm font-medium flex-shrink-0" style={{ background: "#6c63ff" }}>+</button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "#eeecff", color: "#6c63ff" }}>
                        {t}
                        <button onClick={() => setTags(prev => prev.filter(x => x !== t))} className="hover:opacity-70">✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Règles */}
            <Card icon="📋" title="Règles & politique" subtitle="Horaires et conditions de séjour">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Check-in">
                  <input className={inputCls} value={form.checkin} onChange={e => set("checkin", e.target.value)} />
                </Field>
                <Field label="Check-out">
                  <input className={inputCls} value={form.checkout} onChange={e => set("checkout", e.target.value)} />
                </Field>
                <Field label="Animaux">
                  <select className={inputCls} value={form.pets} onChange={e => set("pets", e.target.value)}>
                    {["Non autorisés", "Petits animaux", "Autorisés"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Fumeurs">
                  <select className={inputCls} value={form.smoking} onChange={e => set("smoking", e.target.value)}>
                    {["Non-fumeur", "Fumeurs autorisés"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <div className="col-span-2">
                  <Field label="Notes internes (personnel)">
                    <textarea className={inputCls} rows={2} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Instructions spéciales pour le personnel..." style={{ resize: "vertical" }} />
                  </Field>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-5">

            {/* Progress */}
            <Card icon="📊" title="Progression" subtitle="Complétez tous les champs">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Complété</span>
                <span className="font-semibold" style={{ color: "#6c63ff" }}>{progPct}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progPct}%`, background: "#6c63ff" }} />
              </div>
              <p className="text-xs text-gray-400">Ajoutez des photos pour maximiser vos réservations.</p>
            </Card>

            {/* Tarification */}
            <Card icon="💶" title="Tarification" subtitle="Prix affiché aux clients">
              <div className="flex flex-col gap-3">
                <Field label="Prix / nuit (semaine)">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
                    <input className={inputCls + " pl-7"} type="number" value={form.priceWeek} onChange={e => set("priceWeek", e.target.value)} placeholder="0" min="0" />
                  </div>
                </Field>
                <Field label="Prix / nuit (week-end)">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
                    <input className={inputCls + " pl-7"} type="number" value={form.priceWE} onChange={e => set("priceWE", e.target.value)} placeholder="0" min="0" />
                  </div>
                </Field>
                <Field label="Remise longue durée (%)">
                  <input className={inputCls} type="number" value={form.discount} onChange={e => set("discount", e.target.value)} placeholder="0" min="0" max="100" />
                </Field>
              </div>
              <div className="mt-4 rounded-xl p-4 border" style={{ background: "#f8f7ff", borderColor: "#e8e6ff" }}>
                {[
                  ["Nuit standard", p1 ? `${p1.toLocaleString("fr-FR")} €` : "— €", false],
                  ["Nuit week-end", p2 ? `${p2.toLocaleString("fr-FR")} €` : "— €", false],
                  ["Séjour 7 nuits", week7 ? `${week7.toLocaleString("fr-FR")} €` : "— €", true],
                ].map(([label, value, highlight], i) => (
                  <div key={i}>
                    {i === 2 && <div className="h-px my-2" style={{ background: "#e8e6ff" }} />}
                    <div className="flex justify-between items-center py-1 text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className={`font-semibold ${highlight ? "" : "text-gray-900"}`} style={highlight ? { color: "#6c63ff" } : {}}>{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Statut */}
            <Card icon="🔄" title="Statut de la chambre" subtitle="Disponibilité en temps réel">
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(statusConfig).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setStatus(key)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${status === key ? `${cfg.bg} ${cfg.border}` : "bg-white border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center text-base ${status === key ? cfg.iconBg : "bg-gray-100"}`}>
                      {cfg.icon}
                    </div>
                    <p className="text-xs font-semibold text-gray-800">{cfg.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">{cfg.sub}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Lit & config */}
            <Card icon="🛏️" title="Lit & configuration" subtitle="Type de couchage proposé">
              <div className="flex flex-col gap-3">
                <Field label="Type de lit">
                  <select className={inputCls} value={form.bedType} onChange={e => set("bedType", e.target.value)}>
                    {["Lit double (140×190)", "Grand lit (160×200)", "Très grand lit (180×200)", "Lits jumeaux", "Canapé-lit"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Nombre de lits">
                  <input className={inputCls} type="number" value={form.beds} onChange={e => set("beds", e.target.value)} min="1" max="6" />
                </Field>
                <Field label="Salle de bain">
                  <select className={inputCls} value={form.bathroom} onChange={e => set("bathroom", e.target.value)}>
                    {["Privée", "Partagée", "Suite bain"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={() => confirm("Annuler la création ?") && alert("Annulé")} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                ✕ Annuler
              </button>
              <button onClick={publish} className="flex-2 flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors" style={{ background: "#6c63ff" }}
                onMouseEnter={e => e.currentTarget.style.background = "#5b52ee"}
                onMouseLeave={e => e.currentTarget.style.background = "#6c63ff"}>
                ✓ Publier la chambre
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}