/** packages*/

import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, ActivityIndicator, TouchableOpacity, View, ScrollView, BackHandler, Pressable, Dimensions, RefreshControl, Image } from "react-native";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import LinearGradient from "react-native-linear-gradient";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import { UseWalletArray, GetCurrentIndex, Setcurrentwallet, GetDefaultcurrencies, SetTronbalance, } from "../../Utilities/usestorage";
import { cryptoBlanace, tokenBlanace } from "../../Network_controllers/EVM/Evm_contracthook";
import { DecryptPrivateKey, Name_showing, fiatcurrencies, showImage } from "../../Utilities/commenfuctions";
import { useDispatch, useSelector } from "react-redux";
import { defaultCurrencies, selectCurrencyForTransaction } from "../../Redux/Actions/Defaultcurrencies";
import { isEmpty } from "../../Utilities/commenfuctions";
import Notifi from "../../Assets/caexicons/noti1.svg"
import Icon from 'react-native-vector-icons/Ionicons';
// import Logo1 from "../../Assets/caexicons/logo1.svg"
import Logo1 from "../../Assets/Images/image_2024_12_05T08_07_29_039Z (1) 12 1.svg"
import EmptyBox from '../../Assets/Images/empty-box-svgrepo-com.svg';
import LottieView from "lottie-react-native";
import { lotties } from "../../Utilities/images";
import { schema } from "../../Utilities/walletschema";
import { Toastfn } from "../../Utilities/toast";
import logo from '../../Assets/Images/image_2024_12_05T08_07_29_039Z (1) 1 (1).png'
import { onAccountChange } from "../../NewWalletConnect/utils/WalletConnectUtills";
import { BeatifyConsole } from "../../NewWalletConnect/utils/common";
import PageLoader from "../../NewWalletConnect/components/PageLoader";
import Toast from "react-native-toast-message";
import { currentChainconfig } from "../../api/ApiConstants";
import { localnotification } from "../../Utilities/pushnotification";

const { height } = Dimensions.get('window');

