const config = {
  custodian: {
    toCfx: {
      abi: 'CustodianImpl',
      eth: { address: '0x89ee646e8ec9184fde03d4a6f73ba5b198d07974' },
      bsc: { address: 'cfxtest:acg8g810ntrv2wn62mjd7jn8brackkcc6pxv3u47ae' },
    },
    fromCfx: {
      abi: 'CustodianImplReverse',
      eth: { address: 'cfxtest:acb13s4261puun56amtwzfy0u8vft0apsph8hu7g61' },
      bsc: { address: 'cfxtest:acdbc6vygv2rcejrf59rga0b1ze52h94by3en9b77n' },
    },
  },
  sponsor: {
    toCfx: {
      abi: 'TokenSponsor',
      eth: { address: '0x8f2c7ee9d8b541f9b821473ade5caed7ba78e319' },
      bas: { address: 'cfxtest:aca2kmezyet575cusyzhhp2jmwc1b4ka1ynevxeycf' },
    },
    fromCfx: {
      abi: 'TokenSponsorReverse',
      eth: { address: 'cfxtest:acbjrt1zdnpf8xxknmxg2wruu1fbbagv5uawx0s1pk' },
      bsc: { address: 'cfxtest:acgw7pkuhvb8nk1a98jjzveugn7bkhj9za79hgwu4p' },
    },
  },
  balance: {
    abi: 'Balance',
    address: '0x8f35930629fce5b5cf4cd762e71006045bfeb24d',
  },
  erc777: {
    abi: 'TokenBase',
  },
}

function find(path, key) {
  const parts = path.split('.')
  let _config = config

  // console.log(path, key)
  // if (path === 'erc777') {
  //   debugger
  // }
  for (let i = 0; i < path.length; i++) {
    _config = _config[parts[i]]
    if (!_config) {
      //not found, i.e. No address configured for erc777, ABI only
      return
    } else if (_config[key]) {
      return _config[key]
    }
  }
}

const contractCache = {}
export function getContract(path) {
  if (!contractCache[path]) {
    const [address, ABI] = ['address', 'abi'].map((key) => find(path, key))

    contractCache[path] = import(
      /* webpackChunkName: "Abi" */
      /* webpackPrefetch: true */
      /* webpackPreload: true */
      `./${ABI}.json`
    )
      .then((x) => x.default)
      .then((abi) => {
        const args = { abi }
        if (address) {
          args.address = address
        }
        return window.confluxJS.Contract(args)
      })
  }
  return contractCache[path]
}
