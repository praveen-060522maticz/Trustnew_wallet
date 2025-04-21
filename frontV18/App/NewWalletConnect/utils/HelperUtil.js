import { ethers, isAddress, isHexString, toUtf8String } from 'ethers';
import { getChainData, isEmpty } from './common';
import Web3 from 'web3'
/**
 * Truncates string (in the middle) via given lenght value
 */
export function truncate(value, length) {
  if (value?.length <= length) {
    return value;
  }

  const separator = '...';
  const stringLength = length - separator.length;
  const frontLength = Math.ceil(stringLength / 2);
  const backLength = Math.floor(stringLength / 2);

  return (
    value.substring(0, frontLength) +
    separator +
    value.substring(value.length - backLength)
  );
}

/**
 * Converts hex to utf8 string if it is valid bytes
 */
export function convertHexToUtf8(value) {
  if (isHexString(value)) {
    return toUtf8String(value);
  }

  return value;
}

/**
 * Gets message from various signing request methods by filtering out
 * a value that is not an address (thus is a message).
 * If it is a hex string, it gets converted to utf8 string
 */
export function getSignParamsMessage(params) {
  const message = params.filter(p => !isAddress(p))[0];

  return convertHexToUtf8(message);
}

/**
 * Gets data from various signTypedData request methods by filtering out
 * a value that is not an address (thus is data).
 * If data is a string convert it to object
 */
export function getSignTypedDataParamsData(params) {
  const data = params.filter(p => !isAddress(p))[0];

  if (typeof data === 'string') {
    return JSON.parse(data);
  }

  return data;
}

/**
 * Get our address from params checking if params string contains one
 * of our wallet addresses
 */
export function getWalletAddressFromParams(addresses, params) {
  const paramsString = JSON.stringify(params);
  let address = '';
  addresses.forEach(addr => {
    if (paramsString.toLowerCase().includes(addr.toLowerCase())) {
      address = addr;
    }
  });
  return address;
}

export const getOnlyArrayOfWalletAddress = (arr) => arr.flat()?.reduce((acc, cur) => [...acc, ...Object.values(cur?.walletaddress)], [])

export const getWalletfromWalletArray = (arr = [], address = '') => arr.flat()?.find((val) => Object.values(val?.walletaddress).some(it => it?.toLowerCase() === address?.toLowerCase()))


/**
 * Check if chain is part of EIP155 standard
 */
export function isEIP155Chain(chain) {
  return chain.includes('eip155');
}

/**
 * Check if chain is part of COSMOS standard
 */
export function isCosmosChain(chain) {
  return chain.includes('cosmos');
}

/**
 * Check if chain is part of SOLANA standard
 */
export function isSolanaChain(chain) {
  return chain.includes('solana');
}

/**
 * Get Wallet supported chains
 */
export function getSupportedChains(
  requiredNamespaces,
  optionalNamespaces,
) {
  if (!requiredNamespaces && !optionalNamespaces) {
    return [];
  }

  const required = [];
  for (const [key, values] of Object.entries(requiredNamespaces)) {
    const chains = key.includes(':') ? key : values.chains;
    if (chains) {
      required.push(chains);
    }
  }

  const optional = [];
  for (const [key, values] of Object.entries(optionalNamespaces)) {
    const chains = key.includes(':') ? key : values.chains;
    if (chains) {
      optional.push(chains);
    }
  }

  const chains = [...required.flat(), ...optional.flat()];

  return chains
    .map(chain => getChainData(chain.split(':')[1]))
    .filter(chain => chain !== undefined);
}

export const getGasPriceObj = async (rpc, txobj) => {
  try {
    let { nonce, gasPrice, gas, value, to, data, from } = txobj;
    console.log('txobj---->', rpc, txobj);

    const web3 = new Web3(rpc)

    if (!value) value = "0x0"
    if (!gas) {
      gas = await web3.eth.estimateGas({
        from,
        to,
        data,
        value,
      });
    }
    if (!nonce) {
      nonce = await web3.eth.getTransactionCount(from)
    }
    if (!gasPrice) {
      gasPrice = await web3.eth.getGasPrice();
    }
    let returnObj = {
      nonce: web3.utils.toHex(parseInt(nonce)),
      data,
      gasLimit: gas,
      gasPrice,
      to,
      value,
      from
    }
    console.log('returnObj---->', returnObj);

    const gasDecimal = web3.utils.hexToNumber(returnObj.gasLimit); // Convert hex to decimal
    const increasedGas = Math.floor(gasDecimal * 1.3); // Increase by 30%
    returnObj.gasLimit = web3.utils.numberToHex(increasedGas);
    console.log('returnObjafter---->', returnObj);
    return returnObj;
  } catch (e) {
    console.log('Erro on getGasPrice---->', e);
    return txobj
  }
}

export const getRequestChainType = (reqNamespaces, optNamespaces) => {
  return Object.keys(!isEmpty(reqNamespaces) ? reqNamespaces : !isEmpty(optNamespaces) ? optNamespaces : {})[0]
}

export const getConnectedWalletAddress = (chainType, addressObj) => {
  switch (chainType) {
    case "eip155":
      return addressObj?.evm

    case "tron":
      return addressObj?.tron

    case "solana":
      return "HtMZYn2oSAUdA8WknQsGCXEmeAixHEDeNkbroeEzBvKR"
    default:
      break;
  }
}