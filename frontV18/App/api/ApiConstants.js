
import Web3 from 'web3';
import ABIARRAY_BEP20data from '../ABI/BEP20.json'
import ABIARRAY_ERC20data from '../ABI/ERC20.json'
import { DefaultokensMain, DefaultokensTest } from '../Utilities/defaulttokens';
import { REACT_APP_Transaction_token, REACT_APP_Tron_api_key, REACT_APP_ERC_Transaction_key, REACT_APP_BNB_Transaction_key, REACT_APP_Secret_key } from '@env'
import { UseTronWeb } from '../Network_controllers/TRON/Tron_controller';
import Tron from "../Assets/caexicons/tron.svg"
import Eth1 from "../Assets/caexicons/eth1.svg"
import Bnc1 from "../Assets/caexicons/bnc1.svg"
import Btc from "../Assets/caexicons/btc.svg"
import Pol from "../Assets/Icons/polygon.svg"
import { deviceheight, devicewidth } from '../Utilities/Dimensions';
const bitcoin = require('bitcoinjs-lib');

console.log("REACT_APP_Secret_keyREACT_APP_Secret_key", REACT_APP_Secret_key, REACT_APP_ERC_Transaction_key, REACT_APP_BNB_Transaction_key);

export const envname = "local"

export const EIP155_SIGNING_METHODS = {
  PERSONAL_SIGN: 'personal_sign',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TRANSACTION: 'eth_signTransaction',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  ETH_SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
  ETH_SEND_TRANSACTION: 'eth_sendTransaction',
};
export const EIP155_SIGNING_METHODS_Name = {
  'personal_sign': 'Approve Sign',
  'eth_sign': 'Approve ETH SIgn',
  'eth_signTransaction': 'eth_signTransaction',
  'eth_signTypedData': 'eth_signTypedData',
  'eth_signTypedData_v3': 'eth_signTypedData_v3',
  'eth_signTypedData_v4': 'eth_signTypedData_v4',
  'eth_sendRawTransaction': 'eth_sendRawTransaction',
  'eth_sendTransaction': 'eth_sendRawTransaction',
};
export const TRON_SIGNING_METHODS = {
  TRON_SIGN_TRANSACTION: 'tron_signTransaction',

};

export const TRON_SIGNING_METHODS_Name = {
  TRON_SIGN_TRANSACTION: 'tron_signTransaction',
};

export var FRONT_URL
export var URL
export var primarycurrency
export var eth_rpc_url
export var bnb_rpc_url
export var tron_rpc_url
export var btc_rpc_url
export var btc_transaction_token

// export var btc_rpc_url2

export var bnb_web3
export var eth_web3
export var Main_bnb_url
export var Main_eth_rpc_url
export var Main_tron_url
export var ABIARRAY_BEP20
export var ABIARRAY_ERC20
export var eth_api_url
export var bnb_api_url
export var bnb_api_url_history
export var eth_api_url_history
export var btc_api_url_history
export var tron_api_url_history

export var btc_api_url_transaction


export var eth_chainId
export var bnb_chainId
export var Main_bnb_chainId
export var Main_Tron_chainId

export var eth_network
export var bnb_network
export var Defaulttokens
export var tron_api_key
export var ERC_transaction_key
export var BNB_transaction_key

export var currentChainconfig = {}

