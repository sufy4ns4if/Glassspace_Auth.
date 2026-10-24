export function UserDashboard({ user, displayName, notice, onLogout, loggingOut }) {
  return (
    <section className="hero dashboard-hero">
      <div className="hero-copy">
        <h1>Welcome back,<br /><em>{displayName}.</em></h1>
        <p className="hero-description">
          You're signed in. Your little corner of the internet is ready whenever you are.
        </p>
        <div className="hero-foot">
          <span className="foot-line" />
          <span>Good to have you here.</span>
        </div>
      </div>

      <div className="auth-side">
        <div className="dashboard-card">
          <span className="dashboard-label">YOUR ACCOUNT</span>
          <div className="dashboard-avatar">{displayName.charAt(0).toUpperCase()}</div>
          <h2 className="dashboard-name">{displayName}</h2>
          <p className="dashboard-email">{user.email}</p>
          <div className="dashboard-divider" />

          <div className="dashboard-detail">
            <span>Account status</span>
            <span className="dashboard-status"><span className="status-dot" />Signed in</span>
          </div>
          <div className="dashboard-detail">
            <span>Email verified</span>
            <span>{user.email_confirmed_at ? "Verified" : "Pending"}</span>
          </div>

          {notice && <p className={`notice ${notice.type}`} role="status">{notice.text}</p>}

          <button type="button" className="dashboard-logout" onClick={onLogout} disabled={loggingOut}>
            {loggingOut ? "Signing out..." : "Sign out"}
          </button>
          <p className="dashboard-secure">YOUR ACCOUNT IS MANAGED BY SLH TEAM</p>
        </div>
      </div>
    </section>
  );
}
