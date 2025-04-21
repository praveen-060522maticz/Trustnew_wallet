/** Packages */
import TronWeb from 'tronweb'
/** Hooks */
import { UseConvertFromHex, UseConvertToHex } from "./Tron_controller";
/** Config */

import { DecryptPrivateKey, fiatcurrencies } from '../../Utilities/commenfuctions';
import { currentChainconfig, tron_rpc_url } from "../../api/ApiConstants"
import axios from "axios";
import { isEmpty } from '../../Utilities/commenfuctions';
import { CreateTransaction_Tron, Tron_GeBalance } from '../../Utilities/axios';





/** Tron Instance */
export const UseTronWeb = async (rpc) => {
    try {
        let tronWeb = null
        const HttpProvider = TronWeb.providers.HttpProvider;


        tronWeb = await new TronWeb({
            fullNode: new HttpProvider(tron_rpc_url || rpc),
            solidityNode: new HttpProvider(tron_rpc_url || rpc),
            eventServer: new HttpProvider(tron_rpc_url || rpc),

        });



        return tronWeb
    } catch (e) {
        console.log("UseTronWeb_err", e);
        return false
    }
}
/** Get-Token-Balance */
export const getTokenDetails = async (data) => {
    const tronWeb = await currentChainconfig.TRX.web3_instance()
    try {
        tronWeb.setAddress(data.walletaddress);

        let accountDetail = await tronWeb.contract().at(data.contractAddress);
        let result = await accountDetail.balanceOf(data.walletaddress).call();
        return JSON.parse(result) / 10 ** parseInt(6);
    } catch (err) {
        console.log("---TokenBalanceErr", err);
        return 0;
    }
};


/** Send-Tron-Transacation */
export const sendTRX = async (data, toAddresss, amount, Gas) => {
    try {
        var Privatekey = DecryptPrivateKey(data.privKey, data.tokenType)

        const tronWeb = await currentChainconfig.TRX.web3_instance()
        const fromAddress = await UseConvertToHex(data.walletaddress)
        const toAddress = await UseConvertToHex(toAddresss)



        if (data.type == "Token") {
            let balance = await getTokenDetails(data);
            if (balance < amount) {
                return { status: false, message: "Balance is Too low ...!" }
            }
            if (parseFloat(balance) - parseFloat(amount)?.toFixed(4) < Gas) {
                return { status: false, message: "Insufficient funds for gas!" }
            }
            var value = amount * 1e6;
            var parameter = [
                { type: "address", value: toAddress },
                { type: "uint256", value: value },
            ];

            tronWeb.setAddress(data.walletaddress);



            const accountDetail = await tronWeb.transactionBuilder.triggerSmartContract(data.contractAddress, "transfer(address,uint256)", {}, parameter);
            const signedTx = await tronWeb.trx.sign(accountDetail.transaction, Privatekey);
            const broastTx = await tronWeb.trx.sendRawTransaction(signedTx);

            let Transactiongasfee = Transactionfees(broastTx?.txid)


            return { status: true, data: broastTx.txid };

        } else if (data.type == "Crypto") {
            let balance = parseFloat(data.balance);

            if (balance < amount) {
                return { status: false, message: "Balance is Too low ...!" }
            }
            if ((parseFloat(balance) - parseFloat(amount)?.toFixed(4)) <= Gas) {
                return { status: false, message: "Insufficient funds for gas!" }
            }

            const getBalalce = await tronWeb.trx.getBalance(data.walletaddress);



            if (getBalalce < amount) { return { status: false, message: "Balance is Too low ...!" } }

            let sendAmount = amount * 1e6




            let SendData = {
                "to_address": toAddress,
                "owner_address": fromAddress,
                "amount": sendAmount
            }


            let accountDetail = await CreateTransaction_Tron(SendData)
            let signedTx = await tronWeb.trx.sign(accountDetail, Privatekey);

            let broastTx = await tronWeb.trx.sendRawTransaction(signedTx);

            return { status: true, data: broastTx.txid };
        }
    } catch (e) {
        console.log("sendTRX_err", e);

        return { status: false, data: {}, message: "Transaction failed" };
    }
}

/** Tron-Transacation-History */
export const tronTransactionHistory = async (data) => {
    try {
        if (data.type == "Crypto") {
            const URL = tron_rpc_url
            let Transaction = `${URL}/v1/accounts/${data?.walletaddress}/transactions?only_to=false&limit=20`
            var getItem = axios.get(Transaction).then(async function (response) {
                let transactions_Arr = [];
                let arrData = response?.data?.data

                for (let item of arrData) {
                    let Details = await TransactionDetails(item.txID, data)
                    transactions_Arr.push(Details)
                }

                return transactions_Arr

            })
        }
        if (data.type == "Token") {

            const URL = tron_rpc_url

            let Transaction = `${URL}/v1/accounts/${data?.walletaddress}/transactions/trc20?only_to=false&limit=20&contract_address=${data.contractAddress}`
            var getItem = axios.get(Transaction).then(async function (response) {
                let transactions_Arr = [];
                let arrData = response.data?.data

                for (let item of arrData.reverse()) {


                    transactions_Arr.push({
                        fromaddress: item.from,
                        toaddress: item.to,
                        amount: item.value ? (item.value / 1e6) : 0,
                        txid: item.transaction_id,
                        timestamp: item.block_timestamp,
                        confirmations: item?.confirmations
                    })
                }


                return transactions_Arr

            })
        }
        return getItem
    }
    catch (error) {
        console.log("tronTransactionHistory_err", error);
        return false

    }

}

