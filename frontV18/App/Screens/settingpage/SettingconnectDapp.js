import React, { useContext, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Switch } from "react-native";
import Header from "../../Navigations/Header";
import { borderradius } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import LinearGradient from "react-native-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";

export default function SettingconnectDapp({ navigation }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [isEnabled, setIsEnabled] = useState();
    const [tokenvisibile, setTokenvisibile] = useState();
    const [tokenlist, setTokenlist] = useState([
        {
            name: "Allow Push Notification",
            enable:false
        },
    ])
    const toggleSwitch = (index) =>{
        var switches = tokenlist
        switches[index].enable= !switches[index].enable
        setIsEnabled(!isEnabled)
        const newData = true;
        setTokenvisibile(newData)
       
    } 

    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={"#3D4A6C"} />
            <LinearGradient style={style.container} colors={["#3D4A6C", "#12182B"]} >
                <Header title={"Connect Dapp"} />

                <View style={style.box_container} >
                    <LinearGradient style={style.card_container} colors={["#2A3553", "#19233D"]} >

                        <ScrollView showsVerticalScrollIndicator={false} >
                            <View>
                            {tokenlist.map((item, index) => (
                              
                                          
                                                <View style={style.coinlistsec}>
                                                    <View style={style.logoname}>
                                                        <View>
                                                            {item.logoimg}
                                                        </View>
                                                        <Text style={style.para}>{item.name}</Text>
                                                    </View>
                                                    <View>
                                                        <Switch
                                                            trackColor={{ false: '#8C9BAA', true: '#81b0ff' }}
                                                            thumbColor={item.enable ? '#2CCCFE' : '#f4f3f4'}
                                                            ios_backgroundColor="#3e3e3e"
                                                            onValueChange={() => toggleSwitch(index)}
                                                            value={item.enable}
                                                            style={style.toggle}
                                                        />
                                                    </View>
                                                </View>
                                  
                                  
                            ))}
                            </View>

                        </ScrollView>


                    </LinearGradient>
                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1
        },
        box_container: {
            height: "80%",
            paddingHorizontal: "3%",
            justifyContent: "center",
            alignItems: 'center',
        },
        card_container: {
            width: "92.5%",
            marginTop: "0%",
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "7%",
            paddingHorizontal: "5%",
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 5,
            height: "90%",
            // justifyContent: "center",
            // alignItems: 'center'

        },

        para: {
            fontSize: RFPercentage(1.85),
            color: "#9ACFFF",
            fontFamily: Fonts.Medium,
            textAlign: 'center',
        },
        parabtn: {
            fontSize: RFPercentage(2.25),
            color: "#9ACFFF",
            fontFamily: Fonts.Medium,
            textAlign: 'center',
            marginTop: "7%"
        },
        paragray: {
            fontSize: RFPercentage(1.55),
            color: "#8C9BAA",
            fontFamily: Fonts.Medium,
            textAlign: 'center',
            lineHeight: 15

        },

        paralite: {
            fontSize: RFPercentage(1.85),
            color: "#37607F",
            fontFamily: Fonts.Medium,
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
            fontFamily: Fonts.Medium,
            textAlign: "center"

        },
        gradTitle1: {
            fontSize: RFPercentage(2.55),
            color: "#9ACFFF",
            fontFamily: Fonts.Medium,
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
            paddingVertical: "3%"
        },
        toggle:{
            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
        }




    })