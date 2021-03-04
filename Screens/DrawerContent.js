import { View, Text, TouchableOpacity ,Dimensions,Image, FlatList,ActivityIndicator,AsyncStorage} from 'react-native';
import settings from '../Appsettings'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { StatusBar } from 'expo-status-bar';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Constants from 'expo-constants';
import HttpClient from '../helpers/HttpsClient';
import { Feather } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { SliderBox } from "react-native-image-slider-box";
import { AntDesign } from '@expo/vector-icons';
import React, { Component, useState ,useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import Modal from 'react-native-modal';
const themecolor = settings.themecolor
const url = settings.url
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

import { connect } from 'react-redux';
import * as actions from '../actions/index';
import * as actionTypes from '../actions/actionTypes';


 class DrawerContent extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
      signedIn:false,
      modal:false,
      profileDetails:null
    };
  }
   getUser = async()=>{

    const userPk = await AsyncStorage.getItem("Pk")
    //  console.log(userPk,"jjjj")
     if(userPk!=null){
      
      this.setState({signedIn:true})
      const api =`${url}/api/HR/users/${userPk}/`
      const userData = await HttpClient.get(api)
      if(userData.type="success"){
          this.setState({profileDetails:userData.data})
      }
      
    }else{
        this.setState({signedIn:false})
    }
  
   };
