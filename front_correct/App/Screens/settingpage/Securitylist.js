//
import React, { useCallback, useContext, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Switch, Alert } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import { ScrollView } from "react-native-gesture-handler";
import { Deletewallet, GetBiomatricstataus, GetStatauspasscode, SetBiomatricstataus, SetPasscode, Setpasscodestatus } from "../../Utilities/usestorage";
import { useFocusEffect } from "@react-navigation/native";
import { Toastfn } from "../../Utilities/toast";
import SwitchToggle from "react-native-switch-toggle";
export default function Securitylist({ navigation }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [isEnabled, setIsEnabled] = useState(false);
    const [Togglestatus, setTogglestatus] = useState(false);
    const [tokenlist, setTokenlist] = useState([
        // {
        //     name: "Passcode security",
        //     enable: false
        // },
        {
            name: "Fingerprint security",
            enable: false
        },

    ])
    /**To change passcode and fingerprint status*/
    const toggleSwitch = (index, val) => {


        setTogglestatus(val)
        SetBiomatricstataus(val)
        tokenlist[index].enable = val
        setIsEnabled(!isEnabled)

    }

    const restepasscode = () => {
        navigation.push("Passcode", { routename: "ResetPasscode" })
    }
    const Deleteallldata = () => {
        Deletewallet(),
            Setpasscodestatus(false)
        SetPasscode("")
        navigation.push("Createwallet", { from: "deletwallet" })

    }

    const Forgetpassword = () => {


        Alert.alert('Hold on!', 'Are you sure ? If you are proceed with forget password you will lose all data', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            {
                text: 'YES',
                onPress: () => {
                    Deleteallldata()
                }
            },
        ]);
        return true;
    };





    /**initial passcode and fingerprint status*/

    useFocusEffect(
        useCallback(() => {

            let Biomatric = GetBiomatricstataus()


            let values = tokenlist;


            if (Biomatric) {


                values = ([
                    ...[{
                        ...values[0],
                        ...{
                            enable: true,
                        }
                    }],
                ])
            }
            setTokenlist([...values])
        }, [isEnabled])
    )

    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={{ flex: 1, backgroundColor: theme.background }} >
                <Header title={"Security"} />

                <View style={style.box_container} >
                    <View style={style.card_container} >

                        <ScrollView showsVerticalScrollIndicator={false} >
                            <View >
                                {tokenlist.map((item, index) => (

                                    <View style={style.coinlistsec}>

                                        <View style={style.logoname}>
                                            <Text style={style.para}>{item.name}</Text>
                                        </View>
                                        <View>
                                       


                                            <SwitchToggle
                                                switchOn={item?.enable}
                                                onPress={(e) => {
                                                  
                                                    toggleSwitch(index, !Togglestatus)

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
                                                    borderWidth: 0.2,
                                                    borderColor: theme.text
                                                }}
                                                circleStyle={{ width: devicewidth * 0.052, height: devicewidth * 0.052, borderRadius: 100 }}

                                            />
                                        </View>
                                    </View>


                                ))}
                            </View>
                            < View style={{
                                alignSelf: "center",
                                marginTop: "4%",
                                backgroundColor: theme.secondarybg,
                                borderRadius: borderradius * 0.5,
                                width: "90%",
                                height: deviceheight * 0.07,
                                padding: "4%",
                            }}>
                                {<TouchableOpacity onPress={restepasscode}>

                                    <Text style={style.paraOne}>{"Reset passcode"}</Text>
                                </TouchableOpacity>}

                            </View>
                            < View style={{
                                alignSelf: "center",
                                marginTop: "4%",
                                backgroundColor: theme.secondarybg,
                                borderRadius: borderradius * 0.5,
                                width: "90%",
                                height: deviceheight * 0.07,
                                padding: "4%",
                            }}>
                                {<TouchableOpacity onPress={Forgetpassword}>

                                    <Text style={style.paraOne}>{"Forget passcode"}</Text>
                                </TouchableOpacity>}

                            </View>

                        </ScrollView>


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

            width: "100%",
            justifyContent: "center",
            alignItems: 'center',
        },
        card_container: {
            width: "100%",


        },

        para: {
            fontSize: RFPercentage(1.85),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'center',
        },
        paraOne: {
            fontSize: RFPercentage(1.85),
            color: theme.text,
            fontFamily: Fonts.Regular,



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
            fontSize: RFPercentage(2.85),
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
            flexDirection: 'row',
            justifyContent: "space-between",
            alignSelf: "center",
            alignItems:"center",
            marginTop: "4%",
            backgroundColor: theme.secondarybg,
            borderRadius: borderradius * 0.5,
            width: "90%",
            height: deviceheight * 0.08,
            padding: "4%",
        },
        toggle: {
            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
        }




    })