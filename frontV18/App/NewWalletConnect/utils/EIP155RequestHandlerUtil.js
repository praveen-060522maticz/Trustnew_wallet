// import { ethers, providers } from 'ethers';
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { getSdkError } from '@walletconnect/utils';
import { getGasPriceObj, getOnlyArrayOfWalletAddress, getSignParamsMessage, getSignTypedDataParamsData, getWalletAddressFromParams, getWalletfromWalletArray } from './HelperUtil';
import { BeatifyConsole, EIP155_SIGNING_METHODS, getChainData, TRON_SIGNING_METHODS } from './common';
import { accountInformation, getWebInstance } from './WalletUtills';
import EIP155Lib from './EVMwalletUtills';
import { GetCurrentIndex, UseWalletArray } from '../../Utilities/usestorage';
import { DecryptPrivateKey } from '../../Utilities/commenfuctions';

export async function approveEIP155Request(requestEvent, chainType) {
  try {
    const { params, id } = requestEvent;
    const { chainId, request } = params;
    BeatifyConsole('paramsparams---->', params)
    // create wallet with privatekey
    let walletarray = UseWalletArray();
    let currenteindex = GetCurrentIndex();
    // let data = walletarray[currenteindex]

    const getWalletaddressArr = getOnlyArrayOfWalletAddress(walletarray);
    const address = getWalletAddressFromParams(getWalletaddressArr,params)

    const data = getWalletfromWalletArray(walletarray,address)
    
    const privatekey = data?.privateKey?.[chainType === "eip155" ? "evm" : chainType === "tron" ? "tron" : "solana"]
    const wallet = EIP155Lib.init({ privateKey: DecryptPrivateKey(privatekey) });
    console.log('walletwalletwalletwallet---->', wallet, DecryptPrivateKey(privatekey), privatekey, chainType);

    const chainData = getChainData(chainId.split(':')[1], chainType);
    console.log('chainData---->', chainData);
    const WebInstance = await getWebInstance(chainData.rpcUrl, chainType);
    console.log('WebInstance---->', WebInstance);

    switch (request.method) {
      case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      case EIP155_SIGNING_METHODS.ETH_SIGN:
        try {
          const message = getSignParamsMessage(request.params);
          console.log('messagemessage---->', message);
          if (!message) {
            throw new Error('Message is empty');
          }
          const signedMessage = await wallet.signMessage(message);
          return formatJsonRpcResult(id, signedMessage);
        } catch (error) {
          console.error(error);
          console.log(error.message);
          return formatJsonRpcError(id, error.message);
        }

      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
        try {
          const {
            domain,
            types,
            message: data,
          } = getSignTypedDataParamsData(request.params);
          // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
          delete types.EIP712Domain;
          const signedData = await wallet.signTypedData(domain, types, data);
          return formatJsonRpcResult(id, signedData);
        } catch (error) {
          console.error(error);
          console.log(error.message);
          return formatJsonRpcError(id, error.message);
        }

      case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        try {

          const web3Wallet = await accountInformation(WebInstance, DecryptPrivateKey(privatekey))
          console.log('request.method---->', web3Wallet, request.method);

          // const chainData = getChainData(chainId.split(':')[1]);
          // console.log('chainDatachainData---->',chainData,chainId,chainId.split(':')[1],chainData.rpcUrl);
          // const provider = new ethers.providers.JsonRpcProvider(chainData.rpcUrl);
          const sendTransaction = request.params[0];
          console.log('sendTransaction---->', sendTransaction);
          // // const connectedWallet = wallet.connect(provider);
          // const connectedWallet = new ethers.Wallet(privatekey, provider);
          // console.log('connectedWallet---->',connectedWallet);
          const getTxData = await getGasPriceObj(chainData.rpcUrl, sendTransaction)
          console.log('getTxData---->', getTxData);
          // const signer = provider.getSigner()
          // const { hash } = await web3Wallet.sendTransaction(getTxData);

          const signedTransaction = await web3Wallet.signTransaction(getTxData);
          const { rawTransaction, transactionHash } = signedTransaction;
          console.log('rawTransaction---->', rawTransaction);
          var trans = await WebInstance.eth.sendSignedTransaction(rawTransaction)

          console.log('hash---->', trans);
          return formatJsonRpcResult(id, trans.transactionHash);
        } catch (error) {
          console.error("Erron on appptransac", error);
          console.log(error.message);
          return formatJsonRpcError(id, error.message);
        }

      case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
        try {
          const signTransaction = request.params[0];
          const signature = await wallet.signTransaction(signTransaction);
          return formatJsonRpcResult(id, signature);
        } catch (error) {
          console.error(error);
          console.log(error.message);
          return formatJsonRpcError(id, error.message);
        }

      case TRON_SIGNING_METHODS.TRON_SIGN_TRANSACTION:
        try {
          console.log('WebInstance tron---->', WebInstance);
          let dePrivKry = DecryptPrivateKey(privatekey)
          let privKey = dePrivKry.slice(0, 2) == "0x" ? dePrivKry.replace("0x","") : dePrivKry;
          console.log('privKey---->',privKey);
          const transaction = JSON.parse(JSON.stringify(params?.request?.params?.transaction?.transaction))
          console.log('transaction---->', transaction);
          const signedTransaction = await WebInstance.trx.sign(transaction, privKey);
          console.log('signedTransaction---->', signedTransaction);
          const transactionHash = await WebInstance.trx.sendRawTransaction(signedTransaction);
          console.log('transactionHash---->', transactionHash);
          return formatJsonRpcResult(id, transactionHash.txid);
        } catch (error) {
          console.log('Erro no trontransaction---->', error);
          return formatJsonRpcError(id, error.message);
        }

      default:
        throw new Error(getSdkError('INVALID_METHOD').message);
    }
  } catch (e) {
    console.error('Erro n approveEIP155Request---->', e);
  }

}

export function rejectEIP155Request(request) {
  const { id } = request;

  return formatJsonRpcError(id, getSdkError('USER_REJECTED').message);
}
