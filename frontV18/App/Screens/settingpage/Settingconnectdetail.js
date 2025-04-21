import React, { useContext, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";

import LinearGradient from "react-native-linear-gradient";
import { Card } from 'react-native-shadow-cards';
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../Components/Button";

import Pancakeswap from '../../Assets/Icons/pancakeswap.svg'
export default function Settingconnectdetail({ navigation }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    useFocusEffect(useCallback(()=>{
        var data =   getcurrensession_WC2()
        setAll_data(data)
        dispatch({
          type: "Session",
          data: {
            All_Session: data
          },
        });
        setTimeout(() => {
          setLoading(false)
        }, 2000);
    },[props?.route?.params?.from]))

    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={"#3D4A6C"} />
            <LinearGradient style={style.container} colors={["#3D4A6C", "#12182B"]} >
           
                <Header title={"Wallet Connect"} />
                <ScrollView showsVerticalScrollIndicator={false} >
                <View style={style.box_container} >


                <Card style={style.card_container} >

                        <Pancakeswap width={devicewidth * 0.23} height={deviceheight * 0.06}  />
                        <Text style={style.parahead}>Exchange | PancakeSwap</Text>
                        <Text style={style.paradesc}>The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it is in the Lottery,then stake it in Syrub Pools to earn more tokens! Initial Farm Offerings (new token launch modal pioneered by PAncakeSwap),NFTs, and more on a platform you can trust.</Text>




                 </Card>
                 <Card style={style.card_container1} >
                        <View style={style.expsec}>
                            <Text style={style.para}>Expiry In</Text>
                            <Text style={style.parablue}>20-10-2023 19:50</Text>
                        </View>
                        <View style={style.expsec}>
                            <Text style={style.para}>Wallet</Text>
                            <Text style={style.parablue}>Wallet-1</Text>
                        </View>



                    </Card>
                    <Card style={style.card_container2}  >
                
                     
                        <View style={style.expsec}>
                            <Text style={style.para}>Address</Text>
                            <Text style={style.parablue}>0xCc5698...fhrd5896</Text>
                        </View>



                    </Card>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Settingconnectconfirm')}
                        style={style.create_button} >
                        <Button title={"Disconnect"} colors={['#5CB9FF', '#0091FF']} />
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1
        },
        box_container: {
            height: "90%",
            paddingHorizontal: "3%",
            alignItems: 'center',
        },
        card_container: {
            width: "92.5%",
            marginTop: "5%",
            backgroundColor: "#2A3553",
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "7%",
            paddingHorizontal: "7%",
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 5,
            // height: "30%",
            alignItems:"center"
      
            // justifyContent: "center",
            // alignItems: 'center'

        },
        card_container1: {
            width: "92.5%",
            backgroundColor: "#2A3553",
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "5%",
            paddingHorizontal: "7%",
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 5,
            // height: "17%",
            marginVertical:"10%"

            // justifyContent: "center",
            // alignItems: 'center'

        },
        card_container2: {
            width: "92.5%",
            backgroundColor: "#2A3553",
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "5%",
            paddingHorizontal: "7%",
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 5,
            // height: "10%",
          

            // justifyContent: "center",
            // alignItems: 'center'

        },
        innercard: {
            backgroundColor: "#19233F",
            flexDirection: "row",
            justifyContent: 'space-between',
            alignItems: "center",
            paddingHorizontal: "5%",
            paddingVertical: "3%",
            borderRadius: borderradius * 0.7,
            marginVertical: "10%",
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 5,

        },
        innercardleft: {
            flexDirection: 'row',
            gap: 5,
            alignItems: "center"
        },

        para: {
            fontSize: RFPercentage(1.65),
            color: "#9ACFFF",
            fontFamily: Fonts.Medium,
            textAlign: 'left'
        },
        parahead: {
            fontSize: RFPercentage(1.75),
            color: "#9ACFFF",
            fontFamily: Fonts.Medium,
            textAlign: 'center'
        },
        paradesc: {
            fontSize: RFPercentage(1.55),
            color: "#FFF",
            fontFamily: Fonts.Medium,
            textAlign: 'left',
            marginTop:"3%"
        },

        paralite: {
            fontSize: RFPercentage(1.85),
            color: "#37607F",
            fontFamily: Fonts.Medium,
            textAlign: 'left'
        },
        parablue: {
            fontSize: RFPercentage(1.85),
            color: "#0091FF",
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },

        create_button: {
            marginVertical: "10%",
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
            fontFamily: Fonts.Medium,
            textAlign: "center"

        },
        gradTitle1: {
            fontSize: RFPercentage(2.55),
            color: "#9ACFFF",
            fontFamily: Fonts.Medium,
            textAlign: "center"

        },
        inputtitle: {
            fontSize: RFPercentage(2.05),
            color: "#9ACFFF",
            fontFamily: Fonts.Medium,
        },
        expsec: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: "3%"
        },


        inputrow: {
            height: "15%",
            marginBottom: "5%",

        }





    })