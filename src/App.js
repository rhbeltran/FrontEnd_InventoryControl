import React from 'react';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Catalogos from './pages/Catalogos';




function App() {
  return (
    <Router>
      <div id="pageContainer">
        <Link to="/">Home</Link>
        <Routes>
          <Route patch="/" element={<Home />} />
          <Route patch="/catalogos" element={<Catalogos />} />
        </Routes>
      </div>
    </Router>
  );

};

export default App;
