import express from "express";
import { PORT } from "./config.js";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { ExpressPeerServer } from "peer";

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/myapp",
});

app.use("/peerjs", peerServer);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-room", (userId) => {
    console.log(`User ${userId} joined the room`);
    socket.broadcast.emit("user-connected", userId);

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
      socket.broadcast.emit("user-disconnected", userId);
    });
  });

  socket.on("send_message", (msg) => {
    console.log("Received message:", msg);
    io.emit("receive_message", msg);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
