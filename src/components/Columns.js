import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

//styles
import "./Columns.css"

//components
import Task from "./Task";

export default function Columns({ documents }) {
  const { id } = useParams();
  const [data, setData] = useState(null);

    const columnStyle = (name) => {
        let color;
        switch (name) {
            case "Todo":
                color ="#49C4E5"
                break;
            case "Doing":
                color ="#8471F2"
                break;
            case "Done":
                color ="#67E2AE"
                break;
            default:
                color ="#E77833"
    
        }
        
        return({backgroundColor : color})
  }  
    
    
  useEffect(() => {
    if (documents && id) {
      documents.forEach((doc) => {
        if (doc.id === id) {
          setData(doc);
        }
      });
    }
  }, [id, documents]);

  console.log(data);

  return (
    <div className="columns">
          {data && data.columns.map((column) => {
          return(
              <section key={column.name} className={`columns__column`}>
                  <h2 className="columns__title"><div className="columns__circle" style={columnStyle(column.name)}></div>{`${column.name}(${5})`}</h2>
            <div className="columns__task-wrapper">
                <Task/>
            </div>
        </section>)
      })}
    </div>
  );
}
