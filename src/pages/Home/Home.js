import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { Routes, Route, Navigate, useNavigate} from "react-router-dom";

//components
import Menu from "./Menu/Menu";
import Navbar from "../../components/Navbar";
import Board from "../../components/Board";
import EmptyBoard from "./Board/EmptyBoard";

//styles
import "./Home.css";
import { useEffect } from "react";


export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { documents, error } = useCollection("boards", ["uid", "==", user.uid])
  
  useEffect(() => {
    console.log(documents)
    if (documents) {
      if (documents.length > 0) {
        navigate("boards")     
      }
    }
    
  },[documents])
  return (
    <>
      <Menu uid = {user.uid} documents = {documents} />
      <div className="home wrapper">
        <Navbar uid={user.uid} documents={documents} />
        {(!documents || documents.length === 0)&&<EmptyBoard/>}
      <Routes>
        <Route path="boards/*" element={documents && documents.length >0 ? <Board uid={user.uid} documents={documents} /> : <Navigate to="/" />} /> 
      </Routes>
      </div>
 
    </>
  );
}
