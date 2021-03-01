import React ,{useEffect, useState,Component} from 'react';
import { View, Text, TouchableOpacity ,Dimensions,Image, FlatList,ActivityIndicator, AsyncStorage} from 'react-native';
import settings from '../Appsettings'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { StatusBar } from 'expo-status-bar';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Constants from 'expo-constants';
import HttpClient from '../helpers/HttpsClient';
import { Feather ,Ionicons} from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { SliderBox } from "react-native-image-slider-box";
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import * as actionTypes from '../actions/actionTypes';
import RenderItems from './RenderItems';
const themecolor = settings.themecolor
const url = settings.url
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

 class productInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
        product:{}
    };
  }
getDetails =async(pk)=>{
  let data =  await HttpClient.get(`${url}/api/POS/productDetails/${pk}/`)
  
  if(data.type=="success"){
      this.setState({productDetails:data.data})
  }
}
 componentDidMount(){
 
  this.getDetails(this.props.route.params.pk)

  }
  render() {
      const{product} =this.state
      const{navigation} =this.props
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
                         <Text style={{color:"#fff",fontWeight:"bold",fontSize:18}}>PRODUCT DETAILS</Text>
                    </View>
                    <View style={{}}>

                    </View>
             </View>     
      </View>
    );
  }
}

export default productInfo;