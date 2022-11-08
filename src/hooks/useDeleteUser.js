import { useEffect, useState } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";


export const useDeleteUser = () => {
    const [error, setError] = useState(true);
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(null);
    const { dispatch } = useAuthContext();
    const [isCancelled, setIsCancelled] = useState(false);

    const deleteUser = async () => {
        try {
            const user = projectAuth.currentUser;
            await user.delete()

            if (!user) {
                throw new Error("There is no user");
            }
            
            dispatch({ type: "DELETE" });


            if (!isCancelled) {
                setIsSuccess("Delete successfull!");
                setIsPending(false);
                setError(null);
            }
        }
        catch (err) {
            if (!isCancelled) {
               
                setError(err.message);
                setIsPending(false);
                setIsSuccess(null);
            }
        }
    }

    useEffect(() => {
        return () => {
            setIsCancelled(true);
        };
    }, []);


    return { deleteUser, error, isPending, isSuccess };
}
