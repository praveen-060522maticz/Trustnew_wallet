import React, { useCallback } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Slidingnavigation } from "../Utilities/Slidingnavigation";
import { useFocusEffect } from "@react-navigation/native";

const StackComponent = createStackNavigator();


const Swaphomenav = (props) => {

    useFocusEffect(
        useCallback(() => {
            return () => props.navigation.addListener("focus", async (e) => {
                props.navigation.navigate('swap',{from:'wallethome'})
            })
        }, [])
    )

    return (
        <>
            <StackComponent.Navigator
                screenOptions={Slidingnavigation}
                initialRouteName={"Swaphome"}
            >
      
            </StackComponent.Navigator>
        </>
    )
}
export default Swaphomenav;