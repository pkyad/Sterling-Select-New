import React ,{useEffect, useState,Component} from 'react';
import { View, Text, TouchableOpacity ,Dimensions,Image, FlatList,ActivityIndicator, AsyncStorage} from 'react-native';
import settings from '../Appsettings'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { StatusBar } from 'expo-status-bar';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Constants from 'expo-constants';
import HttpClient from '../helpers/HttpsClient';
import { Feather ,MaterialIcons,AntDesign,Octicons} from '@expo/vector-icons';
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
const height = Dimensions.get('window').height
export default class CreateAddress extends Component {
  constructor(props) {
    super(props);
    const edit =props.route.params?.edit||null
    const type = props.route.params?.address?.address_type||"HOME"
    const name = props.route.params?.address?.title||null
    const mobile = props.route.params?.address?.mobileNo||null
    const pincode = props.route.params?.address?.street||null
    const locality = props.route.params?.address?.billingStreet||null
    const nearestLandMark = props.route.params?.address?.landMark||null
    const city = props.route.params?.address?.city||null
    const primary = props.route.params?.address?.primary||false
    const address = props.route.params?.address?.street||null
    const pk = props.route.params?.address?.pk||null
    this.state = {
        type,
        name,
        mobile,
        pincode,
        locality,
        nearestLandMark,
        city,
        primary,
        address,
        edit,
        pk
    };
  }

  componentDidMount(){
   console.log(this.state.edit,"kkkk")
  }
postAddress = async()=>{

      const mob = /^[1-9]{1}[0-9]{9}$/;
      var pincode = this.state.pincode||""
      var mobileNo = this.state.mobile
    if (mobileNo == undefined || mob.test(mobileNo) == false) {
        this.refs.toast.show('Enter Correct Mobile No');
    }else if(this.state.name==null||undefined||""){
       this.refs.toast.show('Name Required');
    }else if(pincode.length!=6){
       this.refs.toast.show('Enter correct pincode');
    }
    else{
          const api = `${url}/api/POS/address/`
   let sendData ={
       city:this.state.city,
       state:"Karnataka",
       pincode:this.state.pincode,
       country:"India",
       landMark:this.state.nearestLandMark,
       street:this.state.address,
       address_type:this.state.type,
       title:this.state.name,
       mobileNo:this.state.mobile,  
   }
   if(this.state.primary){
      sendData.primary= true
   }
   console.log(sendData,"kkk")
   const postaddress = await HttpClient.post(api,sendData)
  if(postaddress.type=="success"){
       if(this.state.primary){
          this.props.navigation.navigate("CheckoutScreenNew")
       }else{
          this.props.navigation.goBack();
       }
  }
    }
  
}

  patchAddress = async(item)=>{
      const api = `${url}/api/POS/address/${this.state.pk}/`
      let sendData ={
       city:this.state.city,
       state:"Karnataka",
       pincode:this.state.pincode,
       country:"India",
       landMark:this.state.nearestLandMark,
       street:this.state.address,
       address_type:this.state.type,
       title:this.state.name,
       mobileNo:this.state.mobile,
        
   }
   if(this.state.primary){
      sendData.primary= true
   }
   const patch = await  HttpClient.patch(api,sendData)
    if(patch.type == "success"){
      this.props.navigation.goBack()
    }else{
       this.refs.toast.show('Try Again');
    }
}

