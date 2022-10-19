import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFirestore } from "../../../hooks/useFirestore";
import produce from "immer";

//styles
import "./AddBoard.css";

//assets
import CloseIcon from "../../../assets/icon-cross.svg";

export default function AddBoard({ uid, boards }) {
  const initialState = ["Todo", "Doing", "Done", "Custom"];

  const [currentBoards, setCurrentBoards] = useState(boards);
  const initialColumns = [
    { active: false, name: "Todo", value: "Todo" },
    { active: false, name: "Doing", value: "Doing" },
    { active: false, name: "Done", value: "Done" },
    { active: false, name: "Custom", value: "Custom" },
  ];

  const [option, setOption] = useState("");
  const [columns, setColumns] = useState(initialColumns);

  const [name, setName] = useState("");
  const [isColumn, setIsColumn] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [allColumns, setAllColumns] = useState(false);
  const [isShort, setIsShort] = useState(false);
  const [isName, setIsName] = useState(true);

  //firestore
  const { addDocument, response } = useFirestore("boards");
  const navigate = useNavigate();
  const params = useParams();

  const handleNameChange = (e) => {
    if (name.length < 50) {
      setName(e.target.value);
    }
    if (name) {
      setIsName(true);
    }
    if (name.length > 1) {
      setIsShort(false);
    }
  };

  const handleColumnsChange = (e, column) => {
    const newColumns = produce(columns, (draft) => {
      draft.forEach((element) => {
        if (element.name === column.name) {
          element.value = e.target.value;
        }
      });
    });
    setColumns(newColumns);
  };

  const handleColumnDelete = (columnName) => {
    const newColumns = produce(columns, (draft) => {
      draft.forEach((element) => {
        if (element.name === columnName) element.active = false;
      });
    });
    setColumns(newColumns);
  };

  const handleAddColumn = () => {
    const activeColumns = columns.filter((element) => element.active);
    if (activeColumns.length === initialState.length) {
      setAllColumns(true);
    } else {
      setAllColumns(false);
    }

    if (option !== "" && option !== "All Columns") {
      const newColumns = produce(columns, (draft) => {
        draft.forEach((element) => {
          if (element.name === option) {
            element.active = true;
          }
        });
      });
      setColumns(newColumns);
    } else if (option === "All Columns") {
      const newColumns = produce(columns, (draft) => {
        draft.forEach((element) => {
          element.active = true;
        });
      });
      setColumns(newColumns);
    }
  };

  const createNewDocument = () => {
    let newDocument = {
      name,
      columns: columns,
      uid,
    };
    return newDocument;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      if (name.length >= 3) {
        if (columns.length > 0) {
          const newDocument = createNewDocument();
          addDocument(newDocument);
        } else {
          setIsColumn(false);
        }
      } else {
        setIsShort(true);
      }
    } else {
      setIsName(false);
    }
  };

  const closeAddBoard = () => {
    navigate(-1);
  };

  useEffect(() => {
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
  }, [response.succes, boards]);

  return (
    <>
      <div className="background-color"></div>
      <section className="newBoard">
        <button className="newBoard__close-button" onClick={closeAddBoard}>
          <img src={CloseIcon} alt="close" className="newBoard__close-img" />
        </button>
        <form onSubmit={handleSubmit} className="newBoard__form">
          <h2 className="newBoard__form-h2">Create New Board</h2>
          <div className="newBoard__form-wrapper">
            <span className="newBoard__form-span">Name</span>
            <input
              placeholder="e.g. Web Design"
              type="text"
              className="newBoard__form-input"
              value={name}
              onChange={(e) => handleNameChange(e)}
            />
          </div>
          <div className="newBoard__form-wrapper">
            <span className="newBoard__form-span">Columns</span>
            <select
              className="newBoard__form-select"
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
                if (column.value !== "All Columns")
                  if (column.active === true)
                    return (
                      <div
                        key={column.name}
                        className="newBoard__form-input-wrapper">
                        <input
                          className="newBoard__form-input"
                          value={column.value}
                          onChange={(e) => handleColumnsChange(e, column)}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            handleColumnDelete(column.name);
                          }}
                          className="newBoard__form-column-delete">
                         <img className=" newBoard__form-column-delete-img" src={CloseIcon} alt="delete" />
                        </button>
                      </div>
                    );
              })}

            {!isColumn && (
              <p className="newBoard__form-alert">
                You can not create a board without columns! Create new column
              </p>
            )}
            {isSelected && (
              <p className="newBoard__form-alert">Choose a column!</p>
            )}
            {allColumns && (
              <p className="newBoard__form-alert">You chose all columns!</p>
            )}
            {isShort && (
              <p className="newBoard__form-alert">
                Board name must be at least 3 characters!
              </p>
            )}
            {!isName && (
              <p className="newBoard__form-alert">Name your board!</p>
            )}
          </div>
          <div className="newBoard__form-wrapper">
            <button
              onClick={handleAddColumn}
              type="button"
              className="newBoard__form-button newBoard__form-button--light-purple">
              <p className="newBoard__form-button-p">+ Add New Column</p>
            </button>
            <button
              disabled={!isColumn ? true : false}
              className="newBoard__form-button newBoard__form-button--purple">
              <p className="newBoard__form-button-p">Create new Board</p>
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
