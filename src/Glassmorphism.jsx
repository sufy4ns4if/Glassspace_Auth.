import { useState } from "react";
import { AuthCard } from "./components/AuthCard.jsx";

export default function GlsSpc()
{
  const [isSignup, setIsSignup] = useState(false);
  const [notice, setNotice] = useState(null);

  function switchForm() {
    setNotice(null);
    setIsSignup((current) => !current);
  }

  return (
    <main className="scene">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="#" aria-label="Glass home">
          <span className="brand-mark">g.</span>
          <span>glass<span className="brand-light">space</span></span>
        </a>
        <span className="topbar-note">an idea of slh</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          {/* <span className="eyebrow"><span className="eyebrow-dot" /> YOUR SPACE, YOUR ACCOUNT</span> */}
          <h1>Good to see<br />you <em>again.</em></h1>
          <p className="hero-description">
            A quieter corner of the internet. Sign in to pick up where you left off,
            or create an account and make yourself at home.
          </p>
          <div className="hero-foot">
            <span className="foot-line" />
            <span>Designed to feel a little different.</span>
          </div>
        </div>

        <div className="auth-side">
          <AuthCard
            isSignup={isSignup}
            onSwitch={switchForm}
            notice={notice}
            setNotice={setNotice}
          />
          <p className="below-card">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
        </div>
      </section>

      <footer className="footer">
        <span>© 2026 GLASSSPACE</span>
        <span className="footer-center"><span className="status-dot" /> ALL SYSTEMS LOOK GOOD</span>
        <span>MADE FOR THE MOMENT</span>
      </footer>
    </main>
  );
}
