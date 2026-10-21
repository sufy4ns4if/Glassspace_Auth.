import { useState } from "react";
import { Eye, EyeOff, ArrowUpRight, Check } from "lucide-react";

export function RegisterForm({ onSwitch, notice, setNotice, active })
{
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(true);
  const [errors, setErrors] = useState({});

  function submit(event) {
    event.preventDefault();
    const next = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Use at least 6 characters.";
    if (!accepted) next.terms = "Please confirm the demo terms to continue.";
    setErrors(next);
    setNotice(null);
    if (Object.keys(next).length) return;

    const user = { name: name.trim(), email: email.trim().toLowerCase(), password };
    localStorage.setItem("glassspace-user", JSON.stringify(user));
    setNotice({ type: "success", text: "Account created! Flip back to login with your new details." });
  }

  return (
    <div className="form-content">
      <div className="form-heading">
        <h2>Sign up</h2>
        <p>A fresh start is one small step away.</p>
      </div>
      <form onSubmit={submit} noValidate>
        <label className="field-label" htmlFor="register-name">Your name</label>
        <input id="register-name" className={`field ${errors.name ? "field-error" : ""}`} type="text"
          autoComplete="name" placeholder="How should we call you?" value={name}
          onChange={(e) => { setName(e.target.value); setErrors((old) => ({ ...old, name: "" })); }} disabled={!active} />
        {errors.name && <p className="field-error-text">{errors.name}</p>}

        <label className="field-label spaced-label" htmlFor="register-email">Email address</label>
        <input id="register-email" className={`field ${errors.email ? "field-error" : ""}`} type="email"
          autoComplete="email" placeholder="you@example.com" value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((old) => ({ ...old, email: "" })); }} disabled={!active} />
        {errors.email && <p className="field-error-text">{errors.email}</p>}

        <label className="field-label spaced-label" htmlFor="register-password">Create password</label>
        <div className={`password-wrap ${errors.password ? "field-error" : ""}`}>
          <input id="register-password" type={showPassword ? "text" : "password"} autoComplete="new-password"
            placeholder="At least 6 characters" value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((old) => ({ ...old, password: "" })); }} disabled={!active} />
          <button className="eye-button" type="button" aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)} disabled={!active}>
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {errors.password && <p className="field-error-text">{errors.password}</p>}

        <label className="remember-row terms-row">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} disabled={!active} />
          <span className="custom-check"><Check size={12} /></span>
          <span>I agree to the demo terms and privacy policy.</span>
        </label>
        {errors.terms && <p className="field-error-text">{errors.terms}</p>}

        {notice && <p className={`notice ${notice.type}`} role="status">{notice.text}</p>}
        <button className="submit-button" type="submit" disabled={!active}>Create account <ArrowUpRight size={17} /></button>
      </form>
      <div className="switch-line-signup"><span>Already have an account?</span><button type="button" onClick={onSwitch} className="switch-button" disabled={!active}>Login <span>↗</span></button></div>
      <p className="secure-note"><span className="secure-dot" /> YOUR DETAILS STAY ON THIS DEVICE</p>
    </div>
  );
}