const isPhone = devicewidth < 600;
export default function WalletHome({ navigation }) {

    const theme = useContext(themeContext);
    const style = styles(theme);

    const [currency, setCurrency] = useState([]);

    const [tokenslist, setTokenslist] = useState([])
    const [CurrentAccount, setCurrentAccount] = useState([])
    const [TotalconvertBal, setTotalConvertBal] = useState(0);
    const [loader, setloader] = useState(true);
    const [tabbar, setTabbar] = useState(false)
    console.log('loaderloader---->', JSON.stringify(currency, null, 2));
    console.log('lcoao---->', loader);
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();

    // console.log('currencycurrency---->', currency, tokenslist);

    //Fiat defaultcurrencies dispatch
    const choosecurrencies = (item) => dispatch(defaultCurrencies(item));
    const selectAcurrency = (item) => dispatch(selectCurrencyForTransaction(item));

    const currenciessymbol = useSelector(
        (state) => state.defaultcurrencies.Currencies
    )



    // Get Current Fiat defaultcurrencies
    useFocusEffect(
        useCallback(() => {

            (async () => {
                
                let fiatcurrencies = GetDefaultcurrencies()
                if (isEmpty(fiatcurrencies)) {
                    choosecurrencies({ choosedcurrencies: "USD" })
                }
                else {
                    if (fiatcurrencies == 'USD') {
                        choosecurrencies({ choosedcurrencies: "USD" })
                    }
                    else {
                        choosecurrencies({ choosedcurrencies: (JSON.parse(fiatcurrencies)) })
                    }
                }
                // import { CommonActions } from '@react-navigation/native';


            })()
        }, []))

    useFocusEffect(
        useCallback(() => {
            let walletarray = UseWalletArray();
            let currenteindex = GetCurrentIndex();
            let data = walletarray[currenteindex]
            // BeatifyConsole("walletarray", walletarray)
            // console.log('datadatadatadatadata---->',data);
            setloader(true)
            TokenDetails()
            Cryptodetails()
        }, [currenciessymbol]))

    useFocusEffect(
        useCallback(() => {
            if (currency.length !== 0)
                Total_Balncefunction()
        }, [currency]))

    useFocusEffect(
        useCallback(() => {

            if (tokenslist.length > 0 && currency.length > 0) {
                setloader(false)
                Setcurrentwallet([...tokenslist, ...currency])
            }
        }, [tokenslist, currency]))

    /**Backfunction */
    useFocusEffect(
        React.useCallback(() => {

            const onBackPress = () => {
                BackHandler.exitApp();
                return true;
            };
            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );
            return () => {
                subscription.remove()
                //     BackHandler.removeEventListener("hardwareBackPress", onBackPress);


            };
        }, [navigation])
    );


    /** To get Default token details and Import token details*/
    const TokenDetails = async () => {

        try {
            setCurrency([]);
            setTokenslist([]);

            var walletarray = UseWalletArray();
            var currenteindex = GetCurrentIndex();
            let data = walletarray[currenteindex]


            /**Import Tokendetails */
            // var Defaultokensdata = currentwalletaddress.filter(val => val.type == "Token" && data[0].tokens.includes(val.contractAddress))
            let Defaultokensdata = data[0].tokens
            console.log('Defaultokensdata---->', Defaultokensdata);
            var TokenArr = []
            if (data[0]?.tokens?.length > 0) {


                await Promise.all(
                    Defaultokensdata.map(async (item, index) => {

                        var Tokendetails = { ...schema }


                        let FIatData = await getfiatdata(Array(item.symbol), Tokendetails.balance);
                        console.log('FIatData---->', FIatData);
                        Tokendetails.currency = item.tokenname,
                            Tokendetails.type = 'Token',
                            Tokendetails.tokenType = item.type,
                            Tokendetails.decimals = item.decimals,
                            Tokendetails.symbol = item.symbol,
                            Tokendetails.currencyName = item.network,
                            Tokendetails.status = '1',
                            Tokendetails.defaulttoken = item.defaulttoken,
                            Tokendetails.enable = true,
                            Tokendetails.fiatbalance = FIatData.fiatbalance
                        Tokendetails.usdprice = FIatData.fiatstatus || 0
                        Tokendetails.contractAddress = item.address


                        if (item.type == "TRC20") {
                            Tokendetails.walletaddress = data[0].walletaddress.tron
                            Tokendetails.privKey = data[0].privateKey.tron
                            Tokendetails.balance = await tokenBlanace(item?.address, data[0].privateKey.tron, item?.network, item.decimals, data[0].walletaddress.tron, item.network)//to get token balnace

                        }
                        else {

                            Tokendetails.walletaddress = data[0].walletaddress.evm
                            Tokendetails.privKey = data[0].privateKey.evm
                            Tokendetails.balance = await tokenBlanace(item?.address, data[0].privateKey.evm, item?.network, item.decimals, data[0].walletaddress.evm, item.network)//to get token balnace
                        }
                        TokenArr[index] = (Tokendetails)

                    }

                    )
                )
            }


            setTokenslist(TokenArr)
            setRefreshing(false);


        }
        catch (err) {
            console.log("getWalletData_wallethome_err", err);
        }

    };

    /** Currency Details */
    const Cryptodetails = async () => {
        try {

            // setloader(true)
            var walletarray = UseWalletArray();
            var currenteindex = GetCurrentIndex();
            console.log('walletarray---->', walletarray);
            let data = walletarray[currenteindex]

            setCurrentAccount(data)
            let currencyArr = []
            await Promise.all(
                data[0].network.map(async (item, index) => {



                    let Currencydetails = { ...schema }

                    Currencydetails.ind = data[0].id,
                        Currencydetails.currency = item,
                        Currencydetails.type = "Crypto",
                        Currencydetails.walletname = data[0].walletname,
                        Currencydetails.walletaddress = item == 'TRX' ? data[0].walletaddress.tron : item == 'BTC' ? data[0].walletaddress.btc : data[0].walletaddress.evm,
                        Currencydetails.privKey = item == 'TRX' ? data[0].privateKey.tron : item == 'BTC' ? data[0].privateKey.btc : data[0].privateKey.evm,
                        Currencydetails.currencyName = item,
                        Currencydetails.mnemonic = data[0].mnemonic,
                        Currencydetails.id = data[0].id,
                        Currencydetails.walletType = data[0]?.walletType,
                        Currencydetails.testnet = item,
                        Currencydetails.tokenType = currentChainconfig[item]?.token_type
                    Currencydetails.balance = await cryptoBlanace(
                        data[0].privateKey[item == 'TRX' ? "tron" : item == 'BTC' ? "btc" : "evm"],
                        item,
                        data[0].walletaddress[item == 'TRX' ? "tron" : item == 'BTC' ? "btc" : "evm"]
                    );
                    //   to get coin balnace

                    let FIatData = await getfiatdata(Array(Currencydetails.currencyName), Currencydetails.balance)  //fiat balance

                    Currencydetails.fiatbalance = FIatData.fiatbalance
                    Currencydetails.usdprice = FIatData.fiatstatus



                    currencyArr.push(Currencydetails)
                })

            )
            setCurrency(currencyArr)

            //Tron balance update delay
            let Tron_balance = currencyArr.filter((val) => val?.tokenType == "TRC20")[0]?.balance
            if (Tron_balance) {
                SetTronbalance(JSON.stringify(Tron_balance))

            }
            setRefreshing(false);




        }
        catch (err) {
            console.log("Currencydetails_err", err
            );
        }
    }
    /** To get fiat currency details*/
    const getfiatdata = async (Asset, Assetbalance) => {
        let Currentfiat = currenciessymbol?.choosedcurrencies ? currenciessymbol?.choosedcurrencies : 'USD'

        let Fiatdata = await fiatcurrencies(Asset, Currentfiat)
        let Convertedbalance = Fiatdata[0][Currentfiat] * Assetbalance
        return { fiatbalance: Convertedbalance.toFixed(3), fiatstatus: Fiatdata[0][Currentfiat] }

    }

    /** Total Crypto balance*/
    const Total_Balncefunction = async () => {

        const sum = currency.reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.fiatbalance);
        }, 0)
        setTotalConvertBal(sum == 0 ? 0 : sum.toFixed(3))
    }

    const tabfirst = () => {
        setTabbar(!tabbar)
    };

    //Refresh Controller
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        let walletarray = UseWalletArray();
        let currenteindex = GetCurrentIndex();
        let data = walletarray[currenteindex]
        TokenDetails()
        Cryptodetails()

    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} >
            <StatusBar backgroundColor={theme.background} />
            <View style={style.container}  >

                <LinearGradient
                    style={{
                        width: "100%",
                        height: deviceheight * 0.36,
                        borderBottomLeftRadius: borderradius * 1,
                        borderBottomRightRadius: borderradius * 1,
                        alignItems: "center",
                        // borderBottomColor: "#123776",
                        // borderBottomWidth: 1.5,
                        shadowColor: '#19438C', // Shadow color
                        shadowOffset: { width: 0, height: -10 }, // Negative for top shadow
                        shadowOpacity: 0.5,
                        shadowRadius: 10,
                        elevation: 10, // Android shadow

                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#00001C', '#00001C']}
                >
                    <View style={{ width: "100%", alignItems: "center", justifyContent: "center", marginTop: "8%" }}>
                        <View style={{ width: "90%" }}>
                            <View style={{ justifyContent: "space-between", flexDirection: "row", alignItems: "center", marginBottom: "10%" }}>
                                <Pressable style={style.leftcontainer}  >
                                    <Logo1 width={devicewidth * 0.09} height={devicewidth * 0.09} style={style.leftcontainer} />
                                    {/* <Image source={logo} style={{height:10,width:10}} /> */}
                                </Pressable>
                                <Pressable
                                    style={{ width: "33%" }}
                                    onPress={() => navigation.navigate("Walletlisting")}
                                >
                                    <LinearGradient
                                        colors={['#26263e', '#26263e',]}
                                        start={{ x: 0, y: 0.5 }}
                                        end={{ x: 1, y: 0.5 }}
                                        style={{
                                            width: "100%",
                                            height: deviceheight * 0.0400,
                                            borderRadius: borderradius * 1,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexDirection: "row"
                                        }}
                                    >
                                        <Text style={{
                                            fontFamily: Fonts.Regular,
                                            fontSize: RFPercentage(1.9),
                                            color: "#fff",
                                            textAlign: "center",
                                            marginRight: "3%"
                                        }} >{Name_showing(CurrentAccount[0]?.walletname)}</Text>
                                        <Icon name="chevron-down-outline" color="#fff" size={height / 45} />
                                    </LinearGradient>

                                </Pressable>
                                <Pressable onPress={() => navigation.navigate("Notifylist")}
                                    style={style.leftcontainer} >
                                    <Notifi width={devicewidth * 0.09} height={devicewidth * 0.09} style={style.leftcontainer} />
                                </Pressable>
                            </View>


                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: "10%" }}>
                                <View>
                                    <Text style={{
                                        fontSize: RFPercentage(1.95),
                                        color: "#fff",
                                        fontFamily: Fonts.Regular,
                                        marginBottom: "5%"
                                    }}>Total Balance</Text>
                                    {loader ?
                                        <Text style={style.parablue}>
                                            {(currenciessymbol.choosedcurrencies == "USD" && "$") ||
                                                (currenciessymbol.choosedcurrencies == "GBP" && "£") ||
                                                (currenciessymbol.choosedcurrencies == "EUR" && "€")}{" "}
                                            0</Text>
                                        :
                                        <Text style={style.parablue}>
                                            {(currenciessymbol.choosedcurrencies == "USD" && "$") ||
                                                (currenciessymbol.choosedcurrencies == "GBP" && "£") ||
                                                (currenciessymbol.choosedcurrencies == "EUR" && "€")}{" "}

                                            {TotalconvertBal}</Text>
                                    }
                                </View>




                            </View>

                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>

                                <LinearGradient
                                    colors={['#3db5a6', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']}
                                    locations={[0, 0.7, 1]}  // Color stops at 0%, 70%, and 100%
                                    start={{ x: 0.1, y: 0 }}  // Slightly right of top-left
                                    end={{ x: 1, y: 0.9 }}    // Bottom-right for 132deg
                                    style={{ width: "30%", padding: "4.2%", borderRadius: borderradius * 2.5, alignItems: "center" }}
                                >
                                    <Pressable
                                        onPress={() => currency?.length !== 0 && tokenslist?.length !== 0 && navigation.navigate('Walletsend')}
                                    >
                                        <Text style={{
                                            fontSize: RFPercentage(1.95),
                                            color: "#fff",
                                            fontFamily: Fonts.Regular,
                                        }}>Send</Text>
                                    </Pressable>
                                </LinearGradient>

                                <LinearGradient
                                    colors={['rgba(26,198,201,1)', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']}
                                    locations={[0, 0.7, 1]}  // Color stops at 0%, 70%, and 100%
                                    start={{ x: 0.1, y: 0 }}  // Slightly right of top-left
                                    end={{ x: 1, y: 0.9 }}    // Bottom-right for 132deg
                                    style={{ width: "30%", padding: "4.2%", borderRadius: borderradius * 2.5, alignItems: "center" }}
                                >
                                    <Pressable
                                        onPress={() => navigation.navigate('Walletrecieve')}
                                    >
                                        <Text style={{
                                            fontSize: RFPercentage(1.95),
                                            color: "#fff",
                                            fontFamily: Fonts.Regular,
                                        }}>Receive</Text>
                                    </Pressable>
                                </LinearGradient>


                                <LinearGradient
                                    colors={['rgba(26,198,201,1)', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']}
                                    locations={[0, 0.7, 1]}  // Color stops at 0%, 70%, and 100%
                                    start={{ x: 0.1, y: 0 }}  // Slightly right of top-left
                                    end={{ x: 1, y: 0.9 }}    // Bottom-right for 132deg
                                    style={{ width: "30%", padding: "4.2%", borderRadius: borderradius * 2.5, alignItems: "center" }}
                                >
                                    <Pressable
                                        onPress={() => navigation.navigate('Cryptobuy')}
                                    // style={{ width: "30%", backgroundColor: "transparent", padding: "4.2%", borderColor: "#3db4a6", borderWidth: 1, borderRadius: borderradius * 2.5, alignItems: "center" }}
                                    >
                                        <Text style={{
                                            fontSize: RFPercentage(1.95),
                                            color: "#fff",
                                            fontFamily: Fonts.Regular,
                                        }}>Buy</Text>
                                    </Pressable>
                                </LinearGradient>
                            </View>


                        </View>
                    </View>

                </LinearGradient>

                {!tabbar ?
                    <View style={style.btnview}>
                        <TouchableOpacity style={style.tab_button} >
                            <View

                                style={{
                                    width: "100%",
                                    height: deviceheight * 0.0625,
                                    // borderRadius: borderradius * 0.5,
                                    justifyContent: "center",
                                    // borderBottomColor:"#000",
                                    // borderBottomWidth:borderradius*0.1
                                }}
                            >
                                <Text style={{
                                    fontSize: RFPercentage(2.3),
                                    color: theme.theme == "dark" ? "#FFFFFF" : "#173782",
                                    fontFamily: Fonts.Regular,
                                    textAlign: "center",
                                }} >Tokens</Text>

                            </View>
                            <LinearGradient
                                colors={['#1AC6C9', '#3878C7', "#3D1E88"]} // Gradient from transparent to black
                                start={{ x: 0, y: 0 }} // Starting point (left)
                                end={{ x: 1, y: 0 }}   // Ending point (right)
                                style={{
                                    position: 'absolute',
                                    borderRadius: 2,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: 3, // Height of the gradient
                                }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={tabfirst}
                            style={style.tab_button} >
                            <View style={style.borderbtn} >
                                <Text style={style.borderbtntext} >Currencies</Text>
                            </View>


                        </TouchableOpacity>
                    </View>
                    :
                    <View style={style.btnview}>

                        <TouchableOpacity
                            onPress={tabfirst}
                            style={style.tab_button} >
                            <View style={style.borderbtn}  >
                                <Text style={style.borderbtntext} >Tokens</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity


                            style={style.tab_button} >
                            <View

                                style={{
                                    width: "100%",
                                    height: deviceheight * 0.0625,
                                    borderRadius: borderradius * 0.5,
                                    justifyContent: "center"
                                }}
                            >
                                <Text style={{
                                    fontSize: RFPercentage(2.3),
                                    color: theme.theme == "dark" ? "#FFFFFF" : "#173782",
                                    fontFamily: Fonts.Regular,
                                    textAlign: "center",
                                }} >Currencies</Text>

                            </View>
                            <LinearGradient
                                colors={['#1AC6C9', '#3878C7', "#3D1E88"]} // Gradient from transparent to black
                                start={{ x: 0, y: 0 }} // Starting point (left)
                                end={{ x: 1, y: 0 }}   // Ending point (right)
                                style={{
                                    position: 'absolute',
                                    borderRadius: 2,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: 3, // Height of the gradient
                                }}
                            />
                        </TouchableOpacity>

                    </View>
                }

                <View style={style.box_container} >



                    <>


                        <View style={style.tabbtnsec}>

                            {loader ?
                                <></>
                                // <View style={{ height: '70%', justifyContent: 'center' }} >
                                //     <ActivityIndicator color={theme.theme == "dark" ? "#fff" : "#00001C"} size={"large"} />
                                // </View>
                                :

                                <>
                                    {!tabbar ?
                                        (
                                            tokenslist?.length == 0 ?

                                                <View style={isPhone ? style.tabcontent : style.tabcontent1}>
                                                    <ScrollView showsVerticalScrollIndicator={false} >

                                                        <Pressable style={style.no_asset_found} >
                                                            <EmptyBox width={devicewidth * 0.22} height={devicewidth * 0.22} />
                                                        </Pressable>


                                                        <Text style={style.paraempty}>No Asset Found !</Text>
                                                        {CurrentAccount[0]?.tokens?.length

                                                            > 0 ? <TouchableOpacity
                                                                onPress={() => navigation.navigate('Addcustomtokens')}
                                                                style={{
                                                                    width: "35%",
                                                                    marginTop: "5%",
                                                                    padding: "3%",
                                                                    alignItems: "center", backgroundColor: theme.background, borderRadius: borderradius * 0.5, justifyContent: "center", alignSelf: "center", borderWidth: 1.5, borderColor: theme.theme == "dark" ? "#2FACA4" : "#173782"
                                                                }}>

                                                            <Text style={{
                                                                fontFamily: Fonts.Medium,
                                                                fontSize: RFPercentage(2),
                                                                color: theme.theme == "dark" ? "#2FACA4" : "#0D1A82",
                                                                textAlign: "center",
                                                            }} >Add Tokens</Text>
                                                        </TouchableOpacity>
                                                            :

                                                            <TouchableOpacity
                                                                onPress={() => Toastfn("Doesn't add tokens for Bitcoin network")}
                                                                style={{
                                                                    width: "35%",
                                                                    marginTop: "10%",
                                                                    padding: "3%",
                                                                    alignItems: "center", backgroundColor: theme.background, borderRadius: borderradius * 0.5, justifyContent: "center", alignSelf: "center", borderWidth: 1.5, borderColor: theme.theme == "dark" ? "#2FACA4" : "#0D1A82"
                                                                }}>

                                                                <Text style={{
                                                                    fontFamily: Fonts.Medium,
                                                                    fontSize: RFPercentage(2),
                                                                    color: theme.theme == "dark" ? "#2FACA4" : "#0D1A82",
                                                                    textAlign: "center",
                                                                }} >Add Tokens</Text>
                                                            </TouchableOpacity>

                                                        }


                                                    </ScrollView>

                                                </View> :

                                                <View style={style.tabcontent}>
                                                    <ScrollView
                                                        refreshControl={
                                                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                                                        showsVerticalScrollIndicator={false} >

                                                        {tokenslist?.map((item) =>
                                                            <>

                                                                {item.enable &&
                                                                    <TouchableOpacity onPress={() => { selectAcurrency(item); navigation.navigate('Tokentranscations', { data: item }) }}>
                                                                        <View >
                                                                            <View style={style.listsec}>
                                                                                <View style={style.listname}>
                                                                                    <View>
                                                                                        {showImage(item?.tokenType, 0.13, 0.04)}
                                                                                    </View>
                                                                                    <View>
                                                                                        <Text style={style.listtitle}>{item?.currency}</Text>
                                                                                        <Text style={style.listprice}>

                                                                                            {(currenciessymbol.choosedcurrencies == "USD" && "$") ||
                                                                                                (currenciessymbol.choosedcurrencies == "GBP" && "£") ||
                                                                                                (currenciessymbol.choosedcurrencies == "EUR" && "€")}{" "}

                                                                                            {item?.usdprice}</Text>
                                                                                    </View>
                                                                                </View>
                                                                                <View>
                                                                                    <Text style={style.listtotal}>{(item.balance.toFixed(6))} {item.symbol}</Text>
                                                                                </View>
                                                                            </View>


                                                                        </View>
                                                                    </TouchableOpacity>}

                                                            </>
                                                        )
                                                        }

                                                    </ScrollView>
                                                    {CurrentAccount[0]?.tokens?.length > 0
                                                        ?
                                                        <TouchableOpacity
                                                            onPress={() => navigation.navigate('Addcustomtokens')}
                                                            style={{
                                                                width: "35%",
                                                                // marginTop: "10%",
                                                                padding: "3%",
                                                                alignItems: "center",
                                                                // backgroundColor: theme.background,
                                                                backgroundColor: "theme.background",
                                                                borderRadius: borderradius * 0.5,
                                                                justifyContent: "center",
                                                                alignSelf: "center",
                                                                borderWidth: 1.5,
                                                                borderColor: theme.theme == "dark" ? "#2FACA4" : "#0D1A82"
                                                            }}>

                                                            <Text style={{
                                                                fontFamily: Fonts.Medium,
                                                                fontSize: RFPercentage(2),
                                                                color: theme.theme == "dark" ? "#2FACA4" : "#0D1A82",
                                                                textAlign: "center",
                                                            }} >Add Tokens</Text>
                                                        </TouchableOpacity>
                                                        :
                                                        <></>
                                                    }

                                                </View>) :
                                        (
                                            !currency.length != 0 ?

                                                <View style={isPhone ? style.tabcontent : style.tabcontent1}>
                                                    <ScrollView showsVerticalScrollIndicator={false} >
                                                        <Pressable style={[style.no_asset_found, { paddingVertical: "8%" }]} >
                                                            <EmptyBox width={devicewidth * 0.22} height={devicewidth * 0.22} />
                                                        </Pressable>
                                                        <Text style={style.paraempty}>No Asset Found !</Text>
                                                    </ScrollView>



                                                </View> :
                                                <View style={style.tabcontent}>
                                                    <ScrollView
                                                        refreshControl={
                                                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                                                        showsVerticalScrollIndicator={false} >


                                                        {currency?.map((item) =>

                                                            <TouchableOpacity onPress={() => { selectAcurrency(item); navigation.navigate('Tokentranscations', { data: item }) }}>
                                                                <View >


                                                                    <View style={style.listsec}>
                                                                        <View style={style.listname}>
                                                                            <View>
                                                                                {showImage(item?.tokenType || "", 0.13, 0.04)}
                                                                            </View>
                                                                            <View>
                                                                                <Text style={style.listtitle}>{item.currency}</Text>
                                                                                <Text style={style.listprice}>
                                                                                    {(currenciessymbol.choosedcurrencies == "USD" && "$") ||
                                                                                        (currenciessymbol.choosedcurrencies == "GBP" && "£") ||
                                                                                        (currenciessymbol.choosedcurrencies == "EUR" && "€")}{" "}

                                                                                    {item?.usdprice}</Text>
                                                                            </View>
                                                                        </View>
                                                                        <View>
                                                                            <Text style={style.listtotal}>{(item.balance)?.toFixed(6)} {item?.currencyName}</Text>
                                                                        </View>
                                                                    </View>


                                                                </View>
                                                            </TouchableOpacity>
                                                        )}
                                                    </ScrollView>
                                                </View>)

                                    }
                                </>
                            }



                        </View>
                    </>
                </View>
            </View>

            {loader && <PageLoader />}
        </SafeAreaView>
    )
}

const styles = (theme) =>
    StyleSheet.create({

        headertext: {
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: Fonts.Medium,
            fontSize: RFPercentage(2.5),
            color: "#fff"
        },
        leftcontainer: {
            // width: "10%",
            // borderRadius: borderradius * 2.5,
            // justifyContent: "center",
            // padding: "2.85%",
            // marginLeft: "2%"
        },

        no_asset_found: {
            // backgroundColor:"red",
            marginTop: "10%",
            // padding:"5%",
            justifyContent: "center",
            alignItems: "center",

        },

        rightcontainer: {
            width: "10%",
            borderRadius: borderradius * 2.5,
            justifyContent: "center",
            padding: "2.85%",
            marginRight: "3%"
        },
        arrowimg: {
            alignSelf: "center",
            resizeMode: "contain"
        },
        container: {
            flex: 1,
            backgroundColor: theme.background

        },
        box_container: {
            height: "90%",
            width: '100%',
            alignSelf: 'center',
            paddingHorizontal: "5%",
            backgroundColor: theme.background

        },
        card_container: {
            width: "100%",
            backgroundColor: "#FEF0E5",
            alignSelf: "center",
            borderRadius: borderradius * 0.7,
            paddingVertical: "5%",
            paddingHorizontal: "5%",
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0,
            shadowRadius: 4,
            elevation: 5,
            bottom: "0%",

        },

        para: {
            fontSize: RFPercentage(1.85),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular
        },
        listtitle: {
            fontSize: RFPercentage(2.15),
            color: theme.text,
            fontFamily: Fonts.Regular
        },
        listprice: {
            fontSize: RFPercentage(1.85),
            color: theme.text,
            fontFamily: Fonts.Medium
        },
        listtotal: {
            fontSize: RFPercentage(2.05),
            color: theme.text,
            fontFamily: Fonts.Medium
        },
        paraempty: {
            fontSize: RFPercentage(1.85),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: "center",
            marginTop: "4%"
        },
        titlepara: {
            fontSize: RFPercentage(2.35),
            color: "#683cf0",
            fontFamily: Fonts.Medium
        },
        para1: {
            fontSize: RFPercentage(1.85),
            color: "#010101",
            fontFamily: Fonts.Regular
        },
        parablue: {
            fontSize: RFPercentage(4),
            color: "#FFFFFF",
            fontFamily: Fonts.Bold
        },
        paragrey: {
            fontSize: RFPercentage(1.85),
            color: "#010101",
            fontFamily: Fonts.Regular
        },
        paragrey1: {
            fontSize: RFPercentage(1.85),
            color: "#010101",
            fontFamily: Fonts.Regular
        },
        pfnamesec: {
            marginBottom: "5%"
        },
        cardtopsec: {
            flexDirection: 'row',
            justifyContent: "space-between",
            alignItems: "center"
        },
        cardbtnsec: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "7%",
            paddingHorizontal: "8%",
        },
        btnicon: {
            alignSelf: "center"
        },
        tabbtnsec: {
            width: "100%",
        },
        btnview: {
            flexDirection: 'row',
            width: '100%',
            // marginTop: "2.5%",
            marginVertical: "2%",
            justifyContent: 'space-between',
            borderBottomColor: theme.theme == "dark" ? "#16293A" : "#e0e2e4",
            borderBottomWidth: 1,
            // backgroundColor: "red"
        },
        tab_button: {
            width: "50%",

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
            marginTop: "10%",
            width: "68%",
            alignSelf: "center",
            marginBottom: "20%"
        },

        contentsec: {
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: "7%"
        },
        gradTitle: {
            fontSize: RFPercentage(2.25),
            color: "#9ACFFF",
            fontFamily: Fonts.Medium,
            textAlign: "center",
            marginTop: '15%'

        },
        gradTitle1: {
            fontSize: RFPercentage(2.25),
            color: "#010101",
            fontFamily: Fonts.Medium,
            textAlign: "center",
            marginTop: "3%",

        },
        tabcontent: {
            marginTop: "2%",
            height: "73%",
            // backgroundColor:"red"
        },
        tabcontent1: {
            height: "50%",
        },
        emptyicon: {
            marginTop: "15%",
            alignSelf: "center"
        },
        imgsec: {
            marginTop: "20%",
            marginBottom: "3%"
        },
        Signinsec: {
            marginTop: "5%"
        },
        borderbtn: {
            height: deviceheight * 0.0625,
            justifyContent: "center"
        },
        borderbtntext: {
            fontSize: RFPercentage(2.3),
            color: theme.theme == "dark" ? "#A3A3B7" : "#777777",
            fontFamily: Fonts.Regular,
            textAlign: "center",
        },
        listsec: {
            flexDirection: 'row',
            justifyContent: "space-between",
            paddingVertical: "3%",
            alignItems: 'center'
        },
        listname: {
            flexDirection: 'row',
            alignItems: "center",
            gap: 10,

        },
        listlogoimg: {
            borderRadius: 50,
            paddingHorizontal: 6

        },

        // modalstyle
        centeredView: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
        },
        modalView: {
            backgroundColor: "#FEF0E5",
            width: "70%",
            alignSelf: 'center',
            borderRadius: borderradius * 0.5,
            height: "35%",
            position: "relative",

        },
        modalinner: {
            paddingHorizontal: "10%",
            paddingVertical: "5%",
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: "center",
            height: '70%',
            marginTop: "-6%"
        },
        closeicon: {
            right: 10,
            top: 0
        },
        modalText: {
            color: "#19233F",
            fontSize: RFPercentage(2.4),
            fontFamily: Fonts.Medium,
            textAlign: "center",
            lineHeight: 30

        },

        horizontal: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
        },


    })