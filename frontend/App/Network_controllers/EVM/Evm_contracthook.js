import Web3 from 'web3';

import { eth_rpc_url, bnb_rpc_url, ABIARRAY_ERC20, ABIARRAY_BEP20, bnb_api_url, eth_api_url, eth_web3, bnb_web3, btc_rpc_url, btc_transaction_token, ERC_transaction_key, BNB_transaction_key, ApiConstants, currentChainconfig } from "../../api/ApiConstants"
import axios from "axios";
import { isEmpty } from '../../Utilities/commenfuctions';
import { DecryptPrivateKey, EnCryptPrivateKey, convertamount, etoFixed, fiatcurrencies } from '../../Utilities/commenfuctions';
import TronWeb from 'tronweb'
import { createTronWalletWithPrivatekey, UseConvertToHex } from '../TRON/Tron_controller';
import { UseTronWeb } from '../TRON/Tron_Contract';
import { Tron_GeBalance } from '../../Utilities/axios';
import EIP155Lib from '../../NewWalletConnect/utils/EVMwalletUtills';
const { ethers } = require('ethers');
const bitcore = require('bitcore-lib');


/**Trc20 address validation for tokenadress */

async function TRC20address_validation(walletaddress, tokenAddress, currency) {
  try {
    const tronWeb = await UseTronWeb();

    tronWeb.setAddress(walletaddress);

    const tokenContract = await tronWeb.contract().at(tokenAddress);
    return tokenContract
  } catch (err) {
    return "no";
  }
}

/**Contract address validations */

export const contractaddress_validation = async (contractaddress, tokentype, walletaddress, currency) => {
  console.log('contractaddress, tokentype, walletaddress, currency  contractaddress, tokentype, walletaddress, currency---->',contractaddress, tokentype, walletaddress, currency);
  let tokenAddress = contractaddress;
  let tokenABI = [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [
        {
          name: "",
          type: "uint8",
        },
      ],
      payable: false,
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "balance",
          type: "uint256",
        },
      ],
      payable: false,
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      type: "function",
    },
  ];
  //let tokenABI = ABIARRAY_UNISWAP
  try {

    if (currency == "TRX") {
      var tokenContract = await TRC20address_validation(walletaddress, contractaddress, currency);
    } else {
      const web3 = await currentChainconfig[currency].web3_instance()
      var tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
    }


    if (tokenContract == "no") {
      return "notok";
    }
    if (tokenContract) {
      var tokenName = await tokenContract.methods.name().call();
      if (tokenName && tokenName != undefined) {
        return "ok";
      } else {
        return "notok";
      }
    }
  } catch (err) {
    console.log('Err o n fetch import eallet---->',err);
    return "notok";
  }
}

/** To get tokendetails*/

export const tokenDetail = async (token, key, from, tokenType, user) => {
  try {
    let tokenDetail = {};

    let Privatekey = await DecryptPrivateKey(key)
    let tokenContract = await UsePrivateERC20(token, Privatekey, tokenType, user);
    if (tokenContract) {
      tokenDetail.decimals = await tokenContract.methods.decimals().call();
      tokenDetail.balance = await tokenContract.methods
        .balanceOf(user)
        .call();
      tokenDetail.name = await tokenContract.methods
        .name()
        .call();
      tokenDetail.symbol = await tokenContract.methods
        .symbol()
        .call();

      return tokenDetail;
    }



    // else { }
  } catch (e) {
    console.error("tokenDetail_err ", e);
    return false;
  }
};

/** To get instance*/
export const UsePrivateERC20 = async (Token, key, tokenType) => {
  try {
    if (tokenType !== 'TRX') {

      const web3 = !isEmpty(key)
        ? await UsePrivateWallet(key, tokenType)
        : await currentChainconfig[tokenType]?.web3_instance();
      const ABI = currentChainconfig[tokenType]?.ERC20_ABI;

      const contract = new web3.eth.Contract(ABI, Token);
      return contract;
    }
    else {
      const getAddress = await createTronWalletWithPrivatekey(DecryptPrivateKey(key))
      const tronWeb = await currentChainconfig.TRX.web3_instance();
      tronWeb.setAddress(getAddress.address);
      const contract = await tronWeb.contract().at(Token);;
      return contract;
    }

  } catch (e) {
    console.error("private contract_err", e);
    return false;
  }
};


