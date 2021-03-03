import React ,{useEffect, useState,Component} from 'react';
import { View, Text, TouchableOpacity ,Dimensions,Image, FlatList,ActivityIndicator, TextInput} from 'react-native';
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
import * as ImagePicker from 'expo-image-picker';
import Resolved from '../components/Resolved';
const themecolor = settings.themecolor
const url = settings.url
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class RaiseConcern extends Component {
  constructor(props) {
    super(props);
    this.state = {
        image:null
    };
  }
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
     
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({image:result.uri})
    }
  };
  render() {
      const {navigation} =this.props
    return (
      <View style={{flex: 1,}}>
                              {/*HEADERS  */}
             <View style={{marginTop:Constants.statusBarHeight,height:height*0.07,backgroundColor:themecolor,alignItems:'center',flexDirection:"row"}}>
                   <TouchableOpacity style={{marginLeft:15,flex: 0.17,}}
                    onPress={()=>{navigation.goBack()}}
                   >
                       <Ionicons name="md-arrow-back" size={24} color="#fff" />
                    </TouchableOpacity> 
                    <View style={{flex:0.6,alignItems:'center'}}>
                         <Text style={{color:"#fff",fontWeight:"bold",fontSize:18}}>Raise Concern</Text>
                    </View>
                    <View style={{}}>

                    </View>
             </View>
                     {/* FORMS */}
            
                 <ScrollView>
                        
                    <View style={{height:height*0.13,justifyContent:"space-around"}}>
                        <Text style={{marginLeft:20,fontWeight:'bold'}}>Title</Text>
                       
                        <TextInput 
                           style={{height:height*0.05,width:width*0.9,backgroundColor:"#eee",borderWidth:0.5,borderColor:"gray",marginLeft:20,paddingLeft:20,borderRadius:5}}
                        placeholder="Enter Title"
                        />
                    </View>
                      <View style={{height:height*0.13,justifyContent:"space-around"}}>
                        <Text style={{marginLeft:20,fontWeight:'bold'}}>OrderId</Text>
                       
                        <TextInput 
                           style={{height:height*0.05,width:width*0.9,backgroundColor:"#eee",borderWidth:0.5,borderColor:"gray",marginLeft:20,paddingLeft:20,borderRadius:5}}
                        placeholder="Enter OrderId"
                        />
                    </View>
                      <View style={{height:height*0.13,justifyContent:"space-around"}}>
                        <Text style={{marginLeft:20,fontWeight:'bold'}}>Select Concern Type</Text>
                       
                        <DropDownPicker
                        items={[
                            {label: 'OrderRelated', value: 'OrderRelated',   },
                            {label: 'ProductRelated', value: 'ProductRelated', },
                            {label: 'Delivery Related', value: 'Delivery Related',},
                            {label: 'Payment Related', value: 'Payment Related',},
                            {label: 'Service Related', value: 'Service Related',},
                        ]}
                        placeholder="Select Concern Type"
                        defaultValue={this.state.country}
                        containerStyle={{height: 40}}
                        style={{backgroundColor: '#fafafa',width:width*0.9,marginLeft:20}}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa',width:width*0.9,marginLeft:20}}
                        onChangeItem={item => this.setState({
                            concernType: item.value
                        })}
                    />
                    </View>
                      <View style={{height:height*0.2,justifyContent:"space-around"}}>
                        <Text style={{marginLeft:20,fontWeight:'bold'}}>Add Supporting Photos (Optional)</Text>
                         <TouchableOpacity style={{height:height*0.1,backgroundColor:"#EEE",width:width*0.2,marginLeft:20,borderWidth:0.5,borderColor:"gray",alignItems:"center",justifyContent:'center',}}
                         onPress={()=>{this.pickImage()}}
                         >
                                 <Text>+</Text>
                         </TouchableOpacity>
                       
                    </View>
                      <View style={{height:height*0.3,}}>
                        <Text style={{marginLeft:20,marginTop:20,fontWeight:'bold'}}>Comments/Feedback</Text>
                       
                        <TextInput 
                           style={{height:height*0.2,width:width*0.9,backgroundColor:"#eee",borderWidth:0.5,borderColor:"gray",marginLeft:20,marginTop:10,textAlign:"center",borderRadius:5}}
                          placeholder="Enter your feedbacks"
                        />
                    </View>
            
 
                    <View style={{height:height*0.1,alignItems:"center",justifyContent:'center'}}>
                        <TouchableOpacity style={{backgroundColor:themecolor,width:width*0.6,height:height*0.05,alignItems:"center",justifyContent:'center',borderRadius:10}}
                         
                        >
                            <Text style={{color:"#fff"}}>VERIFY</Text>
                        </TouchableOpacity>
                    </View>
          
                 </ScrollView>
                 
                
             </View>
      
    );
  }
}
