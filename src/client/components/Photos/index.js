import Elm from '../../elm/app.elmproj'
import * as Ports from '../ports'

export function Photos(container) {
   const elmApp = Elm.Photos.Main.embed(container)

   Ports.subscribeEnableScroll(elmApp)
}

export function PhotosStatic(container) {
   const elmApp = Elm.Photos.Static.Main.embed(container)

   Ports.subscribeEnableScroll(elmApp)
}
