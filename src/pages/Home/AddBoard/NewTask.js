import React from "react";
import { useState, useEffect } from "react";
import { useFirestore } from "../../../hooks/useFirestore";
import { useLocation, useNavigate, useParams } from "react-router-dom";

//styles
import "./NewTask.css";

//assets
import CloseIcon from "../../../assets/icon-cross.svg";

export default function NewTask({ boards, uid }) {
  const { addDocument, response } = useFirestore("tasks");

  const [boardName, setBoardName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columns, setColumns] = useState([]);
  const [status, setStatus] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const maxSubtasks = 3;

  const { id } = useParams();

  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleChangeSubtaskName = (e, id) => {
    let tempSubtasks = [...subtasks];
    tempSubtasks.forEach((subtask) => {
      if (subtask.id === id) {
        subtask.title = e.target.value;
        subtask.isCompleted = false;
      }
    });
    setSubtasks(tempSubtasks);
  };

  const handleSubtaskDelete = (id) => {
    let tempSubtasks = [...subtasks].filter((subtask) => subtask.id !== id);
    setSubtasks(tempSubtasks);
  };

  const handleAddSubtask = () => {
    if (subtasks.length < maxSubtasks) {
      let id = new Date().getTime();
      setSubtasks((prevState) => [
        ...prevState,
        {
          name: "",
          id,
        },
      ]);
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleClose = () => {
    navigate(-1);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let newDocument = {
      boardName,
      title,
      description,
      status,
      subtasks,
      uid,
    };
    addDocument(newDocument);
  };

  useEffect(() => {
    if (boards && id) {
      let columnNames = [];
      boards.forEach((doc) => {
        if (doc.id === id) {
          setBoardName(doc.name);
          doc.columns.forEach((column) => {
            columnNames.push(column.name);
          });
        }
      });
      setColumns(columnNames);
      setStatus(columnNames[0]);
    }

    if (response.succes) {
      navigate("/");
    }
  }, [boards, id, response]);

  return (
    <>
      <div className="background-color"></div>
      <section className="newTask">
        <button className="newTask__close-button" onClick={handleClose}>
          <img src={CloseIcon} alt="close" className="newTask__close-img" />
        </button>
        <form onSubmit={handleSubmit} className="newTask__form">
          <h2 className="newTask__form-h2">Add new Task</h2>
          <div className="newTask__form-wrapper">
            <span className="newTask__form-span">Title</span>
            <input
              value={title}
              onChange={handleTitleChange}
              required
              placeholder="e.g. Take coffe break"
              type="text"
              className="newTask__form-input"
            />
          </div>
          <div className="newTask__form-wrapper">
            <span className="newTask__form-span">description</span>
            <textarea
              value={description}
              required
              onChange={handleDescriptionChange}
              placeholder="e.g. It’s always good to take a break. This 15 minute break will 
             recharge the batteries a little."
              maxLength={150}
              className="newTask__form-input newTask__form-input--description"
            />
          </div>
          <div className="newTask__form-wrapper">
            <span className="newTask__form-span">
              Subtasks ({subtasks.length} of {maxSubtasks})
            </span>
            {subtasks.length > 0 &&
              subtasks.map((subtask) => {
                return (
                  <div key={subtask.id} className="newTask__form-input-wrapper">
                    <input
                      onChange={(e) => handleChangeSubtaskName(e, subtask.id)}
                      value={subtask.title}
                      placeholder="e.g do something"
                      className="newTask__form-input"
                    />
                    <button
                      onClick={() => handleSubtaskDelete(subtask.id)}
                      type="button"
                      className="newTask__form-column-delete">
                      X
                    </button>
                  </div>
                );
              })}

            <button
              onClick={handleAddSubtask}
              type="button"
              className="newTask__form-button newTask__form-button--light-purple">
              <p className="newTask__form-button-p">+ Add New Subtask</p>
            </button>
            <select
              defaultValue={columns[0]}
              onChange={handleStatusChange}
              className="newBoard__form-select">
              {columns &&
                columns.map((column) => {
                  return (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  );
                })}
            </select>
            <button className="newTask__form-button newTask__form-button--purple">
              <p className="newTask__form-button-p">Create New Task</p>
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
