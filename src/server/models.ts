export interface Guest {
  guest_id: number
  party_id: number
  first_name: string
  last_name: string
  rsvp_on: Date
}

export interface Party {
  party_id: number
  display_name: string
  max_party_size: number
  party_size: number
  rsvp: boolean
  rsvp_on: Date
}

export interface GuestFetch {
  guest: Guest
  party: Party
}
