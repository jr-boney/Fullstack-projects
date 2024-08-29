import React, { useRef, useState } from "react";

const Chat = () => {
  const inputRef = useRef(null);
  const [chat, setChat] = useState([]);

  const handleSendMessage = () => {};

  return (
    <div className="w-1/4 h-3/4 bg-white rounded-l-md p-4 flex flex-col justify-between absolute right-0 top-10 bottom-0 shadow-xl">
      <div className="overflow-y-auto flex items-end ml-5 flex-grow mb-4">
        <div className="relative">
          <input
            className="h-7 w-3/4 bg-gray-100 border-2 border-gray-300 text-gray-900 placeholder-gray-500 rounded-md p-2"
            type="text"
            ref={inputRef}
            placeholder="Write here"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSendMessage(event.target.value);
                event.preventDefault();
              }
            }}
          />
          <button className="bg-blue-500 text-white rounded-md px-2 ml-3 py-1">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
