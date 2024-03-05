import React, { useState } from "react";
import './NavBar.css';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="navbar">
            <div className='nav_logo'> MOTORSOLUTIONS </div>
            <div className={`nav_items ${isOpen && "open"}`}>
                <a href="#">USUARIOS</a>
                <a href="#">CATEGORIAS</a>
                <a href="#">PRODUCTOS</a>
                <a href="#">CLIENTES</a>
                <a href="#">PROVEEDORES</a>
            </div>
            <div className={`nav_toggle ${isOpen && "open"}`} onClick={() => setIsOpen(!isOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
}

export default NavBar