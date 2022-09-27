import React from 'react'
import board from "../../../assets/icon-board.svg";

export default function CreateBoard({handleCreateBoard}) {
  return (
    <div className="menu__create-button-wrapper">
          <button onClick={handleCreateBoard} className="menu__create-button">
      <img src={board} alt="board" className="menu__create-button-img" />
      <p className="menu__create-button-text">+ Create New Board</p>
    </button>
  </div>
  )
}
