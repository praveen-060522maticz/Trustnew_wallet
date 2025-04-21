//packages
import React, { useContext, useEffect, useState } from "react";
import {  Alert, Pressable,SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import { Card } from 'react-native-shadow-cards';
import { ScrollView } from "react-native-gesture-handler";
import Sendicon from '../../Assets/Icons/sendarrow.svg'
import Sendicon1 from "../../Assets/Icons/sendarrow1.svg"
import Receiveicon from '../../Assets/Icons/recievearrow.svg';
import { evmTransactionHistory } from "../../Network_controllers/EVM/Evm_contracthook";
import { addressshowing, showImage } from "../../Utilities/commenfuctions";
import { bnb_api_url_history, btc_api_url_history, currentChainconfig, eth_api_url_history, tron_api_url_history } from "../../api/ApiConstants";
import { ActivityIndicator } from "react-native-paper";
import { useSelector } from "react-redux";
import { tronTransactionHistory } from "../../Network_controllers/TRON/Tron_Contract";
import { C } from "../../Utilities/colors";
import Receiveicon1 from '../../Assets/Icons/recievearrow1.svg';
import { btcGetTransactions, btcTransactionHistory } from "../../Network_controllers/BTC/Bitcoin_controller";

import IconMat from 'react-native-vector-icons/MaterialCommunityIcons';

import { GetCurrentIndex, SetWallets, UseWalletArray } from "../../Utilities/usestorage";

import { Toastfn } from "../../Utilities/toast";

export default function Tokentranscation({ navigation, route }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [loader, setloader] = useState(true);
    const [historylist, setHistorylist] = useState([])

    //redux
    const selectedCurrencyFromRedux = useSelector(
        (state) => state.defaultcurrencies.selectedCurrency
    )


    useEffect(() => {
        Gettransactiondata()
    }, [])

    /** To Get Transaction data*/
    const Gettransactiondata = async () => {
        try {
            if (selectedCurrencyFromRedux.tokenType == "TRC20") {
                var TransactionDetails = await tronTransactionHistory(selectedCurrencyFromRedux);

            }
            else if (selectedCurrencyFromRedux.tokenType == "BTC") {
                // var TransactionDetails = await btcTransactionHistory(selectedCurrencyFromRedux.walletaddress);
                var TransactionDetails = await btcGetTransactions(selectedCurrencyFromRedux.walletaddress);
                console.log('TransactionDetails---->',TransactionDetails);
            }
            else {
                var TransactionDetails = await evmTransactionHistory(selectedCurrencyFromRedux);

            }

            setHistorylist(TransactionDetails)
            setloader(false)

        } catch (err) {
            console.log(err, "Gettransactiondataerrr");
        }
    };
    /** For History webview*/
    const Historywebview = async (data) => {
        let networkUrl = currentChainconfig[selectedCurrencyFromRedux?.currency]?.tx_web_url

        let url = networkUrl + data
        navigation.navigate('Tokentranscationsweb', { url: url })
    }

    const Deletefunction = () => {



        let walletarray = UseWalletArray();

        let currenteindex = GetCurrentIndex();

        let data = walletarray[currenteindex]

        let findInd = data[0]?.tokens?.findIndex(val => val?.address === selectedCurrencyFromRedux?.contractAddress);

        let deleteData = data[0]?.tokens.splice(findInd, 1)



        walletarray[currenteindex] = data

        SetWallets(walletarray);



        Toastfn("Token deleted successfully.");

        navigation.goBack();

    }



    const handleDeletePress = async () => {

        try {



            Alert.alert(

                'Confirm Delete',

                'Are you sure you want to delete this token?',

                [

                    {

                        text: 'Cancel',

                        onPress: () => console.log('Cancel Pressed'),

                        style: 'cancel',

                    },

                    { text: 'OK', onPress: () => Deletefunction() },

                ],

                { cancelable: false }

            );



        } catch (e) {

            console.log('Erroro on handleDeletePress---->', e);

        }



    }

    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={{ flex: 1, backgroundColor: theme.background }} >
                <Header title={`${selectedCurrencyFromRedux.tokenType == 'ERC20' ? "Ethereum" : selectedCurrencyFromRedux.tokenType == 'BEP20' ? " Binance" : selectedCurrencyFromRedux.tokenType == 'TRC20' ? "Tron" : "Bitcoin"}`} />

                <View style={style.box_container} >



                    <Card style={style.card_container}  >
{!selectedCurrencyFromRedux?.defaulttoken &&

                            <View style={{ position: "absolute", right: 10, top: 10 }} >

                                <Pressable onPress={() => handleDeletePress()} >

                                    <IconMat name="delete" size={RFPercentage(3.5)} color={theme.theme == "dark" ? "#fff" : "#00001C"} />

                                </Pressable>

                            </View>}
                        <View style={style.contsec}>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center" }}>

                                {showImage(selectedCurrencyFromRedux.tokenType, 0.13, 0.04)}
                            </View>
                            <Text style={style.parablue}>{selectedCurrencyFromRedux.balance} {selectedCurrencyFromRedux?.symbol ? selectedCurrencyFromRedux?.symbol : selectedCurrencyFromRedux?.currencyName}</Text>

                        </View>
                        <View style={style.btnsec}>
                            <View>
                                <TouchableOpacity onPress={() => navigation.navigate('Sendcurrency', { datas: selectedCurrencyFromRedux })} >
                                    <View style={style.btnstyle}>
                                        {theme.theme == "dark" ? <Sendicon1 width={devicewidth * 0.07} height={devicewidth * 0.07} /> : <Sendicon width={devicewidth * 0.07} height={devicewidth * 0.07} />}

                                    </View>
                                    <Text style={style.parabtn}>Send</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => navigation.navigate('Receivecurrency', { data: selectedCurrencyFromRedux })} >
                                    <View style={style.btnstyle}>
                                        {theme.theme == "dark" ?
                                            <Receiveicon1 width={devicewidth * 0.06} height={devicewidth * 0.06} /> :
                                            <Receiveicon width={devicewidth * 0.06} height={devicewidth * 0.06} />}
                                    </View>
                                    <Text style={style.parabtn}>Receive</Text>
                                </TouchableOpacity>
                            </View>




                        </View>


                        {loader ?
                            <Card style={style.innercard_container} >
                                <View style={{ flex: 1, justifyContent: "center", backgroundColor: theme.background, borderRadius: borderradius * 1, marginTop: "5%" }} >
                                    <ActivityIndicator color={theme.theme == "dark" ? "#fff" : "#00001C"} size={"small"} />
                                </View>
                            </Card>
                            : <Card style={style.innercard_container} >
                                <ScrollView showsVerticalScrollIndicator={false} >

                                    {historylist?.length > 0 ?
                                        historylist?.map((item, index) =>
                                            <TouchableOpacity
                                                onPress={() => Historywebview(item.txid)}
                                                style={{ marginBottom: "2%", backgroundColor: theme.theme == "dark" ? theme.secondarybg : "#d9d9d961", borderRadius: 10 }}
                                            >
                                                <View style={style.historysec}>

                                                    {item?.confirmations == 0 ?
                                                        <View style={style.historyrow}>
                                                            {theme.theme == "dark" ?
                                                                <Receiveicon width={devicewidth * 0.05} height={devicewidth * 0.05} /> : <Receiveicon1 width={devicewidth * 0.05} height={devicewidth * 0.05} />}
                                                            <Text style={style.parahead}>{'Pending'}</Text>
                                                        </View>
                                                        :
                                                        <>
                                                            {item?.toaddress?.toUpperCase() ==
                                                                selectedCurrencyFromRedux?.walletaddress?.toUpperCase() ?
                                                                <View style={style.historyrow}>
                                                                    {theme.theme == "dark" ?
                                                                        <Receiveicon width={devicewidth * 0.05} height={devicewidth * 0.05} /> : <Receiveicon1 width={devicewidth * 0.05} height={devicewidth * 0.05} />}
                                                                    <Text style={style.parahead}>{'Received'}</Text>
                                                                </View>
                                                                :
                                                                <View style={style.historyrow}>
                                                                    {theme.theme == "dark" ? <Sendicon width={devicewidth * 0.05} height={devicewidth * 0.05} /> : <Sendicon1 width={devicewidth * 0.05} height={devicewidth * 0.05} />}
                                                                    <Text style={style.parahead}>{'Send'}</Text>
                                                                </View>
                                                            }
                                                        </>
                                                    }
                                                    <View style={style.historyrow1}>
                                                        <Text style={style.para1}>Amount :</Text>
                                                        <Text style={style.paragray1}>{(item.amount)?.toFixed(6)}</Text>
                                                    </View>
                                                    <View style={style.historyrow1}>
                                                        <Text style={style.para1}>To : </Text>
                                                        <Text style={style.paragray1}>{addressshowing(item?.toaddress)}</Text>
                                                    </View>
                                                    <View style={style.historyrow1}>
                                                        <Text style={style.para1}>Tx : </Text>
                                                        <Text style={style.paragray1}> {item.txid?.substring(1, 10)}...
                                                            {item.txid?.substring(20, 30)}</Text>
                                                    </View>
                                                    {/* <View style={style.historyrow1}>
                                                        <Text style={style.paragray1}>


                                                        </Text>
                                                    </View> */}
                                                </View>
                                            </TouchableOpacity>
                                        )
                                        :
                                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: "35%" }}>
                                            <Text style={style.paraempty}>No Data Found !</Text>
                                        </View>

                                    }

                                </ScrollView>

                            </Card>}





                    </Card>
                </View>
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
            // height: "60%",

            paddingHorizontal: "3%",
            justifyContent: "center",
            alignItems: 'center',

        },
        card_container: {
            width: "92.5%",
            marginTop: "4%",
            backgroundColor: theme.secondarybg,
            alignSelf: "center",
            borderRadius: borderradius * 1,
            // paddingVertical: "7%",
            // paddingHorizontal: "5%",
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 1,
            // shadowRadius: 4,
            // elevation: 5,
            height: "85%",
             position: "relative"
            // borderWidth:1
            // justifyContent: "center",
            // alignItems: 'center'

        },
        historysec:{
            padding:"2%",
            paddingVertical:"4%"
        },
        para: {
            fontSize: RFPercentage(1.85),
            color: "#ffffff",
            fontFamily: Fonts.Regular,
            textAlign: 'center',
        },
        parahead: {
            fontSize: RFPercentage(2.10),
            color: C.primary,
            fontFamily: Fonts.Regular,
            textAlign: 'left',
        },
        para1: {
            fontSize: RFPercentage(1.95),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'left',
        },
        parabtn: {
            fontSize: RFPercentage(2.05),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'center',
            marginTop: "25%"
        },
        paragray: {
            fontSize: RFPercentage(1.55),
            color: "#8C9BAA",
            fontFamily: Fonts.Regular,
            textAlign: 'center',
            lineHeight: 15

        },
        paragray1: {
            fontSize: RFPercentage(1.95),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'left',

        },

        paralite: {
            fontSize: RFPercentage(1.85),
            color: "#37607F",
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },
        parablue: {
            fontSize: RFPercentage(2.35),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },

        create_button: {
            marginTop: "5%",
            width: "100%",
            alignSelf: "center"
        },

        contentsec: {
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: "7%"
        },
        gradTitle: {
            fontSize: RFPercentage(2.85),
            color: "#ffffff",
            fontFamily: Fonts.Regular,
            textAlign: "center"

        },
        gradTitle1: {
            fontSize: RFPercentage(2.55),
            color: "#ffffff",
            fontFamily: Fonts.Regular,
            textAlign: "center"

        },
        contsec: {
            paddingVertical: "3%",
            alignSelf: "center",
            justifyContent: "center",
            flexDirection: "column",
        },
        btnsec: {
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: '5%'
        },
        btnstyle: {
            backgroundColor: theme.theme == "dark" ? "#F0F1F8" : "#0A090D",
            borderRadius: 50,
            width: devicewidth * 0.13,
            height: devicewidth * 0.13,
            alignItems: 'center',
            justifyContent: 'center'


        },
        notesec: {
            alignSelf: 'center',
            paddingVertical: '10%',
            alignItems: 'center'
        },
        noteimg: {
            marginBottom: "5%"
        },
        innercard_container: {

            width: "90%",
            // marginTop: "0%",
            backgroundColor: theme.background,
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "5%",
            paddingHorizontal: "5%",
            height: "60%",
            shadowOpacity: 0,
            shadowColor: 'transparent',
            justifyContent: "center",
            // alignItems: 'center',
            marginTop: "5%"


        },
        historyrow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10
        },
        historyrow1: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingLeft: 20,
            // marginBottom: "1%",
            marginTop: "2%"

        },
        paraempty: {
            fontSize: RFPercentage(2.15),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: "center",
            // marginTop: "4%"
        },




    })