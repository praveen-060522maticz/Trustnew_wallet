/**packages */
import React, { useContext, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, BackHandler, Image } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import { Card } from 'react-native-shadow-cards';
import { ScrollView, State } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import Tron from "../../Assets/caexicons/tron.svg"
import Eth1 from "../../Assets/caexicons/eth1.svg"
import Bnc1 from "../../Assets/caexicons/bnc1.svg"
import Btc from "../../Assets/caexicons/btc.svg"
import TrustNe from '../../Assets/Images/icon_ios1024.png'
import Multipic from "../../Assets/Images/Group 2970.svg"
import { currentChainconfig, primarycurrency } from "../../api/ApiConstants";

export default function Walletimport({ navigation }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    /** CURRENCY LIST */
    const coinlist = ([
        {
            logoimg: <Bnc1 width={devicewidth * 0.13} height={deviceheight * 0.04} />,
            name: "Binance",
            currency: "BNB"

        },

        {
            logoimg: <Eth1 width={devicewidth * 0.13} height={deviceheight * 0.04} />,
            name: "Ethereum",
            currency: "ETH"


        },
        {
            logoimg: <Tron width={devicewidth * 0.13} height={deviceheight * 0.04} />,
            name: "Tron",
            currency: "TRX"


        },
        {
            logoimg: <Btc width={devicewidth * 0.13} height={deviceheight * 0.04} />,
            name: "Bitcoin",
            currency: "BTC"


        },


    ])

console.log('primarycurrency---->',primarycurrency);
    useFocusEffect(

        React.useCallback(() => {

            const onBackPress = () => {
                navigation.navigate("Createwallet")
                return true;
            };
            BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );
            return () => {



                BackHandler.removeEventListener("hardwareBackPress", onBackPress);



            };
        }, [])
    );
    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <>
                <View style={{ flex: 1, backgroundColor: theme.background }} >
                    <Header title={"Import Wallet"} />

                    <View style={style.box_container} >


                        <Card style={style.card_container} >
                            <ScrollView showsVerticalScrollIndicator={false} >
                                <TouchableOpacity
                                    Importcoin
                                    // onPress={() => navigation.push('Importcoin')}>

                                    onPress={() => navigation.push('Importmulti')}>
                                    <View style={style.coinlistsec}>
                                        <View style={[style.logoname, { gap: 17 }]}>
                                            <View >
                                                <Image source={TrustNe} style={{ height: deviceheight * 0.04, width: devicewidth * 0.08, marginLeft: 9 }} />
                                                {/* <Multipic width={devicewidth * 0.13} height={deviceheight * 0.04} style={{borderRadius:100}} /> */}
                                            </View>
                                            <Text style={style.para}>Multi-Coin Wallet</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={{}}>
                                    {Object.values(currentChainconfig)?.map((item, index) =>

                                        <TouchableOpacity
                                            onPress={() => navigation.push('Importcoin', {
                                                network: item.name, currency: item.currency

                                            })}>
                                            <View style={style.coinlistsec}>
                                                <View style={style.logoname}>
                                                    <View>
                                                        {item?.icon}
                                                    </View>
                                                    <Text style={style.para}>{item?.name}</Text>
                                                </View>

                                            </View>
                                        </TouchableOpacity>
                                    )
                                    }
                                </View>



                            </ScrollView>
                        </Card>
                    </View>
                </View>
            </>


        </SafeAreaView>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            // backgroundColor:"#FFCE05"
        },
        box_container: {
            // height: "85%",
            paddingHorizontal: "3%",
            justifyContent: "center",
            alignItems: 'center',
        },
        card_container: {
            width: "92.5%",
            marginTop: "12%",
            backgroundColor: theme.theme == "dark" ? "#26263D" : theme.secondarybg,
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "4%",
            paddingHorizontal: "4%",
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 1,
            // shadowRadius: 4,
            // elevation: 5,
            // height: "88%",
            // justifyContent: "center",
            // alignItems: 'center'

        },

        para: {
            fontSize: RFPercentage(2.15),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },
        parablue: {
            fontSize: RFPercentage(1.95),
            color: "#0091FF",
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },

        create_button: {
            marginTop: "5%",
            width: "92.5%",
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
            fontFamily: Fonts.Medium,
            textAlign: "center"

        },
        gradTitle1: {
            fontSize: RFPercentage(2.55),
            color: "#9ACFFF",
            fontFamily: Fonts.Medium,
            textAlign: "center"

        },
        imgsec: {
            marginTop: "35%",
            marginBottom: "3%"
        },
        Signinsec: {
            marginTop: "5%"
        },
        inputsec: {
            marginTop: '5%',
            height: deviceheight * 0.055,
            backgroundColor: "transparent"
        },
        searchinput: {
            fontSize: RFPercentage(2.25),
            padding: 7,
            alignSelf: "center",
            color: "#2DA5FF"
        },
        containersearchinput: {
            width: "100%",
            alignSelf: "center",
            borderWidth: 1.2,
            borderColor: "#2DA5FF",
            borderRadius: 7,
            height: deviceheight * 0.055,

        },
        logoname: {
            flexDirection: "row",
            gap: 8,
            alignItems: 'center'
        },
        coinlistsec: {
            flexDirection: "row",
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: "2.5%"
        },



    })