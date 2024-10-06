const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const api = require('./routes/api')
const app = express();

app.use(cors({
  origin: ['*'],
}));

app.use(morgan('combined'));
app.use(express.json());

app.use('/v1', api)

app.get('/', (req, res) => {
  res.send('Hello, this is the root endpoint!');
});


// Serve the static files from the client folder
// app.use(express.static(path.join(__dirname, '..', 'public')));

// Set up routes or middleware if needed
// ...

module.exports = app;
