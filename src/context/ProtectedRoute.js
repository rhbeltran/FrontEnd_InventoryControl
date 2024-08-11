import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";//como usar decode, ver fecha de expiracion token
import Swal from "sweetalert2";

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
    const token = localStorage.getItem('token');

    if (token) {
        const decodedToken = jwtDecode(token);
        if (allowedRoles && !allowedRoles.includes(decodedToken.role)) {
            return <Navigate to="/unauthorized"></Navigate>;
        }

        const currentDate = new Date();
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            Swal.fire(
                '¡Error!',
                'Token expired',
                'error'
            );
            return <Navigate to="/login"></Navigate>;
        }
        return <Component {...rest}></Component>;
    }

    return token && token !== "" ? <Component {...rest}></Component> : <Navigate to="/login"></Navigate>;

};
export default ProtectedRoute;