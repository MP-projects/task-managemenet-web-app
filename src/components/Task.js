import React from "react";
import { useEffect, useState } from "react";
import { Route, Routes, Link } from "react-router-dom";

//styles
import "./Task.css";

//components
import TaskView from "./TaskView";
export default function Task({ task, currentColumns }) {
  const [completedSubtasks, setCompletedSubtasks] = useState([]);
  useEffect(() => {
    if (task) {
      const tempSubtasks = [...task.subtasks];
      let tempCompletedSubtasks = [];
      tempSubtasks.forEach((tempSubtask) => {
        if (tempSubtask.isCompleted) {
          tempCompletedSubtasks.push(tempSubtask);
        }
      });
      setCompletedSubtasks(tempCompletedSubtasks);
    }
  }, [task]);
  return (
    <>
      <Link to={task.id} className="task">
        <p className="task__title">{task.title}</p>
        <span className="task__subtasks">
          {`${completedSubtasks.length} of ${task.subtasks.length}`} subtasks
        </span>
      </Link>
      <Routes>
        <Route path={task.id} element={<TaskView task={task} completedSubtasks={completedSubtasks} currentColumns={currentColumns} />} />
      </Routes>
    </>
  );
}
