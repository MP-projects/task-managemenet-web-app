import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./Test.css";

export default function Test() {
  const { id } = useParams();
  id;
  const navigate = useNavigate();

  const click = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="background-color"></div>
      <div className="info">
        <button onClick={click} className="taskView__form-button">
          Cofnij
        </button>
        {id}{" "}
      </div>
    </>
  );
}
