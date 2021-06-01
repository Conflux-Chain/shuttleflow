function createSubscribeNetwork() {
  let listeners = []
  let started = false
  //i.e event is contentscript
  setInterval(() => {
    //portal is detected
    if (window.conflux && !started) {
      let chainId = window.conflux.chainId
      listeners.forEach((f) => f(chainId))

      window.conflux.on('networkChanged', function (_chainId) {
        //make sure chainId is updated even before subscribe
        chainId = _chainId
        listeners.forEach((f) => f(chainId))
      })
      started = true
    } //portal is uninstalled
    else if (!window.conflux && started) {
      //conflux is destoried completely, no need for GC
      //make sure it can be re-subscribe
      started = false
    }
  }, 1000)
  return function subscribeNetwork(cb) {
    listeners.push(cb)
    return () => (listeners = listeners.filter((x) => x !== cb))
  }
}

export default createSubscribeNetwork()
