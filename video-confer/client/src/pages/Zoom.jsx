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
  const [peers, setPeers] = useState({});
  const myVideo = useRef(null);
  const userVideos = useRef([]);
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
    if (myVideo.current) {
      const videoTrack = myVideo.current.stream?.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !vid;
      }
    }
  };

  const toggleChat = () => {
    setChat(!chat);
  };

  useEffect(() => {
    // Initialize Socket.io
    socket.current = io("http://localhost:4000");

    socket.current.on("connect", () => {
      console.log("Connected to socket server with ID:", socket.current.id);
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    // Initialize PeerJS
    peerInstance.current = new Peer(undefined, {
      host: "localhost",
      port: 4000,
      path: "/peerjs/myapp",
    });

    peerInstance.current.on("open", (id) => {
      console.log("PeerJS ID:", id);
      socket.current.emit("join-room", id);
    });

    peerInstance.current.on("call", (call) => {
      console.log("Receiving a call...");
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          myVideo.current.srcObject = stream;
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            addRemoteStream(call.peer, remoteStream);
          });
        });
    });

    socket.current.on("user-connected", (userId) => {
      console.log("User connected:", userId);
      connectToNewUser(userId);
    });

    socket.current.on("user-disconnected", (userId) => {
      console.log("User disconnected:", userId);
      if (peers[userId]) peers[userId].close();
    });

    return () => {
      socket.current.disconnect();
      peerInstance.current.destroy();
    };
  }, []);

  const connectToNewUser = (userId) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myVideo.current.srcObject = stream;
        const call = peerInstance.current.call(userId, stream);
        call.on("stream", (remoteStream) => {
          addRemoteStream(call.peer, remoteStream);
        });
        call.on("close", () => {
          removePeerVideo(call.peer);
        });

        setPeers((prevPeers) => ({ ...prevPeers, [userId]: call }));
      });
  };

  const addRemoteStream = (peerId, remoteStream) => {
    userVideos.current = [...userVideos.current, remoteStream];
    setPeers((prevPeers) => ({ ...prevPeers, [peerId]: remoteStream }));
  };

  const removePeerVideo = (peerId) => {
    setPeers((prevPeers) => {
      const updatedPeers = { ...prevPeers };
      delete updatedPeers[peerId];
      return updatedPeers;
    });
  };

  const renderVideos = () => {
    const videos = [
      <Webcam
        ref={myVideo}
        audio={mic}
        className="w-full h-full"
        key="my-video"
      />,
    ];

    Object.keys(peers).forEach((peerId, index) => {
      videos.push(
        <video
          key={peerId}
          ref={(el) => (userVideos.current[index] = el)}
          autoPlay
          playsInline
          className="w-full h-full"
          srcObject={peers[peerId]}
        />
      );
    });

    return videos;
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col justify-center items-center relative">
      {chat && (
        <div className="absolute right-4 top-4 z-50 w-1/4 h-3/4">
          <Chat socket={socket.current} />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-4 relative w-full max-w-screen-lg">
        {renderVideos()}
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
            onClick={toggleChat}
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
