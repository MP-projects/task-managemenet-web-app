import React, { useState, useEffect } from "react";
import { useUpdate } from "../../../hooks/useUpdate";
import { useValidate } from "../../../hooks/useValidate";
import { useTheme } from "../../../hooks/useTheme";

export default function ChangeInfo({ type, handleBackButton }) {


  const [inputContent, setInputContent] = useState("");
  const [errorInputContent, setErrorInputContent] = useState("")

  const [inputContentRepeat, setInputContentRepeat] = useState("");
  const [errorInputContentRepeat, setErrorInputContentRepeat] = useState("")

  const [isError, setIsError] = useState(false)
  const [displayMessage, setDisplayMessage] = useState("")

  const { update, isSuccess} = useUpdate();
  const { validate } = useValidate()
  const {darkMode} = useTheme()

  const handleClearErrors = () => {
    setErrorInputContent("")
    setErrorInputContentRepeat("")
    setIsError(false)
    setDisplayMessage("")
  }
  
  const validation= ()=>{
    const validateInputContent = validate(type, inputContent);
    if (validateInputContent) {
      setErrorInputContent(validateInputContent);

      return validateInputContent;
    }
    const validateInputContentRepeat = validate(type, inputContentRepeat);
    if (validateInputContentRepeat) {
      setErrorInputContentRepeat(validateInputContentRepeat);

      return validateInputContentRepeat;
    }
  }
  const handleSubmit = () => {

    const errorText = validation()
    if (errorText) {
      setDisplayMessage(errorText);
      return;
    }
    if (
      inputContent === inputContentRepeat &&
      (inputContent !== "" || inputContentRepeat !== "")
    ) {
      if (type === "email") {
        update(inputContent);
      }
      if (type === "password") {
        update(null, inputContent);
      }
      
    }
    else {
      setIsError(true)
      setErrorInputContent(true)
      setErrorInputContentRepeat(true)
      setDisplayMessage(type.toUpperCase()+"S don't match")
    }
  };

  useEffect(() => {
    if (errorInputContent || errorInputContentRepeat) {
      setIsError(true)
    }
    if (isSuccess) {
      setDisplayMessage(type.toUpperCase()+ " change successful")
      setTimeout(() => {
        handleBackButton();
      }, 1000);
    }
  }, [isSuccess, errorInputContent, errorInputContentRepeat, type, handleBackButton]);

  return (
    <>
      <div className="profile__info-title-wrapper">
        <h2 className="profile__info-h2">Change {type}</h2>
      </div>
      <div
        className={`profile__info-content-wrapper profile__info-content-wrapper--settings `}>
        <div className="profile__info-content-settings">
          <span className={`profile__info-content-span ${darkMode?"darkMode--light":""}`}>New {type}</span>
          <input
            required
            type={type}
            onChange={(e) => {
              setInputContent(e.target.value);
              handleClearErrors()
            }}
            className={`profile__info-input ${
              inputContent && "profile__info-input--content"
            } ${
              errorInputContent && "profile__info-input--error"
            }`}
          />
        </div>
        <div className="profile__info-content-settings">
          <span className={`profile__info-content-span ${darkMode?"darkMode--light":""}`}>Confirm {type}</span>
          <input
            required
            type={type}
            onChange={(e) => {
              setInputContentRepeat(e.target.value);
              handleClearErrors()
            }}
            className={`profile__info-input ${
              inputContent && "profile__info-input--content"
            } ${
              errorInputContentRepeat && "profile__info-input--error"
            } `}
          />
        </div>
        <p className={`profile__info-message ${isError?"profile__info-message--error":""}`}>
          {displayMessage}
        </p>
        <div className="profile__info-edit-wrapper">
          <button
            onClick={handleSubmit}
            disabled={isError}
            className={`profile__info-edit-button profile__info-edit-button--settings ${isError?"profile__info-edit-button--active":""}`}>
            <p className="profile__info-edit-button-p">Save</p>
          </button>
          <button
            onClick={() => { handleBackButton(false); handleClearErrors() }}
            className={`profile__info-edit-button profile__info-edit-button--settings`}>
            <p className="profile__info-edit-button-p">back</p>
          </button>
        </div>
      </div>
      </>
  );
}
