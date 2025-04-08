import React, { useCallback, useContext, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Keyboard } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../Components/Button";
import { Input, Icon as Icn, } from "react-native-elements";
import { Card } from 'react-native-shadow-cards';
import { CurrentWalletArray, GetCurrentIndex, SetWallets, UseWalletArray } from "../../Utilities/usestorage";
import { isEmpty } from "../../Utilities/commenfuctions";
import { Toastfn } from "../../Utilities/toast";
import { showImage } from "../../Utilities/commenfuctions";
import themeContext from "../../Utilities/themecontext";
import { useFocusEffect } from "@react-navigation/native";
import SwitchToggle from "react-native-switch-toggle";

export default function Addtoken({ navigation }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [isEnabled, setIsEnabled] = useState();
    const [tokenlist, setTokenlist] = useState([])
    const [searchQuery, setSearchQuery] = useState("");

    const onChangeSearch = (query) => setSearchQuery(query);

    useFocusEffect(
        useCallback(() => {
            getWalletData()

        }, [])
    )



    /** Wallet Details*/
    const getWalletData = () => {
        try {

            var currentwallet = CurrentWalletArray()
            setTokenlist(currentwallet.filter((val) => val.type == "Token"))

        }
        catch (err) {
            console.log("getWalletData wallethome", err);
        }

    };


    /** Able and Disable tokens*/
    const toggleSwitch = (item) => {
        if (isEmpty(item)) {
            Toastfn("Default Token Doesn't Hide")
        }

        else {
            let walletarray = UseWalletArray();
            let currenteindex = GetCurrentIndex();
            let data = walletarray[currenteindex]
            let SelectedToken



data[0]?.tokens?.map((val,idx)=>{
    if(val?.address==item?.contractAddress){
        SelectedToken=idx
// return idx   
    }

})


 data[0].tokens=[...data[0]?.tokens.slice(0, SelectedToken),...data[0]?.tokens.slice(SelectedToken+1, data[0]?.tokens?.length)]
 Toastfn('Token Disabled successfully')

            SetWallets(walletarray)
            setIsEnabled(!isEnabled)



            navigation.navigate("Wallethome", {
                key: true
            })
        }
    }

    const filterdata = searchQuery
        ? tokenlist.filter((item) =>
            item.type == 'Token' &&
            item?.currency.toLowerCase()?.includes(searchQuery.toLowerCase())

        )
        : tokenlist;


    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View onStartShouldSetResponder={() => Keyboard.dismiss()} style={{ flex: 1, backgroundColor: theme.background }}>
                <Header title={"Enable Coins"} />

                <View style={style.box_container} >
                    <View style={style.inputsec} >
                        <Input
                            placeholder="Search or enter address"
                            inputStyle={style.searchinput}
                            inputContainerStyle={style.containersearchinput}
                            selectionColor={theme.selectioncolor}
                            placeholderTextColor="#464549"
                            Color="#010101"
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => onChangeSearch(text)}

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
                    <Card style={style.card_container}>



                        <ScrollView showsVerticalScrollIndicator={false} >

                            <View style={{ marginTop: "5%" }}>
                                {
                                    filterdata?.length > 0 ?
                                        filterdata?.map((item, index) => (
                                            <View>
                                                {item.contractAddress != "" && <View style={style.coinlistsec}>


                                                    <View style={style.logoname}>
                                                        <View>
                                                            {showImage(item.tokenType, 0.13, 0.04)}
                                                        </View>
                                                        <Text style={style.para}>{item.currency}</Text>
                                                    </View>



                                                    <View>
                                               
                                                      <SwitchToggle
                                                            switchOn={item?.enable}
                                                            onPress={(e) => {
                                                                item?.defaulttoken == true ? toggleSwitch() : toggleSwitch(item)
                                                            }}
                                                            circleColorOff={theme.theme == 'dark' ? '#545258' : '#E8E9EF'}
                                                            circleColorOn='#fff'
                                                            backgroundColorOn="#00001C"
                                                            backgroundColorOff={theme.theme === 'dark' ? '#2A292E':'#CFCFCF'}
                                                            containerStyle={{
                                                                width: devicewidth * 0.13,
                                                                height: devicewidth * 0.067,
                                                                borderRadius: 100,
                                                                padding: devicewidth * 0.01,
                                                                // borderWidth: 0.5,
                                                                // borderColor: "#fff"
                                                            }}
                                                            circleStyle={{ width: devicewidth * 0.052, height: devicewidth * 0.052, borderRadius: 100 }}

                                                        />
                                                    </View>
                                                </View>
                                                }

                                            </View>


                                        ))
                                        :
                                        <View style={{ alignItems: "center", justifyContent: "center", marginVertical: "20%", }}>
                                            <Text style={style.paraempty}>No Asset Found !</Text>
                                        </View>
                                }
                            </View>

                        </ScrollView>


                    </Card>
                </View>


                <View style={{ position: "absolute", left: 0, right: 0, bottom: "6%", alignItems: "center", justifyContent: "center" }}>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Addcustomtokens')}
                        style={{
                            width: "90%",
                            alignSelf: "center",
                        }} >
                        <Button title={"Add Custom Tokens"} colors={['#317ED1', '#31B4A6']} />
                    </TouchableOpacity>


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
            // height: "80%",
            paddingHorizontal: "3%",
            justifyContent: "center",
            alignItems: 'center',
        },
        card_container: {
            width: "92.5%",
            marginTop: "8%",
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "4%",
            paddingHorizontal: "5%",
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 1,
            // shadowRadius: 4,
            // elevation: 5,
            backgroundColor: theme.secondarybg,
            // height: deviceheight * 0.2


        },

        para: {
            fontSize: RFPercentage(1.85),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'center',
        },
        parabtn: {
            fontSize: RFPercentage(2.25),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            textAlign: 'center',
            marginTop: "7%"
        },
        paragray: {
            fontSize: RFPercentage(1.55),
            color: "#8C9BAA",
            fontFamily: Fonts.Regular,
            textAlign: 'center',
            lineHeight: 15

        },

        paralite: {
            fontSize: RFPercentage(1.85),
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
            fontSize: RFPercentage(2.45),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            textAlign: "center"

        },
        gradTitle1: {
            fontSize: RFPercentage(2.55),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            textAlign: "left"

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
            paddingVertical: "2%"
        },
        toggle: {
            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
        },
        inputsec: {
            marginTop: '2%',
            height: deviceheight * 0.055,
            backgroundColor: "transparent",


        },
        searchinput: {
            fontSize: RFPercentage(2.25),

            alignSelf: "center",
            color: theme.text
        },
        containersearchinput: {
            width: "100%",
            alignSelf: "center",
            borderWidth: 1.2,
            borderColor: theme.secondarybg,
            borderRadius: borderradius * 0.7,
            height: deviceheight * 0.068,
            backgroundColor: theme.secondarybg,
            paddingHorizontal: "3%",

        },
        paraempty: {
            fontSize: RFPercentage(1.85),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: "center",

        },



    })