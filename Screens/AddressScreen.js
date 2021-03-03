import React ,{useEffect, useState,Component} from 'react';
import { View, Text, TouchableOpacity ,Dimensions,Image, FlatList,ActivityIndicator, AsyncStorage} from 'react-native';
import settings from '../Appsettings'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { StatusBar } from 'expo-status-bar';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Constants from 'expo-constants';
import HttpClient from '../helpers/HttpsClient';
import { Feather ,MaterialIcons,AntDesign} from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
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
import * as  ImagePicker  from 'expo-image-picker';



const themecolor = settings.themecolor
const url = settings.url
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class AddressScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        address:[],
    };
  }
  getAddress = async()=>{
      const pk = await AsyncStorage.getItem("Pk")
      const api = `${url}/api/POS/address/?user=${pk}`
      const address = await HttpClient.get(api)
       if(address.type=="success"){
           this.setState({address:address.data})
       }
  }
componentDidMount(){
    this.getAddress()
}
  header =()=>{
      return(
          <View style={{height:height*0.05,backgroundColor:"#d8d8d8",justifyContent:'center'}}>
              <Text style={{marginLeft:10}}>Default Address</Text>
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
                         <Text style={{color:"#fff",fontWeight:"bold",fontSize:18}}>My Address</Text>
                    </View>
                    <View style={{}}>

                    </View>
             </View>   

             <View style={{height:height*0.1,justifyContent:'center',}}>
                 <TouchableOpacity onPress={()=>{this.props.navigation.navigate("CreateAddress")}}>
                     <Text style={{color:themecolor,marginLeft:10,fontWeight:'bold'}}>+ ADD NEW ADDRESS</Text>
                 </TouchableOpacity>
             </View>
              <FlatList
                data={this.state.address}
                keyExtractor={(item,index)=>index.toString()}
                ListHeaderComponent={this.header()}
                renderItem= {({item,index})=>{
                    return(
                       <View>
                         <View style={{padding:10}}>
                             <View style={{flexDirection:'row',alignItems:"center",justifyContent:"space-between"}}>
                                  <Text style={{fontWeight:'bold',fontSize:20,marginTop:5}}>{item.title}</Text>
                                  <View style={{backgroundColor:themecolor,borderRadius:5}}>
                                       <Text style={{color:'#fff'}}>Home</Text>
                                  </View>
                             </View>
                          
                            <Text style={{marginTop:5}}>{item.street}</Text>
                            <Text style={{marginTop:5}}>{item.landMark}</Text>
                            <Text style={{marginTop:5}}>{item.city} {item.pincode}</Text>
                            <Text style={{marginTop:5}}>{item.billingState} </Text>
                            <Text style={{marginTop:5}}>{item.mobileNo} </Text>
                         </View>
                         <View style={{backgroundColor:themecolor,height:height*0.05,flexDirection:"row"}}>
                             <TouchableOpacity style={{flex:0.5,alignItems:"center",justifyContent:'center',borderRightWidth:2,borderColor:"gray"}}>
                                   <Text style={{color:"#fff",fontWeight:'bold'}}>EDIT</Text>
                             </TouchableOpacity>
                              <TouchableOpacity style={{flex:0.5,alignItems:"center",justifyContent:'center'}}>
                                   <Text style={{color:'#fff',fontWeight:'bold'}}>REMOVE</Text>
                             </TouchableOpacity>
                         </View>
                       </View> 
                        
                    )
                }}
              />
      </View>
    );
  }
}
