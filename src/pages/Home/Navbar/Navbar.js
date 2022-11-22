import { useState, useEffect } from "react";
import { useLogout } from "../../../hooks/useLogout";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useFirestore } from "../../../hooks/useFirestore";
import { useCollection } from "../../../hooks/useCollection";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useTheme } from "../../../hooks/useTheme";
import produce from "immer";

//styles
import "./Navbar.css";

//components
import UserMenu from "./UserMenu";

export default function Navbar({ boards, tasks, userData, uid }) {
  const { user } = useAuthContext();
  const { darkMode } = useTheme();

  const { setDocument, addDocument } = useFirestore("userData");
  const { setDocument: setDocumentBoard, deleteDocument: deleteDocumentBoard } =
    useFirestore("boards");
  const { setDocument: setDocumentTask, deleteDocument: deleteDocumentTask } =
    useFirestore("tasks");
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
  const [currentActiveColumns, setCurrentActiveColumns] = useState([]);

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

  const addExampleData = async () => {
    const currentExampleBoards = produce(exampleBoards, (draft) => {
      draft.forEach((element) => {
        delete element.id;
        element.uid = uid;
      });
    });
    currentExampleBoards.forEach(async (element) => {
      await setDocumentBoard({ ...element });
    });

    const currentExampleTasks = produce(exampleTasks, (draft) => {
      draft.forEach((element) => {
        delete element.id;
        element.uid = uid;
      });
    });
    currentExampleTasks.forEach(async (element) => {
      await setDocumentTask({ ...element });
    });

    setDataIsClicked(true);
  };

  const deleteExampleData = async () => {
    boards.forEach(async (element) => {
      if (element.exampleData === true) {
        await deleteDocumentBoard(element.id);
      }
    });
    tasks.forEach(async (element) => {
      if (element.exampleData === true) {
        await deleteDocumentTask(element.id);
      }
    });
  };
  const handleExampleData = async (value) => {
    if (currentUserData) {
      if (currentUserData.example) {
        deleteExampleData();
        navigate("/", { replace: true });
        await setDocument(
          { ...currentUserData, example: value },
          currentUserData.id
        );
      } else if (!currentUserData.example) {
        addExampleData();
        await setDocument(
          { ...currentUserData, example: value },
          currentUserData.id
        );
      }
    } else if (!currentUserData) {
      await addDocument({ example: value, uid });
      addExampleData();
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
        const _currentBoard = boards.filter((board) => board.id === boardId)[0];
        if (_currentBoard) {
          const _activeColumns = _currentBoard.columns.filter(
            (column) => column.active === true
          );
          setCurrentActiveColumns(_activeColumns);
        }
        setCurrentBoard(_currentBoard);
      }
      if (tasks && boardId) {
        setCurrentTasks(tasks.filter((task) => task.boardId === boardId));
      }
    }
  }, [dataIsClicked, userData, boards, tasks, boardId]);

  useEffect(() => {
    if (boards) {
      if (userData.length === 0) {
        handleExampleData(true);
      }
    }
  }, [boards, userData]);

  return (
    <nav className={`navbar ${darkMode ? "darkMode--light" : ""}`}>
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
        <p className={`navbar__text ${darkMode ? "darkMode--light" : ""}`}>
          {currentBoard
            ? currentBoard.name
            : boards
            ? "Start with creating new board or turn on example data in user menu"
            : ""}
        </p>
      </div>
      <div className="navbar__board-menu-wrapper">
        <button
          onClick={handleNewTask}
          disabled={
            boards && boards.length > 0 && currentActiveColumns.length > 0
              ? false
              : true
          }
          className={`navabar__new-task-button ${
            boards &&
            boards.length > 0 &&
            currentActiveColumns.length > 0 &&
            "navabar__new-task-button--active"
          }`}>
          <p className="navabr__new-task-text">+ Add new task</p>
        </button>
        <div className="navbar__board-menu">
          <button
            onClick={() => handleMenuButton(!menuIsClicked)}
            className={`navbar__board-menu-button ${
              menuIsClicked && "navbar__board-menu-button--active"
            }`}>
            <img
              src={user && user.photoURL}
              alt="menu icon"
              className={`navbar__board-menu-button-img ${
                darkMode ? "darkMode--dark" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
