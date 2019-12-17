const express = require('express');
const app = express();
// const env = require('dotenv').config()
const cookieSession = require('cookie-session');

const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use(cors());
app.use(cookieSession({
  name: 'session',
  secure: process.env.ENSURE_SSL === 'true',
  keys: [process.env.SESSION_KEY_1, process.env.SESSION_KEY_2, process.env.SESSION_KEY_3],
  maxAge: 12 * 60 * 60 * 1000
}));
app.use('/api/', require('./sessions.router'));

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
