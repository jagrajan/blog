import bodyParser from 'body-parser';
import express from 'express';
import passport from 'passport';
import morgan from 'morgan';
import Fingerprint from 'express-fingerprint';

import { query } from './db/index';

import indexRouter from './routes/index';

import jwtStrategy from './passport/jwt-strategy';

// Initialize the app server
const app = express();

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Set up body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(Fingerprint({
  parameters: [
    Fingerprint.useragent,
    Fingerprint.acceptHeaders,
    Fingerprint.geoip
  ],
}));

app.use(morgan('tiny'));

app.use('/', indexRouter);

// Listen for incoming requests
app.listen(process.env.PORT, () => console.log(`App is running on port ${process.env.PORT}`));
