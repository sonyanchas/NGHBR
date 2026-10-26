import React, { useEffect, useState } from "react";
import { Search, X, Info, MapPin, CreditCard, ListChecks } from "lucide-react";
import Navbar from './Navbar';
import "./Homepage.css";

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

// Placeholder task data — swap for real taskers later.
// Each tasker now carries a `category` that matches a TASK_CATEGORIES value,
// which is what the search actually filters on.
const TASKERS = [
  {
    id: 1,
    name: "Wanjiru M.",
    task: "House Cleaning",
    category: "cleaning",
    rate: "KSh 1,200 / visit",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Otieno K.",
    task: "Plumbing Repairs",
    category: "handyman",
    rate: "KSh 1,800 / job",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Achieng B.",
    task: "Furniture Assembly",
    category: "furniture-assembly",
    rate: "KSh 1,500 / job",
    rating: 5.0,
  },
  {
    id: 4,
    name: "Njoroge P.",
    task: "Move & Delivery",
    category: "moving",
    rate: "KSh 2,000 / job",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Mumbi C.",
    task: "Garden Tidy-Up",
    category: "gardening",
    rate: "KSh 1,000 / visit",
    rating: 4.9,
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Choose a Neighbor",
    detail: "By skills, price, and availability",
  },
  {
    step: 2,
    title: "Schedule your task",
    detail: "Pick a time that works for you",
  },
  {
    step: 3,
    title: "Pay and tip",
    detail: "Securely, effortlessly, and efficiently",
  },
];

const HOME_FEATURES = [
  {
    title: "Find help nearby",
    detail: "Compare local neighbors by skills, price, and availability.",
    icon: MapPin,
    iconColor: "#334155",
    iconBackground: "#e9eaf0",
  },
  {
    title: "Pay by card or M-Pesa",
    detail: "Choose your payment method on the next screen.",
    icon: CreditCard,
    iconColor: "#37a9e8",
    iconBackground: "#e7f4fc",
  },
  {
    title: "Know the price upfront",
    detail: "Review a neighbor's task rate before you book.",
    icon: ListChecks,
    iconColor: "#18354a",
    iconBackground: "#d9f1f3",
  },
];

