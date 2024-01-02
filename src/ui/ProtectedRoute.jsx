import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/apiAuth";
import Spinner from "./Spinner";
import styled from "styled-components";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FullPage= styled.div`
    height: 100vh;
    background-color: var(--color-grey-50);
    display: flex;
    align-items: center;
    justify-content: center;
`;

function ProtectedRoute({children}) {
    // 1. Load authenticated user
    const {isLoading, data: user} = useQuery({
        queryKey: ['user'],
        queryFn: getCurrentUser
    });

    const navigate= useNavigate();

    // 2. If there is NO authenticated user, redirect to /login page
    const authenticated= user?.role === 'authenticated';

    useEffect(function(){
        if(!authenticated && !isLoading) {
            navigate('/login')
        }
    }, [authenticated, isLoading, navigate]);

    // 3. While loading, show spinner
    if(isLoading){ return <FullPage> <Spinner /> </FullPage> ; }

    
    // 4. If there IS a user, render children
    return (authenticated) ? children : null;
}

export default ProtectedRoute;
