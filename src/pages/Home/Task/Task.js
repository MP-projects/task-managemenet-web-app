import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";


//styles
import "./Task.css";


export default function Task({ task }) {
  const {darkMode}=useTheme()

  const [completedSubtasks, setCompletedSubtasks] = useState([]);
 
  useEffect(() => {
    if (task) {
      const newSubtasks = task.subtasks.filter(task => task.isCompleted)
      setCompletedSubtasks(newSubtasks);
    }
  }, [task]);

  return (
    <>
      <Link draggable={true} to={task.id} className={`task ${darkMode?"darkMode--light":""}`}>
        <p className="task__title">{task.title}</p>
        <span className="task__subtasks">
          {`${completedSubtasks.length} of ${task.subtasks.length}`} subtasks
        </span>
      </Link>
      {/* <Routes>
        <Route path={task.id} element={<TaskView task={task} completedSubtasks={completedSubtasks} currentColumns={currentColumns} />} />
      </Routes> */}
    </>
  );
}
