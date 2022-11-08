import React, { useState, useRef, useEffect } from "react";
import { useSignup } from "../hooks/useSignup.js";
import "./Register.css";
import { Link } from "react-router-dom";
import { useValidate } from "../hooks/useValidate.js";

//styles
import "./Login.css";

export default function Register() {
  const inputEmail = useRef();
  const inputPassword = useRef();
  const inputRepeatedPassword = useRef();
  const inputDisplayName = useRef();

  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [errorRepeatedPassword, setErrorRepeatedPassword] = useState("");

  const [errorDisplayName, setErrorDisplayName] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [isError, setIsError] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");

  const [remember, setRemember] = useState(false);

  const { signup} = useSignup(remember);
  const { validate } = useValidate();

  const handleClearError = () => {
    setErrorEmail("");
    setErrorPassword("");
    setErrorRepeatedPassword("");
    setErrorDisplayName("");
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
    const validateRepeatedPassword = validate("password", repeatedPassword);
    if (validateRepeatedPassword) {
      setErrorRepeatedPassword(validateRepeatedPassword);

      return validateRepeatedPassword;
    }
    const validateDisplayName = validate("name", displayName);
    if (validateDisplayName) {
      setErrorDisplayName(validateDisplayName);

      return validateDisplayName;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorText = validation();
    if (errorText) {
      setDisplayMessage(errorText);
      return;
    }
    if (password === repeatedPassword) {
      try {
        const errorSignup = await signup(email, password, displayName);
        if (errorSignup) {
          if (errorSignup.message === "The email address is already in use by another account.") {
            throw Error("This email adress is already in use")
          }
          else {
            throw Error( "Couldn't create account")
          }
          
        }      
      }
      catch (error) {
       
        setIsError(true)
        setDisplayMessage(error.message)
      }
      
    }
    else {
      setIsError(true)
      setErrorPassword(true)
      setErrorRepeatedPassword(true)
      setDisplayMessage("Passwords don't match")
    }
  };
  useEffect(() => {
    if (
      errorEmail ||
      errorPassword ||
      errorRepeatedPassword ||
      errorDisplayName
    ) {
      setIsError(true);
    }
  }, [errorEmail, errorPassword, errorRepeatedPassword, errorDisplayName]);

  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleSubmit}>
        <div className="auth__form-logo-wrapper">
          <h2 className="auth__form-logo-h2">Sign Up</h2>
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
          <div className="auth__form-input-wrapper">
            <input
              ref={inputRepeatedPassword}
              type="password"
              className={`auth__form-input ${
                repeatedPassword && "auth__form-input--content"
              } ${errorRepeatedPassword ? "auth__form-input--error" : ""}`}
              onChange={(e) => {
                setRepeatedPassword(e.target.value);
                handleClearError();
              }}
              value={repeatedPassword}
            />
            <span
              onClick={() => inputRepeatedPassword.current.focus()}
              onMouseEnter={() =>
                inputRepeatedPassword.current.classList.add(
                  "auth__form-input--hover"
                )
              }
              onMouseLeave={() =>
                inputRepeatedPassword.current.classList.remove(
                  "auth__form-input--hover"
                )
              }
              className={`auth__form-input-span ${
                repeatedPassword && "auth__form-input-span--content"
              }`}>
              Repeat password*
            </span>
          </div>
          <div className="auth__form-input-wrapper">
            <input
              ref={inputDisplayName}
              type="text"
              className={`auth__form-input ${
                displayName && "auth__form-input--content"
              } ${errorDisplayName ? "auth__form-input--error" : ""}`}
              onChange={(e) => {
                setDisplayName(e.target.value);
                handleClearError();
              }}
              value={displayName}
            />
            <span
              onClick={() => inputDisplayName.current.focus()}
              onMouseEnter={() =>
                inputDisplayName.current.classList.add(
                  "auth__form-input--hover"
                )
              }
              onMouseLeave={() =>
                inputDisplayName.current.classList.remove(
                  "auth__form-input--hover"
                )
              }
              className={`auth__form-input-span ${
                displayName && "auth__form-input-span--content"
              }`}>
              Display name
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
