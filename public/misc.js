// 1. Create the button
var button = document.createElement("button");
button.innerHTML = "Retrieve my number from database";

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);

// 3. Add event handler
button.addEventListener("click", getTestData);

function createTestData() {
    var testBody = {
        "number": "+14074084325"
    }

    fetch('http://localhost:6969/mongo', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(testBody)
    }).then(function (res) {
        res.text().then(function (text) {
            console.log(text);
        });
    });
}

function getTestData() {
    var num = '5c3ef210005c3f570cc7ba56';
    fetch('http://localhost:6969/mongo/' + num, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (res) {
        return res.json();
    }).then(doc => {
        alert("JK it won't be THAT easy to get my digits ;) But here's the game save ID: " + doc._id);
    });
}

/**
 * Returns a Date object of the new time
 */
function getNextPoopTime() {
    let date = moment();
    let amount = Math.floor(Math.random() * 10);
    console.log("Made next poop time " + amount + "min from now");
    date.add(amount, 'm');
    return date.toDate();
}

/**
 * Sends an SMS text using Twilio
 */
function sendSMS(kind = "test data worked!") {
    var url = 'http://localhost:6969/twilio?kind=' + kind;
    fetch(url).then(res => {
        return res.text();
    }).then(data => {
        console.log(data);
    });
}