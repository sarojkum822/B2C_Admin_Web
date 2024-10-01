import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SideBar from './components/Leftsidebar';
import Login from './components/login';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login />} />

        
        <Route path="/" element={<SideBar />} />
      </Routes>
    </Router>
  );
}

export default App;
