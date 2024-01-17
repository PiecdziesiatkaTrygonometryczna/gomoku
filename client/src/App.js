import Main from "./Components/Main";
import io from "socket.io-client";
import JoinRoom from "./Components/JoinRoom";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3003");

function App() {
  const [display, setDisplay] = useState(true);
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    console.log(roomCode);
    if (roomCode) {
      socket.emit("joinRoom", roomCode);
    }
  }, [roomCode]);

  return (
    <>
    {display ? (
      <JoinRoom
        display={display}
        setDisplay={setDisplay}
        setRoomCode={setRoomCode}
      />
      ) : (
      <Main socket={socket} roomCode={roomCode} />
      )}
    </>
  );
}

export default App;



