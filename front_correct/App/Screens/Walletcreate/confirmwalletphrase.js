/** Packages*/
import React, { useEffect, useState, useContext, useCallback } from "react";
import {
    TouchableOpacity,
    Text,
    View,
    SafeAreaView,
    Image,
    StyleSheet,
    StatusBar,
    Pressable,
    BackHandler
} from "react-native";

import { borderradius, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import LinearGradient from "react-native-linear-gradient";
import Button from "../../Components/Button";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import themeContext from "../../Utilities/themecontext";
import { Fonts } from "../../Utilities/fonts";
import Header from "../../Navigations/Header";
import { Toastfn } from "../../Utilities/toast";
import { UseWalletArray, AddWallet, SetCurrentIndex } from "../../Utilities/usestorage";
import { Defaulttokens, primarycurrency } from "../../api/ApiConstants"
import { C } from "../../Utilities/colors";
import { createTronWallet } from "../../Network_controllers/TRON/Tron_controller";
import Loader from "../../Components/loader";
import { Notification } from "../../Utilities/axios";
import PushNotification from "react-native-push-notification";
import { createEvmWallet } from "../../Network_controllers/EVM/Evm_contracthook";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import { createBtcWallet } from "../../Network_controllers/BTC/Bitcoin_controller";
import { onAccountChange } from "../../NewWalletConnect/utils/WalletConnectUtills";
import { sleep } from "../../NewWalletConnect/utils/common";
import Icon from 'react-native-vector-icons/Ionicons';

const ConfirmWalletPharse = ({ navigation }) => {


    //redux
    const seedDataFromRedux = useSelector(
        (state) => state.seedDataReducer.seedData
    );

    //theme config
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [seedList, seedListArray] = useState([]);
    const [selectedKeyPhraseArray, setSelectedKeyPhraseArray] = useState("");
    const [CorrectOrder, setCorrectOrder] = useState("");
    const [newArrayValue, setnewArrayValue] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(""); useState(0);

    var Notifications = false

    useFocusEffect(

        React.useCallback(() => {

            const onBackPress = () => {
                navigation.navigate('Copywalletphrase', "scantophrase")
                return true

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




    /**Wallet Details */
    useEffect(() => {
        let walletarray = UseWalletArray();
        // let ind = walletarray.length > 0 ? parseInt(walletarray[0][walletarray[0].length - 1].id)+1  : walletarray.length;
        setName("Account " + String(parseInt(walletarray.length <= 0 ? 0 : walletarray[walletarray?.length - 1][0]?.id) + 1))

    }, [name])





    /** Get seed phrase */
    useFocusEffect(
        useCallback(() => {
            const seedList1 = seedDataFromRedux
            const seedListArr = seedList1.split(" ");
            const tempList = seedListArr.map((str, index) => ({
                value: str,
                id: index + 1,
                checked: false,
            }));

            if (seedList?.length === 0) {
                seedListArray(
                    JSON.parse(
                        JSON.stringify(tempList.sort(() => 0.5 - Math.random()))
                    )
                );
            }
        }, [newArrayValue])
    )

    const validateSeed = selectedKeyPhraseArray.toString();
    const replace = validateSeed.replace(/,/g, " ");


    /** Notification For Receive */

    const Notificationdata = async (walletArr) => {
        try {
            let payload = {}

            PushNotification.configure({
                onRegister: async function (token) {
                    payload = {
                        Evmwalletaddress: (walletArr[0]?.walletaddress.evm)?.toLowerCase(),
                        Tronwalletaddress: (walletArr[0]?.walletaddress.tron)?.toLowerCase(),
                        token: token.token,
                        wallettype: 'multicoin'

                    };


                }

            })
            var { status } = await Notification(payload)
            Notifications = status

        }
        catch (err) {
            console.log("Notificationdata_err", e);

        }
    }
    /** To  Get Wallet Details */


    /** validate the given phrase*/
    const seedvalidateMultiCoin = async () => {
        setLoading(true);
        console.log("replacereplacereplace", replace);
        await sleep(500)
        try {
            const [evmWallet, tronwallet, btcwallet] = await Promise.all([
                await createEvmWallet(replace.trim()),
                await createTronWallet(replace.trim()),
                await createBtcWallet(replace.trim())
            ])
            // const evmWallet = await createEvmWallet(replace.trim())
            // const tronwallet = await createTronWallet(replace.trim())
            // const btcwallet = await createBtcWallet(replace.trim())
            console.log("evmWalletevmWalletevmWallet", evmWallet, btcwallet);

            let walletArr = [];

            if (evmWallet && btcwallet) {
                setLoading(true);

                let walletarray = UseWalletArray();
                let ind = parseInt(walletarray.length <= 0 ? 0 : walletarray[walletarray?.length - 1][0]?.id) + 1
                console.log('walletarray---->', walletarray);


                let newwalletobj = {
                    "id": ind,
                    "walletname": name,
                    "mnemonic": replace.trim(),
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
                    // "publickey":btcwallet.publickey?btcwallet.publickey:"",

                }
                console.log('newwalletobj---->', newwalletobj);
                walletArr.push(newwalletobj)
                // await Notificationdata(walletArr)
                AddWallet(walletArr)
                SetCurrentIndex(walletarray.length);
                console.log('walletarrrr---->', walletArr);
                // await onAccountChange(evmWallet?.address, "eip155:11155111")
                setLoading(false);
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Walletmain' }],
                    })
                );

                // if (Notifications) {

                //     AddWallet(walletArr)
                //     SetCurrentIndex(walletarray.length);


                //     navigation.push("Walletmain")
                // }
                // else {
                //     Toastfn("Something went wrong...!")
                //     setLoading(false);
                //     Notifications = false

                // }

            }
            else {
                Toastfn("Invalid Mnemonic Phrase")
            }
        }
        catch (err) {
            console.log("create multicoin err", err);
        }

    }



    const Item2 = ({ item, onPress }) => {
        return (
            item.checked &&

            <View  >
                {

                    (<LinearGradient start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }} colors={['#1AC6C9', '#3878C7', "#3D1E88"]} style={{
                            marginTop: "12%",
                            alignItems: "center",
                            borderStyle: "solid",
                            borderRadius: 15,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            margin: "1.9%",
                            justifyContent: "center",
                            width: devicewidth * 0.255,
                            alignSelf: "center",
                            position: "relative"
                        }} >
                        <Pressable
                            style={style.closeButton}
                            // style={{
                            //     zIndex:100,
                            //     top:10,
                            //     position: "absolute",
                            //     right: 7,
                            //     // backgroundColor:"red",
                            //     padding:"2%"
                            //     // top:"10%"
                            //     // backgroundColor:"red"
                            //     // marginRight: "4%",
                            //     // marginTop:"1%"
                            // }}
                            onPress={onPress}
                        >
                            <Icon
                                name="close"
                                type="antdesign"

                                color="#fff"
                                size={RFPercentage(2.2)} />
                        </Pressable>
                        <View
                            style={{
                                borderWidth: 0,
                                flexDirection: "row",
                                alignItems: "center",

                                // justifyContent:"space-between",
                                // backgroundColor:"yellow"
                            }}
                        // onPress={onPress}

                        >
                            <Text
                                style={style.paraphrase1}
                                numberOfLines={1}
                            >
                                {item.value}

                            </Text>

                        </View>
                    </LinearGradient>

                    )}
            </View>

        );
    };

    const Item = ({ item, onPress, textColor, backgroundColor, borderColor, borderWidth, borderRadius, key }) => (

        Item2({ item, onPress, textColor, backgroundColor, borderColor, borderWidth, borderRadius }),
        (
            <View key={key} >
                {item.checked == false && (
                    <Pressable
                        onPress={onPress}
                        style={{
                            backgroundColor: theme.secondarybg,
                            borderWidth: 0,
                            // marginRight: "3%",
                            marginTop: "12%",
                            alignItems: "center",
                            borderStyle: "solid",
                            borderRadius: 15,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            margin: "1.9%",
                            width: devicewidth * 0.255,
                            justifyContent: 'center',
                            alignSelf: "center"

                        }}
                    >
                        <Text style={style.paraphrase}

                        >
                            {item.value}
                        </Text>
                    </Pressable>
                )}
            </View>
        )
    );
    /** Arranged seed phrase */
    const mapData = () => {
        return seedList.map((item, index) => {
            const backgroundColor = "#fff";
            const color = "#000";
            const borderColor = "transparent";
            const borderWidth = 0;
            return (
                <Item
                    key={index.toString()}
                    item={item}
                    index={index}
                    onPress={() => {
                        let newItems = [...seedList];

                        newItems[index].checked = !item.checked;

                        if (newItems[index].checked) {
                            setSelectedKeyPhraseArray((interests) => [...interests, item.value,]);
                            setCorrectOrder((interests) => [...interests, { id: item.id, value: item.value, checked: newItems[index].checked, ind: index }])
                            setnewArrayValue((interests) => [...interests, item.id]);
                        } else {
                            let newArray = selectedKeyPhraseArray.filter(
                                (interest) => interest !== item.value
                            );
                            let newArray2 = selectedKeyPhraseArray.filter(
                                (interest) => interest !== item.id
                            );
                            let newArray3 = CorrectOrder.filter(
                                (interest) => (interest.id !== item.id)
                            );

                            setCorrectOrder(newArray3)
                            setSelectedKeyPhraseArray(newArray);
                            setnewArrayValue(newArray2);
                        }

                    }}
                    backgroundColor={backgroundColor}
                    textColor={color}
                    borderColor={borderColor}
                    borderWidth={borderWidth}
                />
            );
        });
    };
    /**Correctly  Rearranged seed phrase */

    const mapData2 = () => {
        var valArr = [];
        newArrayValue.map((item, index) => {
            valArr.push(item);
        });
        let arrOne = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let arrTwo = valArr;
        let result = arrTwo.every(function (element, index) {
            return element === arrOne[index];
        });
        if (result == false && result != true) {
            global.fail = "Invalid order";
        } else if (JSON.stringify(arrOne) == JSON.stringify(arrTwo)) {
            global.fail = "Well Done";
        } else if (
            result == true &&
            JSON.stringify(arrOne) != JSON.stringify(arrTwo)
        ) {
            global.fail = "";
        } else if (valArr == "") {
            global.fail = "";
        }
        return CorrectOrder.length == 0 ?
            <></> :
            CorrectOrder.map((item, index) => {
                const backgroundColor = "#fff";
                const color = "#000";
                const borderColor = "transparent";
                const borderWidth = 0;
                return (
                    <View>
                        <Item2
                            key={index.toString()}
                            index={index}
                            item={item}
                            onPress={() => {
                                let newItems = [...seedList];

                                newItems[item.ind].checked = !item.checked;
                                if (newItems[item.ind].checked) {
                                    setSelectedKeyPhraseArray((interests) => [
                                        ...interests,
                                        item.value,
                                    ]);
                                    setCorrectOrder((interests) => [
                                        ...interests,
                                        { value: item.value, id: item.id, checked: newItems[item.ind].checked },
                                    ]);
                                    setnewArrayValue((interests) => [...interests, item.id]);
                                } else {
                                    let newArray = selectedKeyPhraseArray.filter(
                                        (interest) => interest !== item.value
                                    );

                                    let newArray2 = newArrayValue.filter(
                                        (interest) => interest !== item.id
                                    );
                                    let newArray3 = CorrectOrder.filter(
                                        (interest) => (interest.id !== item.id)
                                    );
                                    setSelectedKeyPhraseArray(newArray);
                                    setCorrectOrder(newArray3);
                                    setnewArrayValue(newArray2);
                                }
                            }}
                            backgroundColor={backgroundColor}
                            textColor={color}
                            borderColor={borderColor}
                            borderWidth={borderWidth}
                        />
                        {/* {
                            item.checked == true &&
                            (
                                <Image
                                    style={{
                                        width: 15,
                                        height: 15,
                                        position: "absolute",
                                        bottom: "47%",
                                    }}
                                />
                            )} */}
                    </View>
                );
            });
    };



    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={style.container}>
                <Header title={"Secret Phrase"} type={'scan'} />
                <ScrollView showsVerticalScrollIndicator={false} >
                    <View style={style.box_container} >
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={style.Topsec}>

                                <Text style={style.Titlepara} >Enter as per your written order</Text>
                            </View>
                            <View style={style.card_container} >
                                <View
                                    style={style.mapData}
                                >
                                    {mapData()}
                                </View>
                                <Text style={style.selectpara}>Your Selection order is  </Text>


                            </View>
                        </ScrollView>

                    </View>
                </ScrollView>

                <View style={{ position: "absolute", bottom: "10%", left: 0, right: 0, }}>


                    <View style={newArrayValue.length >= 1 ? style.select_pharse1 : style.select_pharse}>
                        {mapData2()}
                    </View>
                    {newArrayValue.length == 0 && (
                        <Text
                            style={{
                                fontFamily: Fonts.Bold,
                                fontSize: 14,
                                color: C.textgrey,
                                textAlign: "center",
                                marginTop: 10
                            }}
                        >
                            Enter seed in correct order
                        </Text>
                    )}
                    {global.fail == "Invalid order" && newArrayValue.length != 0 && (
                        <Text
                            style={{
                                fontFamily: Fonts.Bold,
                                fontSize: 14,
                                color: "red",
                                textAlign: "center",
                                marginTop: 20
                            }}
                        >


                            Invalid order
                        </Text>
                    )}




                    {global.fail != "Well Done" && loading != false && (
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 }}>

                            <Button
                                title={"Confirm"}
                                disabled="true"
                                buttonStyle={{
                                    width: 200,
                                    alignSelf: "center",
                                    backgroundColor: "#000",
                                    borderRadius: 500,
                                    padding: 20
                                }}
                                titleStyle={{ fontFamily: Fonts.Bold, color: "#fff", fontSize: 18 }}
                            />
                        </View>
                    )}

                    {global.fail == "Well Done" && (
                        <View style={style.successbtn}>
                            {!loading ?
                                <TouchableOpacity
                                    onPress={() => seedvalidateMultiCoin()}
                                    style={style.create_button} >

                                    <Button title={"Continue"} colors={['#1AC6C9', '#3878C7', "#3D1E88"]} />
                                </TouchableOpacity>
                                :
                                <View style={{
                                    marginTop: "5%",
                                    width: "90%",
                                    alignSelf: "center",
                                }}>
                                    <Loader />
                                </View>

                            }


                        </View>
                    )}
                </View>



            </View>
        </SafeAreaView>
    );
};
export default ConfirmWalletPharse;

