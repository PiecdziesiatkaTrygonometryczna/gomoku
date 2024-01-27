import React, { useState } from 'react';

const GameBoard = () => {
  const [gameId, setGameId] = useState('');
  const [placesX, setPlacesX] = useState([]);
  const [placesO, setPlacesO] = useState([]);
  const [error, setError] = useState('');

  const handleLookup = async () => {
    try {
      const response = await fetch(`http://localhost:3003/api/games/${gameId}/places`);
      const data = await response.json();

      if (response.ok) {
        setPlacesX(data.placesX);
        setPlacesO(data.placesO);
        setError('');
      } else {
        setPlacesX([]);
        setPlacesO([]);
        setError('Game not found');
      }
    } catch (error) {
      console.error(error);
      setPlacesX([]);
      setPlacesO([]);
      setError('Server error');
    }
  };

  return (
    <div>
      <h1>Game Board Lookup</h1>
      <label htmlFor="gameId">Game ID:</label>
      <input
        type="text"
        id="gameId"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
        required
      />
      <button onClick={handleLookup}>Lookup Game Board</button>

      <div>
        <h2>Places X:</h2>
        <p>{placesX.join(', ')}</p>
        <h2>Places O:</h2>
        <p>{placesO.join(', ')}</p>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default GameBoard;
