import React from 'react';
import { Link, Routes, Route } from 'react-router-dom'; // Import Routes and Route
import EditAccount from './EditAccount';
import FindUsers from './FindUsers';


const Dashboard = () => {
    return (
      <div>
        <h1>Dashboard</h1>
        <Link to="/edit-account">Edytuj konto</Link>
        <Link to="/search-users">Wyszukaj użytkowników</Link>
        <Link to="/game">Nowa gra</Link>
  
        <Routes>
          <Route path="/edit-account" element={<EditAccount />} />
        </Routes>
        <Routes>
          <Route path="/search-users" element={<FindUsers />} />
        </Routes>
      </div>
    );
  };
  
  export default Dashboard;