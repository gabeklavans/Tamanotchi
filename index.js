var path = require('path');
var favicon = require('serve-favicon');
var express = require('express');
var app = express();
var http = require('http');

var routes = require('./routes');

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '6969');
app.set('port', port);

/**
 * Serve the main webpage
 */
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", function(req, res, next) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use("/index", routes);

/**
 * Set favicon
 */
app.use(favicon(path.join(__dirname, 'public', 'assets','favicon.ico')));

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
