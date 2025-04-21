

const bitcoin = require('bitcoinjs-lib');
import * as ecc from '@bitcoinerlab/secp256k1';
import { DecryptPrivateKey, EnCryptPrivateKey } from '../../Utilities/commenfuctions';
import { btc_api_url_transaction, btc_rpc_url, btc_transaction_token, currentChainconfig } from '../../api/ApiConstants';
var ecfacory = require("ecpair");
const { BIP32Factory } = require('bip32')
const bip39 = require('bip39');
import axios from 'axios'
const bip32 = BIP32Factory(ecc)
//insights
const bitcore = require('bitcore-lib');
const PrivateKey = require("bitcore-lib/lib/privatekey");
import { ECPairFactory, } from "ecpair";
import { addressValidation } from '../EVM/Evm_contracthook';
const ECPair = ECPairFactory(ecc)




//Import A Wallet using Phrase

export const UseImportWallet = async (mnemonic) => {

    try {

        const seed = bip39.mnemonicToSeedSync(mnemonic);
        // Derive the master node
        const masterNode = bip32.fromSeed(seed, currentChainconfig.BTC.environment);

        // Derive the first child node
        const childNode = masterNode.derivePath(currentChainconfig.BTC.derivation);

        // Get the private key
        const privateKey = childNode.toWIF();
        console.log("🚀 ~ createBTCWal ~ privateKey:", privateKey)

        // Get the public key
        const publicKey = Buffer.from(childNode.publicKey) //childNode.publicKey;
        console.log("🚀 ~ createBTCWal ~ publicKey:", publicKey)

        // Create a P2WPKH (bech32) address
        const { address } = bitcoin.payments.p2wpkh({ pubkey: publicKey, network: currentChainconfig.BTC.environment });

        console.log("🚀 ~ createBTCWal ~ address:", address)
        // return { status: true, address: address, privateKey: privateKey, wif: publicKey , u8privatekey : childNode.privateKey };
        return { mnemonic, address: address, privateKey: EnCryptPrivateKey(privateKey), publickey: publicKey };

    }
    catch (err) {
        console.log("UseImportWallet_BTC err", err);
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
        // var derivation = "m/84'/0'/0'/0/0"; // main
        var derivation = "m/44'/1'/0'/0/0"; // test3

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
        if (checkPrivatekey) {




            //   Create a Bitcoin ECPair object from the private key
            const decoded = bitcoin.ECPair.fromWIF(key, bitcoin.networks.bitcoin);
            const publicKey = decoded.publicKey;


            const { address } = bitcoin.payments.p2wpkh({ pubkey: publicKey, network: bitcoin.networks.bitcoin });


            return { address: address, privateKey: EnCryptPrivateKey(key), publickey: publicKey };



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
        let confirm_arrdata = response?.data?.txrefs
        let unconfirmed_arrdata = response?.data?.unconfirmed_txrefs

        let transactions_Arr = [];

        if (confirm_arrdata?.length > 0) {
            if (confirm_arrdata?.length > 20) confirm_arrdata = confirm_arrdata?.slice(-20)

            await Promise.all(confirm_arrdata?.map(async (item) => {

                const TransactionDetails = await axios.get(`${btc_api_url_transaction}/${item?.tx_hash}?token=${btc_transaction_token}`);

                let txid = TransactionDetails?.data?.hash;
                let amount = TransactionDetails?.data?.total / 1e8;
                let toaddress = TransactionDetails.data.addresses[1];
                let fromaddress = TransactionDetails.data.addresses[0]
                let confirmations = TransactionDetails.data.confirmations;
                let timestamp = TransactionDetails.data.confirmed;


                transactions_Arr.push({
                    fromaddress: fromaddress,
                    toaddress: toaddress,
                    amount: amount,
                    txid: txid,
                    timestamp: timestamp,
                    confirmations: confirmations
                });
            })
            )

        }
        if (unconfirmed_arrdata?.length > 0) {
            if (unconfirmed_arrdata?.length > 20) unconfirmed_arrdata = unconfirmed_arrdata?.slice(-20)

            await Promise.all(unconfirmed_arrdata && unconfirmed_arrdata?.map(async (item) => {


                const TransactionDetails = await axios.get(`${btc_api_url_transaction}/${item?.tx_hash}?token=${btc_transaction_token}`);

                let txid = TransactionDetails.data.hash;
                let amount = TransactionDetails.data.total / 1e8;
                let toaddress = TransactionDetails.data.addresses[1];
                let fromaddress = TransactionDetails.data.addresses[0]
                let confirmations = TransactionDetails.data.confirmations;
                let timestamp = TransactionDetails.data?.confirmed;




                transactions_Arr.push({
                    fromaddress: fromaddress,
                    toaddress: toaddress,
                    amount: amount,
                    txid: txid,
                    timestamp: timestamp,
                    confirmations: confirmations
                });
            })
            )
        }

        return transactions_Arr

    } catch (error) {
        console.log(error, "Gettrans_error");
    }
};

export const btcEstimateGasFee = async(address) => {
    const utxos = await axios.get(currentChainconfig.BTC.blockStreamApis?.utxo.replace("##USER_ADDRESS##", address));
    const { data } = await axios.get(currentChainconfig.BTC.blockStreamApis.fee)
    console.log("🚀 ~ btcEstimateGasFee ~ feeurl:", data,utxos.data?.length)
    const txSize = ((utxos.data?.length ?? 0) * 180) + (2 * 34) + 10 + (utxos.data?.length ?? 0);
    const mediumFeeRate = data[12];
    return { 
       gasFee : Math.round(txSize * mediumFeeRate) 
   }
}

//Transfer Bitcoin
export const sendBTC = async (walletdata, toaddress, amount) => {
    try {
        const { rpc, balance, walletaddress, } = walletdata;
        console.log("🚀 ~ sendBTC ~ data:", walletdata);
        //   let validAdd = addressValidation(walletaddress,network) || addressValidation(toAddress,network);
        const privKey = DecryptPrivateKey(walletdata?.privKey,"BTC")
        if(!addressValidation(toaddress,"BTC")){   
            return { status : false , message : "Invalid address"} 
        }
        if (balance < amount) {
            return { status: false, message: "Balance is Too low ...!" };
        }
        if (balance < 0.00008) {
            return { status: false, message: "Insufficient funds for gas!" };
        }

        const privateKey = ECPair.fromWIF(privKey, currentChainconfig.BTC.environment)
        console.log("🚀 ~ sendBTC ~ privateKey:", privateKey)

        const psbt = new bitcoin.Psbt({ network:currentChainconfig.BTC.environment });

        const utxos = await axios.get(currentChainconfig.BTC.blockStreamApis?.utxo.replace("##USER_ADDRESS##", walletaddress));
        console.log("🚀 ~ sendBTC ~ utxos:", utxos)

        const utxoList = utxos.data;
        if (!utxoList.length) throw new Error("No UTXOs");


        let total = 0;
        const fee = (await btcEstimateGasFee(walletaddress)).gasFee; // adjust this as needed
        const toAmount = Math.floor(amount * 1e8);

        for (let utxo of utxoList) {
            console.log("🚀 ~ sendBTC ~ utxo:", utxo);
            const { data: rawTxHex } = await axios.get(currentChainconfig.BTC.blockStreamApis?.utxoTx.replace("##TXID##", utxo.txid));
            console.log("🚀 ~ sendBTC ~ rawTxHex:", rawTxHex);
            psbt.addInput({
                hash: utxo.txid,
                index: utxo.vout,
                ...(
                    { nonWitnessUtxo: Buffer.from(rawTxHex, 'hex') }
                )
            });
            total += utxo.value;
        }

        console.log('total < toAmount + fee-->', total, toAmount + fee, fee, toAmount)
        if (total < toAmount + fee) {
            throw new Error("Insufficient balance");
        }

        const change = total - toAmount - fee

        psbt.addOutput({ address: toaddress, value: toAmount });

        if (change >= 546) {
            psbt.addOutput({ address: walletaddress, value: change }); // change
        }
        console.log("🚀 ~ sendBTC ~ psbt:", psbt, psbt.inputCount)

        const fixedKeyPair = {
            publicKey: Buffer.from(privateKey.publicKey),
            sign: (hash) => Buffer.from(privateKey.sign(hash)),
        };
        
        // Sign each input
        psbt.signAllInputs(fixedKeyPair);

        console.log("🚀 ~ sendBTC ~ signAllInputs:", psbt)
        // Validate and finalize
        //   psbt.validateSignaturesOfAllInputs();
        psbt.finalizeAllInputs();

        const txHex = psbt.extractTransaction().toHex();
        console.log("Signed Transaction Hex:", txHex);


        const { data: txid } = await axios.post(
            currentChainconfig.BTC.blockStreamApis.broadcastapi,
            txHex,
            { headers: { 'Content-Type': 'text/plain' } }
        );

        console.log('Transaction sent. TXID:', txid);
        return { status: true, message: "Transaction successfully broadcasted" }
        // return txid;

    } catch (err) {
        console.log("sendBTC_err", err);
        return { status: false, message: "Error broadcasting transaction" };
    }
}


export const btcBalance = async (address) => {
    console.log("address", address);
    try {
        const balanceURL = currentChainconfig.BTC.blockStreamApis.balance.replace(/##USER_ADDRESS##/g, address);
        const { data } = await axios({
            method: "get",
            url: balanceURL
        });
        const confirmed = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
        const unconfirmed = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;
        const total = confirmed + unconfirmed;
        return confirmed / 1e8
    } catch (error) {
        console.log("btcBalance_err", error);
        return 0
    }
}

export const btcGetTransactions = async (address) => {
    try {
        const trUrl = currentChainconfig.BTC.blockStreamApis.txHistory.replace(/##USER_ADDRESS##/g, address);
        const { data } = await axios({
            method: "get",
            url: trUrl
        });
        console.log("datadatadataiasjdioajs", data);

        const transactions_Arr = [];


        for (let index = 0; index < data.length; index++) {
            const trasaction = data[index];

            transactions_Arr.push({
                fromaddress: trasaction?.vin?.[0]?.prevout?.scriptpubkey_address,
                toaddress: trasaction?.vout?.[0]?.scriptpubkey_address,
                amount: trasaction?.vout?.[0]?.value / 1e8,
                txid: trasaction.txid,
                timestamp: trasaction?.status?.block_time,
                confirmations: trasaction?.status?.confirmed
            });
        }


        return transactions_Arr;


    } catch (error) {
        console.log('Error on btcGetTransactions---->', e);
    }
}

