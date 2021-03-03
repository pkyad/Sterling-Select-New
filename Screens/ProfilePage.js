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

export default class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        firstName:null,
        lastName:null,
        mobile:null,
        email:null,
        dp:"https://www.pngjoy.com/pngm/787/9346051_sackboy-person-unknown-png-hd-png-download.png",
        image:null
    };
  }
  getProfileInfo =async()=>{
      const userPk = await AsyncStorage.getItem("Pk")
      const api =`${url}/api/HR/users/${userPk}/`
      const userData = await HttpClient.get(api)
      if(userData.type=="success"){
          this.setState({
              firstName:userData.data.first_name,
              lastName:userData.data.last_name,
              mobile:userData.data.profile.mobile,
              email:userData.data.email,
              dp:userData.data.profile.displayPicture
            })
      }
        
  }
  _pickImage = async () => {
   let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true
   });
   if(result.cancelled == true){
     return
   }
   let filename = result.uri.split('/').pop();
   let match = /\.(\w+)$/.exec(filename);
   var type = match ? `image/${match[1]}` : `image`;
   const photo = {
      uri: result.uri,
      type: type,
      name:filename,
   };
   this.setState({dp:photo.uri,image:photo})
};
  componentDidMount(){
      this.getProfileInfo()
  }
saveProfile =async()=>{
      const userPk = await AsyncStorage.getItem("Pk")
     var mob = /^[1-9]{1}[0-9]{9}$/;
      if (this.state.mobile == undefined || mob.test(this.state.mobile) == false) {
        this.refs.toast.show('Enter Correct Mobile No');
        return
      }

    let sendData = {
        firstName:this.state.firstName,
        lastName:this.state.lastName,
        mobile:this.state.mobile,
        userID:userPk,
        email:this.state.email,
        bodyType:'formData',
    }
      if(this.state.image!=null){
        sendData.displayPicture = this.state.image
      }
   const api = `${url}/api/HR/updateUserProfile/`
  
   const postData = await HttpsClient.post(api,sendData)
  if(postData.type=="success"){
      this.refs.toast.show('Saved Successfully');
  }else{
    this.refs.toast.show('Something Went Wrong');
  }
}
  render() {
      const {navigation}= this.props


      
    return (
      <View style={{flex: 1,}}>
        <Toast style={{backgroundColor: 'grey'}} textStyle={{color: '#fff'}} ref="toast" position = 'top'/>

          {/* HEADERS */}
              <View style={{marginTop:Constants.statusBarHeight,height:height*0.07,backgroundColor:themecolor,alignItems:'center',flexDirection:"row"}}>
                   <TouchableOpacity style={{marginLeft:15,flex: 0.17,}}
                    onPress={()=>{navigation.goBack()}}
                   >
                       <Ionicons name="md-arrow-back" size={24} color="#fff" />
                    </TouchableOpacity> 
                    <View style={{flex:0.6,alignItems:'center'}}>
                         <Text style={{color:"#fff",fontWeight:"bold",fontSize:18}}>Profile</Text>
                    </View>
                    <View style={{}}>

                    </View>
             </View> 
                        {/* Profile Photo */}
             <View style={{flex: 1,}}>
                 <View style={{alignItems:"center",justifyContent:'center',marginTop:10}}>
                        <View style={{flexDirection:'row'}}>
                             <Image source={{uri:this.state.dp}}
                      style={{height:100,width:100,borderRadius:50,resizeMode:"cover",borderColor:'gray',borderWidth:2}}
                    />
                    <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}}
                     onPress={()=>{this._pickImage()}}
                    >
                        <AntDesign name="edit" size={24} color={themecolor} />
                    </TouchableOpacity>
                        </View>
                 </View>
                 {/* FORMS */}
             <View >

                 <View style={{height:height*0.09,justifyContent:'space-between',marginLeft:10}}>
                    <Text style={{fontWeight:'bold'}}>First Name</Text>
                    <TextInput 
                      style={{height:height*0.05,width:width*0.9,borderColor:'gray',borderWidth:0.5,borderRadius:5,paddingLeft:10}}
                      value={this.state.firstName}
                      onChangeText={(text)=>{this.setState({firstName:text})}}
                    />
                 </View>
                 <View style={{height:height*0.09,justifyContent:'space-between',marginLeft:10,marginTop:10}}>
                    <Text style={{fontWeight:'bold'}}>Last Name</Text>
                    <TextInput 
                      style={{height:height*0.05,width:width*0.9,borderColor:'gray',borderWidth:0.5,borderRadius:5,paddingLeft:10}}
                      value={this.state.lastName}
                       onChangeText={(text)=>{this.setState({lastName:text})}}
                   />
                 </View>
                   <View style={{height:height*0.09,justifyContent:'space-between',marginLeft:10,marginTop:10}}>
                    <Text style={{fontWeight:'bold'}}>Mobile</Text>
                    <TextInput 
                      style={{height:height*0.05,width:width*0.9,borderColor:'gray',borderWidth:0.5,borderRadius:5,paddingLeft:10}}
                     value={this.state.mobile}
                     keyboardType="numeric"
                      onChangeText={(text)=>{this.setState({mobile:text})}}
                   />
                 </View>
                   <View style={{height:height*0.09,justifyContent:'space-between',marginLeft:10,marginTop:10}}>
                    <Text style={{fontWeight:'bold'}}>Email</Text>
                    <TextInput 
                      style={{height:height*0.05,width:width*0.9,borderColor:'gray',borderWidth:0.5,borderRadius:5,paddingLeft:10}}
                      value={this.state.email}
                      onChangeText={(text)=>{this.setState({email:text})}}
                    />
                 </View>
                 <View style={{height:height*0.2,alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity style={{backgroundColor:themecolor,width:width*0.3,alignItems:'center',justifyContent:'center',height:height*0.05,borderRadius:10}}
                         onPress={()=>this.saveProfile()}
                        >
                        <Text style={{fontWeight:'bold',color:'#fff'}}>SAVE</Text>
                    </TouchableOpacity>
                 </View>
                    
             </View>
             </View>
             
      </View>
    );
  }
}