/** Tron-Transactiondetails*/
export const TransactionDetails = async (txID, data) => {
    try {
        const URL = tron_rpc_url
        const response = await axios.get(`${URL}/wallet/gettransactionbyid?value=${txID}`);
        let Address_parameters = response.data.raw_data?.contract?.[0]?.parameter?.value
        let FromAdress = await UseConvertFromHex(Address_parameters.owner_address)
        let ToAddress = await UseConvertFromHex(Address_parameters.to_address ? Address_parameters.to_address : Address_parameters.contract_address)
        let Amount = await Address_parameters.amount
        let convertamount = !isEmpty(Amount) ? Amount / 1e6 : 0
        let timeStamp = response?.data?.raw_data?.timestamp
        let confirmations = response?.data?.raw_data?.confirmations



        return {
            fromaddress: FromAdress,
            toaddress: ToAddress,
            amount: convertamount,
            txid: txID,
            timeStamp: timeStamp,
            confirmations: confirmations
        }

    } catch (error) {
        console.error('Error fetching transaction details:', error);
    }

}
/** To Get Estimation Transaction fee*/
export const Transactionfees = async (txID, data) => {
    try {
        const tronWeb = await UseTronWeb();

        const transaction = await tronWeb.trx.getTransaction(txID);

        const contract = transaction?.raw_data?.contract[0];
        // const energy = contract.parameter?.value?.fee_limit;
        // const energyPrice = transaction?.raw_data?.fee;

        return transaction?.fee



    } catch (error) {
        console.error('Error fetching transaction details:', error);
    }

}


/** Gas fee estimation*/
export const tronEstimateGasFee = async (data) => {
    try {
        const tronWeb = await currentChainconfig.TRX.web3_instance()
        const conversionValue = await fiatcurrencies(Array(data.currency), "USD");
        let baseAddress = await tronWeb.address.toHex(data.walletaddress);

        if (data.type == 'Token') {
            var options = { feeLimit: 100000000 };
            var parameter = [
                { type: "address", value: data.toAddress },

                { type: "uint256", value: data.amount },

            ];

            const energyEstimate = await tronWeb.transactionBuilder.estimateEnergy(data.contractAddress, "transfer(address,uint256)", options, parameter, baseAddress);
            // step2: get the energy fee unit, this may vary according to TRON network, suggest getting from this API
            const chainParams = await tronWeb.trx.getChainParameters();
            const energyFee = chainParams.filter(item => item.key === 'getEnergyFee')[0].value;

            // step3: get feeLimit as TRX value 
            const feeLimit = tronWeb.fromSun(energyEstimate.energy_required * energyFee);
            return {
                gasFee: feeLimit,
                dollarValue: conversionValue[0].value * feeLimit,
            };
        } else {


            let Estimate_gasdata = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "eth_gasPrice",
                "params": []
            }
            let Gas_price = await Tron_GeBalance(Estimate_gasdata)
            let gasprice = await tronWeb.toDecimal(Gas_price?.result)
            let gaslimit = await tronWeb.toDecimal(0x35c)
            let Estimated_Gas = (gasprice * gaslimit) / 1e6

            return {
                gasFee: Estimated_Gas,
                dollarValue: conversionValue[0].value * Estimated_Gas,
            }

        }

    } catch (e) {
        console.log("tronEstimateGasFee_err", e);
    }
}


export const tronTokenDetails = async (address, tokenAddress) => {
    try {
        /* Set Address to tron-web then only fetch the token balances */
        const tronWeb = await currentChainconfig.TRX.web3_instance()
        tronWeb.setAddress(address);
        const tokenContract = await tronWeb.contract().at(tokenAddress);
        let tokenName = await tokenContract.name().call();
        let tokenSymbol = await tokenContract.symbol().call();
        let tokenDecimal = await tokenContract.decimals().call();
        const balance = await tokenContract.balanceOf(address).call();
        let totalbalance = parseFloat(balance) / 10 ** await tokenContract.decimals().call();
        return { status: true, name: tokenName, decimals: tokenDecimal, symbol: tokenSymbol }
    } catch (e) {
        console.log("tronBalance_err", e);

    }
}