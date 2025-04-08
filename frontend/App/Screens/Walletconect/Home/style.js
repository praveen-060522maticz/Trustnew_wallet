import { StyleSheet } from "react-native";
import { borderradius, deviceheight } from "../../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../../Utilities/fonts";


export const style = StyleSheet.create({
    card_container: {
        width: "90%",
        backgroundColor: "#2A3553",
        alignSelf: "center",
        borderRadius: borderradius * 1,
        paddingVertical: "7.5%",
        paddingHorizontal: "5%",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
    },
    Title_text: {
        fontSize: RFPercentage(2),
        color: "#8C9BAA",
        fontFamily: Fonts.Medium,
        marginLeft:'5%'
    },
    connect_text:{
        fontSize: RFPercentage(1.6),
        color: "#fff",
        fontFamily: Fonts.Bold,
        // marginLeft:'5%',
        textAlign:"center"
    }

})