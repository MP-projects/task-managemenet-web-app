import React, { useState } from "react";
// import {Route} from "react-router-dom"
import "./Login.css";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    error;
  };

  return (
    <form onSubmit={handleSubmit} className="login__form">
      <h2>login</h2>
      <label>
        <span>email:</span>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span>password:</span>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>
      <button>Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}
