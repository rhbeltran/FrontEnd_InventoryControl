import React from 'react';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import PurchaseOrders from './pages/PurchaseOrders';
import Products from './pages/Products';
import Clients from './pages/Clients';
import Suppliers from './pages/Suppliers';
import Users from './pages/Users';
import TypeOfProducts from './pages/TypeOfProducts';
import Login from './pages/Login';
import Sales from './pages/Sales';
import InventoryMovements from './pages/InventoryMovements';
import ProtectedRoute from './context/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import MaybeShowNavBar from './components/MaybeShowNavbar';
import './App.css';


function App() {
  return (
    <>
      <Router>
        <MaybeShowNavBar>
          <NavBar />
        </MaybeShowNavBar>
        <div id="pageContainer" className="p-3">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/home" element={<ProtectedRoute element={Home} />} />
            <Route path='/purchaseorders' element={<ProtectedRoute element={PurchaseOrders} allowedRoles={['admin']} />} />
            <Route path="/typeofproducts" element={<ProtectedRoute element={TypeOfProducts} allowedRoles={['admin']} />} />
            <Route path="/products" element={<ProtectedRoute element={Products} allowedRoles={['admin']} />} />
            <Route path="/clients" element={<ProtectedRoute element={Clients} allowedRoles={['admin', 'operator']} />} />
            <Route path="/suppliers" element={<ProtectedRoute element={Suppliers} allowedRoles={['admin']} />} />
            <Route path="/users" element={<ProtectedRoute element={Users} allowedRoles={['admin']} />} />
            <Route path="/sales" element={<ProtectedRoute element={Sales} allowedRoles={['admin', 'operator']} />} />
            <Route path="/inventorymovements" element={<ProtectedRoute element={InventoryMovements} allowedRoles={['admin', 'operator']} />} />
            <Route path="*" element={<Navigate to="/home"></Navigate>}></Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
