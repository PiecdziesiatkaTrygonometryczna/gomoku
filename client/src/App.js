import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Game from './Components/Game';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import EditAccount from './Components/EditAccount';
import FindUsers from './Components/FindUsers';
import GameOwnerLookup from './Components/GameOwnerLookup';
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

  const LoginButton = () => {
    const location = useLocation();

    if (location.pathname === '/') {
      return (
        <Link to="/login">
          <button style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: 'red',
            backgroundImage: 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)',
            color: 'white',
            border: 'none',
            fontSize: '2em',
            cursor: 'pointer'
          }}>
            Siema
          </button>
        </Link>
      );
    }

    return null;
  };


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
      <div>

        <LoginButton />

        <Routes>
          <Route path="/login" element={<Login socket={socket} onLogin={handleLogin} />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : null} />
          <Route path="/edit-account" element={isLoggedIn ? <EditAccount userId={userId} /> : null} />
          <Route path="/search-users" element={isLoggedIn ? <FindUsers /> : null} />
          <Route path="/game-owner-lookup" element={isLoggedIn ? <GameOwnerLookup /> : null} />
          <Route path="/game" element={isLoggedIn ? <Game socket={socket} onLogout={handleLogout} /> : null} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
