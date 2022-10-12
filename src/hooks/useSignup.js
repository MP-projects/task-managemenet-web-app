import { useEffect, useState } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
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
        err.message;
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
