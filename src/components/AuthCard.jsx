import { LoginForm } from "./LoginForm.jsx";
import { RegisterForm } from "./SignupForm.jsx";

export function AuthCard({ isSignup, onSwitch, notice, setNotice })
{
  return (
    <div className={`flip-scene ${isSignup ? "is-flipped" : ""}`}>
      <div className="flip-card">
        <section className="glass-face glass-front" aria-hidden={isSignup}>
          <div className="card-kicker">
            <span>WELCOME BACK</span>
            {/* <span className="card-index">01 / 02</span> */}
          </div>
          <LoginForm onSwitch={onSwitch} notice={notice} setNotice={setNotice} active={!isSignup} />
        </section>
        <section className="glass-face glass-back" aria-hidden={!isSignup}>
          <div className="card-kicker">
            <span>MAKE IT YOURS</span>
            {/* <span className="card-index">02 / 02</span> */}
          </div>
          <RegisterForm onSwitch={onSwitch} notice={notice} setNotice={setNotice} active={isSignup} />
        </section>
      </div>
    </div>
  );
}
