import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const EditAccount = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');

    const navigate = useNavigate();

    const handleEditAccount = async () => {
        try {
            const response = await axios.put(`http://localhost:3003/edit-account/${userId}`, { email, password });
            console.log(response.data);
        } catch (error) {
            console.error('Błąd edycji konta:', error.response.data);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await axios.delete(`http://localhost:3003/delete-account/${userId}`);
            console.log(response.data);
        } catch (error) {
            console.error('Błąd usuwania konta:', error.response.data);
        }
    };

    return (
        <div>
            <h1>Edytuj konto</h1>

            <label>userId:</label>
            <input type="userId" value={userId} onChange={(e) => setUserId(e.target.value)} required />

            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Nowe hasło:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <button onClick={handleEditAccount}>Zapisz zmiany</button>
            <button onClick={() => { handleDeleteAccount(); navigate('/login'); document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';}}>Usuń konto</button>
        </div>
    );
};

export default EditAccount