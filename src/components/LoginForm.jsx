import { useState } from "react";
import { Eye, EyeOff, ArrowUpRight, Check } from "lucide-react";

export function LoginForm({ onSwitch, notice, setNotice, active })
{
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});

  function submit(event) {
    event.preventDefault();
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    setNotice(null);
    if (Object.keys(next).length) return;

    const saved = localStorage.getItem("glassspace-user");
    if (!saved) {
      setNotice({ type: "error", text: "No demo account found yet. Create one first." });
      return;
    }
    try {
      const user = JSON.parse(saved);
      if (email.trim().toLowerCase() === user.email && password === user.password) {
        setNotice({ type: "success", text: `Welcome back, ${user.name}. You're signed in!` });
      } else {
        setNotice({ type: "error", text: "Combination don't match." });
      }
    } catch {
      setNotice({ type: "error", text: "Couldn't read the demo account. Please register again." });
    }
  }

  return (
    <div className="form-content">
      <div className="form-heading">
        <h2>Login</h2>
        <p>Pick up right where you left off.</p>
      </div>
      <form onSubmit={submit} noValidate>
        <label className="field-label" htmlFor="login-email">Email address</label>
        <input id="login-email" className={`field ${errors.email ? "field-error" : ""}`} type="email"
          autoComplete="email" placeholder="you@example.com" value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((old) => ({ ...old, email: "" })); }}
          disabled={!active} />
        {errors.email && <p className="field-error-text">{errors.email}</p>}

        <div className="label-row">
          <label className="field-label" htmlFor="login-password">Password</label>
          <button className="text-action tiny-action" type="button" onClick={() => setNotice({ type: "info", text: "Password recovery is a demo placeholder for now." })} disabled={!active}>Forgot?</button>
        </div>
        <div className={`password-wrap ${errors.password ? "field-error" : ""}`}>
          <input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password"
            placeholder="At least 6 characters" value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((old) => ({ ...old, password: "" })); }}
            disabled={!active} />
          <button className="eye-button" type="button" aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)} disabled={!active}>
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {errors.password && <p className="field-error-text">{errors.password}</p>}

        <label className="remember-row">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} disabled={!active} />
          <span className="custom-check"><Check size={12} /></span>
          <span>Keep me signed in</span>
        </label>

        {notice && <p className={`notice ${notice.type}`} role="status">{notice.text}</p>}
        <button className="submit-button" type="submit" disabled={!active}>Sign in <ArrowUpRight size={17} /></button>
      </form>
      <div className="switch-line-login"><span>New around here?</span><button type="button" onClick={onSwitch} className="switch-button" disabled={!active}>Create account <span>↗</span></button></div>
      <p className="secure-note"><span className="secure-dot" /> YOUR DETAILS STAY ON THIS DEVICE</p>
    </div>
  );
}
