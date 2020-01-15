const express = require('express'); // importing a CommonJS module
const helmet = require('helmet'); // npm i helmet
const morgan = require('morgan'); // npm i morgan

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// global middleware (cares about all requests)

// write a middleware called uppercaser, that takes the name from the body and makes it Uppercase before it
// makes it to the request handler/router. Only apply that middleware to routes that begin with /api/hubs
// and only on POST and PUT

server.use(express.json());
server.use(helmet());
server.use(morgan('tiny'));
// server.use(logger);
// server.use(echo);
// server.use(gateKeeper);

// cares only about requests beginning with /api/hubs
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : '';

  res.send(`
  <h2>Lambda Hubs API</h2>
  <p>Welcome${nameInsert} to the Lambda Hubs API</p>
  `);
});

server.use(greeter);

// three amigas
function greeter(req, res, next) {
  res.status(200).json({ hi: 'there' });
}

function logger(req, res, next) {
  const { method, originalUrl } = req;
  console.log(`${method} to ${originalUrl}`);

  next();
}

// write a middleware function called "echo", that will simply console.log the information in the body
function echo(req, res, next) {
  console.log(req.body);

  next();
}

// write a gatekeeper mw, that reads a password from the headers, if the password is "mellon", let the request continue
// if the password is wrong, then return status code 401 and an object like this: { you: "shall not pass!" }
function gateKeeper(req, res, next) {
  if (req.headers.password === 'mellon') {
    next();
  } else {
    res.status(401).json({ you: 'shall not pass!' });
  }
}

module.exports = server;

// axios.get('url', { headers: { password: '' } })
// axios.post('url', { data: .. goes in the body}.  { headers: { password: '' } })
