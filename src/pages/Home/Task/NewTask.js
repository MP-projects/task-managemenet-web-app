import React from "react";
import { useState, useEffect, useRef } from "react";
import { useFirestore } from "../../../hooks/useFirestore";
import { useNavigate, useParams } from "react-router-dom";
import produce from "immer";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { useValidate } from "../../../hooks/useValidate";
import { useTheme } from "../../../hooks/useTheme";

//styles
import "./NewTask.css";

//assets
import CloseIcon from "../../../assets/icon-cross.svg";

export default function NewTask({ boards, uid }) {
  const { addDocument, response } = useFirestore("tasks");

  const [currentBoard, setCurrentBoard] = useState(null);

  const [boardId, setBoardId] = useState("");

  const [title, setTitle] = useState("");
  const [errorTitle, setErrorTitle] = useState("");

  const [description, setDescription] = useState("");
  const [errorDescription, setErrorDescription] = useState("");

  const [status, setStatus] = useState({ name: "", value: "" });

  const [subtasks, setSubtasks] = useState([]);
  const [isAllSubtasks, setIsAllSubtasks] = useState(false);

  const [isError, setIsError] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");

  const maxSubtasks = 6;

  const { id } = useParams();
  const {darkMode} = useTheme()
  const { validate } = useValidate();
  const navigate = useNavigate();
  const ref = useRef();
  useOnClickOutside(ref, () => {
    navigate(-1);
  });

  const handleClearErrors = () => {
    setErrorTitle("");
    setErrorDescription("");
    setIsError("");
    setDisplayMessage("");
  };
  const validation = () => {
    const validateTitle = validate("title", title);
    if (validateTitle) {
      setErrorTitle(validateTitle);

      return validateTitle;
    }
    const validateDescription = validate("description", description);
    if (validateDescription) {
      setErrorDescription(validateDescription);

      return validateDescription;
    }

    let firstError = "";
    if (subtasks.length > 0) {
      const validatedSubtasks = produce(subtasks, (draft) => {
        draft.forEach((element) => {
          element.error = false;
        });

        draft.every((element) => {
          const _validate = validate("text", element.title);

          if (_validate) {
            element.error = true;
            firstError = _validate;
            return false;
          } else return true;
        });
      });
      if (firstError) {
        setSubtasks(validatedSubtasks);
        return firstError;
      }
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    handleClearErrors();
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    handleClearErrors();
  };

  const handleChangeSubtaskName = (e, id) => {
    handleClearErrors();
    setSubtasks(
      produce(subtasks, (draft) => {
        draft.forEach((subtask) => {
          if (subtask.error) {
            subtask.error = false;
          }
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
    handleClearErrors();
    setIsAllSubtasks(false);
    const _subtasks = produce(subtasks, (draft) => {
      draft.forEach((element) => {
        element.error = false;
      });
    });
    let tempSubtasks = _subtasks.filter((subtask) => subtask.id !== id);
    setSubtasks(tempSubtasks);
  };

  const handleAddSubtask = () => {
    handleClearErrors();
    if (subtasks.length < maxSubtasks) {
      let id = new Date().getTime();
      setSubtasks(
        produce(subtasks, (draft) => {
          draft.forEach((element) => {
            element.error = false;
          });
          draft.push({
            title: "",
            error: false,
            id,
          });
        })
      );
    }
  };

  const handleStatusChange = (e) => {
    setStatus({
      name: e.target.value,
      value: e.target.name,
    });
  };

  const createTask = () => {
    const _subtasks = produce(subtasks, (draft) => {
      draft.forEach((element) => {
        delete element.error;
      });
    });
    const newDocument = {
      boardId,
      title,
      description,
      status,
      subtasks: _subtasks,
      uid,
    };
    return newDocument;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorText = validation();
    if (errorText) {
      setDisplayMessage(errorText);
      return;
    }
    const newDocument = createTask();
    try {
      const errorAdd = await addDocument(newDocument);
      if (errorAdd) {
        throw Error("Couldn't add new Task");
      }
    } catch (error) {
      setDisplayMessage(error.messsage);
    }
  };

  useEffect(() => {
    if (subtasks.length === maxSubtasks) {
      setIsAllSubtasks(true);
    }
    const errorSubtasks = subtasks.filter((element) => element.error);
    if (errorTitle || errorDescription || errorSubtasks.length > 0) {
      setIsError(true);
    }

    if (boards && id) {
      const newBoard = boards.filter((element) => element.id === id)[0];
      const activeColumns = newBoard.columns.filter((column) => column.active);

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
  }, [boards, id, response, errorTitle, errorDescription, subtasks, navigate]);
 
  return (
    <>
      <div className="background-color"></div>
      <section ref={ref} className={`newTask ${darkMode?"darkMode--light":""}`}>
        <form onSubmit={handleSubmit} className="newTask__form">
          <h2 className="newTask__form-h2">Add new Task</h2>
          <div className="newTask__form-wrapper">
            <span className="newTask__form-span">Title</span>
            <input
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Take coffe break"
              maxLength={150}
              type="text"
              className={`newTask__form-input ${
                errorTitle ? "newTask__form-input--error" : ""
              } ${darkMode?"darkMode--light":""}`}
            />
          </div>
          <div className="newTask__form-wrapper">
            <span className="newTask__form-span">description</span>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="e.g. It’s always good to take a break. This 15 minute break will 
             recharge the batteries a little."
              maxLength={300}
              className={`newTask__form-input newTask__form-input--description ${
                errorDescription ? "newTask__form-input--error" : ""
              } ${darkMode?"darkMode--light":""}`}
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
                      maxLength={100}
                      onChange={(e) => handleChangeSubtaskName(e, subtask.id)}
                      value={subtask.title}
                      placeholder="e.g do something"
                      className={`newTask__form-input ${
                        subtask.error ? "newTask__form-input--error" : ""
                      } ${darkMode?"darkMode--light":""}`}
                    />
                    <button
                      onClick={() => handleSubtaskDelete(subtask.id)}
                      type="button"
                      className="newTask__form-column-delete">
                      <img
                        className=" newTask__form-column-delete-img"
                        src={CloseIcon}
                        alt="delete"
                      />
                    </button>
                  </div>
                );
              })}

            <button
              onClick={handleAddSubtask}
              disabled={isAllSubtasks}
              type="button"
              className={`newTask__form-button newTask__form-button--light-purple ${
                isAllSubtasks
                  ? "newTask__form-button--light-purple-disabled"
                  : ""
              }`}>
              <p className="newTask__form-button-p">+ Add New Subtask</p>
            </button>
            <select
              defaultValue={currentBoard && currentBoard.columns[0].name}
              name={currentBoard && currentBoard.columns[0].value}
              onChange={handleStatusChange}
              className={`newBoard__form-select ${darkMode?"darkMode--select":""}`}>
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
                  return ""
                })}
            </select>
            <p className="newTask__form-alert">{displayMessage}</p>
            <button
              disabled={isError}
              className={`newTask__form-button newTask__form-button--purple ${
                isError ? "newTask__form-button--purple-disabled" : ""
              }`}>
              <p className="newTask__form-button-p">Create New Task</p>
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
