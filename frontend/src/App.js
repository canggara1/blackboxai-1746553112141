import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import POS from './components/POS/POS';
import Payment from './components/Payment/Payment';
import Receipt from './components/Payment/Receipt';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<POS />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/receipt" element={<Receipt />} />
      </Routes>
    </Router>
  );
}

export default App;
