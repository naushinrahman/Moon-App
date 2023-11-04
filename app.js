const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000; // You can choose any port you like

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from a 'public' directory

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Assuming your HTML file is in the same directory as your JS file
});