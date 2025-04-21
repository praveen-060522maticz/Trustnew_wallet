import React, { useContext, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, BackHandler } from "react-native";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import LinearGradient from "react-native-linear-gradient";
import { Card } from 'react-native-shadow-cards';
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../Components/Button";
import { GetStatauspasscode, Getpasscodestataus, UseWalletArray } from "../../Utilities/usestorage";
import { useFocusEffect } from "@react-navigation/native";
import { CustomBackFunc, isEmpty } from "../../Utilities/commenfuctions";
// import Logo from "../../Assets/caexicons/logo.svg"
import Logo from '../../Assets/Images/trustne_white.svg'
import { C } from "../../Utilities/colors";
import { Toastfn } from "../../Utilities/toast";
import { lotties, Images } from "../../Utilities/images";
import LottieView from "lottie-react-native"
import CheckBox from '@react-native-community/checkbox';

export default function Walletcreate({ navigation, route }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [Passcode, Setpasscode] = useState()
    const [Passcodestatus, Setpasscodestatus] = useState()
    const from = route?.params?.from
    console.log('themetheme---->', theme, route);

    /** Get passcode status*/
    useFocusEffect(
        React.useCallback(() => {
            let passcode = Getpasscodestataus()
            let passcodestatus = GetStatauspasscode()

            Setpasscode(passcode)
            Setpasscodestatus(passcodestatus)
        }, [])

    );
    //BackFunction
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (from == 'deletwallet' || from == "splash")  BackHandler.exitApp();
                else CustomBackFunc(navigation);
                
                return true;
            }

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
    const CreatewalletData = () => {
        if (isEmpty(Passcode)) {
            (!Passcodestatus || isEmpty(Passcodestatus)) ? navigation.push('CreatePasscode', { routename: "Walletprivacy" }) : navigation.push('Walletprivacy')
        }
        else {
            navigation.push('Walletprivacy')
        }

    }

    const AlreadyAccountData = () => {
        if (isEmpty(Passcode)) {
            (!Passcodestatus || isEmpty(Passcodestatus)) ? navigation.push('CreatePasscode', { routename: "LegalWallet" }) : navigation.push("LegalWallet")
        }
        else {
            navigation.push('LegalWallet')
        }

    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: theme.background,

        }} >
            <StatusBar backgroundColor={"#00001C"} />

            <LinearGradient
                style={{ width: "100%", height: deviceheight * 0.3, alignItems: "center", zIndex: 1, paddingTop: "5%" }}
                // start={{ x: 0, y: 1 }}
                // end={{ x: 1, y: 0.9 }}
                // locations={[0, 0.8, 1]}
                // colors={['#3db5a6', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']}
                locations={[0, 0.8, 1]}  // Color stops at 0%, 70%, and 100%
                start={{ x: 0.1, y: 1 }}  // Slightly right of top-left
                end={{ x: 1, y: 0.9 }}    // Bottom-right for 132deg
                colors={theme.theme != "dark" ? ['#00001C', '#00001C'] : ['#1AC6C9', '#3878C7', "#3D1E88"]}
            >
                <Logo width={150} height={150} />
            </LinearGradient>




            <Card style={style.card_container} >
                <ScrollView showsVerticalScrollIndicator={false} >
                    <View style={style.imgsec}>

                        <LottieView
                            style={{
                                flex: 1,
                                width: devicewidth * 0.40,
                                height: deviceheight * 0.30,
                                alignSelf: "center"
                            }}
                            source={lotties.walletg}
                            autoPlay
                            loop
                            resizeMode="cover"
                        />
                    </View>






                </ScrollView>
                <View style={{ position: "absolute", bottom: "10%", left: 0, right: 0 }}>
                    {/* <View style={style.checkboxsec}>
                        <CheckBox
                            disabled={false}
                            // value={selectcheck}
                            style={style.checkboxstyles}
                            tintColors={{ true: theme.theme == "dark" ? "#fff" : "#307CD1", false: theme.text }}
                            onFillColor={'#00000'}
                            // onValueChange={(newValue) => setSelectcheck(newValue)}
                        />
                        <View style={{ flexDirection: "row", marginLeft: "0.5%", alignItems: "center" }}>
                            <Text style={style.checkboxlabel}>   I accept</Text>
                            <Text style={style.checkboxlabel1}> terms and conditions</Text>
                        </View>
                    </View> */}
                    <TouchableOpacity

                        onPress={() => CreatewalletData()}
                        style={style.create_button} >
                        <Button title={"Create a new wallet"} colors={['#1AC6C9', '#3878C7', "#3D1E88"]} />
                    </TouchableOpacity>

                    <View style={style.Signinsec} >
                        <TouchableOpacity
                            style={{
                                width: "92.5%",
                                alignItems: "center", padding: "3.5%",
                                backgroundColor: theme.theme == "dark" ? "#26263D" : theme.background,
                                borderRadius: borderradius * 0.5,
                                justifyContent: "center", alignSelf:
                                    "center", borderWidth: 1, borderColor: theme.theme == "dark" ? "#26263D" : "#0D1A82"
                            }}

                            onPress={() => AlreadyAccountData()}

                        >
                            <Text style={style.gradTitle1}> I Already have a wallet</Text>

                        </TouchableOpacity>
                    </View>
                </View>
            </Card>
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
            height: "70%",
            justifyContent: "center",
            alignItems: 'center',

        },
        card_container: {
            width: "92.5%",
            backgroundColor: theme.theme == "dark" ? "#111013" : theme.secondarybg,
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "10%",
            paddingHorizontal: "5%",
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 1,
            // shadowRadius: 2,
            // elevation: 2,
            bottom: "6%",
            height: "75%",
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
            color: theme.theme == "dark" ? "#fff" : "#0D1A82",
            fontFamily: Fonts.Regular,
            textAlign: "center",
        },
        imgsec: {
            marginTop: "20%",
            width: "100%",


        },
        Signinsec: {





        },
        checkboxsec: {
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: "center",

            marginBottom: "7%"

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
        checkboxstyles: {
            width: devicewidth * 0.050,
            height: deviceheight * 0.075,
            borderWidth: 2,
        }



    })