import { useEffect, useState } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useUpdate = () => {
  const [error, setError] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const { dispatch } = useAuthContext();
  const [isCancelled, setIsCancelled] = useState(false);

  const update = async (
    email = null,
    password = null,
    displayName = null,
    url = null
  ) => {
    setError(null);
    setIsPending(true);
    setIsSuccess(null);

    try {
      const user = projectAuth.currentUser;

      // update email, password and display name
      if (user.isAnonymous) {
        await user.updateProfile({ isAnonymous: false });
      }
      if (email) {
        await user.updateEmail(email);
      }
      if (password) {
        await user.updatePassword(password);
      }
      if (displayName) {
        await user.updateProfile({ displayName });
      }
      if (url) {
        await user.updateProfile({ photoURL: url });
      }

      if (!user) {
        throw new Error("There is no user");
      }

      dispatch({ type: "UPDATE", payload: user });

      if (!isCancelled) {
        setIsSuccess("Update successfull!");
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
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

  return { update, error, isPending, isSuccess };
};
