import { useState, useEffect } from "react";
import "./Main.css";

const Cell = ({ handleCellClick, id, text, color }) => {
  return (
    <div id={id} className={`cell ${color}`} onClick={handleCellClick}>
      {text}
    </div>
  );
};

const Main = ({ socket, roomCode }) => {
  const boardSize = 15;
  const initialBoard = Array(boardSize * boardSize).fill({ value: "", color: "" });
  const [board, setBoard] = useState(initialBoard);
  const [canPlay, setCanPlay] = useState(true);

  useEffect(() => {
    socket.on("updateGame", (id) => {
      console.log("use Effect", id);
      setBoard((data) => ({ ...data, [id]: { value: "O", color: "white" } }));
      setCanPlay(true);
    });

    return () => socket.off("updateGame");
  });

  const handleCellClick = (e) => {
    const id = e.currentTarget.id;
    if (canPlay && board[id].value == "") {
      setBoard((data) => ({ ...data, [id]: { value: "O", color: "black" } }));
      socket.emit("play", { id, roomCode });
      setCanPlay(false);
    }
  };

  return (
    <main>
      <section className="main-section">
        {Array(boardSize).fill().map((_, i) => (
          Array(boardSize).fill().map((_, j) => {
            const id = i * boardSize + j;
            return <Cell handleCellClick={handleCellClick} id={id.toString()} text={board[id].value} color={board[id].color} />
          })
        ))}
      </section>
    </main>
  );
};

export default Main;
