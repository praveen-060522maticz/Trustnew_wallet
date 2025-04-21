/** packages*/
import React, { useContext, useRef, useState, useEffect } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,

} from "react-native";
import { useRoute } from '@react-navigation/native';
import { RFPercentage } from "react-native-responsive-fontsize";
import { deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { Fonts } from "../../Utilities/fonts";
import Header from "../../Navigations/Header";
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { Getpasscodestataus, SetBiomatricstataus, SetPasscode, Setpasscodestatus } from "../../Utilities/usestorage";
import { Toastfn } from "../../Utilities/toast";
import { isEmpty } from "../../Utilities/commenfuctions";
import themeContext from "../../Utilities/themecontext";
import Closeicon from '../../Assets/caexicons/closeicon.svg';
import Closeicon1 from '../../Assets/caexicons/closeicon1.svg'
import { C } from "../../Utilities/colors";

const sty = StyleSheet.create({
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 35,
        height: 35,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: '#000',
        textAlign: 'center',
        borderRadius: 100,
    },
    focusCell: {
        borderColor: '#000',
    },
});

const CELL_COUNT = 6;


export default function Confirmpasscode(props) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const pinView = useRef(null);
    const [enteredPin, setEnteredPin] = useState("");
    const route = useRoute();
    const Passcodedata = route.params.passcode;
    const previousRouteName = route.params.previousRouteName;
    /** Get passcode status*/
    useEffect(() => {
        var passcode = Getpasscodestataus()

        if (enteredPin.length == 6) {

            if (isEmpty(passcode)) {
                SetPasscode(enteredPin)

            }
            if (Passcodedata === enteredPin) {
                SetPasscode(enteredPin)
                Setpasscodestatus(true)
                SetBiomatricstataus(true)

                setTimeout(() => {
                    props.navigation.navigate(`${previousRouteName}`)
                }, 600)
            }
            else {
                pinView.current.clearAll();
                Toastfn("Passcode does not match")
            }
        }


    }, [enteredPin]);

    const ref = useBlurOnFulfill({ value: enteredPin, cellCount: CELL_COUNT });
    const [cusprops, getCellOnLayoutHandler] = useClearByFocusCell({
        value: enteredPin,
        setValue: setEnteredPin,
    });

    return (
        <>
            <SafeAreaView style={style.container}>
                <View style={style.container}>
                    <Header title={"Setup Passcode"} />

                    <View style={{ paddingTop: "30%" }}>
                        <View>
                            <Text style={style.para}>Re-Enter Your New passcode</Text>
                        </View>
                        {/* <ReactNativePinView
                            inputSize={25}
                            ref={pinView}
                            pinLength={6}
                            buttonSize={deviceheight * 0.10}
                            onValueChange={(value) => setEnteredPin(value)}
                            buttonAreaStyle={{
                                marginTop: 10,

                            }}
                            inputAreaStyle={{
                                marginBottom: "15%",
                                marginTop: "-15%"
                            }}
                            inputViewEmptyStyle={{
                                backgroundColor: theme.secondarybg,
                                borderWidth:1,
                                borderColor:theme.theme == "dark"?"#707070":"#0D0D0D"
                            }}
                            inputViewFilledStyle={{
                                backgroundColor:enteredPin.length == 6 ? C.primary:theme.text,
                            }}
                            buttonViewStyle={{
                                borderColor: "transparent",
                                backgroundColor: "transparent",
                            }}
                            buttonTextStyle={{
                                color: theme.text,
                                fontSize: RFPercentage(2.25),
                                fontFamily: Fonts.Regular,
                                backgroundColor: 'transparent',
                            }}
                            onButtonPress={(key) => {
                                if (key === "custom_right") {
                                    pinView.current.clear();
                                }
                            }}
                            customRightButton={
                                theme.theme =="dark"? <Closeicon width={devicewidth * 0.07} height={deviceheight * 0.07} />: <Closeicon1 width={devicewidth * 0.07} height={deviceheight * 0.07} />
                            }
                            style={{ marginTop: 20 }}
         
                        /> */}

                        <CodeField
                            ref={ref}
                            {...cusprops}
                            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                            value={enteredPin}
                            onChangeText={setEnteredPin}
                            cellCount={CELL_COUNT}
                            rootStyle={sty.codeFieldRoot}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            autoComplete={Platform.select({ android: 'sms-otp', default: 'one-time-code' })}
                            testID="my-code-input"
                            renderCell={({ index, symbol, isFocused }) => (
                                <Text
                                    key={index}
                                    style={[sty.cell, isFocused && sty.focusCell]}
                                    onLayout={getCellOnLayoutHandler(index)}>
                                    {symbol || (isFocused ? <Cursor /> : null)}
                                </Text>
                            )}
                        />
                    </View>

                </View>
            </SafeAreaView>
        </>
    )
}
const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background
        },
        custsearch: {
            borderRadius: 30,
            backgroundColor: "#fff",
            margin: 15,
            shadowOffset: 0,
            fontFamily: Fonts.Bold
        },

        seperatorLine: {
            height: 0.5,
            backgroundColor: "grey",
        },
        para: {
            fontSize: RFPercentage(2),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'center',
            marginTop: "-18%"
        },
        parabottom: {
            fontSize: RFPercentage(1.85),
            color: "#010101",
            fontFamily: Fonts.Medium,
            textAlign: 'center',
            paddingHorizontal: "5%",
            paddingTop: "15%"
        },
    });