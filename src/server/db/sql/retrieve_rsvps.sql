SELECT
(SELECT SUM(party_size) FROM party WHERE rsvp_on IS NOT NULL AND attending) as num_attending,
COALESCE((SELECT SUM(party_size) FROM party WHERE rsvp_on IS NOT NULL AND NOT attending), 0) as num_not_attending,
COALESCE((SELECT SUM(max_party_size) FROM party WHERE rsvp_on IS NULL), 0) as max_num_not_rsvped,
(SELECT
  json_agg(
    json_build_object(
      'display_name', p.display_name,
      'party_size', p.party_size,
      'attending', p.attending,
      'comment', comment,
      'rsvp_on', ((p.rsvp_on || 'UTC'):: timestamptz AT TIME ZONE 'CST')
    )
  )
  FROM party p
  WHERE p.rsvp_on IS NULL
) as non_rsvped_parties,
json_agg(
  json_build_object(
    'display_name', p.display_name,
    'party_size', p.party_size,
    'attending', p.attending,
    'comment', comment,
    'rsvp_on', ((p.rsvp_on || 'UTC'):: timestamptz AT TIME ZONE 'CST')
  )
) as rsvped_parties
FROM party p
WHERE p.rsvp_on IS NOT NULL
