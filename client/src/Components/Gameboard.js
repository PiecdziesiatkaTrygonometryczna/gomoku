import React, { useState, useEffect } from 'react';
import './Gameboard.css';

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

  const handleCellClick = (coord) => {
    //TODO zeby dzialalo stawianie pionków po stronie klienta
    console.log(`Clicked on cell ${coord}`);
  };

  const generateBoard = () => {
    const board = [];
    for (let i = 0; i < 15; i++) {
      const row = [];
      for (let j = 0; j < 15; j++) {
        const coord = `${String.fromCharCode(65 + i)}${j + 1}`;
        const isX = placesX.includes(coord);
        const isO = placesO.includes(coord);
        const isClickable = !isX && !isO;
        const symbol = isX ? 'X' : isO ? 'O' : '';
        row.push(
          <div
            key={coord}
            className={`board-cell ${isX ? 'cell-x' : ''} ${isO ? 'cell-o' : ''} ${isClickable ? 'cell-clickable' : ''}`}
            onClick={() => isClickable && handleCellClick(coord)}
          >
            {symbol}
          </div>
        );
      }
      board.push(<div key={i} className="board-row">{row}</div>);
    }
    return board;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleLookup();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [gameId]);

  return (
    <div>
      <label htmlFor="gameId">Game ID:</label>
      <input
        type="text"
        id="gameId"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
        required
      />
      <button onClick={handleLookup}>Lookup Game Board</button>

      <div className="game-board">
        {generateBoard()}
      </div>

      {error && <p>{error}</p>}
    </div>
  );
};

export default GameBoard;
