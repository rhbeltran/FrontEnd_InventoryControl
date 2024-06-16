import React from 'react';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import Products from './pages/Products';
import Clients from './pages/Clients';
import Suppliers from './pages/Suppliers';
import Users from './pages/Users';
import TypeOfProducts from './pages/TypeOfProducts';
import Login from './pages/Login';
import ProtectedRoute from './context/ProtectedRoute';

function App() {
  return (
    <Router>
      <NavBar/>
      <div id="pageContainer" className="p-3">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute element={Home} />} />
          <Route path="/typeofproducts" element={<ProtectedRoute element={TypeOfProducts} />} />
          <Route path="/products" element={<ProtectedRoute element={Products} />} />
          <Route path="/clients" element={<ProtectedRoute element={Clients} />} />
          <Route path="/suppliers" element={<ProtectedRoute element={Suppliers} />} />
          <Route path="/users" element={<ProtectedRoute element={Users} />} />
          <Route path = "*" element={<Navigate to="/home"></Navigate> }></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
