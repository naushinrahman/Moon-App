const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000; 

app.use(express.static('public')); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html')); 
});

app.listen(port, () => console.log(`server listening on: ${port}`));