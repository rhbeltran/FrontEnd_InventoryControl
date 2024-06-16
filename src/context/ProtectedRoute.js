import React from "react";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ element: Component, ...rest }) => {
    const token = localStorage.getItem('token');
    return token || token !== "" ? <Component {...rest}></Component> : <Navigate to="/login"></Navigate>;
};
export default ProtectedRoute;