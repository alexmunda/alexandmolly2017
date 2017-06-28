SELECT to_json(g) as guest, to_json(p) as party
FROM guest g
  INNER JOIN party p ON p.party_id = g.party_id
WHERE lower(:first_name) = lower(g.first_name)
  AND lower(:last_name) = lower(g.last_name)
LIMIT 1;
