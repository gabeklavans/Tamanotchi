require('dotenv').config();
var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/index', function (req, res) {
    // This will run every time you send a request to localhost:6969/index
    var text = 'YOU FLUSHED THE TOILET, also: ' + req.query.term;

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
})

server.listen(6969, function () {
    console.log(`Listening on ${server.address().port}`);
});
