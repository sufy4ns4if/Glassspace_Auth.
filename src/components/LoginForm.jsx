import { useState } from "react";
import { supabase } from "../supabaseClient.js";
import { Eye, EyeOff, ArrowUpRight, Check, ArrowLeft } from "lucide-react";

export function LoginForm({ onSwitch, notice, setNotice, active })
{
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [forgotMode, setForgotMode] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const validEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  function openForgotMode() {
    setForgotMode(true);
    setErrors({});
    setNotice(null);
  }

  function backToLogin() {
    setForgotMode(false);
    setErrors({});
    setNotice(null);
  }

  async function submit(event)
  {
    event.preventDefault();

    const next = {};

    if (!validEmail(email)) {
      next.email = "Enter a valid email address.";
    }

    if (password.length < 7) {
      next.password = "Password must be at least 7 characters.";
    }

    setErrors(next);
    setNotice(null);

    if (Object.keys(next).length) return;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      const name = data.user.user_metadata?.full_name || "there";

      setNotice({
        type: "success",
        text: `Welcome back, ${name}! You're signed in.`,
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: error.message || "Unable to sign in. Please try again.",
      });
    }
  }

  async function sendResetEmail(event)
  {
    event.preventDefault();

    const next = {};

    if (!validEmail(email)) {
      next.email = "Enter a valid email address.";
    }

    setErrors(next);
    setNotice(null);

    if (Object.keys(next).length) return;

    setSendingReset(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: window.location.origin,
        }
      );

      if (error) throw error;

      setNotice({
        type: "success",
        text: "If an account exists for this email, you should receive a password reset link. Please check your inbox.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: error.message || "Could not send the reset email. Please try again.",
      });
    } finally {
      setSendingReset(false);
    }
  }

  return (
    <div className="form-content">
      <div className="form-heading">
        <h2>
          {forgotMode ? (
            <>Reset <span>password.</span></>
          ) : (
            <>Login</>
          )}
        </h2>

        <p>
          {forgotMode
            ? "We'll send you a link to reset your password."
            : "Pick up right where you left off."}
        </p>
      </div>

      {forgotMode ? (
        <form onSubmit={sendResetEmail} noValidate>
          <label className="field-label" htmlFor="reset-email">
            Email address
          </label>

          <input
            id="reset-email"
            className={`field ${errors.email ? "field-error" : ""}`}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((old) => ({ ...old, email: "" }));
              setNotice(null);
            }}
            disabled={!active || sendingReset}
          />

          {errors.email && (
            <p className="field-error-text">{errors.email}</p>
          )}

          {notice && (
            <p className={`notice ${notice.type}`} role="status">
              {notice.text}
            </p>
          )}

          <button
            className="submit-button"
            type="submit"
            disabled={!active || sendingReset}
          >
            {sendingReset ? "Sending link..." : "Send reset link"}
            {!sendingReset && <ArrowUpRight size={17} />}
          </button>

          <div className="switch-line-signup">
            <button
              type="button"
              className="switch-button"
              onClick={backToLogin}
              disabled={!active || sendingReset}
            >
              <ArrowLeft size={13} /> Back to login
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={submit} noValidate>
          <label className="field-label" htmlFor="login-email">
            Email address
          </label>

          <input
            id="login-email"
            className={`field ${errors.email ? "field-error" : ""}`}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((old) => ({ ...old, email: "" }));
            }}
            disabled={!active}
          />

          {errors.email && (
            <p className="field-error-text">{errors.email}</p>
          )}

          <div className="label-row">
            <label className="field-label" htmlFor="login-password">
              Password
            </label>

            <button
              className="text-action tiny-action"
              type="button"
              onClick={openForgotMode}
              disabled={!active}
            >
              Forgot?
            </button>
          </div>

          <div
            className={`password-wrap ${
              errors.password ? "field-error" : ""
            }`}
          >
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="At least 7 characters"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((old) => ({ ...old, password: "" }));
              }}
              disabled={!active}
            />

            <button
              className="eye-button"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
              disabled={!active}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {errors.password && (
            <p className="field-error-text">{errors.password}</p>
          )}

          <label className="remember-row">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              disabled={!active}
            />
            <span className="custom-check">
              <Check size={12} />
            </span>
            <span>Keep me signed in</span>
          </label>

          {notice && (
            <p className={`notice ${notice.type}`} role="status">
              {notice.text}
            </p>
          )}

          <button
            className="submit-button"
            type="submit"
            disabled={!active}
          >
            Sign in <ArrowUpRight size={17} />
          </button>

          <div className="switch-line-login">
            <span>New around here?</span>
            <button
              type="button"
              onClick={onSwitch}
              className="switch-button"
              disabled={!active}
            >
              Create account <span>↗</span>
            </button>
          </div>
        </form>
      )}

      <p className="secure-note">
        <span className="secure-dot" />
        YOUR DETAILS STAY ON THIS DEVICE
      </p>
    </div>
  );
}