import React from "react";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Unauthorized = () => {
    return (
        <div style={{textAlign: "center"}}>
            <FontAwesomeIcon icon={faBan} className="fa-10x mb-5 mt-3" beatFade color="Tomato"/> 
            <h1>403 - Acceso no Autorizado</h1>
            <p style={{fontSize: 50}}>No tiene permisos para acceder a esta página</p>
        </div>
    );
};

export default Unauthorized;