export const createTables = (pool) => pool.query(`
  CREATE TABLE IF NOT EXISTS groups (
    group_id serial PRIMARY KEY,
    date_created timestamp NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS  guests (
    guest_id serial PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    attending boolean NOT NULL,
    date_created timestamp NOT NULL,
    group_id integer NOT NULL REFERENCES groups(group_id)
  );
`);

export const insertDefaultGroup = (pool) => pool.query('INSERT INTO groups DEFAULT VALUES');

export const insertGuestsWithGroup = (pool, rsvp, groupId) => {
  const {attending, guests} = rsvp;
  const getGuestValues = (guest, groupId, attending) => `('${guest.firstName}', '${guest.lastName}', ${attending}, CURRENT_TIMESTAMP, ${groupId})`;

  const guestValues = guests.map((guest) => getGuestValues(guest, groupId, attending)).join(', ');

  return pool.query(`INSERT INTO guests (first_name, last_name, attending, date_created, group_id) VALUES ${guestValues}`);
};

export const selectNewestGroupId = (pool) => pool.query('SELECT group_id FROM GROUPS ORDER BY date_created DESC LIMIT 1');
