import React from "react";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import produce from "immer";
import { Routes, Route, Navigate } from "react-router-dom";

//components
import Menu from "./Menu/Menu";
import Navbar from "./Navbar/Navbar";
import Board from "./Board/Board";
import EmptyBoard from "./Board/EmptyBoard";
import NewTask from "./Task/NewTask";
import UpdateUser from "./MyProfile/UpdateUser";
import MyProfile from "./MyProfile/MyProfile";
import About from "./About";

//styles
import "./Home.css";

export default function Home() {
  const { user } = useAuthContext();
  const { documents: dataBoards } = useCollection("boards", [
    "uid",
    "==",
    user.uid,
  ]);
  const { documents: dataTasks } = useCollection("tasks", [
    "uid",
    "==",
    user.uid,
  ]);
  const { documents: userData } = useCollection("userData", [
    "uid",
    "==",
    user.uid,
  ]);

  const [boards, setboards] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [currentUserData, setCurrentUserData] = useState("");

  useEffect(() => {
    if (dataBoards) {
      const boards = produce(dataBoards, (draft) => {
        draft.sort((a, b) => {
          return a.createdAt - b.createdAt;
        });
      });

      setboards(boards);
    }
    if (dataTasks) {
      const tasks = produce(dataTasks, (draft) => {
        draft.sort((a, b) => {
          return a.createdAt - b.createdAt;
        });
      });

      setTasks(tasks);
    }

    if (userData) {
      setCurrentUserData(userData);
    }
  }, [dataBoards, dataTasks, userData]);


  return (
    <>
      <Menu uid={user.uid} boards={boards} tasks={tasks} />
      <div className="home-wrapper">
        <Navbar
          uid={user.uid}
          boards={boards}
          tasks={tasks}
          userData={currentUserData}
        />
        {(!boards || boards.length === 0) && <EmptyBoard />}

        <Routes>
          <Route
            path="/"
            element={
              !(!boards || boards.length === 0) && <Navigate to="boards" />
            }
          />
          <Route
            path="boards/*"
            element={
              boards && boards.length > 0 ? (
                <Board uid={user.uid} boards={boards && boards} tasks={tasks} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="newTask" element={<NewTask />} />
          <Route path="register" element={<UpdateUser />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="About" element={<About />} />
        </Routes>
      </div>
    </>
  );
}
