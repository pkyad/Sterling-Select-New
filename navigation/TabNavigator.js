import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import * as actionTypes from '../actions/actionTypes';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from '../stacks/HomeStack';
import CartStack from '../stacks/CartStack';
import CatagoryStack from '../stacks/CatagoryStack';
const Tab = createBottomTabNavigator();
const themecolor = settings.themecolor
import settings from '../Appsettings'
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AsyncStorage, ToastAndroid } from 'react-native';
import SterlingLogin from '../Screens/SterlingLogin';
import { color } from 'react-native-reanimated';



function TabNavigator(props) {

  const [pk,setPk]= useState(null);

    const Login =async()=>{
      const Pk = await AsyncStorage.getItem("csrf")
      setPk(Pk)
  }
      useEffect(()=>{
         Login();
      },[])

    const getTabBarVisibility = (route)=>{
       const routeName = route.state?route.state.routes[route.state.index].name:''
       if(routeName =="CheckoutProductsNew"||"CheckoutProductsNew"){
         return false
       }
       return true
    }
     const getTabBarVisibility2 = (route)=>{
       const routeName = route.state?route.state.routes[route.state.index].name:''
        console.log(routeName,"kkk")
       if(
         routeName =="PasscodeScreen"||
         routeName=="SterlingOTP"||
         routeName=="SterlingLogin"||
         routeName=="RaiseConcern"||
         routeName=="HelpScreen"||
         routeName=="ProfilePage"||
         routeName=="Recipes"||
         routeName=="MyOrders"||
         routeName=="FaqScreen"||
         routeName=="PolicyScreen"||
         routeName=="AboutUs"||
         routeName=="SearchScreen"||
         routeName=="AddressScreen2"||
         routeName=="CreateAddress2"

       
             ){
         return false
       }
       return true
    }
        const getTabBarVisibility3 = (route)=>{
       const routeName = route.state?route.state.routes[route.state.index].name:''

       if(
        
         routeName=="SearchScreen2"
       
             ){
         return false
       }
       return true
    }
  return (
    <Tab.Navigator
      initialRouteName="Home"
      inactiveColor={"black"}
       tabBarOptions={{
      activeBackgroundColor:themecolor,
       activeTintColor:"#fff",
       inactiveTintColor:"gray"
      
     }}
    
    >

      <Tab.Screen name="Home" component={HomeStack} 
           
          options={({route})=>({
          tabBarLabel: 'Home',
          tabBarVisible:getTabBarVisibility2(route),
          tabBarIcon: ({ color }) => (
        <AntDesign name="home" size={24} color={color} />
          ),
        
        })}
        
      />
      <Tab.Screen name="Cart" component={CartStack}
      
          options={({ route }) => ({
          
          tabBarLabel: 'Cart',
          tabBarVisible: getTabBarVisibility(route),
          
          tabBarIcon: ({ color }) => (
        <Feather name="shopping-cart" size={24} color={color} />
          ),
          tabBarBadge:props.counter,
       tabBarBadgeStyle:{backgroundColor:themecolor,color:'#fff'}
      })} 
    
      listeners ={({navigation})=>({
          tabPress:event =>{
          event.preventDefault();
           if(pk==null){
             navigation.navigate("SterlingLogin")
           }else if(props.counter=="0"){
            ToastAndroid.show("Empty cart", ToastAndroid.SHORT);
           }
           else{
             navigation.navigate("Cart")
           }
          }
        })}
      />
       <Tab.Screen name="Catagories" component={CatagoryStack} 
          options={({ route }) => ({
          tabBarLabel: 'Catagories',
             tabBarVisible: getTabBarVisibility3(route),
          tabBarIcon: ({ color }) => (
        <MaterialCommunityIcons name="view-grid" size={24} color={color} />
          ),
         })} 
      />
    </Tab.Navigator>
  );
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


export default connect(mapStateToProps, mapDispatchToProps)(TabNavigator);