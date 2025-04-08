/**Copy Packages */
import React, { useContext, useState, useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, BackHandler, Pressable } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import QRCode from 'react-native-qrcode-svg';
import LinearGradient from "react-native-linear-gradient";
import { Card } from 'react-native-shadow-cards';
import { ScrollView } from "react-native-gesture-handler";
import Copyicon from '../../Assets/Icons/copy.svg'
import Shareicon from '../../Assets/Icons/share.svg'
import Clipboard from "@react-native-community/clipboard";
// import Share from "react-native-share";
import Backarrow from '../../Assets/caexicons/backarrow1.svg'
import Backarrow1 from '../../Assets/caexicons/backarrow2.svg'
import Share1 from "../../Assets/caexicons/share1.svg"
import Share2 from "../../Assets/caexicons/share2.svg"
import Copy1 from "../../Assets/caexicons/copy1.svg"
import Copy2 from "../../Assets/caexicons/copy2.svg"
import Sharefun from "react-native-share";


import { useFocusEffect } from "@react-navigation/native";
import { Toastfn } from "../../Utilities/toast";
import { DecryptPrivateKey } from "../../Utilities/commenfuctions";
const isPhone = devicewidth < 600;
export default function Showprivatekey({ navigation, route }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [qrdata, setQrData] = useState("");
    useEffect(() => {
        setQrData(DecryptPrivateKey(route?.params?.privKey,'type'))

    }, [])


    useFocusEffect(
        React.useCallback(() => {

            const onBackPress = () => {
                navigation.push("Walletlisting")
                return true;
            };
            BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );
            return () => {
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
                // getWalletData();


            };
        }, [])
    )

/**Copy Privatekey */
const copyToClipboard = () => {
    Clipboard.setString(qrdata);
Toastfn("Privatekey Successfully Copied")  
};

//share function    
const myCustomShare = async () => {
    const shareOptions = {
        message: qrdata,
        
      
    };
    try {
        const ShareResponse = await Sharefun.open(shareOptions);
    } catch (error) {
        console.error('ShareResponse_error=> ', error);
    }
};



    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={{ flex: 1, backgroundColor: theme.background }}  >

                <View style={{
                    width: "100%",
                    alignItems: "center",
                    marginTop: "5%",

                }} >
                    <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Pressable onPress={() => navigation.push("Walletlisting")}>
                            {theme.theme == "dark" ? <Backarrow width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.0545} /> : <Backarrow1 width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} />}
                        </Pressable>
                        <View>
                            <Text style={{
                                fontFamily: Fonts.Regular,
                                fontSize: RFPercentage(2.5),
                                color: theme.text
                            }}>Private Key</Text>
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
                        <ScrollView showsVerticalScrollIndicator={false} >
                            <View style={style.innercard_container} >
                                <View style={style.qrsec}>
                                    <QRCode
                                        value={qrdata?qrdata:"qrcode"}
                                        size={devicewidth * 0.38}
                                        color={theme.theme == "dark" ? "#ffffff" : "#000"}
                                        backgroundColor={theme.theme == "dark" ? "#010101" : "#fff"}

                                    />
                                </View>
                                {/* <Text style={style.paragray}>{qrdata}</Text> */}
                            </View>
                  

                            <View style={{ width: "100%",  backgroundColor: theme.secondarybg, borderRadius: borderradius * 0.6, flexDirection: "row", padding: "2.5%", alignItems: "center", justifyContent: "space-between",marginBottom:"20%", }}>
                                <View style={{ width: "80%", }}>
                                    <Text style={{
                                        fontSize: RFPercentage(1.55),
                                        color: "#7E7E89",
                                        fontFamily: Fonts.Regular,
                                        marginBottom: "5%"

                                    }}>Your privateKey</Text>
                                    <Text style={{
                                        fontSize: RFPercentage(1.55),
                                        color: theme.text,
                                        fontFamily: Fonts.Regular,
                                    }}>{qrdata}</Text>
                                </View>
                                <Pressable onPress={copyToClipboard}>
                                    {theme.theme == "dark" ? <Copy1 width={devicewidth * 0.05} height={devicewidth * 0.05} /> : <Copy2 width={devicewidth * 0.05} height={devicewidth * 0.05} />}
                                </Pressable>

                            </View>
                   



                        </ScrollView >


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
            // height: "90%",
            width: "100%",
            flex: 0.9,
            // paddingHorizontal: "3%",
            justifyContent: "center",
            //  borderWidth:1,
            alignItems: 'center',
            
        },
        card_container: {
            width: "80%",
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
            // height: "60%",
           

            // justifyContent: "center",
            // alignItems: 'center'

        },
        innercard_container: {
        //     width: "100%",
        //     marginTop: "0%",
        //    backgroundColor: theme.secondarybg,
        //     alignSelf: "center",
        //     borderRadius: borderradius * 2,
        //     paddingVertical: "10%",
        //     paddingHorizontal: "10%",
        //     paddingVertical:"7%",
        //     height: "53%",
        //     shadowOpacity: 0,
        //     shadowColor: 'transparent',
        //     justifyContent: "center",
        //     alignItems: 'center',
            marginBottom: "5%",
            backgroundColor: theme.secondarybg,
            borderRadius: borderradius * 1,
            height: "70%",
            justifyContent: "center",
            alignItems: 'center',
            width:"100%"



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
            color: "grey",
            fontFamily: Fonts.Medium,
            textAlign: 'center',
            lineHeight: 15

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
            color: "#010101",
            fontFamily: Fonts.Medium,
            textAlign: "center"

        },
        gradTitle1: {
            fontSize: RFPercentage(2.55),
            color: "#010101",
            fontFamily: Fonts.Medium,
            textAlign: "center"

        },
        qrsec: {
            // marginVertical: "7%"
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