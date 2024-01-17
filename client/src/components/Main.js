import { useState } from "react";
import "./Main.css";

const Cell = ({ handleCellClick, id, text }) => {
  return (
    <div id={id} className="cell" onClick={handleCellClick}>
      {text}
    </div>
  );
};

const Main = () => {
  const boardSize = 15;
  const initialBoard = Array(boardSize * boardSize).fill("");
  const [board, setBoard] = useState(initialBoard);

  const handleCellClick = (e) => {
    const id = e.currentTarget.id;
    if (board[id] === "") {
      setBoard((data) => ({ ...data, [id]: "X" }));
    }
  };

  return (
    <main>
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

export default Main;
