// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
const accountSid = 'AC38df04a0ee9788e65ab44216fa91d97f';
const authToken = '82869a6a8e19805af6ea0d1ce5326a6f';
var client = new twilio(accountSid, authToken);

client.messages
  .create({
     body: 'WORK',
     from: '+13217104809',
     to: '+14074084325'
   })
  .then(message => console.log(message.sid))
  .done();