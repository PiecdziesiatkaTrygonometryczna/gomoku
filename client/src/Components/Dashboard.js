import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import EditAccount from './EditAccount';
import FindUsers from './FindUsers';
import GameOwnerLookup from './GameOwnerLookup';
import GameBoard from './Gameboard';
import EditCoordinates from './EditCoordinates';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
      <div>
        <h1>Dashboard</h1>
        <Link to="/edit-account">Edytuj konto</Link>
        <br/>
        <Link to="/search-users">Wyszukaj użytkowników</Link>
        <br/>
        <Link to="/game-owner-lookup">Wyszukaj właścicieli gier</Link>
        <br/>
        <Link to="/edit-coordinates">Kordy edytuj se</Link>
        <br/>
        <Link to="/game">Nowa gra</Link>
        <br/>
        <Link to="/gameboard">Gra</Link>
        <button onClick={handleLogout}>Logout</button>
  
        <Routes>
          <Route path="/edit-account" element={<EditAccount />} />
        </Routes>
        <Routes>
          <Route path="/search-users" element={<FindUsers />} />
        </Routes>
        <Routes>
          <Route path="/game-owner-lookup" element={<GameOwnerLookup />} />
        </Routes>
        <Routes>
          <Route path="/edit-coordinates" element={<EditCoordinates />} />
        </Routes>
        <Routes>
          <Route path="/gameboard" element={<GameBoard />} />
        </Routes>
      </div>
    );
  };
  
  export default Dashboard;