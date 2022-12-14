import { useEffect } from "react";
import { useState } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import firebase from "firebase";

export const useLoginAnonymous = (remember = true) => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();
  const [isCancelled, setIsCancelled] = useState(false);

  const loginAnonymous = async () => {
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
      const res = await projectAuth.signInAnonymously();
     

      await res.user.updateProfile({ displayName :"GUEST", photoURL:`https://robohash.org/GUEST` });
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
  return { loginAnonymous, isPending, error };
};