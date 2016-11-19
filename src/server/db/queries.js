"use strict";
exports.createTables = function (pool) { return pool.query("\n  CREATE TABLE IF NOT EXISTS groups (\n    group_id serial PRIMARY KEY,\n    date_created timestamp NOT NULL DEFAULT now()\n  );\n\n  CREATE TABLE IF NOT EXISTS  guests (\n    guest_id serial PRIMARY KEY,\n    first_name text NOT NULL,\n    last_name text NOT NULL,\n    attending boolean NOT NULL,\n    date_created timestamp NOT NULL,\n    group_id integer NOT NULL REFERENCES groups(group_id)\n  );\n"); };
exports.insertDefaultGroup = function (pool) { return pool.query('INSERT INTO groups DEFAULT VALUES'); };
exports.insertGuestsWithGroup = function (pool, rsvp, groupId) {
    var attending = rsvp.attending, guests = rsvp.guests;
    var getGuestValues = function (guest, groupId, attending) { return ("('" + guest.firstName + "', '" + guest.lastName + "', " + attending + ", CURRENT_TIMESTAMP, " + groupId + ")"); };
    var guestValues = guests.map(function (guest) { return getGuestValues(guest, groupId, attending); }).join(', ');
    return pool.query("INSERT INTO guests (first_name, last_name, attending, date_created, group_id) VALUES " + guestValues);
};
exports.selectNewestGroupId = function (pool) { return pool.query('SELECT group_id FROM GROUPS ORDER BY date_created DESC LIMIT 1'); };
//# sourceMappingURL=queries.js.map