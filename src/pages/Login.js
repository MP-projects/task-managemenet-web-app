import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import firebase from "firebase";
import { projectAuth } from "../firebase/config";
import { useLoginAnonymous } from "../hooks/useLoginAnonymous";

//styles
import "./Login.css";


//assets


export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false)
  const {loginAnonymous} = useLoginAnonymous(remember)
  const { login } = useLogin(remember);

  const handleGuestLogin = () => {

    loginAnonymous()
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };



  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleSubmit}>
        <div className="auth__form-logo-wrapper">
          <h2 className="auth__form-logo-h2">Sign In</h2>
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
          <label className="auth__form-input-checkbox-label">
            <input type="checkbox" className="auth__form-input-checkbox" onChange={()=>setRemember(true)}/>
            <span className="auth__form-input-checkbox-span">Remember me</span>
          </label>
        </div>
        <div className="auth__form-wrapper">
          <button className="auth__form-submit">
            <p className="auth__form-submit-p">SIGN IN</p>
          </button>
          <p className="auth__form-p">OR</p>
          <button
            type="button"
            className="auth__form-submit"
            onClick={handleGuestLogin}>
            <p className="auth__form-submit-p">START AS GUEST</p>
          </button>
          <div className="auth__form-buttons-wrapper">
            <Link to="/" className="auth__form-link">
              <p className="auth__form-link-p">Forgot password?</p>
            </Link>
            <Link to="/register" className="auth__form-link auth__form-link--signup">
              <p className="auth__form-link-p">
                Don't have an account? Sign up
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
