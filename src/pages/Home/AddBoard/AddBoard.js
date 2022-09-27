import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//styles
import "./AddBoard.css";

export default function AddBoard() {
  const initialState = ["Todo", "Doing", "Done", "Custom"];
  const [option, setOption] = useState("");
  const [columns, setColumns] = useState([]);
  const [isColumn, setIsColumn] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [customValue, setCustomValue] = useState("Custom");
  const [nameValue, setNameValue] = useState("");
  const [allColumns, setAllColumns] = useState(false);

  const navigate = useNavigate();

  const handleColumnDelete = (columnName) => {
    const newColumns = columns.filter((column) => column !== columnName);
    console.log(newColumns);
    setColumns(newColumns);
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
    console.log(columns);
    let columnsArray = [...columns];

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
    setColumns(columnsArray);
  
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("create new board");
  };

  const closeAddBoard = () => {
    navigate("/home");
  };

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
              onChange={(e) => setNameValue(e.target.value)}
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
              {initialState.map((item) => {
                if (!columns.includes(item))
                  return (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  );
              })}
              <option value="All Columns">All Columns</option>
            </select>

            {columns.map((columnName) => {
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
                      value={columnName === "Custom" ? customValue : undefined}
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
