import Elm from '../../elm/app.elmproj'
import { subscribeGoTo } from '../ports'

export function Rsvp(container) {
   const elmApp = Elm.Rsvp.Main.embed(container)
   subscribeGoTo(elmApp)
}
