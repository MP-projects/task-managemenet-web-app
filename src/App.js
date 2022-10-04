import React, { useEffect } from "react";
import { projectFirestore } from "./firebase/config";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { useFirestore } from "./hooks/useFirestore";
//components
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Start from "./pages/Start";


//style
import "./App.css";

//database
import data from "./data.json";

// console.log(data)

function App() {
  const { user, authIsReady } = useAuthContext();

  // const { addDocument: addBoards } = useFirestore("boards");
  // const { addDocument: addTasks } = useFirestore("tasks");

  // const upload = () => {
  //   if (data && user) {
  //     let newData = data.boards;
  //     let i = 0;

  //     newData.forEach((element) => {
  //       i = i + 100;
  //       element.columns.forEach((column) => {
  //         delete column.tasks;
  //       });
  //       element.uid = user.uid;
  //       setTimeout(() => {
  //         addBoards(element);
  //       }, i);
  //     });
  //   }
  // };
  // const upload2 = () => {
  //   if (data && user) {
  //     let newData2 = data.boards;
  //     let j = 0;

  //     newData2.forEach((element) => {
  //       let boardName = element.name;
  //       console.log(element.columns);
  //       element.columns.forEach((column) => {
  //         let status = column.name;
  //         column.tasks.forEach((task) => {
  //           task.boardName = boardName;
  //           task.uid = user.uid;
  //           task.status = status;
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
  //     });
  //   }
  // };

  return (
    <main className="app">
      {/* <button onClick={upload}>upload</button>
      <button onClick={upload2}>upload2</button> */}
      {authIsReady && (
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/home" /> : <Start />}
            />
            <Route
              path="login"
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
