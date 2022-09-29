import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "../../../hooks/useFirestore";

//styles
import "./AddBoard.css";
import { useEffect } from "react";

export default function AddBoard({ uid }) {
  const initialState = ["Todo", "Doing", "Done", "Custom"];
  const [option, setOption] = useState("");
  const [columns, setColumns] = useState([]);
  const [customValue, setCustomValue] = useState("Custom");
  const [nameValue, setNameValue] = useState("");
  const [isColumn, setIsColumn] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [allColumns, setAllColumns] = useState(false);
  const [isShort, setIsShort] = useState(false);
  const [isName, setIsName] = useState(true);

  //firestore
  const { addDocument, response } = useFirestore("boards");

  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setNameValue(e.target.value);
    if (nameValue) {
      setIsName(true);
    }
    if (nameValue.length > 1) {
      setIsShort(false);
    }
  };

  const handleColumnDelete = (columnName) => {
    const newColumns = columns.filter((column) => column !== columnName);
    setColumns(newColumns);
    if (columnName === "Custom") {
      setCustomValue("Custom");
    }

    if (newColumns.length === 0) {
      setIsColumn(false);
      setIsSelected(false);
      setAllColumns(false);
    } else {
      setIsColumn(true);
      setAllColumns(false);
    }
  };

  const handleAddColumn = () => {
    let columnsArray = [...columns];
    let newColumns = [];

    if (columnsArray.length === initialState.length) {
      setAllColumns(true);
    } else {
      setAllColumns(false);
    }

    if (option !== "" && !columnsArray.includes(option)) {
      if (option === "All Columns") {
        columnsArray = [...initialState];
        setIsSelected(false);
        setIsColumn(true);
      } else {
        columnsArray.push(option);
        setIsSelected(false);
        setIsColumn(true);
      }
    } else setIsSelected(true);
    if (columnsArray.length === initialState.length) {
      setIsSelected(false);
    }
    for (let i = 0; i < initialState.length; i++) {
      columnsArray.forEach((element) => {
        if (element === initialState[i]) {
          newColumns.push(element);
        }
      });
    }
    setColumns(newColumns);
  };

  const createNewDocument = () => {
    let newColumns = [...columns];

    let newDocument = {
      name: nameValue,
      columns: [],
    };

    for (let i = 0; i < newColumns.length; i++) {
      if (newColumns[i] === "Custom") {
        newColumns[i] = customValue;
      }
      newDocument.columns.push({ name: newColumns[i] });
    }

    newDocument["uid"] = uid;

    return newDocument;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameValue) {
      if (nameValue.length >= 3) {
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
    console.log("nawigacja");
    navigate("/");
  };

  useEffect(() => {
    if (response.succes) {
      navigate("/");
    }
  }, [response.succes]);

  return (
    <>
      <div className="background-color"></div>
      <section className="newBoard">
        <button onClick={closeAddBoard}>X</button>
        <form onSubmit={handleSubmit} className="newBoard__form">
          <h2 className="newBoard__form-h2">Add new Board</h2>
          <div className="newBoard__form-wrapper">
            <span className="newBoard__form-span">Name</span>
            <input
              placeholder="e.g. Web Design"
              type="text"
              className="newBoard__form-input"
              value={nameValue}
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
              {initialState &&
                initialState.map((item) => {
                  if (!columns.includes(item))
                    return (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    );
                })}
              <option value="All Columns">All Columns</option>
            </select>

            {columns &&
              columns.map((columnName) => {
                if (columnName !== "All Columns")
                  return (
                    <div
                      key={columnName}
                      className="newBoard__form-input-wrapper">
                      <input
                        className="newBoard__form-input"
                        defaultValue={
                          columnName === "Custom" ? undefined : columnName
                        }
                        disabled={columnName === "Custom" ? false : true}
                        value={
                          columnName === "Custom" ? customValue : undefined
                        }
                        onChange={
                          columnName === "Custom"
                            ? (e) => setCustomValue(e.target.value)
                            : undefined
                        }
                      />

                      <button
                        onClick={() => {
                          handleColumnDelete(columnName);
                        }}
                        className="newBoard__form-column-delete">
                        X
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