/** To get privatekry instance*/
export const UsePrivateWallet = async (key, tokenType) => {
  try {
    let PrivateKey = (key.includes('0x')) ? key : await DecryptPrivateKey(key)

    const web3 = await currentChainconfig[tokenType].web3_instance()
    await web3.eth.accounts.wallet.add(PrivateKey);

    return web3;
  }
  catch (err) {
    console.log("UsePrivateWalleterr", err);
  }
};

/** To get account details using privateKey  */
export const UseUserAccount = async (privateKey, tokenType) => {
  try {
    const web3 = await currentChainconfig[tokenType]?.web3_instance()

    const accountInfo = await web3.eth.accounts.privateKeyToAccount(privateKey);
    return accountInfo.address
  }
  catch (err) {
    console.log("UseUserAccount", err);
  }
};

/** To get crypto balance  */
export const cryptoBlanace = async (privateKey, tokenType, address) => {
  try {

    if (tokenType == 'TRX') {

      const tronWeb = await currentChainconfig.TRX.web3_instance()

      const HexAddress = await UseConvertToHex(address)

      let Senddata = {
        "jsonrpc": "2.0",
        "method": "eth_getBalance",
        "params": [HexAddress, "latest"],
        "id": 1
      }

      let Resp = await Tron_GeBalance(Senddata)
      let balanceNumber = tronWeb.fromSun(Resp?.result)

      return Number(balanceNumber)

    }
    else if (tokenType == 'BTC') {

      const response = await axios.get(`${btc_rpc_url}/addrs/${address}/balance?token=${btc_transaction_token}`);
      let balanceNumber = response.data?.final_balance / 1e8
      return balanceNumber
    }
    else {
      let DecrptprivateKey = await DecryptPrivateKey(privateKey)
      const web3 = await UsePrivateWallet(DecrptprivateKey, tokenType);
      const address = await UseUserAccount(DecrptprivateKey, tokenType);
      let data = await web3.eth.getBalance(address)
      let balanceNumber = Number(data) / 1e18
      return balanceNumber
    }
  }
  catch (e) {
    console.error("cryptoBlanace_error", e);
    return 0
  }
};

/** To get token balance  */
export const tokenBlanace = async (token, key, tokenType, decimal, address, currency) => {
  try {
    console.log('token, key, tokenType, decimal, address, currency---->', token, key, tokenType, decimal, address, currency);
    if (tokenType !== "TRX") {
      let privateKey = await DecryptPrivateKey(key)
      const erc20Contract = await UsePrivateERC20(token, privateKey, tokenType);
      const Useraccount = await UseUserAccount(privateKey, tokenType);
      let balance = await erc20Contract.methods.balanceOf(Useraccount).call()
      let correctbalance = parseInt(balance) / (10 ** (decimal ? parseInt(decimal) : 18))
      return correctbalance
    }
    else {
      const tronWeb = await currentChainconfig.TRX.web3_instance()
      tronWeb.setAddress(address);
      const tokenContract = await tronWeb.contract().at(token);

      let balance = await tokenContract.balanceOf(address).call();

      let correctbalance = JSON.parse(balance) / 10 ** parseInt(6)
      return correctbalance
    }
  }
  catch (e) {
    console.error("tokenbalancetokenBlanace_err", e);
    return 0
  }
};


/** To get transaction history */
export const evmTransactionHistory = async (currencydetails) => {
  try {
    const getCurrency = currentChainconfig[currencydetails?.currency]
    console.log('currencydetails---->', currencydetails,getCurrency);
    let apikey = getCurrency?.transaction_api_key
    let address = currencydetails.walletaddress;
    let contractaddress = currencydetails.contractAddress;
    let Decimal_contract = currencydetails.decimals;
    let zeros = "1e" + Decimal_contract; // 8 decimal based on input
    Decimal_contract = 1 * zeros;
    let header = { "Content-Type": "application/json" };
    console.log('sfsfsefsefesfsefsef---->', apikey, address, contractaddress, Decimal_contract);
    if (currencydetails.type == "Crypto") {
      var url =
        getCurrency?.transaction_history_api_url
        +
        "api?module=account&action=txlist&address=" +
        address +
        "&apikey=" +
        apikey

      var eth_decimal = 1000000000000000000;
    }
    if (currencydetails.type == "Token") {
      var url =
        getCurrency?.transaction_history_api_url +
        "api?module=account&action=tokentx&address=" +
        address +
        "&contractaddress=" +
        contractaddress +
        "&apikey=" +
        apikey


      var eth_decimal = Decimal_contract;
    }
    var getItem = axios.get(url)
      .then(function (response) {

        let arrData = response.data?.result
        if (arrData != 0) {
          if (arrData?.length > 30) arrData = arrData?.slice(-30)

          var transactions_Arr = [];
          for (let item of arrData.reverse()) {
            let txid = item.hash;
            let amount = item.value / eth_decimal;
            let toaddress = item.to;

            let fromaddress = item.from;

            let timestamp = item.timeStamp;
            let confirmations = item.confirmations

            transactions_Arr.push({
              fromaddress: fromaddress,
              toaddress: toaddress,
              amount: amount,
              txid: txid,
              timestamp: timestamp,
              confirmations: confirmations

            });
          }
          return transactions_Arr;
        } else return [];


      })
      .catch(function (error) {
        console.log("evmTransactionHistory_Error", error);
        return;
      });

    return getItem

  } catch (err) {
    console.log(err, "--transaction_list_bnb");
  }
};