const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background
        },
        box_container: {
            flex: 1,
            justifyContent: "center",
            alignItems: 'center',
        },
        card_container: {
            width: "100%",
            bottom: "5%",





        },
        card_container1: {
            width: "88%",
            backgroundColor: "red",
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "10%",
            paddingHorizontal: "5%",
            shadowColor: 'transparent',
            elevation: 5,
            bottom: "5%",
            justifyContent: "center",
            position: "relative",
            marginTop: "25%",

        },

        para: {
            fontSize: RFPercentage(2.05),
            color: "#ffffff",
            fontFamily: Fonts.Regular,
            marginTop: '5%'
        },
        paraphrase: {
            fontSize: RFPercentage(1.85),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'center'


        },
        paraphrase1: {
            fontSize: RFPercentage(1.85),
            color: "#fff",
            fontFamily: Fonts.Regular,
            textAlign: 'center',
            paddingBottom: "1%",
            // backgroundColor:"green"
        },
        selectpara: {
            fontSize: RFPercentage(2.05),
            color: C.textgrey,
            fontFamily: Fonts.Regular,
            marginTop: "10%",
            textAlign: 'center',
            width: "90%",
            alignSelf: 'center'
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
            textAlign: "center"
        },

        create_button: {
            marginTop: "5%",
            width: "90%",
            alignSelf: "center",

        },
        Topsec: {
            width: "90%",
            marginBottom: "15%",
            textAlign: "center",
            justifyContent: "center",
            alignSelf: "center"
        },
        mapData: {
            width: "100%",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            marginRight: "4%"


        },
        btnsec: {
            width: "100%"
        },
        bottomsec: {
            width: '80%'
        },
        scanTxt: {
            fontFamily: Fonts.Medium,
            fontSize: RFPercentage(2.15),
            color: "#fff",
            textAlign: "center",
            marginTop: '5%',
            marginBottom: "5%"
        },
        select_pharse: {
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 10,
            backgroundColor: "transparent",
            height: 180,
            borderRadius: 10,
            borderColor: "transparent",
            borderWidth: 1,
            padding: 10,


        },
        select_pharse1: {
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            width: "100%",
            borderWidth: 1,
            backgroundColor: "transparent",
            borderRadius: 10,
            borderColor: "transparent",
            borderWidth: 0,
            padding: 10,
            justifyContent: "center",

        },
        itemview: {
            backgroundColor: "#3A4566",
            borderColor: "transparent",
            borderWidth: 0,
            margin: 5,
            alignItems: "center",
            borderRadius: 15,
            color: "#9ACFFF",
        },
        create_button1: {
            marginTop: "5%",
            width: "85%",
            alignSelf: "center",
            opacity: 0.3
        },
        successbtn: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: "5%",
        },
        successtext: {
            fontFamily: Fonts.Medium,
            fontSize: RFPercentage(5.15),
            color: "#fff",
            textAlign: "center",
            position: 'relative'
        },
        successimg: {
            position: "absolute",
            alignSelf: 'center',
            marginTop: "10%"
        },
        linetext: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10
        },
        linehr: {
            flex: 1,
            height: 1,
            backgroundColor: '#9ACFFF',
            marginTop: 5,
        },
        closeButton: {
            position: "absolute",
            top: -6,
            right: -6,
            backgroundColor: "#20B6C9",
            width: 18,
            height: 18,
            borderRadius: 9,
            alignItems: "center",
            justifyContent: "center",
          },

    })