import React from 'react';
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
function TabNavigator(props) {
    const getTabBarVisibility = (route)=>{
       const routeName = route.state?route.state.routes[route.state.index].name:''
       if(routeName =="CheckoutProductsNew"||"CheckoutProductsNew"){
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
    
          options={{
          tabBarLabel: 'Home',
         
          tabBarIcon: ({ color }) => (
        <AntDesign name="home" size={24} color={color} />
          ),
          
        }}
      />
      <Tab.Screen name="Cart" component={CartStack}
          options={({ route }) => ({
        
          tabBarLabel: 'Cart',
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ color }) => (
        <Feather name="shopping-cart" size={24} color={color} />
          ),
          tabBarBadge:props.counter
      })} 
       
      />
       <Tab.Screen name="Catagories" component={CatagoryStack} 
          options={{
          tabBarLabel: 'Catagories',
          tabBarIcon: ({ color }) => (
        <MaterialCommunityIcons name="view-grid" size={24} color={color} />
          ),
        }}
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