import React from "react";
import { Link } from "react-router-dom";

//styles
import "./EmptyBoard.css";

export default function EmptyBoard() {
  return (
    <div className="board__wrapper">
      <section className="board__empty">
        <div className="board__empty-text-wrapper">
          <p className="board__empty-text">
            This board is empty. Create a new column to get started.
          </p>
        </div>

        <Link to="newBoard" className="board__empty-add-button">
          <p className="board__empty-button-text"> + Create New Board </p>
        </Link>
      </section>
    </div>
  );
}
