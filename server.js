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
  console.log(`Master ${process.pid} running`);

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
    console.log(`Socket.IO server running  on port :${port}/`);
  });
  for(let i=0; i < numCpu; i++){
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork()
  })
} else{
  console.log(`Worker ${process.pid} started`);
  const io = new Server(http, {});

  io.adapter(createAdapter());

  setupWorker(io);

  io.on('connection', (socket) => {
    socket.join('video')
    console.log('connected to socket');

    const response = `Welcome ${socket.id}`
    socket.emit('welcome', response)

    socket.on('chat message', msg => {
      io.emit('chat message', msg);
    });

    socket.on('video', (src) => {
      console.log(src);
      socket.emit('send video', src)
    })
  })

}
