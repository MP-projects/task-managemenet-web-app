import React from "react";
import { Routes, Route } from "react-router-dom";
//components
import Task from "./Task";
import TaskView from "./TaskView";
//styles

import "./SingleColumn.css";

export default function SingleColumn({ column, tasks }) {
  const columnStyle = (name) => {
    let color;
    switch (name) {
      case "Todo":
        color = "#49C4E5";
        break;
      case "Doing":
        color = "#8471F2";
        break;
      case "Done":
        color = "#67E2AE";
        break;
      default:
        color = "#E77833";
    }

    return { backgroundColor: color };
  };

  return (
    
    <section className="singleColumn">
      <h2 className="singleColumn__title">
        <div className="singleColumn__circle" style={columnStyle(column.name)}></div>
        {(column&&tasks) &&`${column.value}(${tasks.length})`}
      </h2>
      <div className="singleColumn__task-wrapper">
        {tasks &&
          tasks.map((task) => {
            return (
              <Task key={task.id} task={task} />
            );
          })}
      </div>
      </section>

      
  );
}
