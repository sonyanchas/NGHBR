import React, { useState } from "react";
import { Search, X, Info } from "lucide-react";

const TASK_CATEGORIES = [
  { value: "cleaning", label: "Cleaning" },
  { value: "moving", label: "Moving & Delivery" },
  { value: "handyman", label: "Handyman" },
  { value: "furniture-assembly", label: "Furniture Assembly" },
  { value: "gardening", label: "Gardening" },
  { value: "tutoring", label: "Tutoring" },
  { value: "errands", label: "Errands" },
  { value: "tech-help", label: "Tech Help" },
];

// Placeholder task data — swap for real taskers later
const TASKERS = [
  {
    id: 1,
    name: "Wanjiru M.",
    task: "House Cleaning",
    rate: "KSh 1,200 / visit",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Otieno K.",
    task: "Plumbing Repairs",
    rate: "KSh 800 / hr",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Achieng B.",
    task: "Furniture Assembly",
    rate: "KSh 1,500 / job",
    rating: 5.0,
  },
];

export default function Homepage({ onOpenAuth }) {
  const [query, setQuery] = useState("");
  const [selectedTasker, setSelectedTasker] = useState(null);
  const [authView, setAuthView] = useState(null); // 'signup' | 'login' | null

  const openTasker = (tasker) => {
    setSelectedTasker(tasker);
    setAuthView(null);
  };

  const closeModal = () => {
    setSelectedTasker(null);
    setAuthView(null);
  };

  const handleAuthChoice = (mode) => {
    closeModal();
    if (onOpenAuth) {
      onOpenAuth(mode);
      return;
    }
    setAuthView(mode);
  };

  return (
    <div style={styles.page}>
      {/* Bubble bar — hero search */}
      <section style={styles.hero}>
        <h1 style={styles.headline}>How can we make your life easier?</h1>

        <form
          style={styles.bubbleBar}
          onSubmit={(e) => e.preventDefault()}
          role="search"
        >
          <select
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.bubbleInput}
            aria-label="Choose a task"
          >
            <option value="">Choose a task</option>
            {TASK_CATEGORIES.map((task) => (
              <option key={task.value} value={task.value}>
                {task.label}
              </option>
            ))}
          </select>
          <button type="submit" style={styles.bubbleButton} aria-label="Search">
            <Search size={20} strokeWidth={2.5} color="#1a1a1a" />
          </button>
        </form>
      </section>

      {/* Choose a helper */}
      <section style={styles.helperSection}>
        <h2 style={styles.sectionTitle}>Choose a helper</h2>

        <div style={styles.taskerList}>
          {TASKERS.map((t) => (
            <button
              key={t.id}
              style={styles.taskerRow}
              onClick={() => openTasker(t)}
            >
              <div style={styles.taskerLeft}>
                <div style={styles.avatar}>{t.name.charAt(0)}</div>
                <div>
                  <div style={styles.taskerName}>{t.name}</div>
                  <div style={styles.taskerTask}>{t.task}</div>
                </div>
              </div>
              <div style={styles.taskerRight}>
                <span style={styles.taskerRate}>{t.rate}</span>
                <Info size={16} color="#8a8a8a" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Pop-up screen */}
      {selectedTasker && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={closeModal} aria-label="Close">
              <X size={18} />
            </button>

            {authView === null && (
              <>
                <div style={styles.modalAvatar}>{selectedTasker.name.charAt(0)}</div>
                <h3 style={styles.modalTitle}>Let us make your life easier.</h3>
                <p style={styles.modalSub}>
                  {selectedTasker.name} · {selectedTasker.task}
                </p>

                <button
                  style={styles.primaryBtn}
                  onClick={() => handleAuthChoice("signup")}
                >
                  Sign up
                </button>

                <div style={styles.orDivider}>
                  <span style={styles.orLine} />
                  <span style={styles.orText}>or</span>
                  <span style={styles.orLine} />
                </div>

                <button
                  style={styles.secondaryBtn}
                  onClick={() => handleAuthChoice("login")}
                >
                  Log in
                </button>
              </>
            )}

            {authView === "signup" && (
              <AuthForm
                mode="signup"
                onBack={() => setAuthView(null)}
              />
            )}

            {authView === "login" && (
              <AuthForm
                mode="login"
                onBack={() => setAuthView(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AuthForm({ mode, onBack }) {
  const isSignup = mode === "signup";
  return (
    <div>
      <h3 style={styles.modalTitle}>{isSignup ? "Create your account" : "Welcome back"}</h3>
      <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
        {isSignup && (
          <input style={styles.formInput} placeholder="Full name" type="text" />
        )}
        <input style={styles.formInput} placeholder="Email or phone" type="text" />
        <input style={styles.formInput} placeholder="Password" type="password" />
        <button type="submit" style={styles.primaryBtn}>
          {isSignup ? "Sign up" : "Log in"}
        </button>
      </form>
      <button style={styles.backLink} onClick={onBack}>
        ← Back
      </button>
    </div>
  );
}

const GOLD = "#D8A13A";
const INK = "#1a1a1a";

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "#ffffff",
    color: INK,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "0 20px 80px",
    boxSizing: "border-box",
  },
  hero: {
    maxWidth: 640,
    margin: "0 auto",
    paddingTop: 64,
    textAlign: "center",
  },
  headline: {
    fontSize: "clamp(28px, 5vw, 40px)",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
    margin: "0 0 32px",
    color: INK,
  },
  bubbleBar: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    border: `2px solid ${GOLD}`,
    borderRadius: 999,
    padding: "6px 6px 6px 22px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  bubbleInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 17,
    padding: "12px 8px",
    color: INK,
    background: "transparent",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    cursor: "pointer",
  },
  bubbleButton: {
    width: 44,
    height: 44,
    minWidth: 44,
    borderRadius: "50%",
    border: `2px solid ${GOLD}`,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  helperSection: {
    maxWidth: 640,
    margin: "56px auto 0",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    margin: "0 0 18px",
    color: INK,
  },
  taskerList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  taskerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "14px 18px",
    border: "1.5px solid #e4e4e4",
    borderRadius: 14,
    background: "#fff",
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color 0.15s ease",
  },
  taskerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: GOLD,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 16,
    flexShrink: 0,
  },
  taskerName: {
    fontWeight: 600,
    fontSize: 15,
    color: INK,
  },
  taskerTask: {
    fontSize: 13,
    color: "#8a8a8a",
    marginTop: 2,
  },
  taskerRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  taskerRate: {
    fontSize: 14,
    fontWeight: 600,
    color: INK,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 50,
  },
  modal: {
    position: "relative",
    background: "#fff",
    borderRadius: 20,
    padding: "32px 28px",
    width: "100%",
    maxWidth: 380,
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#8a8a8a",
    padding: 4,
  },
  modalAvatar: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: GOLD,
    color: "#fff",
    fontWeight: 700,
    fontSize: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 700,
    margin: "0 0 6px",
    color: INK,
  },
  modalSub: {
    fontSize: 14,
    color: "#8a8a8a",
    margin: "0 0 24px",
  },
  primaryBtn: {
    width: "100%",
    padding: "13px 0",
    background: GOLD,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryBtn: {
    width: "100%",
    padding: "13px 0",
    background: "#fff",
    color: INK,
    border: "1.5px solid #e4e4e4",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  orDivider: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "16px 0",
  },
  orLine: {
    flex: 1,
    height: 1,
    background: "#e4e4e4",
  },
  orText: {
    fontSize: 12,
    color: "#8a8a8a",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 16,
  },
  formInput: {
    padding: "12px 14px",
    border: "1.5px solid #e4e4e4",
    borderRadius: 10,
    fontSize: 14,
    outline: "none",
  },
  backLink: {
    background: "none",
    border: "none",
    color: "#8a8a8a",
    fontSize: 13,
    cursor: "pointer",
  },
};
