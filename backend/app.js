// backend/app.js

const express = require("express");
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cors = require('cors');
const csurf = require('csurf');
const { isProduction } = require('./config/keys');


require('./models/User');
require('./models/Tweet');
require('./config/passport');
const passport = require('passport');

const usersRouter = require('./routes/api/users'); // update the import file path
const tweetsRouter = require('./routes/api/tweets');
const csrfRouter = require('./routes/api/csrf');

const app = express();

app.use(logger('dev')); // log request components (URL/method) to terminal
app.use(express.json()); // parse JSON request body
app.use(express.urlencoded({ extended: false })); // parse urlencoded request body
app.use(cookieParser()); // parse cookies as an object on req.cookies

app.use(passport.initialize());

// ADD THIS SECURITY MIDDLEWARE
// Security Middleware
if (!isProduction) {
    // Enable CORS only in development because React will be on the React
    // development server (http://localhost:3000). (In production, the Express 
    // server will serve the React files statically.)
    app.use(cors());
}

// Set the _csrf token and create req.csrfToken method to generate a hashed
// CSRF token
app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
  );

// Attach Express routers
app.use('/api/users', usersRouter); // update the path
app.use('/api/tweets', tweetsRouter);
app.use('/api/csrf', csrfRouter);


module.exports = app;