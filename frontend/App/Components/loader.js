import React from "react"
import { StatusBar, View, StyleSheet, Text, ActivityIndicator } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import { borderradius, deviceheight } from "../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../Utilities/fonts";



const Loader = (props) => {
    return (
        <LinearGradient
            colors={['#1AC6C9', '#3878C7', "#3D1E88"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={style.container}
        >
            <ActivityIndicator size={"small"} color="#fff" style={{ alignSelf: "center", }} />
        </LinearGradient>
    )
}
export default Loader;

const style = StyleSheet.create(({
    container: {
        width: "100%",
        height: deviceheight * 0.0625,
        borderRadius: borderradius * 0.5,
        justifyContent: "center",
        marginTop:"1%"
    },
    text: {
        fontSize: RFPercentage(1.9),
        color: "#fff",
        fontFamily: Fonts.Medium,
        textAlign: "center",
    }
}))

