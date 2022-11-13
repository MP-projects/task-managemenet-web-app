import React from "react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useLoginAnonymous } from "../hooks/useLoginAnonymous";
import { useValidate } from "../hooks/useValidate";

//styles
import "./Login.css";
import { useEffect } from "react";

//assets

export default function Login() {
  const { validate } = useValidate();

  const inputEmail = useRef();
  const inputPassword = useRef();

  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const [isError, setIsError] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");

  const [remember, setRemember] = useState(false);

  const { loginAnonymous } = useLoginAnonymous(remember);
  const { login } = useLogin(remember);

  const handleClearError = () => {
    setErrorEmail("");
    setErrorPassword("");
    setIsError(false);
    setDisplayMessage("");
  };

  const validation = () => {
    const validateEmail = validate("email", email);
    if (validateEmail) {
      setErrorEmail(validateEmail);

      return validateEmail;
    }
    const validatePassword = validate("password", password);
    if (validatePassword) {
      setErrorPassword(validatePassword);

      return validatePassword;
    }
  };

  const handleGuestLogin = async () => {
    try {
      const errorLog = await loginAnonymous();
      if (errorLog) {
        throw Error("Couldn't login as guest");
      }
    } catch (error) {
      setDisplayMessage(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorText = validation();
    if (errorText) {
      setDisplayMessage(errorText);
      return;
    }

    try {
      const errorLog = await login(email, password);
      if (errorLog) {
        throw Error("Invalid email or password");
      }
    } catch (error) {
      setIsError(true);
      setDisplayMessage(error.message);
    }
  };

  useEffect(() => {
    if (errorEmail || errorPassword) {
      setIsError(true);
    }
  }, [errorEmail, errorPassword]);

  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleSubmit}>
        <div className="auth__form-logo-wrapper">
          <h2 className="auth__form-logo-h2">Sign In</h2>
        </div>
        <div className="auth__form-wrapper">
          <div className="auth__form-input-wrapper">
            <input
              ref={inputEmail}
              type="text"
              className={`auth__form-input ${
                email && "auth__form-input--content"
              } ${errorEmail ? "auth__form-input--error" : ""}`}
              onChange={(e) => {
                setEmail(e.target.value);
                handleClearError();
              }}
              value={email}
            />
            <span
              onClick={() => inputEmail.current.focus()}
              onMouseEnter={() =>
                inputEmail.current.classList.add("auth__form-input--hover")
              }
              onMouseLeave={() =>
                inputEmail.current.classList.remove("auth__form-input--hover")
              }
              className={`auth__form-input-span ${
                email && "auth__form-input-span--content"
              }`}>
              Email adress*
            </span>
          </div>
          <div className="auth__form-input-wrapper">
            <input
              ref={inputPassword}
              type="password"
              className={`auth__form-input ${
                password && "auth__form-input--content"
              } ${errorPassword ? "auth__form-input--error" : ""}`}
              onChange={(e) => {
                setPassword(e.target.value);
                handleClearError();
              }}
              value={password}
            />
            <span
              onClick={() => inputPassword.current.focus()}
              onMouseEnter={() =>
                inputPassword.current.classList.add("auth__form-input--hover")
              }
              onMouseLeave={() =>
                inputPassword.current.classList.remove(
                  "auth__form-input--hover"
                )
              }
              className={`auth__form-input-span ${
                password && "auth__form-input-span--content"
              }`}>
              Password*
            </span>
          </div>
          <p className="auth__message">{displayMessage}</p>
          <label className="auth__form-input-checkbox-label">
            <input
              type="checkbox"
              className="auth__form-input-checkbox"
              onChange={() => setRemember(true)}
            />
            <span className="auth__form-input-checkbox-span">Remember me</span>
          </label>
        </div>
        <div className="auth__form-wrapper">
          <button
            disabled={isError}
            className={`auth__form-submit ${
              isError ? "auth__form-submit--disabled" : ""
            }`}>
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
            <Link
              to="/register"
              className="auth__form-link auth__form-link--signup">
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
          href={"https://github.com/MP-projects"}
          rel={"noreferrer"}
          target="_blank">
          Paweł Mączka{" "}
        </a>
        2022
      </footer>
    </div>
  );
}
