/** Packages */
import TronWeb from "tronweb"

import { EnCryptPrivateKey } from "../../Utilities/commenfuctions";
import { currentChainconfig, Main_tron_url, tron_rpc_url } from "../../api/ApiConstants";




/** Initialize TronWeb with the Tron node's API URL */
let tronWeb = null
export const UseTronWeb = async () => {
    try {
        const HttpProvider = TronWeb.providers.HttpProvider;
        tronWeb = await new TronWeb({
            fullNode: new HttpProvider(tron_rpc_url),
            solidityNode: new HttpProvider(tron_rpc_url),
            eventServer: new HttpProvider(tron_rpc_url),
        });
        return tronWeb
        // }
    } catch (e) {
        console.log("UseTronWeb_err", e);
        return false
    }
}


/** Create-Tron-Account */
export const createTronWallet = async (seed) => {
    try {
        console.log('currentChainconfigcurrentChainconfig---->',currentChainconfig.TRX);
        const tron = await currentChainconfig.TRX.web3_instance();

        let account = await tron.fromMnemonic(seed); // TRON

        const privateKey = account.privateKey.split("0x")[1]

        return { address: account.address, privateKey: EnCryptPrivateKey(privateKey) }
    } catch (e) {
        console.log("createTronWallet_err", e);
    }
}

/** Create-Tron-Account using privatekey */
export const createTronWalletWithPrivatekey = async (privateKey) => {
    try {
        const tron = await currentChainconfig.TRX.web3_instance();
        let account = await tron.address.fromPrivateKey(privateKey); // TRON
        return { address: account, privateKey: EnCryptPrivateKey(privateKey) }
    } catch (e) {
        console.log("createTronWallet_err", e);
        return false

    }
}

//address to hex
export const UseConvertToHex = async (address) => {
    const tronWeb = await currentChainconfig.TRX.web3_instance();
    try {
        let hexAddress = await tronWeb.address.toHex(address);
        return hexAddress;
    } catch (e) {
        console.log("UseConvertToHex_err", e);
    }
};

//hex to address

export const UseConvertFromHex = async (hexaddress) => {
    const tronWeb = await currentChainconfig.TRX.web3_instance();
    try {
        let Address = await tronWeb.address.fromHex(hexaddress);
        return Address;
    } catch (e) {
        console.log("UseConvertFromHex_err", e);
    }
}

