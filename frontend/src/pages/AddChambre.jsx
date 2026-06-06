import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

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

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #ede5db" }}>
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#f0e6db" }}
        >
          <span style={{ fontSize: 18 }}>{icon}</span>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#2c1a0e" }}>{title}</p>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: "#a8968a" }}>{subtitle}</p>}
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
      <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#a8968a" }}>{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all bg-white";
const inputStyle = {
  border: "1px solid #ddd5c8",
  color: "#2c1a0e",
};
const inputFocusStyle = {
  border: "1px solid #a07850",
  boxShadow: "0 0 0 3px rgba(160,120,80,0.12)",
};

function WarmInput({ className = "", style = {}, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      className={inputCls + (className ? " " + className : "")}
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}), ...style }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    />
  );
}

function WarmSelect({ className = "", style = {}, children, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      className={inputCls + (className ? " " + className : "")}
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}), ...style }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    >
      {children}
    </select>
  );
}

function WarmTextarea({ className = "", style = {}, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      className={inputCls + (className ? " " + className : "")}
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}), resize: "vertical", ...style }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CreateRoomPage() {
  const [form, setForm] = useState({
    num: "", type: "", floor: "", capacity: "", area: "", view: "",
    description: "", checkin: "14h00", checkout: "12h00",
    pets: "Non autorisés", smoking: "Non-fumeur", notes: "",
    bedType: "Grand lit (160×200)", beds: "1", bathroom: "Privée",
    priceWeek: "", priceWE: "", discount: "",
  });
  const [images,    setImages]    = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [tags,      setTags]      = useState([]);
  const [tagInput,  setTagInput]  = useState("");
  const [status,    setStatus]    = useState("Disponible");
  const [dragging,  setDragging]  = useState(false);
  const fileRef = useRef();
  const { id }  = useParams();
  const isEdit  = !!id;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:3000/api/chambres/${id}`).then(({ data }) => {
      const room = data.chambre;
      setForm({
        num: room.numero || "", type: room.type || "", floor: room.etage || "",
        capacity: room.capacity || "", area: room.area || "", view: room.vue || "",
        description: room.description || "", checkin: room.checkin || "14h00",
        checkout: room.checkout || "12h00", pets: room.pets || "Non autorisés",
        smoking: room.smoking || "Non-fumeur", notes: room.notes || "",
        bedType: room.bedType || "", beds: room.beds || "", bathroom: room.bathroom || "",
        priceWeek: room.prix_nuit || "", priceWE: room.prix_week || "", discount: room.discount || "",
      });
      setAmenities(room.equipements.filter(e => e.disponible).map(e => e.nom));
      setImages(room.images.map(img => ({ src: `http://localhost:3000${img}`, file: null, name: img })));
      setTags(room.tags || []);
    }).catch(console.error);
  }, [id]);

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      setImages(prev => [...prev, { src: URL.createObjectURL(file), file, name: file.name }]);
    });
  };

  const toggleAmenity = (label) =>
    setAmenities(prev => prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]);

  const addTag = () => {
    const v = tagInput.trim();
    if (v && !tags.includes(v)) { setTags(t => [...t, v]); setTagInput(""); }
  };

  const p1   = parseFloat(form.priceWeek) || 0;
  const p2   = parseFloat(form.priceWE)   || 0;
  const disc = parseFloat(form.discount)  || 0;
  const week7 = p1 ? Math.round(p1 * 7 * (1 - disc / 100)) : 0;

  const progress = [form.num, form.type, form.capacity, form.description.length > 10, images.length > 0].filter(Boolean).length;
  const progPct  = Math.round((progress / 5) * 100);

  const statusConfig = {
    Disponible:  { label: "Disponible",  sub: "Ouverte aux réservations", bg: "#f0fdf4", border: "#4ade80", icon: "✅", iconBg: "#dcfce7" },
    Maintenance: { label: "Maintenance", sub: "Temporairement fermée",    bg: "#fffbeb", border: "#fbbf24", icon: "🔧", iconBg: "#fef3c7" },
    Inactive:    { label: "Inactive",    sub: "Masquée du catalogue",      bg: "#fff1f2", border: "#f87171", icon: "🚫", iconBg: "#fee2e2" },
  };

  const publish = async () => {
    const missingFields = [];
    if (!form.num)       missingFields.push("Numéro");
    if (!form.type)      missingFields.push("Type");
    if (!form.capacity)  missingFields.push("Capacité");
    if (!form.priceWeek) missingFields.push("Prix semaine");
    if (!form.priceWE)   missingFields.push("Prix week-end");
    if (missingFields.length > 0) return alert("❌ Champs manquants : " + missingFields.join(", "));
    if (images.length === 0)      return alert("❌ Ajoutez au moins une image");
    if (!amenities.length)        return alert("❌ Sélectionnez au moins un équipement");

    const formData = new FormData();
    formData.append("numero",    form.num);
    formData.append("type",      form.type);
    formData.append("etage",     form.floor);
    formData.append("capacite",  form.capacity);
    formData.append("superficie",form.area);
    formData.append("vue",       form.view);
    formData.append("prix_nuit", form.priceWeek);
    formData.append("prix_week", form.priceWE);
    formData.append("statut",    status);
    formData.append("equipements", JSON.stringify(amenities));
    images.forEach(img => formData.append("images", img.file));

    try {
      if (id) {
        await axios.put(`http://localhost:3000/api/chambres/update-room/${id}`, formData, { withCredentials: true });
        alert("✅ Chambre modifiée");
      } else {
        await axios.post("http://localhost:3000/api/chambres/add-room", formData, { withCredentials: true });
        alert("✅ Chambre ajoutée");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Erreur serveur");
    }
  };

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif", background: "#faf7f4" }}>
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="flex-1 p-7 grid gap-5" style={{ gridTemplateColumns: "1fr 320px", alignItems: "start" }}>

          {/* ── LEFT ── */}
          <div className="flex flex-col gap-5">

            {/* Infos générales */}
            <Card icon="ℹ️" title="Informations générales" subtitle="Identité et caractéristiques de la chambre">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Numéro de chambre">
                  <WarmInput value={form.num} onChange={e => set("num", e.target.value)} placeholder="ex. 402" />
                </Field>
                <Field label="Type de chambre">
                  <WarmSelect value={form.type} onChange={e => set("type", e.target.value)}>
                    <option value="">Sélectionner...</option>
                    {["Standard","Supérieure","Deluxe","Suite","Suite Présidentielle"].map(t => <option key={t}>{t}</option>)}
                  </WarmSelect>
                </Field>
                <Field label="Étage">
                  <WarmInput type="number" value={form.floor} onChange={e => set("floor", e.target.value)} placeholder="ex. 4" min="0" />
                </Field>
                <Field label="Capacité (personnes)">
                  <WarmInput type="number" value={form.capacity} onChange={e => set("capacity", e.target.value)} placeholder="ex. 2" min="1" max="10" />
                </Field>
                <Field label="Superficie (m²)">
                  <WarmInput type="number" value={form.area} onChange={e => set("area", e.target.value)} placeholder="ex. 35" />
                </Field>
                <Field label="Vue">
                  <WarmSelect value={form.view} onChange={e => set("view", e.target.value)}>
                    <option value="">Sélectionner...</option>
                    {["Vue mer","Vue piscine","Vue jardin","Vue ville","Vue intérieure"].map(v => <option key={v}>{v}</option>)}
                  </WarmSelect>
                </Field>
                <div className="col-span-2">
                  <Field label="Description">
                    <WarmTextarea rows={3} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Décrivez l'ambiance, les atouts, l'expérience client..." />
                  </Field>
                </div>
              </div>
            </Card>

            {/* Galerie */}
            <Card icon="📷" title="Galerie photos" subtitle="Plus de photos = plus de réservations">
              <div
                className="relative rounded-xl p-8 text-center cursor-pointer transition-all"
                style={{
                  border: dragging ? "2px dashed #a07850" : "2px dashed #ddd5c8",
                  background: dragging ? "#faf7f4" : "#fdfbf8",
                }}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => fileRef.current.click()}
              >
                <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl" style={{ background: "#f0e6db" }}>📤</div>
                <p className="text-sm font-medium" style={{ color: "#6b5b52" }}>
                  <span style={{ color: "#a07850" }}>Cliquez</span> ou glissez vos photos ici
                </p>
                <p className="text-xs mt-1" style={{ color: "#a8968a" }}>JPG, PNG, WEBP — recommandé min. 1200×800px</p>
              </div>

              {images.length > 0 && (
                <>
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden group" style={{ border: "1px solid #ede5db" }}>
                        <img src={img.src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        {i === 0 && (
                          <span className="absolute bottom-2 left-2 text-xs font-semibold text-white px-2 py-0.5 rounded-full" style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)" }}>
                            Couverture
                          </span>
                        )}
                        <button
                          onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >✕</button>
                      </div>
                    ))}
                    <div
                      className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-xs cursor-pointer transition-all"
                      style={{ border: "2px dashed #ddd5c8", color: "#a8968a" }}
                      onClick={() => fileRef.current.click()}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#a07850"; e.currentTarget.style.color = "#a07850"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd5c8"; e.currentTarget.style.color = "#a8968a"; }}
                    >
                      <span className="text-2xl">+</span>
                      <span>Ajouter</span>
                    </div>
                  </div>
                  <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "#a8968a" }}>
                    <span style={{ color: "#a07850" }}>📸</span>
                    {images.length} photo{images.length > 1 ? "s" : ""} ajoutée{images.length > 1 ? "s" : ""}
                  </p>
                </>
              )}

              <div className="mt-4 pt-4 grid grid-cols-2 gap-2" style={{ borderTop: "1px solid #ede5db" }}>
                {["Lumière naturelle","Résolution 1200px+","Plusieurs angles","Salle de bain incluse"].map(t => (
                  <p key={t} className="text-xs flex items-center gap-1.5" style={{ color: "#a8968a" }}>
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={
                      amenities.includes(a.label)
                        ? { background: "#f0e6db", border: "1px solid #a07850", color: "#7c5a38" }
                        : { background: "#fff",    border: "1px solid #ddd5c8", color: "#a8968a" }
                    }
                    onMouseEnter={e => { if (!amenities.includes(a.label)) { e.currentTarget.style.borderColor = "#a07850"; e.currentTarget.style.color = "#a07850"; } }}
                    onMouseLeave={e => { if (!amenities.includes(a.label)) { e.currentTarget.style.borderColor = "#ddd5c8"; e.currentTarget.style.color = "#a8968a"; } }}
                  >
                    <span>{a.icon}</span>{a.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: "1px solid #ede5db" }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#a8968a" }}>Tags personnalisés</p>
                <div className="flex gap-2">
                  <WarmInput
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="Ajouter un tag... (Entrée)"
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 rounded-lg text-white text-sm font-medium flex-shrink-0 hover:opacity-90 transition-opacity"
                    style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)" }}
                  >+</button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "#f0e6db", color: "#7c5a38" }}>
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
                  <WarmInput value={form.checkin} onChange={e => set("checkin", e.target.value)} />
                </Field>
                <Field label="Check-out">
                  <WarmInput value={form.checkout} onChange={e => set("checkout", e.target.value)} />
                </Field>
                <Field label="Animaux">
                  <WarmSelect value={form.pets} onChange={e => set("pets", e.target.value)}>
                    {["Non autorisés","Petits animaux","Autorisés"].map(o => <option key={o}>{o}</option>)}
                  </WarmSelect>
                </Field>
                <Field label="Fumeurs">
                  <WarmSelect value={form.smoking} onChange={e => set("smoking", e.target.value)}>
                    {["Non-fumeur","Fumeurs autorisés"].map(o => <option key={o}>{o}</option>)}
                  </WarmSelect>
                </Field>
                <div className="col-span-2">
                  <Field label="Notes internes (personnel)">
                    <WarmTextarea rows={2} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Instructions spéciales pour le personnel..." />
                  </Field>
                </div>
              </div>
            </Card>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex flex-col gap-5">

            {/* Progression */}
            <Card icon="📊" title="Progression" subtitle="Complétez tous les champs">
              <div className="flex justify-between text-xs mb-1.5" style={{ color: "#a8968a" }}>
                <span>Complété</span>
                <span className="font-semibold" style={{ color: "#a07850" }}>{progPct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: "#ede5db" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progPct}%`, background: "linear-gradient(90deg,#a07850,#7c5a38)" }}
                />
              </div>
              <p className="text-xs" style={{ color: "#a8968a" }}>Ajoutez des photos pour maximiser vos réservations.</p>
            </Card>

            {/* Tarification */}
            <Card icon="💶" title="Tarification" subtitle="Prix affiché aux clients">
              <div className="flex flex-col gap-3">
                <Field label="Prix / nuit (semaine)">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#a8968a" }}>€</span>
                    <WarmInput className="pl-7" type="number" value={form.priceWeek} onChange={e => set("priceWeek", e.target.value)} placeholder="0" min="0" />
                  </div>
                </Field>
                <Field label="Prix / nuit (week-end)">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#a8968a" }}>€</span>
                    <WarmInput className="pl-7" type="number" value={form.priceWE} onChange={e => set("priceWE", e.target.value)} placeholder="0" min="0" />
                  </div>
                </Field>
                <Field label="Remise longue durée (%)">
                  <WarmInput type="number" value={form.discount} onChange={e => set("discount", e.target.value)} placeholder="0" min="0" max="100" />
                </Field>
              </div>
              <div className="mt-4 rounded-xl p-4" style={{ background: "#faf7f4", border: "1px solid #ede5db" }}>
                {[
                  ["Nuit standard", p1 ? `${p1.toLocaleString("fr-FR")} €` : "— €", false],
                  ["Nuit week-end", p2 ? `${p2.toLocaleString("fr-FR")} €` : "— €", false],
                  ["Séjour 7 nuits", week7 ? `${week7.toLocaleString("fr-FR")} €` : "— €", true],
                ].map(([label, value, highlight], i) => (
                  <div key={i}>
                    {i === 2 && <div className="h-px my-2" style={{ background: "#ede5db" }} />}
                    <div className="flex justify-between items-center py-1 text-sm">
                      <span style={{ color: "#a8968a" }}>{label}</span>
                      <span className="font-semibold" style={{ color: highlight ? "#a07850" : "#2c1a0e" }}>{value}</span>
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
                    className="p-3 rounded-xl text-center transition-all"
                    style={{
                      background: status === key ? cfg.bg : "#fff",
                      border: status === key ? `2px solid ${cfg.border}` : "2px solid #ede5db",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center text-base"
                      style={{ background: status === key ? cfg.iconBg : "#faf7f4" }}
                    >
                      {cfg.icon}
                    </div>
                    <p className="text-xs font-semibold" style={{ color: "#2c1a0e" }}>{cfg.label}</p>
                    <p className="text-xs mt-0.5 leading-tight" style={{ color: "#a8968a" }}>{cfg.sub}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Lit & config */}
            <Card icon="🛏️" title="Lit & configuration" subtitle="Type de couchage proposé">
              <div className="flex flex-col gap-3">
                <Field label="Type de lit">
                  <WarmSelect value={form.bedType} onChange={e => set("bedType", e.target.value)}>
                    {["Lit double (140×190)","Grand lit (160×200)","Très grand lit (180×200)","Lits jumeaux","Canapé-lit"].map(o => <option key={o}>{o}</option>)}
                  </WarmSelect>
                </Field>
                <Field label="Nombre de lits">
                  <WarmInput type="number" value={form.beds} onChange={e => set("beds", e.target.value)} min="1" max="6" />
                </Field>
                <Field label="Salle de bain">
                  <WarmSelect value={form.bathroom} onChange={e => set("bathroom", e.target.value)}>
                    {["Privée","Partagée","Suite bain"].map(o => <option key={o}>{o}</option>)}
                  </WarmSelect>
                </Field>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => confirm("Annuler ?") && alert("Annulé")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors bg-white hover:opacity-80"
                style={{ border: "1px solid #ddd5c8", color: "#7c5a38" }}
              >
                ✕ Annuler
              </button>
              <button
                onClick={publish}
                className="flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#a07850,#7c5a38)" }}
              >
                {isEdit ? "✏️ Modifier la chambre" : "✚ Ajouter la chambre"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}