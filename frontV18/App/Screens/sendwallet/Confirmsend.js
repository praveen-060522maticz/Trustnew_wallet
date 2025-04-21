import React, { useCallback, useContext, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import Header from "../../Navigations/Header";
import { ScrollView } from "react-native-gesture-handler";
import { borderradius } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import Button from "../../Components/Button";
import { Divider } from "react-native-elements";
import {  GetNotifiactionstatus } from "../../Utilities/usestorage";
import {  addressshowing } from "../../Utilities/commenfuctions";
import { SendEVM, evmEstimateGasFee } from "../../Network_controllers/EVM/Evm_contracthook";
import { Toastfn } from "../../Utilities/toast";
import { localnotification } from "../../Utilities/pushnotification";
import { sendTRX, tronEstimateGasFee } from "../../Network_controllers/TRON/Tron_Contract";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../../Components/loader";
import { sendBTC } from "../../Network_controllers/BTC/Bitcoin_controller";
import { useSelector } from "react-redux";
import { Receive_Notification } from "../../Utilities/axios";

export default function Confirmsend({ navigation, route }) {
    const theme = useContext(themeContext);
    const style = styles(theme);



    const [Availablebalance, setAvailablebalance] = useState('');
    const [Availablecoin, setAvailablecoin] = useState('');
    const [currentaddress, setcurrentaddress] = useState('');
    const [currentWallet, setcurrentWallet] = useState('');
    const [tokentype, settokentype] = useState('');
    const [loading, setLoading] = useState(false);
    const [Gasamount, setGasamount] = useState(0);
    const [Coinname, setCoinname] = useState("");



    var amount = route.params.amount
    var toaddress = route.params.walletaddress
    const selectedCurrencyFromRedux = useSelector(
        (state) => state.defaultcurrencies.selectedCurrency
    )
    const notificationstataus = GetNotifiactionstatus()

    useFocusEffect(
        useCallback(() => {
            setcurrentWallet(selectedCurrencyFromRedux)
            setAvailablebalance(selectedCurrencyFromRedux?.balance)
            setAvailablecoin(selectedCurrencyFromRedux?.currency)
            setcurrentaddress(selectedCurrencyFromRedux.walletaddress)
            settokentype(selectedCurrencyFromRedux.tokenType)




        }, [])
    )


    useFocusEffect(
        useCallback(() => {
            Getgasfees()
        })
    )
    //Get Estimation gasfee
    const Getgasfees = async () => {
        if (selectedCurrencyFromRedux.tokenType == "TRC20") {
            var Gasprice = await tronEstimateGasFee({
                toAddress: toaddress,
                amount: amount,
                walletaddress: selectedCurrencyFromRedux.walletaddress,
                tokenType: selectedCurrencyFromRedux.tokenType,
                type: selectedCurrencyFromRedux.type,
                currency: selectedCurrencyFromRedux.symbol,
                contractAddress: selectedCurrencyFromRedux.contractAddress,
                privatekey: selectedCurrencyFromRedux.privKey,

            })
        }
        else {
            var Gasprice = await evmEstimateGasFee({

                toAddress: toaddress,
                amount: amount,
                walletaddress: selectedCurrencyFromRedux.walletaddress,
                tokenType: selectedCurrencyFromRedux.tokenType,
                type: selectedCurrencyFromRedux.type,
                currency: selectedCurrencyFromRedux?.symbol ? selectedCurrencyFromRedux?.symbol : selectedCurrencyFromRedux?.currency,
                contractAddress: selectedCurrencyFromRedux.contractAddress,
                privatekey: selectedCurrencyFromRedux.privKey,
                currencyName: selectedCurrencyFromRedux.currencyName


            })
        }
        setGasamount(selectedCurrencyFromRedux?.tokenType == "BTC" ? 0.00007 : Gasprice.gasFee)
        setCoinname(selectedCurrencyFromRedux.testnet.includes("TRX") ? 'TRX' : selectedCurrencyFromRedux.testnet)

    }

    /** send currencies and tokens function*/
    const Confirmsend = async () => {

        try {
            setLoading(true)
            if (tokentype == 'TRC20') {
                var Transactions = await sendTRX(selectedCurrencyFromRedux, toaddress, amount, Gasamount)
            }
            else if (tokentype == 'BTC') {
                var Transactions = await sendBTC(selectedCurrencyFromRedux, toaddress, amount, Gasamount)

            }
            else {
                var Transactions = await SendEVM(currentWallet.type, currentWallet?.contractAddress, currentWallet.privKey, toaddress, currentWallet.currencyName, amount, currentWallet.decimal, Gasamount)
                console.log('Transactions---->',Transactions);
          
            }



            setLoading(false)
            if (Transactions?.status == true) {


                // if (notificationstataus) {
                //     let SendData = {
                //         Type: tokentype,
                //         Senderaddress: selectedCurrencyFromRedux?.walletaddress,
                //         Receiveraddress: toaddress,
                //         Amount: amount,
                //         Symbol: selectedCurrencyFromRedux?.symbol ? selectedCurrencyFromRedux?.symbol : selectedCurrencyFromRedux?.currencyName

                //     }
                //     let Resp = await Receive_Notification(SendData)
                // }


                if (tokentype == 'BTC') {
                    if (notificationstataus) {


                        localnotification(
                            { title: `Send${Availablecoin}`, message: "Transfer has been pending" }

                        )
                    }

                    Toastfn('Transfer has been pending')
                    navigation.push('PendingProcess')


                }
                else {

                    if (notificationstataus) {
                        localnotification(
                            { title: `Send${Availablecoin}`, message: "Transfer successfully" }

                        )
                    }

                    Toastfn('Transfer successfully')
                    navigation.navigate('SendSuccess')

                }




            }
            else {
                if (notificationstataus) {
                    localnotification(
                        { title: `Send${Availablecoin}`, message: Transactions?.message ? Transactions?.message : "Transfer Failed" }

                    )
                }


                setLoading(false)
                Toastfn(Transactions?.message ? Transactions.message : "Transfer Failed")
            }

        }
        catch (err) {
            console.log("Confirmsend_err", err);
        }
    }
    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={{ flex: 1, backgroundColor: theme.background }}  >
                <Header title={"Transfer"} />

                <View style={style.box_container} >


                    <View style={style.card_container}  >
                        <ScrollView showsVerticalScrollIndicator={false} >
                            <View >
                                <View style={style.detailview}>
                                    <Text style={style.paraname}>Total Balance</Text>
                                    <Text style={style.parawhite}>{Availablebalance} {Availablecoin}</Text>
                                </View>
                                <View style={style.detailview}>
                                    <Text style={style.paraname}>Amount to be Send:</Text>
                                    <Text style={style.parawhite}>{Number(amount).toFixed(7)} {Availablecoin}</Text>
                                </View>
                            </View>

                            <View style={style.innercard}>

                                <View style={style.textsec}>
                                    <Text style={style.para}>Assest:</Text>

                                    {
                                        Availablecoin == 'BNB' ? <Text style={style.paralite}>Smart Chain BNB</Text>
                                            :
                                            Availablecoin == 'ETH' ? <Text style={style.paralite}>Ethereum</Text>
                                                :
                                                <Text style={style.paralite}>{Availablecoin}</Text>
                                    }

                                </View>
                                <Divider color="#3A4566" />
                                <View style={style.textsec}>
                                    <View style={style.infosec}>
                                        <Text style={style.para}>From:</Text>
                                    </View>
                                    <Text style={style.paralite}>{addressshowing(currentaddress)}</Text>
                                </View>
                                <Divider color="#3A4566" />
                                <View style={style.textsec}>
                                    <View style={style.infosec}>
                                        <Text style={style.para}>To:</Text>
                                    </View>
                                    <Text style={style.paralite}>{addressshowing(toaddress)}</Text>
                                </View>
                                <Divider color="#3A4566" />
                                <View style={style.textsec}>
                                    <View style={style.infosec}>
                                        <Text style={style.para}> Estimate Gas fee:</Text>
                                    </View>
                                    <Text style={style.paralite}>{Gasamount} {Coinname}</Text>
                                </View>

                            </View>

                        </ScrollView>

                    </View>
                </View>
            </View>



            <View style={{ position: "absolute", left: 0, right: 0, bottom: "6%", alignItems: "center", justifyContent: "center" }}>
                {!loading ?
                    <View style={style.bottombtnsec}>
                        <TouchableOpacity
                            onPress={() => Confirmsend()}
                            style={style.create_button} >
                            <Button title={"Transfer"} colors={['rgba(26,198,201,1)', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']} />
                        </TouchableOpacity>
                    </View>
                    :


                    <View style={{ width: "90%", alignSelf: "center" }}>
                        <Loader />
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1
        },
        box_container: {

            width: "100%",
            alignItems: 'center',
        },
        card_container: {
            width: "92.5%",
        },
        innercard: {
            backgroundColor: theme.secondarybg,
            borderRadius: borderradius * 0.5,
            marginTop: "10%",

        },
        detailview: {
            alignItems: 'center',
            paddingVertical: "5%"

        },
        textsec: {
            paddingHorizontal: "2%",
            paddingVertical: "5%",
            flexDirection: "row",
            justifyContent: "space-between"

        },


        para: {
            fontSize: RFPercentage(1.65),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'left',
        },
        paraname: {
            fontSize: RFPercentage(2.05),
            color: "#307CD1",
            fontFamily: Fonts.Regular,
        },
        parawhite: {
            fontSize: RFPercentage(2.15),
            color: theme.text,
            fontFamily: Fonts.Regular,

        },
        parablue: {
            fontSize: RFPercentage(2.05),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            textAlign: 'left'
        },

        paralite: {
            fontSize: RFPercentage(1.55),
            color: "grey",
            fontFamily: Fonts.Regular,
            textAlign: 'left'
        },
        paragrey: {
            fontSize: RFPercentage(1.65),
            color: "#8C9BAA",
            fontFamily: Fonts.Regular,
            textAlign: 'left',
        },
        parablue: {
            fontSize: RFPercentage(1.95),
            color: "#0091FF",
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },

        create_button: {

            width: "90%",
            alignSelf: "center"
        },

        contentsec: {
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: "7%"
        },
        gradTitle: {
            fontSize: RFPercentage(2.85),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            textAlign: "center"

        },
        gradTitle1: {
            fontSize: RFPercentage(2.55),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            textAlign: "center"

        },
        inputtitle: {
            fontSize: RFPercentage(1.65),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
        },




        bottombtnsec: {
            width: "100%",
            alignItems: "center"
        },
        swapbtn: {
            borderRadius: 50,
            width: 35,
            height: 35,
            alignItems: 'center',
            justifyContent: 'center'
        },
        swapsec: {
            alignSelf: 'center',
            marginVertical: "7%"

        },
        infosec: {
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center'
        }


    })