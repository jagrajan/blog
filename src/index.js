import bodyParser from 'body-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import morgan from 'morgan';

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

// app.use((req, res, next) => {
//   if (!req.headers.authorization) {
//     return res.status(401).end();
//   }

//   // get the last part from a authorization header string like "bearer token-value"
//   const token = req.headers.authorization.split(' ')[1];

//   // decode the token using a secret key-phrase
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).end();
//     }

//     const auth = decoded.auth;

//     console.log('Authorization: ', decoded);
//   });
//   next();
// });

app.use(morgan('tiny'));

app.use('/', indexRouter);

// Listen for incoming requests
app.listen(process.env.PORT, () => console.log(`App is running on port ${process.env.PORT}`));
