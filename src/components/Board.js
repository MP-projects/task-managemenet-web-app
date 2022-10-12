import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

//styles
import "./Board.css";

import Columns from "./Columns";
import NewTask from "../pages/Home/AddBoard/NewTask";
import AddBoard from "../pages/Home/AddBoard/AddBoard";

export default function Board({ boards, uid, tasks }) {
 
  return (
    <div className="board__wrapper">
      {boards ? (
        <Routes>
          <Route path=":id/*" element={<Columns uid={uid} boards={boards} tasks = { tasks } />} />
          <Route
            path="/"
            element={boards && <Navigate to={`${boards[0].id}`} />}
          />
          <Route path="newTask" element={<NewTask uid={uid} />} />
          <Route path="newBoard" element={<AddBoard uid={uid} boards={boards} />} />
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
