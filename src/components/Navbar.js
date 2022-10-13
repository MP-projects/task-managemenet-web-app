import React from "react";
import { useState, useRef } from "react";
import { useLogout } from "../hooks/useLogout";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore";
//styles
import "./Navbar.css";
//components
import BoardMenu from "./BoardMenu";
//images
import menuIcon from "../assets/icon-vertical-ellipsis.svg";
import { useEffect } from "react";
import { useCollection } from "../hooks/useCollection";
import produce from "immer";

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

  const [currentUserData, setCurrentUserData] = useState(null);

  const [isClicked, setIsClicked] = useState(false);
  const handleLogout = () => {
    logout();
  };
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

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

    setIsClicked(true);
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

  useEffect(() => {
    if (userData && userData.length > 0) {
      setCurrentUserData(userData[0]);
    }
    if (boards) {
      const _exampleBoards = boards.filter((board) => board.exampleData);
      const _exampleTasks = tasks.filter((task) => task.exampleData);
      if (isClicked && _exampleBoards.length > 0 && _exampleTasks.length > 0) {
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

        setIsClicked(false);
      }
    }
  }, [isClicked, userData, boards, tasks]);

  console.log(userData);

  return (
    <nav className="navbar">
      <div className="navbar__text-wrapper">
        <p className="navbar__text">Platform Launch</p>
      </div>
      <div className="navbar__board-menu-wrapper">
        <button className="btn" onClick={handleLogout}>
          logout
        </button>
        <button className="btn" onClick={handleClearData}>
          clear data
        </button>
        {currentUserData && currentUserData.example ? (
          <button className="btn" onClick={() => handleExampleData(false)}>
            turn off example data
          </button>
        ) : (
          <button className="btn" onClick={() => handleExampleData(true)}>
            turn on example data
          </button>
        )}
        {!currentUserData && (
          <button className="btn" onClick={() => handleExampleData(true)}>
            turn on example data
          </button>
        )}
        <button onClick={handleNewTask} className="navabar__new-task-button">
          <p className="navabr__new-task-text">+ Add new task</p>
        </button>
        <div className="navbar__board-menu">
          <button className="navbar__board-menu-button">
            <img
              src={menuIcon}
              alt="menu icon"
              className="navbar__board-menu-button-img"
            />
          </button>

          <BoardMenu />
        </div>
      </div>
    </nav>
  );
}
