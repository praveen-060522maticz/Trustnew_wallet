/** Packages */

import React, { useContext, useEffect, useState, useCallback } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid } from "react-native";
import Header from "../../Navigations/Header";
import { useFocusEffect } from "@react-navigation/native";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../Components/Button";
import { UseWalletArray, AddWallet, SetCurrentIndex, Setchoosednetwork } from "../../Utilities/usestorage";
import { isEmpty } from "../../Utilities/commenfuctions";
import Clipboard from "@react-native-community/clipboard";
import { Toastfn } from "../../Utilities/toast";
import Loader from "../../Components/loader";
import { EnCryptPrivateKey } from "../../Utilities/commenfuctions";
import { C } from "../../Utilities/colors";
import { Card } from 'react-native-shadow-cards';
import Scan4 from "../../Assets/caexicons/scan4.svg"
import Scan5 from "../../Assets/caexicons/scan5.svg"
import DocumentPicker from 'react-native-document-picker';
import { createTronWallet, createTronWalletWithPrivatekey } from "../../Network_controllers/TRON/Tron_controller";
import PushNotification from "react-native-push-notification";
import { Notification } from "../../Utilities/axios";
import { createEvmWallet, createEvmWalletPrivatekey } from "../../Network_controllers/EVM/Evm_contracthook";
import { File_to_Phrase } from "../../Utilities/phrasefileupload";
import { createBtcWallet, createBtcWalletPrivatekey } from "../../Network_controllers/BTC/Bitcoin_controller";
import { Defaulttokens } from "../../api/ApiConstants";
import messaging from '@react-native-firebase/messaging';
import { onAccountChange } from "../../NewWalletConnect/utils/WalletConnectUtills";
import { sleep } from "../../NewWalletConnect/utils/common";




