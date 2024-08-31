import express from "express";
import { PORT } from "./config.js";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { ExpressPeerServer } from "peer";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// io.on("connection", (socket) => {
//   console.log("a user connected:", socket.id);

//   // socket.on('offer',(data) => {
//   //     socket.broadcast.emit('offer',data)
//   // });

//   // socket.on('answer',(data) => {
//   //     socket.broadcast.emit('answer',data)
//   // });
//   // socket.on('ice-candidate',(data) => {
//   //     socket.broadcast.emit('ice-candiate',data)
//   // });

//   // socket.on("join-room", (roomId, userId) => {
//   //     socket.join(roomId);
//   //     socket.to(roomId).emit("user-connected", userId);

//   //     socket.on("disconnect", () => {
//   //       socket.to(roomId).emit("user-disconnected", userId);
//   //     });
//   //   });

// });

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("send_message", (msg) => {
    console.log("Received message:", msg); // Add this line
    io.emit("receive_message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
