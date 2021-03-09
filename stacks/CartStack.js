import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import CartScreen from '../Screens/CartScreen';
import CheckoutProductsNew from '../Screens/CheckoutProductsNew';
import CheckoutScreenNew from '../Screens/CheckoutScreenNew';
// import PaymentScreenNew from '../Screens/PaymentScreenNew';
import AddressScreen from '../Screens/AddressScreen';
import CreateAddress from '../Screens/CreateAddress';

const Stack = createStackNavigator();
export default function CartStack({navigation,route}) {

    return (
      <Stack.Navigator>
         <Stack.Screen name="CheckoutProductsNew" component={CheckoutProductsNew} options={{headerShown:false,}}/>
         <Stack.Screen name="CheckoutScreenNew" component={CheckoutScreenNew} options={{headerShown:false}}/>
         {/* <Stack.Screen name="PaymentScreenNew" component={PaymentScreenNew} options={{headerShown:false}}/> */}
         <Stack.Screen name="AddressScreen" component={AddressScreen} options={{headerShown:false}}/>
         <Stack.Screen name="CreateAddress" component={CreateAddress} options={{headerShown:false}}/>
      </Stack.Navigator>
    )
}
