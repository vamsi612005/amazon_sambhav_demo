import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InputScreen from './pages/InputScreen';
import ProductDisplay from './pages/ProductDisplay';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InputScreen />} />
        <Route path="/product" element={<ProductDisplay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;