

const bitcoin = require('bitcoinjs-lib');
import ecc from '@bitcoinerlab/secp256k1';
import {   DecryptPrivateKey, EnCryptPrivateKey } from '../../Utilities/commenfuctions';
import {  btc_api_url_transaction, btc_rpc_url, btc_transaction_token } from '../../api/ApiConstants';
var ecfacory = require("ecpair");
const { BIP32Factory } = require('bip32')
const bip39 = require('bip39');
const axios = require('axios');
const bip32 = BIP32Factory(ecc)
//insights
const bitcore = require('bitcore-lib');
const PrivateKey = require("bitcore-lib/lib/privatekey");






//Import A Wallet using Phrase

export const UseImportWallet = async (mnemonic, DERIVATION) => {

try{


    const seed = bip39.mnemonicToSeedSync(mnemonic);

    // Derive the master node
    const masterNode = bip32.fromSeed(seed);

    // Derive the first child node
    const childNode = masterNode.derivePath(DERIVATION);

    // Get the private key
    const privateKey = childNode.toWIF();
    

    // Get the public key
    const publicKey = childNode.publicKey;

    // Create a P2WPKH (bech32) address
    const { address } = bitcoin.payments.p2wpkh({ pubkey: publicKey });

    return { mnemonic, address: address, privateKey: EnCryptPrivateKey(privateKey),publickey: publicKey };

}
catch(err){
    console.log("UseImportWallet_BTC err",err);
    return false
}

}

