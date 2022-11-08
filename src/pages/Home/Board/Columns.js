import { useState, useEffect } from "react";
import { useParams, Routes, Route } from "react-router-dom";
import { useFirestore } from "../../../hooks/useFirestore";
import produce from "immer";

//styles
import "./Columns.css";

//components
import NewTask from "../Task/NewTask";
import AddBoard from "../AddBoard/AddBoard";
import SingleColumn from "./SingleColumn";
import TaskView from "../Task/TaskView";
import EditBoard from "../AddBoard/EditBoard";
import UpdateUser from "../MyProfile/UpdateUser";
import MyProfile from "../MyProfile/MyProfile";
import About from "../About";

export default function Columns({ boards, uid, tasks }) {
  const { id } = useParams();
  const [currentBoards, setCurrentBoards] = useState(null);
  const [currentTasks, setCurrentTasks] = useState(null);
  const [notActiveColumns, setNotActiveColumns] = useState(null);

  const { setDocument } = useFirestore("boards");

  const handleAddColumn = () => {
    const newBoard = produce(currentBoards, (draft) => {
      draft.columns.forEach((element) => {
        if (element.name === notActiveColumns[0].name) {
          element.active = true;
        }
      });
    });
    setDocument(newBoard, newBoard.id);
  };

  useEffect(() => {
    if (boards && id) {
      const newBoard = boards.filter((board) => board.id === id)[0];
      setCurrentBoards(newBoard);
      const _notActiveColumns = newBoard.columns.filter(
        (column) => column.active === false
      );

      if (_notActiveColumns.length > 0) {
        setNotActiveColumns(_notActiveColumns);
      } else {
        setNotActiveColumns(null);
      }

      if (tasks) {
        const newTasks = tasks.filter((task) => task.boardId === newBoard.id);
        setCurrentTasks(newTasks);
      }
    }
  }, [id, boards, tasks]);
  const handleFilterTasks = (column) => {
    const tasks = currentTasks.filter(
      (task) => task.status.name === column.name
    );
    return tasks;
  };

  return (
    <>
      <div className="columns">
        {currentBoards &&
          currentTasks &&
          currentBoards.columns.map((column) => {
            const tasks = handleFilterTasks(column);

            if (column.active)
              return (
                <SingleColumn key={column.name} column={column} tasks={tasks} />
              );
            return "";
          })}
        {notActiveColumns && (
          <section className="columns__newColumn">
            <button
              onClick={handleAddColumn}
              className="columns__newColumn-button">
              <p className="columns__newColumn-button-p">+ New column</p>
            </button>
          </section>
        )}
      </div>
      <Routes>
        <Route
          path=":id"
          element={<TaskView tasks={tasks} board={currentBoards} />}
        />
        <Route path="newTask" element={<NewTask boards={boards} uid={uid} />} />
        <Route
          path="newBoard"
          element={<AddBoard uid={uid} boards={boards} />}
        />
        <Route
          path="editBoard"
          element={<EditBoard uid={uid} boards={boards} tasks={tasks} />}
        />
        <Route path="register" element={<UpdateUser />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="About" element={<About />} />
      </Routes>
    </>
  );
}
