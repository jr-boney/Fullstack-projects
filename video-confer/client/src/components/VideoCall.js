import React from 'react';
import { useState, useRef,useEffect } from 'react';
import {Socket, io} from 'socket.io-client';
import SimplePeer from 'simple-peer';
import Webcam from 'react-webcam'

const VideoCall = () => {

  const videoRef = useRef(null)

useEffect(() => {

  const peer = new SimplePeer({
    initiator: false,
    trickle:false,
  })

peer.on('signal',(data) => {
  Socket.emit('answer',data);
});
peer.on('stream',(stream) => {
  videoRef
})

},[])

  return (
    <div>
        


    </div>
  )
}

export default VideoCall