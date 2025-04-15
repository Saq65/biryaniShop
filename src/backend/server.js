import express from "express"
import http from "http"
import { Server } from "socket.io";
import cors from "cors"
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const port = 5000

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
    console.log('Admin connected:', socket.id);
});

app.post('/api/orders', (req, res) => {
    const order = req.body;


    io.emit('newOrder', order);
    res.status(201).send({ message: 'Order received' });
});

server.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
