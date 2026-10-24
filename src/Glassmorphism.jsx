import { useEffect, useState } from "react";
import { AuthCard } from "./components/AuthCard.jsx";
import { ResetPassword } from "./components/ResetPassword.jsx";
import { UserDashboard } from "./components/UserDashboard.jsx";
import { supabase } from "./supabaseClient.js";

function getInitialRecoveryState() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return hash.get("type") === "recovery";
}

export default function GlsSpc() {
  const [isSignup, setIsSignup] = useState(false);
  const [notice, setNotice] = useState(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(getInitialRecoveryState);

  useEffect(() => {
    let mounted = true;

    // Supabase emits PASSWORD_RECOVERY when a recovery link establishes its session.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!mounted) return;

      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
        setNotice(null);
      }

      setSession(currentSession);
      setAuthLoading(false);
    });

    // Expired/invalid links return error details in the URL hash.
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const authError = hashParams.get("error_description");
    if (authError) {
      setRecoveryMode(false);
      setNotice({
        type: "error",
        text: "This password reset link is invalid or has expired. Please request a new one.",
      });
      window.history.replaceState(
        null,
        document.title,
        `${window.location.pathname}${window.location.search}`
      );
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) console.error("Session error:", error.message);
      setSession(data?.session ?? null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  function switchForm() {
    setNotice(null);
    setIsSignup((current) => !current);
  }

  async function handleLogout() {
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      setNotice({
        type: "error",
        text: error.message || "Unable to sign out. Please try again.",
      });
    } else {
      setNotice(null);
      setIsSignup(false);
      setRecoveryMode(false);
    }

    setLoggingOut(false);
  }

  const user = session?.user;
  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <main className="scene">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#" aria-label="GlassSpace home">
          <span className="brand-mark">g.</span>
          <span>glass<span className="brand-light">space</span></span>
        </a>
        <span className="topbar-note">an idea of slh</span>
      </header>

      {authLoading ? (
        <section className="hero">
          <div className="hero-copy">
            <h1>One moment<br /><em>please.</em></h1>
            <p className="hero-description">Preparing your personal space...</p>
          </div>
        </section>
      ) : recoveryMode ? (
        <section className="hero">
          <div className="hero-copy">
            <h1>A fresh start,<br /><em>securely.</em></h1>
            <p className="hero-description">
              You're almost there. Choose a new password to get back into your GlassSpace account.
            </p>
            <div className="hero-foot">
              <span className="foot-line" />
              <span>One last step to make it yours.</span>
            </div>
          </div>
          <div className="auth-side">
            <ResetPassword
              notice={notice}
              setNotice={setNotice}
              onComplete={() => setRecoveryMode(false)}
            />
          </div>
        </section>
      ) : user ? (
        <UserDashboard
          user={user}
          displayName={displayName}
          notice={notice}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
      ) : (
        <section className="hero">
          <div className="hero-copy">
            <h1>Good to see<br />you <em>again.</em></h1>
            <p className="hero-description">
              A quieter corner of the internet. Sign in to pick up where you
              left off, or create an account and make yourself at home.
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
            <p className="below-card">
              By continuing, you agree to our <a href="#terms">Terms</a> and{" "}
              <a href="#privacy">Privacy Policy</a>.
            </p>
          </div>
        </section>
      )}

      <footer className="footer">
        <span>© 2026 GLASSSPACE</span>
        <span className="footer-center"><span className="status-dot" />ALL SYSTEMS LOOK GOOD</span>
        <span>MADE FOR THE MOMENT</span>
      </footer>
    </main>
  );
}
