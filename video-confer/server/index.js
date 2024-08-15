import express from 'express';
import { PORT } from './config.js';
import cors from 'cors';
import {Server} from 'socket.io'


const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());

app.get('/',(req,res) => {
    //used socket.io for full duplex communication and also use webrtc for video and audio calling 
    console.log('req');
    return res.status(234).send('welcome')
})

io.on('connection', (socket) => {
console.log('a user connected')
socket.on('disconnected',() => {
    console.log('user disconnected')
});

});

server.listen(PORT,() => {
    console.log(`server running at http://localhost:${PORT}`)
})