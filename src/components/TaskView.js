import React from "react";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { useFirestore } from "../hooks/useFirestore";
import produce from "immer";

//styles
import "./TaskView.css";

//assets
import CloseIcon from "../assets/icon-cross.svg";
import Edit from "../assets/fontAwesome/pen-solid.svg";
import Trash from "../assets/fontAwesome/trash-solid.svg";

//components
import Delete from "./Delete";

export default function TaskView({ tasks, board }) {
  const { setDocument, deleteDocument, response } = useFirestore("tasks");

  const [task, setTask] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusValue, setStatusValue] = useState();
  const [subtasks, setSubtasks] = useState([]);
  const [completedSubtasks, setCompletedSubtasks] = useState([]);

  const [editTitle, setEditTitle] = useState(false);
  const [editDescription, setEditDescription] = useState(false);

  const [descriptionHeight, setDescriptionHeight] = useState("");
  const [titleHeight, setTitleHeight] = useState("");
  const [currentId, setCurrentId] = useState("");

  const [isDelete, setIsDelete] = useState(false);

  const taskDeleteDescription = `Are you sure you want to delete the ${
    task && task.title
  } task? This action will remove all informations and subtasks and cannot be reversed.`;
  const titleDescription = `Delete this task ?`;

  const maxSubtasks = 6;
  const { id } = useParams();
  const navigate = useNavigate();

  const ref = useRef();

  useOnClickOutside(ref, () => {
    setSubtasks(
      produce(subtasks, (draft) => {
        draft.forEach((subtask) => {
          if (subtask.id === currentId) {
            subtask.isEdited = false;
          }
        });
      })
    );
  });

  const sortByDate = (subtasks) => {
    const sortedSubtasks = produce(subtasks, (draft) => {
      draft.sort((a, b) => {
        return a.createdAt - b.createdAt;
      });
    });

    return sortedSubtasks;
  };
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

  const handleEditDescription = () => {
    setEditDescription(true);
  };
  const handleDescriptionChange = (e) => {
    if (description.length < 250) {
      setDescription(e.target.value);
    }
  };

  const handleDescriptionFocusOut = (e) => {
    setEditDescription(false);
  };
  const handleDescriptionHeight = (e) => {
    setDescriptionHeight(e.target.scrollHeight + "px");
  };
  const handleTitleHeight = (e) => {
    setTitleHeight(e.target.scrollHeight + "px");
  };
  const handleStatusChange = (e) => {
    setStatusValue(e.target.value);
  };

  const closeTaskView = () => {
    navigate(-1);
  };

  const handleSubtaskChange = (e, id, subtask) => {
    const newSubtasks = produce(subtasks, (draft) => {
      draft.forEach((subtask) => {
        if (subtask.id === id) {
          subtask.isCompleted = e.target.checked;
        }
      });
    });
    setCompletedSubtasks(newSubtasks.filter((subtask) => subtask.isCompleted));
    setSubtasks(newSubtasks);
  };

  const handleSubtaskTitleChange = (e, id) => {
    setSubtasks(
      produce(subtasks, (draft) => {
        draft.forEach((subtask) => {
          if (subtask.id === id) {
            subtask.title = e.target.value;
          }
        });
      })
    );
  };

  const handleEditSubtask = (e, id) => {
    setSubtasks(
      produce(subtasks, (draft) => {
        draft.forEach((subtask) => {
          if (subtask.id === id) {
            subtask.isEdited = true;
          }
        });
      })
    );
    setCurrentId(id);
  };

  const handleDeleteSubtask = (id) => {
    const newSubtasks = subtasks.filter((subtask) => subtask.id !== id);
    const newCompletedSubTasks = newSubtasks.filter(
      (subtask) => subtask.isCompleted
    );
    setSubtasks(newSubtasks);
    setCompletedSubtasks(newCompletedSubTasks);
  };
  const handleAddNewSubtask = () => {
    if (subtasks.length < maxSubtasks) {
      let id = new Date().getTime();
      let isEdited = false;

      subtasks.forEach((subtask) => {
        if (subtask.isEdited) {
          isEdited = true;
        }
      });
      if (!isEdited) {
        setSubtasks((prevState) => [
          ...prevState,
          {
            title: "new subtask",
            id,
            isCompleted: false,
            isEdited: true,
          },
        ]);
        setCurrentId(id);
      }
    }
  };
  const handleDeleteTask = () => {
    deleteDocument(task.id);
    navigate(-1);
  };

  const handleDeleteButton = (value) => {
    setIsDelete(value);
  };

  const createTask = () => {
    const newSubtasks = produce(subtasks, (draft) => {
      draft.forEach((subtask) => {
        delete subtask.isEdited;
      });
    });
    const newTask = produce(task, (draft) => {
      delete draft.id;
    });
    const newDocument = {
      ...newTask,
      description,
      status: { ...newTask.status, name: statusValue },
      subtasks: newSubtasks,
      title,
    };
    return newDocument;
  };

  const handleOnSubmit = (e) => {
    console.log("dziwka");
    e.preventDefault();
    const newDocument = createTask();

    setDocument(newDocument, task.id);
  };

  useEffect(() => {
    if (tasks && id) {
      const newTask = tasks.filter((task) => task.id === id)[0];
      const newSubtasks = produce(newTask.subtasks, (draft) => {
        draft.forEach((subtask) => {
          subtask.isEdited = false;
        });
      });
      setTask(newTask);
      setStatusValue(newTask.status.name);
      setSubtasks(newSubtasks);
      setDescription(newTask.description);
      setTitle(newTask.title);
      setCompletedSubtasks(
        newTask.subtasks.filter((subtask) => subtask.isCompleted)
      );
    }

    if (response && response.succes) {
      navigate(-1);
    }
  }, [tasks, response, id, navigate]);

  return (
    <>
      {isDelete ? (
        <Delete
          handleDeleteButton={handleDeleteButton}
          handleDeleteElement={handleDeleteTask}
          titleDescription={titleDescription}
          text={taskDeleteDescription}
        />
      ) : (
        <>
          <div className="background-color"></div>
          <section className="taskView">
            <button className="taskView__close-button" onClick={closeTaskView}>
              <img
                src={CloseIcon}
                alt="close"
                className="taskView__close-img"
              />
            </button>
            <form onSubmit={handleOnSubmit} className="taskView__form">
              <div className="taskView__form-wrapper taskView__form-wrapper--title">
                {editTitle ? (
                  <textarea
                    className="taskView__form-input taskView__form-input--title .taskView__form-input::-webkit-scrollbar"
                    required={true}
                    type="text"
                    maxLength={100}
                    value={title}
                    autoFocus
                    style={{ height: titleHeight }}
                    onFocus={handleTitleHeight}
                    onInput={handleTitleHeight}
                    onChange={handleTitleChange}
                    onBlur={handleTitleFocusOut}></textarea>
                ) : (
                  <>
                    <h2 className="taskView__form-h2">{title && title}</h2>
                    <button onClick={handleEditTitle} className="edit">
                      <img className="edit__img" src={Edit} alt="edit" />
                    </button>
                  </>
                )}
              </div>
              <div className="taskView__form-span-wrapper">
                {task && (
                  <span className="taskView__form-span taskView__form-span--margin">
                    Created:
                    {new Date(
                      task.createdAt.seconds * 1000
                    ).toLocaleDateString()}
                  </span>
                )}
                {task && task.lastEdited && (
                  <span className="taskView__form-span taskView__form-span--margin">
                    Edited:
                    {new Date(
                      task.lastEdited.seconds * 1000
                    ).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="taskView__form-wrapper">
                <span className="taskView__form-span">Description</span>
                {editDescription ? (
                  <textarea
                    className="taskView__form-input taskView__form-input--description .taskView__form-input::-webkit-scrollbar"
                    rows="1"
                    type="text"
                    value={description}
                    autoFocus
                    maxLength={250}
                    style={{ height: descriptionHeight }}
                    onChange={handleDescriptionChange}
                    onFocus={handleDescriptionHeight}
                    onInput={handleDescriptionHeight}
                    onBlur={handleDescriptionFocusOut}></textarea>
                ) : (
                  <div className="taskView__form-subtask-wrapper">
                    <p className="taskView__form-description">
                      {description && description}
                    </p>
                    <button
                      onClick={handleEditDescription}
                      className="edit edit--description">
                      <img className="edit__img" src={Edit} alt="edit" />
                    </button>
                  </div>
                )}
              </div>
              <div className="taskView__form-wrapper taskView__form-wrapper--subtasks">
                <span className="taskView__form-span">{`Subtasks (${
                  completedSubtasks.length
                } of ${subtasks && subtasks.length})`}</span>
                {subtasks &&
                  sortByDate(subtasks).map((subtask) => {
                    return (
                      <div
                        key={subtask.id}
                        className="taskView__form-subtask-wrapper">
                        <label
                          ref={subtask.isEdited ? ref : null}
                          className={`taskView__label`}>
                          <input
                            className={`taskView__form-input-checkbox taskView__form-input-checkbox--subtask `}
                            type="checkbox"
                            onChange={(e) =>
                              handleSubtaskChange(e, subtask.id, subtask)
                            }
                            checked={subtask.isCompleted ? true : false}
                          />

                          {!subtask.isEdited ? (
                            <>
                              <span
                                className={`taskView__form-span taskView__form-span--checked ${
                                  !subtask.isCompleted &&
                                  "taskView__form-span--unchecked"
                                }`}>
                                {subtask.title}
                              </span>
                            </>
                          ) : (
                            <>
                              <textarea
                                className="taskView__form-input taskView__form-input--subtask .taskView__form-input::-webkit-scrollbar"
                                maxLength={150}
                                value={subtask.title}
                                onChange={(e) =>
                                  handleSubtaskTitleChange(e, subtask.id)
                                }
                                autoFocus
                              />
                              <button
                                onClick={() => handleDeleteSubtask(subtask.id)}
                                className={`edit edit--delete-subtask `}>
                                <img
                                  className="edit__img"
                                  src={Trash}
                                  alt="edit"
                                />
                              </button>
                            </>
                          )}
                        </label>
                        {!subtask.isEdited && (
                          <>
                            {" "}
                            <button
                              onClick={() => handleDeleteSubtask(subtask.id)}
                              className={`edit edit--delete-subtask `}>
                              <img
                                className="edit__img"
                                src={Trash}
                                alt="edit"
                              />
                            </button>
                            <button
                              onClick={(e) => handleEditSubtask(e, subtask.id)}
                              className={`edit edit--description `}>
                              <img
                                className="edit__img"
                                src={Edit}
                                alt="edit"
                              />
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                <button
                  onClick={handleAddNewSubtask}
                  type="button"
                  className="taskView__form-button taskView__form-button--light-purple">
                  <p className="taskView__form-button-p">Add new Subtask</p>
                </button>
              </div>
              <div className="taskView__form-wrapper">
                <span className="taskView__form-span"> Current Status</span>
                <div className="taskView__form-input-wrapper">
                  {board &&
                    board.columns.map((column) => {
                      if (column.active)
                        return (
                          <div
                            key={column.name}
                            className="taskView__form-checkbox-wrapper">
                            <label className="taskView__label">
                              <input
                                className="taskView__form-input-checkbox"
                                type="checkbox"
                                value={column.name}
                                name={column.name}
                                checked={
                                  statusValue === column.name ? true : false
                                }
                                onChange={handleStatusChange}
                              />
                              <span className="taskView__form-input-label">
                                {column.value}
                              </span>
                            </label>
                          </div>
                        );
                    })}
                </div>
              </div>
              <div className="taskView__form-buttons-wrapper">
                <button
                  onClick={() => handleDeleteButton(true)}
                  type="button"
                  className="taskView__form-button taskView__form-button--delete">
                  <p className="taskView__form-button-p">Delete Task</p>
                </button>
                <button className="taskView__form-button taskView__form-button--purple">
                  <p className="taskView__form-button-p">Save Task</p>
                </button>
              </div>
            </form>
          </section>
        </>
      )}
    </>
  );
}
