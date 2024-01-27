import React, { useState, useEffect, useCallback } from 'react';
import './Gameboard.css';

const GameBoard = () => {
    const [gameId, setGameId] = useState('');
    const [placesX, setPlacesX] = useState([]);
    const [placesO, setPlacesO] = useState([]);
    const [error, setError] = useState('');
    const [coordinateX, setCoordinateX] = useState('');
    const [coordinateY, setCoordinateY] = useState('');




    const handleLookup = useCallback(async () => {
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
    }, [gameId]);

    const handleCellClick = (coord) => {
        // to do aby dodawalo do bazy danych po kliknieicu na cella
        console.log(`Clicked on cell ${coord}`);
    };

    const handleAddCoordinate = async (player) => {
        try {
            const response = await fetch(`http://localhost:3003/api/games/${gameId}/add-${player}-coordinate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    coordinateX: player === 'x' ? coordinateX : null,
                    coordinateY: player === 'y' ? coordinateY : null,
                }),
            });
    
            if (response.ok) {
                handleLookup();
            } else {
                setError('Error adding coordinate');
            }
        } catch (error) {
            console.error(error);
            setError('Server error');
        }
    };
    

    const generateBoard = () => {
        const board = [];

        const headerRow = [];
        for (let i = 0; i <= 15; i++) {
            headerRow.push(
                <div key={`header-${i}`} className="board-cell header-cell">
                    {i}
                </div>
            );
        }
        board.push(<div key="header" className="board-row header-row">{headerRow}</div>);

        for (let i = 0; i < 15; i++) {
            const row = [];

            row.push(
                <div key={`header-${i}`} className="board-cell header-cell">
                    {String.fromCharCode(65 + i)}
                </div>
            );

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
    }, [gameId, handleLookup]);

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

            <div className="game-board">
                {generateBoard()}
            </div>

            <div style={{ position: 'absolute', top: 0, left: 0 }}>
                <h2>Player X</h2>
                <label htmlFor="coordinateX"></label>
                <input
                    type="text"
                    id="coordinateX"
                    value={coordinateX}
                    onChange={(e) => setCoordinateX(e.target.value)}
                    required
                />
                <button onClick={() => handleAddCoordinate('x')}>Add Coordinate</button>
            </div>

            <div style={{ position: 'absolute', top: '100px', left: 0 }}>
                <h2>Player O</h2>
                <label htmlFor="coordinateY"></label>
                <input
                    type="text"
                    id="coordinateY"
                    value={coordinateY}
                    onChange={(e) => setCoordinateY(e.target.value)}
                    required
                />
                <button onClick={() => handleAddCoordinate('y')}>Add Coordinate</button>
            </div>

            {error && <p>{error}</p>}
        </div>
    );
};

export default GameBoard;
