import React from "react";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import produce from "immer";
import { Routes, Route, Navigate } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";

//components
import Menu from "./Menu/Menu";
import Navbar from "../../components/Navbar";
import Board from "../../components/Board";
import EmptyBoard from "./Board/EmptyBoard";
import NewTask from "./AddBoard/NewTask";

//styles
import "./Home.css";


export default function Home() {
  const { user } = useAuthContext();
  const { documents: dataBoards, error: errorBoards } = useCollection(
    "boards",
    ["uid", "==", user.uid]
  );
  const { documents: dataTasks, error: errorTasks } = useCollection("tasks", [
    "uid",
    "==",
    user.uid,
  ]);
  const { documents: userData, error: errorUserData } = useCollection(
    "userData",
    ["uid", "==", user.uid]
  );
  const { documents: exampleBoards, error: errorExampleBoards } = useCollection(
    "boards",
    ["uid", "==", "4PfvxJhCVkMsUuwHgoVSlYoENir1"]
  );
  const { documents: exampleTasks, error: errorExampleTasks } = useCollection(
    "tasks",
    ["uid", "==", "4PfvxJhCVkMsUuwHgoVSlYoENir1"]
  );



  const [boards, setboards] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [currentUserData, setCurrentUserData] = useState("");
console.log("render")
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
        </Routes>
      </div>
    </>
  );
}
