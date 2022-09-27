import React, { useEffect } from "react";
import { projectFirestore } from "./firebase/config";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

//components
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Start from "./pages/Start";

//data
import Data from "./data.json";
//style
import "./App.css";

//database
// import data from "./data.json"

// console.log(data)

function App() {
  const { user, authIsReady } = useAuthContext();
  console.log(Data);
  // useEffect(() => {
  //   let result = [];
  //   projectFirestore
  //     .collection("boards")
  //     .get()
  //     .then((snapshot) => {
  //       snapshot.forEach((doc) => {
  //         result.push({ id: doc.id, ...doc.data() });
  //       });
  //       console.log(result);
  //     });
  // }, []);

  return (
    <main className="app">
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
