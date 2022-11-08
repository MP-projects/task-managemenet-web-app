import React from "react";
import { useEffect, useState, useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { useFirestore } from "../../../hooks/useFirestore";
import produce from "immer";
import { useValidate } from "../../../hooks/useValidate";
import { useTheme } from "../../../hooks/useTheme";

//styles
import "./TaskView.css";

//assets
import Edit from "../../../assets/fontAwesome/pen-solid.svg";
import Trash from "../../../assets/fontAwesome/trash-solid.svg";

//components
import Delete from "../../../components/Delete";

export default function TaskView({ tasks, board }) {
  const { setDocument, deleteDocument, response } = useFirestore("tasks");

  const [task, setTask] = useState(null);

  const [title, setTitle] = useState("");
  const [errorTitle, setErrorTitle] = useState("");

  const [description, setDescription] = useState("");
  const [errorDescription, setErrorDescription] = useState("");

  const [statusValue, setStatusValue] = useState();
  const [subtasks, setSubtasks] = useState([]);
  const [completedSubtasks, setCompletedSubtasks] = useState([]);

  const [editTitle, setEditTitle] = useState(false);
  const [editDescription, setEditDescription] = useState(false);

  const [descriptionHeight, setDescriptionHeight] = useState("");
  const [titleHeight, setTitleHeight] = useState("");
  const [currentId, setCurrentId] = useState("");

  const [isDelete, setIsDelete] = useState(false);

  const [isError, setIsError] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");

  const taskDeleteDescription = `Are you sure you want to delete the ${
    task && task.title
  } task? This action will remove all informations and subtasks and cannot be reversed.`;
  const titleDescription = `Delete this task ?`;

  const maxSubtasks = 6;
  const { darkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { validate } = useValidate();
  const ref = useRef();
  const refSubtask = useRef();
  
  useOnClickOutside(ref, () => {
    navigate(-1);
  });

  useOnClickOutside(refSubtask, () => {
    let firstError = false;
    const validatedSubtasks = produce(subtasks, (draft) => {
      draft.every((subtask) => {
        const validateSubtask = validate("text", subtask.title);
        if (validateSubtask) {
          subtask.error = true;
          setIsError(true);
          setDisplayMessage(validateSubtask);
          firstError = true;
          return false;
        } else return true;
      });
    });
    if (firstError) {
      setSubtasks(validatedSubtasks);
    } else {
      setSubtasks(
        produce(subtasks, (draft) => {
          draft.forEach((subtask) => {
            if (subtask.id === currentId) {
              subtask.isEdited = false;
            }
          });
        })
      );
    }
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
    setErrorTitle(false);
    setIsError(false);
    setDisplayMessage("");
    setTitle(e.target.value);
  };
  const handleTitleFocusOut = () => {
    const validateTitle = validate("title", title);
    if (validateTitle) {
      setErrorTitle(validateTitle);
      setDisplayMessage(validateTitle);
      return;
    } else {
      setEditTitle(false);
    }
  };
  const handleEditTitle = () => {
    if (!isError) {
      setEditTitle(true);
    }
  };

  const handleEditDescription = () => {
    if (!isError) {
      setEditDescription(true);
    }
  };
  const handleDescriptionChange = (e) => {
    setErrorDescription(false);
    setDisplayMessage("");
    setIsError(false);
    setDescription(e.target.value);
  };

  const handleDescriptionFocusOut = (e) => {
    const validateDescription = validate("description", description);
    if (validateDescription) {
      setErrorDescription(validateDescription);
      setDisplayMessage(validateDescription);
      return;
    } else {
      setEditDescription(false);
    }
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
            subtask.error = false;
            subtask.title = e.target.value;
            setIsError(false);
            setDisplayMessage(false);
          }
        });
      })
    );
  };

  const handleEditSubtask = (e, id) => {
    if (!isError) {
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
    }
  };

  const handleDeleteSubtask = (id) => {
    if (!isError) {
      const newSubtasks = subtasks.filter((subtask) => subtask.id !== id);
      const newCompletedSubTasks = newSubtasks.filter(
        (subtask) => subtask.isCompleted
      );
      setSubtasks(newSubtasks);
      setCompletedSubtasks(newCompletedSubTasks);
    }
  };
  const handleAddNewSubtask = () => {
    if (subtasks.length < maxSubtasks) {
      let id = new Date().getTime();

      setSubtasks((prevState) => [
        ...prevState,
        {
          title: "new subtask",
          id,
          isCompleted: false,
          isEdited: true,
          error: false,
        },
      ]);
      setCurrentId(id);
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
        delete subtask.error;
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

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setDisplayMessage("");
    try {
      const newDocument = createTask();
      const errorUpdateDocument = await setDocument(newDocument, task.id);
      if (errorUpdateDocument) {
        throw Error("Couldn't update this task");
      }
    } catch (error) {
      setDisplayMessage(error.message);
    }
  };

  useEffect(() => {
    if (tasks && id) {
      const newTask = tasks.filter((task) => task.id === id)[0];
      const newSubtasks = produce(newTask.subtasks, (draft) => {
        draft.forEach((subtask) => {
          subtask.isEdited = false;
          subtask.error = false;
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

  useEffect(() => {
    if (errorTitle || errorDescription) {
      setIsError(true);
    }
  }, [errorTitle, errorDescription]);

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
          <section ref={ref} className={`taskView ${darkMode?"darkMode--light":""}`}>
            <form
              onSubmit={handleOnSubmit}
              className={`taskView__form ${darkMode ? "darkMode" : ""}`}>
              <div className="taskView__form-wrapper taskView__form-wrapper--title">
                {editTitle ? (
                  <textarea
                    className={`taskView__form-input taskView__form-input--title ${
                      errorTitle ? "taskView__form-input--error" : ""
                    } ${darkMode?"darkMode--light":""}`}
                    required={true}
                    type="text"
                    maxLength={150}
                    value={title}
                    autoFocus
                    style={{ height: titleHeight }}
                    onFocus={handleTitleHeight}
                    onInput={handleTitleHeight}
                    onChange={handleTitleChange}
                    onBlur={handleTitleFocusOut}></textarea>
                ) : (
                  <>
                    <h2 className={`taskView__form-h2 ${darkMode?"darkMode--light":""}`}>{title && title}</h2>
                    <button
                      type="button"
                      onClick={handleEditTitle}
                      className="edit">
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
                    className={`taskView__form-input taskView__form-input--description ${
                      errorDescription ? "taskView__form-input--error" : ""
                    } ${darkMode?"darkMode--light":""}`}
                    rows="1"
                    type="text"
                    value={description}
                    autoFocus
                    maxLength={300}
                    style={{ height: descriptionHeight }}
                    onChange={handleDescriptionChange}
                    onFocus={handleDescriptionHeight}
                    onInput={handleDescriptionHeight}
                    onBlur={handleDescriptionFocusOut}></textarea>
                ) : (
                      <div className={`taskView__form-subtask-wrapper ${darkMode?"darkMode--dark":""}`}>
                    <p className="taskView__form-description">
                      {description && description}
                    </p>
                    <button
                      type="button"
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
                        className={`taskView__form-subtask-wrapper ${darkMode?"darkMode--dark":""} ${(darkMode&&!subtask.isCompleted?"darkMode--subtask-inactive":"")}`}>
                        <label
                          ref={subtask.isEdited ? refSubtask : null}
                          className={`taskView__label`}>
                          <input
                            className={`taskView__form-input-checkbox taskView__form-input-checkbox--subtask ${darkMode?"darkMode--dark-checkbox":""}`}
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
                                } ${(darkMode&&!subtask.isCompleted?"darkMode--span-inactive":"")}`}>
                                {subtask.title}
                              </span>
                            </>
                          ) : (
                            <>
                              <textarea
                                className={`taskView__form-input taskView__form-input--subtask ${
                                  subtask.error
                                    ? "taskView__form-input--error"
                                    : ""
                                } ${darkMode?"darkMode--light":""}`}
                                maxLength={150}
                                value={subtask.title}
                                onChange={(e) =>
                                  handleSubtaskTitleChange(e, subtask.id)
                                }
                                autoFocus
                              />
                              <button
                                type="button"
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
                              type="button"
                              onClick={() => handleDeleteSubtask(subtask.id)}
                              className={`edit edit--delete-subtask `}>
                              <img
                                className="edit__img"
                                src={Trash}
                                alt="edit"
                              />
                            </button>
                            <button
                              type="button"
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
                  disabled={isError}
                  onClick={handleAddNewSubtask}
                  type="button"
                  className={`taskView__form-button taskView__form-button--light-purple ${
                    isError
                      ? "taskView__form-button--light-purple-disabled"
                      : ""
                  }`}>
                  <p className="taskView__form-button-p">Add new Subtask</p>
                </button>
              </div>
              <div className="taskView__form-wrapper">
                <span className="taskView__form-span"> Current Status</span>
                <div className={`taskView__form-input-wrapper ${darkMode?"darkMode--dark":""}`}>
                  {board &&
                    board.columns.map((column) => {
                      if (column.active)
                        return (
                          <div
                            key={column.name}
                            className="taskView__form-checkbox-wrapper">
                            <label className="taskView__label">
                              <input
                                className={`taskView__form-input-checkbox ${darkMode?"darkMode--dark-checkbox":""}`}
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
                      return ""
                    })}
                </div>
              </div>
              <p className="taskView__form-alert">{displayMessage}</p>
              <div className="taskView__form-buttons-wrapper">
                <button
                  onClick={() => handleDeleteButton(true)}
                  type="button"
                  className="taskView__form-button taskView__form-button--delete">
                  <p className="taskView__form-button-p">Delete Task</p>
                </button>
                <button
                  disabled={isError}
                  className={`taskView__form-button taskView__form-button--purple ${
                    isError ? "taskView__form-button--purple-disabled" : ""
                  }`}>
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
