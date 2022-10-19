import { useEffect, useState } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import firebase from "firebase";

export const useSignup = (remember=false) => {
  const [error, setError] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const { dispatch } = useAuthContext();
  const [isCancelled, setIsCancelled] = useState(false);

  const signup = async (email, password, displayName) => {
    setError(null);
    setIsPending(true);
    setIsSuccess(null);

    try {
      // signup
      
      if (remember){
        projectAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      }
      else {
        projectAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION)  
      }
      
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (!res) {
        throw new Error("Could not complete signup");
      }

      // add display name to user
      await res.user.updateProfile({ displayName });
      dispatch({ type: "LOGIN", payload: res.user });

      if (!isCancelled) {
        setIsSuccess("Register successfull!");
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
        setIsSuccess(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      setIsCancelled(true);
    };
  }, []);

  return { signup, error, isPending, isSuccess };
};
