import web3 from 'web3';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Web3 from 'web3';
import EIP155Lib from './EVMwalletUtills';
const TronWeb = require('tronweb');


export const accountInformation = async (web3, privKey) => {
    return web3.eth.accounts.privateKeyToAccount(privKey);
}

export const createEvmWallet = async (seed) => {
    try {
        // old ethers v6
        // const mnemonicWallet = ethers.Wallet.fromPhrase(seed);

        // new ethers v5 for walletconnect
        const mnemonicWallet = EIP155Lib.init({ mnemonic: seed });

        return { address: mnemonicWallet.getAddress(), privateKey: mnemonicWallet.getPrivateKey() }
    } catch (e) {
        console.log("createEvmWallet_err", e);
    }
}

//Create Wallet Using Privatekey
export const createEvmWalletPrivatekey = async (privatekey) => {
    try {
        // old ethers v6
        // const Wallet = new ethers.Wallet(privatekey);

        // new ethers v5 for walletconnect
        const Wallet = EIP155Lib.init({ privateKey: privatekey });


        return { address: Wallet.getAddress(), privateKey: Wallet.getPrivateKey() }
    } catch (e) {
        console.log("createEvmWallet_err", e);
        return false
    }
}

export const ERC20address_validation = async (tokenABI, tokenAddress) => {
    try {
        let tokenContract = await new web3.eth.Contract(tokenABI, tokenAddress);
        return tokenContract;
    } catch (err) {
        return "no";
    }
}

export const createWallet = async (privatekey = "") => {
    console.log('fgqauywg---->', await AsyncStorage.getItem("walletData"));
    if (!await AsyncStorage.getItem("walletData")) {
        const create = await createEvmWalletPrivatekey(privatekey);
        console.log('createcreatecreate---->', create);
        storageSetItem("walletData", create);
    }
    return
}

export const storageSetItem = (key, data) => {
    console.log('global.atob(data)---->', global.atob(data));
    return AsyncStorage.setItem(key, global.atob(data));
}

export const storageGetItem = async (key, data) => {
    console.log('await AsyncStorage.getItem(key)---->', await AsyncStorage.getItem(key));
    return global.btoa(await AsyncStorage.getItem(key));
}

export const getwalletAddress = async (privatekey = "") => {
    const getData = await createEvmWalletPrivatekey(privatekey)
    return getData.address
}

export const tronInstance = async (rpc) => {
    try {
        const HttpProvider = TronWeb.providers.HttpProvider;
        return await new TronWeb({
            fullNode: new HttpProvider(rpc),
            solidityNode: new HttpProvider(rpc),
            eventServer: new HttpProvider(rpc),

        });
    } catch (e) {
        console.log('Erron on tron insatace---->', e);
    }
}


export const getWebInstance = async (rpc, chainType) => {
    console.log('rpc, chainType---->', rpc, chainType);
    switch (chainType) {
        case "eip155":
            return new Web3(rpc);

        case "tron":
            return await tronInstance(rpc);
        default:
            return new Web3(rpc);
    }
}