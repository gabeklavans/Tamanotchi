var path = require('path');
const debug = require('debug')('my-namespace');
const name = 'my-app';
debug('booting %s', name);

var express = require('express');
var app = express();
var http = require('http');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const concat = require("concat");

/* Bundle JS files into one main file */
concat(['./public/misc.js', 
	'./public/main.js',
	'./public/tama_eat.js',
	'./public/tama_status.js',
	'./public/init_game.js'],
'./public/bundle.js')
	.then(result => console.log("Successfully bundled into bundle.js"))
	.catch(err => console.log(err));

var twilioRouter = require('./routes/twilio');
var mongoRouter = require('./routes/mongo');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Set up MongoDB Atlas client
 */
// mongoose.connect(
// 	"mongodb+srv://the-mayor:" +
// 	process.env.MONGO_ATLAS_PW +
// 	"@tamanotchidb-6mz7m.gcp.mongodb.net/test?retryWrites=true",
// 	{ useNewUrlParser: true }
// ).catch(err => {
// 	console.log(err);
// });
// mongoose.Promise = global.Promise;

/**
 * Some CORS voo-doo stuff
 */
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
});

/**
 * Routing for request handling
 */

//serve the main app
app.get("/", (req, res) => {
	//res.sendFile(path.join(__dirname, 'part1.html'));
});

//internal Request routers
app.use("/twilio", twilioRouter);
app.use("/mongo", mongoRouter);

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

/* ~~~Server stuff~~~ */

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '6969');
app.set('port', port);

/**
 * Normalize a port into a number, string, or false.
 * Not sure why this is here, it was included in a tutorial so I left it in 🤷‍
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
server.listen(port, onListening);

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	//debug('Listening on ' + bind);
	console.log('Listening on ' + bind);
}
