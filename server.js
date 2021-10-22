const app = require('./index')
const {createServer} = require('http')
const {Server} = require('socket.io')

const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on('connection', (socket) => {
    console.log('connected to socket');
    
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
        // socket.broadcast.emit('SOMONE SAID: ', msg);
      });
})

httpServer.listen(3000);
