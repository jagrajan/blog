import jwt from 'jsonwebtoken';

import { query } from '../db/index';
import { error } from '../debug/logger';
import pw from '../util/pw';
import { set } from '../cache/auth-cache';

export const login = (email, password, fingerprint, callback) => {
  query(`SELECT id, email, password,
    CASE
      WHEN id IN (
        SELECT user_id FROM admin.admin
      ) THEN true
      ELSE false
    END
      AS admin
    FROM users.profile WHERE email = $1`,
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
      opts.expiresIn = 600;
      const expireStamp = new Date();
      expireStamp.setTime(expireStamp.getTime() + 120000);
      const expire = expireStamp.toISOString().slice(0, 19).replace('T', ' ');
      query('INSERT INTO users.auth_key(user_id, expire_on, fingerprint, admin)'
        + ' VALUES($1, $2, $3, $4) RETURNING id',
        [row.id, expire, fingerprint, row.admin], (err2, res2) => {
          if (err2) {
            error('Error retreving create auth key');
            error(err2);
            callback(err2, []);
            return;
          }
          const auth_key = res2.rows[0].id;
          const token = jwt.sign({ auth_key }, process.env.JWT_SECRET, opts);
          set(auth_key, { 
              fingerprint: fingerprint,
              user_id: row.id,
              admin: row.admin,
          }, (err3, success) => {
            callback(err3, { token });
          });
        });
    });
  });
};
