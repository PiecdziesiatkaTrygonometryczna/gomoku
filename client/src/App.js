import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './Components/Game';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import EditAccount from './Components/EditAccount';
import FindUsers from './Components/FindUsers';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3003');



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token, userId) => {
    Cookies.set('token', token);
    setIsLoggedIn(true);
    setUserId(userId);
  };


  const handleLogout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login socket={socket} onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : null}
        />
        <Route
          path="/edit-account"
          element={isLoggedIn ? <EditAccount userId={userId} /> : null}
        />
        <Route
          path="/search-users"
          element={isLoggedIn ? <FindUsers/> : null}
        />

        <Route path="/game" element={isLoggedIn ? <Game socket={socket} onLogout={handleLogout} /> : null} />
      </Routes>
    </Router>
  );
}

export default App;
