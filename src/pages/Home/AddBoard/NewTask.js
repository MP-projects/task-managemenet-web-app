import React from "react";
import { useState, useEffect } from "react";
import { useFirestore } from "../../../hooks/useFirestore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import produce from "immer";

//styles
import "./NewTask.css";

//assets
import CloseIcon from "../../../assets/icon-cross.svg";

export default function NewTask({ boards, uid }) {
  const { addDocument, response } = useFirestore("tasks");

  const [currentBoard, setCurrentBoard] = useState(null);

  const [boardId, setBoardId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState({ name: "", value: "" });
  const [subtasks, setSubtasks] = useState([]);
  const maxSubtasks = 6;
 
  const { id } = useParams();

  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleChangeSubtaskName = (e, id) => {
    setSubtasks(
      produce(subtasks, (draft) => {
        draft.forEach((subtask) => {
          if (subtask.id === id) {
            subtask.title = e.target.value;
            subtask.isCompleted = false;
          }
        });
        return draft;
      })
    );
  };

  const handleSubtaskDelete = (id) => {
    let tempSubtasks = subtasks.filter((subtask) => subtask.id !== id);
    setSubtasks(tempSubtasks);
  };

  const handleAddSubtask = () => {
    if (subtasks.length < maxSubtasks) {
      let id = new Date().getTime();
      setSubtasks((prevState) => [
        ...prevState,
        {
          title: "",
          id,
        },
      ]);
    }
  };

  const handleStatusChange = (e) => {
    setStatus({
      name: e.target.value,
      value: e.target.name,
    });
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newDocument = {
      boardId,
      title,
      description,
      status,
      subtasks,
      uid,
    };
    console.log(newDocument)
    console.log(currentBoard)
    addDocument(newDocument);
  };

  useEffect(() => {  
   if (boards && id) {
     const newBoard = boards.filter((element) => element.id === id)[0];
     const activeColumns= newBoard.columns.filter(column=>column.active)

      setCurrentBoard(newBoard);
      setStatus({
        name: activeColumns[0].name,
        value: activeColumns[0].value,
      });
      setBoardId(newBoard.id);
    }

    if (response.succes) {
      navigate(-1);
    }
  }, [boards, id, response]);
  console.log(status)

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
              defaultValue={currentBoard && currentBoard.columns[0].name}
              name={currentBoard && currentBoard.columns[0].value}
              onChange={handleStatusChange}
              className="newBoard__form-select">
              {currentBoard &&
                currentBoard.columns.map((column) => {
                  if (column.active)
                    return (
                      <option
                        key={column.name}
                        value={column.name}
                        name={column.value}>
                        {column.value}
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
