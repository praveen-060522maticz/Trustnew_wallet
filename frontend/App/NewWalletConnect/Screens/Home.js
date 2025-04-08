import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Image, TouchableHighlight, StatusBar, Pressable, TouchableOpacity } from 'react-native'
import { walletKit } from '../utils/WalletConnectUtills';
import Clipboard from "@react-native-community/clipboard";
import { useDispatch, useSelector } from 'react-redux';
import Sessions from '../components/Sessions';
import walletLogo from '../images/WalletConnect-logo.png'
import { borderradius, deviceheight, devicewidth } from '../../Utilities/Dimensions';

import Backarrow from '../../Assets/caexicons/backarrow1.svg'
import Backarrow1 from '../../Assets/caexicons/backarrow2.svg'
import themeContext from '../../Utilities/themecontext';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Fonts } from '../../Utilities/fonts';
import { SafeAreaView } from 'react-native';
import { Card } from 'react-native-shadow-cards';
import Button from '../../Components/Button';

const isPhone = devicewidth < 600;

export default function Home({ route }) {

    const navigation = useNavigation();
    const [initialize, setInitialized] = useState(false);
    const [currentWCURI, setCurrentWCURI] = useState('')
    const dispatch = useDispatch()
    const { modal, modalShow, modalData } = useSelector(state => state.modalreducers)
    const { walletConnecting } = useSelector(state => state.walletconnectReducer)

    useEffect(() => {
        if (!initialize) {
            setInitialized(true);
        }
    }, [])

    const theme = useContext(themeContext);
    const style = styles(theme);

    console.log('walletConnecting---->', walletConnecting);
    async function pair(uri) {
        try {
            console.log('uri || currentWCURI---->', uri, currentWCURI);
            if (uri || currentWCURI) {
                console.log('uriuadawri---->', uri, currentWCURI);
                dispatch({
                    type: "openModal",
                    data: {
                        modal: "LoadingModal",
                        modalData: { loadingMessage: 'Pairing...' }
                    }
                })
                await new Promise(resolve => setTimeout(resolve, 1000));
                const daada = await walletKit.pair({ uri: uri || currentWCURI });
                console.log('daada---->', daada);
            }

        } catch (error) {
            console.log('Erroro ---->', error);
            dispatch({
                type: "openModal",
                data: {
                    modal: "LoadingModal",
                    modalData: { errorMessage: 'There was an error pairing.' }
                }
            })
        }
    }
    useEffect(() => {
        // URI received from QR code scanner
        if (route.params?.uri) {
            console.log('route.params.uri---->', route);
            Clipboard.setString(route.params?.uri)
            pair(route.params.uri);
        }
    }, [route.params?.uri]);

    const onPaste = async () => {
        const getItem = await Clipboard.getString();
        console.log('getItem---->', getItem);
        setCurrentWCURI(getItem)
    }


    return (
        <>
            {/* <View style={styles.container} >
                <View style={{ height: "15%", backgroundColor: "transparent", width: "100%", alignItems: "center", justifyContent: "center" }} >
                    <Image source={walletLogo} style={{ height: "45%", width: "100%", resizeMode: "contain", marginTop: 30 }} />
                </View>
                <Sessions />

                <View style={{ height: "20%", backgroundColor: "transparent", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 15 }} >
                    <View style={{ display: "flex", alignItems: "center", flexDirection: "row", gap: 20 }} >
                        <TextInput
                            style={styles.textInputContainer}
                            onChangeText={setCurrentWCURI}
                            value={currentWCURI}
                            placeholder="Enter WC URI (wc:1234...)"
                        />
                        <TouchableHighlight style={{ backgroundColor: "transparent", padding: 4 }} onPress={() => onPaste()}  >
                            <Text style={{ color: "#fff" }} >Paste</Text>
                        </TouchableHighlight>
                    </View>
                    <Button title="Pair Session" onPress={() => pair()} />
                    <Button title="Scan to connect" onPress={() => navigation.navigate("ScanQr")} />
                </View>

            </View> */}

            <SafeAreaView style={style.container} >

                    <StatusBar backgroundColor={theme.background} />

                    <View style={{ flex: 1, backgroundColor: theme.background }}  >
                        <View style={{
                            width: "90%",
                            flexDirection: "row",
                            height: deviceheight * 0.10,
                            alignItems: "center",
                            alignSelf: "center",

                        }} >
                            <Text style={style.headertext} >New Connection</Text>
                            <Pressable
                                onPress={() => navigation.goBack()}
                                style={{ padding: "4%" }}
                            >

                                {theme.theme == "light" ? <Backarrow1 width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.0545} style={style.arrowcontainer} /> : <Backarrow width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} />}
                            </Pressable>
                        </View>
                        <View style={style.box_container} >


                            <Card style={style.card_container} >
                                <View style={style.inputrow}>
                                    <View >
                                        <Text style={style.inputtitle}>Connect your wallet with walletconnect to make transaction </Text>
                                    </View>

                                </View>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("ScanQr")}
                                    style={style.create_button} >
                                    <Button title={"New Connection"} colors={['rgba(26,198,201,1)', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']} />
                                </TouchableOpacity>

                                <Sessions />
                            </Card>
                        </View>


                    </View>
            </SafeAreaView>
        </>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background
        },
        box_container: {
            paddingHorizontal: "3%",
            justifyContent: "center",
            alignItems: 'center',
        },
        card_container: {
            maxHeight: "90%",
            width: "95%",
            backgroundColor: theme.theme == "dark" ? "#26263D" : theme.secondarybg,
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "7%",
            paddingHorizontal: "7%",

        },
        innercard: {
            backgroundColor: theme.background,
            flexDirection: "row",
            justifyContent: 'space-between',
            alignItems: "center",
            paddingHorizontal: "5%",
            paddingVertical: "5%",
            borderRadius: borderradius * 0.7,
            marginVertical: "5%",

        },
        innercardleft: {
            flexDirection: 'row',
            // gap: 5,
            alignItems: "center",
            width: "100%"
        },

        para: {
            fontSize: RFPercentage(1.65),
            color: "#010101",
            fontFamily: Fonts.Regular,
            textAlign: 'left',
            width: "90%"
        },
        para1: {
            fontSize: RFPercentage(1.65),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'left',
            width: "90%"
        },

        paralite: {
            fontSize: RFPercentage(1.85),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'left'
        },
        parablue: {
            fontSize: RFPercentage(1.95),
            color: "#0091FF",
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },

        create_button: {
            marginTop: "15%",
            width: "100%",
            alignSelf: "center",
            marginBottom: "7%"
        },

        contentsec: {
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: "7%"
        },
        gradTitle: {
            fontSize: RFPercentage(2.85),
            color: "#010101",
            fontFamily: Fonts.Regular,
            textAlign: "center"

        },
        gradTitle1: {
            fontSize: RFPercentage(2.55),
            color: "#010101",
            fontFamily: Fonts.Regular,
            textAlign: "center"

        },
        inputtitle: {
            fontSize: RFPercentage(2.05),
            color: theme.text,
            fontFamily: Fonts.Regular,
        },



        inputrow: {
            marginTop: "3%"

        },

        headertext: {
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: Fonts.Regular,
            fontSize: RFPercentage(2.5),
            color: theme.text
        },



    })

// const styles = StyleSheet.create({
//     sectionContainer: {
//         marginTop: 32,
//         paddingHorizontal: 24,
//     },
//     sectionTitle: {
//         fontSize: 24,
//         fontWeight: '600',
//     },
//     sectionDescription: {
//         marginTop: 8,
//         fontSize: 18,
//         fontWeight: '400',
//     },
//     highlight: {
//         fontWeight: '700',
//     },
//     container: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "#000",
//         gap: 10
//     },
//     modalContentContainer: {
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         borderRadius: 34,
//         borderWidth: 1,
//         width: "100%",
//         height: "40%",
//         position: "absolute",
//         bottom: 0,
//     },
//     textInputContainer: {
//         height: 40,
//         width: 250,
//         borderColor: "gray",
//         borderWidth: 1,
//         borderRadius: 10,
//         // marginVertical: 10,
//         padding: 4,
//     },
//     addressContent: {
//         textAlign: "center",
//         marginVertical: 8,
//     },
// });