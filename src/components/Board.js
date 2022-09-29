import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

//styles
import "./Board.css";

import Columns from "./Columns";

export default function Board({ documents }) {
console.log(documents)

  return (
    <div className="board__wrapper">
      {documents ? (
        <Routes>
          <Route path=":id" element={<Columns documents={documents} />} />
          <Route path="/" element={documents && <Navigate to={`${documents[0].id}`} /> } />
        </Routes>
      ) : (
        <section className="board__empty">
          <div className="board__empty-text-wrapper">
            <p className="board__empty-text">
              This board is empty. Create a new column to get started.
            </p>
          </div>
          <button className="board__empty-add-button">
            <p className="board__empty-button-text">+ Add New Column</p>
          </button>
        </section>
      )}
    </div>
  );
}
