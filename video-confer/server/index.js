import express from 'express';
import { PORT } from './config.js';
import {createServer} from 'http';
import cors from 'cors';
import {Server} from 'socket.io';
import { ExpressPeerServer } from "peer";


const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());
const peerServer = ExpressPeerServer(server, {
    debug: true,
  });
  app.use("/peerjs", peerServer);

app.get('/',(req,res) => {
    //used socket.io for full duplex communication and also use webrtc for video and audio calling  
    console.log('req');
    return res.status(200).send('welcome')
})

io.on('connection', (socket) => {
console.log('a user connected:',socket.id)

// socket.on('offer',(data) => {
//     socket.broadcast.emit('offer',data)
// });

// socket.on('answer',(data) => {
//     socket.broadcast.emit('answer',data)
// });
// socket.on('ice-candidate',(data) => {
//     socket.broadcast.emit('ice-candiate',data)
// });

socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

server.listen(PORT,() => {
    console.log(`server running at http://localhost:${PORT}`)
})