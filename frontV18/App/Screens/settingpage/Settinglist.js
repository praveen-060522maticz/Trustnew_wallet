import React, { useContext } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, BackHandler } from "react-native";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import LinearGradient from "react-native-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import Rightarrow from '../../Assets/Icons/rightarrowblue.svg';
import Rightarrow1 from "../../Assets/Icons/rightarrowwhite"
import WalletPic from "../../Assets/caexicons/walletpic.svg"
import WalletPic1 from "../../Assets/caexicons/wallet2.svg"
import ThemePic from "../../Assets/caexicons/themepic.svg"
import SecurityPic from "../../Assets/caexicons/securitypic.svg"
import NotiPic from "../../Assets/caexicons/notifipic.svg"
import PrePic from "../../Assets/caexicons/prepic.svg"
import AboutPic from "../../Assets/caexicons/aboutpic.svg"
import ThemePic1 from "../../Assets/caexicons/themepic1.svg"
import SecurityPic1 from "../../Assets/caexicons/securitypic1.svg"
import NotiPic1 from "../../Assets/caexicons/notifipic1.svg"
import PrePic1 from "../../Assets/caexicons/prepic1.svg"
import AboutPic1 from "../../Assets/caexicons/aboutpic1.svg"
import Privacyicon from "../../Assets/caexicons/privacy.svg"
import Privacyicon1 from "../../Assets/caexicons/privacy1.svg"
import Terms from "../../Assets/caexicons/termspic.svg"
import Terms1 from "../../Assets/caexicons/terms1.svg"
import { useFocusEffect } from "@react-navigation/native";
import { Card } from 'react-native-shadow-cards';
import IconFont from 'react-native-vector-icons/FontAwesome';


