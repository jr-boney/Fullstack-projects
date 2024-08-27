import React from "react";
import { FaRocketChat } from "react-icons";

<FontAwesomeIcon icon="fa-brands fa-rocketchat" />;
const Chat = () => {
  return (
    <div>
      <button
        onClick={toggleMic}
        className={`${
          mic
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        } p-3 rounded-full`}
      >
        {mic ? (
          <FaMicrophoneSlash className="text-white text-2xl" />
        ) : (
          <FaMicrophone className="text-white text-2xl" />
        )}
      </button>
    </div>
  );
};

export default Chat;
