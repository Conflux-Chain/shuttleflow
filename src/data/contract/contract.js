import { IS_DEV } from '../../config/config'

export const CONTRACT_CONFIG = {
  custodian: {
    toCfx: {
      abi: 'CustodianImpl',
      eth: {
        address: IS_DEV
          ? 'cfxtest:ace863dsv5evux88atmmr735y023vyd3sufutajna1'
          : 'cfx:aceu6t9m2wvpgtnzww8f13vstf2s8zeb6a4eja1756',
      },
      btc: {
        address: IS_DEV
          ? 'cfxtest:ace863dsv5evux88atmmr735y023vyd3sufutajna1'
          : 'cfx:aceu6t9m2wvpgtnzww8f13vstf2s8zeb6a4eja1756',
      },
      bsc: {
        address: IS_DEV
          ? 'cfxtest:acg8g810ntrv2wn62mjd7jn8brackkcc6pxv3u47ae'
          : 'cfx:acb3gfhjazfbxtajmfm1x5vc12drvs382ew0ykwyv8',
      },
    },
    fromCfx: {
      abi: 'CustodianImplReverse',
      eth: {
        address: IS_DEV
          ? 'cfxtest:acb13s4261puun56amtwzfy0u8vft0apsph8hu7g61'
          : 'cfx:acfphjkmvy23zww7tpzrrxp3hrs6r70bbyke5zfb5z',
      },
      bsc: {
        address: IS_DEV
          ? 'cfxtest:acdbc6vygv2rcejrf59rga0b1ze52h94by3en9b77n'
          : 'cfx:acfgmctw40vy2a608uey5g9t32b8m4kp1268zwhrh1',
      },
    },
  },
  sponsor: {
    toCfx: {
      abi: 'TokenSponsor',
      eth: {
        address: IS_DEV
          ? 'cfxtest:achw291k5c4yd8r2efdxz1w6z5n5y8hddernmat51y'
          : 'cfx:acfbfhg8bk3u9pf26rm8h2pmmru7csfkna4pfvy6ac',
      },
      btc: {
        address: IS_DEV
          ? 'cfxtest:achw291k5c4yd8r2efdxz1w6z5n5y8hddernmat51y'
          : 'cfx:acfbfhg8bk3u9pf26rm8h2pmmru7csfkna4pfvy6ac',
      },
      bsc: {
        address: IS_DEV
          ? 'cfxtest:aca2kmezyet575cusyzhhp2jmwc1b4ka1ynevxeycf'
          : 'cfx:acfet2rcf4uag2daavzrsddkkvefpz4wmp1n76msw4',
      },
    },
    fromCfx: {
      abi: 'TokenSponsorReverse',
      eth: {
        address: IS_DEV
          ? 'cfxtest:acbjrt1zdnpf8xxknmxg2wruu1fbbagv5uawx0s1pk'
          : 'cfx:ach579brthtn13szzxzxcjsn6bt1vbdr4p8sej5eex',
      },
      bsc: {
        address: IS_DEV
          ? 'cfxtest:acgw7pkuhvb8nk1a98jjzveugn7bkhj9za79hgwu4p'
          : 'cfx:aceftme5ycg8zj0gw71b3r1kurzpmhpn92ka1x565t',
      },
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
  let _config = CONTRACT_CONFIG

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
