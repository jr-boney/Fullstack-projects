import React, { useState } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
} from "react-icons/fa";

const Zoom = () => {
  const [mic, setMic] = useState(false);
  const [vid, setVid] = useState(false);

  const toggleMic = () => {
    setMic(!mic);
  };

  const toggleVideo = () => {
    setVid(!vid);
  };

  return (
    <div>
      <div className="h-screen bg-gray-900">
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 h-16 mx-3 rounded-lg shadow-lg flex justify-around items-center">
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

          <div>
            <button
              onClick={toggleVideo}
              className={`${
                vid
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } p-3 rounded-full`}
            >
              {vid ? (
                <FaVideoSlash className="text-white text-2xl" />
              ) : (
                <FaVideo className="text-white text-2xl" />
              )}
            </button>
          </div>

          <div>
            <button className="bg-red-600 hover:bg-red-700 p-3 rounded-full">
              <FaPhoneSlash className="text-white text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Zoom;
