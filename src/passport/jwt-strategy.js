import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

const strategy = new JwtStrategy(opts, (jwt_payload, done) => {
  if (jwt_payload.auth_id !== false) {

    return done(null, true);
  }
  return done(null, false);
});

export default strategy;
