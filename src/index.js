// external packages
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

// Start the webapp
const webApp = express();

// Webapp settings
webApp.use(bodyParser.urlencoded({
    extended: true
}));
webApp.use(bodyParser.json());

// Server Port
const PORT = process.env.PORT;

// Home route
webApp.get('/', (req, res) => {
    res.send(`Hello World.!`);
});

const axios = require('axios');
const WA = require('../helper-function/wsm');

// Available commands
const commands = [
  '- hello',
  '- hai',
  '- joke',
  '- quote',
  '- random pic',
  '- random password',
  '- help',
];

// Route for WhatsApp
webApp.post('/whatsapp', async (req, res) => {
  let message = req.body.Body;
  let senderID = req.body.From;

  console.log(`Message received: "${message}" from ${senderID}`);

  let response = '';
  if (message.toLowerCase() === 'hello') {
    response = 'Hello, how are you?';
  } else if (message.toLowerCase() === 'hai') {
    response = 'Wow!';
  } else if (message.toLowerCase() === 'joke') {
    try {
      const apiResponse = await axios.get('https://official-joke-api.appspot.com/random_joke');
      const { setup, punchline } = apiResponse.data;
      response = `${setup} ${punchline}`;
    } catch (error) {
      console.log(`Error fetching joke from API: ${error.message}`);
      response = 'Sorry, I could not fetch a joke at the moment. Please try again later.';
    }
  } else if (message.toLowerCase() === 'quote') {
    try {
      const apiResponse = await axios.get('https://api.quotable.io/random');
      const { content, author } = apiResponse.data;
      response = `"${content}" - ${author}`;
    } catch (error) {
      console.log(`Error fetching quote from API: ${error.message}`);
      response = 'Sorry, I could not fetch a quote at the moment. Please try again later.';
    }
  } else if (message.toLowerCase() === 'random pic') {
    try {
      const apiResponse = await axios.get('https://source.unsplash.com/random');
      response = apiResponse.request.res.responseUrl;
    } catch (error) {
      console.log(`Error fetching picture from API: ${error.message}`);
      response = 'Sorry, I could not fetch a picture at the moment. Please try again later.';
    }
  } else if (message.toLowerCase() === 'help') {
    response = `Available commands:\n${commands.join('\n')}`;
  }
  
  
  else if (message.toLowerCase() === 'random password') {
    response = generatePassword();
  }
  else {
    response = "Sorry, I didn't understand that.";
  }

  await WA.sendMessage(response, senderID);
  res.status(200).send();
});

function generatePassword() {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=';
  let password = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}




// Start the server
webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});
