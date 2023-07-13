const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const celebrateErrors = require('celebrate').errors;
const { requestLogger, errorLogger } = require('./middlewares/logger');
const filterCors = require('./middlewares/cors');
const handleServerError = require('./middlewares/handleServerError');
const { checkAuthorizedUser } = require('./middlewares/auth');
const rateLimiter = require('./middlewares/rateLimiter');
const users = require('./routes/users');
const movies = require('./routes/movies');
const auth = require('./routes/auth');

require('dotenv').config();
const { PORT = 3000, MONGO_DB_URI = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
mongoose.connect(MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(filterCors);
app.use(rateLimiter);

app.use('/', auth);
app.use('/movies', checkAuthorizedUser, movies);
app.use('/users', checkAuthorizedUser, users);


app.use(errorLogger);
app.use(celebrateErrors());
app.use(handleServerError);

app.listen(PORT);