//Packages
import React, { useContext, useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text,View } from "react-native";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import { C } from "../../Utilities/colors";
import LottieView from "lottie-react-native";
import { lotties } from "../../Utilities/images";

export default function WalletSuccess({ navigation, route }) {
    const theme = useContext(themeContext);
    const style = styles(theme);

    useEffect(() => {
        setTimeout(() => {
             navigation.navigate("Walletmain")
        }, 2000);
    });


    return (
        <SafeAreaView style={style.container}>
            <StatusBar
                backgroundColor={theme.background} />
            <View style={style.container} >
                <View style={style.box_container} >
                   <View>
                        <LottieView
                            style={{
                                width: devicewidth * 0.5,
                                height: deviceheight * 0.25,
                                alignSelf: "center",
                                
                            }}
                            source={lotties.sucss}
                            autoPlay
                            loop
                            resizeMode="cover"
                        />
                    </View>
                    <Text style={{
                        fontFamily: Fonts.Medium,
                        fontSize: RFPercentage(2.15),
                        color: theme.text,
                        textAlign: "center",
                        marginTop:"4%"
                    }}>Wallet created successfully !</Text>
                </View>

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
            flex: 1,
            justifyContent: "center",
            alignItems: 'center',

        },
        card_container: {
            width: "92.5%",
            backgroundColor: theme.secondarybg,
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "10%",
            paddingHorizontal: "5%",
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 5,
            bottom: "8%",
            height: "70%",
            justifyContent: "space-around",
            position: "absolute",
            zIndex: 9999,



        },

        para: {
            fontSize: RFPercentage(1.75),
            color: '#010101',
            fontFamily: Fonts.Regular
        },

        create_button: {

            width: "92.5%",
            alignSelf: "center",
            marginBottom: "5%"


        },

        contentsec: {
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: "7%"
        },
        gradTitle: {
            fontSize: RFPercentage(2.35),
            color: "#010101",
            fontFamily: Fonts.Regular,
            textAlign: "center"

        },
        gradTitle1: {
            fontSize: RFPercentage(2.05),
            color: theme.theme == "dark" ? "#fff" : "#00001C",
            fontFamily: Fonts.Regular,
            textAlign: "center",
        },
        imgsec: {
            marginBottom: "10%"

        },

        checkboxsec: {
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: "center",

            marginBottom: "5%"

        },
        checkboxlabel: {
            fontSize: RFPercentage(2.00),
            color: theme.text,
            fontFamily: Fonts.Regular,

        },
        checkboxlabel1: {
            fontSize: RFPercentage(2.00),
            color: C.secondary,
            textDecorationLine: 'underline',
            fontFamily: Fonts.Regular,

        },
    
        qrsec: {
            borderRadius: 15,
            elevation: 0,
            borderWidth: 1,
            padding: 10,
            width: "67%",
            height: "35%",
            alignSelf: "center",
            borderColor: "transparent",
            backgroundColor: theme.secondarybg,
            alignItems: "center",
            justifyContent: "center",

        },



    })