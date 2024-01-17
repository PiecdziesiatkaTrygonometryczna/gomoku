import React, { useState } from "react";

const JoinRoom = ({ display, setDisplay, setRoomCode }) => {
  const [roomCodeInput, setRoomCodeInput] = useState(null);

  const handleSave = () => {
    setDisplay(false);
    setRoomCode(roomCodeInput);
  };

  return (
    <>
      {display && (
        <div className={`modal-container ${display ? 'visible' : 'hidden'}`}>
            <h1>Podaj nr pokoju</h1>
            <input
              type="number"
              onChange={(e) => setRoomCodeInput(e.target.value)}
            />
            <button onClick={handleSave}>
              Dołącz
            </button>
          </div>
      )}
    </>
  );
};

export default JoinRoom;
