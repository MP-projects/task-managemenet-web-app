import React from "react";
import { useState, useEffect } from "react";
import { useParams, Routes, Route } from "react-router-dom";

//styles
import "./Columns.css";

//components
import Task from "./Task";
import NewTask from "../pages/Home/AddBoard/NewTask";
import AddBoard from "../pages/Home/AddBoard/AddBoard";
import SingleColumn from "./SingleColumn";

export default function Columns({ boards, uid, tasks }) {
  const { id } = useParams();
  const [currentBoards, setCurrentBoards] = useState(null);
  const [currentTasks, setCurrentTasks] = useState(null)
  const [currentColumns, setCurrentColumns] = useState([])

  const sortTasks = (name) => {
    let tasks = []
    let tempCurrentTasks = [...currentTasks]
    tempCurrentTasks.forEach((task) => {
      if (task.status === name) {
        tasks.push(task)
      }
    })
return tasks
  }
  useEffect(() => {
    if (boards && id) {
      let columns = [];
      boards.forEach((doc) => {
        if (doc.id === id) {
          setCurrentBoards(doc);
          doc.columns.forEach((column) => {
            columns.push(column.name)
          })
          if (tasks) {
            let newTasks = []
            tasks.forEach((task) => {
              if (task.boardName === doc.name) {
                newTasks.push(task)        
              }
            })
            setCurrentTasks(newTasks)           
          }
        }
      });
      setCurrentColumns(columns)
    }

 
  }, [id, boards, tasks]);
console.log(id)
  return (
    <>
      <div className="columns">
        {currentBoards &&
          currentBoards.columns.map((column) => {
            const tasks = sortTasks(column.name)
            
            return (

              <SingleColumn key={column.name} name={column.name} tasks = {tasks} currentColumns={currentColumns} />

            );
          })}
      </div>
      <Routes>
        <Route path="newTask" element={<NewTask boards={boards} uid={uid} />} />
        <Route path="newBoard" element={<AddBoard uid={uid} />} />
      </Routes>
    </>
  );
}
