import React from "react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

//styles
import "./TaskView.css";

//assets
import CloseIcon from "../assets/icon-cross.svg";
import Edit from "../assets/fontAwesome/pen-solid.svg";

export default function TaskView({
  task,
  completedSubtasks: _completedSubtasks,
  currentColumns,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusValue, setStatusValue] = useState();
  const [subtasks, setSubtasks] = useState([]);
  const [completedSubtasks, setCompletedSubtasks] = useState([]);

  const [editTitle, setEditTitle] = useState(false);
  const [editDescription, setEditdescription] = useState(false);

  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleTitleFocusOut = () => {
    if (title.length > 0) {
      setEditTitle(false);
    }
  };
  const handleEditTitle = () => {
    setEditTitle(true);
  };
  const handleStatusChange = (e) => {
    setStatusValue(e.target.value);
  };

  const closeTaskView = () => {
    navigate(-1);
  };

  const handleSubtaskChange = (e, id) => {
    let tempSubtasks = [...subtasks];
    let tempCompletedSubtasks = [];
    tempSubtasks.forEach((tempSubtask) => {
      if (tempSubtask.id === id) {
        tempSubtask.isCompleted = e.target.checked;
      }
      if (tempSubtask.isCompleted) {
        tempCompletedSubtasks.push(tempSubtask);
      }
    });
    setCompletedSubtasks(tempCompletedSubtasks);
    setSubtasks(tempSubtasks);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (task) {
      let tempSubtasks = [...task.subtasks];
      tempSubtasks.forEach((tempSubtask) => {
        tempSubtask.isEdited = false;
      });

      setStatusValue(task.status);
      setSubtasks(tempSubtasks);
      setDescription(task.description);
      setTitle(task.title);
    }

    if (_completedSubtasks) {
      setCompletedSubtasks(_completedSubtasks);
    }
  }, [task, _completedSubtasks]);
  console.log(subtasks);

  return (
    <>
      <div className="background-color"></div>
      <section className="taskView">
        <button className="taskView__close-button" onClick={closeTaskView}>
          <img src={CloseIcon} alt="close" className="taskView__close-img" />
        </button>
        <form onSubmit={handleOnSubmit} className="taskView__form">
          <div className="taskView__form-wrapper taskView__form-wrapper--title">
            {editTitle ? (
              <input
                className="taskView__form-input taskView__form-input--title"
                required={true}
                type="text"
                value={title}
                autoFocus
                onChange={handleTitleChange}
                onBlur={handleTitleFocusOut}></input>
            ) : (
              <>
                <h2 className="taskView__form-h2">{title && title}</h2>
                <button onClick={handleEditTitle} className="edit">
                  <img className="edit__img" src={Edit} alt="edit" />
                </button>
              </>
            )}
          </div>

          <div className="taskView__form-wrapper">
            <span className="taskView__form-span">Description</span>
            {editDescription ? null : (
             
                <div className="taskView__form-subtask-wrapper">
                  <p className="taskView__form-description">
                    {description && description}
                  </p>
                  <button
                    onClick={handleEditTitle}
                    className="edit edit--description">
                    <img className="edit__img" src={Edit} alt="edit" />
                  </button>
                </div>
             
            )}

            <span className="taskView__form-span taskView__form-span--margin">
              Created:{" "}
              {new Date(task.createdAt.seconds * 1000).toLocaleString()}
            </span>
          </div>
          <div className="taskView__form-wrapper taskView__form-wrapper--subtasks">
            <span className="taskView__form-span">{`Subtasks (${
              completedSubtasks.length
            } of ${subtasks && subtasks.length})`}</span>
            {subtasks &&
              subtasks.map((subtask) => {
                return (
                  <div
                    key={subtask.id}
                    className="taskView__form-subtask-wrapper">
                    <input
                      className="taskView__form-input-checkbox taskView__form-input-checkbox--subtask"
                      type="checkbox"
                      onChange={(e) => handleSubtaskChange(e, subtask.id)}
                      checked={subtask.isCompleted ? true : false}
                    />
                    <span
                      className={`taskView__form-span taskView__form-span--checked ${
                        !subtask.isCompleted && "taskView__form-span--unchecked"
                      }`}>
                      {subtask.title}
                    </span>
                  </div>
                );
              })}
          </div>
          <div className="taskView__form-wrapper">
            <span className="taskView__form-span"> Current Status</span>
            <div className="taskView__form-input-wrapper">
              {currentColumns &&
                currentColumns.map((currentColumn) => {
                  return (
                    <>
                      <div
                        key={currentColumn}
                        className="taskView__form-checkbox-wrapper">
                        <input
                          className="taskView__form-input-checkbox"
                          type="checkbox"
                          value={currentColumn}
                          name={currentColumn}
                          checked={statusValue === currentColumn ? true : false}
                          onChange={handleStatusChange}
                        />
                        <label className="taskView__form-input-label">
                          {currentColumn}
                        </label>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
          <div className="taskView__form-wrapper">
            <button
              type="button"
              className="taskView__form-button taskView__form-button--light-purple">
              <p className="taskView__form-button-p">Delete</p>
            </button>
            <button className="taskView__form-button taskView__form-button--purple">
              <p className="taskView__form-button-p">Save</p>
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
