import React from "react";
import { useLogout } from "../hooks/useLogout";
//styles
import "./Navbar.css";
//components
import BoardMenu from "./BoardMenu";
//images
import menuIcon from "../assets/icon-vertical-ellipsis.svg";

export default function Navbar() {

  const {logout} = useLogout()
  const handleLogout = () => {
    logout()
  }
  return (
    <nav className="navbar">
      <div className="navbar__text-wrapper">
        <p className="navbar__text">Platform Launch</p>
      </div>
      <div className="navbar__board-menu-wrapper">
      <button className= "btn" onClick={handleLogout}>logout</button>
        <button className="navabar__new-task-button">
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
