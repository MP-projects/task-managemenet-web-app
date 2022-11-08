import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useValidate } from "../../hooks/useValidate";
import emailjs from "@emailjs/browser";
import { useTheme } from "../../hooks/useTheme";

//styles
import "./About.css";
import { useEffect } from "react";

export default function About() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { validate} = useValidate();
  const {darkMode} = useTheme()
  const ref = useRef();
  useOnClickOutside(ref, () => {
    handleClearForm();
    navigate(-1);
  });

  const inputSubject = useRef();
  const inputName = useRef();
  const inputEmail = useRef();
  const inputMessage = useRef();

  const [subject, setSubject] = useState("");
  const [errorSubject, setErrorSubject] = useState("");

  const [userName, setUserName] = useState("");

  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");

  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [responseText, setResponseText] = useState("");

  const [isError, setIsError] = useState(false);

  const handleClearForm = () => {
    setSubject("");
    setName("");
    setEmail("");
    setMessage("");
    handleClearErrors();
  };
  const handleClearErrors = () => {
    setErrorSubject("");
    setErrorEmail("");
    setErrorName("");
    setErrorMessage("");
    setResponseText("");
    setIsError("");
  };

  const validation = () => {
    const validateSubject = validate("text", subject);
    if (validateSubject) {
      setErrorSubject(validateSubject);

      return validateSubject;
    }
    const validateName = validate("name", name);
    if (validateName) {
      setErrorName(validateName);

      return validateName;
    }
    const validateEmail = validate("email", email);
    if (validateEmail) {
      setErrorEmail(validateEmail);

      return validateEmail;
    }
    const validateMessage = validate("message", message);
    if (validateMessage) {
      setErrorMessage(validateMessage);

      return validateMessage;
    }

    return false;
  };
  const handeSubmit = (e) => {
    e.preventDefault();
    setResponseText("");
    const errorText = validation();
    if (errorText) {
      setResponseText(errorText);
      return;
    }

    emailjs
      .send(
        "service_wt3gssp",
        "template_vzstcimdsf",
        {
          subject,
          userName,
          name,
          email,
          message,
        },
        "MZn4DGaw__cnW8xTF"
      )
      .then(
        (result) => {
          if (result.status === 200) {
           
            handleClearForm();
            setResponseText("Message sent successful!");
            setTimeout(() => {
              setResponseText("");
            }, 2000);
          }
        },
        (error) => {
          setResponseText(error);
        }
      );
  };
  
  useEffect(() => {
    if (errorSubject || errorEmail || errorName || errorMessage) {
      setIsError(true);
    }
    if (user) {
      setUserName(user.uid);
    }
  }, [user, errorSubject, errorEmail, errorName, errorMessage]);

  return (
    <>
      <div className="background-color"></div>
      <div ref={ref} className={`about ${darkMode?"darkMode--light":""}`}>
        <div className="about__text-wrapper">
          <h2 className="about__h2">Hello dear {user && user.displayName}</h2>
          <p className="about__p">
            My name is Paweł Mączka and I am the creator of this application.
            First of all I want to thank you for using this app. If you like it
            or have any questions to me, or you just want to know me better just
            send me a message using form below or you can checkout my{" "}
            <a
              href={"https://github.com/MP-projects"}
              rel={"noreferrer"}
              target="_blank"
              className="about__link">
              github
            </a>
            .
          </p>
        </div>

        <form className="about__form" onSubmit={handeSubmit}>
          <div className="about__input-wrapper">
            <input
              ref={inputSubject}
              type="text"
              name="Subject"
              className={`about__input ${
                subject ? "about__input--content" : ""
              } ${errorSubject ? "about__input--error" : ""} ${darkMode?"darkMode--light":""}`}
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                handleClearErrors();
              }}
            />
            <span
              onClick={() => inputSubject.current.focus()}
              onMouseEnter={() =>
                inputSubject.current.classList.add("about__input--hover")
              }
              onMouseLeave={() =>
                inputSubject.current.classList.remove("about__input--hover")
              }
              className={`about__input-span ${
                email ? "about__input-span--content" : ""
              } ${darkMode?"darkMode--light":""}`}>
              Subject*
            </span>
          </div>
          <div className="about__input-wrapper about__input-wrapper--row">
            <div className="about__input-wrapper about__input-wrapper--row-item">
              <input
                ref={inputName}
                type="text"
                name="name"
                className={`about__input ${
                  name ? "about__input--content" : ""
                } ${errorName ? "about__input--error" : ""} ${darkMode?"darkMode--light":""}`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  handleClearErrors();
                }}
              />
              <span
                onClick={() => inputName.current.focus()}
                onMouseEnter={() =>
                  inputName.current.classList.add("about__input--hover")
                }
                onMouseLeave={() =>
                  inputName.current.classList.remove("about__input--hover")
                }
                className={`about__input-span ${
                  name ? "about__input-span--content" : ""
                } ${darkMode?"darkMode--light":""}`}>
                Name*
              </span>
            </div>
            <div className="about__input-wrapper about__input-wrapper--row-item">
              <input
                ref={inputEmail}
                type="text"
                name="email"
                className={`about__input ${
                  email ? "about__input--content" : ""
                } ${errorEmail ? "about__input--error" : ""} ${darkMode?"darkMode--light":""}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleClearErrors();
                }}
              />
              <span
                onClick={() => inputEmail.current.focus()}
                onMouseEnter={() =>
                  inputEmail.current.classList.add("about__input--hover")
                }
                onMouseLeave={() =>
                  inputEmail.current.classList.remove("about__input--hover")
                }
                className={`about__input-span ${
                  email ? "about__input-span--content" : ""
                } ${darkMode?"darkMode--light":""}`}>
                Email adress*
              </span>
            </div>
          </div>
          <div className="about__input-wrapper">
            <textarea
              ref={inputMessage}
              type="text"
              name="message"
              className={`about__input about__input--textarea ${
                message ? "about__input--content" : ""
              } ${errorMessage ? "about__input--error" : ""} ${darkMode?"darkMode--light":""}`}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleClearErrors();
              }}
            />
            <span
              onClick={() => inputMessage.current.focus()}
              onMouseEnter={() =>
                inputMessage.current.classList.add("about__input--hover")
              }
              onMouseLeave={() =>
                inputMessage.current.classList.remove("about__input--hover")
              }
              className={`about__input-span about__input-span--textarea${
                message ? "about__input-span--content" : ""
              } ${darkMode?"darkMode--light":""}`}>
              Message*
            </span>
          </div>
          <p
            className={`about__response ${
              isError ? "about__response--error" : ""
            }`}>
            {responseText}
          </p>
          <div className="about__input-wrapper about__input-wrapper--row">
            <button
              disabled={isError}
              className={`about__button ${
                isError ? "about__button--disabled" : ""
              }`}>
              <p className="about__button-p">Send message</p>
            </button>
            <button
              onClick={handleClearForm}
              type="button"
              className="about__button">
              <p className="about__button-p">Clear form</p>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
