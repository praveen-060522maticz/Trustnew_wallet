import React, { useContext, useRef, useState, useEffect } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    BackHandler,
    StatusBar,
    Platform,
    Pressable,
} from "react-native";
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { RFPercentage } from "react-native-responsive-fontsize";
import { deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import Header from "../../Navigations/Header";
import LinearGradient from "react-native-linear-gradient";
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Closeicon from '../../Assets/caexicons/closeicon.svg';
import Closeicon1 from '../../Assets/caexicons/closeicon1.svg'
import Fingericon from '../../Assets/Icons/fingerprint.svg'
import { GetBiomatricstataus, Getpasscodestataus, Setpasscodestatus } from "../../Utilities/usestorage";
import { Toastfn } from "../../Utilities/toast";
import ReactNativeBiometrics from 'react-native-biometrics'
import { C } from "../../Utilities/colors";
import Fingericon1 from "../../Assets/Icons/fingerprint1.svg"

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


export default function Passcode(props) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const pinView = useRef(null);
    const [enteredPin, setEnteredPin] = useState("");
    const [biomatric, setshowbiometric] = useState(true);
    const [enterbiomatric, setenterbiometric] = useState();


    const route = useRoute();

    const previousRouteName = route.params.routename;
    const mnemonic = route.params.mnemonic;
    const privKey = route.params.privKey
    const type = route.params.type
    const Index = route.params.index

    /**Re-direct to next page*/
    useEffect(() => {
        let Passcodedata = Getpasscodestataus()
        let Biomatric = GetBiomatricstataus()
        setshowbiometric(Biomatric)
        // SetCurrentIndex(0)
        console.log('Passcodedata---->', Passcodedata, enteredPin);
        if (enteredPin?.length == 6) {
            if (Passcodedata === enteredPin) {
                // setTimeout(() => {
                    if (previousRouteName === "showkey") {
                        type == 'singlecoin' ?
                            props.navigation.navigate("Showprivatekey", { privKey: Object.values(privKey)[0] })

                            :
                            props.navigation.navigate("WalletPrivateKey", { index: Index })


                    }
                    else if (previousRouteName === "showphrase") {

                        props.navigation.navigate("Showphrase", { mnemonic: mnemonic });
                    }
                    else if (previousRouteName === "settinglist") {
                        props.navigation.navigate("Settinglist", { passcode: enteredPin });
                    }
                    else if (previousRouteName === "home") {
                        props.navigation.navigate("Walletmain");
                    }
                    else if (previousRouteName === "Createwallet") {
                        props.navigation.navigate("Createwallet");
                    }
                    else if (previousRouteName === "security") {
                        Toastfn("Passcode Disbles Successfully")
                        // SetPasscode("")
                        Setpasscodestatus(false)
                        props.navigation.navigate("Securitylist");
                    } else if (previousRouteName === "ResetPasscode") {
                        props.navigation.navigate("CreatePasscode", { routename: "Securitylist" })
                    }

                // }, 600)
            }
            else {
                Toastfn("Passcode does not match")

            }
        }
    }, [enteredPin, enterbiomatric]);



    useFocusEffect(
        React.useCallback(() => {
            if (previousRouteName !== "ResetPasscode") {
                const onBackPress = () => {
                    setEnteredPin("")
                    BackHandler.exitApp();
                    return true;
                };
                // Add Event Listener for hardwareBackPress
                const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
                return () => {
                    setEnteredPin("")
                    props.navigation.setParams({ path: null });
                    subscription.remove()
                    // Once the Screen gets blur ReonPress={() => setEnteredPin("000000")} move Event Listener
                    // BackHandler.removeEventListener("hardwareBackPress", onBackPress);
                };
            }

        }, [previousRouteName, props.navigation])
    );
    /** Finger print accessfunction */
    const onfinger = () => {
        ReactNativeBiometrics.simplePrompt({

            promptMessage: Platform.OS == 'android' ? 'Confirm fingerprint' : "Authenticate with your fingerprint or Face ID'",
        })

            .then((resultObject) => {
                const { success } = resultObject;
                setenterbiometric(success)
                if (success) {
                    setTimeout(() => {
                        if (previousRouteName === "showkey") {
                            type == 'singlecoin' ?
                                props.navigation.push("Showprivatekey", { privKey: Object.values(privKey)[0] })

                                :
                                props.navigation.push("WalletPrivateKey", { index: Index })


                        }
                        else if (previousRouteName === "showphrase") {

                            props.navigation.push("Showphrase", { mnemonic: mnemonic });
                        }
                        else if (previousRouteName === "settinglist") {
                            props.navigation.push("Settinglist", { passcode: enteredPin });
                        }
                        else if (previousRouteName === "home") {
                            props.navigation.push("Walletmain");
                        }
                        else if (previousRouteName === "Createwallet") {
                            props.navigation.push("Createwallet");
                        }
                        else if (previousRouteName === "security") {
                            Toastfn("Passcode Disbles Successfully")
                            Setpasscodestatus(false)
                            props.navigation.push("Securitylist");
                        } else if (previousRouteName === "ResetPasscode") {
                            props.navigation.push("CreatePasscode", { routename: "Securitylist" })
                        }

                    }, 600)
                }
                else {
                    Toastfn("Biometric Does Not Match")

                }
            })
            .catch(() => {
                Toastfn("Biometric Does Not Match")

            });


    }


    const ref = useBlurOnFulfill({ value: enteredPin, cellCount: CELL_COUNT });
    const [cusprops, getCellOnLayoutHandler] = useClearByFocusCell({
        value: enteredPin,
        setValue: setEnteredPin,
    });

    return (
        <>
            <SafeAreaView style={style.container}>
                <StatusBar
                    backgroundColor={theme.background} />
                <LinearGradient style={style.container} colors={[theme.background, theme.background]} >
                    <Pressable>
                        <Header title={"Enter Password"} type={previousRouteName !== "ResetPasscode" ? "exit" : ""} />
                    </Pressable>
                    <View style={{ paddingTop: "30%" }}>
                        <View>
                            <Text style={style.para}>{previousRouteName !== "ResetPasscode" ? "Enter Your Passcode" : "Enter Your Old Passcode"}</Text>
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
                                borderWidth: 1,
                                borderColor: theme.theme == "dark" ? "#707070" : "#0D0D0D"
                            }}
                            inputViewFilledStyle={{
                                backgroundColor: enteredPin?.length == 6 ? theme.theme == "dark" ? "#1AC6C9" : C.primary : theme.text,
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
                                if (key === "custom_left" && biomatric) {
                                    onfinger()
                                }

                            }}
                            customRightButton={
                                theme.theme == "dark" ? <Closeicon width={devicewidth * 0.07} height={deviceheight * 0.07} /> : <Closeicon1 width={devicewidth * 0.07} height={deviceheight * 0.07} />
                            }
                            style={{ marginTop: 20 }}

                            customLeftButton={
                                biomatric ?
                                    theme.theme == "dark" ? <Fingericon width={devicewidth * 0.07} height={deviceheight * 0.07} /> : <Fingericon1 width={devicewidth * 0.07} height={deviceheight * 0.07} />
                                    : false

                            }
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

                </LinearGradient>
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
            color: theme.text,
            fontFamily: Fonts.Medium,
            textAlign: 'center',
            paddingHorizontal: "5%",
            paddingTop: "15%"
        },
    });