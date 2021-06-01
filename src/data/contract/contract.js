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
      oec:{
        address: IS_DEV
          ? 'cfxtest:achs3f2knh85024646aex8j226y96ynukesc46s63h'
          : 'cfx:acfscwx5sr9yfasnypgdmujc71gt66sajpzr0mhzpz',
      }
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
      oec:{
        address: IS_DEV
          ? 'cfxtest:acbsbs2cp9secres4kfd3zvwbp42zrr4fee3unj3bz'
          : 'cfx:acf0xp9vrv55gkft3tjntkjagvwme19vcu2wsj39fz',
      }
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
      oec:{
        address: IS_DEV
          ? 'cfxtest:aca6tuc7cyarypp9ht8tkh34suuasv7uz6myay066j'
          : 'cfx:acc3zs32wsn06b5betf8g1g1phb7cg24xpbfjnfg7j',
      }
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
      oec:{
        address: IS_DEV
          ? 'cfxtest:acfkp578z73dhecgprf8n4rd9g4751049yd75xun65'
          : 'cfx:acghjp9u0s4kgbars93dun5kftjhe1xjre3fa6smv4',
      }
    },
  },
  balance: {
    abi: 'Balance',
    address: IS_DEV
      ? 'cfxtest:achxne2gfh8snrstkxn0f32ua2cf19zwkyw9tpbc6k'
      : 'cfx:achxne2gfh8snrstkxn0f32ua2cf19zwky2y66hj2d',
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
