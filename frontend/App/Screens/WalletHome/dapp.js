
/** Packages*/
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image, FlatList } from "react-native";
import { borderradius, deviceheight, devicewidth } from "../../Utilities/Dimensions";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../Utilities/fonts";
import themeContext from "../../Utilities/themecontext";
import { ScrollView } from "react-native-gesture-handler";
import Rightarrow from '../../Assets/Icons/rightarrow.svg';
import { Input, Icon as Icn, Divider } from "react-native-elements";
import { ApiConstants } from "../../api/ApiConstants";
import { useDispatch } from "react-redux";
import { dappurl } from "../../Redux/Actions/dappactions";
import { ActivityIndicator } from "react-native-paper";
import { C } from "../../Utilities/colors";
import { DappCategoryList, Dapps } from "../../Utilities/axios";
import { dappCategory, dappData } from "../../Utilities/dappsData";
import { ImageComponent } from "../../Utilities/commenfuctions";

export default function Wallethome({ navigation }) {
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [applist, setApplist] = useState([])
    const [listgroup, setListgroup] = useState([])
    const [redirecturl, setUrl] = useState("");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);


    const seturl = (item) => dispatch(dappurl(item));

    useEffect(() => {
        setLoading(true)
        dappCategoryList();
        setTimeout(() => { setLoading(false) }, 2000)
    }, []);

    /** Dapp Category details */
    const dappCategoryList = async () => {
        try {

            let Resp = await DappCategoryList()
            if (Resp) {
                setListgroup(Resp.data)
                dappItemList()
            }
            else {
                return false
            }

        }
        catch (err) {
            console.log("dappCategoryList_err", err);
        }


    };





    /** Dapp details */
    const dappItemList = async () => {


        try {

            let Resp = await Dapps()
            if (Resp) {
                setLoading(false)
                setApplist(Resp?.data)
            }
            else {
                return false
            }

        }
        catch (err) {
            console.log("dapp err", err);
        }



    };

    /** Redirect to the browser */
    const redirecttoBrowser = () => {
        navigation.push("Dappweb", {
            url: ['.com', 'www.', 'http', 'https'].includes(redirecturl) ? redirecturl : `https://www.google.com/search?q=${redirecturl}`,
        });
        seturl({
            type: "url",
            data: ['.com', 'www.', 'http', 'https'].includes(redirecturl) ? redirecturl : `https://www.google.com/search?q=${redirecturl}`
        });
        setUrl(redirecturl)

    };

    return (
        <SafeAreaView style={style.container} >
            <StatusBar backgroundColor={theme.background} />
            <View style={{ flex: 1, backgroundColor: theme.background }}  >
                <View style={{ alignItems: "center", justifyContent: "center", marginTop: "7%" }}>
                    <Text style={{

                        fontFamily: Fonts.Regular,
                        fontSize: RFPercentage(2.7),
                        color: theme.text
                    }}>DApp</Text>
                </View>
                <View style={style.box_container} >
                    <View style={style.inputsec} >
                        <Input
                            placeholder="Search on web"
                            inputStyle={style.searchinput}
                            inputContainerStyle={style.containersearchinput}
                            selectionColor={theme.selectioncolor}
                            placeholderTextColor={C.textgrey}
                            Color="#683cf0"
                            underlineColorAndroid="transparent"

                            rightIcon={
                                <Pressable onPress={redirecttoBrowser}>
                                    <Icn
                                        name="search"
                                        type="antDesign"
                                        style={{
                                            alignSelf: "center",
                                        }}
                                        color={C.textgrey}
                                        size={25}
                                    />
                                </Pressable>
                            }
                            onChangeText={(redirecturl) => setUrl(redirecturl)}
                            onSubmitEditing={redirecttoBrowser}


                        />
                    </View>
                    <View style={style.insidecontainer}>
                        {!loading ?
                            <>
                                {/* <ScrollView showsVerticalScrollIndicator={false} > */}

                                <FlatList
                                    data={dappCategory}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item: e }) => {

                                        return (
                                            <View style={style.dappslistsec}>
                                                <View style={style.Titlelist}>

                                                    <Text style={style.headtitle}>{e.categoryName}</Text>
                                                </View>
                                                <View style={style.listscroll}>

                                                    <FlatList
                                                        data={dappData?.filter(item => item.categoryId == e._id)}
                                                        nestedScrollEnabled
                                                        renderItem={({ item }) => {
                                                            var url = item.url.split('/');
                                                            var getUrl = url[0] + '//' + url[2];
                                                            // console.log('urururururururu---->', `https://api.faviconkit.com/${url[2]}/64`);
                                                            return (
                                                                <>
                                                                    < TouchableOpacity
                                                                        onPress={() => {
                                                                            navigation.navigate("Dappweb", {
                                                                                url: item.url,
                                                                            });
                                                                            seturl({
                                                                                type: "url",
                                                                                data: item.url,

                                                                            });
                                                                        }
                                                                        }


                                                                    >

                                                                        <View style={style.listtop}>
                                                                            <ImageComponent icons={""} url={item.url} style={{ width: 35, height: 35, alignSelf: "center", resizeMode: "contain" }} />
                                                                            {/* <Image
                                                                                style={{ width: 35, height: 35, alignSelf: "center", resizeMode: "contain" }}

                                                                                source={{
                                                                                    uri: `https://api.faviconkit.com/${url[2]}/64`
                                                                                    // uri: `${getUrl}/favicon.ico`
                                                                                }}
                                                                            /> */}
                                                                            <View>
                                                                                <Text style={style.titlepara}>{item.title}</Text>
                                                                                <Text style={style.paragrey}>{item.description}</Text>
                                                                            </View>
                                                                        </View>
                                                                    </TouchableOpacity>

                                                                </>
                                                            )
                                                        }
                                                        }
                                                    />
                                                </View>
                                                <Divider style={{ backgroundColor: theme.text }} />



                                            </View>
                                        )
                                    }}
                                />

                                {/* {dappCategory?.map((e) => (
                                    <View style={style.dappslistsec}>
                                        <View style={style.Titlelist}>

                                            <Text style={style.headtitle}>{e.categoryName}</Text>
                                        </View>
                                        <View style={style.listscroll}>

                                            <FlatList
                                                data={dappData?.filter(item => item.categoryId == e._id)}
                                                nestedScrollEnabled
                                                renderItem={({ item }) => {
                                                    var url = item.url.split('/');
                                                    var getUrl = url[0] + '//' + url[2];
                                                    console.log('uriririri---->',getUrl, `https://api.faviconkit.com/${url[2]}/64`);
                                                    return (
                                                        <>
                                                            < TouchableOpacity
                                                                onPress={() => {
                                                                    navigation.navigate("Dappweb", {
                                                                        url: item.url,
                                                                    });
                                                                    seturl({
                                                                        type: "url",
                                                                        data: item.url,

                                                                    });
                                                                }
                                                                }


                                                            >

                                                                <View style={style.listtop}>
                                                                    <Image
                                                                        style={{ width: 35, height: 35,alignSelf:"center",resizeMode:"contain" }}

                                                                        source={{
                                                                            uri: `https://api.faviconkit.com/${url[2]}/64`
                                                                            // uri: `${getUrl}/favicon.ico`
                                                                        }}
                                                                    />
                                                                    <View>
                                                                        <Text style={style.titlepara}>{item.title}</Text>
                                                                        <Text style={style.paragrey}>{item.description}</Text>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>

                                                        </>
                                                    )
                                                }
                                                }
                                            />
                                        </View>
                                        <Divider style={{ backgroundColor: theme.text }} />



                                    </View>
                                ))} */}


                                {/* </ScrollView> */}
                            </>
                            :
                            <View style={{ height: '70%', justifyContent: 'center' }} >
                                <ActivityIndicator color={theme.theme == "dark" ? "#fff" : "#00001C"} size={"small"} />
                            </View>}
                    </View>

                </View>


            </View>
        </SafeAreaView>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background
        },
        box_container: {
            height: "90%",
            width: '100%',
            alignSelf: 'center',
            paddingHorizontal: "5%"

        },
        insidecontainer: {
            height: "100%"
        },
        para: {
            fontSize: RFPercentage(1.85),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular
        },
        paraempty: {
            fontSize: RFPercentage(1.85),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            textAlign: "center",
            marginTop: "5%"
        },
        titlepara: {
            fontSize: RFPercentage(2.35),
            color: theme.text,
            fontFamily: Fonts.Regular
        },
        para1: {
            fontSize: RFPercentage(1.85),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular
        },
        parablue: {
            fontSize: RFPercentage(2.05),
            color: "#0091FF",
            fontFamily: Fonts.Regular
        },
        paragrey: {
            fontSize: RFPercentage(1.5),
            color: theme.text,
            fontFamily: Fonts.Regular,
        },
        headtitle: {
            fontSize: RFPercentage(2.55),
            color: theme.text,
            fontFamily: Fonts.Regular
        },
        paragrey1: {
            fontSize: RFPercentage(1.85),
            color: "#8C9BAA",
            fontFamily: Fonts.Regular
        },
        create_button: {
            marginTop: "5%",
            width: "92.5%",
            alignSelf: "center"
        },
        create_button2: {
            marginTop: "5%",
            width: "92.5%",
            alignSelf: "center",
            marginBottom: "5%"
        },
        gradTitle: {
            fontSize: RFPercentage(2.05),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            textAlign: "center",
            marginTop: '15%'

        },
        gradTitle1: {
            fontSize: RFPercentage(2.05),
            color: "#9ACFFF",
            fontFamily: Fonts.Regular,
            textAlign: "center",
            marginTop: "5%"

        },
        inputsec: {
            marginTop: '8%',
            height: deviceheight * 0.060,


        },
        searchinput: {
            fontSize: RFPercentage(2.05),
            alignSelf: "center",
            color: theme.text
        },
        containersearchinput: {
            width: "100%",
            alignSelf: "center",
            borderWidth: 1.2,
            borderColor: theme.secondarybg,
            borderRadius: borderradius * 0.7,
            height: deviceheight * 0.060,
            backgroundColor: theme.secondarybg,
            paddingHorizontal: "3%",

        },
        Titlelist: {
            flexDirection: "row",
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: "2%"
        },
        dappslistsec: {
            marginTop: "5%",
            width: "95%",
            alignSelf: "center",

        },
        listtop: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginVertical: "4%",
        }
    })