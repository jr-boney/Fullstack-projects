import express from "express";
import { PORT } from "./config.js";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { ExpressPeerServer } from "peer";

// Create the Express app and HTTP server
const app = express();
const server = createServer(app);

// Use CORS to allow requests from your client
app.use(
  cors({
    origin: "http://localhost:5173", // Allow your frontend to connect
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// Create the Socket.io server with CORS options
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow your frontend to connect
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Create a PeerJS server
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/myapp",
});

// Use the PeerJS server
app.use("/peerjs", peerServer);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("send_message", (msg) => {
    console.log("Received message:", msg); // Log the received message
    io.emit("receive_message", msg); // Broadcast the message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
