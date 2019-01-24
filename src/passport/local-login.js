import jwt from 'jsonwebtoken';
import { Strategy as PassportLocalStrategy } from 'passport-local';

const strategy = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true,
}, (req, email, password, done) => {
  const userData = {
    email: email.trim(),
    password: password.trim(),
  };

  console.log('Userdata', userData);

  if (userData.email === process.env.AUTH_EMAIL
    && userData.password === process.env.AUTH_PASSWORD) {
    const payload = {
      auth: true,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    const data = {
      auth: true,
    };
    return done(null, token, data);
  }
  const error = new Error('Incorrect email or password');
  error.name = 'IncorrectCredentialsError';

  return done(error);
});

export default strategy;
