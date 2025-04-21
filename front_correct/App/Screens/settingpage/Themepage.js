import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Switch } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import { Getmobiletheme } from "../../Utilities/usestorage";
import { C } from "../../Utilities/colors";
import { EventRegister } from 'react-native-event-listeners'
import SwitchToggle from "react-native-switch-toggle";


const isphone = devicewidth < 600
export default function ({ navigation }) {

    const theme = useContext(themeContext);
    const style = styles(theme);
    const [isEnabled, setIsEnabled] = useState(false);


    useEffect(() => {
        const theme = Getmobiletheme()
        setIsEnabled(theme == "light" ? false : true)
    }, [])

    const switchfn = (value) => {
        setIsEnabled(value)
        EventRegister.emit("mobile_theme", value ? "dark" : "light");
    }

    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={{ flex: 1, backgroundColor: theme.background, width: "100%", alignItems: "center" }}>
                <Header title={"Theme"} />
                <View style={style.box_container} >
                    <View style={style.listsec}>
                        <Text style={style.para}>Dark Theme</Text>
                        <View>
                            {/* <Switch
                                trackColor={{ false: '#434343', true: '#00001C' }}
                                thumbColor={isEnabled ? '#fff' : '#0A090D'}
                                ios_backgroundColor="#3e3e3e"
                                style={style.toggle}
                                onValueChange={(value) => switchfn(value)}
                                value={isEnabled}
                            /> */}
                            <SwitchToggle
                                switchOn={isEnabled}
                                onPress={() => {
                                    switchfn(!isEnabled)

                                }}
                                circleColorOff={theme.theme == 'dark' ? '#CFCFCF' : '#E8E9EF'}
                                circleColorOn='#fff'
                                backgroundColorOn="#00001C"
                                backgroundColorOff={theme.theme === 'dark' ? '#E8E9EF' : '#CFCFCF'}
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

        headercontainer: {
            width: "100%",
            flexDirection: "row",
            // backgroundColor: "#3D4A6C",
            // height: deviceheight * 0.10,
            alignItems: "center",
            justifyContent: "space-between"
        },
        headertext: {
            // position: "absolute",
            // left: 0,
            // right: 0,
            // textAlign: "center",
            fontFamily: Fonts.Regular,
            fontSize: RFPercentage(2.5),
            color: theme.text
        },
        headerarrowcontainer: {
            width: "10%",
            // borderRadius: borderradius * 2.5,
            justifyContent: "center",
            // backgroundColor: "#010101",
            // padding: "2.85%",
            // marginLeft: "5%"
        },
        headerarrowcontainer2: {
            width: "5%",
            // borderRadius: borderradius * 2.5,
            // backgroundColor: "#010101",
            justifyContent: "center",
            // padding: "1.55%",
            // paddingHorizontal: '4%',
            alignItems: 'center',
            // marginLeft: "5%"
        },
        headerarrowcontainer1: {
            width: "10%",
            // borderRadius: borderradius * 2.5,
            alignItems: "flex-end",
            // backgroundColor: "transparent",
            // padding: "2.85%",
            // marginRight: "5%"
        },

        headerarrowimg: {
            alignSelf: "center",
            resizeMode: "contain",
        },
        box_container: {
            // height: "80%",
            // paddingHorizontal: "3%",
            width: "100%",
            justifyContent: "center",
            alignItems: 'center',
        },
        card_container: {
            width: "90%",
            marginTop: "10%",


            // borderRadius: borderradius * 1,
            // paddingVertical: "7%",
            // paddingHorizontal: "5%",
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 1,
            // shadowRadius: 4,
            // elevation: 5,
            // height: "90%",
            // justifyContent: "center",
            // alignItems: 'center'

        },


        para: {
            fontSize: RFPercentage(1.95),
            color: theme.text,
            fontFamily: Fonts.Regular,
        },
        paragray: {
            fontSize: RFPercentage(1.45),
            color: C.textgrey,
            fontFamily: Fonts.Regular,
            textAlign: 'left',
            lineHeight: 15,
            width: "80%"

        },

        paralite: {
            fontSize: RFPercentage(1.85),
            color: "#37607F",
            fontFamily: Fonts.Regular,
            textAlign: 'center'
        },
        parablue: {
            fontSize: RFPercentage(2.45),
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
        listsec: {
            flexDirection: 'row',
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "center",
            marginTop: "4%",
            backgroundColor: theme.secondarybg,
            borderRadius: borderradius * 0.5,
            width: "90%",
            height: deviceheight * 0.08,
            padding: "4%",

        },
        defaultradio: {
            borderColor: theme.text,
            borderWidth: 2,
            borderRadius: 50,
            height: 20,
            width: 20

        },
        selectedradio: {
            // borderColor: "#683cf0",
            // borderWidth: 2,
            // borderRadius: 50,
            // height: 20,
            // width: 20,
            // backgroundColor:"#2CCCFE",

        },
        selectedradioinner: {
            // height: 20,
            // width: 20,
            // borderRadius: 50,
            // backgroundColor: C.primary

            // borderWidth:2
            // alignSelf: 'center',
            // justifyContent: 'center',
            // alignItems: 'center',
            // marginTop: "10%"
        },
        radioButton: {
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center'
        },
        toggle: {
            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
        }




    })