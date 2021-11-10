const app = require('./index')
const cluster = require('cluster')
const os = require('os');
const {Server} = require('socket.io')
const port = process.env.PORT || 3001;
const http = require('http').Server(app);
const {setupMaster, setupWorker} = require('@socket.io/sticky');
const {createAdapter, setupPrimary} = require('@socket.io/cluster-adapter');
const { EventEmitter } = require('stream');
const numCpu = os.cpus().length /2;


// if(cluster.isMaster){
//   // console.log(`Master ${process.pid} running`);

//   //setup sticky sessions
//   setupMaster(http, {
//     loadBalancingMethod: 'least-connection'
//   });

//   //setup connections between different workers
//   setupPrimary();
//   cluster.setupMaster({
//     serialization: "advanced",
//   })

  http.listen(port, () => {
    // console.log(`Socket.IO server running  on port :${port}/`);
  });
//   for(let i=0; i < numCpu; i++){
//     cluster.fork();
//   }

//   cluster.on("exit", (worker) => {
//     // console.log(`Worker ${worker.process.pid} died`);
//     cluster.fork()
//   })
// } else{
//   // console.log(`Worker ${process.pid} started`);

//create a new socket io server instance
//pass it the http server already listening on a particular port
//passing it a specific port number will automatically create a new http server at that port
  const io = new Server(http, {
    //allowing access from which domains
    cors: {
        //    origin: `${backendURL}`,
        //    origin: `*`,
        origin: `http://localhost:3000`,
        methods: ['POST', 'GET'] 
    }
});

//   io.adapter(createAdapter());

//   //main namespace
// const mainAdapter = io.of('/').adapter;
// //custom adapter
// const adminAdapter = io.of('/admin').adapter;

// io.of('/').adapter.on('create-room', (room) => {
//   console.log(`room ${room} was created`);
// })

// io.of('/').adapter.on('join-room', (room, id) => {
  //   console.log(`socket ${id} has joined room ${room}`);
  // })
  io.socketsJoin("video")
  //   setupWorker(io);

  //The names entered from each client
  let userNames= [];

  io.on('connection', (socket) => {
    //initially connect to the landing page
    console.log('connected to socket');
    
    socket.join('landing')

    //when the client sends the server their username
    //get all open rooms and disconnect the client from any that arent the landing page
    socket.on('send username', name => {
      console.log(name);
      // console.log(socket.adapter.rooms);
      const openRooms = [...socket.adapter.rooms]
      console.log(openRooms);
      // openRooms.map(room => {
      //   console.log(room, 'line 84');
      //   if(room[0] !== 'landing'){
      //     console.log(room[0], ' line 86');
      //     if(socket.id === room[0]){
      //       socket.disconnect();
      //       console.log(`socket id: ${socket.id} disconnected`);
      //       // console.log(socket);
      //     }
      //   }
      // })

    })
    
    // //listening for client messages to the server
    // socket.on('send message', (msg, id) => {
    //   console.log(id);
    //   console.log(msg, 'socket id line 105');
    //   io.to('landing').emit('chats', msg)
    // });

    //send information on the clients currently connected

    const response = `Welcome ${socket.id}`
    io.to(`${socket.id}`).emit('welcome', response)
    
    
    
    
    //socket.adapter.rooms grabs the rooms for the socket
    // io.socketsLeave(socket.id)
    // io.to(`${socket.id}`).emit('welcome', socket.id)
    // io.in('video').emit('')
    // io.to('video').emit('welcome', socket.id)
    // let customRoom;
    // const mySocketId = socket.id;
    //when new client connects and entered a room name
    //client joins that room,
    //socket emits to that room a new user joined
    //that user is displaye to other clients
    
    // socket.on('join room', user =>{
    //   // socket.join(user.room)
    //   // console.log(user.room);
    //   // customRoom = user.room;
    //   userNames.push(user.name)
    //   const openRooms = [...socket.adapter.rooms]
    //   console.log(openRooms);
    //     openRooms.map(connectedRoom => {
    //       if(connectedRoom[0] === user.room){
    //         let usersInRoom = Array.from(connectedRoom[1])
    //         io.to('user.room').emit('update users', userNames)
    //         // console.log(userNames, 'line 98');
    //       }
    //     })
      
    // })
    //listening for client messages to the server
   socket.on('send message', (msg, id) => {
      console.log(id);
      socket.to('landing').emit('chats', msg)
    });
    
  })
  // //listening for client messages to the server
  // io.on('send message', msg => {
     
  //   console.log(msg, 'socket id line 105');
  //   io.to('landing').emit('chats', msg)
  // });

  // io.on('join room', (socket) => {
  //   socket.join(user.roomToJoin, 'line 112')
  // })

  
  // io.on('video stream', (src,  connId) => {
    
   
  //   socket.to('video').emit('send video', src)
  // })
  

// }
