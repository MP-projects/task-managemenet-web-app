import React from "react";
import { useState } from "react";
import { useLogout } from "../hooks/useLogout";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore";
import { useEffect } from "react";
import { useCollection } from "../hooks/useCollection";
import produce from "immer";

//styles
import "./Navbar.css";

//components
import UserMenu from "./UserMenu";

//assets
import User from "../assets/fontAwesome/circle-user-solid.svg";

export default function Navbar({ boards, tasks, userData, uid }) {
  const { setDocument, addDocument } = useFirestore("userData");
  const {
    setDocument: setDocumentBoard,
    addDocument: addDocumentBoard,
    deleteDocument: deleteDocumentBoard,
  } = useFirestore("boards");
  const {
    setDocument: setDocumentTask,
    addDocument: addDocumentTask,
    deleteDocument: deleteDocumentTask,
  } = useFirestore("tasks");
  const { documents: exampleBoards } = useCollection("boards", [
    "uid",
    "==",
    "4PfvxJhCVkMsUuwHgoVSlYoENir1",
  ]);
  const { documents: exampleTasks } = useCollection("tasks", [
    "uid",
    "==",
    "4PfvxJhCVkMsUuwHgoVSlYoENir1",
  ]);
  const { logout } = useLogout();

  const [currentBoard, setCurrentBoard] = useState(null);
  const [currentTasks, setCurrentTasks] = useState(null);

  const [currentUserData, setCurrentUserData] = useState(null);

  const [dataIsClicked, setDataIsClicked] = useState(false);
  const [menuIsClicked, setMenuIsClicked] = useState(false);

  const handleLogout = () => {
    logout();
  };
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const boardId = params["*"].slice(7, 27);
  

  const handleClearData = () => {
    boards.forEach((element) => {
      deleteDocumentBoard(element.id);
    });
    tasks.forEach((element) => {
      deleteDocumentTask(element.id);
    });
    setDocument({ ...currentUserData, example: false }, currentUserData.id);
  };

  const handleNewTask = () => {
    navigate(`${location.pathname}/newTask`);
  };

  const addExampleData = () => {
    const currentExampleBoards = produce(exampleBoards, (draft) => {
      draft.forEach((element) => {
        delete element.id;
        element.uid = uid;
      });
    });
    currentExampleBoards.forEach((element) => {
      setDocumentBoard({ ...element });
    });

    const currentExampleTasks = produce(exampleTasks, (draft) => {
      draft.forEach((element) => {
        delete element.id;
        element.uid = uid;
      });
    });
    currentExampleTasks.forEach((element) => {
      setDocumentTask({ ...element });
    });

    setDataIsClicked(true);
  };

  const deleteExampleData = () => {
    boards.forEach((element) => {
      if (element.exampleData === true) {
        deleteDocumentBoard(element.id);
      }
    });
    tasks.forEach((element) => {
      if (element.exampleData === true) {
        deleteDocumentTask(element.id);
      }
    });
  };
  const handleExampleData = (value) => {
    if (currentUserData) {
      if (currentUserData.example) {
        deleteExampleData();
        navigate("/", { replace: true });
        setDocument({ ...currentUserData, example: value }, currentUserData.id);
      } else if (!currentUserData.example) {
        addExampleData();
        setDocument({ ...currentUserData, example: value }, currentUserData.id);
      }
    } else if (!currentUserData) {
      addDocument({ example: value, uid });
      addExampleData();
      setDocument({ ...currentUserData, example: value }, currentUserData.id);
    }
  };

  const handleMenuButton = (value) => {
    setMenuIsClicked(value);
  };

  useEffect(() => {
    if (userData && userData.length > 0) {
      setCurrentUserData(userData[0]);
    }
    if (boards) {
      const _exampleBoards = boards.filter((board) => board.exampleData);
      const _exampleTasks = tasks.filter((task) => task.exampleData);
      if (
        dataIsClicked &&
        _exampleBoards.length > 0 &&
        _exampleTasks.length > 0
      ) {
        const newExampleTasks = produce(_exampleTasks, (draft) => {
          _exampleBoards.forEach((board) => {
            draft.forEach((task) => {
              if (board.name === task.boardName) {
                task.boardId = board.id;
              }
            });
          });
        });
        newExampleTasks.forEach((element) => {
          setDocumentTask({ ...element }, element.id);
        });

        setDataIsClicked(false);
      }

      if (boardId) {
        setCurrentBoard(boards.filter((board) => board.id === boardId)[0])
      }
      if (tasks&&boardId) {
        setCurrentTasks(tasks.filter(task=>task.boardId === boardId))
      }
    }
  }, [dataIsClicked, userData, boards, tasks, boardId]);
console.log(currentBoard)
  return (
    <nav className="navbar">
      {menuIsClicked && (
        <UserMenu
          boards={boards}
          menuIsClicked={menuIsClicked}
          handleMenuButton={handleMenuButton}
          currentUserData={currentUserData}
          handleExampleData={handleExampleData}
          handleLogout={handleLogout}
          handleClearData={handleClearData}
        />
      )}
      <div className="navbar__text-wrapper">
        <p className="navbar__text">{currentBoard?currentBoard.name : "Start with creating new board or turn on example data in user menu"}</p>
      </div>
      <div className="navbar__board-menu-wrapper">
        <button
          onClick={handleNewTask}
          disabled={(boards && boards.length > 0) ? false : true}
          className={`navabar__new-task-button ${(boards&&boards.length>0) && "navabar__new-task-button--active"}`}>
          <p className="navabr__new-task-text">+ Add new task</p>
        </button>
        <div className="navbar__board-menu">
          <button
            onClick={() => handleMenuButton(!menuIsClicked)}
            className={`navbar__board-menu-button ${
              menuIsClicked && "navbar__board-menu-button--active"
            }`}>
            <img
              src={User}
              alt="menu icon"
              className="navbar__board-menu-button-img"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
