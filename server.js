var path = require('path');
var favicon = require('serve-favicon');
var express = require('express');
var app = express();
var http = require('http');
const mongoose = require("mongoose");

var twilioRouter = require('./routes/twilio');
var mongoRouter = require('./routes/mongo');

/**
 * Routing for request handling
 */
app.use(express.static(path.join(__dirname, 'public')));

//serve the main app
app.get("/", function(req, res, next) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use("/twilio", twilioRouter);
app.use("/mongo", mongoRouter);

//TODO: Convert all callbacks to arrow-syntax
//catch-all
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
//error handling
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

/**
 * Set favicon
 */
app.use(favicon(path.join(__dirname, 'public', 'assets','favicon.ico')));

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '6969');
app.set('port', port);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
//server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  //debug('Listening on ' + bind);
  console.log('Listening on ' + bind);
}
