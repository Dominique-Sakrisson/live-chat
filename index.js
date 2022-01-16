const express = require('express')
const path = require('path')
const app = require('express')()

app.use(express.static(path.join(__dirname, 'live-feed-client/build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/live-feed-client/src/index.js'));
});

module.exports = app
