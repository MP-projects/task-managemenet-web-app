import React from "react";

//styles
import "./Delete.css";

export default function Delete({
  handleDeleteButton,
  handleDeleteElement,
  elementType,
  text,
}) {
  return (
    <section className="delete">
      <div className="delete__text-wrapper">
        <h2 className="delete__title">Delete this {elementType} ?</h2>
        <p className="delete__text">{text}</p>
      </div>
      <div className="delete__buttons-wrapper">
        <button
          onClick={handleDeleteElement}
          className="delete__button delete__button--delete">
          <p className="delete__button-p">Delete</p>
        </button>
        <button
          onClick={() => handleDeleteButton(false)}
          className="delete__button delete__button--cancel">
          <p className="delete__button-p">Cancel</p>
        </button>
      </div>
    </section>
  );
}
