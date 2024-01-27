  import { useState, useEffect } from "react";
  import "./Game.css";
  import io from "socket.io-client";

  const Cell = ({ handleCellClick, id, text }) => {
    return (
      <div id={id} className={`cell ${text}`} onClick={handleCellClick}>
        {text}
      </div>
    );
  };

  const Game = () => {
    const boardSize = 15;
    const initialBoard = Array(boardSize * boardSize).fill("");
    const [board, setBoard] = useState(initialBoard);
    const [currentPlayer, setCurrentPlayer] = useState("O");
    const [winner, setWinner] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
      const newSocket = io("http://localhost:3003");
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }, []);

    useEffect(() => {
      console.log("Aktualny stan planszy:", board);
    }, [board]);

    const checkWinner = (row, col) => {
      const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
      ];

      for (const [dx, dy] of directions) {
        let count = 1;
        let x = row + dx;
        let y = col + dy;

        while (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x * boardSize + y] === currentPlayer) {
          count++;
          x += dx;
          y += dy;
        }

        x = row - dx;
        y = col - dy;

        while (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x * boardSize + y] === currentPlayer) {
          count++;
          x -= dx;
          y -= dy;
        }

        if (count >= 5) {
          setWinner(currentPlayer);
          return true;
        }
      }

      return false;
    };

    const handleCellClick = (e) => {
      if (winner) {
        return;
      }

      const id = e.currentTarget.id;
      if (board[id] === "") {
        setBoard((data) => ({ ...data, [id]: currentPlayer }));

        if (checkWinner(Math.floor(id / boardSize), id % boardSize)) {
          setWinner(currentPlayer);
        } else {
          setCurrentPlayer(currentPlayer === "O" ? "X" : "O");
        }
      }
    };

    const resetGame = () => {
      setBoard(initialBoard);
      setCurrentPlayer("O");
      setWinner(null);
    };

    return (
      <main>
        <div className="controls">
          <button onClick={resetGame}>Nowa Gra</button>
        </div>
        {winner && (
          <div className="winner-message">
            <p>{`Gracz ${winner} wygrywa!`}</p>
          </div>
        )}
        <section className="main-section">
          {Array(boardSize).fill().map((_, i) => (
            Array(boardSize).fill().map((_, j) => {
              const id = i * boardSize + j;
              return <Cell handleCellClick={handleCellClick} id={id.toString()} text={board[id]} />
            })
          ))}
        </section>
      </main>
    );
  };

  export default Game;
