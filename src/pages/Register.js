import React, { useState } from "react";
import { useSignup } from "../hooks/useSignup.js";
import "./Register.css";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useFirestore } from "../hooks/useFirestore.js";
import { Link } from "react-router-dom";

//styles
import "./Login.css"

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [remember, setRemember] = useState(false)
  const { signup, isPending, error, isSuccess } = useSignup(remember);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, displayName);
  };

  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleSubmit}>
        <div className="auth__form-logo-wrapper">
          <h2 className="auth__form-logo-h2">Sign Up</h2>
        </div>
        <div className="auth__form-wrapper">
          <div className="auth__form-input-wrapper">
            <input
              type="email"
              className="auth__form-input"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <span
              className={`auth__form-input-span ${
                email && "auth__form-input--content"
              }`}>
              Email adress*
            </span>
          </div>
          <div className="auth__form-input-wrapper">
            <input
              type="password"
              className="auth__form-input"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span
              className={`auth__form-input-span ${
                password && "auth__form-input--content"
              }`}>
              Password*
            </span>
          </div>
          <div className="auth__form-input-wrapper">
            <input
              type="password"
              className="auth__form-input"
              onChange={(e) => setRepeatedPassword(e.target.value)}
              value={repeatedPassword}
            />
            <span
              className={`auth__form-input-span ${
                repeatedPassword && "auth__form-input--content"
              }`}>
              Repeat password*
            </span>
          </div>
          <div className="auth__form-input-wrapper">
            <input
              type="password"
              className="auth__form-input"
              onChange={(e) => setDisplayName(e.target.value)}
              value={displayName}
            />
            <span
              className={`auth__form-input-span ${
                displayName&& "auth__form-input--content"
              }`}>
              Display name
            </span>
          </div>
          <label className="auth__form-input-checkbox-label">
            <input type="checkbox" className="auth__form-input-checkbox" onChange={()=>setRemember(true)}/>
            <span className="auth__form-input-checkbox-span">Remember me</span>
          </label>
        </div>
        <div className="auth__form-wrapper">
          <button className="auth__form-submit">
            <p className="auth__form-submit-p">SIGN UP</p>
          </button>

          <div className="auth__form-buttons-wrapper">

            <Link to="/" className="auth__form-link auth__form-link--signup">
              <p className="auth__form-link-p">
                Already have an account? Sign in
              </p>
            </Link>
          </div>
        </div>
      </form>

      <footer className="copiright">
        Copyright ©{" "}
        <a
          className="copiright__link"
          href="https://github.com/MP-projects"
          target="_blank">
          Paweł Mączka{" "}
        </a>
        2022
      </footer>
    </div>
  );
}
