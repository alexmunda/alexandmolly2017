const getGuestValues = (guest, groupId, attending) => `('${guest.firstName}', '${guest.lastName}', ${attending}, CURRENT_TIMESTAMP, ${groupId})`;

export const insertDefaultGroup = (pool) => pool.query('INSERT INTO groups DEFAULT VALUES');

export const insertGuestsWithGroup = (pool, rsvp, groupId) => {
  const {attending, guests} = rsvp;

  const guestValues = guests.map((guest) => getGuestValues(guest, groupId, attending)).join(', ');
  
  return pool.query(`INSERT INTO guests (first_name, last_name, attending, date_created, group_id) VALUES ${guestValues}`);
};

export const selectNewestGroupId = (pool) => pool.query('SELECT group_id FROM GROUPS ORDER BY date_created DESC LIMIT 1');