/** Wallet Adress validation both evn and tron network*/
export const addressValidation = async (
  toAddress,
  currency,) => {

  try {
    if (currency == "TRX") {

      // const tronWeb = await UseTronWeb();
      const tronWeb = await currentChainconfig.TRX.web3_instance()

      const isValid = tronWeb.isAddress(toAddress)

      return isValid
    }
    else if (currency == "BTC") {
      // 
      const isValid = bitcore.Address.isValid(toAddress, 'mainnet');
      return isValid;
    }
    else {

      const web3 = await currentChainconfig[currency].web3_instance()
      const isValid = await web3.utils.isAddress(toAddress);
      return isValid
    }
  }
  catch (e) {
    console.error("addressValidation_err", e)
    return false
  }
};

/** To calculate gas fee */

export const calculate_gas = async (tokenType) => {
  const web3 = await currentChainconfig[tokenType]?.web3_instance()
  let GasPrice = await web3.eth.getGasPrice();
  let getGasPrice = web3.utils.toHex(parseFloat(GasPrice));
  let gaslimit = web3.utils.toHex(21000);
  let fee = gaslimit * getGasPrice;

  return { getGasPrice: GasPrice, gaslimit: gaslimit, fee, HxgasLimit: gaslimit, Hxgasprice: getGasPrice };
};

/** Send function for both token and currency*/
export const transferCrypto = async (
  token,
  key,
  toAddress,
  tokenType,
  fees,
  amount,
  from
) => {
  try {

    const web3 = await currentChainconfig[tokenType]?.web3_instance()
    let Privatekey = await DecryptPrivateKey(key)
    const Useraccount = await UseUserAccount(Privatekey, tokenType);
    let txCount = await web3.eth.getTransactionCount(Useraccount);

    const txObject = {
      nonce: web3.utils.toHex(txCount),
      // gasLimit: fees?.HxgasLimit,
      gasPrice: fees?.Hxgasprice,
      to: from == "Token" ? token : toAddress.toString()
    };

    if (from == "Token") {
      const erc20Contract = await UsePrivateERC20(token, Privatekey, tokenType)
      let sendamount = await etoFixed(amount * 1e18)
      let encoded = await erc20Contract.methods.transfer(
        toAddress,
        sendamount.toString()
      ).encodeABI()
      txObject.data = encoded
      txObject.gasLimit = await web3.eth.estimateGas({
        "data": encoded,
        "from": Useraccount,
        "to": token
      })
    }
    else {
      const gasPri = await web3.eth.estimateGas({
        value: amount,
        "from": Useraccount,
        "to": token
      })
      txObject.gasLimit = web3.utils.toHex(gasPri)
      txObject.value = amount
    }
    console.log('txObjecttxObject---->', txObject);
    const signedTx = await web3.eth.accounts.signTransaction(txObject, Privatekey);
    return await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
  }
  catch (e) {
    console.error("transferCryptoerr", e);
    return false
  }
};

/** Send function for both token and currency*/

