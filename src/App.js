import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { useTheme } from "./hooks/useTheme";

//components
import Home from "./pages/Home/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

//style
import "./App.css";



function App() {
 
  
  const { user, authIsReady } = useAuthContext();
  const {darkMode} = useTheme()


  return (
    <main className={`app ${(darkMode&&user)?"darkMode--dark":""}`}>

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
