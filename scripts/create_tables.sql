BEGIN;

CREATE TABLE party (
  party_id int NOT NULL,
  display_name text NOT NULL,
  max_party_size int NOT NULL,
  party_size int NOT NULL DEFAULT 0 CHECK (party_size >= 0),
  attending boolean NULL,
  comment text NULL,
  rsvp_on timestamp NULL,

  PRIMARY KEY (party_id),
  CHECK (party_size <= max_party_size)
);

CREATE TABLE guest (
  guest_id serial NOT NULL,
  party_id int NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  rsvp_on timestamp NULL,

  PRIMARY KEY (guest_id),

  FOREIGN KEY (party_id)
    REFERENCES party
);

COMMIT;
