import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Calculator from "./Calculator";
import Summary from "./Summary";

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Calculator" component={Calculator} options={{headerShown:false}}/>
                <Stack.Screen name="Summary" component={Summary} options={{headerShown:false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}



export default Navigation;