export default function Settinglist({ navigation }) {
    const theme = useContext(themeContext);
    const style = styles(theme);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {

                navigation.push('Walletmain')
                return true;

            };

            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );
            return () => subscription.remove();
            // return () => {


            //     BackHandler.removeEventListener("hardwareBackPress", onBackPress);


            // };

        }, [navigation])
    );


    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: theme.background,
        }} >
            <StatusBar backgroundColor={theme.background} />
            <LinearGradient style={{ width: "100%", height: deviceheight * 0.3, borderBottomLeftRadius: borderradius * 1.5, borderBottomRightRadius: borderradius * 1.5, zIndex: 1 }} start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }} colors={theme.theme == "dark" ? [theme.secondarybg, theme.secondarybg] : ['#00001C', '#00001C',]} >
                {/* <Header title={"Settings"} /> */}
                <View style={{ alignItems: "center", justifyContent: "center", marginTop: "7%" }}>
                    <Text style={{

                        fontFamily: Fonts.Regular,
                        fontSize: RFPercentage(2.7),
                        color: "#fff"
                    }}>Settings</Text>
                </View>
            </LinearGradient>




            <Card style={style.card_container}  >

                <ScrollView showsVerticalScrollIndicator={false}>
                    <TouchableOpacity
                        style={{

                        }}
                        onPress={() => navigation.navigate('Walletlisting', "settings")} >
                        <View style={style.listsec}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                {theme.theme == "dark" ? <WalletPic width={devicewidth * 0.05} height={devicewidth * 0.05} /> : <WalletPic1 width={devicewidth * 0.05} height={devicewidth * 0.05} />}

                                <Text style={style.para}>Wallet</Text>
                            </View>
                            <View>
                                {theme.theme == "dark" ? <Rightarrow1 width={devicewidth * 0.035} height={deviceheight * 0.018} /> : <Rightarrow width={devicewidth * 0.035} height={deviceheight * 0.018} />}


                            </View>

                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('ThemePage')}
                    >
                        <View style={style.listsec}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                {theme.theme == "dark" ? <ThemePic width={devicewidth * 0.05} height={devicewidth * 0.05} /> : <ThemePic1 width={devicewidth * 0.05} height={devicewidth * 0.05} />}
                                <Text style={style.para}>Theme</Text>
                            </View>
                            <View>
                                {theme.theme == "dark" ? <Rightarrow1 width={devicewidth * 0.035} height={deviceheight * 0.018} /> : <Rightarrow width={devicewidth * 0.035} height={deviceheight * 0.018} />}

                            </View>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Securitylist')} >
                        <View style={style.listsec}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                {theme.theme == "dark" ? <SecurityPic width={devicewidth * 0.05} height={devicewidth * 0.05} /> : <SecurityPic1 width={devicewidth * 0.05} height={devicewidth * 0.05} />}
                                <Text style={style.para}>Security</Text>
                            </View>
                            <View>
                                {theme.theme == "dark" ? <Rightarrow1 width={devicewidth * 0.035} height={deviceheight * 0.018} /> : <Rightarrow width={devicewidth * 0.035} height={deviceheight * 0.018} />}

                            </View>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Notifylist')} >
                        <View style={style.listsec}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                {theme.theme == "dark" ? <NotiPic width={devicewidth * 0.05} height={devicewidth * 0.05} /> : <NotiPic1 width={devicewidth * 0.05} height={devicewidth * 0.05} />}
                                <Text style={style.para}>Notifications</Text>
                            </View>
                            <View>

                                {theme.theme == "dark" ? <Rightarrow1 width={devicewidth * 0.035} height={deviceheight * 0.018} /> : <Rightarrow width={devicewidth * 0.035} height={deviceheight * 0.018} />}

                            </View>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Preferences')} >
                        <View style={style.listsec}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                {theme.theme == "dark" ? <PrePic width={devicewidth * 0.05} height={devicewidth * 0.05} /> : <PrePic1 width={devicewidth * 0.05} height={devicewidth * 0.05} />}
                                <Text style={style.para}>Preferences</Text>
                            </View>
                            <View>

                                {theme.theme == "dark" ? <Rightarrow1 width={devicewidth * 0.035} height={deviceheight * 0.018} /> : <Rightarrow width={devicewidth * 0.035} height={deviceheight * 0.018} />}

                            </View>

                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => navigation.navigate('cmspage', {
                        routename: "AboutUs"
                    })} >
                        <View style={style.listsec}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                <IconFont name="users" size={devicewidth * 0.042} color={theme.theme == "dark" ? "#fff" : "#00001C"} />
                                {/* {theme.theme == "dark" ? <AboutPic width={devicewidth * 0.05} height={devicewidth * 0.05} /> : <AboutPic1 width={devicewidth * 0.05} height={devicewidth * 0.05} />} */}
                                <Text style={style.para}>About us</Text>
                            </View>
                            <View>

                                {theme.theme == "dark" ? <Rightarrow1 width={devicewidth * 0.035} height={deviceheight * 0.018} /> : <Rightarrow width={devicewidth * 0.035} height={deviceheight * 0.018} />}

                            </View>

                        </View>
                    </TouchableOpacity>

                    {/* <TouchableOpacity  >
                        <View style={style.listsec}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                {theme.theme == "dark" ? <NetworkPic width={devicewidth * 0.05} height={devicewidth * 0.05} /> : <NetworkPic1 width={devicewidth * 0.05} height={devicewidth * 0.05} />}
                                <Text style={style.para}>Supported Blockchain Network</Text>
                            </View>
                            <View>

                                {theme.theme == "dark" ? <Rightarrow1 width={devicewidth * 0.035} height={deviceheight * 0.018} /> : <Rightarrow width={devicewidth * 0.035} height={deviceheight * 0.018} />}

                            </View>

                        </View>
                    </TouchableOpacity> */}


                    <TouchableOpacity onPress={() => navigation.navigate('cmspage', {
                        routename: "Privacy Policy"
                    })} >
                        <View style={style.listsec}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                {theme.theme == "dark" ? <Privacyicon width={devicewidth * 0.05} height={devicewidth * 0.05} /> : <Privacyicon1 width={devicewidth * 0.05} height={devicewidth * 0.05} />}
                                <Text style={style.para}>Privacy Policy</Text>
                            </View>
                            <View>

                                {theme.theme == "dark" ? <Rightarrow1 width={devicewidth * 0.035} height={deviceheight * 0.018} /> : <Rightarrow width={devicewidth * 0.035} height={deviceheight * 0.018} />}

                            </View>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('cmspage', {
                        routename: "Terms and Conditions"
                    })} >
                        <View style={style.listsec}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                {theme.theme == "dark" ? <Terms width={devicewidth * 0.05} height={devicewidth * 0.05} /> : <Terms1 width={devicewidth * 0.05} height={devicewidth * 0.05} />}
                                <Text style={style.para}>Terms & Conditions</Text>
                            </View>
                            <View>

                                {theme.theme == "dark" ? <Rightarrow1 width={devicewidth * 0.035} height={deviceheight * 0.018} /> : <Rightarrow width={devicewidth * 0.035} height={deviceheight * 0.018} />}

                            </View>

                        </View>
                    </TouchableOpacity>




                </ScrollView>








            </Card>

        </SafeAreaView>
    )
}

const styles = (theme) =>
    StyleSheet.create({

        card_container: {
            width: "95%",
            backgroundColor: theme.background,
            alignSelf: "center",
            borderRadius: borderradius * 1,
            paddingVertical: "7%",
            paddingHorizontal: "5%",
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 1,
            // shadowRadius: 4,
            // elevation: 5,
            height: "80%",
            bottom: "8%",
            position: "absolute",

            zIndex: 999


        },


        para: {
            fontSize: RFPercentage(1.95),
            color: theme.text,
            fontFamily: Fonts.Regular,


        },
        paragray: {
            fontSize: RFPercentage(1.45),
            color: "#8C9BAA",
            fontFamily: Fonts.Regular,
            textAlign: 'left',
            lineHeight: 15

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
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            textAlign: "center"

        },
        gradTitle1: {
            fontSize: RFPercentage(2.55),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            textAlign: "center"

        },
        listsec: {
            flexDirection: 'row',
            justifyContent: "space-between",
            alignItems: 'center',
            marginBottom: "10%",
            backgroundColor: theme.secondarybg,
            borderRadius: borderradius * 1,
            width: "100%",
            padding: "4%"

        }




    })