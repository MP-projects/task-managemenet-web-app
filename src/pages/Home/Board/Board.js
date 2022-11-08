import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";

//styles
import "./Board.css";

//components
import Columns from "./Columns"
import NewTask from "../Task/NewTask";
import AddBoard from "../AddBoard/AddBoard";
import About from "../About";
import EmptyBoard from "./EmptyBoard";

export default function Board({ boards, uid, tasks }) {
  const { darkMode } = useTheme();

  return (
    <div
      className={`board__wrapper ${
        darkMode ? "darkMode--scrollbar-board" : ""
      } `}>
      {boards ? (
        <Routes>
          <Route
            path=":id/*"
            element={<Columns uid={uid} boards={boards} tasks={tasks} />}
          />
          <Route
            path="/"
            element={boards && <Navigate to={`${boards[0].id}`} />}
          />
          <Route path="newTask" element={<NewTask uid={uid} />} />
          <Route
            path="newBoard"
            element={<AddBoard uid={uid} boards={boards} />}
          />
          <Route path="About" element={<About />} />
        </Routes>
      ) : (
        <EmptyBoard />
      )}
    </div>
  );
}
