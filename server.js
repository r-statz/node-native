const express = require('express');
const app = express();
// const env = require('dotenv').config()
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use(cors());

app.use('/', async (req, res, next) => {
  console.log('Hit the images route!');
  try {
    const images = await db('images').select('*');
    res.json(images);
  } catch (e) {
    console.log(e);
  }
});
app.use('/:id', async (req, res, next) => {
  try {
    const image = await db('images').select('*').where('id', req.params.id);
    res.json(images);
  } catch (e) {
    console.log(e);
  }
});


app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err });
});

// catch all error route
app.use((req, res, next) => {
  res.status(404).json({ error: { message: 'Page not found' } });
});

//route for listening on the port
const listener = () => console.log(`Listening on port ${port}!`);
app.listen(port, listener);

module.exports = app;
