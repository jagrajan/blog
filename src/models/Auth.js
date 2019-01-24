import jwt from 'jsonwebtoken';

import { query } from '../db/index';
import { error } from '../debug/logger';
import pw from '../util/pw';

export const login = (email, password, callback) => {
  query('SELECT email, password FROM users.profile WHERE email = $1',
    [email], (err, res) => {
    if (err) {
      error('Error retreving user during log in');
      error(err);
      callback(err, []);
      return;
    }
    if (res.rowCount < 1) {
      callback(false, { error: 'invalid-email' });
      return;
    }
    const row = res.rows[0];
    pw.verify(row.password, password, (err1, isValid) => {
      if (err1) {
        error('Error while verifying password');
        error(err1);
        callback(err, []);
        return;
      }
      if (!isValid) {
        callback(false, { error: 'invalid-password' });
        return;
      }
      const opts = {};
      opts.expiresIn = 60;
      const token = jwt.sign({ email }, process.env.JWT_SECRET, opts);
      callback(false, { token });
    });
  });
};
