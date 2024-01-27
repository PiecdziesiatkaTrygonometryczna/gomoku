import React, { useState } from 'react';

const EditCoordinates = () => {
  const [gameId, setGameId] = useState('');
  const [coordinatesX, setCoordinatesX] = useState('');
  const [coordinatesY, setCoordinatesY] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  const handleDeleteAllGames = async () => {
    try {
      const response = await fetch('http://localhost:3003/api/games', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`All games deleted: ${data.message}`);
        setError('');
      } else {
        setMessage('');
        setError(data);
      }
    } catch (error) {
      console.error(error);
      setMessage('');
      setError('Server error');
    }
  };

  const handleDeleteGame = async () => {
    try {
      const response = await fetch(`http://localhost:3003/delete-game/${gameId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Game deleted: ${data.message}`);
        setError('');
      } else {
        setMessage('');
        setError(data);
      }
    } catch (error) {
      console.error(error);
      setMessage('');
      setError('Server error');
    }
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const responseX = await fetch(`http://localhost:3003/api/games/${gameId}/edit-x-coordinates`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: coordinatesX.split(' ').map(coord => coord.trim()),
        }),
      });

      const responseY = await fetch(`http://localhost:3003/api/games/${gameId}/edit-y-coordinates`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: coordinatesY.split(' ').map(coord => coord.trim()),
        }),
      });

      const dataX = await responseX.json();
      const dataY = await responseY.json();

      if (responseX.ok && responseY.ok) {
        setMessage(`X Coordinates: ${dataX.message}, Y Coordinates: ${dataY.message}`);
        setError('');
      } else {
        setMessage('');
        setError(`X Error: ${dataX}, Y Error: ${dataY}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('');
      setError('Server error');
    }
  };

  return (
    <div>
      <h1>Edit Coordinates</h1>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="gameId">Game ID:</label>
        <input
          type="text"
          id="gameId"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          required
        />
        <br />
        <label htmlFor="coordinatesX">Coordinates X (separated by space):</label>
        <input
          type="text"
          id="coordinatesX"
          value={coordinatesX}
          onChange={(e) => setCoordinatesX(e.target.value)}
          required
        />
        <br />
        <label htmlFor="coordinatesY">Coordinates Y (separated by space):</label>
        <input
          type="text"
          id="coordinatesY"
          value={coordinatesY}
          onChange={(e) => setCoordinatesY(e.target.value)}
          required
        />
        <br />
        <button type="submit">Edit Coordinates</button>
      </form>
      <button onClick={handleDeleteGame}>Delete Game</button>
      <button onClick={handleDeleteAllGames}>Delete All Games</button>
      {message && <p>{message}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};


export default EditCoordinates
