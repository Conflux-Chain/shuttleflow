function useCurrentUser() {
  return isLoign
    ? {
        address: isXX ? 'aaaa' : '',
        getBalance() {
          return Promise.resolve(123)
        },
      }
    : login
}
