import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from "./Components/Main";
import Login from "./Components/Login";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3003");

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token) => {
    Cookies.set('token', token);
    setIsLoggedIn(true);
  }

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login socket={socket} onLogin={handleLogin} />} />
        <Route path="/main" element={isLoggedIn ? <Main socket={socket} onLogout={handleLogout} /> : null} />
      </Routes>
    </Router>
  );
}

export default App;