  render() {
      const {navigation} = this.props
    return (
      <View style={{flex:1}}>
          <Toast style={{backgroundColor: 'grey'}} textStyle={{color: '#fff'}} ref="toast" position = 'top'/>

        {/* HEADERS */}
              <View style={{marginTop:Constants.statusBarHeight,height:height*0.07,backgroundColor:themecolor,alignItems:'center',flexDirection:"row"}}>
                   <TouchableOpacity style={{marginLeft:15,flex: 0.17,}}
                    onPress={()=>{navigation.goBack()}}
                   >
                       <Ionicons name="md-arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>  
                    <View style={{flex:0.6,alignItems:'center'}}>
                         <Text style={{color:"#fff",fontWeight:"bold",fontSize:18}}>{this.state.edit?"Edit Address":"Add New address"}</Text>
                    </View>
                    <View style={{}}>

                    </View>
             </View>
             <View style={{flex:1}}>
                  <View style={{flex:0.93}}>
                      <ScrollView>
                          <View style={{alignItems:'center',justifyContent:"center"}}>
                            <TextInput 
                              style={{width:width*0.9,height:height*0.05,backgroundColor:'#fafafa',paddingLeft:10,marginTop:20,borderRadius:10}}
                              placeholder ="Name*"
                              placeholderTextColor="#000"
                              value={this.state.name}
                              onChangeText={(text)=>{this.setState({name:text})}}
                           />
                           <TextInput 
                              style={{width:width*0.9,height:height*0.05,backgroundColor:'#fafafa',paddingLeft:10,marginTop:20,borderRadius:10}}
                              placeholder ="Mobile*"
                              placeholderTextColor="#000"
                              keyboardType="numeric"
                              value={this.state.mobile}
                              onChangeText={(text)=>{this.setState({mobile:text})}}
                           />
                           <TextInput 
                              style={{width:width*0.9,height:height*0.05,backgroundColor:'#fafafa',paddingLeft:10,marginTop:20,borderRadius:10}}
                              placeholder ="Pincode*"
                              placeholderTextColor="#000"
                              keyboardType="numeric"
                              value={this.state.pincode}
                              onChangeText={(text)=>{this.setState({pincode:text})}}
                           />
                           <TextInput 
                              style={{width:width*0.9,height:height*0.05,backgroundColor:'#fafafa',paddingLeft:10,marginTop:20,borderRadius:10}}
                              placeholder ="Address ( House no, Building, Street, Area )*"
                              placeholderTextColor="#000"
                              value={this.state.address}
                              onChangeText={(text)=>{this.setState({address:text})}}
                           />
                              <TextInput 
                              style={{width:width*0.9,height:height*0.05,backgroundColor:'#fafafa',paddingLeft:10,marginTop:20,borderRadius:10}}
                              placeholder ="Locality *"
                              placeholderTextColor="#000"
                              value={this.state.locality}
                              onChangeText={(text)=>{this.setState({locality:text})}}
                           />
                              <TextInput 
                              style={{width:width*0.9,height:height*0.05,backgroundColor:'#fafafa',paddingLeft:10,marginTop:20,borderRadius:10}}
                              placeholder ="Nearest LandMark *"
                              placeholderTextColor="#000"
                              value={this.state.nearestLandMark}
                              onChangeText={(text)=>{this.setState({nearestLandMark:text})}}
                           />
                              <TextInput 
                              style={{width:width*0.9,height:height*0.05,backgroundColor:'#fafafa',paddingLeft:10,marginTop:20,borderRadius:10}}
                              placeholder ="city *"
                              placeholderTextColor="#000"
                              value={this.state.city}
                              onChangeText={(text)=>{this.setState({city:text})}}
                           />
                           <View style={{marginTop:20,backgroundColor:"#fafafa",height:height*0.1,width:width*0.9,borderRadius:10}}>
                              <Text style={{padding: 10,}}>Type of Address</Text>
                              <View style={{flexDirection:'row',paddingHorizontal:20}}>
                                     <TouchableOpacity style={{flexDirection:"row"}}
                                        onPress={()=>{this.setState({type:"HOME"})}}
                                     >
                                         <Octicons name="primitive-dot" size={24} color={(this.state.type=="HOME"?themecolor:"#D3d3d3")} />
                                         <Text style={{marginLeft:10}}>Home</Text>
                                     </TouchableOpacity>
                                     <TouchableOpacity style={{flexDirection:'row',marginLeft:20}}
                                        onPress={()=>{this.setState({type:"OFFICE"})}}
                                     >
                                         <Octicons name="primitive-dot" size={24} color={(this.state.type=="OFFICE"?themecolor:"#D3d3d3")} />
                                         <Text style={{marginLeft:10}}>Office</Text>
                                     </TouchableOpacity>
                              </View>
                           </View>
                           <View style={{marginTop:20,backgroundColor:"#fafafa",height:height*0.1,width:width*0.9,borderRadius:10}}>
                              <Text style={{padding: 10,}}>Set as Default</Text>
                              <View style={{flexDirection:'row',paddingHorizontal:20}}>
                                     <TouchableOpacity style={{flexDirection:"row"}}
                                        onPress={()=>{this.setState({primary:true})}}
                                     >
                                         <Octicons name="primitive-dot" size={24} color={(this.state.primary?themecolor:"#D3d3d3")} />
                                         <Text style={{marginLeft:10}}>Yes</Text>
                                     </TouchableOpacity>
                                     <TouchableOpacity style={{flexDirection:'row',marginLeft:20}}
                                        onPress={()=>{this.setState({primary:false})}}
                                     >
                                         <Octicons name="primitive-dot" size={24} color={(!this.state.primary?themecolor:"#D3d3d3")} />
                                         <Text style={{marginLeft:10}}>No</Text>
                                     </TouchableOpacity>
                              </View>
                           </View>
                          </View>
                        
                      </ScrollView>

                  </View> 
                  <View style={{flexDirection:"row",flex:0.07,}}>
                      <TouchableOpacity style={{backgroundColor:"gray",flex:0.5,alignItems:'center',justifyContent:'center',height:"100%"}}
                        onPress={()=>{navigation.goBack()}}
                      >
                            <Text style={{fontWeight:'bold',color:"#fff"}}>CANCEL</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{backgroundColor:themecolor,flex:0.5,alignItems:'center',justifyContent:'center',height:"100%"}}
                        onPress={()=>{
                           if(this.state.edit){
                              this.patchAddress()
                           }else{
                              this.postAddress()
                           }
                           
                        }}
                      >
                          <Text style={{fontWeight:'bold',color:"#fff"}}>SAVE</Text>
                      </TouchableOpacity>
                  </View>
             </View>
      </View>
    );
  }
}
