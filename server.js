const app = require('./index')
const ws = require('ws')
const cluster = require('cluster')
const os = require('os');
const {Server} = require('socket.io')
const port = process.env.PORT || 3001;
const http = require('http').Server(app);
const {setupMaster, setupWorker} = require('@socket.io/sticky');
const {createAdapter, setupPrimary} = require('@socket.io/cluster-adapter');
const { EventEmitter } = require('stream');
const { createPublicKey } = require('crypto');
const numCpu = os.cpus().length /2;

let userProfiles = []

// commented out code from lines 18 - 87 implements clusters and the creation of worker processes that will distribute the server load across multiple instances of the server running in separate clusters

// if(cluster.isMaster){
  // console.log(`Master ${process.pid} running`);
  // //setup sticky sessions
  // setupMaster(http, {
  //   loadBalancingMethod: 'least-connection'
  // });
  // //setup connections between different workers
  // setupPrimary();
  // cluster.setupMaster({
  //   serialization: "advanced",
  // })
  http.listen(port, () => {
    console.log(`Socket.IO server running  on port :${port}/`);
  });
//   for(let i=0; i < numCpu; i++){
//     cluster.fork();
//   }
//   cluster.on("exit", (worker) => {
    // console.log(`Worker ${worker.process.pid} died`);
//     cluster.fork()
//   })
// } else{
  // console.log(`Worker ${process.pid} started`);

  //create a new socket io server instance
  //pass it the http server already listening on a particular port
  //passing it a specific port number will automatically create a new http server at that port
  const io = new Server(http, {
    //allowing access from which domains
    cors: {
          //  origin: `${backendURL}`,
        origin: `https://live-chat-feed.herokuapp.com/`,
        origin: `http://localhost:3000`,
        methods: ['POST', 'GET'],
        credentials: true 
    }
  });

  // io.adapter(createAdapter());


  //create namespaces and adapters 

  //main namespace
  const mainAdapter = io.of('/').adapter;
  
  
  //custom admin namespace
  // const adminAdapter = io.of('/admin').adapter;
  
  let roomsData = []
  //listener for anytime a room is created
  mainAdapter.on('create-room', (room) => {
    console.log(`room ${room} was created`);
    
  })
  
  // //listener for anytime a room is joined
  mainAdapter.on('join-room', (room, id) => {
    // console.log(`socket ${id} has joined room: ${room}`);
  })

  // setupWorker(io);


  // const openChatNameSpace = io.of("/openChat")

  // openChatNameSpace.on('connection', (socket)=> {
    // console.log('connected to openChat namespace');
  // })
  
  function buildRoomData(roomMap) {

    const roomMapEntries = Array.from(roomMap.entries());
    
    const roomsInfo = []


    roomMapEntries.forEach(room => {
      
      const infoObj = {name: room[0], count: room.length}
      
      roomsInfo.push(infoObj)
    })
    return roomsInfo;
  }

  io.sockets.on('connection', (socket) => {
    const socketCount = io.of('/').sockets.size;
    socket.join('landing')
    //get all the rooms 
    var clientRooms = io.sockets.adapter.rooms;
    const roomObj = buildRoomData(clientRooms) 
    roomObj.map(item => {
      io.to(item.name).emit('room updates', buildRoomData(clientRooms))
    })
    
  
    //get the room name landing
    const landingRoom = clientRooms.get('landing')
    //returns all the names connected to landing
    const connectedNames = Array.from(landingRoom)

    //send number of connected clients
    io.to('landing').emit('users', landingRoom.size)
  

    //this gets very slow when more than 2 users are connected
    socket.on('send new user', user => {
       //relay the number of remaining users  
       if(!userProfiles.includes(socket.id)){
         userProfiles.push({
           privateRoom: socket.id,
           currentRoom: user.roomTojoin, 
           username: user.displayName
         })
       }

      //joins the default room, or the room the client selected 
      socket.join(user.roomToJoin)
      
      //build a response to client connected with the users name they selected
      const response = `Welcome ${user.displayName}`

      //emit event to room landing, a welcome message for the newly connected client
      io.to('landing').emit('welcome', response, user)

      //emit event to room landing a list of connected clients
      io.to('landing').emit('update users', userProfiles )
    })

    socket.on('send message', (msg, {id, sender}) => {
      socket.to('landing').emit('chats', msg, {id, sender})
    });

    //event listener for video stream event coming from the client
    // socket.on('video stream', src => {
    //   socket.to('landing').emit('send video', src)
    // })


    //beginning of the webRTC  implementation for live video streaming and its related event listeners for the client
   
    socket.on('ICECandidate', data => {
      console.log('000000');
      let message = data.rtcMessage
      let candidate = new RTCIceCandidate({
        sdpMLineIndex: message.label,
        candidate: message.candidate
      })
      if(peerConnection) {
        peerConnection.addIceCandidate(candidate);
      }
    })

    socket.on('call', (data) => {
      console.log('eeeeeeeeeeeeee');
      let caller = data.name;
      let rtcMessage = data.rtcMessage;

      socket.to(caller).emit('newCall', {
        caller: socket.user,
        rtcMessage: rtcMessage
      })
    })

    socket.on('answerCall', (data) => {
      let caller = data.caller;
      let rtcMessage = data.rtcMessage;
      socket.to('landing').emit('callAnswered', {
        callee:socket.user,

      })
    })



    //on disconnect we want to send client update of current users on the server
    socket.on('disconnect', () => {
      //relay the number of remaining users  
      let nowUsers = [];
      for(let i = 0; i < userProfiles.length; i++){
        if(userProfiles[i].privateRoom != socket.id){
          nowUsers.push(userProfiles[i])
        }
      }
      if(landingRoom){
        io.to('landing').emit('users', landingRoom.size)
      }

      io.to('landing').emit('update users', nowUsers )
      userProfiles= nowUsers;
    });
  });
// }
