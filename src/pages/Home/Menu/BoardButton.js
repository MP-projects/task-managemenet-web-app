import React from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import board from "../../../assets/icon-board.svg";
import { useTheme } from "../../../hooks/useTheme";

//styles
import "./BoardButton.css";

//assets
import Edit from "../../../assets/fontAwesome/pen-solid.svg";

export default function BoardButton({ doc }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {darkMode} = useTheme()

  const handleEditBoard = (e) => {
    e.stopPropagation();
    e.preventDefault();

    navigate(`${location.pathname}/editBoard`);
  };
  return (
    <ul className="menu__board-element">
      <NavLink className={`menu__board-element-wrapper ${darkMode?"darkMode__board-button":""}`} to={`boards/${doc.id}`}>
        <button className="menu__board-element-button">
          <img src={board} alt="board" className="menu__board-element-img" />
          <li className="menu__board-element-li">{doc.name}</li>
          <span onClick={handleEditBoard} className={` menu__edit-board `}>
            <img className=" menu__edit-img-board" src={Edit} alt="edit" />
          </span>
        </button>
      </NavLink>
    </ul>
  );
}
