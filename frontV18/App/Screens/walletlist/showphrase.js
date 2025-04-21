/** packages */
import React, { useContext, useState, useCallback,useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text,  TouchableOpacity, View, TouchableHighlight, BackHandler, Platform } from "react-native";
import Header from "../../Navigations/Header";
import {  devicewidth,deviceheight } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";

import Icn from 'react-native-vector-icons/Ionicons';
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import Clipboard from "@react-native-clipboard/clipboard";
import { Toastfn } from "../../Utilities/toast";
import { C } from "../../Utilities/colors";
import LottieView from "lottie-react-native";

import Icn1 from 'react-native-vector-icons/Ionicons';
import { lotties } from "../../Utilities/images";
import Loader from "../../Components/loader";
import Button from "../../Components/Button";
import { useDispatch } from "react-redux";
import { addSeedData } from "../../Redux/Actions/seeddataaction";
export default function Showphrase({ navigation, route }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [qrdata, setQrData] = useState();
    const [seedList, seedListArray] = useState([]);
    const [copyVal, seedCopyFunc] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch =useDispatch()
    const setSeedDataRedux = (item) => dispatch(addSeedData(item));

    useFocusEffect(
        useCallback(() => {
            seedGenerate()
            setLoading(false)
        }, [])
        );


    useFocusEffect(
        React.useCallback(() => {
    
            const onBackPress = () => {
    navigation.navigate("Walletlisting")          
      return true;
            };
            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );
            return () => {
            //     BackHandler.removeEventListener("hardwareBackPress", onBackPress);
                subscription.remove()
                
            };
        }, [])
    )
console.log('route.params`---->',route.params);
/** Generate Seed phrase*/
    const seedGenerate = async () => {
  try{    
      let Walletmnemonic= route.params.mnemonic
        const seedListArr = Walletmnemonic.split(" ");
        seedListArray(seedListArr)
        setQrData(Walletmnemonic)
        seedCopyFunc(Walletmnemonic)}
        catch(err){
            console.log("seedGenerate",err);
        }
    };
    const Item = ({ item, onPress, backgroundColor }) => (
        <TouchableHighlight
            onPress={onPress}
            style={{
                backgroundColor: backgroundColor,
                borderWidth: 0,
                marginTop: 12,
                alignItems: "center",
                justifyContent: "center",
                borderStyle: "solid",
                paddingHorizontal: 12,
                borderRadius: 0,
                paddingVertical: 6,
                borderRadius: 15,
                margin: "1.9%",
                width: devicewidth * 0.220,

            }}
        >
            <Text
                style={style.paraphrase}
            >
                {item}
            </Text>
        </TouchableHighlight>
    );
    /**Arrange Seedphrse */
    const mapData = () => {
        return seedList.map((item, index) => {
            const backgroundColor = theme.secondarybg;
            const color = "#fff";
            const borderWidth = 0;
            const borderColor = "transparent";
            const borderRadius = 15;
            return (
                <Item
                    key={index.toString()}
                    item={item}
                    backgroundColor={backgroundColor}
                    textColor={color}
                    borderWidth={borderWidth}
                    borderColor={borderColor}
                    borderRadius={borderRadius}
                />
            );
        });
    };

