import React from "react"
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { borderradius, deviceheight, devicewidth } from "../Utilities/Dimensions"
import Profile from '../Assets/Icons/profile.svg'
import Shoppingbag from '../Assets/Icons/shopping.svg'

const isPhone = devicewidth < 600;

const Footer = ({ showFooterOnScreens }) => {




    return (

        <View style={{ height: "17%",   alignItems: "center", }} >
            <View style={{ width: "70%", height: deviceheight * 0.09, marginTop: "5%", flexDirection: "row", alignItems: "center", }} >
                <View style={{ width: "42.5%", height: "100%", backgroundColor: "#3D4A6C", borderTopLeftRadius: borderradius * 2, borderBottomLeftRadius: borderradius * 2, left: "1%", }} >
                    <View style={styles.triangle} />
                    <View style={styles.triangle2} />
                    <TouchableOpacity style={{  width:isPhone? 45:60, height:isPhone ? 45:60, borderRadius: borderradius * 2, backgroundColor: "#293351",  justifyContent: "center",top:"18%",bottom:"18%",position:"absolute",left:"10%"}} >
                        <Shoppingbag style={{ alignSelf: "center" }} />
                    </TouchableOpacity>
                </View>

                <View style={{ width: isPhone ? "15%" : "12.5%", height: "90%", backgroundColor: "#293351", borderRadius: borderradius * 1, justifyContent: "center",}} >
                  <TouchableOpacity>
                    <Shoppingbag style={{ alignSelf: "center" }} />
                    </TouchableOpacity>
                </View>

                <View style={{ width: "42.5%", height: "100%", backgroundColor: "#3D4A6C", transform: [{ scaleX: -1 }], borderLeftColor: "#00A3FF", borderLeftWidth: 3, borderTopLeftRadius: borderradius * 2, borderBottomLeftRadius: borderradius * 2, right: "1%" }} >
                    <View style={styles.triangle} />
                    <View style={styles.triangle2} />
                    <TouchableOpacity style={{ width:isPhone? 45:60, height:isPhone ? 45:60, borderRadius: borderradius * 2, backgroundColor: "#293351", position: "absolute", top: 0, bottom: 0, top: "19%", left: "10%", justifyContent: "center" }} >
                        <Profile style={{ alignSelf: "center" }} />
                    </TouchableOpacity>
                </View>

            </View>

        </View>

    )
}
export default Footer;

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
        borderRightColor: '#161e32',
        borderBottomColor: '#3D4A6C', // Set the desired color for the triangle
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
        borderBottomColor: '#131b2d', // Set the desired color for the triangle
        borderLeftColor: 'transparent',
        backgroundColor: '#3D4A6C',
        position: "absolute",
        alignSelf: "flex-end",
        // transform: [{ rotate: "90deg" }],
        bottom: 0
    },
})

