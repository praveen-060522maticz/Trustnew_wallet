import { Core } from "@walletconnect/core";
import {  Web3Wallet } from "@walletconnect/web3wallet";
import { CHAIN_INFO, useWeb3WithRPC } from "../Screens/WalletHome/useweb3";
import { Toastfn } from "../Utilities/toast";
import { ApiConstants } from "../api/ApiConstants";
import { DecryptPrivateKey } from "../Utilities/commenfuctions";
import { UseTronWeb } from "../Network_controllers/TRON/Tron_controller";
import { Log } from "ethers";


export var connector;
export const connect_Wallet_WC2 = async (data, con) => {
  try {
    const core = new Core({
      projectId: "3b20a050abc2aaffab54ac39207a2174",
    });
    connector = await Web3Wallet.init({
      core,
      ...ApiConstants.clientMeta,
    });
    return connector;

  } catch (e) {
    console.error("catch err in WC2", e)
    return e.toString()
  }
};
// connect_Wallet_WC2()

export const getcurrensession_WC2 = (refresh) => {
  return Object.values(connector?.getActiveSessions() || {})
};

export const pair = async (val, uri) => {
  try {
    return await (connector || val).core.pairing.pair({
      uri: uri,
    });

    // return connector || val
  }
  catch (e) {
    console.log('sfsfawfawfawf---->',e);
    return false
    
  }
}

export const Approvesession_WC2 = async (data) => {


  try {

    return await connector?.approveSession(data)

  }
  catch (e) {
    console.error("Approve sesissssssion_err", e)
  }
}





export const Approvesession = (data) => {
  try {
    connector?.approveSession(
      //   {
      //   accounts: [
      //     adress, // required
      //   ],
      //   chainId: chainId, // required
      // }
      data
    )
    return true
  }
  catch (e) {
    console.error("Approve Approvesession_err", e)
  }
}


export const personal_sign_WC2 = (wallet, message, id, chainId) => {
  console.log('personal sign walletr---->',wallet, message, id, chainId);
  const rpcurl = CHAIN_INFO.filter(item => item.chainId == chainId)?.pop()?.rpc
  console.log('rpcurl---->',rpcurl,DecryptPrivateKey(wallet.privKey));
  const web3 = useWeb3WithRPC(rpcurl)
  const accountInfo = accountInformation(web3, DecryptPrivateKey(wallet.privKey))?._result
  console.log('accountInfo---->',accountInfo);
  const signature = accountInfo.sign(message, DecryptPrivateKey(wallet.privKey));
  console.log('signature---->',signature);
  const result = { id, result: signature.signature, jsonrpc: '2.0' };
  console.log('result---->',result);
  return result
}

const accountInformation =async (web3, privKey) => {
  return web3.eth.accounts.privateKeyToAccount(privKey);
}
export const ApproveReq_WC2 = async (result) => {
  try {
    let data= await connector?.respondSessionRequest(result)
    return true
  }
  catch (e) {
    console.log("ApproveReq_WC2ApproveReq_WC2_err", e)
    return e.toString()
  }
}


export const RejectReq = (payload) => {
  try {
    connector.rejectRequest(payload);
    return true
  }
  catch (e) {
    console.error("RejectReq_err", e, payload)

    return e.toString()
  }
}

export const eth_sendTransaction_WC2 = async (wallet, payload, Coming_Type, _Gas, chainid) => {
  try {
    const rpcurl = CHAIN_INFO.filter(item => item.chainId == chainid)?.pop()?.rpc
    const web3 = useWeb3WithRPC(rpcurl)
    const id = payload.id;
    const { params } = payload;
    let { nonce, gasPrice, gas, value, to, data, from } = payload?.params?.request?.params[0]
console.log('payload?.params?.request?.params[0]---->',payload?.params?.request?.params[0]);
    if (!value) {
      value = "0x0";
    }

    if (!nonce) {
      nonce = (await web3.eth.getTransactionCount(from))
    }
    if (!gasPrice) {
      gasPrice = _Gas.gasPrice_custom;

    }

    // Estimate gas with { to, data } when gas is null
    if (!gas) {
      gas = _Gas.gas_custom;
    }

    const txData = {
      nonce: web3.utils.toHex(parseInt(nonce)),
      data,
      gasLimit: gas,
      gasPrice,
      to,
      value,
    };

    return await COntract_Transaction(id, txData, web3, wallet, Coming_Type);
  }
  catch (e) {
    console.error("eth sign error", e)
    return false
  }
}

