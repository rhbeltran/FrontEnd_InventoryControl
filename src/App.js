import React from 'react';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Catalogos from './pages/Catalogos';
import NavBar from './NavBar/NavBar';




function App() {
  return (
    <Router>
      <NavBar />
      <div id="pageContainer">
        <Link to="/">Home</Link>
        <Routes>
          <Route patch="/" element={<Home />} />
          <Route patch="/catalogos" element={<Catalogos />} />
        </Routes>
        
        hola
      </div>
    </Router>

  );

};

export default App;
