import React ,{useEffect, useState,Component} from 'react';
import { View, Text, TouchableOpacity ,Dimensions,Image, FlatList,ActivityIndicator, AsyncStorage} from 'react-native';
import settings from '../Appsettings'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { StatusBar } from 'expo-status-bar';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Constants from 'expo-constants';
import HttpClient from '../helpers/HttpsClient';
import { Feather ,MaterialIcons} from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import { ScrollView } from 'react-native-gesture-handler';
import { SliderBox } from "react-native-image-slider-box";
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import * as actionTypes from '../actions/actionTypes';
import Toast, {DURATION} from 'react-native-easy-toast';
import Modal from "react-native-modal";
import ProductCard from './ProductCard';
import { FontAwesome5 } from '@expo/vector-icons';
import { TabView, SceneMap ,TabBar} from 'react-native-tab-view';
import Active from '../components/Active';
import Resolved from '../components/Resolved';
import HttpsClient from '../helpers/HttpsClient';
import moment from 'moment';
const themecolor = settings.themecolor
const url = settings.url
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height

export default class MyOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders:[],
      loading:true
    };
  }
  getOrders =async()=>{
   const userPk = await AsyncStorage.getItem("Pk")
   if(userPk!==null){
       const api =`${url}/api/POS/orderLite/?orderBy=${userPk}`
       const orders = await HttpsClient.get(api)
      if(orders.type=="success"){
          this.setState({orders:orders.data,loading:false})
      }
   }
  }
componentDidMount (){
  this.getOrders();
}
footer =()=>{
  if(this.state.loading){
    return(
      <View style={{height:height*0.3,alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator size="large"  color ={themecolor}/>
      </View>
    )
  }else{
    return null
  }
}
empty =()=>{
  return(
     <View style={{height,alignItems:"center",justifyContent:"center"}}>
       <Text>No Items Ordered</Text>
  </View>
  )
  
}
  render() {
      const {navigation} = this.props
    return (
      <View style={{flex:1}}>
                      {/* HEADERS */}
             <View style={{marginTop:Constants.statusBarHeight,height:height*0.07,backgroundColor:themecolor,alignItems:'center',flexDirection:"row"}}>
                   <TouchableOpacity style={{marginLeft:15,flex: 0.17,}}
                    onPress={()=>{navigation.goBack()}}
                   >
                       <Ionicons name="md-arrow-back" size={24} color="#fff" />
                    </TouchableOpacity> 
                    <View style={{flex:0.6,alignItems:'center'}}>
                         <Text style={{color:"#fff",fontWeight:"bold",fontSize:18}}>My Orders</Text>
                    </View>
                    <View style={{}}>

                    </View>
             </View>
             <View style={{flex:1,paddingVertical:10}}>
                <FlatList 
               data={this.state.orders}
               keyExtractor={(item,index)=>index.toString()}
               ListFooterComponent={this.footer()}
              //  ListEmptyComponent ={this.empty()}
               renderItem = {({item,index})=>{
                let date =  moment(item.created).format('DD/MM/YYYY')
                let time =  moment(item.created).format('h:mm a')
               
                   return(
                     <View style={{backgroundColor:"#EEE",height:height*0.2,borderRadius:10,marginTop:10,marginHorizontal:15,elevation:5,}}>
                        <View style={{flexDirection:"row",flex:0.5,alignItems:"center",justifyContent:'center'}}>
                          <View style={{flex:0.5,marginLeft:10}}>
                             <Text style={{color:"gray"}}>Order No</Text>
                             <Text  style={{fontWeight:'bold',color:"#000"}}>{item.pk}</Text>
                          </View>
                          <View style={{flex:0.5,marginRight:10}}>
                            <View style={{alignSelf:'flex-end'}}>
                               <Text style={{color:"gray"}}>Total Amount</Text>
                             <Text  style={{fontWeight:'bold',color:"#000"}}>₹{item.total}</Text>
                            </View>
                               
                          </View>
                     
                        </View>
                        <View style={{flexDirection:'row',flex:0.5,alignItems:"center",justifyContent:'center'}}>
                  
                           <View style={{flex:0.5}}>

                           </View>
                         
                          <View style={{flex:0.5,marginRight:10}}>
                             <View style={{alignSelf:"flex-end"}}>
                                 <Text style={{color:"gray",textAlign:"right"}}>Ordered on</Text>
                                 <Text style={{fontWeight:'bold',color:"#000"}}>{date} | {time}</Text>
                             </View>
                          </View>
                        </View>
                     </View>
                   )
               }}
             />
             </View>
             
      </View>
    );
  }
}
