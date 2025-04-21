import { StyleSheet } from "react-native";
import { borderradius, deviceheight } from "../../../Utilities/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Fonts } from "../../../Utilities/fonts";


export const style = StyleSheet.create({
  
    Active_Title_text: {
        fontSize: RFPercentage(2),
        color: "#fff",
        fontFamily: Fonts.Medium,
        marginLeft:'5%'
    },
    Title_text: {
        fontSize: RFPercentage(2),
        color: "#8C9BAA",
        fontFamily: Fonts.Medium,
       
    },
    
    Active_value_text: {
        fontSize: RFPercentage(1.5),
        color: "#022A48",
        fontFamily: Fonts.Medium,
      
    },
    value_text: {
        fontSize: RFPercentage(1.5),
        color: "#8C9BAA",
        fontFamily: Fonts.Medium,
     
    },

})