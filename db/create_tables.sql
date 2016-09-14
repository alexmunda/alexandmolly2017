create table guests (
  guest_id integer PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  attending boolean NOT NULL,
  date_created timestamp NOT NULL,
  group_id integer NOT NULL REFERENCES groups(group_id)
)

create table groups (
  group_id integer PRIMARY KEY,
  date_created timestamp NOT NULL
)
