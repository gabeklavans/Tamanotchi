require('dotenv').config();
var path = require('path');
var favicon = require('serve-favicon');
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http');

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '6969');
app.set('port', port);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'index.html'));
});

/**
 * Set favicon
 */
app.use(favicon(path.join(__dirname,'public','assets','favicon.ico')));

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
 * GET request for handling Twilio SMS requests
 */
app.get('/index', function (req, res) {
    var kind = req.query.kind;
    // This will run every time you send a request to localhost:6969/index
    if (false) {
    } else {
        var text = 'YOU FLUSHED THE TOILET, also: ' + kind;

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = require('twilio')(accountSid, authToken);

        client.messages
        .create({
            body: text,
            from: process.env.FROM_NUMBER,
            to: process.env.TO_NUMBER
        })
        .then(message => console.log(message.sid))
        .done();
        res.send("USER HAS BEEN NOTIFIED THAT THEY FLUSHED THE TOILET");
    }
})

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