export default function Importmulti({ navigation, route }) {
    var Notifications = false



    const theme = useContext(themeContext);
    const style = styles(theme);

    /** usestates */

    const [tabbar, setTabbar] = useState(false)
    const [name, setName] = useState("");
    const [phrase, setPhrase] = useState("");
    const [nameErr, setNameErr] = useState("");
    const [phraseErr, setPhraseErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [password, setPassword] = useState("");
    const [wallName, setWalletName] = useState([]);
    const [walletAddress, setWalletAddress] = useState([]);

    const [network, setNetwork] = useState("");
    const [currency, setCurrency] = useState("");

    const [scanchange, setscanchange] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filename, setFileName] = useState({
        csv: "",
        txt: ""
    });

    /** Networks*/
    useFocusEffect(
        useCallback(() => {
            console.log('route?.params---->', route?.params);
            if (route?.params?.network) {
                Setchoosednetwork(route.params.network)
                setNetwork(route.params.network)
                setCurrency(route.params.currency)
            }
            else if (route?.params?.data) {
                console.log('route?.params?.data---->', route?.params);
                if (route?.params?.from != "privatekey") {
                    setPhrase(route?.params?.data?.trim())

                }
                else {
                    setscanchange(true)
                    setTabbar(true)
                    setPassword(route.params.data)
                }

            }
            else {
                setNetwork(network)
            }
        }, [route?.params])
    )



    useFocusEffect(useCallback(() => {

        if (tabbar && !scanchange) {
            setPassword("")
            setPhrase("")
        }

    }, [tabbar, scanchange]));


    useEffect(() => {
        Existwalletname_fuction()
    }, [])

    /** Read the phrase file function*/

    const handleDocumentSelection = async (type) => {
        try {
            setPhraseErr(false)
            const response = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles]
            });
            let fileName = response[0]?.name;
            let fileNameExt = fileName?.substr(fileName.lastIndexOf(".") + 1);
            if (fileNameExt !== type) {
                setFileName("")
                return Toastfn(`Please Select ${type} file`)
            }
            else {
                let phrasedata = await File_to_Phrase(type, response[0].uri)
                setPhrase((phrasedata).trim())

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


    const tabfirst = () => {
        setPhraseErr("")
        setPasswordErr("")

        setTabbar(!tabbar)
        setscanchange(false)
    };





    /** Notification For Receive */
    const Notificationdata = async (walletArr) => {
        try {
            // let payload = {}
            const token = await messaging().getToken()
            let payload =
            {
                Evmwalletaddress: walletArr[0].network[0] == "BNB" || walletArr[0].network[0] == "ETH" ? (walletArr[0]?.walletaddress.evm)?.toLowerCase() : "",
                Tronwalletaddress: walletArr[0].network[0] == "TRX" ? (walletArr[0]?.walletaddress.tron)?.toLowerCase() : "",
                Btcwalletaddress: walletArr[0].network[0] == "BTC" ? (walletArr[0]?.walletaddress.btc)?.toLowerCase() : "",
                token: token,
                wallettype: 'singlecoin'
            };
            var { status } = await Notification(payload)
            Notifications = status
        }
        catch (err) {
            console.log("Notificationdata_err", err);

        }






    }

    /** To  Get Wallet Details*/
    const Existwalletname_fuction = async () => {

        let walletarray = UseWalletArray();
        setName("Account " + ((walletarray.length <= 0 ? 0 : parseInt(walletarray[walletarray?.length - 1][0]?.id)) + 1))
        let walletName = [];

        walletarray.map((item, i) => {
            item.map((val) => {
                walletName.push(val.walletname);
            })
        })
        setWalletName(walletName)
    }


    const Existwalletaddress_fuction = async (address, networkdata) => {
        let walletarray = UseWalletArray();
        let status = false
        walletarray.map((item, i) => {
            item.map((val) => {
                if (val.network.length == 1) {
                    if (
                        (val.walletaddress.evm == address
                            ||
                            val.walletaddress.tron == address
                            || val.walletaddress.btc == address)
                        &&
                        val.network == networkdata
                    ) {
                        status = true
                    }

                }
                else {
                    if (
                        val.walletaddress.evm == address ||
                        val.walletaddress.tron == address ||
                        val.walletaddress.btc == address

                    ) {
                        status = true

                    }
                }

            })
        })
        return status
    }
    /** Phrase Validation for Given phrase*/
    const seedvalidatephrase = async () => {
        try {


            if (isEmpty(name)) {
                setNameErr(true);
                setLoading(false);

                return false
            }
            if (isEmpty(phrase)) {
                setPhraseErr("Field reqiuired")
                setLoading(false);
                return false
            }
            if (phrase.match(/(\w+)/g).length != 12 && phrase.match(/(\w+)/g).length != 18 && phrase.match(/(\w+)/g).length != 24) {
                setPhraseErr("Seed Must have 12 or 24 or 18 word")
                setLoading(false);

                return false
            }
            else {

                setNameErr(false);
                setLoading(true);

                let walletArr = [];
                let walletarray = UseWalletArray();

                await sleep(500)

                if (currency == "BTC") {
                    const btcwallet = await createBtcWallet(phrase)
                    if (!isEmpty(btcwallet)) {


                        let ind = ((walletarray.length <= 0 ? 0 : parseInt(walletarray[walletarray?.length - 1][0]?.id)) + 1)

                        let checkAddtron = await Existwalletaddress_fuction(btcwallet.address, currency);
                        let checkname = wallName.includes(name);

                        if (checkAddtron) {
                            setLoading(false);

                            return Toastfn("This wallet address already exists !!!")
                        }
                        if (checkname) {
                            setLoading(false);
                            return Toastfn("This wallet name  already exists !!!")

                        }
                        else {



                            let newwalletobj = {
                                "id": ind,
                                "walletname": name,
                                "mnemonic": phrase,
                                "privateKey": {
                                    "btc": btcwallet?.privateKey ? btcwallet?.privateKey : ""
                                },
                                "network": Array(currency),

                                "tokens": [],

                                "walletType": "singlecoin",
                                "walletaddress": {
                                    "btc": btcwallet?.address ? btcwallet?.address : ""
                                },
                                "publickey": btcwallet.publickey ? btcwallet.publickey : "",

                            }

                            walletArr.push(newwalletobj);
                            SetCurrentIndex(walletarray.length);
                            AddWallet(walletArr)
                            navigation.navigate("Walletmain")
                            // await Notificationdata(walletArr)

                            // if (Notifications) {
                            //     AddWallet(walletArr)
                            //     SetCurrentIndex(walletarray.length);
                            //     navigation.navigate("Walletmain")

                            // }
                            // else {
                            //     Toastfn("Something went wrong...!")
                            //     setLoading(false);
                            //     Notifications = false

                            // }

                        }
                    }
                    else {
                        setLoading(false);
                        setPhraseErr("Invalid Mnemonic Phrase")
                    }



                }
                else if (currency == "TRX") {
                    var tronwallet = await createTronWallet(phrase.trim())
                    console.log('tronwallet---->', tronwallet);
                    if (!isEmpty(tronwallet)) {


                        let ind = ((walletarray.length <= 0 ? 0 : parseInt(walletarray[walletarray?.length - 1][0]?.id)) + 1)

                        let checkAddtron = await Existwalletaddress_fuction(tronwallet.address, currency);
                        let checkname = wallName.includes(name);
                        console.log('checkAddtron---->', checkAddtron, checkname);
                        if (checkAddtron) {
                            setLoading(false);

                            return Toastfn("This wallet address already exists !!!")
                        }
                        if (checkname) {
                            setLoading(false);
                            return Toastfn("This wallet name  already exists !!!")

                        }
                        else {



                            let newwalletobj = {
                                "id": ind,
                                "walletname": name,
                                "mnemonic": phrase.trim(),
                                "privateKey": {
                                    "tron": tronwallet?.privateKey ? tronwallet?.privateKey : ""
                                },
                                "network": Array(currency),

                                "tokens": Defaulttokens.filter(val => val.type == "TRC20"),

                                "walletType": "singlecoin",
                                "walletaddress": {
                                    "tron": tronwallet?.address ? tronwallet?.address : ""
                                }
                            }
                            console.log('newwalletobjasdtron---->', newwalletobj);
                            walletArr.push(newwalletobj);
                            SetCurrentIndex(walletarray.length);
                            AddWallet(walletArr)
                            navigation.navigate("Walletmain")
                            // await Notificationdata(walletArr)

                            // if (Notifications) {
                            //     AddWallet(walletArr)
                            //     SetCurrentIndex(walletarray.length);
                            //     navigation.navigate("Walletmain")

                            // }
                            // else {
                            //     Toastfn("Something went wrong...!")
                            //     setLoading(false);
                            //     Notifications = false

                            // }

                        }
                    }
                    else {
                        setLoading(false);

                        setPhraseErr("Invalid Mnemonic Phrase")
                    }



                }
                else {
                    let evmWallet = await createEvmWallet(phrase.trim());
                    console.log('evmWallet---->', evmWallet);
                    if (!isEmpty(evmWallet)) {

                        // let ind = walletarray.length > 0 ? parseInt(walletarray[walletarray?.length - 1][0].id) + 1 : walletarray.length;
                        let ind = ((walletarray.length <= 0 ? 0 : parseInt(walletarray[walletarray?.length - 1][0]?.id)) + 1)


                        let checkAddevm = await Existwalletaddress_fuction(evmWallet.address, currency);
                        let checkname = wallName.includes(name);
                        console.log('checkAddevm---->', checkAddevm, checkname);
                        if (checkAddevm) {
                            setLoading(false);

                            return Toastfn("This wallet address already exists !!!")
                        }
                        if (checkname) {
                            setLoading(false);
                            return Toastfn("This wallet name already exists !!!")

                        }
                        else {



                            var newwalletobj = {
                                "id": ind,
                                "walletname": name,
                                "mnemonic": phrase.trim(),
                                "privateKey": {
                                    "evm": evmWallet?.privateKey,
                                },
                                "network": Array(currency),
                                "walletType": "singlecoin",
                                "walletaddress": {
                                    "evm": evmWallet?.address ? evmWallet?.address : "",
                                }
                            }
                            newwalletobj.tokens = currency == "BNB" ?
                                Defaulttokens.filter(val => val.type == "BEP20") :
                                Defaulttokens.filter(val => val.type == "ERC20")
                            console.log('newwalletobj---->', newwalletobj);
                            walletArr.push(newwalletobj);
                            SetCurrentIndex(walletarray.length);
                            AddWallet(walletArr)
                            console.log('walletArr---->', walletArr);
                            navigation.navigate("Walletmain")


                            // await Notificationdata(walletArr)

                            // if (Notifications) {
                            //     AddWallet(walletArr)
                            //     SetCurrentIndex(walletarray.length);
                            //     navigation.navigate("Walletmain")

                            // }
                            // else {
                            //     Toastfn("Something went wrong...!")
                            //     setLoading(false);
                            //     Notifications = false

                            // }






                        }
                    }
                    else {
                        setLoading(false);
                        setPhraseErr("Invalid Mnemonic Phrase")
                    }
                }



            }
        }
        catch (err) {
            setPhraseErr("Invalid Mnemonic Phrase")
            setLoading(false);


            console.log("import mulicoin erroddr", err);
        }
    }

    /** Private Validation for Given privatekey*/
    const seedvalidateprivatekey = async () => {
        try {
            console.log('name---->', name, password, password.trim().length != 64 && password.trim().length != 52,);
            if (isEmpty(name)) {
                setNameErr(true);
                setLoading(false);
                return false
            }
            if (isEmpty(password)) {

                setPasswordErr("Field required")
                setLoading(false);

                return false
            }
            if (password.trim().length != 64 && password.trim().length != 52) {
                setPasswordErr("Invalid Privatekey")
                setLoading(false);

                return false
            }
            else {
                setNameErr(false);
                setLoading(true);




                let walletArr = [];

                let walletarray = UseWalletArray();
                console.log('walletarray---->', walletarray);
                if (currency == "TRX") {
                    const tronwallet = await createTronWalletWithPrivatekey(password.trim())
                    if (tronwallet) {


                        let ind = ((walletarray.length <= 0 ? 0 : parseInt(walletarray[walletarray?.length - 1][0]?.id)) + 1)

                        let checkAddtron = await Existwalletaddress_fuction(tronwallet.address, currency);
                        let checkname = wallName.includes(name);

                        if (checkAddtron) {
                            setLoading(false);

                            return Toastfn("This wallet address already exists !!!")
                        }
                        if (checkname) {
                            setLoading(false);
                            return Toastfn("This wallet name  already exists !!!")

                        }
                        else {



                            let newwalletobj = {
                                "id": ind,
                                "walletname": name,
                                "mnemonic": "",
                                "privateKey": {
                                    "tron": EnCryptPrivateKey(password.trim())
                                },
                                "network": Array(currency),

                                "tokens": Defaulttokens.filter(val => val.type == "TRC20"),

                                "walletType": "singlecoin",
                                "walletaddress": {
                                    "tron": tronwallet?.address
                                }
                            }

                            walletArr.push(newwalletobj);
                            // await Notificationdata(walletArr)

                            // if (Notifications) {
                            AddWallet(walletArr)
                            SetCurrentIndex(walletarray.length);
                            // await onAccountChange(tronwallet?.address, "tron:11155111")
                            navigation.push("Walletmain")

                            // }
                            // else {
                            //     Toastfn("Something went wrong...!")
                            //     setLoading(false);
                            //     Notifications = false

                            // }

                        }
                    }
                    else {
                        setLoading(false);
                        setPasswordErr("Invalid Privatekey")
                    }


                }
                else if (currency == "BTC") {
                    const btcwallet = await createBtcWalletPrivatekey(password.trim())
                    if (btcwallet) {


                        let ind = ((walletarray.length <= 0 ? 0 : parseInt(walletarray[walletarray?.length - 1][0]?.id)) + 1)

                        let checkAddtron = await Existwalletaddress_fuction(btcwallet?.address, currency);
                        let checkname = wallName.includes(name);

                        if (checkAddtron) {
                            setLoading(false);

                            return Toastfn("This wallet address already exists !!!")
                        }
                        if (checkname) {
                            setLoading(false);
                            return Toastfn("This wallet name  already exists !!!")

                        }
                        else {



                            let newwalletobj = {
                                "id": ind,
                                "walletname": name,
                                "mnemonic": "",
                                "privateKey": {
                                    "btc": EnCryptPrivateKey(password.trim())
                                },
                                "network": Array(currency),

                                "tokens": [],

                                "walletType": "singlecoin",
                                "walletaddress": {
                                    "btc": btcwallet?.address
                                },
                                "publickey": btcwallet.publickey ? btcwallet.publickey : "",
                                // "wif": btcwallet.wif ? btcwallet.wif : ""
                            }
                            walletArr.push(newwalletobj);
                            // await Notificationdata(walletArr)
                            // if (Notifications) {

                            AddWallet(walletArr)
                            SetCurrentIndex(walletarray.length);
                            navigation.push("Walletmain")
                            // }
                            // else {
                            //     Toastfn("Something went wrong...!")
                            //     setLoading(false);
                            //     Notifications = false

                            // }


                        }
                    }
                    else {
                        Toastfn('Invalid Privatekey')
                        setLoading(false);
                        setPasswordErr("Invalid Privatekey")
                    }
                } else {
                    const evmWallet = await createEvmWalletPrivatekey(password.trim());
                    console.log('evmWallet---->', evmWallet);
                    if (evmWallet) {

                        let ind = ((walletarray.length <= 0 ? 0 : parseInt(walletarray[walletarray?.length - 1][0]?.id)) + 1)

                        let checkAddevm = await Existwalletaddress_fuction(evmWallet.address, currency);
                        let checkname = wallName.includes(name);
                        console.log('checkAddevmcheckAddevm---->', checkAddevm, checkname);
                        if (checkAddevm) {
                            setLoading(false);

                            return Toastfn("This wallet address already exists !!!")
                        }
                        if (checkname) {
                            setLoading(false);
                            return Toastfn("This wallet name  already exists !!!")

                        }
                        else {


                            let newwalletobj = {
                                "id": ind,
                                "walletname": name,
                                "mnemonic": "",
                                "privateKey": {
                                    "evm": EnCryptPrivateKey(password.trim()),
                                },
                                "network": Array(currency),
                                "walletType": "singlecoin",
                                "walletaddress": {
                                    "evm": evmWallet?.address ? evmWallet?.address : "",
                                }
                            }
                            console.log('newwalletobj---->', newwalletobj);
                            newwalletobj.tokens = currency == "BNB" ?
                                Defaulttokens.filter(val => val.type == "BEP20") :
                                Defaulttokens.filter(val => val.type == "ERC20")

                            walletArr.push(newwalletobj);
                            // await Notificationdata(walletArr)
                            // if (Notifications) {
                            AddWallet(walletArr)
                            SetCurrentIndex(walletarray.length);
                            // await onAccountChange(evmWallet?.address, "eip155:11155111")
                            navigation.push("Walletmain")

                            // }
                            // else {
                            //     Toastfn("Something went wrong...!")
                            //     setLoading(false);
                            //     Notifications = false

                            // }


                        }
                    }
                    else {
                        setLoading(false);
                        setPasswordErr("Invalid Privatekey")
                    }
                }

            }
        }
        catch (err) {
            setPasswordErr("Invalid Privatekey")

            console.log("import mulicoin error", err);
            setLoading(false);

        }
    }

    /** Copy phrase and privatekey*/

    const fetchCopiedText = async (data) => {
        setLoading(false)
        if (data == 'phrase') {
            const text = await Clipboard.getString();
            setPhrase(text.trim());
        }
        if (data == 'privatekey') {
            const text = await Clipboard.getString();
            setPassword(text.trim());
        }
    };

    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={{ flex: 1, backgroundColor: theme.background }} >
                {/* <Header title={`Import ${network == "Smart Chain" ? "BNB" : network == "Ethereum" ? "ETH" : "TRX"}`} /> */}
                {<Header title={"Import Wallet"} />}
                <View style={style.box_container} >


                    <Card style={style.card_container}  >


                        <View style={style.tabbtnsec}>
                            {!tabbar ?
                                <View style={style.btnview}>
                                    <TouchableOpacity

                                        style={style.tab_button} >
                                        <Button title={"Phrase"} colors={['rgba(26,198,201,1)', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={tabfirst}
                                        style={style.tab_button} >
                                        <View style={style.borderbtn} >
                                            <Text style={style.borderbtntext} >Private Key</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={style.btnview}>

                                    <TouchableOpacity
                                        onPress={tabfirst}
                                        style={style.tab_button} >
                                        <View style={style.borderbtn}  >
                                            <Text style={style.borderbtntext} >Phrase</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity


                                        style={style.tab_button} >
                                        <Button title={"Private Key"} colors={['rgba(26,198,201,1)', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']} />
                                    </TouchableOpacity>
                                </View>

                            }


                        </View>
                        {!tabbar ?
                            <ScrollView showsVerticalScrollIndicator={false} >

                                <View style={style.inputrow}>

                                    <View style={style.inputsec}>
                                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <TextInput
                                                style={{
                                                    paddingHorizontal: "6%",
                                                    color: theme.text,
                                                    fontSize: RFPercentage(1.85),
                                                    fontFamily: Fonts.Regular,
                                                    width: "80%"
                                                }}
                                                onChangeText={(name) => {
                                                    setPhraseErr("")
                                                    setNameErr(false)
                                                    setName(String(name));
                                                    setLoading(false);

                                                }}
                                                value={name}
                                                placeholder={name}
                                                placeholderTextColor={C.textgrey}

                                            />

                                            <TouchableOpacity onPress={() => navigation.navigate("Walletconnectqr", { path: "Importcoin", from: "phrase" })}>
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
                                                    setLoading(false);


                                                }}
                                                value={phrase}
                                                placeholder="Phrase"
                                                placeholderTextColor={C.textgrey}
                                                multiline
                                                numberOfLines={5}
                                            // maxLength={120}
                                            />

                                        </View>
                                    </View>
                                    <View>
                                        {phraseErr && (
                                            <Text style={style.invalidPhraseTxt}>{phraseErr}</Text>
                                        )}
                                    </View>

                                    <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: "4%" }}>

                                        <TouchableOpacity onPress={() => fetchCopiedText('phrase')}>

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





                            </ScrollView > :
                            <ScrollView showsVerticalScrollIndicator={false} >
                                <View style={style.inputrow}>

                                    <View style={style.inputsec}>
                                        <View style={style.leftinput}>
                                            <TextInput
                                                style={style.inputstyle}
                                                onChangeText={(name) => {
                                                    setPhraseErr(false)
                                                    setNameErr(false)
                                                    setName(String(name));
                                                    setLoading(false);

                                                }}
                                                value={name}
                                                placeholder={name}
                                                placeholderTextColor={C.textgrey}

                                            />

                                        </View>
                                    </View>
                                </View>
                                <View style={{ width: "90%", alignSelf: "center" }}>
                                    {nameErr == true && name.length == 0 && (
                                        <Text style={style.invalidPhraseTxt}>Field required</Text>
                                    )}
                                </View>
                                <View style={style.inputrow}>
                                    <View style={style.pasterow} >
                                    </View>
                                    <View style={style.inputsec}>
                                        <View style={style.leftinput}>
                                            <TextInput
                                                style={style.inputstyle}
                                                onChangeText={(password) => {
                                                    setPasswordErr("")
                                                    setNameErr(false)
                                                    setPassword(password);
                                                    setLoading(false);

                                                }}
                                                value={password}
                                                placeholder="Private key"
                                                placeholderTextColor={C.textgrey}
                                            />

                                        </View>



                                    </View>
                                    {passwordErr && (
                                        <Text style={style.invalidPhraseTxt}>{passwordErr}</Text>
                                    )}

                                    <View style={{ textAlign: "end", marginTop: "5%" }}>
                                        <TouchableOpacity onPress={() => fetchCopiedText('privatekey')}>
                                            <View style={style.rightinputsec}>
                                                <Text style={style.para}>Paste</Text>

                                            </View>

                                        </TouchableOpacity>
                                    </View>

                                </View>



                            </ScrollView >

                        }


                    </Card>

                </View>

                <View style={{ position: "absolute", bottom: "4%", left: 0, right: 0, }}>
                    {!loading ?

                        <TouchableOpacity


                            onPress={() => {
                                !tabbar ?
                                    // setTimeout(() => {
                                    seedvalidatephrase()

                                    // }, 2000)
                                    :
                                    // setTimeout(() => {
                                    seedvalidateprivatekey()

                                // }, 2000)

                            }} style={style.create_button} >
                            <Button title={"Import"} colors={['rgba(26,198,201,1)', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']} />
                        </TouchableOpacity>

                        :
                        <View style={{ width: "90%", alignSelf: "center" }}>
                            <Loader />
                        </View>
                    }
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
            paddingHorizontal: "4%",
            justifyContent: "center",
            alignItems: 'center',
        },
        card_container: {
            width: "100%",
            marginTop: "8%",
            backgroundColor: theme.theme == "dark" ? "#26263D" : theme.secondarybg,
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "8%",
            paddingHorizontal: "7%",
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 1,
            // shadowRadius: 4,
            // elevation: 5,
            marginBottom: "5%"

        },
        invalidPhraseTxt: {
            fontFamily: Fonts.Regular,
            fontSize: 12,
            color: "red",

        },

        para: {
            fontSize: RFPercentage(2.3),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'center',
            marginLeft: 10
        },
        para1: {
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
            textAlign: "left"

        },
        inputtitle: {
            fontSize: RFPercentage(2.25),
            color: "#FFF",
            fontFamily: Fonts.Regular,
        },
        inputsec: {
            backgroundColor: theme.background,
            borderRadius: borderradius * 0.5,
            width: "100%",
            height: deviceheight * 0.08,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: "2%"

        },
        leftinput: {
            width: "100%"
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
        tabbtnsec: {
            width: "100%",
            marginBottom: "4%"
        },
        btnview: {
            flexDirection: 'row',
            width: '100%',
            marginTop: "5%",
            justifyContent: 'space-between'
        },
        tab_button: {
            width: "43%",

        },
        tab_button1: {
            backgroundColor: "transparent"
        },
        create_button: {
            marginTop: "5%",
            width: "92.5%",
            alignSelf: "center"
        },
        create_button2: {
            marginTop: "5%",
            width: "92.5%",
            alignSelf: "center",
            marginBottom: "5%"
        },
        borderbtn: {
            height: deviceheight * 0.0625,
            borderWidth: 1,
            borderColor: theme.theme == "dark" ? "#FFFFFF" : "#173782",
            backgroundColor: theme.secondarybg,
            borderRadius: 10,
            justifyContent: "center"
        },
        borderbtntext: {
            fontSize: RFPercentage(2),
            color: theme.theme == "dark" ? "#FFFFFF" : "#173782",
            fontFamily: Fonts.Regular,
            textAlign: "center",
        },
        pasterow: {
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: "space-between"
        },
        topsec: {
            marginBottom: "10%"
        },
        continueBtn: {
            borderRadius: 5,
            height: 45,
            width: "90%",
            alignSelf: "center",
            backgroundColor: "transparent",
        },
        listsec: {
            backgroundColor: theme.background,
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