UNSAFE_componentWillReceiveProps (){

  this.getUser();
}
 componentDidMount (){
  
    this.getUser();

  }

   
 


  logout =()=>{
   
   AsyncStorage.clear();
   AsyncStorage.removeItem('sessionid')
   AsyncStorage.removeItem('csrf')
   AsyncStorage.removeItem('Pk')
    this.setState({signedIn:false,modal:false})
    this.getUser()
    this.props.setInitialFunction([],0,0)
    this.props.setCounterAmount(0,0,0)
    this.props.navigation.closeDrawer();
    return this.props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'Tab',
                  
                },
                
              ],
            })
          )
  
 }

  render() {
    const {navigation} = this.props
   if(this.state.signedIn){
    let dp ="https://www.kindpng.com/picc/m/52-526043_unknown-person-png-transparent-png.png"
    let userName =""
   if(typeof this.state.profileDetails == "object"){
     dp= this.state.profileDetails?.profile?.displayPicture 
     userName =this.state.profileDetails?.first_name
   }
            return (
         
        <View style={{flex:1,backgroundColor:"#fff",marginTop:Constants.statusBarHeight}}>
            <View style={{flex:0.25,alignItems:"center",justifyContent:"space-around",backgroundColor:themecolor}}>
                <View>
                     <View style={{flex:0.7,alignItems:"center",justifyContent:'center'}}>
                          <Image source={{uri:dp}}
                      style={{height:100,width:100,borderRadius:50,resizeMode:"cover"}}
                    />
                     </View>
                   
                    <View style={{flexDirection:"row",alignItems:"center",flex:0.3,width:width*0.67}}>
                      <View style={{flex:0.65}}>
                            <Text style={{fontWeight:"bold",fontSize:18,color:"#fff",marginRight:10,alignSelf:'flex-end'}} numberOfLines={1}>{userName}</Text>

                      </View>
                            <TouchableOpacity onPress={()=>{navigation.navigate("ProfilePage")}}
                             style={{flex:0.35}}
                            >
                                <AntDesign name="edit" size={24} color="#fff" />
                            </TouchableOpacity>
                            
                    </View>
                </View>
            </View> 
            <View style={{flex:0.8,alignItems:"center",justifyContent:'space-around'}}>
                <TouchableOpacity
                onPress={()=>{navigation.navigate("MyOrders")}}
                >
                    <Text  style={{color:themecolor,fontWeight:"bold",fontSize:18}}>My orders</Text>
                </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={{color:themecolor,fontWeight:"bold",fontSize:18}}>Address</Text>
                </TouchableOpacity>
                  <TouchableOpacity
                      onPress={()=>{navigation.navigate("Recipes")}}
                  >
                    <Text style={{color:themecolor,fontWeight:"bold",fontSize:18}}>Recipes</Text>
                </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={{color:themecolor,fontWeight:"bold",fontSize:18}}>Set Passcode</Text>
                </TouchableOpacity>
                  <TouchableOpacity
                  onPress={()=>{navigation.navigate("FaqScreen")}}
                  >
                    <Text style={{color:themecolor,fontWeight:"bold",fontSize:18}}>FAQ</Text>
                </TouchableOpacity>
                 <TouchableOpacity
                   onPress={()=>{navigation.navigate("HelpScreen");}}
                 >
                    <Text style={{color:themecolor,fontWeight:"bold",fontSize:18}}>Help</Text>
                </TouchableOpacity>
                 <TouchableOpacity
                  onPress={()=>{navigation.navigate("PolicyScreen")}}
                 >
                    <Text style={{color:themecolor,fontWeight:"bold",fontSize:18}}>Polices</Text>
                </TouchableOpacity>
                  <TouchableOpacity
                  onPress={()=>{navigation.navigate("AboutUs")}}
                  >
                    <Text style={{color:themecolor,fontWeight:"bold",fontSize:18}}>About us</Text>
                </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{this.setState({modal:true})}}>
                    <Text style={{color:themecolor,fontWeight:"bold",fontSize:18}}>Sign Out</Text>
                </TouchableOpacity>
            </View>
            <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                 <Image source={require('../assets/sterlingsplash1.png')} 
                    style={{height:"70%",width:"70%",resizeMode:"contain"}}
                 />
                 <Text style={{fontWeight:"bold"}}>V 1.0.0</Text>
            </View>
            <Modal isVisible={this.state.modal}
            backdropColor="#000"
            style={{}}
            onBackdropPress={()=>{this.setState({modal:false})}}
            animationIn="shake"
            animationOut="shake"
            >
                <View style={{ backgroundColor:"#fff",height:height*0.18,borderRadius:10,width:width*0.9}}>
                      <View style={{flex: 0.5,alignItems:'center',justifyContent:"center"}}>
                          <Text style={{fontSize:20}}>Are You Sure want to logout?</Text>
                      </View>
                      <View style={{alignItems:"center",justifyContent:"space-around",flexDirection:"row",flex: 0.5,}}>
                           <TouchableOpacity
                            onPress={()=>{this.logout()}}
                           >
                                  <Text style={{color:"green",fontWeight:'bold',fontSize:20}}>YES</Text>
                           </TouchableOpacity>
                           <TouchableOpacity
                             onPress={()=>{this.setState({modal:false})}}
                           >
                                   <Text style={{color:"green",fontWeight:"bold",fontSize:20}}>NO</Text>
                           </TouchableOpacity>
                      </View>
                </View>
           </Modal>
        </View>
    )
     }else{
         return(
                  <View style={{flex:1,marginTop:Constants.statusBarHeight}}>
             <View style={{flex:0.8,alignItems:"center"}}>
                 <View style={{marginTop:height*0.1,alignItems:"center",justifyContent:'center'}}>
                     <TouchableOpacity style={{}}>
                      <Text style={{color:themecolor,fontWeight:"bold",fontSize:18}}>FAQ</Text>
                    </TouchableOpacity>
                     <TouchableOpacity style={{marginTop:30}}>
                      <Text style={{color:themecolor,fontWeight:"bold",fontSize:18}}>Help</Text>
                    </TouchableOpacity>
                     <TouchableOpacity style={{marginTop:30}}>
                      <Text style={{color:themecolor,fontWeight:"bold",fontSize:18}}>Policies</Text>
                    </TouchableOpacity>
                     <TouchableOpacity style={{marginTop:30}}>
                      <Text style={{color:themecolor,fontWeight:"bold",fontSize:18}}>About us</Text>
                    </TouchableOpacity>
                     <TouchableOpacity style={{marginTop:30}}
                       onPress={()=>{navigation.navigate('PasscodeScreen')}}
                     >
                      <Text style={{color:themecolor,fontWeight:"bold",fontSize:18}}>Sign In</Text>
                    </TouchableOpacity>
                 </View>
                 
             </View>
              <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                 <Image source={require('../assets/sterlingsplash1.png')} 
                    style={{height:"70%",width:"70%",resizeMode:"contain"}}
                 />
                 <Text style={{fontWeight:"bold"}}>V 1.0.0</Text>
            </View>
         </View>
         )
  }
}

 }

const mapStateToProps =(state) => {
  console.log(state.cartItems.signedIn,"sssss")
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
export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);