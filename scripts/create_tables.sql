BEGIN;

CREATE TABLE party (
  party_id serial NOT NULL,
  display_name text NOT NULL,
  max_party_size int NOT NULL,
  rsvp boolean NOT NULL,
  rsvp_on timestamp NULL DEFAULT now(),

  PRIMARY KEY (party_id)
);

CREATE TABLE guest (
  guest_id serial NOT NULL,
  party_id int NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,

  PRIMARY KEY (guest_id),

  FOREIGN KEY (party_id)
    REFERENCES party
);

COMMIT;
