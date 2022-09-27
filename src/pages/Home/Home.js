import React from "react";

//components
import Menu from "./Menu/Menu";
import Navbar from "../../components/Navbar";
import Board from "../../components/Board";

//styles
import "./Home.css";

export default function Home() {
  return (
    <>
      <Menu />
      <div className="home wrapper">
        <Navbar />
        <Board />
      </div>
    </>
  );
}
