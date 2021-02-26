import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import ViewAllProducts from '../Screens/ViewAllProducts';
import SearchScreen from '../Screens/SearchScreen';
import HelpScreen from '../Screens/HelpScreen';
import PasscodeScreen from '../Screens/PasscodeScreen';
import SterlingLogin from '../Screens/SterlingLogin';
import SterlingOTP from '../Screens/SterlingOTP';

const Stack = createStackNavigator();
export default function HomeStack() {
    return (
       <Stack.Navigator>
         <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
         <Stack.Screen name="ViewAllProducts" component={ViewAllProducts} options={{headerShown:false}}/>
         <Stack.Screen name="SearchScreen" component={SearchScreen} options={{headerShown:false}}/>

                               {/* DRAWER */}
         <Stack.Screen name="HelpScreen" component={HelpScreen} options={{headerShown:false}}/>
         <Stack.Screen name="PasscodeScreen" component={PasscodeScreen} options={{headerShown:false}}/>
         <Stack.Screen name="SterlingLogin" component={SterlingLogin} options={{headerShown:false}}/>
         <Stack.Screen name="SterlingOTP" component={SterlingOTP} options={{headerShown:false}}/>
      </Stack.Navigator>
    )
}
