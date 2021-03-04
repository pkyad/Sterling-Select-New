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
import productInfo from '../Screens/productInfo';
import RaiseConcern from '../Screens/RaiseConcern';
import FaqScreen from '../Screens/FaqScreen';
import AboutUs from '../Screens/AboutUs';
import PolicyScreen from '../Screens/PolicyScreen';
import ProfilePage from '../Screens/ProfilePage';
import MyOrders from '../Screens/MyOrders';
import Recipes from '../Screens/Recipes';

const Stack = createStackNavigator();
export default function HomeStack() {
    return (
       <Stack.Navigator>
         <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
         <Stack.Screen name="ViewAllProducts" component={ViewAllProducts} options={{headerShown:false}}/>
         <Stack.Screen name="SearchScreen" component={SearchScreen} options={{headerShown:false}}/>
         <Stack.Screen name="ProductInfo" component={productInfo} options={{headerShown:false}}/>

                               {/* DRAWER */}
         <Stack.Screen name="HelpScreen" component={HelpScreen} options={{headerShown:false}}/>
         <Stack.Screen name="RaiseConcern" component={RaiseConcern} options={{headerShown:false}}/>
         <Stack.Screen name="PasscodeScreen" component={PasscodeScreen} options={{headerShown:false}}/>
         <Stack.Screen name="SterlingLogin" component={SterlingLogin} options={{headerShown:false}}/>
         <Stack.Screen name="SterlingOTP" component={SterlingOTP} options={{headerShown:false}}/>
         <Stack.Screen name="FaqScreen" component={FaqScreen} options={{headerShown:false}}/>
         <Stack.Screen name="AboutUs" component={AboutUs} options={{headerShown:false}}/>
         <Stack.Screen name="PolicyScreen" component={PolicyScreen} options={{headerShown:false}}/>
         <Stack.Screen name="ProfilePage" component={ProfilePage} options={{headerShown:false}}/>
         <Stack.Screen name="MyOrders" component={MyOrders} options={{headerShown:false}}/>
         <Stack.Screen name="Recipes" component={Recipes} options={{headerShown:false}}/>
        
      </Stack.Navigator>
    )
}
