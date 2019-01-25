BEGIN;

  CREATE SCHEMA IF NOT EXISTS users;
  CREATE SCHEMA IF NOT EXISTS admin;

  DROP TABLE IF EXISTS admin.admin;
  DROP TABLE IF EXISTS users.auth_key;
  DROP TABLE IF EXISTS users.profile;

  CREATE OR REPLACE FUNCTION update_last_update() RETURNS TRIGGER
  LANGUAGE plpgsql
  AS
  $$
  BEGIN
    NEW.last_update = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
  $$;

  CREATE TABLE users.profile (
    id          SERIAL PRIMARY KEY          NOT NULL,
    email       VARCHAR(100)                NOT NULL,
    password    TEXT                        NOT NULL
  );

  -- CREATE TRIGGER update_last_update
    -- BEFORE UPDATE
    -- ON users.profile
    -- FOR EACH ROW
      -- EXECUTE PROCEDURE update_last_update();

  CREATE TABLE users.auth_key (
    id          SERIAL PRIMARY KEY          NOT NULL,
    user_id     INTEGER                     NOT NULL REFERENCES users.profile(id),
    expire_on   TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    fingerprint TEXT                        NOT NULL,
    admin       BOOLEAN                     DEFAULT false
  );

  -- CREATE TRIGGER update_last_update
    -- BEFORE UPDATE
    -- ON admin.admin
    -- FOR EACH ROW
      -- EXECUTE PROCEDURE update_last_update();

  CREATE TABLE admin.admin (
    user_id     INTEGER PRIMARY KEY         NOT NULL REFERENCES users.profile(id),
    expire_on   TIMESTAMP WITHOUT TIME ZONE,
    master      BOOLEAN                     DEFAULT false
  );

  DO $$
    DECLARE
      t record;
    BEGIN
      FOR t IN
        SELECT * FROM pg_tables
        WHERE schemaname IN ('admin', 'users')
      LOOP
        EXECUTE format('ALTER TABLE %I.%I ' ||
          'ADD COLUMN create_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW();',
          t.schemaname, t.tablename);

        EXECUTE format('ALTER TABLE %I.%I ' ||
          'ADD COLUMN last_update TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW();',
          t.schemaname, t.tablename);

        EXECUTE format('CREATE TRIGGER update_last_update
                        BEFORE UPDATE ON %I.%I
                        FOR EACH ROW EXECUTE PROCEDURE update_last_update()',
                        t.schemaname, t.tablename);
      END LOOP;
    END;
  $$ LANGUAGE plpgsql;



  -- DO $$
    -- DECLARE
      -- t record;
    -- BEGIN
      -- FOR t IN
        -- SELECT * FROM information_schema.columns
        -- WHERE column_name = 'last_update'
      -- LOOP
        -- EXECUTE format('CREATE TRIGGER update_last_update
                        -- BEFORE UPDATE ON %I.%I
                        -- FOR EACH ROW EXECUTE PROCEDURE update_last_update()',
                        -- t.table_schema, t.table_name);
      -- END LOOP;
    -- END;
  -- $$ LANGUAGE plpgsql;

  -- CREATE TRIGGER update_last_update
    -- BEFORE UPDATE
    -- ON admin.admin
    -- FOR EACH ROW
      -- EXECUTE PROCEDURE update_last_update();


COMMIT;
