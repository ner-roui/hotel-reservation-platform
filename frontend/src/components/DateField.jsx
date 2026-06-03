import { useState } from "react";

export default function DateField({ label, value, onChange, min }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex-1">
      <label
        className="block text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: "#7a6050", fontSize: 9, letterSpacing: ".14em" }}
      >
        {label}
      </label>
      <input
        type="date"
        value={value}
        min={min}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl py-3 px-4 text-sm transition-all duration-200 focus:outline-none"
        style={{
          background: focused ? "rgba(160,120,80,.06)" : "#faf7f4",
          border: focused ? "1.5px solid #a07850" : "1.5px solid #ddd5c8",
          color: "#1c1917",
          boxShadow: focused ? "0 0 0 3px rgba(160,120,80,.1)" : "none",
          colorScheme: "light",
          fontFamily: "'DM Sans', sans-serif",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}