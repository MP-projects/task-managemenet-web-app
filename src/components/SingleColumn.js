import React from "react";

//components
import Task from "./Task";
//styles

import "./SingleColumn.css";

export default function SingleColumn({ name, tasks, currentColumns }) {
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
console.log(tasks)
  return (
    <section className={`singleColumn`}>
      <h2 className="singleColumn__title">
        <div className="singleColumn__circle" style={columnStyle(name)}></div>
        {`${name}(${tasks.length})`}
      </h2>
      <div className="singleColumn__task-wrapper">
        {tasks &&
          tasks.map((task) => {
            return(
            <Task key={task.id} task={task} currentColumns={currentColumns} />)
          })}
      </div>
    </section>
  );
}
