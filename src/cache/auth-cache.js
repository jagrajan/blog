import NodeCache from 'node-cache';
import { log, error } from '../debug/logger';

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export const set = (auth_key, key_data, callback) => {
  cache.set(auth_key, key_data, (err, success) => {
    if (err || !success) {
      error('Error inserting auth key in cache');
      error(`Key: ${auth_key}, Data ${key_data}`); 
      error(err);
      callback(err, success);
      return;
    }
    log('Inserted auth key in cache');
    log(`Key: ${auth_key}, Data ${key_data}`); 
    log(success);
    callback(err, success);
  });
};

export const get = (auth_key, callback) => {
  log(`Retrieving value for auth key: ${auth_key}`);
  cache.get(auth_key, (err, value) => {
    if (err) {
      error('Error retrieving value from cache');
      error(err);
      callback(err, value);
      return;
    }
    log('Retrieval succesful!');
    log(value);
    callback(err, value);
  });
}
