import React from "react";
import board from "../../../assets/icon-board.svg";

export default function BoardButton({boardName}) {


  return (
    <ul className="menu__board-element">
      <button className="menu__board-element-button">
        <img src={board} alt="board" className="menu__board-element-img" />
        <li className="menu__board-element-li">{boardName}</li>
      </button>
    </ul>
  );
}
