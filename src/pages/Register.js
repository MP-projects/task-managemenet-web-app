import React, { useState } from "react";
import { useSignup } from "../hooks/useSignup.js";
import "./Register.css";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useFirestore } from "../hooks/useFirestore.js";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { signup, isPending, error, isSuccess } = useSignup();
  const { user } = useAuthContext();
  const { addDocument, response } = useFirestore("exampleData");

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, displayName);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="register-form">
        <h2>sign up</h2>
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
        <label>
          <span>display name:</span>
          <input
            type="text"
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
          />
        </label>
        <button className="btn">Sign up</button>

        {error && <p>{error}</p>}
        {isSuccess && <p>{isSuccess}</p>}
      </form>

    </>
  );
}
