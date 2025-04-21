/** packages*/
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../Components/Button";
import Clipboard from "@react-native-clipboard/clipboard";
import { UseWalletArray, AddWallet, SetCurrentIndex } from "../../Utilities/usestorage";
import { Toastfn } from "../../Utilities/toast";
import { Defaulttokens, primarycurrency } from "../../api/ApiConstants"
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../../Components/loader";
import { C } from "../../Utilities/colors";
import {pick} from '@react-native-documents/picker';
import Scan4 from "../../Assets/caexicons/scan4.svg"
import Scan5 from "../../Assets/caexicons/scan5.svg"
import { createTronWallet } from "../../Network_controllers/TRON/Tron_controller";
import { File_to_Phrase } from "../../Utilities/phrasefileupload";
import { Notification } from "../../Utilities/axios";
import { createEvmWallet } from "../../Network_controllers/EVM/Evm_contracthook";
import { isEmpty } from "../../Utilities/commenfuctions";
import { createBtcWallet } from "../../Network_controllers/BTC/Bitcoin_controller";
// import messaging from '@react-native-firebase/messaging';
import { onAccountChange } from "../../NewWalletConnect/utils/WalletConnectUtills";
import { sleep } from "../../NewWalletConnect/utils/common";



export default function Importmulti({ navigation, route }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [name, setName] = useState("");
    const [phrase, setPhrase] = useState("");
    const [nameErr, setNameErr] = useState(false);
    const [phraseErr, setPhraseErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [wallName, setWalletName] = useState([]);
    const [walletAddress, setWalletAddress] = useState([]);
    const [filename, setFileName] = useState({
        csv: "",
        txt: ""
    });
    var Notifications = false


    /** Networks*/
    useFocusEffect(
        useCallback(() => {

            if (route?.params?.data) {

                setPhrase((route.params.data).trim())
            }
            else {
                setPhrase()

            }

        }, [route.params?.data]));

    useFocusEffect(
        useCallback(() => {
            useWalletArr_fuction()

        }, [])
    )



    /** Read the phrase file function*/

    const handleDocumentSelection = async (type) => {
        try {
            setPhraseErr(false)
            const response = await pick();
            let fileName = response[0]?.name;
            let fileNameExt = fileName?.substr(fileName.lastIndexOf(".") + 1);
            if (fileNameExt !== type) {
                setFileName("")
                return Toastfn(`Please Select ${type} file`)
            }
            else {
                let phrasedata = await File_to_Phrase(type, response[0].uri)
                setPhrase(phrasedata.trim())

                if (type == 'csv') {
                    setFileName({ ...filename, ...{ "csv": fileName, ['txt']: "Text File" } })

                }
                else if (type == 'txt') {
                    setFileName({ ...filename, ...{ 'txt': fileName, ['csv']: "CSV File" } })

                }
            }


        } catch (err) {
            console.warn("File_read_error", err);
        }
    }




    /** Notification For Receive */

    const Notificationdata = async (walletArr) => {
        // try {

        //     const token = await messaging().getToken()

        //     let payload = {
        //         Evmwalletaddress: (walletArr[0]?.walletaddress.evm).toLowerCase(),
        //         Tronwalletaddress: (walletArr[0]?.walletaddress.tron).toLowerCase(),
        //         Btcwalletaddress: (walletArr[0]?.walletaddress.btc).toLowerCase(),
        //         token: token,
        //         wallettype: 'multicoin'

        //     };

        //     var { status } = await Notification(payload)
        //     Notifications = status
        // }
        // catch (err) {
        //     console.log("Notificationdata_err", e);

        // }






    }

    /** To  Get Wallet Details*/
    const useWalletArr_fuction = async () => {


        let walletarray = UseWalletArray();

        setName("Account " + ((walletarray.length <= 0 ? 0 : parseInt(walletarray[walletarray?.length - 1][0]?.id)) + 1))
        let walletAdd = []
        let walletName = [];

        walletarray.map((item, i) => {

            item.map((val) => {
                walletName.push(val.walletname);
                if (val.walletType == "singlecoin") {
                    walletAdd.push(Object.values(val.walletaddress)[0]);

                }
                else {
                    Object.values(val.walletaddress).map((item) => {
                        walletAdd.push(item)

                    })
                }
            })
        })


        setWalletName(walletName)
        setWalletAddress(isEmpty(walletAdd) ? [] : walletAdd)
    }



    /** Phrase Validation for Given phrase (import Wallet)*/
    const seedvalidateMultiCoin = async () => {
        setLoading(true)
        try {

            if (isEmpty(name)) {
                setNameErr(true);
                setLoading(false)
                return false
            }
            if (isEmpty(phrase)) {
                setPhraseErr("Field reqiuired")
                setLoading(false)
                return false
            }
            if (phrase.match(/(\w+)/g).length != 12 && phrase.match(/(\w+)/g).length != 24 && phrase.match(/(\w+)/g).length != 18) {
                setPhraseErr("Seed Must have 12 or 24 words")
                setLoading(false)
                return false
            }
            else {
                setNameErr(false);
                setLoading(true);
                await sleep(500)
                // setTimeout(async() => {

                try {
                    const [evmWallet, tronwallet, btcwallet] = await Promise.all([
                        await createEvmWallet(phrase.trim()),
                        await createTronWallet(phrase.trim()),
                        await createBtcWallet(phrase.trim())
                    ])
                    // const evmWallet = await createEvmWallet(phrase.trim());
                    // const tronwallet = await createTronWallet(phrase.trim())
                    // const btcwallet = await createBtcWallet(phrase)
                    console.log("evmWalletevmWalletevmWallet", evmWallet, tronwallet, btcwallet);
                    let walletArr = [];

                    if (evmWallet && tronwallet && btcwallet) {
                        console.log("tronwallettronwallet", tronwallet);
                        setLoading(true);
                        let walletarray = UseWalletArray();
                        // let ind = (walletarray?.length==0?0:parseInt(walletarray?[0]?.id)+1)
                        let ind = ((walletarray.length <= 0 ? 0 : parseInt(walletarray[walletarray?.length - 1][0]?.id)) + 1)
                        let checkAddevm = walletAddress.includes(evmWallet.address);
                        let checkAddtron = walletAddress.includes(tronwallet.address);
                        let checkAddbtc = walletAddress.includes(btcwallet.address);

                        let checkname = wallName.includes(name);

                        if (checkAddtron || checkAddevm || checkAddbtc) {
                            setLoading(false);
                            return Toastfn("This wallet address already exists !!!");
                        }
                        if (checkname == true) {
                            setLoading(false);
                            return Toastfn("This wallet name already exists !!!")
                        }

                        let newwalletobj = {
                            "id": ind,
                            "walletname": name,
                            "mnemonic": phrase.trim(),
                            "privateKey": {
                                "evm": evmWallet.privateKey,
                                "tron": tronwallet.privateKey,
                                "btc": btcwallet.privateKey
                            },
                            "network": primarycurrency,

                            "tokens": Defaulttokens,
                            "walletType": "multicoin",
                            "walletaddress": {
                                "evm": evmWallet.address,
                                "tron": tronwallet.address,
                                "btc": btcwallet.address

                            },
                            "publickey": btcwallet.publickey ? btcwallet.publickey : "",

                        }
                        walletArr.push(newwalletobj)
                        AddWallet(walletArr)
                        SetCurrentIndex(walletarray.length);
                        // await onAccountChange(evmWallet?.address, "eip155:11155111")
                        navigation.navigate("Walletmain", { walletfinal: true })


                        // await Notificationdata(walletArr)
                        // if (Notifications) {

                        //     AddWallet(walletArr)
                        //     SetCurrentIndex(walletarray.length);


                        //     navigation.push("Walletmain", { walletfinal: true })
                        // }
                        // else {
                        //     Toastfn("Something went wrong...!")
                        //     setLoading(false);
                        //     Notifications = false

                        // }


                    }
                    else {

                        setPhraseErr("Invalid Mnemonic Phrase")
                        setLoading(false);

                    }
                } catch (error) {
                    setPhraseErr("Invalid Mnemonic Phrase")
                    setLoading(false);
                    console.log('Invalidmnemonic errr', error);


                }


                // }, 1000);
            }
        }
        catch (err) {
            console.log("import mulicoiiiin error", err);
            setPhraseErr("Invalid Mnemonic Phrase")
            setLoading(false);
        }
    }

    /** Copy phrase*/
    const fetchCopiedText = async () => {
        setLoading(false);
        const text = await Clipboard.getString();
        setPhrase(text.trim());
    };



    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={{ flex: 1, backgroundColor: theme.background }}  >
                <Header title={"Import Multi Coin Wallet"} />

                <View style={style.box_container} >


                    <View style={style.card_container}>

                        <ScrollView showsVerticalScrollIndicator={false} >


                            <View style={style.innercard}>


                                <View style={style.inputrow}>

                                    <View style={style.inputsec}>

                                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <TextInput
                                                style={style.inputstyle}
                                                onChangeText={(name) => {
                                                    setPhraseErr("")
                                                    setNameErr(false)
                                                    setName(String(name));
                                                    setLoading(false)
                                                }}
                                                value={name}
                                                placeholder="Multi - Coin Wallet -1"
                                                placeholderTextColor={C.textgrey}

                                            />



                                            <TouchableOpacity onPress={() => navigation.navigate("Walletconnectqr", { path: "Importmulti", from: "phrase" })}>
                                                <View >
                                                    {theme.theme == "dark" ? <Scan4 width={devicewidth * 0.065} height={devicewidth * 0.065} style={{ marginLeft: "4%" }} /> : <Scan5 width={devicewidth * 0.065} height={devicewidth * 0.065} style={{ marginLeft: "4%" }} />}


                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                    </View>

                                </View>
                                <View style={{ width: "90%", alignSelf: "center" }}>
                                    {nameErr == true && name.length == 0 && (
                                        <Text style={style.invalidPhraseTxt}>Field required</Text>
                                    )}
                                </View>
                                <View style={style.inputrow}>

                                    <View style={style.inputsec}>
                                        <View style={style.leftinput}>
                                            <TextInput
                                                style={style.inputstyle}
                                                onChangeText={(phrase) => {
                                                    setPhraseErr("")
                                                    setNameErr(false)
                                                    setPhrase(phrase);
                                                    setLoading(false)

                                                }}
                                                value={phrase}
                                                placeholder="Recovery Pharse"
                                                placeholderTextColor={C.textgrey}
                                                multiline
                                                numberOfLines={5}
                                            // maxLength={120}
                                            />

                                        </View>



                                    </View>
                                    <View style={{ marginBottom: "3%" }}>
                                        {phraseErr && (
                                            <Text style={style.invalidPhraseTxt}>{phraseErr}</Text>
                                        )}
                                    </View>

                                    <View style={{ textAlign: "end", marginTop: "5%" }}>
                                        <TouchableOpacity onPress={fetchCopiedText}>
                                            <View style={style.rightinputsec}>
                                                <Text style={style.para}>Paste</Text>

                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginTop: "5%", alignSelf: "center" }}>

                                        <Text style={{
                                            fontSize: RFPercentage(1.90),
                                            color: theme.text,
                                            fontFamily: Fonts.Regular,
                                            textAlign: 'justify',
                                        }}>Typically 12(sometimes18,24) words separated by single spaces</Text>


                                    </View>

                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => handleDocumentSelection('txt')}
                                style={{
                                    width: "100%",
                                    marginTop: "2%"
                                }}>
                                <View style={style.listsec}>
                                    <Text style={style.para1}>Text File</Text>

                                </View>

                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleDocumentSelection('csv')}
                                style={{
                                    width: "100%",
                                    marginTop: "6%"
                                }}>
                                <View style={style.listsec}>
                                    <Text style={style.para1}>CSV File</Text>

                                </View>
                            </TouchableOpacity>


                            <View style={{ marginTop: "4%" }}>


                            </View>






                        </ScrollView >


                    </View>

                </View>
            </View>
            <View style={{ position: "absolute", bottom: "6%", left: 0, right: 0, alignItems: "center", justifyContent: "center", marginBottom: "4%" }}>

                {!loading ?

                    <TouchableOpacity

                        onPress={() => {
                            seedvalidateMultiCoin()
                        }
                        }
                        style={style.create_button} >
                        <Button title={"Import"} colors={['#1AC6C9', '#3878C7', "#3D1E88"]} />
                    </TouchableOpacity>
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
            flex: 1,
            backgroundColor: theme.background,
        },
        box_container: {
            // height: "90%",
            // paddingHorizontal: "3%",
            width: "100%",
            justifyContent: "center",
            alignItems: 'center',
        },
        card_container: {
            width: "90%",
            marginTop: "5%",
            alignSelf: "center",
            marginBottom: "5%"

        },

        para: {
            fontSize: RFPercentage(2.3),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'center',
            marginLeft: 10
        },
        paragrey: {
            marginTop: '2%',
            fontSize: RFPercentage(2.15),
            color: "#8C9BAA",
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },


        paralite: {
            fontSize: RFPercentage(1.95),
            color: "#37607F",
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
            // marginTop: "5%",
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
            color: "#010101",
            fontFamily: Fonts.Regular,
            textAlign: "center"

        },
        gradTitle1: {
            fontSize: RFPercentage(2.55),
            color: "#010101",
            fontFamily: Fonts.Regular,
            textAlign: "left"

        },
        inputtitle: {
            fontSize: RFPercentage(2.25),
            color: "#FFF",
            fontFamily: Fonts.Regular,
        },
        inputsec: {
            backgroundColor: theme.secondarybg,
            borderRadius: borderradius * 0.5,
            width: "100%",
            flexDirection: 'row',
            alignItems: 'center',
            height: deviceheight * 0.08,
            //  height:"27%",
            marginTop: "2%"

        },
        leftinput: {
            width: "100%",

        },
        rightinput: {
            width: "100%",

        },
        rightinputsec: {
            flexDirection: "row",
            gap: 6,
            alignItems: "center",
            justifyContent: 'flex-end'
        },
        inputstyle: {
            paddingHorizontal: "6%",

            color: theme.text,
            fontSize: RFPercentage(1.85),
            fontFamily: Fonts.Regular,
        },
        inputrow: {
            marginBottom: "3%",

        },
        innercard_container: {
            width: "100%",
            marginTop: "0%",
            backgroundColor: theme.background,
            alignSelf: "center",
            borderTopLeftRadius: borderradius * 0.8,
            borderTopRightRadius: borderradius * 0.8,
            paddingVertical: "5%",
            paddingHorizontal: "5%",
            shadowOpacity: 0,
            shadowColor: 'transparent',
            justifyContent: "center",
            alignItems: 'center',
            marginTop: "5%"


        },
        invalidPhraseTxt: {
            fontFamily: Fonts.Regular,
            fontSize: RFValue(12),
            color: "red",

        },
        pasterow: {
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: "space-between"
        },
        topsec: {
            marginBottom: "10%"
        },
        listsec: {
            backgroundColor: theme.secondarybg,
            borderRadius: borderradius * 0.5,
            width: "100%",
            paddingVertical: "4%",
            paddingHorizontal: "6%"

        },
        para1: {
            fontSize: RFPercentage(1.95),
            color: theme.text,
            fontFamily: Fonts.Regular,


        },




    })