export default function Homepage({ onOpenAuth, onBecomeNeighbor }) {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTasker, setSelectedTasker] = useState(null);
  const [authView, setAuthView] = useState(null); // 'signup' | 'login' | null
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAuthPrompt(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  // Only the Stars whose category matches what was picked in the bubble bar.
  const filteredTaskers = query
    ? TASKERS.filter((t) => t.category === query)
    : [];

  const openTasker = (tasker) => {
    setSelectedTasker(tasker);
    setAuthView(null);
  };

  const closeModal = () => {
    setSelectedTasker(null);
    setAuthView(null);
    setShowAuthPrompt(false);
  };

  const handleAuthChoice = (mode) => {
    closeModal();
    if (onOpenAuth) {
      onOpenAuth(mode);
      return;
    }
    setAuthView(mode);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(Boolean(query));
  };

  return (
    <div className="homepage-page" style={styles.page}>
      <Navbar publicMode onOpenAuth={onOpenAuth} onBecomeNeighbor={onBecomeNeighbor} />

      {/* Bubble bar — hero search */}
      <section className="homepage-hero" style={styles.hero}>
        <h1 style={styles.headline}>Rest easy, while we do the work</h1>
        <p style={styles.subhead}>What service can we help you with?</p>

        <form style={styles.bubbleBar} onSubmit={handleSearch} role="search">
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
            <Search size={20} strokeWidth={2.5} color="var(--color-paper)" />
          </button>
        </form>
      </section>

      {hasSearched && (
        <section className="homepage-helper" style={styles.helperSection}>
          <h2 style={styles.sectionTitle}>Choose a Neighbor</h2>

          {filteredTaskers.length === 0 ? (
            <p style={styles.emptyState}>
              No neighbors available for that category yet — check back soon.
            </p>
          ) : (
            <div style={styles.taskerList}>
              {filteredTaskers.map((t) => (
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
                    <Info size={16} color="var(--color-muted)" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* How it works */}
      <section className="homepage-how" style={styles.howSection}>
        <h2
          className="homepage-section-title"
          style={{ ...styles.sectionTitle, textAlign: "center", width: "100%", margin: 0 }}
        >
          How it works
        </h2>
        <div className="homepage-steps" style={styles.stepsList}>
          {HOW_IT_WORKS.map((s) => (
            <div key={s.step} style={styles.stepRow}>
              <div style={styles.stepNumber}>{s.step}</div>
              <div>
                <div style={styles.stepTitle}>{s.title}</div>
                <div style={styles.stepDetail}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="homepage-features" style={styles.featuresCard}>
          {HOME_FEATURES.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <div key={feature.title} style={styles.featureRow}>
                <div
                  style={{
                    ...styles.featureIcon,
                    background: feature.iconBackground,
                  }}
                >
                  <FeatureIcon
                    size={28}
                    strokeWidth={2}
                    color={feature.iconColor}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <div style={styles.featureTitle}>{feature.title}</div>
                  <div style={styles.featureDetail}>{feature.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer / contact */}
      <footer className="homepage-footer" style={styles.footer}>
        <p style={styles.footerText}>
          If you have any questions, <a href="mailto:hello@taskboy.co.ke" style={styles.footerLink}>contact us</a>.
        </p>
      </footer>

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
              <AuthForm mode="signup" onBack={() => setAuthView(null)} />
            )}

            {authView === "login" && (
              <AuthForm mode="login" onBack={() => setAuthView(null)} />
            )}
          </div>
        </div>
      )}

      {showAuthPrompt && !selectedTasker && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={closeModal} aria-label="Close">
              <X size={18} />
            </button>
            <h3 style={styles.modalTitle}>Make your life easier.</h3>
            <p style={styles.modalSub}>Sign in or create an account to get started.</p>
            <button style={styles.primaryBtn} onClick={() => handleAuthChoice("signup")}>
              Sign up
            </button>
            <div style={styles.orDivider}>
              <span style={styles.orLine} />
              <span style={styles.orText}>or</span>
              <span style={styles.orLine} />
            </div>
            <button style={styles.secondaryBtn} onClick={() => handleAuthChoice("login")}>
              Sign in
            </button>
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

const styles = {
  page: {
    background: "var(--color-background)",
    color: "var(--color-ink)",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  hero: {
    textAlign: "center",
  },
  headline: {
    fontSize: "clamp(28px, 5vw, 40px)",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
    margin: "0 0 10px",
    color: "var(--color-ink)",
  },
  subhead: {
    fontSize: 16,
    color: "var(--color-muted)",
    margin: "0 0 28px",
  },
  bubbleBar: {
    display: "flex",
    alignItems: "center",
    background: "var(--color-paper)",
    border: "2px solid var(--color-clay)",
    borderRadius: 999,
    padding: "6px 6px 6px 22px",
    boxShadow: "0 2px 10px rgba(141,101,82,0.12)",
  },
  bubbleInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 17,
    padding: "12px 8px",
    color: "var(--color-ink)",
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
    border: "2px solid var(--color-terracotta)",
    background: "var(--color-terracotta)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  howSection: {
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    margin: "0 0 18px",
    color: "var(--color-ink)",
  },
  stepsList: {
    textAlign: "left",
  },
  stepRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "14px 18px",
    border: "1.5px solid var(--color-border)",
    borderRadius: 14,
    background: "var(--color-surface)",
  },
  stepNumber: {
    width: 28,
    height: 28,
    minWidth: 28,
    borderRadius: "50%",
    background: "var(--color-clay)",
    color: "var(--color-paper)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
  },
  stepTitle: {
    fontWeight: 600,
    fontSize: 15,
    color: "var(--color-ink)",
  },
  stepDetail: {
    fontSize: 13,
    color: "var(--color-muted)",
    marginTop: 2,
  },
  featuresCard: {
    border: "1px solid #d7dce4",
    borderRadius: 28,
    background: "var(--color-paper)",
    boxShadow: "0 8px 24px rgba(40, 55, 75, 0.08)",
    textAlign: "left",
  },
  featureRow: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    minWidth: 0,
  },
  featureIcon: {
    width: 64,
    height: 64,
    minWidth: 64,
    borderRadius: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: 18,
    lineHeight: 1.3,
    fontWeight: 650,
    letterSpacing: "-0.02em",
    color: "var(--color-ink)",
  },
  featureDetail: {
    marginTop: 5,
    fontSize: 15,
    lineHeight: 1.55,
    color: "var(--color-muted)",
  },
  helperSection: {
    margin: "56px auto 0",
  },
  emptyState: {
    fontSize: 14,
    color: "var(--color-muted)",
    textAlign: "center",
    padding: "20px 0",
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
    border: "1.5px solid var(--color-border)",
    borderRadius: 14,
    background: "var(--color-surface)",
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
    background: "var(--color-clay)",
    color: "var(--color-paper)",
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
    color: "var(--color-ink)",
  },
  taskerTask: {
    fontSize: 13,
    color: "var(--color-muted)",
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
    color: "var(--color-ink)",
  },
  footer: {
    margin: "64px auto 0",
    textAlign: "center",
  },
  footerText: {
    fontSize: 13,
    color: "var(--color-muted)",
  },
  footerLink: {
    color: "var(--color-terracotta)",
    fontWeight: 600,
    textDecoration: "none",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(63,46,37,0.42)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 50,
  },
  modal: {
    position: "relative",
    background: "var(--color-paper)",
    borderRadius: 20,
    padding: "32px 28px",
    width: "100%",
    maxWidth: 380,
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(141,101,82,0.24)",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--color-muted)",
    padding: 4,
  },
  modalAvatar: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "var(--color-clay)",
    color: "var(--color-paper)",
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
    color: "var(--color-ink)",
  },
  modalSub: {
    fontSize: 14,
    color: "var(--color-muted)",
    margin: "0 0 24px",
  },
  primaryBtn: {
    width: "100%",
    padding: "13px 0",
    background: "var(--color-terracotta)",
    color: "var(--color-paper)",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryBtn: {
    width: "100%",
    padding: "13px 0",
    background: "var(--color-paper)",
    color: "var(--color-ink)",
    border: "1.5px solid var(--color-border)",
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
    background: "var(--color-border)",
  },
  orText: {
    fontSize: 12,
    color: "var(--color-muted)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 16,
  },
  formInput: {
    padding: "12px 14px",
    border: "1.5px solid var(--color-border)",
    borderRadius: 10,
    fontSize: 14,
    outline: "none",
  },
  backLink: {
    background: "none",
    border: "none",
    color: "var(--color-muted)",
    fontSize: 13,
    cursor: "pointer",
  },
};