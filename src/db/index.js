import { Pool } from 'pg';

import { error, log } from '../debug/logger';


log('Starting database connection pool with the following settings:');
log(`DB_USER = ${process.env.DB_USER}`);
log(`DB_HOST = ${process.env.DB_HOST}`);
log(`DB_NAME = ${process.env.DB_NAME}`);
log(`DB_PASSWORD = ${process.env.DB_PASSWORD}`);
log(`DB_PORT = ${process.env.DB_PORT}`);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test DB connection
pool.query('SELECT NOW();', (err, res) => {
  if (err) {
    error('Error connecting to database');
    error(err);
  } else {
    log('Connection to database has been established.');
  }
});

export const query = (text, params, callback) => {
  const start = Date.now();
  return pool.query(text, params, (err, res) => {
    const duration = Date.now() - start;
    if (err) {
      error('Error running query');
      error(`Query: ${text}`);
      error(`Params: ${params}`);
      error(err);
      callback(err, res);
    } else {
      log(`Query executed in ${duration}ms`);
      log(`Query: ${text}`);
      log(`Params: ${params}`);
      log(`Number of rows: ${res.rowCount}`);
      log(res);
      callback(err, res);
    }
  });
};
