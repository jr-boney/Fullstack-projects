import React, { useEffect, useRef, useState } from "react";

const Chat = ({ socket }) => {
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
  }, [socket]);

  useEffect(() => {
    if (scrollRef && scrollRef.current) {
      const element = scrollRef.current;
      element.scroll({
        top: element.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <div className="w-80 h-3/4 bg-white rounded-l-lg p-4 flex flex-col justify-between shadow-lg">
      <div
        ref={scrollRef}
        className="overflow-y-auto flex-grow flex flex-col space-y-2 mb-4"
      >
        {chatHistory.map((msg, index) => (
          <div key={index} className="bg-gray-200 p-2 rounded-md">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-3">
        <input
          className="h-10 w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          ref={inputRef}
          value={message}
          placeholder="Write a message..."
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
          className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