export const SendEVM = async (type, contractAddress, privKey, toaddress, tokenType, amount, decimal, Gas) => {
  try {
    let cryptobalance = await cryptoBlanace(privKey, tokenType)
    let fees = await calculate_gas(tokenType)
    if ((Number(cryptobalance) < Number(fees.fee / 1e18))) {
      return { status: false, msg: "Balance is Too low ...!" }
    }
    else if ((parseFloat(cryptobalance) - parseFloat(type == "Crypto" ? amount : "0")?.toFixed(4) < parseFloat(Gas))) {
      return { status: false, msg: "Insufficient funds for gas!" }
    }
    else {
      if (type == "Crypto") {

        let Amount = amount * 1e18;
        if (Amount > 0) {
          let result = await transferCrypto(
            contractAddress,
            privKey,
            toaddress,
            tokenType,
            fees,
            Amount,
            type
          );
          return result
        }

      }
      else {
        let tokenbalance = await tokenBlanace(contractAddress, privKey, tokenType)
        let decimals = decimal ? Number(decimal) : 18;
        let parseAmount = parseFloat(amount);
        let Amount = await convertamount(parseAmount);
        if (tokenbalance > 0) {
          let result = await transferCrypto(
            contractAddress ? contractAddress : "",
            privKey,
            toaddress,
            tokenType,
            fees,
            Amount,
            type,
            "Token",
          );
          return result
        }
      }
    }
  }
  catch (err) {
    console.log("SendEVM err", err);
    return { status: false, message: err }
  }
}

/* Estimate-Gas-Fee */
const EstGas = async (data, toAddress, amount) => {
  try {
    const TokenContract = await UsePrivateERC20(data.contractAddress, data.privateKey, data.currencyName)
    let sendamount = amount * 1e18
    /* Encode Transfer ABI */
    let encoded = await TokenContract.methods.transfer(toAddress, sendamount.toString()).encodeABI();
    return encoded
  } catch (e) {
    console.log('EstGas_err', e);
    return {
      status: false
    }
  }
}


/** Gas fee estimation*/
export const evmEstimateGasFee = async (data) => {
  try {
    let gasFee = 0
    let { toAddress, amount, walletaddress, type, tokenType, currency, currencyName } = data
    const web3 = await currentChainconfig[currencyName].web3_instance()
    const gasPrice = await web3.eth.getGasPrice()
    const conversionValue = await fiatcurrencies(Array(currency), "USD");
    const encoded = type == 'token' ? await EstGas(data, toAddress, amount) : ""
    //Calculate-Estimategasfee
    if (type == 'token') {
      gasFee = await web3.eth.estimateGas({ from: walletaddress, toAddress, encoded })
    } else {
      gasFee = await web3.eth.estimateGas({ from: walletaddress, toAddress })
    }
    return {
      gasFee: gasFee ? ((gasPrice * gasFee) / 10 ** 18).toFixed(5) : 0,
      dollarValue: (conversionValue[0].value * ((gasPrice * gasFee) / 10 ** 18)).toFixed(5),
    };
  } catch (e) {
    console.log("evmEstimateGasFee_err", e);
  }
}
/** Create-EVM-Account */
export const createEvmWallet = async (seed) => {
  try {
    // const mnemonicWallet = ethers.Wallet.fromPhrase(seed);
    // console.log("mnemonicWalletmnemonicWallet", ApiConstants?.secretOrKey);
    // console.log("EnCryptPrivateKeyEnCryptPrivateKey", EnCryptPrivateKey(mnemonicWallet.privateKey));

    // return { address: mnemonicWallet.address, privateKey: EnCryptPrivateKey(mnemonicWallet.privateKey) }
    const mnemonicWallet = EIP155Lib.init({ mnemonic: seed });
    // const mnemonicWallet = ethers.Wallet.fromPhrase(seed);
    console.log("mnemonicWalletmnemonicWallet", ApiConstants?.secretOrKey);
    console.log("EnCryptPrivateKeyEnCryptPrivateKey", EnCryptPrivateKey(mnemonicWallet.getPrivateKey()));

    return { address: mnemonicWallet.getAddress(), privateKey: EnCryptPrivateKey(mnemonicWallet.getPrivateKey()) }
  } catch (e) {
    console.log("createEvmWallet_err", e);
  }
}
//Create Wallet Using Privatekey
export const createEvmWalletPrivatekey = async (privatekey) => {
  try {
    // const Wallet = new ethers.Wallet(privatekey);

    // return { address: Wallet.address, privateKey: EnCryptPrivateKey(privatekey) }

    const Wallet = EIP155Lib.init({ privateKey: privatekey });

    return { address: Wallet.getAddress(), privateKey: EnCryptPrivateKey(privatekey) }
  } catch (e) {
    console.log("createEvmWallet_err", e);
    return false
  }
}