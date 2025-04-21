/** Packeges*/
import React, { useContext, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Pressable, BackHandler, Alert, Image,TextInput } from "react-native";
import { deviceheight, devicewidth } from "../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import { ScrollView } from "react-native-gesture-handler";
import Menudot from '../../Assets/Icons/menudot.svg';
import Deleteicon from '../../Assets/Icons/delete.svg';
import Deleteicon1 from '../../Assets/Icons/delete1.svg';
import Menudot1 from '../../Assets/Icons/menudot1.svg';
import Backarrow from '../../Assets/caexicons/backarrow1.svg'
import Backarrow1 from '../../Assets/caexicons/backarrow2.svg'
import PlusPic from "../../Assets/caexicons/pluspic.svg"
import PlusPic1 from "../../Assets/caexicons/pluspic1.svg"
import { useFocusEffect } from "@react-navigation/native";
import { UseWalletArray, SetCurrentIndex, GetCurrentIndex, CurrentWalletArray, SetWallets, Deletewallet, AddWallet } from "../../Utilities/usestorage";
import { C } from "../../Utilities/colors";
import RadioPic from "../../Assets/caexicons/radiopic.svg"
import { Name_showing, addressshowing, showImage } from "../../Utilities/commenfuctions";
import Multipic from "../../Assets/caexicons/multipic.svg"
import { isEmpty } from "../../Utilities/commenfuctions";
import Trustne from '../../Assets/Images/icon_ios1024.png'
import { onAccountChange } from "../../NewWalletConnect/utils/WalletConnectUtills";
import Modal from 'react-native-modal';
import { Toastfn } from "../../Utilities/toast";
import IconFont from 'react-native-vector-icons/FontAwesome';

