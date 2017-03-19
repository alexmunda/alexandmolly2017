import Elm from '../../elm/app.elmproj'
import * as Ports from '../ports'

export function Photos(container) {
   const elmApp = Elm.Photos.Main.embed(container)

   Ports.subscribeEnableScroll(elmApp)
}
