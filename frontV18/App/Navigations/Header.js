import React, { useContext, useState } from "react"
import { BackHandler, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { Fonts } from "../Utilities/fonts"
import { RFPercentage } from "react-native-responsive-fontsize";
import { borderradius, deviceheight, devicewidth } from "../Utilities/Dimensions";
// import Backarrow from '../Assets/Icons/backarrow.svg'
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import Backarrow from '../Assets/caexicons/backarrow1.svg'
import Backarrow1 from '../Assets/caexicons/backarrow2.svg'
import themeContext from "../Utilities/themecontext";
import { BeatifyConsole } from "../NewWalletConnect/utils/common";
import { navigateToExistingScreen } from "../Utilities/commenfuctions";

const isPhone = devicewidth < 600;
const Header = (props) => {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const navigation = useNavigation();
    const [disabled, pressButton] = useState(false);
    const backarrow = () => {
        navigation.goBack()
    }
    const getRoutes = useNavigationState(
        (state) => state.routes
    );

    console.log('routesfkjasfosfoisehfihesifhioh---->', getRoutes);
    var incLength = 2
    const CustomBackFunc = () => {
        try {
            const routes = getRoutes;
            console.log('routesdawdaw---->', routes, routes[routes.length - incLength]);
            var prevRoute;
            if ((routes[routes.length - incLength]?.name == "Passcode") ||
                (routes[routes.length - incLength]?.name == "CreatePasscode") ||
                (routes[routes.length - incLength]?.name == "ConfirmPasscode") ||
                (routes[routes.length - incLength]?.name == "Walletconnectqr") ||
                (routes[routes.length - incLength]?.name == "QrCodePage") ||
                (routes[routes.length - incLength]?.name == "ScanQr") ||
                (routes[routes.length - 1]?.name == (routes[routes.length - incLength]?.name))
            ) {
                // (routes[routes.length - 1]?.name == routes[routes.length - incLength]?.name)) {
                incLength = incLength + 1
                return CustomBackFunc();
            }
            else {
                console.log('incLength---->', incLength);
                prevRoute = routes[routes.length - incLength];
            }
            console.log('prevRoute---->', prevRoute);
            pressButton(false);

            navigateToExistingScreen(navigation, prevRoute?.name || "Walletmain", prevRoute?.params || {});
        } catch (error) {
            console.log("erro on custom back", error);
            navigation.navigate("Walletmain");
        }

    };

    const propsTypes = [
        "home",
        "frompivacy",
        "swiptohome",
        "walletdetails",
        "login",
        "createwallet",
        "scan",
        "pivacypolicy",
        "exit",
        "Sendwallet"
    ]

    return (
        <View style={style.container} >
            <Text style={style.headertext} >{props.title}</Text>
            {!propsTypes.includes(props.type) &&
                <Pressable disabled={disabled} onPress={() => CustomBackFunc()} style={isPhone ? style.arrowcontainer : style.arrowcontainer1} >
                    {theme.theme == "dark" ? <Backarrow width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} /> : <Backarrow1 width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} />}
                </Pressable>}
            {props.type == "frompivacy" &&
                <Pressable onPress={() => navigation.navigate("Createwallet")} style={isPhone ? style.arrowcontainer : style.arrowcontainer1} >
                    {theme.theme == "dark" ? <Backarrow width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} /> : <Backarrow1 width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} />}
                </Pressable>}
            {props.type == "home" &&
                <Pressable onPress={() => navigation.navigate('Walletmain')} style={isPhone ? style.arrowcontainer : style.arrowcontainer1} >
                    {theme.theme == "dark" ? <Backarrow width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} /> : <Backarrow1 width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} />}
                </Pressable>}
            {props.type == "walletdetails" &&
                <Pressable onPress={() => navigation.navigate('Walletlisting')} style={isPhone ? style.arrowcontainer : style.arrowcontainer1} >
                    {theme.theme == "dark" ? <Backarrow width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} /> : <Backarrow1 width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} />}
                </Pressable>}
            {props.type == "exit" &&
                <Pressable onPress={() => { BackHandler.exitApp() }} style={isPhone ? style.arrowcontainer : style.arrowcontainer1} >
                    {theme.theme == "dark" ? <Backarrow width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} /> : <Backarrow1 width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} />}
                </Pressable>}
            {props.type == "scan" &&
                <Pressable onPress={() => { if(props?.data === "showphrase")navigation.goBack(); else navigation.navigate('Copywalletphrase', "scantophrase"); }} style={isPhone ? style.arrowcontainer : style.arrowcontainer1} >
                    {theme.theme == "dark" ? <Backarrow width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} /> : <Backarrow1 width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} />}
                </Pressable>}
            {props.type == "pivacypolicy" &&
                <Pressable onPress={() => navigation.navigate("Walletprivacy")} style={isPhone ? style.arrowcontainer : style.arrowcontainer1} >
                    {theme.theme == "dark" ? <Backarrow width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} /> : <Backarrow1 width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} />}
                </Pressable>}
            {(props.type == "Sendwallet") &&
                <Pressable onPress={() => { navigation.goBack(); }} style={isPhone ? style.arrowcontainer : style.arrowcontainer1} >
                    {theme.theme == "dark" ? <Backarrow width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} /> : <Backarrow1 width={isPhone ? devicewidth * 0.05 : devicewidth * 0.025} height={devicewidth * 0.045} style={style.arrowcontainer} />}
                </Pressable>}

        </View>
    )
}
export default Header

const styles = (theme) =>
    StyleSheet.create({
        container: {
            width: "100%",
            flexDirection: "row",
            // backgroundColor: "#3D4A6C",
            height: deviceheight * 0.10,

            alignItems: "center",
        },
        headertext: {
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: Fonts.Regular,
            fontSize: RFPercentage(2.5),
            color: theme.text
        },
        arrowcontainer: {
            width: "14%",
            borderRadius: borderradius * 2.5,
            justifyContent: "center",
            padding: "2%",
            marginLeft: "3%",
            // backgroundColor:"red"
        },
        arrowcontainer1: {
            width: "5%",
            borderRadius: borderradius * 2.5,
            // backgroundColor: "green",
            justifyContent: "center",
            padding: "1.55%",
            paddingHorizontal: '4%',
            alignItems: 'center',
            marginLeft: "5%"
        },
        arrowimg: {
            alignSelf: "center",
            resizeMode: "contain"
        }
    })