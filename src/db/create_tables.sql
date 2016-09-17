CREATE TABLE groups (
  group_id serial PRIMARY KEY,
  date_created timestamp NOT NULL DEFAULT now()
);

CREATE TABLE guests (
  guest_id integer PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  attending boolean NOT NULL,
  date_created timestamp NOT NULL,
  group_id integer NOT NULL REFERENCES groups(group_id)
);
