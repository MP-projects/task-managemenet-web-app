import React from "react";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

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
  const { documents: dataBoards, error: errorBoards } = useCollection("boards", [
    "uid",
    "==",
    user.uid,
  ]);
  const { documents: dataTasks, error: errorTasks } = useCollection("tasks", [
    "uid",
    "==",
    user.uid,
  ]);
  const [boards, setboards] = useState(null);
  const [tasks, setTasks] = useState(null)
  

  useEffect(() => {
    if (dataBoards) {
      const boards = dataBoards.sort((a, b) => {
        return a.createdAt - b.createdAt;
      });

      setboards(boards);
    }
    if (dataTasks) {
      const tasks = dataTasks.sort((a, b) => {
        return a.createdAt - b.createdAt;
      });

      setTasks(tasks);
    }
  }, [dataBoards, dataTasks]);
 

  return (
    <>
      <Menu uid={user.uid} boards={boards} tasks={tasks} />
      <div className="home wrapper">
        <Navbar uid={user.uid} boards={boards} tasks={tasks} />
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
                <Board uid={user.uid} boards={boards} tasks={tasks} />
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
