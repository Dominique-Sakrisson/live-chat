const app = require('./index')
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

const userProfiles = []

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
  // for(let i=0; i < numCpu; i++){
  //   cluster.fork();
  // }
  // cluster.on("exit", (worker) => {
  //   console.log(`Worker ${worker.process.pid} died`);
  //   cluster.fork()
  // })
// } else{
  // console.log(`Worker ${process.pid} started`);

  //create a new socket io server instance
  //pass it the http server already listening on a particular port
  //passing it a specific port number will automatically create a new http server at that port
  const io = new Server(http, {
    //allowing access from which domains
    cors: {
        //    origin: `${backendURL}`,
        //    origin: `*`,
        origin: `http://localhost:3000`,
        methods: ['POST', 'GET'],
        credentials: true 
    }
  });

  // io.adapter(createAdapter());


  //create namespaces and adapters 

  //main namespace
  // const mainAdapter = io.of('/').adapter;
  
  //custom admin namespace
  // const adminAdapter = io.of('/admin').adapter;
  
  //listener for anytime a room is created
  // mainAdapter.on('create-room', (room) => {
  //   console.log(`room ${room} was created`);
  // })
  
  // //listener for anytime a room is joined
  // mainAdapter.on('join-room', (room, id) => {
  //   console.log(`socket ${id} has joined room: ${room}`);
  // })

  // setupWorker(io);

  io.sockets.on('connection', (socket) => {
    console.log('new connection', socket.id);
    socket.join('landing')

    //one way of getting the connected sockets list
    var clientRooms = io.sockets.adapter.rooms;
    const landingRoom = clientRooms.get('landing')
    const connectedNames = Array.from(landingRoom)

    //send number of connected clients
    io.to('landing').emit('users', landingRoom.size)

    //on disconnect we want to send client update of current users on the server
    socket.on('disconnecting', () => {
      console.log(socket.id, 'hhhhhhhhhhhhhhhhhhhhhh');
      var clientRooms = io.sockets.adapter.rooms;
      const landingRoom = clientRooms.get('landing')
      //relay the number of remaining users  
const nowUsers = userProfiles.filter(profile => (profile.privateRoom === socket.id ))
      if(landingRoom){
        io.to('landing').emit('users', landingRoom.size)
      }
console.log(nowUsers, 'after ones gone');
      io.to('landing').emit('update users', nowUsers )

    });
    console.log(userProfiles, 'profiles array');
    //this gets very slow when more than 2 users are connected
    socket.on('send new user', user => {
      userProfiles.push({
        privateRoom: socket.id, 
        username: user.displayName
      })

      console.log(userProfiles);

      var clientRooms = io.sockets.adapter.rooms;
      const landingRoom = clientRooms.get('landing')

      const connectedNames = Array.from(landingRoom)

      const response = `Welcome ${user.displayName}`

      //emit event to room landing, a welcome message for the newly connected client
      io.to('landing').emit('welcome', response, user)

      //emit event to room landing a list of connected clients
      io.to('landing').emit('update users', userProfiles )
    })

    socket.on('send message', (msg, id) => {
      socket.to('landing').emit('chats', msg)
    });
  });
// }
