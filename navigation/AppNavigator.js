import React from 'react'
import { View, Text } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import settings from '../Appsettings'
import HomeStack from '../stacks/HomeStack';
import CartStack from '../stacks/CartStack';
import CatagoryStack from '../stacks/CatagoryStack';
import DrawerContent from '../Screens/DrawerContent';
import DrawerStack from '../stacks/DrawerStack';
const themecolor = settings.themecolor
const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import * as actionTypes from '../actions/actionTypes';
import TabNavigator from './TabNavigator'
          


 function AppNavigator() {
    return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Tab"
      
        drawerContent={props => <DrawerContent {...props}/>}
      >
        <Drawer.Screen name="Tab" component={TabNavigator} />
        <Drawer.Screen name="DrawerStack" component={DrawerStack} />
      
      </Drawer.Navigator>
    </NavigationContainer>
    )
}

const mapStateToProps =(state) => {
    return {
    counter: state.cartItems.counter,
    totalAmount: state.cartItems.totalAmount,
    cart : state.cartItems.cartItem,
    user : state.cartItems.user,
    store:state.cartItems.store,
    myStore:state.cartItems.myStore,
    storeType:state.cartItems.storeType,
    selectedStore:state.cartItems.selectedStore,
    selectedLandmark:state.cartItems.selectedLandmark,
    signedIn:state.cartItems.signedIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTocartFunction:  (args) => dispatch(actions.addToCart(args)),
    decreaseFromCartFunction:  (args) => dispatch(actions.decreaseFromCart(args)),
    increaseCartFunction:  (args) => dispatch(actions.increaseCart(args)),
    setInitialFunction:  (cart,counter,totalAmount) => dispatch(actions.setInitial(cart,counter,totalAmount)),
    removeItemFunction:  (args) => dispatch(actions.removeItem(args)),
    emptyCartFunction:()=>dispatch(actions.emptyCart()),
    setMyStoreFunction:(myStore,storeRole)=>dispatch(actions.setMyStore(myStore,storeRole)),
    removeMyStoreFunction:()=>dispatch(actions.removeMyStore()),
    setCounterAmount:  (counter,totalAmount,saved) => dispatch(actions.setCounterAmount(counter,totalAmount,saved)),
    setDeliveryMessage:  (msg) => dispatch(actions.setDeliveryMessage(msg)),
    setShareMessage:  (msg) => dispatch(actions.setShareMessage(msg)),
    setPlaystoreUrl:  (msg) => dispatch(actions.setPlaystoreUrl(msg)),
    setAppstoreUrl:  (msg) => dispatch(actions.setAppstoreUrl(msg)),
     signedInFunction:  (args) => dispatch(actions.signedIn(args)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);