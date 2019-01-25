import jwt from 'jsonwebtoken';

import { error } from '../debug/logger';
import { get, set } from '../cache/auth-cache';
import { query } from '../db/index';

export const ensureAuthenticated = (admins_only) => (req, res, next) => {
  let token = req.headers['authorization'];
  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          error('Error verifying token');
          error(err);
          return res.json({
            error: 'invalid-authorization',
            message: 'Error while decoding token',
          });
        }
        const auth_key = decoded.auth_key;
        if (auth_key) {
          get(auth_key, (err1, value) => {
            if (err1) {
              return res.json({
                error: 'authorization-server-failure',
              });
            } else {
              if (!value) {
                query('SELECT user_id, fingerprint, expire_on, admin FROM users.auth_key' 
                  + ' WHERE id=$1', [auth_key], (err2, results) => {
                    if (err2) {
                      return res.json({
                        error: 'authorization-server-failure',
                      });
                    } else {
                      if (results.rowCount  < 1) {
                        return res.json({
                          error: 'invalid-authorization',
                        });
                      } else {
                        const key_data = results.rows[0];
                        set(auth_key, {
                            fingerprint: key_data.fingerprint,
                            user_id: key_data.user_id,
                            admin: key_data.admin,
                          },
                          (err3, success) => {
                            return req.fingerprint.hash === key_data.fingerprint
                              && new Date() < new Date(key_data.expire_on)
                              && (!admins_only || key_data.admin) ?
                              next() : res.json({
                                error: 'invalid-authorization',
                                message: 'Your key is no longer valid.',
                              });
                          });
                      }
                    }
                  });
              } else {
                return req.fingerprint.hash === value.fingerprint 
                  && (!admins_only || value.admin) ? 
                  next() : res.json({
                    error: 'invalid-authorization',
                  });
              }
            }
          });
        } else {
          return res.json({
            error: 'invalid-authorization',
            message: 'Token has incomplete data',
          });
        }
      });
    } else {
      return res.json({
        error: 'invalid-authorization',
        message: 'Invalid Bearer token',
      });
    }
  } else {
    return res.json({
      error: 'invalid-authorization',
      message: 'No token found',
    });
  }
}
