WITH updated_guest AS (
  UPDATE guest AS g
  SET rsvp_on = now()
  FROM party p
  WHERE p.party_id = :party_id
    AND g.guest_id = :guest_id
  RETURNING g.*
), updated_party AS (
  UPDATE party AS p
  SET party_size = :party_size,
    attending = :attending,
    rsvp_on = now()
  FROM guest g
  WHERE p.party_id = :party_id
    AND g.guest_id = :guest_id
  RETURNING p.*
)
SELECT to_json(ug) as guest, to_json(up) as party
FROM updated_party up
  INNER JOIN updated_guest ug ON ug.party_id = up.party_id
