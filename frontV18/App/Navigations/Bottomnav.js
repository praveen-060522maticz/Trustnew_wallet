
import React, { useEffect, useContext, useRef, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Image,
    Keyboard,
    Dimensions,
    Pressable,
} from "react-native";
import { borderradius, deviceheight, devicewidth } from "../Utilities/Dimensions"
import Swaplogo from '../Assets/Icons/swap.svg'
import SwaplogoActive from '../Assets/Icons/swapactive.svg'
import Dapplogo from '../Assets/Icons/dapp.svg'
import DapplogoActive from '../Assets/Icons/dappactive.svg'
import Ewallet from '../Assets/Icons/ewallet.svg'
import EwalletActive from '../Assets/Icons/ewalleta.svg'
import LinearGradient from "react-native-linear-gradient";

import { useIsFocused } from "@react-navigation/native";
import Wallethomenav from "../Navigations/Wallethomenav";
import Swaphomenav from "../Navigations/Swaphomenav";

import Dapp from "../Screens/WalletHome/dapp";
import Createprivacy from "../Screens/Walletcreate/walletprivacy";
import { GetDapp } from "../Utilities/usestorage";
import { Toastfn } from "../Utilities/toast";
import themeContext from "../Utilities/themecontext";
import Wallet1 from "../Assets/caexicons/wallet1.svg";
import Dapp1 from "../Assets/caexicons/dapp1.svg"
import Setting1 from "../Assets/caexicons/setting1.svg"
import Swap1 from "../Assets/caexicons/swap1.svg"
import Wallet2 from "../Assets/caexicons/wallet2.svg";
import Dapp2 from "../Assets/caexicons/dapp2.svg"
import Setting2 from "../Assets/caexicons/setting2.svg"
import Swap2 from "../Assets/caexicons/swap2.svg"
import Settinglist from "../Screens/settingpage/Settinglist";
import Button from "../Components/Button";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../Utilities/fonts";
import Scan4 from "../Assets/caexicons/scan4.svg"
import Scan5 from "../Assets/caexicons/scan5.svg"


const Tab = createBottomTabNavigator();
const isPhone = devicewidth < 600;

