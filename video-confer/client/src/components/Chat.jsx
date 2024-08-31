import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

const Chat = () => {
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = (msg) => {
    if (msg.trim()) {
      socket.emit("send_message", msg);

      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setChatHistory((previousChatHistory) => [...previousChatHistory, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    if (scrollRef && scrollRef.current) {
      const element = scrollRef.current;
      element.scroll({
        top: element.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [scrollRef, chatHistory]);

  return (
    <div className="w-1/4 h-3/4 bg-white rounded-l-md p-4 flex flex-col justify-between absolute right-0 top-10 bottom-0 shadow-xl">
      <div ref={scrollRef} className="overflow-y-auto flex flex-col mb-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className="bg-gray-100 p-2 rounded-md mb-2">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex items-end ml-5 flex-grow">
        <div className="relative flex w-full">
          <input
            className="h-7 w-3/4 bg-gray-100 border-2 border-gray-300 text-gray-900 placeholder-gray-500 rounded-md p-2"
            type="text"
            ref={inputRef}
            value={message}
            placeholder="Write here"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSendMessage(event.target.value);
                event.preventDefault();
              }
            }}
          />
          <button
            onClick={() => handleSendMessage(inputRef.current.value)}
            className="bg-blue-500 text-white rounded-md px-2 ml-3 py-1"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
