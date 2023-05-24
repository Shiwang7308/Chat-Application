const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const connect = require('./config/database-config');

const Chat = require('./models/chat');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    socket.on('join_room', (data) => {
        console.log("joining a room", data.roomid)
        socket.join(data.roomid);
    });

    socket.on('msg_send', async (data) => {
        console.log(data);
       try{
        const chat = await Chat.create({
            roomId: data.roomid,
            user: data.username,
            content: data.msg
        });
        io.to(data.roomid).emit('msg_rcvd', data);
       }
         catch(err){
        console.log("error in msg send",err);
        throw new Error(err);
         }
        
    });

    socket.on('typing', (data) => {
        socket.broadcast.to(data.roomid).emit('someone_typing');
    })
});
app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/public'));

app.get('/chat/:roomid', async (req, res) => {
   try{
    const chats = await Chat.find({
        roomId: req.params.roomid
    }).select('content user');
    console.log(chats);
    res.render('index', {
        name: 'Shiwang',
        id: req.params.roomid,
        chats: chats
    });
   }
    catch(err){ 
    console.log("error in chat route",err);
    throw new Error(err);
    }
});


server.listen(3000, async () => {
    console.log('Server started');
    try{
        await connect();
        console.log("mongo db connected")
    }
    catch(err){
        console.log("error in connecting the mongo server",err);
    }
    
});