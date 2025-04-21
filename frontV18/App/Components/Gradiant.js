import React from "react"
import { StatusBar, View,StyleSheet } from "react-native"
import LinearGradient from "react-native-linear-gradient";



const Gradiant = () => {
    return (
        <View style={style.container} >
        <LinearGradient  start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={style.container}  colors={["#3D4A6C","#12182B"]}  />
        </View>
    )
}
export default Gradiant;

const style = StyleSheet.create(({
    container:{
        flex:1
    }
}))

