const app = require('express')()
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/live-feed-client/src/index.js');
});

module.exports = app
