import React from "react";
import { useNavigate, Routes, Route, NavLink } from "react-router-dom";
import board from "../../../assets/icon-board.svg";

import "./BoardButton.css"


export default function BoardButton({ doc, boardName }) {

  return (
    
    <ul className="menu__board-element"> 
      <NavLink to={`boards/${doc.id}`}>
      <button className="menu__board-element-button">
        <img src={board} alt="board" className="menu__board-element-img" />
        <li className="menu__board-element-li">{boardName}</li>    
      </button>      
      </NavLink>
    </ul>

   
  );
}
