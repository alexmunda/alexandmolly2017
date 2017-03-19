export function subscribeEnableScroll(elmApp) {
   elmApp.ports.enableScroll.subscribe(enable => {
      document.body.style.overflow = enable ? "auto" : "hidden"
   })
}
