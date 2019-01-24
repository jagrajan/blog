import credential from 'credential';

import pw from '../util/pw';
import { error } from '../debug/logger';
import { query } from '../db/index';

export const getAllUsers = (callback) => {
  query('SELECT * FROM users.profile;', [], (err, res) => {
    if(err) {
      error('Error retrieving all users');
      error(err);
      callback(err, []);
      return;
    }
    callback(false, res.rows);
  });
};

export const createUser = (email, password, callback) => {
  pw.hash(password, (err, hash) => {
    if (err) {
      error('Error when hashing password');
      error(err);
      callback(err, false);
      return;
    }
    query('INSERT INTO users.profile(email, password) VALUES ($1, $2)'
      + 'RETURNING id',
      [email, hash], (err1, res) => {
      if (err1) {
        error('Error creating new user');
        error(err);
        callback(err1, false);
        return;
      }
      callback(false, res.rows);
    });
  });
};
