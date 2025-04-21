import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Pressable } from "react-native";
import { borderradius, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import QRCode from 'react-native-qrcode-svg';
import Clipboard from "@react-native-community/clipboard";
import { Toastfn } from "../../Utilities/toast";
import Sharefun from "react-native-share";
import Copy1 from "../../Assets/caexicons/copy1.svg"
import Copy2 from "../../Assets/caexicons/copy2.svg"
import Backarrow from '../../Assets/caexicons/backarrow1.svg'
import Backarrow1 from '../../Assets/caexicons/backarrow2.svg'
import Share1 from "../../Assets/caexicons/share1.svg"
import Share2 from "../../Assets/caexicons/share2.svg"

const isPhone = devicewidth < 600;
export default function Receivecurrency({ navigation, route }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    var routedata = route.params.data

    const [receivedata, setReceiveData] = useState("")


useEffect(()=>{
    setReceiveData(routedata)
},[])
//Copy wallet address
    const CopyAddress = () => {
        Toastfn("Address Copied")
        Clipboard.setString(receivedata.walletaddress);
    };

//share function    
    const myCustomShare = async () => {
        const shareOptions = {
            message: receivedata.walletaddress,
        };
        try {
            const ShareResponse = await Sharefun.open(shareOptions);
        } catch (error) {
            console.error('myCustomShareError => ', error);
        }
    };


    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={{ flex: 1, backgroundColor: theme.background,width:"100%",height:"100%"}}  >
                <View style={{
                 width: "100%",
                    alignItems: "center",
                    height:"12%",
                  
                
            
                  
                }} >
                    <View style={{ width: "95%", flexDirection: "row", justifyContent: "space-between", alignItems: "center",height:"100%",  }}>
                        <Pressable style={{width:"15%",padding:"2%",}} onPress={() => navigation.goBack()}>
                            {theme.theme == "dark" ? <Backarrow width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} /> : <Backarrow1 width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} />}
                        </Pressable>
                        <View>
                            <Text style={{
                                fontFamily: Fonts.Regular,
                                fontSize: RFPercentage(2.5),
                                color: theme.text
                            }}>Wallet Receive</Text>
                        </View>
                        <Pressable onPress={() => {
                            myCustomShare();
                        }}>
                            {theme.theme == "dark" ? <Share1 width={isPhone ? devicewidth * 0.10 : devicewidth * 0.025} height={devicewidth * 0.0545} /> : <Share2 width={isPhone ? devicewidth * 0.10 : devicewidth * 0.025} height={devicewidth * 0.045} />}
                        </Pressable>
                    </View>


                </View>

                <View style={style.box_container} >
                    <View style={style.card_container}  >

                        <View style={style.innercard_container} >
                            <View style={style.qrsec}>
                                <QRCode
                                    value={receivedata?.walletaddress}
                                    size={devicewidth * 0.38}
                                    color={theme.theme == "dark" ? "#ffffff" : "#000"}
                                    backgroundColor={theme.theme == "dark" ? "#010101" : "#fff"}

                                />
                            </View>

                        </View>

                        <View style={{ width: "100%", marginTop: "10%", backgroundColor: theme.secondarybg, borderRadius: borderradius * 0.6, flexDirection: "row", padding: "5%", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={{ width: "80%", }}>
                                <Text style={{
                                    fontSize: RFPercentage(1.55),
                                    color: "#7E7E89",
                                    fontFamily: Fonts.Regular,
                                    marginBottom: "5%"

                                }}>Your address</Text>
                                <Text style={{
                                    fontSize: RFPercentage(1.55),
                                    color: theme.text,
                                    fontFamily: Fonts.Regular,
                                }}>{receivedata.walletaddress}</Text>
                            </View>
                            <Pressable onPress={CopyAddress}>
                                {theme.theme == "dark" ? <Copy1 width={devicewidth * 0.05} height={devicewidth * 0.05} /> : <Copy2 width={devicewidth * 0.05} height={devicewidth * 0.05} />}
                            </Pressable>

                        </View>
                    </View>

                </View>




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
            height:"88%",
            justifyContent: "center",
            alignItems: 'center',
            // backgroundColor:"red"


        },
        card_container: {
            width:"65%"
            // marginTop: "0%",
            // alignSelf: "center",
            // borderRadius: borderradius * 1,
            // paddingVertical: "7%",
            // paddingHorizontal: "5%",
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 1,
            // shadowRadius: 4,
            // elevation: 5,
            // height: "90%",
            // justifyContent: "center",
            // alignItems: 'center'

        },
        innercard_container: {
            backgroundColor: theme.secondarybg,
            borderRadius: borderradius * 1,
            height: "55%",
            justifyContent: "center",
            alignItems: 'center',



        },

        para: {
            fontSize: RFPercentage(1.55),
            color: "#010101",
            fontFamily: Fonts.Medium,
            textAlign: 'center',
        },
        parabtn: {
            fontSize: RFPercentage(2.25),
            color: "#010101",
            fontFamily: Fonts.Medium,
            textAlign: 'center',
            marginTop: "7%"
        },
        paragray: {
            fontSize: RFPercentage(1.55),
            color: "#ffffff",
            fontFamily: Fonts.Medium,
            textAlign: 'center',
            lineHeight: 15,
            paddingBottom: "7%"

        },

        paralite: {
            fontSize: RFPercentage(1.85),
            color: "#37607F",
            fontFamily: Fonts.Medium,
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
        qrsec: {
            // paddingVertical: "7%"

        },
        contsec: {
            paddingVertical: "5%"
        },
        btnsec: {
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: '8%'
        },
        btnstyle: {
            backgroundColor: "#010101",
            borderRadius: 50,

            width: devicewidth * 0.15,
            height: devicewidth * 0.15,
            alignItems: 'center',
            justifyContent: 'center'


        }



    })