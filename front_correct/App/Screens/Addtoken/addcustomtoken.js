//packages
import React, { useContext, useState, useRef, useCallback } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable, Dimensions } from "react-native";
import Header from "../../Navigations/Header";
import RBSheet from "react-native-raw-bottom-sheet";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../Components/Button";
import { CurrentWalletArray, SetWallets, Setcurrentwallet } from "../../Utilities/usestorage";
import { UseWalletArray, GetCurrentIndex } from "../../Utilities/usestorage";
import { contractaddress_validation, tokenBlanace, tokenDetail } from "../../Network_controllers/EVM/Evm_contracthook";
import { Toastfn } from "../../Utilities/toast";
import Clipboard from "@react-native-community/clipboard";
import { useFocusEffect } from "@react-navigation/native";
import Tron from "../../Assets/caexicons/tron.svg"
import Eth1 from "../../Assets/caexicons/eth1.svg"
import Bnc1 from "../../Assets/caexicons/bnc1.svg"
import { C } from "../../Utilities/colors";
import Scan4 from "../../Assets/caexicons/scan4.svg"
import Scan5 from "../../Assets/caexicons/scan5.svg"
import Icon from 'react-native-vector-icons/Ionicons/';
import { tronTokenDetails } from "../../Network_controllers/TRON/Tron_Contract";
import { isEmpty } from "../../Utilities/commenfuctions";
import { currentChainconfig } from "../../api/ApiConstants";
const { height } = Dimensions.get('window');



