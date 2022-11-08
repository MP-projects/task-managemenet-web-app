import React from "react";

import {
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";

import { useTheme } from "../../../hooks/useTheme";
//style
import "./Menu.css";

//assets
import dark from "../../../assets/icon-dark-theme.svg";
import light from "../../../assets/icon-light-theme.svg";
// import hide from "../../../assets/icon-hide-sidebar.svg";
import logo from "../../../assets/MP-Projects-logo.png";
import logoDark from "../../../assets/MP-Projects-logo-dark.png";

//components
import BoardButton from "./BoardButton";
import CreateBoard from "./CreateBoard";
import AddBoard from "../AddBoard/AddBoard";

export default function Menu({ uid, boards, tasks }) {
  const { darkMode, changeMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const handleCreateBoard = () => {
    navigate(`${location.pathname}/newBoard`);
  };

  const handleChangeTheme = () => {
    changeMode(!darkMode);
  };

  

  return (
    <>
      <aside className={`menu ${darkMode ? "darkMode--light" : ""}`}>
        <Link to={`${location.pathname}/About`} className="menu__logo">
          <img
            src={darkMode ? logoDark : logo}
            alt="logo"
            className="menu__logo-img"
          />
        </Link>
        <nav className="menu__board-list">
          <div className="menu__boards-counter">
            All boards ({boards && boards.length})
          </div>
          <div className={`menu__board-list-wrapper ${darkMode?"darkMode--scrollbar":""}`}>
            {boards &&
              boards.map((doc) => {
                return (
                  <BoardButton
                    key={doc.id}
                    doc={doc}
                    boardId={doc.id}
                    tasks={tasks}
                  />
                );
              })}
          </div>
          <CreateBoard handleCreateBoard={handleCreateBoard} />
        </nav>
        <aside className="menu__toggle-mode">
          <div
            className={`menu__toggle-mode-wrapper ${
              darkMode ? "darkMode--dark" : ""
            }`}>
            <img
              src={light}
              alt="light mode"
              className="menu__toggle-mode-light"
            />
            <button
              onClick={handleChangeTheme}
              className={`menu__toggle-mode-button `}>
              <div
                className={`menu__toggle-mode-button-circle ${
                  darkMode ? "menu__toggle-mode-button-circle--dark" : ""
                }`}></div>
            </button>
            <img
              src={dark}
              alt="dark mode"
              className="menu__toggle-mode-dark"
            />
          </div>
          {/* <button className="menu__hide-sidebar">
            <img
              src={hide}
              alt="hide sidebar"
              className="menu__hide-sidebar-img"
            />
            <p className="menu__hide-sidebard-text">Hide Sidebar</p>
          </button> */}
        </aside>
      </aside>
      <Routes>
        <Route path="newBoard" element={<AddBoard uid={uid} />} />
      </Routes>
    </>
  );
}
