// Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/edit-account">Edytuj konto</Link>
      <Link to="/search-users">Wyszukaj użytkowników</Link>
      <Link to="/game">Nowa gra</Link>
      <Link to="/delete-account">Usuń konto</Link>
    </div>
  );
};

export default Dashboard;
