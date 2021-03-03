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
const themecolor = settings.themecolor
const url = settings.url
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const initialLayout = { width: Dimensions.get('window').width };
export default class HelpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
         routes:[{ key: 'Active', title: 'Active' },
    { key: 'Resolved', title: 'Resolved' },],
      index:0,
    };
  }
 async componentDidMount (){
      const pk = await AsyncStorage.getAllKeys()
      console.log(pk,"hhghhgh")
  }
renderScene =({route})=>{
    
    switch (route.key) {
    case 'Active':
      return <Active navigation ={this.props.navigation}/>;
    case 'Resolved':
      return <Resolved navigation ={this.props.navigation}/>;
    default:
      return null;
  }
}
  render() {
      const{navigation} =this.props
       const {index,routes}= this.state
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
                         <Text style={{color:"#fff",fontWeight:"bold",fontSize:18}}>HELP</Text>
                    </View>
                    <View style={{}}>

                    </View>
             </View>

           <TabView
          style={{}}
        navigationState={{ index, routes }}
        renderScene={this.renderScene}
           onIndexChange={(index)=>{this.setState({index})}}
             initialLayout={initialLayout}
          renderTabBar={(props) =>
                    <TabBar
                      {...props}
                      indicatorStyle={{ backgroundColor: '#fff' ,}}
                      style={{backgroundColor: "#fff", height: 50,fontWeight:"bold",}}
                      labelStyle={{fontWeight:"bold",color:'#000'}}
                      indicatorStyle={{backgroundColor: themecolor,height:5}}
                    
                    />
                  }
    />
      </View>
    );
  }
}
