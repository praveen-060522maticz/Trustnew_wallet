//packages
import React, { useContext, useState, useCallback } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight, BackHandler, Platform } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import Icn from 'react-native-vector-icons/Ionicons';
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../Components/Button";
import { useFocusEffect } from "@react-navigation/native";
import { ethers } from 'ethers';
import { Toastfn } from "../../Utilities/toast";
import Clipboard from "@react-native-community/clipboard";
import { useDispatch } from "react-redux";
import { addSeedData } from "../../Redux/Actions/seeddataaction";
import { ActivityIndicator } from "react-native-paper";
import { C } from "../../Utilities/colors";
import Icn1 from 'react-native-vector-icons/Ionicons';
import { lotties } from "../../Utilities/images";
import LottieView from "lottie-react-native";
import { useSelector } from "react-redux";
const bip39 = require('bip39');




export default function Copywalletphrase({ navigation, route }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [qrdata, setQrData] = useState("");
    const [seedList, seedListArray] = useState([]);
    const [copyVal, seedCopyFunc] = useState("");
    const [load, setLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    //redux
    const setSeedDataRedux = (item) => dispatch(addSeedData(item));
    const seedDataFromRedux = useSelector(
        (state) => state.seedDataReducer.seedData
    );

    useFocusEffect(

        useCallback(() => {

            const onBackPress = () => {
                navigation.navigate("Walletprivacy")
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


    useFocusEffect(
        useCallback(() => {
            if (route.params !== "scantophrase") {
                seedGenerate()
                setLoading(false)

            }
            else {
                const seedListArr = seedDataFromRedux.split(" ");
                seedCopyFunc(seedDataFromRedux)
                seedListArray(seedListArr)
                setQrData(seedDataFromRedux)
                setLoad(false)
            }


        }, [route.params]));

    /** Generate seed phrase*/
    const seedGenerate = async () => {
        setTimeout(() => {
            // var seedGeneration = ethers.Wallet.createRandom()
            const seedGeneration = bip39.generateMnemonic();
            // let Walletmnemonic = seedGeneration.mnemonic.phrase
            let Walletmnemonic = seedGeneration
            console.log('Walletmnemonic---->', Walletmnemonic);
            const seedListArr = Walletmnemonic.split(" ");
            seedCopyFunc(Walletmnemonic)
            seedListArray(seedListArr)
            setQrData(Walletmnemonic)
            setLoad(false)
            // setLoading(true)
        }, 1000)


    };
    /** show phrase*/
    const Item = ({ item, onPress, backgroundColor, key, index }) => (
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
                width: devicewidth * 0.255,
                alignSelf: "center",


            }}
        >
            <Text
                style={style.paraphrase}
            >
                {index + 1}. {item}
            </Text>
        </TouchableHighlight>
    );

    /**Copy seedphrase */
    const copyToClipboard = () => {
        Clipboard.setString(copyVal);
        Toastfn("Phrase Successfully copied")
    };
    /** Arranged phrase*/
    const mapData = () => {
        return (
            seedList?.length != 0 && seedList?.map((item, index) => {
                const backgroundColor = theme.secondarybg;
                const color = theme.text;
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
                        index={index}
                    />
                );
            }));

    };

    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={style.container}>
                <Header title={"Phrase"} type={"pivacypolicy"} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={style.box_container} >
                        <View style={style.Topsec}>
                            <Text style={style.Titlepara} >Write down or copy these words in the right
                                order and save them somewhere safe</Text>
                        </View>
                        <View style={style.card_container} >
                            {load ? <ActivityIndicator color={theme.theme == "dark" ? "#fff" : "#00001C"} size={"small"} /> :

                                <View style={style.mapData}>{mapData()}</View>

                            }
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
                                        {Platform.OS === 'android' ? (<LottieView
                                            style={{

                                                width: devicewidth * 0.12,
                                                height: deviceheight * 0.12,
                                                alignSelf: "center"

                                            }}
                                            source={lotties.noshare}
                                            autoPlay
                                            loop
                                            resizeMode="contain"
                                        />) : (
                                            <LottieView
                                                style={{
                                                    width: devicewidth * 0.22,
                                                    height: deviceheight * 0.16,
                                                    alignSelf: "center",

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
                        <TouchableOpacity

                            onPress={() => {
                                if (seedList.length != 0) {
                                    setSeedDataRedux(copyVal);
                                    navigation.navigate('Confirmwalletphrase')
                                }
                            }
                            }
                            style={style.create_button} >
                            <Button title={"Continue"} colors={['#1AC6C9', '#3878C7', "#3D1E88"]} />
                        </TouchableOpacity>

                        {!loading ?

                            <TouchableOpacity
                                style={{
                                    width: "100%",
                                    alignItems: "center", padding: "3.5%", backgroundColor: theme.background, borderRadius: borderradius * 0.5, justifyContent: "center", alignSelf: "center", borderWidth: 1.5, borderColor: "#173782"
                                }}

                                onPress={() => (
                                    setLoading(true),
                                    setSeedDataRedux(copyVal),
                                    setTimeout(() => {
                                        navigation.navigate("QrCodePage", { phrase: seedList.join(" "), from: "copywalletphrase" })
                                    }, 1000)
                                )}
                            >

                                <Text style={style.gradTitle1}> Scan QR Code</Text>

                            </TouchableOpacity>
                            :
                            <View style={{
                                width: "100%",
                                alignItems: "center", padding: "3.5%", backgroundColor: theme.background, borderRadius: borderradius * 0.5, justifyContent: "center", alignSelf: "center", borderWidth: 1.5, borderColor: "#173782"
                            }}>
                                <ActivityIndicator size={"small"} color={theme.theme == "dark" ? "#fff" : "#00001C"} style={{ alignSelf: "center", }} />
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
            flex: 1,
            backgroundColor: theme.background
        },
        box_container: {

            justifyContent: "center",
            alignItems: 'center',
        },
        card_container: {
            width: "100%",
            alignItems: "center",





        },
        card_container1: {

            justifyContent: "center",


        },

        para: {
            fontSize: RFPercentage(2.05),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            marginTop: '5%'
        },
        paragrey: {
            fontSize: RFPercentage(2.00),
            color: "#ffffff",
            fontFamily: Fonts.Medium,
            textAlign: "center",
            marginBottom: "0%"
        },
        Titlepara: {
            fontSize: RFPercentage(2.05),
            color: C.textgrey,
            fontFamily: Fonts.Regular,
            textAlign: "center"
        },

        create_button: {
            marginTop: "10%",
            alignSelf: "center",
            width: '100%',
            marginBottom: "5%"
        },



        gradTitle: {
            fontSize: RFPercentage(2.55),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            textAlign: "center"

        },
        gradTitle1: {
            fontSize: RFPercentage(2.05),
            color: theme.theme == "dark" ? "#173782" : "#173782",
            fontFamily: Fonts.Regular,
            textAlign: "center",
        },
        Topsec: {
            width: "90%",
            marginBottom: "8%",
            textAlign: "center",
            justifyContent: "center",
            alignSelf: "center"
        },
        mapData: {
            flexDirection: "row",
            flexWrap: "wrap",
            width: "92%",
            justifyContent: "space-between",
        },
        copyView: {
            marginTop: "5%",
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
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
        },
        alertcontent: {
            marginTop: "3%"
        },
        btnsec: {
            width: "90%"
        },
        bottomsec: {
            width: '100%',
            alignItems: "center",
            position: "absolute",
            bottom: "4.8%",
            left: 0,
            right: 0,

        },
        scanTxt: {
            fontFamily: Fonts.Regular,
            fontSize: RFPercentage(2.15),
            color: theme.text,
            textAlign: "center",
            marginTop: '5%',
            marginBottom: "5%"
        },
        qrsec: {
            borderRadius: 15,
            elevation: 0,
            borderWidth: 1, padding: 10,
            width: "32%",
            alignSelf: "center",
            borderColor: "transparent",
            backgroundColor: "transparent",
            alignItems: "center",
            bottom: 5,
            justifyContent: "center",
            marginBottom: "5%"
        },
        paraphrase: {
            fontSize: RFPercentage(1.65),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'center'


        },

    })