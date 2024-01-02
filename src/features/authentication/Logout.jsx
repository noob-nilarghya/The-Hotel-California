
import Button from "../../ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate= useNavigate();
    const queryClient = useQueryClient();

    const {mutate, isLoading} = useMutation({
        mutationFn: () => logout(),
        onSuccess: () => {
            toast.success("Logout successful. Redirecting to Login ...");
            queryClient.removeQueries();
            setTimeout(()=>{
                navigate('/login', {replace: true});
            }, 3000);
        },
        onError: ()=> toast.error("Logout unsuccessful")
    });

    function handleLogout(evt){
        evt.preventDefault();
        mutate();

        setTimeout(()=>{
            navigate('/login', {replace: true});
        }, 3000);
    }

    return (
        <Button variation="primary" onClick={handleLogout} disabled={isLoading}> {(isLoading) ? "Logging out..." : "Logout" } </Button>
    );
}

export default Logout;
