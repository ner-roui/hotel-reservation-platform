import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

/* ── Types ──────────────────────────────────────────── */
const TOAST_TYPES = {
  error: {
    bg:     "#fff1f0",
    border: "#fca5a5",
    icon:   "✕",
    iconBg: "#fee2e2",
    iconColor: "#dc2626",
    titleColor: "#991b1b",
    textColor:  "#b91c1c",
  },
  success: {
    bg:     "#f0fdf4",
    border: "#86efac",
    icon:   "✓",
    iconBg: "#dcfce7",
    iconColor: "#16a34a",
    titleColor: "#14532d",
    textColor:  "#15803d",
  },
  warning: {
    bg:     "#fffbeb",
    border: "#fcd34d",
    icon:   "⚠",
    iconBg: "#fef3c7",
    iconColor: "#d97706",
    titleColor: "#78350f",
    textColor:  "#b45309",
  },
  info: {
    bg:     "#faf7f4",
    border: "#ddd5c8",
    icon:   "ℹ",
    iconBg: "#f5ede4",
    iconColor: "#a07850",
    titleColor: "#3d2614",
    textColor:  "#7c5a38",
  },
};

/* ── Single Toast ───────────────────────────────────── */
function Toast({ id, type = "error", title, message, duration = 4000, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const cfg = TOAST_TYPES[type] || TOAST_TYPES.error;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => dismiss(), duration);
    return () => clearTimeout(t);
  }, []);

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onRemove(id), 320);
  }, [id, onRemove]);

  return (
    <div
      onClick={dismiss}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "14px 16px",
        borderRadius: 14,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        boxShadow: "0 8px 24px rgba(60,30,10,.12), 0 2px 8px rgba(60,30,10,.06)",
        cursor: "pointer",
        userSelect: "none",
        maxWidth: 380,
        width: "100%",
        opacity: visible && !leaving ? 1 : 0,
        transform: visible && !leaving ? "translateY(0) scale(1)" : "translateY(-12px) scale(0.97)",
        transition: "opacity .28s ease, transform .28s ease",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Icon */}
      <div style={{
        width: 32, height: 32,
        borderRadius: 8,
        background: cfg.iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        fontSize: 14,
        color: cfg.iconColor,
        fontWeight: 700,
      }}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: cfg.titleColor, lineHeight: 1.3 }}>
            {title}
          </p>
        )}
        {message && (
          <p style={{ margin: 0, fontSize: 13, color: cfg.textColor, lineHeight: 1.5 }}>
            {message}
          </p>
        )}
      </div>

      {/* Close */}
      <div style={{
        width: 20, height: 20,
        borderRadius: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        fontSize: 12,
        color: cfg.textColor,
        opacity: 0.5,
        marginTop: 1,
      }}>✕</div>

      {/* Progress bar */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0,
        height: 2,
        borderRadius: "0 0 14px 14px",
        background: cfg.border,
        animation: `toast-progress ${duration}ms linear forwards`,
      }} />
    </div>
  );
}

/* ── Container ──────────────────────────────────────── */
function ToastContainer({ toasts, removeToast }) {
  return createPortal(
    <div style={{
      position: "fixed",
      top: 24, right: 24,
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      alignItems: "flex-end",
      pointerEvents: "none",
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: "auto" }}>
          <Toast {...t} onRemove={removeToast} />
        </div>
      ))}
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>,
    document.body
  );
}

/* ── Hook ───────────────────────────────────────────── */
let _addToast = null;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((opts) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, ...opts }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    error:   (message, title = "Erreur")     => addToast({ type: "error",   title, message }),
    success: (message, title = "Succès")     => addToast({ type: "success", title, message }),
    warning: (message, title = "Attention")  => addToast({ type: "warning", title, message }),
    info:    (message, title = "Info")       => addToast({ type: "info",    title, message }),
  };

  const Portal = () => <ToastContainer toasts={toasts} removeToast={removeToast} />;

  return { toast, ToastPortal: Portal };
}