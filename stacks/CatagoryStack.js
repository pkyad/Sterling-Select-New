import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import CatogoryScreen from '../Screens/CatogoryScreen';
import SearchScreen2 from '../Screens/SearchScreen2';


const Stack = createStackNavigator();
export default function CatagoryStack() {
    return (
       <Stack.Navigator>
         <Stack.Screen name="CatogoryScreen" component={CatogoryScreen} options={{headerShown:false}}/>
         <Stack.Screen name="SearchScreen2" component={SearchScreen2} options={{headerShown:false}}/>
      </Stack.Navigator>
    )
}