import React from "react";
import { useTheme } from "../hooks/useTheme";

//styles
import "./Delete.css";

export default function Delete({
  handleDeleteButton,
  handleDeleteElement,
  titleDescription,
  text,
}) {

  const { darkMode } = useTheme()
  
  return (
    <>
    <div className="background-color"></div>
    <section className={`delete ${darkMode?"darkMode--light":""}`}>
      <div className="delete__text-wrapper">
        <h2 className="delete__title">{titleDescription}</h2>
        <p className="delete__text">{text}</p>
      </div>
      <div className="delete__buttons-wrapper">
        <button
          onClick={handleDeleteElement}
          className="delete__button delete__button--delete">
          <p className="delete__button-p">Yes</p>
        </button>
        <button
          onClick={(e) => handleDeleteButton(false)}
          className="delete__button delete__button--cancel">
          <p className="delete__button-p">Cancel</p>
        </button>
      </div>
      </section>
      </>
  );
}
