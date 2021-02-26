import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import CartScreen from '../Screens/CartScreen';

const Stack = createStackNavigator();
export default function CartStack() {
    return (
      <Stack.Navigator>
         <Stack.Screen name="Home" component={CartScreen} options={{headerShown:false}}/>
      </Stack.Navigator>
    )
}