function CustomTabBar({ state, descriptors, navigation }) {
    const theme = useContext(themeContext);

    const isFocused = useIsFocused();
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [active, setActive] = useState("connectwallet")

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    if (!isFocused || keyboardVisible) {
        return null; // Return null to hide the tab bar
    }


    const walletconnect = () => {
        navigation.navigate("Wallethomenav")
        setActive("connectwallet")
    }
    const Dapp = () => {
        var status = GetDapp()
        if (status) {
            navigation.navigate("Dapp")
            setActive("Dapp")
        }
        else {
            Toastfn("Please Enable Dapps Browser")
            navigation.navigate("Preferences")

        }
    }
    const settings = () => {
        navigation.navigate("Settinglist")
        setActive("Settings")
    }
    return (
        <>
            <View style={{
                width: "100%", height: "10%", alignItems: "center", backgroundColor: theme.theme == "dark" ? "#0A090D" : "transparent", justifyContent: "center",
                borderTopColor: theme.theme == "dark" ? "#16293A" : "#e0edf8",
                borderTopWidth: 1,
                // shadowColor: '#3B8BD699', // Shadow color
                // shadowOffset: { width: 0, height: -10 }, // Negative for top shadow
                // shadowOpacity: 0.1,
                // shadowRadius: 10,
                // elevation: 5, // Android shadow
            }} >







                <View style={{ width: "95%", flexDirection: "row", alignItems: "center", justifyContent: "space-around", backgroundColor: "transparent" }}>
                    <View style={{ width: "75%", backgroundColor: theme.theme == "dark" ? "#26263D" : "#00001C", borderRadius: borderradius * 15, height: "100%", flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>

                        {active == "connectwallet" ?
                            <LinearGradient
                                style={[styles.selectedtxt, { left: "1%" }]}
                                colors={['rgba(26,198,201,1)', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']}
                                locations={[0, 0.7, 1]}   // Color stops at 0%, 70%, and 100%
                                start={{ x: 0.1, y: 0 }}  // Slightly right of top-left
                                end={{ x: 1, y: 0.9 }}    // Bottom-right for 132deg
                            >
                                <Wallet1 width={devicewidth * 0.07} height={devicewidth * 0.07} />
                                <Text style={styles.text}>Wallet</Text>
                            </LinearGradient>

                            :
                            <Pressable style={styles.inactiveTab} onPress={() => walletconnect()}>
                                {/* {theme.theme == "dark" ? */}
                                <Wallet1 width={devicewidth * 0.07} height={devicewidth * 0.07} />
                                {/* : <Wallet2 width={devicewidth * 0.07} height={devicewidth * 0.07} />} */}
                            </Pressable>}

                        {active == "Dapp" ?
                            <LinearGradient
                                style={styles.selectedtxt}
                                colors={['rgba(26,198,201,1)', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']}
                                locations={[0, 0.7, 1]}   // Color stops at 0%, 70%, and 100%
                                start={{ x: 0.1, y: 0 }}  // Slightly right of top-left
                                end={{ x: 1, y: 0.9 }}    // Bottom-right for 132deg
                            >

                                <Dapp1 width={devicewidth * 0.07} height={devicewidth * 0.07} />

                                <Text style={styles.text}>Dapp</Text>
                            </LinearGradient>
                            :

                            <Pressable style={styles.inactiveTab} onPress={() => Dapp()}>
                                {/* {theme.theme == "dark" ? */}
                                <Dapp1 width={devicewidth * 0.07} height={devicewidth * 0.07} />
                                {/* :
                                    <Dapp2 width={devicewidth * 0.07} height={devicewidth * 0.07} />} */}

                            </Pressable>}


                        {active == "Settings" ?
                            <LinearGradient
                                style={[styles.selectedtxt, { right: "1%" }]}
                                colors={['rgba(26,198,201,1)', 'rgba(56,120,199,1)', 'rgba(61,30,136,1)']}
                                locations={[0, 0.7, 1]}   // Color stops at 0%, 70%, and 100%
                                start={{ x: 0.1, y: 0 }}  // Slightly right of top-left
                                end={{ x: 1, y: 0.9 }}    // Bottom-right for 132deg
                            >

                                <Setting1 width={devicewidth * 0.07} height={devicewidth * 0.07} />
                                <Text style={styles.text}>Settings</Text>
                            </LinearGradient>
                            :
                            <Pressable style={styles.inactiveTab} onPress={() => settings()} >
                                {/* {theme.theme == "dark" ? */}
                                <Setting1 width={devicewidth * 0.07} height={devicewidth * 0.07} />
                                {/* :
                                    <Setting2 width={devicewidth * 0.07} height={devicewidth * 0.07} />} */}
                            </Pressable>}

                    </View>



                    <Pressable
                        // onPress={() => navigation.navigate("Settingwalletconnect")}
                        onPress={() => navigation.navigate("Home")}
                        style={{ backgroundColor: theme.theme == "dark" ? "#26263D" : "#01071c", borderRadius: borderradius * 100, height: deviceheight / 14, width: devicewidth / 7, alignItems: "center", justifyContent: "center", }}>
                        {/* {theme.theme == "dark" ? */}
                        <Scan4 width={devicewidth * 0.07} height={devicewidth * 0.07} />
                        {/* :  */}
                        {/* <Scan5 width={devicewidth * 0.07} height={devicewidth * 0.07} /> */}
                        {/* } */}
                    </Pressable>


                    {/* swap */}
                    {/* <Pressable 
                     onPress={() => settings()} 
                    style={{backgroundColor:theme.theme == "dark"?"#121116":"#F9F9F9", borderRadius: borderradius * 2.2, height: deviceheight / 14,width:devicewidth/6,alignItems:"center",justifyContent:"center", }}>
                          {theme.theme == "dark"?
                    <Swap1 width={devicewidth * 0.07} height={devicewidth * 0.07} />: <Swap2 width={devicewidth * 0.07} height={devicewidth * 0.07} />}
                    </Pressable> */}



                </View>
            </View>
        </>
    )
}

function BottomNav() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarHideOnKeyboard: true,
                headerShown: false
            }}
            tabBar={(props) => < CustomTabBar {...props} />}
        >

            < Tab.Screen name="Wallethomenav" component={Wallethomenav} options={{ unmountOnBlur: true }} />
            < Tab.Screen name="Dapp" component={Dapp} options={{ unmountOnBlur: true }} />
            < Tab.Screen name="Swaphomenav" component={Swaphomenav} />
            < Tab.Screen name="Settinglist" component={Settinglist} />



        </Tab.Navigator >
    );
}


export default BottomNav;

const styles = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderTopWidth: 0,
        borderRightWidth: isPhone ? 80 : 120,
        borderBottomWidth: isPhone ? 17 : 20,
        borderLeftWidth: 0,
        borderTopColor: 'transparent',
        borderRightColor: '#FFCE05',
        borderBottomColor: '#000', // Set the desired color for the triangle
        borderLeftColor: 'transparent',
        // backgroundColor:'#fff',
        position: "absolute",
        alignSelf: "flex-end"
    },
    triangle2: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: isPhone ? 17 : 20,
        borderLeftWidth: isPhone ? 80 : 120,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FFCE05', // Set the desired color for the triangle
        borderLeftColor: 'transparent',
        backgroundColor: '#000',
        position: "absolute",
        alignSelf: "flex-end",
        // transform: [{ rotate: "90deg" }],
        bottom: 0
    },
    wallet: {
        width: "42.5%",
        height: "100%",
        backgroundColor: "#000",
        borderTopLeftRadius: borderradius * 2,
        borderBottomLeftRadius: borderradius * 2,
        left: "1%",
    },
    wallet_Active: {
        width: "42.5%",
        height: "100%",
        backgroundColor: "#000",
        borderTopLeftRadius: borderradius * 2,
        borderBottomLeftRadius: borderradius * 2,
        // borderLeftColor: "#00A3FF",
        borderLeftWidth: 3,
        left: "1%",
    },
    cryptobuy_Active: {
        width: isPhone ? "15%" : "12.5%",
        height: "90%",
        backgroundColor: "#293351",
        borderRadius: borderradius * 1,
        justifyContent: "center",
        // borderColor: "#00A3FF",
        borderBottomWidth: 2


    },
    cryptobuy: {
        width: isPhone ? "15%" : "12.5%",
        height: "90%",
        backgroundColor: "#293351",
        borderRadius: borderradius * 1, justifyContent: "center"
    },
    Profile: {
        width: "42.5%",
        height: "100%",
        backgroundColor: "#000",
        transform: [{ scaleX: -1 }],
        borderTopLeftRadius: borderradius * 2,
        borderBottomLeftRadius: borderradius * 2,
        right: "1%"
    },
    Profile_Active: {
        width: "42.5%",
        height: "100%",
        backgroundColor: "#000",
        transform: [{ scaleX: -1 }],
        // borderLeftColor: "#00A3FF",
        borderLeftWidth: 3,
        borderTopLeftRadius: borderradius * 2,
        borderBottomLeftRadius: borderradius * 2,
        right: "1%"
    },
    selectedtxt: {
        // width: "30%",
        width: "43%",
        padding: "4%",
        borderRadius: borderradius * 100,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center"
    },
    inactiveTab: {
        // width: "30%",
        width: "27.5%",
        padding: "5%",
        borderRadius: borderradius * 100,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center"
    },
    text: {
        fontSize: RFPercentage(1.9),
        color: "#FFFFFF",
        fontFamily: Fonts.Regular,
        marginLeft: "6%"
    }
})