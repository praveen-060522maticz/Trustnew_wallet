import Web3 from 'web3';

import Eth1 from "../../Assets/caexicons/eth1.svg"
import Bnc1 from "../../Assets/caexicons/bnc1.svg"
import Tron from "../../Assets/caexicons/tron.svg"


import {  deviceheight, devicewidth } from "../../Utilities/Dimensions";

import { ApiConstants, Main_Tron_chainId, Main_bnb_chainId, Main_bnb_url, Main_eth_rpc_url,Main_tron_url,bnb_chainId, bnb_network, bnb_rpc_url, envname, eth_chainId, eth_network, eth_rpc_url } from '../../api/ApiConstants';
export const useWeb3WithRPC = (httpProvider) => {
  var web3 = new Web3(httpProvider);
  return web3
}

console.log('envname---->',envname);

export const CHAINS = ApiConstants.Chains
export const CHAIN_INFO = [
  {

    img: <Eth1 width={devicewidth * 0.13} height={deviceheight * 0.0470}  />,
    name: eth_network,
    hex: parseInt(eth_chainId).toString(16),
    chainId: eth_chainId,
    rpc: envname == "local" ? eth_rpc_url : Main_eth_rpc_url,
    currency: 'ETH'
  },
  {

    img: <Bnc1 width={devicewidth * 0.13} height={deviceheight * 0.0470}  />,
    name: bnb_network,
    hex: parseInt(Main_bnb_chainId).toString(16),
    chainId: envname == "local" ? bnb_chainId : Main_bnb_chainId,
    rpc: envname == "local" ? bnb_rpc_url :  Main_bnb_url,
    currency: 'BNB'


  },

 
{

    img: <Tron width={devicewidth * 0.13} height={deviceheight * 0.0470} />,
    name: "Tron",
    hex: parseInt(Main_Tron_chainId).toString(16),
    chainId: Main_Tron_chainId,
    rpc: Main_tron_url,
    currency: 'TRX'
  },

]
