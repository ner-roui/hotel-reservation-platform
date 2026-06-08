// components/DateRangePicker.jsx
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const STYLES = `
  .lumiere-dp .react-datepicker-popper { z-index: 9999 !important; }
  .lumiere-dp .react-datepicker {
    font-family: 'DM Sans', sans-serif !important;
    border: 1px solid #ddd5c8 !important;
    border-radius: 16px !important;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(60,30,10,.2), 0 0 0 1px rgba(160,120,80,.12) !important;
    background: #fff !important;
  }
  .lumiere-dp .react-datepicker__header {
    background: #faf7f4 !important;
    border-bottom: 1px solid #ede5db !important;
    padding: 14px 0 10px !important;
  }
  .lumiere-dp .react-datepicker__current-month {
    color: #3d2614 !important;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    letter-spacing: 0.02em;
    margin-bottom: 6px !important;
  }
  .lumiere-dp .react-datepicker__day-name {
    color: #a07850 !important;
    font-size: 10px !important;
    font-weight: 700 !important;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    width: 2.2rem !important;
  }
  .lumiere-dp .react-datepicker__day {
    color: #1c1917 !important;
    border-radius: 8px !important;
    font-size: 13px !important;
    width: 2.2rem !important;
    line-height: 2.2rem !important;
    transition: background .15s, color .15s !important;
    margin: 1px !important;
  }
  .lumiere-dp .react-datepicker__day:hover:not(.react-datepicker__day--excluded):not(.react-datepicker__day--disabled) {
    background: #f0e8e0 !important;
    color: #3d2614 !important;
    border-radius: 8px !important;
  }
  .lumiere-dp .react-datepicker__day--selected,
  .lumiere-dp .react-datepicker__day--range-start,
  .lumiere-dp .react-datepicker__day--range-end {
    background: linear-gradient(135deg,#a07850,#7c5a38) !important;
    color: #fff !important;
    font-weight: 700 !important;
    border-radius: 8px !important;
    box-shadow: 0 2px 10px rgba(160,120,80,.4) !important;
  }
  .lumiere-dp .react-datepicker__day--in-range {
    background: rgba(160,120,80,.1) !important;
    color: #7c5a38 !important;
    border-radius: 0 !important;
  }
  .lumiere-dp .react-datepicker__day--range-start { border-radius: 8px 0 0 8px !important; }
  .lumiere-dp .react-datepicker__day--range-end   { border-radius: 0 8px 8px 0 !important; }
  .lumiere-dp .react-datepicker__day--keyboard-selected {
    background: rgba(160,120,80,.15) !important;
    color: #3d2614 !important;
  }
  .lumiere-dp .react-datepicker__day--excluded,
  .lumiere-dp .react-datepicker__day--disabled {
    background: #f5eeeb !important;
    color: #cbb09f !important;
    text-decoration: line-through !important;
    cursor: not-allowed !important;
    border-radius: 6px !important;
    opacity: 0.65 !important;
  }
  .lumiere-dp .react-datepicker__day--excluded:hover,
  .lumiere-dp .react-datepicker__day--disabled:hover {
    background: #f5eeeb !important;
    color: #cbb09f !important;
  }
  .lumiere-dp .react-datepicker__navigation {
    top: 14px !important;
  }
  .lumiere-dp .react-datepicker__navigation-icon::before {
    border-color: #a07850 !important;
    border-width: 2px 2px 0 0 !important;
    width: 7px !important;
    height: 7px !important;
  }
  .lumiere-dp .react-datepicker__triangle { display: none !important; }
`;

function toDate(val) {
  if (!val) return null;
  if (val instanceof Date) return val;
  return new Date(val);
}