if (envname == "demo") {
  FRONT_URL = "Walletcaex://";
  URL = 'https://backend-walletcaex.maticz.in/';


  eth_rpc_url = "https://ethereum-rpc.publicnode.com";
  bnb_rpc_url = "https://bsc-rpc.publicnode.com";
  tron_rpc_url = 'https://api.trongrid.io'
  btc_rpc_url = 'https://api.blockcypher.com/v1/btc/main'

  bnb_web3 = new Web3("https://bsc-rpc.publicnode.com")
  eth_web3 = new Web3("https://ethereum-rpc.publicnode.com")

  Main_bnb_url = "https://bsc-rpc.publicnode.com"
  Main_eth_rpc_url = "https://ethereum-rpc.publicnode.com";
  Main_tron_url = "https://api.trongrid.io"

  ABIARRAY_BEP20 = ABIARRAY_BEP20data
  ABIARRAY_ERC20 = ABIARRAY_ERC20data

  eth_api_url = "https://api.etherscan.io/"
  bnb_api_url = "https://api.bscscan.com/"

  bnb_api_url_history = "https://bscscan.com/tx/"
  eth_api_url_history = "https://etherscan.io//tx/"
  btc_api_url_history = "https://live.blockcypher.com/btc/tx/"
  tron_api_url_history = 'https://tronscan.org/#/transaction/'

  btc_api_url_transaction = "https://api.blockcypher.com/v1/btc/main/txs"


  eth_chainId = 1
  bnb_chainId = 97
  Main_bnb_chainId = 56
  Main_Tron_chainId = 0x2b6653dc

  eth_network = 'Ethereum'
  bnb_network = 'Binance'
  Defaulttokens = DefaultokensMain
  btc_transaction_token = REACT_APP_Transaction_token
  tron_api_key = REACT_APP_Tron_api_key
  ERC_transaction_key = REACT_APP_ERC_Transaction_key
  BNB_transaction_key = REACT_APP_BNB_Transaction_key

  // for chain config
  primarycurrency = ["BNB", "ETH", "TRX", "BTC"];


}
else {

  FRONT_URL = "Walletcaex://";
  URL = 'http://200.140.70.87:8001/';



  eth_rpc_url = "https://ethereum-sepolia-rpc.publicnode.com";
  bnb_rpc_url = "https://bsc-testnet-rpc.publicnode.com";
  tron_rpc_url = 'https://nile.trongrid.io'
  btc_rpc_url = 'https://api.blockcypher.com/v1/btc/test3'



  bnb_web3 = new Web3("https://bsc-testnet-rpc.publicnode.com")
  eth_web3 = new Web3("https://ethereum-sepolia-rpc.publicnode.com")

  Main_bnb_url = "https://bsc-rpc.publicnode.com"
  Main_eth_rpc_url = "https://ethereum-rpc.publicnode.com";
  Main_tron_url = "https://api.trongrid.io"


  ABIARRAY_BEP20 = ABIARRAY_BEP20data
  ABIARRAY_ERC20 = ABIARRAY_ERC20data

  eth_api_url = "https://api-sepolia.etherscan.io/"
  bnb_api_url = "https://api-testnet.bscscan.com/"

  bnb_api_url_history = "https://testnet.bscscan.com/tx/"
  eth_api_url_history = "https://sepolia.etherscan.io/tx/"
  btc_api_url_history = "https://live.blockcypher.com/btc-testnet/btc/tx/"
  tron_api_url_history = 'https://nile.tronscan.org/#/transaction/'


  eth_chainId = 1
  bnb_chainId = 97
  Main_bnb_chainId = 56
  Main_Tron_chainId = 0x2b6653dc

  eth_network = 'Ethereum'
  bnb_network = 'Binance'
  Defaulttokens = DefaultokensTest
  btc_transaction_token = REACT_APP_Transaction_token,
    tron_api_key = REACT_APP_Tron_api_key,
    ERC_transaction_key = REACT_APP_ERC_Transaction_key
  BNB_transaction_key = REACT_APP_BNB_Transaction_key
  btc_api_url_transaction = "https://api.blockcypher.com/v1/btc/main/txs"


  // praveen
  currentChainconfig = {
    BNB: {
      currency: "BNB",
      name: "Binance",
      chainId: 97,
      token_type: "BEP20",
      network_type: "evm",
      nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
      rpc: "https://bsc-testnet-rpc.publicnode.com",
      web3_instance: async () => new Web3("https://bsc-testnet-rpc.publicnode.com"),
      ERC20_ABI: ABIARRAY_BEP20data,
      transaction_history_api_url: "https://api-testnet.bscscan.com/",
      tx_web_url: "https://testnet.bscscan.com/tx/",
      transaction_api_key: REACT_APP_BNB_Transaction_key,
      icon: <Bnc1 width={devicewidth * 0.13} height={deviceheight * 0.04} />,
      isTokenSupport: true
    },
    ETH: {
      currency: "ETH",
      name: "Ethereum",
      chainId: 11155111,
      token_type: "ERC20",
      network_type: "evm",
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      rpc: "https://sepolia.infura.io/v3/50c7d1be83794ae0a3e74eab40b74373",
      web3_instance: async () => new Web3("https://sepolia.infura.io/v3/50c7d1be83794ae0a3e74eab40b74373"),
      ERC20_ABI: ABIARRAY_BEP20data,
      transaction_history_api_url: "https://api-sepolia.etherscan.io/",
      tx_web_url: "https://sepolia.etherscan.io/tx/",
      transaction_api_key: REACT_APP_ERC_Transaction_key,
      icon: <Eth1 width={devicewidth * 0.13} height={deviceheight * 0.04} />,
      isTokenSupport: true
    },
    TRX: {
      currency: "TRX",
      name: "Tron",
      chainId: 0x2b6653dc,
      token_type: "TRC20",
      network_type: "tron",
      nativeCurrency: { name: 'TRX', symbol: 'TRX', decimals: 18 },
      rpc: "https://nile.trongrid.io",
      web3_instance: async () => await UseTronWeb("https://nile.trongrid.io"),
      ERC20_ABI: [],
      transaction_history_api_url: "https://bscscan.com/tx/",
      tx_web_url: "https://nile.tronscan.org/#/transaction/",
      transaction_api_key: REACT_APP_Tron_api_key,
      icon: <Tron width={devicewidth * 0.13} height={deviceheight * 0.04} />,
      isTokenSupport: true
    },
    BTC: {
      currency: "BTC",
      name: "Bitcoin",
      chainId: 0,
      token_type: "BTC",
      network_type: "btc",
      nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 18 },
      rpc: "https://api.blockcypher.com/v1/btc/test3",
      web3_instance: () => null,
      ERC20_ABI: [],
      transaction_history_api_url: "https://bscscan.com/tx/",
      tx_web_url: "https://blockstream.info/testnet/tx/",
      transaction_api_key: "BTC",
      icon: <Btc width={devicewidth * 0.13} height={deviceheight * 0.04} />,
      isTokenSupport: false,

      blockStreamApis: {
        "fee": "https://blockstream.info/api/fee-estimates",
        "balance": "https://blockstream.info/testnet/api/address/##USER_ADDRESS##",
        "utxo": "https://blockstream.info/testnet/api/address/##USER_ADDRESS##/utxo",
        "utxoTx": "https://blockstream.info/testnet/api/tx/##TXID##/hex",
        "broadcastapi": "https://blockstream.info/testnet/api/tx",
        "txHistory": "https://blockstream.info/testnet/api/address/##USER_ADDRESS##/txs"
      },
      environment: bitcoin.networks.testnet,
      derivation: "m/84'/1'/0'/0/0",
      envString: "testnet"
    },
    POL: {
      currency: "POL",
      name: "Polygon",
      chainId: 80002,
      token_type: "MAT20",
      network_type: "evm",
      nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
      rpc: "https://polygon-amoy.drpc.org",
      web3_instance: async () => new Web3("https://polygon-amoy.drpc.org"),
      ERC20_ABI: ABIARRAY_BEP20data,
      transaction_history_api_url: "https://api-amoy.polygonscan.com/",
      tx_web_url: "https://www.oklink.com/amoy/tx/",
      transaction_api_key: REACT_APP_BNB_Transaction_key,
      icon: <Pol width={devicewidth * 0.13} height={deviceheight * 0.04} />,
      isTokenSupport: true
    },
  }

  primarycurrency = Object.keys(currentChainconfig);


}

export const ApiConstants = {
  URL: URL,
  BASE_URL: URL + "user/",
  Image: `${URL}images/`,
  secretOrKey: REACT_APP_Secret_key,
  GetCMSdata: "getcmsdata",
  dappcategory: "dappcategory",
  dapps: 'dapps',
  Notification: 'notification',



  Chains: envname != "production" ? {
    1: "https://mainnet.infura.io/v3/8bdcb041261546d0b6b11c4e3876c2f4",
    56: "https://bsc-dataseed1.binance.org/",

  }
    :
    {
      11155111: "https://sepolia.infura.io/v3/50c7d1be83794ae0a3e74eab40b74373",
      97: "https://bsc-testnet-rpc.publicnode.com",


    },



  clientMeta: {
    description: "Walletcaex wallet",
    url: "https://yustoken.io",
    icons: [
      "https://imagedelivery.net/_aTEfDRm7z3tKgu9JhfeKA/4ca6cbac-48a2-4dc9-0712-0c75cd12c300/lg",
    ],
    name: "Walletcaex",
    redirect: {
      native: FRONT_URL,
      universal: FRONT_URL
    }
  },

};