//To get Balance
export const UseWalletBalance = async (address) => {
    try {

        const response = await axios.get(`${btc_rpc_url}/addrs/${address}/balance`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to get balance');
    }
}



export const createBtcWallet = async (phrase) => {
    try {
        var derivation = "m/84'/0'/0'/0/0";

        const walletdetials = await UseImportWallet(phrase, derivation);

        return walletdetials

    } catch (error) {
        console.log("createWalleterr", error)
    }
}
//import A Wallet using Privatekey
export const createBtcWalletPrivatekey = async (key) => {
    try {
        const checkPrivatekey = PrivateKey.isValid(key);
if(checkPrivatekey){




    //   Create a Bitcoin ECPair object from the private key
      const decoded = bitcoin.ECPair.fromWIF(key, bitcoin.networks.bitcoin);
      const publicKey = decoded.publicKey;


    const {address} = bitcoin.payments.p2wpkh({ pubkey: publicKey, network: bitcoin.networks.bitcoin });


    return {  address: address, privateKey: EnCryptPrivateKey(key),publickey: publicKey};



}

    } catch (error) {
        console.log("createBtcWalletPrivatekey_err", error)
        return false
    }
}


//Validate a Phrase
export const Validateseedpharse = async (seedPhrase) => {
    const isValid = bip39.validateMnemonic(seedPhrase.trim());
    return isValid
}


//To Check Valid Address
export const Addressvalidation = async (address) => {
    try {
        const isValid = bitcore.Address.isValid(address, 'testnet');
        return isValid;
    } catch (error) {
        console.log(error, "address validation error");
    }
}




//Get Transaction History
export const btcTransactionHistory = async (address) => {
    try {
        const response = await axios({
            method: "get",
            url: `${btc_rpc_url}/addrs/${address}?token=${btc_transaction_token}`
        })
                let confirm_arrdata=response?.data?.txrefs
                let unconfirmed_arrdata=response?.data?.unconfirmed_txrefs

                let transactions_Arr = [];

        if(confirm_arrdata?.length>0){
            if (confirm_arrdata?.length > 20) confirm_arrdata = confirm_arrdata?.slice(-20)

          await Promise.all( confirm_arrdata?.map(async(item)=>{

const TransactionDetails = await axios.get(`${btc_api_url_transaction}/${item?.tx_hash}?token=${btc_transaction_token}`);

                let txid = TransactionDetails?.data?.hash;
                let amount = TransactionDetails?.data?.total / 1e8;
                let toaddress = TransactionDetails.data.addresses[1];
                let fromaddress = TransactionDetails.data.addresses[0]
                let confirmations=TransactionDetails.data.confirmations;
                let timestamp = TransactionDetails.data.confirmed;


                transactions_Arr.push({
                    fromaddress: fromaddress,
                    toaddress: toaddress,
                    amount: amount,
                    txid: txid,
                    timestamp: timestamp,
                    confirmations:confirmations
                  });
        })
          )
       
        }
        if(unconfirmed_arrdata?.length>0){
            if (unconfirmed_arrdata?.length > 20) unconfirmed_arrdata = unconfirmed_arrdata?.slice(-20)

          await Promise.all( unconfirmed_arrdata&&unconfirmed_arrdata?.map(async(item)=>{


            const TransactionDetails = await axios.get(`${btc_api_url_transaction}/${item?.tx_hash}?token=${btc_transaction_token}`);

let txid = TransactionDetails.data.hash;
let amount = TransactionDetails.data.total / 1e8;
let toaddress = TransactionDetails.data.addresses[1];
let fromaddress = TransactionDetails.data.addresses[0]
let confirmations=TransactionDetails.data.confirmations;
let timestamp = TransactionDetails.data?.confirmed;




                transactions_Arr.push({
                    fromaddress: fromaddress,
                    toaddress: toaddress,
                    amount: amount,
                    txid: txid,
                    timestamp: timestamp,
                    confirmations:confirmations
                  });
        })
          )
        }
        
        return transactions_Arr

    } catch (error) {
        console.log(error, "Gettrans_error");
    }
};
 
//Transfer Bitcoin
export const sendBTC = async (walletdata,toaddress,toAmount) => {
    try {

        if (walletdata.balance < toAmount) {
            return {status:false,message:"Balance is Too low ...!"}
           }
           if (walletdata.balance < 0.00008) {
            return {status:false,message:"Insufficient funds for gas!"}
           }

        const { privKey, walletaddress} = walletdata
        var privateKey = new bitcore.PrivateKey(DecryptPrivateKey(privKey,'BTC'));
        var toAmounts = bitcore.Unit.fromBTC(toAmount).toSatoshis();
        var respData = await axios.get(
            `${btc_rpc_url}/addrs/${walletaddress}`
        );
        if (respData) {
            var preHash = respData.data.txrefs[0].tx_hash
            var previousData = await axios.get(`${btc_rpc_url}/txs/${preHash}`)
            var hashData = previousData?.data?.hash
            let outputIndex = previousData?.data?.outputs.length > 1 ? 1 : 0
            if (outputIndex == 1) {
                let address1 = previousData.data.outputs[0].addresses
                let address2 = previousData.data.outputs[outputIndex].addresses

                if (address1 == walletaddress) {
                    outputIndex = 0
                }
                if (address2 == walletaddress) {
                    outputIndex = 1
                }
            }
            var scriptData = previousData.data.outputs[outputIndex]?.script
            var satoshisData = previousData.data.outputs[outputIndex]?.value
            var utxo = {
                txId: hashData,
                outputIndex: outputIndex,
                script: scriptData,
                satoshis: satoshisData
            };

            var input = bitcore.Unit.fromSatoshis(satoshisData).toBTC()
            const dustThreshold = bitcore.Transaction.DUST_AMOUNT * (parseFloat(toAmount) + input);
            let ToAmount = Math.max(toAmounts, dustThreshold)

            let fee = satoshisData - ToAmount >= 128 ? satoshisData - ToAmount : 128
            fee = fee > 3390000 ? 3390000 : fee

            const transaction = new bitcore.Transaction()// Minimum non-dust amount
                .from(utxo)
                .to(toaddress, ToAmount)
                .change(walletaddress) // Change address where any remaining funds will be sent
                .fee(fee) // Fee for the transaction
                .sign(privateKey) // Sign the transaction with the private key

            const serializedTx = transaction.serialize();

            const apiUrl = `${btc_rpc_url}/txs/push`;

var Resp= axios.post(apiUrl, {
    tx: serializedTx
})
if(Resp){
 return {status:true,message:"Transaction successfully broadcasted"}

}
else{
    return {status:false}

}
           
        }
    } catch (err) {
        console.log("sendBTCsendBTC_err", err);
        return  {status:false,message:'Error broadcasting transaction'}
    }
}


