export function subscribeEnableScroll(elmApp) {
   elmApp.ports.enableScroll.subscribe(function(enable) {
      document.body.style.overflow = enable ? "auto" : "hidden"
   })
}

export function subscribeGoTo(elmApp) {
   elmApp.ports.goTo.subscribe(function(url) {
      setTimeout(function() {
         window.location = url
      }, 1000)
   })
}
