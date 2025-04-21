
import { EncodePrivateKey } from "../Utilities/commenfuctions";
import { CHAIN_INFO, useWeb3WithRPC } from "../Screens/WalletHome/useweb3";
import { eth_chainId,bnb_chainId } from "../api/ApiConstants";

var connector;

export const GetWalletType = (chainid) =>
  chainid == bnb_chainId
    ? "BNB"
    : chainid == eth_chainId
    ? "ETH"
    : false;

export const GetChainid = (chainid) =>
  chainid == "BNB"
    ? bnb_chainId
    : chainid == "ETH"
    ? eth_chainId:false
   

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
    );
    return true;
  } catch (e) {
    console.error("Approve sesiion>>>>>>>.", e);
  }
};

export const personal_sign = (wallet, message, id) => {
  const web3 = useWeb3WithRPC(rpcurl);
  const rpcurl = CHAIN_INFO.filter(
    (item) => item.currency == wallet.currency
  )?.pop()?.rpc;
  const accountInfo = accountInformation(web3, wallet.privKey);
  const signature = accountInfo.sign(
    message,
    `${EncodePrivateKey(wallet.privKey).toString()}`
  );
  const result = { id, result: signature.signature };
  return result;
};

const accountInformation = (web3, privKey) => {
  return web3.eth.accounts.privateKeyToAccount(EncodePrivateKey(privKey));
};
export const ApproveReq = (result) => {
  try {
    connector.approveRequest(result);
    return true;
  } catch (e) {
    return e.toString();
  }
};

export const RejectReq = (payload) => {
  try {
    connector.rejectRequest(payload);
    return true;
  } catch (e) {
    console.error("RejectReq_er", payload);

    return e.toString();
  }
};

export const eth_sendTransaction = async (
  wallet,
  payload,
  Coming_Type,
  _Gas
) => {
  try {
    const rpcurl = CHAIN_INFO.filter(
      (item) => item.currency == wallet.currency
    )?.pop()?.rpc;
    const web3 = useWeb3WithRPC(rpcurl);
    const id = payload.id;
    const { params } = payload;

    if (!value) {
      value = "0x0";
    }

    if (!nonce) {
      nonce = await web3.eth.getTransactionCount(from);
    }
    if (!gasPrice) {
      gasPrice = _Gas.gasPrice_custom;
    }

    // Estimate gas with { to, data } when gas is null
    if (!gas) {
      gas = _Gas.gas_custom;
    }

    const txData = {
      nonce: web3.utils.toHex(nonce),
      data,
      gasLimit: gas,
      gasPrice,
      to,
      value,
    };
    return await COntract_Transaction(id, txData, web3, wallet, Coming_Type);
  } catch (e) {
    console.error("eth sign error", e);
    return false;
  }
};


const COntract_Transaction = async (id, txData, web3, wallet, Coming_Type) => {
  try {
    const accountInfo = accountInformation(web3, wallet.privKey);
    if (accountInfo.address != "") {
      const signedTransaction = await accountInfo.signTransaction(txData);
      const { rawTransaction, transactionHash } = signedTransaction;
      if (Coming_Type) {
        return { id, result: transactionHash };
      } else {
        var trans = await web3.eth.sendSignedTransaction(rawTransaction);
        return { id, result: trans.transactionHash };
      }
    }
  } catch (err) {
    RejectReq({ id, error: err });
    // console.log("eth_sendTransaction err: ", err);
    // handleReject(id, err.message);
  }
};
