import React, { useState, useRef, useEffect } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
} from "react-icons/fa";
import { BsChatLeftText } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Peer from "peerjs";
import io from "socket.io-client";
import Webcam from "react-webcam";
import Chat from "../components/Chat";

const Zoom = () => {
  const [mic, setMic] = useState(true);
  const [vid, setVid] = useState(true);
  const [chat, setChat] = useState(false);
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const peerInstance = useRef(null);
  const socket = useRef();

  const toggleMic = () => {
    setMic(!mic);
    toast(`Mic turned ${mic ? "Off" : "On"}`);
    if (myVideo.current && myVideo.current.stream) {
      myVideo.current.stream.getAudioTracks()[0].enabled = !mic;
    }
  };

  const toggleVideo = () => {
    setVid(!vid);
    toast(`Video turned ${vid ? "Off" : "On"}`);
    if (myVideo.current && myVideo.current.stream) {
      myVideo.current.stream.getVideoTracks()[0].enabled = !vid;
    }
  };

  const toggle = () => {
    setChat(!chat);
  };

  useEffect(() => {
    socket.current = io("http://localhost:4000");

    socket.current.on("connect", () => {
      console.log("Connected to socket server with ID:", socket.current.id);
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    peerInstance.current = new Peer(undefined, {
      host: "localhost",
      port: 4000,
      path: "/peerjs/myapp",
    });

    peerInstance.current.on("open", (id) => {
      console.log("PeerJS ID:", id);
      setPeerId(id);
    });

    peerInstance.current.on("call", (call) => {
      console.log("Receiving a call...");
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          myVideo.current.srcObject = stream;
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            userVideo.current.srcObject = remoteStream;
          });
        });
    });

    return () => {
      socket.current.disconnect();
      peerInstance.current.destroy();
    };
  }, []);

  return (
    <div className="h-screen bg-gray-900 flex flex-col justify-center items-center relative">
      <div className="flex space-x-4 mb-4 relative">
        {chat && (
          <div className="absolute right-4 top-0 z-50 w-80 h-3/4">
            <Chat socket={socket.current} />
          </div>
        )}
        <Webcam
          audio={mic}
          ref={myVideo}
          className="border-2 border-gray-600 rounded-lg"
        />
        <Webcam
          audio={mic}
          ref={userVideo}
          className="border-2 border-gray-600 rounded-lg"
        />
      </div>
      <div className="fixed bottom-5 left-0 right-0 bg-gray-800 h-16 mx-5 rounded-lg shadow-lg flex justify-around items-center z-40">
        <div>
          <button
            onClick={toggleMic}
            className={`${
              mic
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } p-3 rounded-full`}
          >
            {!mic ? (
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
            {!vid ? (
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
        <div>
          <button
            onClick={toggle}
            className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full"
          >
            <BsChatLeftText className="text-white text-2xl" />
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Zoom;
