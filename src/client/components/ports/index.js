export function subscribeEnableScroll(elmApp) {
   elmApp.ports.enableScroll.subscribe(function(enable) {
      document.body.style.overflow = enable ? "auto" : "hidden"
   })
}
