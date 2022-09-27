import React from "react";
import { useNavigate } from "react-router-dom";
//styles
import "./Start.css";
import { useLogin } from "../hooks/useLogin";

export default function Start() {
  const navigate = useNavigate();
  const { login } = useLogin();

  const handleGuestLogin = () => {
    login("guest@guest.com", "guest1234");
  };

  return (
    <div className="start">
      <button
        onClick={() => {
          navigate("/login");
        }}>
        Login
      </button>
      <button
        onClick={() => {
          navigate("/register");
        }}>
        Register
      </button>
      <button onClick={handleGuestLogin}>Login as Guest</button>
    </div>
  );
}
