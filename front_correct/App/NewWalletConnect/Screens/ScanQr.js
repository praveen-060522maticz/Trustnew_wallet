import { View, Text, StyleSheet, StatusBar, SafeAreaView } from 'react-native'
import React, { useContext } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useNavigation } from '@react-navigation/native';
import themeContext from '../../Utilities/themecontext';
import { Fonts } from '../../Utilities/fonts';
import { RFPercentage } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../Navigations/Header';

export default function ScanQr() {

    const navigation = useNavigation()

    const theme = useContext(themeContext);
    const style = styles(theme);

    const onSuccess = (codes) => {
        const uri = codes.data
        // console.log('codes---->', codes);
        navigation.navigate('Home', { uri });
    }

    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <LinearGradient colors={[theme.background, theme.background]} >
                <Header title={"Scan QR"} />
                <View style={{marginTop:"20%" }}>
                    <QRCodeScanner
                        onRead={onSuccess}
                        showMarker={true}
                    />
                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}


const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:theme.background
        },
       
      

        para: {
            fontSize: RFPercentage(2.25),
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
      




    })