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
  attending: boolean
  rsvp_on: Date
}

export interface GuestFetch {
  guest: Guest
  party: Party
}

export interface Rsvp {
  guest_id: number
  party_id: number
  attending: boolean
  party_size: number
}
