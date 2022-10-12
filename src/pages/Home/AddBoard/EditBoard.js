import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFirestore } from "../../../hooks/useFirestore";
import produce from "immer";

//styles
import "./EditBoard.css";

//assets
import CloseIcon from "../../../assets/icon-cross.svg";

export default function EditBoard({ uid, boards, tasks }) {
  const initialOptions = ["Todo", "Doing", "Done", "Custom"];

  const {
    setDocument: setDocumentBoard,
    deleteDocument: deleteDocumentBoard,
    response: responseBoard,
  } = useFirestore("boards");
  const {
    setDocument: setDocumentTask,
    deleteDocument: deleteDocumentTask,
    respose: responseTask,
  } = useFirestore("tasks");

  const [currentBoard, setCurrentBoard] = useState(null);
  const [name, setName] = useState("");
  const [columns, setColumns] = useState(null);

  const [option, setOption] = useState(initialOptions);

  const navigate = useNavigate();
  const { id } = useParams();

  const closeEditBoard = () => {
    navigate(-1);
  };

  const handleColumnDelete = (name) => {
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
    if (option !== "" && option !== "All Columns") {
      const newColumns = produce(columns, (draft) => {
        draft.forEach((element) => {
          if (element.name === option) {
            element.active = true;
            element.value = element.name
            element.isEdited = true;
          }
        });
      });
      setColumns(newColumns);
    } else if (option === "All Columns") {
      const newColumns = produce(columns, (draft) => {
        draft.forEach((element) => {
          if (element.active === false) {
            element.active = true;
            element.isEdited = true;
            element.value = element.name
          }
        });
      });
      setColumns(newColumns);
    }
  };
  const handleColumnsChange = (e, column) => {
    const newColumns = produce(columns, (draft) => {
      draft.forEach((element) => {
        if (element.name === column.name) {
          element.value = e.target.value;
          element.isEdited = true;
        }
      });
    });
    setColumns(newColumns);
  };

  const createDocument = () => {
    const newBoard = produce(currentBoard, (draft) => {
      delete draft.id
      draft.name = name;
      draft.columns = columns;
    });

    return newBoard;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBoard = createDocument();
    const activeColumns = newBoard.columns.filter((column) => column.active);

    if (activeColumns.length === 0) {
      return;
    }

    const currentTasks = tasks.filter((task) => task.boardId === currentBoard.id);
    const newTasks = produce(currentTasks, (draft) => {
      newBoard.columns.forEach((column) => {
        if (column.active && column.isEdited) {
          console.log(column.name);
          draft.forEach((element) => {
            if (element.status.name === column.name) {
              element.status.value = column.value;
              element.delete = false;
            }
          });
        } else if (!column.active) {
          console.log(column);
          draft.forEach((element) => {
            if (element.status.name === column.name) {
              element.delete = true;
            }
          });
        }
      });
    });
    const _newBoard = produce(newBoard, (draft => {
      draft.columns.forEach(element => {
        delete element.isEdited
      })
    }))
    setDocumentBoard(_newBoard,currentBoard.id)
    const deletedTasks = newTasks.filter((task) => task.delete === true);
    const updatedTasks = newTasks.filter((task) => task.delete === false);
    deletedTasks.forEach((task) => {
      deleteDocumentTask(task.id)
    })
    updatedTasks.forEach(task => {
      const newTask = produce(task, (draft) => {
        delete draft.delete
        delete draft.id
      })
      setDocumentTask(newTask,task.id)
    })
  };

  useEffect(() => {
    if (responseBoard&&responseBoard.succes) {
        navigate(-1)     
      } 
    
    if (boards) {
      const board = boards.filter((element) => element.id === id)[0];
      setCurrentBoard(board);
      setName(board.name);
      setColumns(board.columns);
    }
  }, [responseBoard,boards]);
console.log(responseBoard)

  return (
    <>
      <div className="background-color"></div>
      <section className="editBoard">
        <button className="editBoard__close-button" onClick={closeEditBoard}>
          <img src={CloseIcon} alt="close" className="editBoard__close-img" />
        </button>
        <form onSubmit={handleSubmit} className="editBoard__form">
          <h2 className="editBoard__form-h2">Edit Board</h2>
          <div className="editBoard__form-wrapper">
            <span className="editBoard__form-span">Name</span>
            <input
              placeholder="e.g. Web Design"
              type="text"
              className="editBoard__form-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="editBoard__form-wrapper">
            <span className="editBoard__form-span">Columns</span>
            <select
              className="editBoard__form-select"
              name="Column name"
              defaultValue={""}
              onChange={(e) => e.target.value && setOption(e.target.value)}>
              <option value="">Choose column</option>
              {columns &&
                columns.map((item) => {
                  if (item.active === false)
                    return (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    );
                })}
              <option value="All Columns">All Columns</option>
            </select>

            {columns &&
              columns.map((column) => {
                if (column.name !== "All Columns")
                  if (column.active === true)
                    return (
                      <div
                        key={column.name}
                        className="editBoard__form-input-wrapper">
                        <input
                          className="editBoard__form-input"
                          value={column.value}
                          onChange={(e) => handleColumnsChange(e, column)}
                        />

                        <button
                          type="button"
                          onClick={() => {
                            handleColumnDelete(column.name);
                          }}
                          className="editBoard__form-column-delete">
                          X
                        </button>
                      </div>
                    );
              })}
          </div>
          <div className="editBoard__form-wrapper">
            <button
              onClick={handleAddColumn}
              type="button"
              className="editBoard__form-button editBoard__form-button--light-purple">
              <p className="editBoard__form-button-p">+ Add New Column</p>
            </button>
            <button className="editBoard__form-button editBoard__form-button--purple">
              <p className="editBoard__form-button-p">Save</p>
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
