import React, { useCallback, useContext, useState } from "react";
import { Keyboard, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Header from "../../Navigations/Header";
import { deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import Button from "../../Components/Button";
import { Toastfn } from "../../Utilities/toast";
import { addressValidation, cryptoBlanace, evmEstimateGasFee, getCurrecnyBalance } from "../../Network_controllers/EVM/Evm_contracthook";
import Clipboard from "@react-native-clipboard/clipboard";
import { isEmpty } from "../../Utilities/commenfuctions";
import { useFocusEffect } from "@react-navigation/native";
import Scan2 from "../../Assets/caexicons/scan2.svg"
import Scan3 from "../../Assets/caexicons/scan3.svg"
import { useSelector } from "react-redux";
import { tronEstimateGasFee } from "../../Network_controllers/TRON/Tron_Contract";
import { currentChainconfig } from "../../api/ApiConstants";
import { btcBalance } from "../../Network_controllers/BTC/Bitcoin_controller";
export default function Sendcurrency({ navigation, route }) {
    const theme = useContext(themeContext);
    const style = styles(theme);


    const [currency, setcurrency] = useState("")
    const [amount, setAmount] = useState("");
    const [toAddress, setToaddress] = useState("");
    const [amountErr, setAmountErr] = useState(false);
    const [toAddressErr, setToaddressErr] = useState(false);
    const [networkBalance,setNetworkBalance]=useState("0")
    console.log('currency---->', currency);
    var routesdata = currency
    var scandata = route?.params?.data

    const selectedCurrencyFromRedux = useSelector(
        (state) => state.defaultcurrencies.selectedCurrency
    )
    useFocusEffect(
        useCallback(() => {
            setcurrency(selectedCurrencyFromRedux)
        })

    )
    /** Address from qrcodescanner */
    useFocusEffect(
        useCallback(() => {

            if (!isEmpty(route?.params?.datas)) {
                setcurrency(route?.params?.datas)
                getbalance()
            } else if (scandata) {
                try {
                    getbalance()
                    var covert = scandata.replace("ethereum:", "");
                    if (covert?.includes("@")) {
                        var covert1 = covert.split("@");

                        var covert2 = covert1.slice(0, 1)

                        setToaddress(covert2[0]);

                    }
                    else {
                        setToaddress(covert)
                    }
                }
                catch (err) {
                    console.log("scan_err", err);
                }

            }
            else {
                setcurrency(currency)
            }

        }, [route?.params?.data])
    )

    const getbalance = async()=>{
        var bal;
        if(selectedCurrencyFromRedux?.tokenType === "TRC20"){
            bal = await cryptoBlanace("","TRX",selectedCurrencyFromRedux?.walletaddress)
        }else if(selectedCurrencyFromRedux?.tokenType === "BTC"){
            bal = await btcBalance(selectedCurrencyFromRedux?.walletaddress)
        }else{
            bal = await getCurrecnyBalance(selectedCurrencyFromRedux?.currencyName,selectedCurrencyFromRedux?.walletaddress);

        }
        console.log('balbalbal---->',bal);
        setNetworkBalance(bal)
    }


    /** validate walletaddress*/
    const addressValidate = async () => {
        try {

            if (amount.length == 0) {
                setAmountErr(true);
            }
            if(Number(amount) > Number(routesdata.balance)){
                return Toastfn("Amount exceeded than the balance")
            }
            if(isEmpty(networkBalance)) return Toastfn("Not enough currency balance")
            if (routesdata.walletaddress == toAddress) {
                return Toastfn("Same Address not Accepted")
            }
            if (toAddress == "") {
                setToaddressErr(true);
            } else {
                if (toAddress != "") {
                    let adressvalidation = await addressValidation(toAddress.trim(" "), routesdata?.currencyName)
                    if (adressvalidation == true) {
                        if ((routesdata?.type != "Token") && (amount == routesdata?.balance)) {
                            return Toastfn("Insufficient Balance")
                        }

                        else if (amount <= 0.00000001) {
                            return Toastfn("Amount is too low")

                        }
                        else {
                            navigation.navigate("ConfirmSend", {
                                amount: amount,
                                walletaddress: toAddress,

                            })
                        }
                        // if (amount > routesdata?.balance == false && !isEmpty(amount)) {
                        //     navigation.navigate("ConfirmSend", {
                        //         amount: amount,
                        //         walletaddress: toAddress,

                        //     });
                        // }
                        // else if (!isEmpty(amount)) {
                        //     Toastfn("Insufficient Balance")
                        // }

                    }
                    else {
                        setToaddressErr(false);
                        Toastfn("Invalid Address")



                    }
                }
            }
        }
        catch (err) {
            console.log("addressValidateerrr", err);
        }
    }
    /** Copy Address*/
    const fetchCopiedText = async () => {
        const text = await Clipboard.getString();
        let covert = text.replace("ethereum:", "");
        setToaddress(covert);
    };
    const Maximumamount = async () => {
        try {
            var currencydata = selectedCurrencyFromRedux

            if (currencydata.tokenType == "TRC20") {
                var Gasprice = await tronEstimateGasFee({
                    toAddress: toAddress,
                    amount: routesdata?.balance > amount ? amount : 0,
                    walletaddress: currencydata.walletaddress,
                    tokenType: currencydata.tokenType,
                    type: currencydata.type,
                    currency: currencydata.symbol,
                    contractAddress: currencydata.contractAddress,
                    privatekey: currencydata.privKey,
                    testnet: currencydata.testnet,

                })
            }
            else if (currencydata.tokenType == "BTC") {

                // var Gasprice = await evmEstimateGasFee({

                //     toAddress: toAddress,
                //     amount: amount,
                //     walletaddress: currencydata.walletaddress,
                //     tokenType: currencydata.tokenType,
                //     type: currencydata.type,
                //     currency: currencydata.symbol,
                //     contractAddress: currencydata.contractAddress,
                //     privatekey: currencydata.privKey


                // })
                // var Gasprice
            }
            else {
                var Gasprice = await evmEstimateGasFee({

                    toAddress: toAddress,
                    amount: amount,
                    walletaddress: currencydata.walletaddress,
                    tokenType: currencydata.tokenType,
                    type: currencydata.type,
                    currency: currencydata.symbol,
                    contractAddress: currencydata.contractAddress,
                    privatekey: currencydata.privKey,
                    currencyName: currencydata.currencyName

                })
            }
            console.log('Gasprice---->', Gasprice);
            if(routesdata?.type != "Token")var maximum_amount = routesdata?.balance - (currencydata.tokenType == "BTC" ? 0.00007 : Gasprice?.gasFee)
            else var maximum_amount = routesdata?.balance;
                // setAmount(JSON.stringify((maximum_amount.toFixed(8))))

            if (maximum_amount < 0) Toastfn("Amount not enough")
            else setAmount((maximum_amount.toFixed(8)))


        }
        catch (err) {
            console.log("GaspriceGasprice_err", err);

        }

    }
    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View onStartShouldSetResponder={() => Keyboard.dismiss()} style={{ flex: 1, backgroundColor: theme.background }}  >
                <Header type={"sendcurrency"} title={`${currentChainconfig[routesdata?.currencyName]?.name} ${routesdata?.type == "Token" ? "- " + routesdata?.currency : ""}`} />
                {/* <Header title={`${routesdata?.tokenType == 'BEP20' ? "Binance" : routesdata?.tokenType == 'ERC20' ? 'Ethereum' : routesdata?.tokenType == 'TRC20' ? "Tron" : "Bitcoin"}`} /> */}
                <View style={style.box_container} >


                    <View style={style.card_container} >
                        <View style={style.inputrow}>

                            <View style={style.inputsec}>
                                <View style={style.leftinput}>
                                    <TextInput
                                        style={style.inputstyle}
                                        onChangeText={(toAddress) => {
                                            setToaddress(toAddress);
                                        }}
                                        value={toAddress}
                                        placeholder="Recipient Address"
                                        placeholderTextColor="#464549"
                                        error={toAddressErr}

                                    />
                                </View>


                                <View style={style.rightinput}>
                                    <TouchableOpacity onPress={() => navigation.navigate("Walletconnectqr", { path: "Sendcurrency", from: "send" })}>
                                        <View style={{ justifyContent: "center", alignItems: "center" }} >
                                            {theme.theme == "dark" ? <Scan2 width={devicewidth * 0.05} height={devicewidth * 0.05} style={style.listlogoimg} /> : <Scan3 width={devicewidth * 0.05} height={devicewidth * 0.05} style={style.listlogoimg} />}

                                        </View>
                                    </TouchableOpacity>

                                </View>

                            </View>

                            {/* <TouchableOpacity onPress={()=>Maximumamount()}> */}

                            <TouchableOpacity onPress={fetchCopiedText}>
                                <View style={style.rightinputsec}>
                                    <Text style={[style.paralite, style.pastelite]}>Paste</Text>



                                </View>
                            </TouchableOpacity>
                            {toAddressErr == true && toAddress.length == 0 && (
                                <Text style={style.invalidPhraseTxt}>Field required</Text>
                            )}
                        </View>
                        <View style={style.inputrow1}>

                            <View style={style.inputsec}>
                                <View style={style.leftinput}>
                                    <TextInput
                                        style={style.inputstyle}
                                        onChangeText={(amount) => {
                                            if (amount.includes(" ")) {
                                                setAmount(
                                                    amount.trim().replace(/[- #*;,<>\{\}\[\]\\\/]/gi, "")
                                                );
                                            } else {
                                                setAmount(amount.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ""));
                                            }
                                        }}
                                        value={amount}
                                        keyboardType="numeric"
                                        placeholder="Amount"
                                        placeholderTextColor="#464549"

                                    />
                                </View>



                                <View style={style.rightinputsec}>
                                    <TouchableOpacity>
                                        <Text style={style.paralite1}>{routesdata?.symbol ? routesdata?.symbol : routesdata?.currencyName}</Text>
                                    </TouchableOpacity>

                                </View>

                            </View>
                            {routesdata?.balance > 0
                                &&
                                <TouchableOpacity onPress={() => Maximumamount()}>
                                    <View style={style.rightinputsec}>
                                        <Text style={[style.paralite, style.pastelite]}>Max</Text>



                                    </View>
                                </TouchableOpacity>}
                        </View>


                        {amountErr == true && amount.length == 0 && (
                            <Text style={style.invalidPhraseTxt}>Field required</Text>
                        )}




                        {selectedCurrencyFromRedux?.tokenType == "BTC"
                            && <View style={style.balancesec}>
                                <Text style={style.inputtitle}>Minimum Send Balance</Text>
                                <Text style={style.para}>0.00006</Text>
                            </View>}
                        <View style={style.balancesec}>
                            <Text style={style.inputtitle}>Available Balance:</Text>
                            <Text style={style.para}>{(routesdata?.balance)?.toFixed(6)} {routesdata?.symbol}</Text>
                        </View>

                        {currency?.type === "Token" && <View style={style.balancesec}>
                            <Text style={style.inputtitle}>Available currency Balance:</Text>
                            <Text style={style.para}>{parseFloat(networkBalance)?.toFixed(6)} {routesdata?.currencyName}</Text>
                        </View>}



                    </View>
                </View>
            </View>



            <View style={{ position: "absolute", left: 0, right: 0, bottom: "6%", alignItems: "center", justifyContent: "center" }}>

                <TouchableOpacity
                    onPress={() => addressValidate()}
                    style={style.create_button} >
                    <Button title={"Confirm"} colors={['rgba(26,198,201,1)', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']} />
                </TouchableOpacity>


            </View>
        </SafeAreaView>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background
        },
        box_container: {
            // height: "90%",
            width: "100%",
            alignItems: 'center',

        },
        card_container: {
            width: "90%",


        },

        para: {
            fontSize: RFPercentage(1.80),
            color: "#307CD1",
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },

        paralite: {
            fontSize: RFPercentage(1.85),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },
        paralite1: {
            fontSize: RFPercentage(1.85),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },
        pastelite: {
            position: "relative",
            fontSize: 16,
            right: 0,
            top: 10,
            right: -10
        },

        create_button: {

            width: "90%",
            alignSelf: "center",
        },



        inputtitle: {
            fontSize: RFPercentage(1.80),
            color: theme.text,
            fontFamily: Fonts.Regular,
        },
        inputsec: {
            backgroundColor: theme.secondarybg,
            borderRadius: 7,
            width: "100%",
            flexDirection: 'row',
            alignItems: 'center',
            height: deviceheight * 0.065,
            marginTop: "3%"

        },
        leftinput: {
            width: "80%",
        },
        rightinput: {
            width: "20%",
            justifyContent: "center",
            alignSelf: "center"
        },
        rightinputsec: {
            flexDirection: "row",
            gap: 6,
            alignItems: "center",
            justifyContent: 'flex-end',
            paddingHorizontal: '5%'
        },
        inputstyle: {
            paddingHorizontal: 10,
            color: theme.text,
            fontSize: RFPercentage(1.85),
            fontFamily: Fonts.Medium,
        },
        inputrow: {
            height: "25%",
            marginBottom: "8%",


        },
        inputrow1: {
            height: "25%",
            // marginBottom: "3%",
        },
        balancesec: {
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            justifyContent: "center",
            marginTop: "5%"
        },
        invalidPhraseTxt: {
            fontFamily: Fonts.Regular,
            fontSize: RFValue(12),
            color: "red",

        },


    })