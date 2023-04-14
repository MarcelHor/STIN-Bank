import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";

export const ProtectedRoute = ({component: Component, requiresAuth, ...rest}: any) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null;

    useEffect(() => {
        if (requiresAuth && !isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate, requiresAuth]);

    return (isAuthenticated ? <Component {...rest}/> : null);
}