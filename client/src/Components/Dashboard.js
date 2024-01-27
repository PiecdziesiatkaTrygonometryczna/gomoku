import React from 'react';
import { Link, Routes, Route } from 'react-router-dom'; // Import Routes and Route
import EditAccount from './EditAccount';


const Dashboard = () => {
    return (
      <div>
        <h1>Dashboard</h1>
        <Link to="/edit-account">Edytuj konto</Link>
        <Link to="/search-users">Wyszukaj użytkowników</Link>
        <Link to="/game">Nowa gra</Link>
        <Link to="/delete-account">Usuń konto</Link>
  
        <Routes>
          <Route path="/edit-account" element={<EditAccount />} />
        </Routes>
      </div>
    );
  };
  
  export default Dashboard;