function fmt(date) {
  const d = toDate(date);
  if (!d) return "—";
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * DateRangePicker — composant partagé Lumière Hotels
 *
 * @param {Date|string} arrivee
 * @param {Date|string} depart
 * @param {Function}    onArriveeChange
 * @param {Function}    onDepartChange
 * @param {Array}       excludedIntervals  — [{ start: Date, end: Date }]
 * @param {"dark"|"light"} theme
 */
export default function DateRangePicker({
  arrivee,
  depart,
  onArriveeChange,
  onDepartChange,
  excludedIntervals = [],
  theme = "light",
}) {
  const [openArrivee, setOpenArrivee] = useState(false);
  const [openDepart,  setOpenDepart]  = useState(false);

  const isDark = theme === "dark";
  const today  = new Date();

  const handleArriveeChange = (date) => {
    onArriveeChange(date);
    const nextDay = new Date(date.getTime() + 86_400_000);
    if (!depart || toDate(depart) <= date) onDepartChange(nextDay);
    setOpenArrivee(false);
  };

  // ── Styles dynamiques selon thème ────────────────────────────
  const wrapStyle = {
    display:       "flex",
    alignItems:    "stretch",
    gap:           6,
    flex:          1,
  };

  const chipBase = {
    position:     "relative",
    display:      "flex",
    alignItems:   "center",
    gap:          10,
    flex:         1,
    minWidth:     140,
    padding:      "10px 16px",
    borderRadius: 12,
    cursor:       "pointer",
    transition:   "border-color .2s, background .2s",
    background:   isDark ? "rgba(255,255,255,.05)" : "#fff",
    border:       isDark ? "1px solid rgba(212,168,85,.2)" : "1px solid #ddd5c8",
  };

  const labelStyle = {
    fontSize:      9,
    fontWeight:    700,
    color:         isDark ? "rgba(212,168,85,.75)" : "#a07850",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    marginBottom:  3,
    display:       "block",
  };

  const valueStyle = {
    fontSize:   13,
    fontWeight: 600,
    color:      isDark ? "#f5ece0" : "#1c1917",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize:   14,
  };

  const iconStyle = {
    fontSize:  15,
    opacity:   0.65,
    flexShrink: 0,
  };

  const arrowStyle = {
    color:      isDark ? "rgba(212,168,85,.35)" : "#d5c9be",
    fontSize:   16,
    flexShrink: 0,
    alignSelf:  "center",
  };

  const hoverEnter = (e) => {
    e.currentTarget.style.borderColor = isDark ? "rgba(212,168,85,.55)" : "#a07850";
    e.currentTarget.style.background  = isDark ? "rgba(255,255,255,.08)" : "#faf7f4";
  };
  const hoverLeave = (e) => {
    e.currentTarget.style.borderColor = isDark ? "rgba(212,168,85,.2)" : "#ddd5c8";
    e.currentTarget.style.background  = isDark ? "rgba(255,255,255,.05)" : "#fff";
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="lumiere-dp" style={wrapStyle}>

        {/* ── ARRIVÉE ── */}
        <div
          style={chipBase}
          onClick={() => { setOpenArrivee(true); setOpenDepart(false); }}
          onMouseEnter={hoverEnter}
          onMouseLeave={hoverLeave}
        >
          <span style={iconStyle}>📅</span>
          <div>
            <span style={labelStyle}>Arrivée</span>
            <span style={valueStyle}>{fmt(arrivee)}</span>
          </div>
          <DatePicker
            selected={toDate(arrivee)}
            onChange={handleArriveeChange}
            open={openArrivee}
            minDate={today}
            excludeDateIntervals={excludedIntervals}
            onClickOutside={() => setOpenArrivee(false)}
            popperPlacement="bottom-start"
            popperModifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
            customInput={<div style={{ display: "none" }} />}
          />
        </div>

        <span style={arrowStyle}>→</span>

        {/* ── DÉPART ── */}
        <div
          style={chipBase}
          onClick={() => { setOpenDepart(true); setOpenArrivee(false); }}
          onMouseEnter={hoverEnter}
          onMouseLeave={hoverLeave}
        >
          <span style={iconStyle}>📅</span>
          <div>
            <span style={labelStyle}>Départ</span>
            <span style={valueStyle}>{fmt(depart)}</span>
          </div>
          <DatePicker
            selected={toDate(depart)}
            onChange={(date) => { onDepartChange(date); setOpenDepart(false); }}
            open={openDepart}
            minDate={toDate(arrivee)
              ? new Date(toDate(arrivee).getTime() + 86_400_000)
              : today}
            excludeDateIntervals={excludedIntervals}
            onClickOutside={() => setOpenDepart(false)}
            popperPlacement="bottom-start"
            popperModifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
            customInput={<div style={{ display: "none" }} />}
          />
        </div>

      </div>
    </>
  );
}