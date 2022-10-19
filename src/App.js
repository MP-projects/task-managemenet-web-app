import React, { useEffect } from "react";
import { projectFirestore } from "./firebase/config";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { useFirestore } from "./hooks/useFirestore";
import { useCollection } from "./hooks/useCollection";
import produce from "immer";

//components
import Home from "./pages/Home/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Board from "./components/Board";
import Navbar from "./components/Navbar";
import Menu from "./pages/Home/Menu/Menu";

//style
import "./App.css";

//database
import data from "./data.json";

// (data)

function App() {
  // 4PfvxJhCVkMsUuwHgoVSlYoENir1
  const { user, authIsReady } = useAuthContext();
  // const { documents: dataBoards, error: errorBoards } = useCollection(
  //   "boards",
  //   ["uid", "==", "4PfvxJhCVkMsUuwHgoVSlYoENir1"]
  // );

  // const { addDocument: addBoards } = useFirestore("boards");
  // const { addDocument: addTasks } = useFirestore("tasks");

  // const upload = () => {
  //   if (data && user) {
  //     let newData = data.boards;
  //     let i = 0;

  //     newData.forEach((element) => {
  //       i = i + 100;
  //       element.exampleData = true;
  //       element.columns.push({ name: "Custom" });
  //       element.columns.forEach((column) => {
  //         column.value = column.name;
  //         column.active = true;
  //         delete column.tasks;
  //         if (column.name === "Custom") {
  //           column.active = false;
  //         }
  //       });
  //       element.uid = user.uid;
  //       setTimeout(() => {
  //         addBoards(element);
  //       }, i);
  //     });
  //   }
  // };

  // const upload2 = () => {
  //   if (data && user && dataBoards) {
  //     let newData2 = data.boards.sort((a, b) => {
  //       if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) return -1;
  //     });
  //     let newData3 = dataBoards.sort((a, b) => {
  //       if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) return -1;
  //     });
  //     let j = 0;
 

  //     for (let i = 0; i < newData2.length; i++) {
  //       let boardId = newData3[i].id;
  //       let boardName = newData2[i].name;
  //       newData2[i].columns.forEach((column) => {      
  //         let status = { name: column.name, value: column.name };
  //         column.tasks.forEach((task) => {
  //           task.boardName = boardName;
  //           task.boardId = boardId;
  //           task.uid = user.uid;
  //           task.status = status;
  //           task.exampleData = true;
  //           task.subtasks.forEach((subtask) => {
  //             j = j + 100;
  //             setTimeout(() => {
  //               let id = new Date().getTime();
  //               subtask.id = id;
  //             }, j);
  //           });
  //           j = j + 100;
  //           setTimeout(() => {
  //             addTasks(task);
  //           }, j);
  //         });
  //       });
  //     }
  //   }
  // };
  // useEffect(() => {
  //   if (user) {
    
  //   }
  // });

  return (
    <main className="app">
      {/* <button onClick={upload}>upload</button>
      <button onClick={upload2}>upload2</button> */}
      {authIsReady && (       
        <BrowserRouter>
      
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/home" /> : <Login />}
            />
            <Route
              path="register"
              element={user ? <Navigate to="/home" /> : <Register />}
            />

            <Route
              path="home/*"
              element={user ? <Home /> : <Navigate to="/" />}
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
        
      )}
      
    </main>
  );
}

export default App;
