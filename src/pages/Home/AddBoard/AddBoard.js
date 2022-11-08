import React, { useState, useEffect, useRef } from "react";
import { useNavigate} from "react-router-dom";
import { useFirestore } from "../../../hooks/useFirestore";
import produce from "immer";
import { useValidate } from "../../../hooks/useValidate";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { useTheme } from "../../../hooks/useTheme";

//styles
import "./AddBoard.css";

//assets
import CloseIcon from "../../../assets/icon-cross.svg";

export default function AddBoard({ uid, boards }) {
  const initialColumns = [
    { active: false, name: "Todo", value: "Todo", error: false },
    { active: false, name: "Doing", value: "Doing", error: false },
    { active: false, name: "Done", value: "Done", error: false },
    { active: false, name: "Custom", value: "Custom", error: false },
  ];

  const [columns, setColumns] = useState(initialColumns);

  const [option, setOption] = useState("");
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");

  const [isAllColumns, setIsAllColumns] = useState(false);

  const [isError, setIsError] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");

  const { addDocument, response } = useFirestore("boards");

  const { validate } = useValidate();

  const { darkMode } = useTheme();

  const navigate = useNavigate();

  const ref = useRef();
  useOnClickOutside(ref, () => {
    navigate(-1);
  });

  const handleClearErrors = () => {
    setErrorName(false);
    setIsError(false);
    setDisplayMessage("");
  };

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

  const handleColumnsChange = (e, column) => {
    handleClearErrors();
    const newColumns = produce(columns, (draft) => {
      draft.forEach((element) => {
        if (element.error) {
          element.error = false;
        }
        if (element.name === column.name) {
          element.value = e.target.value;
        }
      });
    });
    setColumns(newColumns);
  };

  const handleColumnDelete = (columnName) => {
    handleClearErrors();
    const activeColumns = columns.filter((element) => element.active);
    if (activeColumns.length === initialColumns.length) {
      setIsAllColumns(false);
    }
    const newColumns = produce(columns, (draft) => {
      draft.forEach((element) => {
        if (element.error) {
          element.error = false;
        }
        if (element.name === columnName) {
          element.active = false;
          element.value = element.name;
        }
      });
    });
    setColumns(newColumns);
  };

  const handleAddColumn = () => {
    handleClearErrors();
    if (option === "All Columns") {
      const newColumns = produce(columns, (draft) => {
        draft.forEach((element) => {
          element.active = true;
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
          }
        });
      });
      setColumns(newColumns);
    }

    setOption("");
  };

  const createNewDocument = () => {
    const _columns = produce(columns, (draft) => {
      draft.forEach((element) => {
        delete element.error;
      });
    });
    let newDocument = {
      name,
      columns: _columns,
      uid,
    };
    return newDocument;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisplayMessage("");
    const activeColumns = columns.filter((element) => element.active === true);
    if (activeColumns.length === 0) {
      setDisplayMessage("Add a column!");
      return;
    }
    const errorText = validation();
    if (errorText) {
      setDisplayMessage(errorText);
      return;
    }
    const newDocument = createNewDocument();
    try {
      const errorCreateBoard = await addDocument(newDocument);
      if (errorCreateBoard) {
        throw Error ("Couldn't create new board");
      }
    } catch (error) {
      setDisplayMessage(error.message);
    }
  };

  useEffect(() => {
    const errorColumns = columns.filter((element) => element.error);
    if (errorName || errorColumns.length > 0) {
      setIsError(true);
    }

    const activeColumns = columns.filter((element) => element.active);
    if (activeColumns.length === initialColumns.length) {
      setIsAllColumns(true);
    }

    if (response.succes) {
      if (boards) {
        const sortedBoards = produce(boards, (draft) => {
          draft.sort((a, b) => {
            return b.createdAt - a.createdAt;
          });
        });
        navigate(`/home/boards/${sortedBoards[0].id}`, { replace: true });
      } else {
        navigate(-1);
      }
    }
  }, [response.succes, boards, columns, errorName, initialColumns.length, navigate]);

  return (
    <>
      <div className="background-color"></div>
      <section
        ref={ref}
        className={`newBoard ${darkMode ? "darkMode--light" : ""}`}>
        <form onSubmit={handleSubmit} className="newBoard__form">
          <h2 className="newBoard__form-h2">Create New Board</h2>
          <div className="newBoard__form-wrapper">
            <span className="newBoard__form-span">Name</span>
            <input
              placeholder="e.g. Web Design"
              type="text"
              className={`newBoard__form-input ${
                errorName ? "newBoard__form-input--error" : ""
              } ${darkMode ? "darkMode--light" : ""}`}
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <div className="newBoard__form-wrapper">
            <span className="newBoard__form-span">Columns</span>
            <div className="select">
            <select
              className={`newBoard__form-select ${
                darkMode ? "darkMode--select" : ""
              }`}
              name="Column name"
              defaultValue={""}
              disabled={isAllColumns}
              onChange={(e) => {
                e.target.value && setOption(e.target.value);
                handleClearErrors();
              }}>
              <option
                
                hidden
                value="">
                {isAllColumns ? "All columns selected" : "Choose column"}
              </option>
              {columns &&
                columns.map((item) => {
                  if (item.active === false)
                    return (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    );
                  return ""
                })}
              {!isAllColumns && (
                <option value="All Columns">All Columns</option>
              )}
              </select>
              </div>

            {columns &&
              columns.map((column) => {
                if (column.value !== "All Columns")
                  if (column.active === true)
                    return (
                      <div
                        key={column.name}
                        className="newBoard__form-input-wrapper">
                        <input
                          className={`newBoard__form-input ${
                            column.error ? "newBoard__form-input--error" : ""
                          } ${darkMode?"darkMode--light":""}`}
                          value={column.value}
                          onChange={(e) => {
                            handleColumnsChange(e, column);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            handleColumnDelete(column.name);
                          }}
                          className="newBoard__form-column-delete">
                          <img
                            className=" newBoard__form-column-delete-img"
                            src={CloseIcon}
                            alt="delete"
                          />
                        </button>
                      </div>
                    );
                return ""
              })}

            <p className="newBoard__form-alert">{displayMessage}</p>
          </div>
          <div className="newBoard__form-wrapper">
            <button
              onClick={handleAddColumn}
              type="button"
              disabled={isAllColumns}
              className="newBoard__form-button newBoard__form-button--light-purple">
              <p className="newBoard__form-button-p">+ Add New Column</p>
            </button>
            <button
              disabled={isError}
              className={`newBoard__form-button newBoard__form-button--purple ${
                isError ? "newBoard__form-button--disabled" : ""
              }`}>
              <p className="newBoard__form-button-p">Create new Board</p>
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