export default function Addcustomtoken({ navigation, route }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const refRBSheet = useRef();
    const [contractAddress, setContractAddress] = useState("");
    const [networkimage, setNetworkimage] = useState();
    const [netWorkName, setNetWorkName] = useState('');
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [decimals, setDecimals] = useState("");
    const [coinlist, setCoinlist] = useState([])
    const [TokenAddress, setTokenAddress] = useState([])



    //To get wallet aaddresspwallethome
    const Walletaddressfunction = (walletdata, network) => {
        let walletdatatestnet = walletdata.filter(
            (value) =>
                value.testnet == network && value.type == "Crypto")
        return walletdatatestnet[0]

    }

    //to get token details
    const customtokenfetch = async (tokenAddress, network) => {
        let customdata = CurrentWalletArray()
        // let tokentype = network == 'BNB' ? "BEP20" : network == 'ETH' ? "ERC20" : "TRC20"
        let walletdata = Walletaddressfunction(customdata, network)

        try {

            var tokens = network !== "TRX" ?
                await tokenDetail(tokenAddress, undefined, undefined, network, walletdata.walletaddress)
                :
                await tronTokenDetails(walletdata.walletaddress, tokenAddress)
            if (tokens) {
                setTokenName(tokens.name)
                setDecimals(isEmpty(tokens?.decimals) ? "" : parseInt(tokens?.decimals))
                setTokenSymbol(tokens.symbol)
            }
            else {
                setTokenName("")
                setDecimals("")
                setTokenSymbol("")
                Toastfn(`Switch the correct network`);

            }

        } catch (err) {
            console.error(err, "customtokenfetch error");
        }
    };

    useFocusEffect(
        useCallback(() => {
            let walletarray = UseWalletArray();
            let currenteindex = GetCurrentIndex();
            let TokenAdress = []
            walletarray[currenteindex][0]?.tokens?.map((item) => {
                TokenAdress.push(item?.address)

            })
            setTokenAddress(TokenAdress)

        }, [])

    )
    //import the custom token
    const importCustomToken = async () => {
        try {
            let customdata = CurrentWalletArray()
            let walletarray = UseWalletArray();
            let currenteindex = GetCurrentIndex();


            if (contractAddress == "") {
                return Toastfn(`Token Address required`);
            }
            if (TokenAddress.includes(contractAddress)) {

                return Toastfn(`Token Already Exisxts`);
            }
            else {
                const getCur = currentChainconfig[netWorkName]
                // var tokentype = netWorkName == 'BNB' ? "BEP20" : netWorkName == 'ETH' ? "ERC20" : "TRC20"
                let walletdata = Walletaddressfunction(customdata, netWorkName)
                var address_validation = await contractaddress_validation(
                    contractAddress,
                    getCur?.token_type,
                    walletdata.walletaddress,
                    walletdata.currency

                );
                console.log('address_validation---->',address_validation);
                if (address_validation == 'ok') {


                    var balance_obj = {
                        currency: tokenName,
                        type: "Token",
                        tokenType: getCur?.token_type,
                        contractAddress: contractAddress,
                        decimals: parseInt(decimals),
                        symbol: tokenSymbol,
                        status: "1",
                        walletaddress: walletdata.walletaddress,
                        privKey: walletdata.privKey,
                        enable: true,
                        testnet: walletdata.currency,

                    }

                    let currentwalletaddress = CurrentWalletArray()
                    currentwalletaddress.push(balance_obj)
                    Setcurrentwallet(currentwalletaddress)
                    walletarray[currenteindex][0].tokens.push(

                        {
                            "type": getCur?.token_type,
                            "address": contractAddress,
                            "decimals": parseInt(decimals),
                            "network": netWorkName,
                            "symbol": tokenSymbol,
                            "tokenname": tokenName,
                            "defaulttoken": false

                        },
                    )
                    Toastfn(`Token Added Successfully`);

                    SetWallets(walletarray)
                    navigation.navigate("Walletmain")

                }
                else {
                    Toastfn(`Invalid Contract Address`);
                }


            };
        }
        catch (error) {
            console.log("importCustomToken_err", error);
        }
    }



    //copy wallet address
    const fetchCopiedText = async () => {
        const text = await Clipboard.getString();
        setContractAddress(text)
        customtokenfetch(text, netWorkName)

    };

    //Chooose networks
    useFocusEffect(useCallback(() => {
        if (route?.params?.data) {
            setContractAddress(route?.params?.data)
            customtokenfetch(route?.params?.data, netWorkName)
        }
        let walletarray = UseWalletArray();
        let currenteindex = GetCurrentIndex();
        let data = walletarray[currenteindex]
        data.map((item) => {
            if (data[0].walletType == 'singlecoin') {

                const getCurrencies = currentChainconfig[data[0]?.network[0]];

                setCoinlist([getCurrencies])
                setNetworkimage(getCurrencies?.icon)
                setNetWorkName(data[0]?.network[0])
                setTokenName("")
                setDecimals("")
                setTokenSymbol("")

            }
            else {
                setCoinlist(Object.values(currentChainconfig).filter(val => val?.isTokenSupport))
                setNetworkimage(currentChainconfig.ETH.icon)
                setNetWorkName("ETH")

            }
        })

    }, [route?.params?.data])
    )


    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={{ flex: 1, backgroundColor: theme.background }} >
                <Header title={"Add Custom Token"} />

                <View style={style.box_container} >


                    <View style={style.card_container}>

                        <ScrollView showsVerticalScrollIndicator={false} >


                            <View style={style.innercard}>

                                <View style={style.inputrow}>

                                    <View style={style.inputsec}>
                                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <TextInput
                                                style={{
                                                    // paddingHorizontal: "12%",
                                                    marginHorizontal: "4%",
                                                    color: theme.text,
                                                    fontSize: RFPercentage(1.85),
                                                    fontFamily: Fonts.Regular,
                                                    borderRadius: borderradius * 0.5,
                                                    width: "80%",
                                                    height: deviceheight * 0.065
                                                }}
                                                onChangeText={(ContractAddress) => {
                                                    setContractAddress(ContractAddress);
                                                    customtokenfetch(ContractAddress, netWorkName)
                                                }}
                                                value={contractAddress}

                                                placeholder="Address"
                                                placeholderTextColor={C.textgrey}
                                            />

                                            <TouchableOpacity onPress={() => navigation.navigate("Walletconnectqr", { path: "Addcustomtokens" })}>
                                                <View >
                                                    {theme.theme == "dark" ? <Scan4 width={devicewidth * 0.065} height={devicewidth * 0.065} style={{ marginLeft: "4%" }} /> : <Scan5 width={devicewidth * 0.065} height={devicewidth * 0.065} style={{ marginLeft: "4%" }} />}


                                                </View>
                                            </TouchableOpacity>
                                        </View>



                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: "4%" }}>

                                        <TouchableOpacity onPress={fetchCopiedText}>
                                            <View style={style.rightinputsec}>
                                                <Text style={style.paralite}>Paste</Text>

                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                                <View style={style.inputrow}>

                                    <View style={style.inputsec}>
                                        <View style={style.leftinput}>
                                            <TextInput
                                                style={style.inputstyle}
                                                onChangeText={(tokenName) => {
                                                    setTokenName(tokenName);
                                                }} value={tokenName}
                                                placeholder="Name"
                                                keyboardType="numeric"
                                                placeholderTextColor="grey"
                                                editable={false}

                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={style.inputrow}>

                                    <View style={style.inputsec}>
                                        <View style={style.leftinput}>
                                            <TextInput
                                                style={style.inputstyle}
                                                onChangeText={(tokenSymbol) => {
                                                    setTokenSymbol(tokenSymbol);
                                                }}
                                                editable={false} value={tokenSymbol}
                                                placeholder="Symbol"
                                                keyboardType="numeric"
                                                placeholderTextColor="grey"

                                            />
                                        </View>



                                    </View>
                                </View>
                                <View style={style.inputrow}>

                                    <View style={style.inputsec}>
                                        <View style={style.leftinput}>
                                            <TextInput
                                                style={style.inputstyle}
                                                onChangeText={(decimals) => {
                                                    setDecimals(decimals);
                                                }}
                                                value={decimals?.toString()}

                                                placeholder="Decimal"
                                                keyboardType="numeric"
                                                placeholderTextColor="grey"
                                                editable={false}

                                            />
                                        </View>



                                    </View>
                                </View>


                                <View style={style.topsec}>
                                    <Text style={{
                                        color: C.textgrey,
                                        fontSize: RFPercentage(1.85),
                                        fontFamily: Fonts.Regular,
                                    }}>Network</Text>
                                    <Pressable onPress={() => refRBSheet.current.open()} >

                                        <View style={style.dbsheetsec} >
                                            <View>
                                                {networkimage}
                                            </View>
                                            <Text style={style.para}>
                                                {netWorkName}
                                            </Text>
                                            <Icon name="chevron-down-outline" color={theme.text} size={height / 45} />

                                        </View>
                                    </Pressable>
                                </View>
                            </View>





                        </ScrollView >


                    </View>
                </View>



                <View style={{ position: "absolute", bottom: "6%", left: 0, right: 0, }}>
                    <TouchableOpacity
                        disabled={tokenName == ""}
                        onPress={() => importCustomToken()}
                        style={style.create_button} >
                        <Button title={"Import"} colors={['#1AC6C9', '#3878C7', "#3D1E88"]} />
                    </TouchableOpacity>

                </View>

                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={false}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "transparent"
                        },
                        container: {
                            backgroundColor: theme.secondarybg,
                            borderRadius: 30
                        },
                        draggableIcon: {
                            backgroundColor: theme.theme == "dark" ? "#ffffff" : "#00001C"
                        }
                    }}
                >

                    {coinlist?.map((item) =>


                        <TouchableOpacity
                            onPress={() => {
                                setNetworkimage(item.icon);
                                setNetWorkName(item.currency);
                                setTimeout(() => {
                                    customtokenfetch(contractAddress, item?.currency);

                                }, 1000);
                                refRBSheet.current.close();
                            }}
                        >
                            <View style={style.coinlistsec}>
                                <View style={style.logoname}>
                                    <View>
                                        {item.icon}
                                    </View>

                                </View>
                                <Text style={style.para}>{item.currency}</Text>
                            </View>
                        </TouchableOpacity>)}
                </RBSheet>
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
            justifyContent: "center",
            alignItems: 'center',
        },
        card_container: {
            width: "90%",
            marginTop: "5%",
            alignSelf: "center",
            marginBottom: "5%"

        },
        innercard: {
            width: "100%",
            alignItems: "center"

        },
        para: {
            fontSize: RFPercentage(1.75),
            color: theme.text,
            fontFamily: Fonts.Regular,


        },
        paragrey: {
            marginTop: '2%',
            fontSize: RFPercentage(1.95),
            color: "#ffffff",
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },


        paralite: {
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
            fontFamily: Fonts.Regular,
            textAlign: "center"

        },
        gradTitle1: {
            fontSize: RFPercentage(2.35),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            textAlign: "left"

        },
        inputtitle: {
            fontSize: RFPercentage(1.85),
            color: "#010101",
            fontFamily: Fonts.Regular,
        },
        inputsec: {
            backgroundColor: theme.secondarybg,
            borderRadius: borderradius * 0.5,
            width: "100%",
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: "2%",
            height: deviceheight * 0.065

        },
        leftinput: {
            width: "100%"
        },
        rightinput: {
            width: "25%",

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
            marginBottom: "4%",

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
        pasterow: {
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: "space-between"
        },
        topsec: {

            flexDirection: 'row',
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: theme.secondarybg,
            alignItems: "center",
            borderRadius: borderradius * 0.5,
            height: deviceheight * 0.069,
            paddingHorizontal: "4%"



        },
        coinlistsec: {
            flexDirection: "row",
            gap: 5,
            alignItems: 'center',
            paddingHorizontal: '10%',
            paddingVertical: "2%"

        },
        dbsheetsec: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",



        },
        listlogoimgnet: {
            width: 50,
            height: 50,

        }



    })