const isphone = devicewidth < 600
export default function Walletlisting({ navigation, route }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const backarrow = () => {
        if (!isEmpty(route.params) && route.params == 'settings') {
            navigation.push('Settinglist')

        }
        else {
            navigation.push('Walletmain')

        }
    }
    const [state, setState] = useState({
        data: [],
        loading: false,
    });
    const [currentindex, setcurrentindex] = useState({});
    const [visible, setvisible] = useState()
    const [deleteStr, setDeleteStr] = useState("")
    const [selectedValue, setSelectedValue] = useState(`option${currentindex}`);
    const { data } = state;


    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (!isEmpty(route.params) && route.params == 'settings') {
                    navigation.push('Settinglist')
                    return true;
                }
                else {
                    navigation.push('Walletmain')
                    return true;
                }
            };

            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );
            return () => {
                subscription.remove()

            //     BackHandler.removeEventListener("hardwareBackPress", onBackPress);


            };

        }, [route.params,navigation])
    );

    /** current wallet data*/
    useFocusEffect(
        React.useCallback(() => {
            getWalletData();
            let currenteindex = GetCurrentIndex();
            setcurrentindex(currenteindex)
            setSelectedValue(`option${currenteindex}`)
            // Deletefunction(1)

            return () => { };
        }, [])
    );
    /** for select wallet address*/
    const handleRadioPress = async (value, data, item) => {
        setSelectedValue(value);
        SetCurrentIndex(data)
        // await onAccountChange(item?.[0]?.walletaddress?.evm, "eip155:11155111")


        setTimeout(() => {
            navigation.push("Walletmain")
        }, 1000);
    };


    /** Get Wallet details*/
    const getWalletData = () => {

        var walletdetails = UseWalletArray()
        var arr = [];
        walletdetails?.map((item, index) => {

            if (item.length != 0) {
                arr.push(item);
            }
        });
        setState({
            data: arr?.map((item, index) => {

                item.key = index + 1
                return item
            }
            )
        })
    }
    //Delete Wallet Option
    const Deletefunction = (index) => {
        let walletarray = UseWalletArray();
        let currenteindex = GetCurrentIndex();

        walletarray.splice(index, 1)
        Deletewallet()
        SetWallets(walletarray)

        SetCurrentIndex(index == 0 ? 0 : parseInt(index) - 1)

        setTimeout(() => {
            walletarray?.length == 0 && index == 0 ? navigation.push("Splash") : navigation.push("Walletmain")
        }, 1000);
    }


    const handleDelete = (index) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this wallet?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => Deletefunction(index) },
            ],
            { cancelable: false }
        );
    };


    return (
        <>
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={{ flex: 1, backgroundColor: theme.background, width: "100%", alignItems: "center" }}>


                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "90%", marginTop: "7%", alignItems: "center", }}>

                    <Pressable onPress={() => backarrow()} style={isphone ? style.headerarrowcontainer : style.headerarrowcontainer2} >
                        {theme.theme == "dark" ? <Backarrow width={devicewidth * 0.065} height={devicewidth * 0.0545} style={style.arrowcontainer} /> : <Backarrow1 width={devicewidth * 0.055} height={devicewidth * 0.055} style={style.arrowcontainer} />}
                    </Pressable>
                    <View>
                        <Text style={style.headertext} >Wallet</Text>

                    </View>
                    <Pressable onPress={() => navigation.push('Createwallet', { from: "walletlist" })} style={style.headerarrowcontainer1} >
                        {theme.theme == "dark" ? <PlusPic width={isphone ? devicewidth * 0.065 : devicewidth * 0.025} height={devicewidth * 0.065} /> : <PlusPic1 width={isphone ? devicewidth * 0.065 : devicewidth * 0.025} height={devicewidth * 0.065} />}

                    </Pressable>

                </View>


                <View style={style.box_container} >



                    <View style={style.card_container}  >

                        <ScrollView showsVerticalScrollIndicator={false}>

                            {data?.map((item, index) => (
                                <>
                                    <View style={style.listsec}>
                                        <View style={{ maxWidth: "75%", minWidth: "75%", }}>
                                            <TouchableOpacity onPress={() => handleRadioPress(`option${index}`, index, item)} style={style.radioButton}>


                                                <View style={{ width: "90%", flexDirection: "row", alignItems: "center", backgroundColor: "transparent" }} >
                                                    <View>


                                                        {item[0].walletType == 'multicoin' ?
                                                            // <Multipic width={devicewidth * 0.13} height={deviceheight * 0.04} />
                                                            <Image source={Trustne} style={{ height: deviceheight * 0.04, width: devicewidth * 0.082, marginHorizontal: 10 }} />
                                                            :
                                                            showImage(item[0].network[0], 0.13, 0.04)

                                                        }
                                                    </View>

                                                    <View style={{ marginLeft: "3%", backgroundColor: "transparent" }}>
                                                        <Text style={style.para} numberOfLines={1}>{Name_showing(item[0].walletname)}</Text>

                                                        {item[0].walletType !== 'multicoin'
                                                            ?
                                                            <Text style={style.paragray}>{
                                                                addressshowing(
                                                                    item[0].network[0] == "TRX"
                                                                        ?
                                                                        item[0]?.walletaddress?.tron
                                                                        :
                                                                        item[0].network[0] == "BTC"
                                                                            ?
                                                                            item[0]?.walletaddress.btc
                                                                            :
                                                                            item[0]?.walletaddress.evm
                                                                )


                                                            }</Text>
                                                            :
                                                            <Text style={style.paragray}>Multicoin</Text>

                                                        }
                                                    </View>
                                                </View>


                                                <View>
                                                    {selectedValue === `option${index}` ?
                                                        <View >
                                                            <RadioPic width={devicewidth * 0.05} height={devicewidth * 0.0545} />
                                                        </View>
                                                        :
                                                        <View style={{
                                                            borderColor: theme.text,
                                                            borderWidth: 2,
                                                            borderRadius: 50,
                                                            height: 20,
                                                            width: 20
                                                        }}>
                                                        </View>
                                                    }
                                                </View>


                                            </TouchableOpacity>

                                        </View>
                                        <View style={{ minWidth: "5%", maxWidth: "5%", }}>
                                            <TouchableOpacity onPress={() => setvisible(index)} >
                                                {theme.theme == "dark" ? <Deleteicon1 width={devicewidth * 0.055} height={devicewidth * 0.055} /> : <Deleteicon width={devicewidth * 0.055} height={devicewidth * 0.055} />}

                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ minWidth: "10%", maxWidth: "10%", }}>
                                            <TouchableOpacity onPress={() => navigation.navigate('Walletedit', { item: item, index: index })} >
                                                {theme.theme == "dark" ? <Menudot1 width={devicewidth * 0.055} height={devicewidth * 0.055} /> : <Menudot width={devicewidth * 0.055} height={devicewidth * 0.055} />}

                                            </TouchableOpacity>
                                        </View>


                                    </View>
                                </>


                            ))

                            }

                        </ScrollView>








                    </View>
                </View>
            </View>
        </SafeAreaView>

        <Modal
            isVisible={!isEmpty(visible) || (visible == 0)}
            hideModalContentWhileAnimating
            backdropOpacity={0.6}
        >

            <View style={style.container2} onStartShouldSetResponder={() => setvisible()}>
                <View style={style.modalContainer}>
                    <Text style={style.permissionsText}> <IconFont name="exclamation-triangle" size={RFPercentage(2)} color={theme.theme == "dark" ? "#fff" : "#00001C"} /> ATTENTION REQUIRED:</Text>
                    <Text style={style.permissionsText2}>By doing action you'll lose assets.</Text>
                    <View style={style.inputsec}>
                        <TextInput
                            placeholder="Type 'Delete this wallet'"
                            style={style.inputstyle}
                            value={deleteStr}
                            placeholderTextColor={"grey"}
                            onChangeText={(e) => setDeleteStr(e)}
                        />
                    </View>
                    <View style={{ marginVertical: "5%" }} >
                        <TouchableOpacity style={{ backgroundColor: "red", borderRadius: 10, height: 50, width: 120, alignItems: "center", justifyContent: "center" }} onPress={() => {
                            if (isEmpty(deleteStr)) Toastfn("Please enter the words");
                            else if (deleteStr !== "Delete this wallet") Toastfn("Please enter the correct words");
                            else{ setvisible(); handleDelete(visible); }
                        }}>
                            <Text style={{ textAlign: "center", fontWeight: "700" }} >Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    </>
    )
}
const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background
        },
        container2: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            
        },
        inputstyle: {
            paddingHorizontal: 10,
            color: theme.text,
            fontSize: RFPercentage(1.85),
            fontFamily: Fonts.Medium,
            // backgroundColor:"red",
            width: "100%"
        },
        inputsec: {
            backgroundColor: theme.secondarybg,
            borderRadius: 7,
            width: "100%",
            flexDirection: 'row',
            alignItems: 'center',
            height: deviceheight * 0.065,
            marginTop: "3%"

        },
        headercontainer: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
        },
        permissionsText: {
            color: theme.text,
            fontSize: RFPercentage(2.6),
            // lineHeight: 16,
            fontWeight: '400',
            paddingBottom: 8,
        },
        permissionsText2: {
            color: theme.text,
            fontSize: RFPercentage(1.9),
            // lineHeight: 16,
            fontWeight: '400',
            paddingBottom: 8,
        },
        modalContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 15,
            backgroundColor: theme.background,
            width: '100%',
            paddingTop: 30,
            // minHeight: '50%',
            position: 'absolute',
            bottom: 44,
        },
        headertext: {
            fontFamily: Fonts.Regular,
            fontSize: RFPercentage(2.5),
            color: theme.text
        },
        headerarrowcontainer: {
            width: "14%",
            justifyContent: "center",
            padding: "1%",

        },
        headerarrowcontainer2: {
            width: "5%",
            justifyContent: "center",
            alignItems: 'center',
        },
        headerarrowcontainer1: {
            width: "10%",
            alignItems: "flex-end",
        },

        headerarrowimg: {
            alignSelf: "center",
            resizeMode: "contain",
        },
        box_container: {
            width: "100%",
            justifyContent: "center",
            alignItems: 'center',
        },
        card_container: {
            width: "90%",
            marginTop: "10%",
            marginBottom: "15%",

        },

        para: {
            fontSize: RFPercentage(2.05),
            color: theme.text,
            fontFamily: Fonts.Regular,
            textAlign: 'left',
        },
        paragray: {
            fontSize: RFPercentage(1.45),
            color: C.textgrey,
            fontFamily: Fonts.Regular,
            textAlign: 'left',
            lineHeight: 15,
            width: "100%",
            // backgroundColor:"red"
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
            alignItems: 'center',
            marginBottom: "2%",
            // backgroundColor: "#e4e7ed",
            backgroundColor: theme.theme == "dark" ? "#26263D" : "#e4e7ed",
            // padding:"1%",
            paddingVertical: "2.5%",
            borderRadius: 10
        },
        defaultradio: {
            borderColor: theme.text,
            borderWidth: 2,
            borderRadius: 50,
            height: 20,
            width: 20

        },

        radioButton: {
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center'
        },





    })