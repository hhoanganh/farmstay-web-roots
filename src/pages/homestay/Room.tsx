
import { useParams } from "react-router-dom";

const Room = () => {
  const { roomName } = useParams();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Room: {roomName}</h1>
    </div>
  );
};

export default Room;
