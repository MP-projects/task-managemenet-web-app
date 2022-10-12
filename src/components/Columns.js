import React from "react";
import { useState, useEffect } from "react";
import { useParams, Routes, Route } from "react-router-dom";
import produce from "immer";

//styles
import "./Columns.css";

//components
import Task from "./Task";
import NewTask from "../pages/Home/AddBoard/NewTask";
import AddBoard from "../pages/Home/AddBoard/AddBoard";
import SingleColumn from "./SingleColumn";
import TaskView from "./TaskView";
import EditBoard from "../pages/Home/AddBoard/EditBoard";

export default function Columns({ boards, uid, tasks }) {
  const { id } = useParams();
  const [currentBoards, setCurrentBoards] = useState(null);
  const [currentTasks, setCurrentTasks] = useState(null);

  useEffect(() => {
    if (boards && id) {
      const newBoard = boards.filter((board) => board.id === id)[0];
      setCurrentBoards(newBoard);

      if (tasks) {
        const newTasks = tasks.filter((task) => task.boardId === newBoard.id);
        setCurrentTasks(newTasks);
      }
    }
  }, [id, boards, tasks]);


  return (
    <>
      <div className="columns">
        {currentBoards &&
          currentTasks &&
          currentBoards.columns.map((column) => {
            const tasks = currentTasks.filter(
              (task) => task.status.name === column.name
            );

            if (column.active)
              return (
                <SingleColumn key={column.name} column={column} tasks={tasks} />
              );
          })}
      </div>
      <Routes>
        <Route
          path=":id"
          element={<TaskView tasks={tasks} board={currentBoards} />}
        />
        <Route path="newTask" element={<NewTask boards={boards} uid={uid} />} />
        <Route
          path="newBoard"
          element={<AddBoard uid={uid} boards={boards} />}
        />
        <Route
          path="editBoard"
          element={<EditBoard uid={uid} boards={boards} tasks={tasks} />}
        />
      </Routes>
    </>
  );
}
