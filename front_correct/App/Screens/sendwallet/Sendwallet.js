import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import { Input, Icon as Icn } from "react-native-elements";
import { Card } from 'react-native-shadow-cards';
import { ScrollView } from "react-native-gesture-handler";
import { showImage } from "../../Utilities/commenfuctions";
import { CurrentWalletArray } from "../../Utilities/usestorage";
import LottieView from "lottie-react-native";
import { lotties } from "../../Utilities/images";
import { selectCurrencyForTransaction } from "../../Redux/Actions/Defaultcurrencies";
import { useDispatch } from "react-redux";


export default function Sendwallet({ navigation }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const dispatch = useDispatch();

    //search function
    const onChangeSearch = (query) => setSearchQuery(query);

    const [searchQuery, setSearchQuery] = useState("");
    const [coinlist, setCoinlist] = useState([])

    const selectAcurrency = (item) => dispatch(selectCurrencyForTransaction(item));


    useEffect(() => {
        getWalletData()
    }, [])

    //Searchbar functions
    const filterdata = searchQuery
        ? coinlist.filter((item) => item?.currency?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
        : coinlist;



    //Get Wallet Details
    const getWalletData = () => {
        try {
            let currentwallet = CurrentWalletArray()
            setCoinlist(currentwallet)
            // setCoinlist([...currentwallet, ...currentwallet, ...currentwallet])

        }
        catch (err) {
            console.log("getWalletData wallethome", err);
        }

    };
    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={{ flex: 1, backgroundColor: theme.background }} >
                <Header title={"Wallet Send"} />

                <View style={style.inputsec} >
                    <Input
                        placeholder="Search or enter address"
                        inputStyle={style.searchinput}
                        onChangeText={onChangeSearch}
                        inputContainerStyle={style.containersearchinput}
                        selectionColor={theme.selectioncolor}
                        placeholderTextColor="#464549"
                        Color="#010101"
                        underlineColorAndroid="transparent"

                        rightIcon={
                            <Icn
                                name="search"
                                type="antDesign"
                                style={{
                                    alignSelf: "center",
                                }}
                                color="#464549"
                                size={25}
                            />
                        }
                    />
                </View>

                <View style={style.box_container} >


                    {filterdata?.length == 0 ?
                        <View style={{
                            width: "92.5%",
                            marginTop: "10%",
                            alignSelf: "center",
                            paddingVertical: "4%",
                            paddingHorizontal: "4%",
                        }} >
                            <ScrollView showsVerticalScrollIndicator={false} >
                                <View style={style.imgsec}>
                                    <LottieView
                                        style={{

                                            width: devicewidth * 0.12,
                                            height: deviceheight * 0.12,
                                            alignSelf: "center"

                                        }}
                                        source={lotties.add}
                                        autoPlay
                                        loop
                                        resizeMode="cover"
                                    />

                                </View>
                                <View style={style.contentsec}>

                                    <Text style={style.para1} >No Asset Found !</Text>
                                </View>


                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Cryptobuy')}
                                    style={{
                                        width: "65%",
                                        marginTop: "3%",
                                        padding: "4%",
                                        alignItems: "center", backgroundColor: theme.background, borderRadius: borderradius * 0.5, justifyContent: "center", alignSelf: "center", borderWidth: 1, borderColor: theme.theme == "dark" ? "#224969" : "#31B4A6",
                                        height: deviceheight * 0.0620
                                    }}>

                                    <Text style={{
                                        fontFamily: Fonts.Regular,
                                        fontSize: RFPercentage(2),
                                        color: theme.theme == "dark" ? "#fff" : "#00001C",
                                        textAlign: "center",
                                    }} >Buy Cryptocurrency</Text>
                                </TouchableOpacity>

                            </ScrollView>
                        </View>
                        :

                        <Card style={style.card_container} >
                            <ScrollView showsVerticalScrollIndicator={false} >


                                {filterdata?.map((item, index) =>
                                    <TouchableOpacity
                                        onPress={() => { selectAcurrency(item); navigation.navigate('Sendcurrency', { datas: item, index: index }) }}>
                                        <View style={style.coinlistsec}>

                                            <View style={style.logoname}>
                                                <View>
                                                    {showImage(item.tokenType, 0.13, 0.04)}
                                                </View>
                                                <Text style={style.para}>{item.currency}</Text>
                                            </View>
                                            <View>
                                                <Text style={style.parablue}>{(item.balance).toFixed(6)} {item.symbol ? item.symbol : item.currencyName}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                                }



                            </ScrollView>
                        </Card>
                    }

                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,

        },
        box_container: {
            paddingHorizontal: "3%",
            justifyContent: "center",
            alignItems: 'center',
            maxHeight:"80%",
        },
        card_container: {
            width: "92.5%",
            marginTop: "12%",
            backgroundColor: theme.secondarybg,
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "4%",
            paddingHorizontal: "4%",
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 1,
            // shadowRadius: 4,
            // elevation: 5,

            // justifyContent: "center",
            // alignItems: 'center'

        },

        para: {
            fontSize: RFPercentage(2.15),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },
        para1: {
            fontSize: RFPercentage(1.85),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: "center",

        },
        parablue: {
            fontSize: RFPercentage(1.95),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },

        create_button: {
            marginTop: "5%",
            width: "92.5%",
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
        imgsec: {
            marginTop: "35%",
            marginBottom: "3%"
        },
        Signinsec: {
            marginTop: "5%"
        },
        inputsec: {
            marginTop: '2%',
            height: deviceheight * 0.055,
            backgroundColor: "transparent",


        },
        searchinput: {
            fontSize: RFPercentage(2.25),
            // padding: 7,
            alignSelf: "center",
            color: theme.text
        },
        containersearchinput: {
            width: "94%",
            alignSelf: "center",
            borderWidth: 1.2,
            borderColor: theme.secondarybg,
            borderRadius: borderradius * 0.7,
            height: deviceheight * 0.068,
            backgroundColor: theme.secondarybg,
            paddingHorizontal: "3%",

        },
        logoname: {
            flexDirection: "row",
            gap: 5,
            alignItems: 'center'
        },
        coinlistsec: {
            flexDirection: "row",
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: "2%",
            // marginBottom: "2%"
        },



    })