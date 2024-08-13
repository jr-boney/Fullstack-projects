import React from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
} from "react-icons/fa";

const Zoom = () => {
  return (
    <div>
      <div>First Div</div>
      <div className="h-screen bg-gray-200">
        <div className="absolute bottom-0 left-0 right-0 bg-slate-600 h-16 mx-3 rounded-lg shadow-slate-100-lg flex justify-around items-center">
          <div>
            <FaMicrophone className="text-white text-2xl" />
          </div>
          <div>
            <FaMicrophoneSlash className="text-white text-2xl" />
          </div>
          <div>
            <FaVideo className="text-white text-2xl" />
          </div>
          <div>
            <FaVideoSlash className="text-white text-2xl" />
          </div>
          <div>
            <FaPhoneSlash className="text-red-600 text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Zoom;
