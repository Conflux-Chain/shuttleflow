import { useEffect, useState } from 'react'
let listeners = []

const updateAccount = (newAccounts) => {
  listeners.forEach((f) => f(newAccounts[0]))
}
window?.conflux?.on('accountsChanged', (e) => {
  console.log('update account')
  updateAccount(e)
})
export default function useAddress() {
  const [address, setAddress] = useState(window?.conflux?.selectedAddress)
  useEffect(() => {
    listeners.push(setAddress)
    return () => {
      listeners = listeners.filter((x) => x !== setAddress)
    }
  }, [])
  return address
}

export const login = () => {
  if (!window?.conflux?.selectedAddress) {
    if (window?.conflux?.enable) {
      return window.conflux.enable().then((addresses) => {
        updateAccount(addresses)
      })
    } else {
      window.open('https://portal.conflux-chain.org')
    }
  }
}
