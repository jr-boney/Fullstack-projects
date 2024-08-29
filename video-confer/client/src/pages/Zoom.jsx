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
  const [peerId, setPeerId] = useState("");
  const myVideo = useRef(null);
  const userVideo = useRef(null);
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

    const peer = new Peer(undefined, {
      path: "/peerjs",
      host: "localhost",
      port: "4000",
    });

    peer.on("open", (id) => {
      setPeerId(id);
      socket.current.emit("join-room", "roomId", id);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myVideo.current.srcObject = stream;

        peer.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (userStream) => {
            userVideo.current.srcObject = userStream;
          });
        });

        socket.current.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      });

    function connectToNewUser(userId, stream) {
      const call = peer.call(userId, stream);
      call.on("stream", (userStream) => {
        userVideo.current.srcObject = userStream;
      });
    }

    return () => {
      socket.current.disconnect();
    };
  }, []);

  return (
    <div className="h-screen bg-gray-900 flex flex-col justify-center items-center">
      <div className="flex space-x-4 mb-4">
        {chat && (
          <div>
            <Chat />
          </div>
        )}

        {/* <Webcam
          audio={mic}
          video={vid}
          height={250}
          width={250}
          ref={myVideo}
          className="border-2 border-gray-600 rounded-lg"
        />
       
        <Webcam
          audio={mic}
          video={vid}
          height={250}
          width={250}
          ref={userVideo}
          className="border-2 border-gray-600 rounded-lg"
        /> */}
      </div>
      <div className="fixed bottom-5 left-0 right-0 bg-gray-800 h-16 mx-5 rounded-lg shadow-lg flex justify-around items-center z-50">
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
