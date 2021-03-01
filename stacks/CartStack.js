import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import CartScreen from '../Screens/CartScreen';
import CheckoutProductsNew from '../Screens/CheckoutProductsNew';
import CheckoutScreenNew from '../Screens/CheckoutScreenNew';

const Stack = createStackNavigator();
export default function CartStack({navigation,route}) {

    return (
      <Stack.Navigator>
         <Stack.Screen name="CheckoutProductsNew" component={CheckoutProductsNew} options={{headerShown:false,}}/>
         <Stack.Screen name="CheckoutScreenNew" component={CheckoutScreenNew} options={{headerShown:false}}/>
      </Stack.Navigator>
    )
}
