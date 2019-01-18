require('dotenv').config();
const express = require("express");
const router = express.Router();

/**
 * GET request for handling Twilio SMS requests
 */
router.get('/', (req, res) => {
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
        .catch(err => {
          console.log(err);
        });
        res.send("USER HAS BEEN NOTIFIED THAT THEY FLUSHED THE TOILET");
    }
})

module.exports = router;