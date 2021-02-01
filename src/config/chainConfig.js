export const CAPTAIN = {
  NONE: 0,
  TO_CFX: 1,
  TO_REF: 2,
  BOTH: 3,
}
const config = {
  btc: {
    captain: CAPTAIN.NONE,
    // set the singleton one as default when no token selected
    singleToken: true,
  },
  eth: {
    captain: CAPTAIN.TO_CFX,
  },
}

export default config
