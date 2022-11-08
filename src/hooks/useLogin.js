import { useEffect } from "react";
import { useState } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import firebase from "firebase";

export const useLogin = (remember = false) => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();
  const [isCancelled, setIsCancelled] = useState(false);

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      // sign in

      
      if (remember) {
        projectAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL) 
      }
      else {
        projectAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
      }
      const res = await projectAuth.signInWithEmailAndPassword(email, password);
     

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });

      //update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      return err
      }
    }
  };
  useEffect(() => {
    return () => {
      setIsCancelled(true);
    };
  }, []);
  return { login, isPending, error };
};
