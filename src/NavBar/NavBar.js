import React, { useState } from "react";
import { NavLink, Link } from 'react-router-dom';
//import './NavBar.css';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
//import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
//import SplitButton from 'react-bootstrap/SplitButton';
//import Dropdown from "../components/Dropdown/Dropdown";
//import { ButtonGroup } from "react-bootstrap";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUsername] = useState(localStorage.getItem('userName'));

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.href = '/login';
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>MOTORSOLUTIONS</Navbar.Brand>
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <NavLink to="/" className="nav-link">HOME</NavLink>
                        <NavLink to="/purchaseorders" className="nav-link">ORDENES DE COMPRA</NavLink>
                        <NavLink to="/users" className="nav-link">USUARIOS</NavLink>
                        <NavLink to="/typeofproducts" className="nav-link" >CATEGORIAS</NavLink>
                        <NavLink to="/products" className="nav-link">PRODUCTOS</NavLink>
                        <NavLink to="/clients" className="nav-link">CLIENTES</NavLink>
                        <NavLink to="/suppliers" className="nav-link">PROVEEDORES</NavLink>
                        <NavLink to="/sales" className="nav-link">VENTAS</NavLink>
                        <NavLink to="/inventorymovements" className="nav-link">INVENTARIO</NavLink>
                    </Nav>
                    <Nav>
                        <Navbar.Toggle />
                        <NavDropdown
                            id="nav-dropdown"
                            title={userName}
                        >
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4" onClick={logout}>
                                Cerrar Sesión

                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );
}


export default NavBar


