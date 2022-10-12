import React from "react";
import { useNavigate, Routes, Route, NavLink, Link, useLocation } from "react-router-dom";
import board from "../../../assets/icon-board.svg";
import { useFirestore } from "../../../hooks/useFirestore";

//styles
import "./BoardButton.css";

//assets
import Trash from "../../../assets/fontAwesome/trash-solid.svg";
import Edit from "../../../assets/fontAwesome/pen-solid.svg";

export default function BoardButton({ doc, boardId, tasks }) {
  const { deleteDocument, response } = useFirestore("boards");
  const { deleteDocument: deleteDocumentTask } = useFirestore("tasks");
  const navigate = useNavigate();
  const location = useLocation()
 
  const handleDeleteBoard = () => {
    navigate("/boards", { replace: true });
    deleteDocument(doc.id);
    tasks.forEach((element) => {
      if (element.boardId === boardId) {
        deleteDocumentTask(element.id);
      }
    });
  };

  const handleEditBoard = (e) => {
    e.stopPropagation()
    e.preventDefault()
  
    navigate(`${location.pathname}/editBoard`)
 
  }
  return (
    <ul className="menu__board-element">
      <NavLink className="menu__board-element-wrapper" to={`boards/${doc.id}`}>
        <button className="menu__board-element-button">
          <img src={board} alt="board" className="menu__board-element-img" />
          <li className="menu__board-element-li">{doc.name}</li>
          <span onClick ={handleEditBoard} className={` menu__edit-board `}>
            <img
              className=" menu__edit-img-board"
              src={Edit}
              alt="edit"
            />
          </span>
        </button>
      </NavLink>
    </ul>
  );
}
