var path = require('path');
const debug = require('debug')('my-namespace');
const name = 'my-app';
debug('booting %s', name);

var express = require('express');
var app = express();
const server = require('http').Server(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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

/*  Get port from environment and store in Express. */
const port = process.env.PORT || 6969;

/* Spin up server */
server.listen(port, () => {
	console.log(`Listening on ${server.address().port}`);
	console.log(`Address should be: http://localhost:${server.address().port}`);
});