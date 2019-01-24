BEGIN;

  CREATE SCHEMA IF NOT EXISTS users;

  DROP TABLE IF EXISTS users.profile;

  CREATE TABLE users.profile (
    id        SERIAL PRIMARY KEY  NOT NULL,
    email     VARCHAR(100)        NOT NULL,
    password  TEXT                NOT NULL
  );

  -- CREATE TABLE users.auth_key (
    -- id        SERIAL PRIMARY KEY  NOT NULL,
    

COMMIT;
