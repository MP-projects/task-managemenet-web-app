import React from "react";
import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import { useCollection } from "../../../hooks/useCollection";
//style
import "./Menu.css";

//images
import board from "../../../assets/icon-board.svg";
import dark from "../../../assets/icon-dark-theme.svg";
import light from "../../../assets/icon-light-theme.svg";
import hide from "../../../assets/icon-hide-sidebar.svg";
import logoDark from "../../../assets/logo-dark.svg";

//components
import BoardButton from "./BoardButton";
import CreateBoard from "./CreateBoard";
import AddBoard from "../AddBoard/AddBoard";
import { useEffect } from "react";

export default function Menu({ uid, documents }) {


  const navigate = useNavigate();

  const handleCreateBoard = () => {
    navigate("newBoard");
  };

  return (
    <>
      <aside className="menu">
        <div className="menu__logo">
          <img src={logoDark} alt="logo" className="menu__logo-img" />
        </div>
        <nav className="menu__board-list">
          <div className="menu__boards-counter">
            All boards ({documents && documents.length})
          </div>
          {documents &&
            documents.map((doc) => {
              return <BoardButton key={doc.id} doc={doc} boardName={doc.name} />
            })}
          <CreateBoard handleCreateBoard={handleCreateBoard} />
        </nav>
        <aside className="menu__toggle-mode">
          <div className="menu__toggle-mode-wrapper">
            <img
              src={light}
              alt="light mode"
              className="menu__toggle-mode-light"
            />
            <button className="menu__toggle-mode-button">
              <div className="menu__toggle-mode-button-circle"></div>
            </button>
            <img
              src={dark}
              alt="dark mode"
              className="menu__toggle-mode-dark"
            />
          </div>
          <button className="menu__hide-sidebar">
            <img
              src={hide}
              alt="hide sidebar"
              className="menu__hide-sidebar-img"
            />
            <p className="menu__hide-sidebard-text">Hide Sidebar</p>
          </button>
        </aside>
      </aside>
      <Routes>
        <Route
          path="newBoard"
          element={
           
              <AddBoard uid={uid} handleCreateBoard={handleCreateBoard} />
           
          }
        />
      </Routes>
    </>
  );
}
