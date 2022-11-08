import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../../../hooks/useLogout.js";
import { useUpdate } from "../../../hooks/useUpdate.js";
import useOnClickOutside from "../../../hooks/useOnClickOutside.js";
import { useTheme } from "../../../hooks/useTheme.js";
//styles
import "../../Login.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { update, isSuccess } = useUpdate();
  const { logout } = useLogout();

  const navigate = useNavigate();
  const {darkMode} = useTheme()

  const ref = useRef();
  useOnClickOutside(ref, () => {
    navigate(-1);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === repeatedPassword) {
      update(email, password, displayName);
    }
  };

  const inputEmail = useRef();
  const inputPassword = useRef();
  const inputRepeatedPassword = useRef();
  const inputDisplayName = useRef();

  useEffect(() => {
    if (isSuccess) {
      navigate(-1);
    }
  }, [isSuccess, navigate]);
  return (
    <>
      <div className="background-color"></div>
      <div ref={ref} className={`auth`}>
        <form className={`auth__form ${darkMode? "darkMode--light":""}`} onSubmit={handleSubmit}>
          <div className="auth__form-logo-wrapper">
            <h2 className="auth__form-logo-h2">Sign Up</h2>
          </div>
          <div className="auth__form-wrapper">
            <div className="auth__form-input-wrapper">
              <input
                ref={inputEmail}
                type="email"
                className={`auth__form-input ${
                  email && "auth__form-input--content"
                } ${darkMode? "darkMode--light":""}`}
                onChange={(e) => setEmail(e.target.value)}
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
                } ${darkMode? "darkMode--light":""}`}>
                Email adress*
              </span>
            </div>
            <div className="auth__form-input-wrapper">
              <input
                ref={inputPassword}
                type="password"
                className={`auth__form-input ${
                  password && "auth__form-input--content"
                } ${darkMode? "darkMode--light":""}`}
                onChange={(e) => setPassword(e.target.value)}
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
                } ${darkMode? "darkMode--light":""}`}>
                Password*
              </span>
            </div>
            <div className="auth__form-input-wrapper">
              <input
                ref={inputRepeatedPassword}
                type="password"
                className={`auth__form-input ${
                  repeatedPassword && "auth__form-input--content"
                } ${darkMode? "darkMode--light":""}`}
                onChange={(e) => setRepeatedPassword(e.target.value)}
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
                } ${darkMode? "darkMode--light":""}`}>
                Repeat password*
              </span>
            </div>
            <div className="auth__form-input-wrapper">
              <input
                ref={inputDisplayName}
                type="text"
                className={`auth__form-input ${
                  displayName && "auth__form-input--content"
                } ${darkMode? "darkMode--light":""}`}
                onChange={(e) => setDisplayName(e.target.value)}
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
                } ${darkMode? "darkMode--light":""}`}>
                Display name
              </span>
            </div>
          </div>
          <div className="auth__form-wrapper">
            <button className="auth__form-submit">
              <p className="auth__form-submit-p">SIGN UP</p>
            </button>

            <div className="auth__form-buttons-wrapper">
              <Link
                onClick={() => {
                  logout();
                }}
                to="/"
                className="auth__form-link auth__form-link--signup">
                <p className="auth__form-link-p">
                  Already have an account? Sign in
                </p>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