/**  Copy Seed phrase*/
    const copyToClipboard = () => {
        Clipboard.setString(copyVal);
        Toastfn("Phrase Successfully copied")
    };

    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={{
                flex: 1,
                backgroundColor: theme.background
            }}  >
                <Header title={"Secret Phrase"} type={"walletdetails"} data={route?.params?.mnemonic} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={style.box_container} >
                        <View style={style.Topsec}>
                            <Text style={style.Titlepara} >Write down or copy these words in the right
                                order and save them somewhere safe</Text>
                        </View>
                        <View style={style.card_container} >
                            <View style={style.mapData}>{mapData()}</View>
                            <TouchableOpacity
                                onPress={copyToClipboard}
                            >
                                <View style={style.copyView}>
                                    {theme.theme == "dark" ? <Icn
                                        name="copy"
                                        type="antdesign"
                                        style={{
                                            alignSelf: "center",
                                            marginRight: "4%"
                                        }}
                                        color="#fff"
                                        size={25} /> : <Icn1
                                        name="copy"
                                        type="antdesign"
                                        style={{
                                            alignSelf: "center",
                                            marginRight: "4%"
                                        }}
                                        color="#000"
                                        size={25} />}

                                    <Text style={style.copyTxt}>Copy to clipboard</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ marginTop: "3%" }}>
                                <View style={style.card_container1}>
                                    <View>
                                    {Platform.OS === 'android'?(  <LottieView
                                            style={{
                                               
                                                width: devicewidth * 0.12,
                                                height: deviceheight * 0.12,
                                                alignSelf:"center"
                                               
                                            }}
                                            source={lotties.noshare}
                                            autoPlay
                                            loop
                                            resizeMode="cover"
                                        />):(
                                            <LottieView
                                            style={{
                                                width: devicewidth * 0.22,
                                                height: deviceheight * 0.16,
                                                alignSelf:"center" ,
                                               
                                            }}
                                            source={lotties.noshare}
                                            autoPlay
                                            loop
                                            resizeMode="contain"
                                        />
                                        )}
                                        <View style={style.alertcontent}>
                                            <Text style={style.alerttext}>Do Not Share</Text>
                                            <Text style={style.alerttext}>Your Secret Phrase!</Text>
                                 
                                        </View>
                                    </View>
                                </View>
                            </View>

                        </View>

                    </View>

                </ScrollView>
                <View style={style.bottomsec}>
                    <View style={style.btnsec}>
                        {!loading ?

                            <TouchableOpacity
                                style={{
                                    width: "100%",
                                    alignItems: "center",  justifyContent: "center", alignSelf: "center", 
                                }}

                                onPress={() => (
                                    setLoading(true),
                                    setSeedDataRedux(copyVal),
                                    setTimeout(() => {
                                        navigation.navigate("QrCodePage",{phrase:seedList.join(" "),from:"showphrase"})
                                    }, 1000)
                                )}
                            >

                                <Button title={" Scan QR Code"} colors={['#1AC6C9', '#3878C7', "#3D1E88"]} />

                            </TouchableOpacity>
                            :
                            <View style={{width:"100%",alignSelf:"center"}}>
                            <Loader />
                            </View>
                        }
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
            justifyContent: "center",
            alignItems: 'center'
        },
        card_container: {
            width: "100%",
            alignItems: "center",
            // backgroundColor: "#2A3553",
            // alignSelf: "center",
            // borderRadius: borderradius * 1,
            // paddingVertical: "10%",
            // paddingHorizontal: "0%",
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 1,
            // shadowRadius: 4,
            // elevation: 5,
            // bottom: "0%",
            // justifyContent: "space-around",
            // paddingBottom:"0%"

        },
        card_container1: {
            // width: "88%",
            // backgroundColor: "#19233F",
            // alignSelf: "center",
            // borderRadius: borderradius * 1,
            // paddingVertical: "10%",
            // paddingHorizontal: "5%",
            // shadowColor: 'transparent',
            // elevation: 5,
            // bottom: "5%",
            justifyContent: "center",
            // position: "relative",
            // marginTop: "25%",

        },

        para: {
            fontSize: RFPercentage(2.05),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            marginTop: '5%'
        },
        paragrey: {
            fontSize: RFPercentage(2.00),
            color: "#376080",
            fontFamily: Fonts.Medium,
            textAlign: "center",
            marginBottom: "0%"
        },
        Titlepara: {
            fontSize: RFPercentage(2.05),
            color: C.textgrey,
            fontFamily: Fonts.Regular,
            // marginTop: '5%',
            textAlign: "center"
        },

        create_button: {
            marginTop: "10%",
            width: "92.5%",
            alignSelf: "center",
            width: '100%'
        },



        gradTitle: {
            fontSize: RFPercentage(2.55),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            textAlign: "center"

        },
        Topsec: {
            width: "90%",
            marginBottom: "15%",
            textAlign: "center",
            justifyContent: "center",
            alignSelf: "center"
        },
        mapData: {
            flexDirection: "row",
            flexWrap: "wrap",
            width: "90%",
            justifyContent: "space-between",
            // justifyContent: "center",
            // marginHorizontal: 10,
        },
        copyView: {
            marginTop: "8%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },
        copyTxt: {
            fontFamily: Fonts.Regular,
            fontSize: RFPercentage(1.85),
            color: theme.text,
            textAlign: "center",
        },
        alerttext: {
            color: C.textgrey,
            fontSize: RFPercentage(2.30),
            textAlign: "center",
            fontFamily: Fonts.Regular,
            marginBottom: "0%"
        },
        alertimg: {
            position: "absolute",
            top: "-60%",
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
        },
        alertcontent: {
            marginTop: "10%"
        },
        btnsec: {
            width: "90%"
        },
        bottomsec: {
            width: '100%',
            alignItems: "center",
            position: "absolute",
            bottom: "5%",
            left: 0,
            right: 0,
        },
        scanTxt: {
            fontFamily: Fonts.Medium,
            fontSize: RFPercentage(2.15),
            color: theme.text,
            textAlign: "center",
            marginTop: '3%',
            marginBottom: "3%"
        },
        qrsec: {
            borderRadius: 15,
            elevation: 0,
            borderWidth: 1,
            padding: 10,
            width: "32%",
            alignSelf: "center",
            borderColor: "transparent",
            backgroundColor: "transparent",
            alignItems: "center",
            // bottom: 5,
            justifyContent: "center",
            // marginBottom:"5%"
        },
        paraphrase: {
            fontSize: RFPercentage(1.65),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'center'


        },

    })