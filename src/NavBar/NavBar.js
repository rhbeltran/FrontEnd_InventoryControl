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

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>MOTORSOLUTIONS</Navbar.Brand>
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <NavLink to="/" className="nav-link">HOME</NavLink>
                        <NavLink to="/users" className="nav-link">USUARIOS</NavLink>
                        <NavLink to="/typeofproducts" className="nav-link" >CATEGORIAS</NavLink>
                        <NavLink to="/products" className="nav-link">PRODUCTOS</NavLink>
                        <NavLink to="/clients" className="nav-link">CLIENTES</NavLink>
                        <NavLink to="/suppliers" className="nav-link">PROVEEDORES</NavLink>
                    </Nav>
                    <Nav>
                        <Navbar.Toggle />
                        <NavDropdown
                            id="nav-dropdown"
                            title="Opciones"
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


