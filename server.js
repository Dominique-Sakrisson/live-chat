const app = require('./index')
const cluster = require('cluster')
const os = require('os');
const {Server} = require('socket.io')
const port = process.env.PORT || 3000;
const http = require('http').Server(app);
const {setupMaster, setupWorker} = require('@socket.io/sticky');
const {createAdapter, setupPrimary} = require('@socket.io/cluster-adapter');
const numCpu = os.cpus().length /2;

if(cluster.isMaster){
  // console.log(`Master ${process.pid} running`);

  //setup sticky sessions
  setupMaster(http, {
    loadBalancingMethod: 'least-connection'
  });

  //setup connections between different workers
  setupPrimary();
  cluster.setupMaster({
    serialization: "advanced",
  })

  http.listen(port, () => {
    // console.log(`Socket.IO server running  on port :${port}/`);
  });
  for(let i=0; i < numCpu; i++){
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    // console.log(`Worker ${worker.process.pid} died`);
    cluster.fork()
  })
} else{
  // console.log(`Worker ${process.pid} started`);
  const io = new Server(http, {});

  io.adapter(createAdapter());

  setupWorker(io);

  io.on('connection', (socket) => {
    socket.join('video')
    
    // io.to(`${socket.id}`).emit('welcome', socket.id)
    const response = `Welcome ${socket.id}`
    io.to(`${socket.id}`).emit('welcome', response)
    
    io.in('video').emit('')
    
    io.to('video').emit('welcome', socket.id)
    

    const rooms = socket.adapter;
   
   
    console.log('connected to socket');
    
    socket.on('chat message', msg => {
      io.to('video').emit('chat message', msg);
    });
    
    let prevSrc= [];
    const mySocketId = socket.id;
    
    socket.on('video stream', (src,  connId) => {
      
      console.log(prevSrc);
      socket.to('video').emit('send video', src)
    })
  })
  
  

}
