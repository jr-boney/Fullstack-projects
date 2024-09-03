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
import Chat from "../components/Chat";

const Zoom = () => {
  const [mic, setMic] = useState(true);
  const [vid, setVid] = useState(true);
  const [chat, setChat] = useState(false);
  const [peers, setPeers] = useState({});
  const myVideo = useRef(null);
  const peerInstance = useRef(null);
  const socket = useRef();

  const toggleMic = () => {
    setMic(!mic);
    toast(`Mic turned ${mic ? "Off" : "On"}`);
    if (myVideo.current && myVideo.current.srcObject) {
      myVideo.current.srcObject.getAudioTracks()[0].enabled = !mic;
    }
  };

  const toggleVideo = () => {
    setVid(!vid);
    toast(`Video turned ${vid ? "Off" : "On"}`);
    if (myVideo.current && myVideo.current.srcObject) {
      myVideo.current.srcObject.getVideoTracks()[0].enabled = !vid;
    }
  };

  const toggleChat = () => {
    setChat(!chat);
  };

  const endCall = () => {
    socket.current.emit("leave-room");
    socket.current.disconnect();
    peerInstance.current.destroy();
    window.location.reload();
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
      socket.current.emit("join-room", id);
    });

    peerInstance.current.on("call", (call) => {
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
      connectToNewUser(userId);
    });

    socket.current.on("user-disconnected", (userId) => {
      removePeerVideo(userId);
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

        setPeers((prevPeers) => ({
          ...prevPeers,
          [userId]: call,
        }));
      });
  };

  const addRemoteStream = (peerId, remoteStream) => {
    setPeers((prevPeers) => ({
      ...prevPeers,
      [peerId]: { ...prevPeers[peerId], stream: remoteStream },
    }));
  };

  const removePeerVideo = (peerId) => {
    setPeers((prevPeers) => {
      const updatedPeers = { ...prevPeers };
      delete updatedPeers[peerId];
      return updatedPeers;
    });
  };

  const renderVideos = () => {
    const totalUsers = Object.keys(peers).length + 1;
    const gridTemplateColumns = `repeat(${Math.min(totalUsers, 3)}, 1fr)`;

    return (
      <div
        className={`grid grid-cols-${totalUsers} gap-4 mb-16 w-full h-full`}
        style={{ gridTemplateColumns }}
      >
        <div className="aspect-w-16 aspect-h-9">
          <video
            ref={myVideo}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
        {Object.values(peers).map((peer, index) => (
          <div key={index} className="aspect-w-16 aspect-h-9">
            <video
              ref={(el) => {
                if (el && peer.stream) {
                  el.srcObject = peer.stream;
                  el.play();
                }
              }}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col justify-between items-center relative overflow-hidden">
      {chat && (
        <div className="absolute right-4 top-4 z-50 w-1/4 h-3/4 bg-gray-800 rounded-lg shadow-lg">
          <Chat socket={socket.current} />
        </div>
      )}
      <div className="flex-1 w-full max-w-screen-lg relative">
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
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
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
          <button
            onClick={endCall}
            className="bg-red-600 hover:bg-red-700 p-3 rounded-full"
          >
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
      <ToastContainer />
    </div>
  );
};

export default Zoom;