async function checkIsContractAddress(address, web3) {
  try {
    const code = await web3.eth.getCode(address);

    return (code == "0x") ? false : true;
  }
  catch (e) {
    console.error("checkIsContractAddress_err", e)
  }
}
const COntract_Transaction = async (id, txData, web3, wallet, Coming_Type) => {
  try {
console.log('COntract_Transaction---->',id, txData, web3, wallet, Coming_Type);
    const privateKey = wallet.privKey.startsWith("0x") ? wallet.privKey : await DecryptPrivateKey(wallet.privKey)
    const accountInfo = await accountInformation(web3, privateKey)?._result
    if (accountInfo.address != "") {
      const signedTransaction = await accountInfo.signTransaction(txData);
      const { rawTransaction, transactionHash } = signedTransaction;
      console.log('rawTransaction---->',rawTransaction);
      if (Coming_Type) {
        return { id, result: transactionHash, jsonrpc: '2.0' }
      }
      else {
        var trans = await web3.eth
          .sendSignedTransaction(rawTransaction)
        return { id, result: trans.transactionHash, jsonrpc: '2.0' }
      }
    }
  } catch (err) {
    console.log("eth_sendTransaction err: ", err);
    RejectReq({ id, error: err })
    // handleReject(id, err.message);
  }
}

export const tokenBlanace = async (chainid, address) => {
  try {
    const rpcurl = CHAIN_INFO.filter(item => item.chainId == chainid)?.pop()?.rpc
    const web3 = useWeb3WithRPC(rpcurl)
    return await web3.eth.getBalance(address);
  }
  catch (e) {
    console.error("tokenbalance_err", e);
    return 0
  }
};

export const UsePrivateERC20 = async (wallet, Token) => {
  try {
    // key = EncodePrivateKey(key)
    const rpcurl = CHAIN_INFO.filter(item => item.currency == wallet.currency)?.pop()?.rpc
    const web3 = useWeb3WithRPC(rpcurl)
    const ABI = [
      {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{ "name": "", "type": "string" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          { "name": "guy", "type": "address" },
          { "name": "wad", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          { "name": "src", "type": "address" },
          { "name": "dst", "type": "address" },
          { "name": "wad", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [{ "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [{ "name": "wad", "type": "uint256" }],
        "name": "withdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{ "name": "", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{ "name": "", "type": "string" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          { "name": "dst", "type": "address" },
          { "name": "wad", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          { "name": "", "type": "address" },
          { "name": "", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      { "payable": true, "stateMutability": "payable", "type": "fallback" },
      {
        "anonymous": false,
        "inputs": [
          { "indexed": true, "name": "src", "type": "address" },
          { "indexed": true, "name": "guy", "type": "address" },
          { "indexed": false, "name": "wad", "type": "uint256" }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          { "indexed": true, "name": "src", "type": "address" },
          { "indexed": true, "name": "dst", "type": "address" },
          { "indexed": false, "name": "wad", "type": "uint256" }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          { "indexed": true, "name": "dst", "type": "address" },
          { "indexed": false, "name": "wad", "type": "uint256" }
        ],
        "name": "Deposit",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          { "indexed": true, "name": "src", "type": "address" },
          { "indexed": false, "name": "wad", "type": "uint256" }
        ],
        "name": "Withdrawal",
        "type": "event"
      }
    ]

    const contract = new web3.eth.Contract(ABI, Token);
    return contract;
  } catch (e) {
    console.error("private_contract_err", e);
    return false;
  }
};




export const _rejectsession = async (id, topic, val) => {
  try {

    await val ?? connector.respondSessionRequest({
      topic,
      response: { "error": { "code": -32000, "message": id.reason.message }, "id": id.id, "jsonrpc": "2.0" },
    });
    Toastfn("User Rejected")
    return true
  }
  catch (E) {
    console.log("e", E)
    return false
  }
};


export const Tron_Approve_sign =async(data,privatekey)=>{
  try{
    const tronWeb = await UseTronWeb()
let Transaction=data?.params?.request?.params?.transaction?.transaction
    const signedTx = await tronWeb.trx.sign(Transaction,DecryptPrivateKey(privatekey,'tron'));
    const broastTx = await tronWeb.trx.sendRawTransaction(signedTx);
    return { id:data?.id,result: broastTx.txid,jsonrpc: '2.0' };
  }
  catch(err){
    console.log("Tron_Approve_signTron_Approve_sign",err);
    RejectReq({ id:data.id, error: err })

    
    return false
  }


}