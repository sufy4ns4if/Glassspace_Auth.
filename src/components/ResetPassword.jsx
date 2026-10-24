import { supabase } from "../supabaseClient.js";

import { useState } from "react";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";


export function ResetPassword({ onComplete, notice, setNotice }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);


  async function submit(event)
  {
    event.preventDefault();

    const nextErrors = {};
    if (password.length < 7) {
      nextErrors.password = "Use at least 7 characters.";
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Your passwords don't match.";
    }

    setErrors(nextErrors);
    setNotice(null);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setNotice({
        type: "success",
        text: "Your password has been updated successfully.",
      });
      onComplete();
    } catch (error) {
      setNotice({
        type: "error",
        text: error.message || "Couldn't update your password. Request a new reset link and try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="reset-card">
      <div className="card-kicker"><span>ACCOUNT RECOVERY</span></div>
      <div className="form-content">
        <div className="form-heading">
          <h2>Set new <span>password.</span></h2>
          <p>Choose a new password to secure your GlassSpace account.</p>
        </div>

        <form onSubmit={submit} noValidate>
          <label className="field-label" htmlFor="new-password">New password</label>
          <div className={`password-wrap ${errors.password ? "field-error" : ""}`}>
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 7 characters"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((old) => ({ ...old, password: "" }));
                setNotice(null);
              }}
              disabled={saving}
            />
            <button className="eye-button" type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)} disabled={saving}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && <p className="field-error-text">{errors.password}</p>}

          <label className="field-label spaced-label" htmlFor="confirm-new-password">Confirm new password</label>
          <div className={`password-wrap ${errors.confirmPassword ? "field-error" : ""}`}>
            <input
              id="confirm-new-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter it again"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setErrors((old) => ({ ...old, confirmPassword: "" }));
                setNotice(null);
              }}
              disabled={saving}
            />
            <button className="eye-button" type="button"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              onClick={() => setShowConfirmPassword((value) => !value)} disabled={saving}>
              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="field-error-text">{errors.confirmPassword}</p>}

          {notice && <p className={`notice ${notice.type}`} role="status">{notice.text}</p>}

          <button className="submit-button" type="submit" disabled={saving}>
            {saving ? "Updating password..." : "Update password"}
            {!saving && <ArrowUpRight size={17} />}
          </button>
        </form>
        <p className="secure-note"><span className="secure-dot" /> USE A PASSWORD YOU HAVEN'T USED BEFORE</p>
      </div>
    </div>
  );
}