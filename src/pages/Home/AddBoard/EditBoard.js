import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFirestore } from "../../../hooks/useFirestore";
import { useValidate } from "../../../hooks/useValidate";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import produce from "immer";
import { useTheme } from "../../../hooks/useTheme";

//styles
import "./EditBoard.css";

//assets
import CloseIcon from "../../../assets/icon-cross.svg";

//componenets
import Delete from "../../../components/Delete";

export default function EditBoard({ uid, boards, tasks }) {
  const {
    setDocument: setDocumentBoard,
    deleteDocument: deleteDocumentBoard,
    response: responseBoard,
  } = useFirestore("boards");
  const {
    setDocument: setDocumentTask,
    deleteDocument: deleteDocumentTask,
  } = useFirestore("tasks");

  const [currentBoard, setCurrentBoard] = useState(null);

  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");

  const [columns, setColumns] = useState(null);
  const [isAllColumns, setIsAllColumns] = useState(false);

  const [option, setOption] = useState("");

  const [isDelete, setIsDelete] = useState(false);

  const [isError, setIsError] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const { validate } = useValidate();

  const {darkMode} = useTheme()

  const ref = useRef();
  useOnClickOutside(ref, () => {
    navigate(-1);
  });

  const handleClearErrors = () => {
    setErrorName(false);
    setIsError(false);
    setDisplayMessage("");
  };

  const validation = () => {
    const validateName = validate("name", name);
    if (validateName) {
      setErrorName(validateName);

      return validateName;
    }

    let firstError = "";

    const validatedColumns = produce(columns, (draft) => {
      draft.forEach((element) => {
        element.error = false;
      });

      draft.every((element) => {
        const _validate = validate("column", element.value);

        if (_validate) {
          element.error = true;
          firstError = _validate;
          return false;
        } else return true;
      });
    });
    if (firstError) {
      setColumns(validatedColumns);
      return firstError;
    }
  };

  const boardDeleteDescription = `Are you sure you want to delete the ${
    currentBoard && currentBoard.name
  } board? This action will remove all columns and tasks and cannot be reversed.`;
  const titleDescription = `Delete this "${
    currentBoard && currentBoard.name
  }" board?`;

  const handleNameChange = (e) => {
    setName(e.target.value);
    handleClearErrors();
    setColumns(
      produce(columns, (draft) => {
        draft.forEach((element) => {
          element.error = false;
        });
      })
    );
  };
  const handleDeleteButton = (value) => {
    setIsDelete(value);
  };

  const handleDeleteBoard = () => {
    navigate("/boards", { replace: true });
    deleteDocumentBoard(currentBoard.id);
    tasks.forEach((element) => {
      if (element.boardId === currentBoard.id) {
        deleteDocumentTask(element.id);
      }
    });
  };

  const handleColumnDelete = (name) => {
    handleClearErrors();
    const activeColumns = columns.filter((element) => element.active);
    if (activeColumns.length === 4) {
      setIsAllColumns(false);
    }
    const newColumns = produce(columns, (draft) => {
      draft.forEach((element) => {
        if (element.name === name) {
          element.active = false;
        }
      });
    });
    setColumns(newColumns);
  };

  const handleAddColumn = () => {
    handleClearErrors();
    const _newColumns = produce(columns, (draft) => {
      draft.forEach((element) => {
        if (element.error) {
          element.error = false;
        }
      });
    });
    setColumns(_newColumns);

    if (option === "All Columns") {
      const newColumns = produce(columns, (draft) => {
        draft.forEach((element) => {
          if (element.active === false) {
            element.active = true;
            element.isEdited = true;
            element.value = element.name;
          }
        });
      });
      setColumns(newColumns);
    } else if (option === "") {
      setDisplayMessage("Choose a column");
    } else {
      const newColumns = produce(columns, (draft) => {
        draft.forEach((element) => {
          if (element.name === option) {
            element.active = true;
            element.value = element.name;
            element.isEdited = true;
          }
        });
      });
      setColumns(newColumns);
    }
    setOption("");
  };
  const handleColumnsChange = (e, column) => {
    handleClearErrors();
    const newColumns = produce(columns, (draft) => {
      draft.forEach((element) => {
        if (element.error) {
          element.error = false;
        }
        if (element.name === column.name) {
          element.value = e.target.value;
          element.isEdited = true;
        }
      });
    });
    setColumns(newColumns);
  };

  const createDocument = () => {
    const _columns = produce(columns, (draft) => {
      draft.forEach((element) => {
        delete element.error;
      });
    });

    const newBoard = produce(currentBoard, (draft) => {
      delete draft.id;
      draft.name = name;
      draft.columns = _columns;
    });

    return newBoard;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBoard = createDocument();

    const activeColumns = newBoard.columns.filter((column) => column.active);
    if (activeColumns.length === 0) {
      setIsError(true)
      setDisplayMessage("Add a column!");
      return;
    }
    setDisplayMessage("");
    const errorText = validation();
    if (errorText) {
      setDisplayMessage(errorText);
      return;
    }

    try {
      const currentTasks = tasks.filter(
        (task) => task.boardId === currentBoard.id
      );
      const newTasks = produce(currentTasks, (draft) => {
        newBoard.columns.forEach((column) => {
          if (column.active && column.isEdited) {
            draft.forEach((element) => {
              if (element.status.name === column.name) {
                element.status.value = column.value;
                element.delete = false;
              }
            });
          } else if (!column.active) {
            draft.forEach((element) => {
              if (element.status.name === column.name) {
                element.delete = true;
              }
            });
          }
        });
      });
      const _newBoard = produce(newBoard, (draft) => {
        draft.columns.forEach((element) => {
          delete element.isEdited;
        });
      });
      const errorUpdateBoard = await setDocumentBoard(
        _newBoard,
        currentBoard.id
      );
      if (errorUpdateBoard) {
        throw Error("Couldn't edit this board");
      }
      const deletedTasks = newTasks.filter((task) => task.delete === true);
      const updatedTasks = newTasks.filter((task) => task.delete === false);
      deletedTasks.forEach(async (task) => {
        const errorDeletetask = await deleteDocumentTask(task.id);
        if (errorDeletetask) {
          throw Error("Couldn't edit this board");
        }
      });
      updatedTasks.forEach(async (task) => {
        const newTask = produce(task, (draft) => {
          delete draft.delete;
          delete draft.id;
        });
        const errorUpdateTask = await setDocumentTask(newTask, task.id);
        if (errorUpdateTask) {
          
          throw Error ("Couldn't edit this board");
        }
      });
    } catch (error) {
      setDisplayMessage(error.message);
    }
  };

  useEffect(() => {
    if (responseBoard.succes) {
      navigate(-1);
    }
    if (boards) {
      const board = boards.filter((element) => element.id === id)[0];
      setCurrentBoard(board);
      setName(board.name);
      const _columns = produce(board.columns, (draft) => {
        draft.forEach((element) => {
          element.error = false;
        });
      });
      setColumns(_columns);
    }
  }, [responseBoard, boards, navigate, id]);

  useEffect(() => {
    if (columns) {
      const errorColumns = columns.filter((element) => element.error);
      if (errorName || errorColumns.length > 0) {
        setIsError(true);
      }
      const activeColumns = columns.filter((element) => element.active);
      if (activeColumns.length === 4) {
        setIsAllColumns(true);
      }
    }
  }, [columns, errorName]);

  return (
    <>
      {isDelete ? (
        <Delete
          handleDeleteButton={handleDeleteButton}
          handleDeleteElement={handleDeleteBoard}
          titleDescription={titleDescription}
          text={boardDeleteDescription}
        />
      ) : (
        <>
          <div className="background-color"></div>
          <section ref={ref} className={`editBoard ${darkMode?"darkMode--light":""}`}>
            <form onSubmit={handleSubmit} className="editBoard__form">
              <h2 className="editBoard__form-h2">
                Edit board "{currentBoard && currentBoard.name}""{" "}
              </h2>
              <div className="editBoard__form-span-wrapper">
                {currentBoard && (
                  <span className="editBoard__form-span editBoard__form-span--margin">
                    Created:
                    {new Date(
                      currentBoard.createdAt.seconds * 1000
                    ).toLocaleString()}
                  </span>
                )}
                {currentBoard && currentBoard.lastEdited && (
                  <span className="editBoard__form-span editBoard__form-span--margin">
                    Last Edited:
                    {new Date(
                      currentBoard.lastEdited.seconds * 1000
                    ).toLocaleString()}
                  </span>
                )}
              </div>
              <div className="editBoard__form-wrapper">
                <span className="editBoard__form-span">Name</span>
                <input
                  placeholder="e.g. Web Design"
                  type="text"
                  className={`editBoard__form-input ${
                    errorName ? "editBoard__form-input--error" : ""
                  } ${darkMode?"darkMode--light":""}`}
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
              <div className="editBoard__form-wrapper">
                <span className="editBoard__form-span">Columns</span>
                <select
                  className={`editBoard__form-select ${darkMode?"darkMode--select":""}`}
                  name="Column name"
                  defaultValue={""}
                  disabled={isAllColumns}
                  onChange={(e) => {
                    setOption(e.target.value);
                    handleClearErrors();
                  }}>
                  <option hidden value="">
                    {isAllColumns ? "All columns selected" : "Choose column"}
                  </option>
                  {columns &&
                    columns.map((item) => {
                      if (item.active === false) {                        
                        return (
                          <option key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        )
                        
                      };
                      return ""
                    })}
                  {!isAllColumns && (
                    <option value="All Columns">All Columns</option>
                  )}
                </select>

                {columns &&
                  columns.map((column) => {
                    if (column.name !== "All Columns") {
                      if (column.active === true)
                      {
                        return (
                          <div
                            key={column.name}
                            className="editBoard__form-input-wrapper">
                            <input
                              className={`editBoard__form-input ${
                                column.error
                                  ? "editBoard__form-input--error"
                                  : ""
                              } ${darkMode?"darkMode--light":""}`}
                              value={column.value}
                              onChange={(e) => handleColumnsChange(e, column)}
                            />

                            <button
                              type="button"
                              onClick={() => {
                                handleColumnDelete(column.name);
                              }}
                              className="editBoard__form-column-delete">
                              <img
                                className=" editBoard__form-column-delete-img"
                                src={CloseIcon}
                                alt="delete"
                              />
                            </button>
                          </div>
                        );
                        }
                    }
                    return ""
                      

                  })}
              </div>
              <p className="editBoard__form-alert">{displayMessage}</p>
              <div className="editBoard__form-wrapper">
                <button
                  onClick={handleAddColumn}
                  disabled={isAllColumns}
                  type="button"
                  className={`editBoard__form-button editBoard__form-button--light-purple ${
                    isAllColumns
                      ? "editBoard__form-button--light-purple-disabled"
                      : ""
                  } `}>
                  <p className="editBoard__form-button-p">+ Add New Column</p>
                </button>
                <div className="editBoard__form-buttons-wrapper">
                  <button
                    onClick={() => handleDeleteButton(true)}
                    type="button"
                    className="editBoard__form-button editBoard__form-button--delete">
                    <p className="editBoard__form-button-p">Delete Board</p>
                  </button>
                  <button
                    disabled={isError}
                    className={`editBoard__form-button editBoard__form-button--purple ${
                      isError ? "editBoard__form-button--disabled" : ""
                    }`}>
                    <p className="editBoard__form-button-p">Save Board</p>
                  </button>
                </div>
              </div>
            </form>
          </section>
        </>
      )}
    </>
  );
}
