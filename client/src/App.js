import Main from "./components/Main";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3002");

function App() {


  return (
    <>
      <Main socket={socket} />
    </>
  );
}

export default App;
