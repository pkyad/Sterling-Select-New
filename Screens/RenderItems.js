import React ,{useEffect, useState} from 'react';
import { View, Text, TouchableOpacity ,Dimensions,Image, FlatList,ActivityIndicator, AsyncStorage} from 'react-native';
import settings from '../Appsettings'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { StatusBar } from 'expo-status-bar';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Constants from 'expo-constants';
import HttpClient from '../helpers/HttpsClient';
import { Feather } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { SliderBox } from "react-native-image-slider-box";
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import * as actionTypes from '../actions/actionTypes';

const themecolor = settings.themecolor
const url = settings.url
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

 class RenderItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
         cartItems:props.cartItems,
    };
  }
  componentDidMount(){
    //   const varientCount = this.state.varientCount;
    //   const varientCart = this.state.varientCart;
    //     for (var i = 0; i < varientCount.length; i++) {
    //       varientCount[i] = 0
    //    } 
    //     this.state.cartItems.forEach((item,idx)=>{
      
    //     this.state.product.variant.forEach((i,id)=>{
    //       if(item.pk == i.pk ){
    //         varientCount[id] = this.state.cartItems[idx].count
    //       }
    //     })
      
    // })
  }

  render() {
      const{item} =this.props
    return (
      
          <View style={{height:height*0.3,backgroundColor:"#fff",elevation:5,width:width*0.55,marginHorizontal:10,marginBottom:10}}>
              <View style={{flex: 0.5,alignItems:"center",justifyContent:"center"}}>
                  <Image source={{uri:`${url}/media/${item.image}`}} style={{height:"100%",width:"100%",resizeMode:"contain"}} />
              </View>
              <View style={{flex: 0.5,alignItems:"center",justifyContent:"space-around"}}>
                    <View style={{alignItems:"center",justifyContent:"center"}}>
                        <Text>{item.name}</Text>
                    </View>
                    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",zIndex:20}}>

                        <DropDownPicker
                            items={[
                                {label: 'USA', value: 'usa',},
                                {label: 'UK', value: 'uk',},
                                {label: 'France', value: 'france',},
                            ]}
                            placeholder="50gm"
                            containerStyle={{height: 30,width:width*0.2}}
                            style={{backgroundColor: '#fafafa'}}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                    
                            dropDownMaxHeight={height*0.08}
                            dropDownStyle={{backgroundColor: '#fafafa'}}
                            
                       />
                        <Text style={{color:themecolor,fontWeight:"bold",fontSize:20,marginLeft:10}}>₹{item.sellingPrice}</Text>
                        <Text style={{color:"gray",textDecorationLine:"line-through",marginLeft:5}}>₹{item.price}</Text>
                    </View>
                    <TouchableOpacity style={{flexDirection:"row",backgroundColor:themecolor,width:"70%",borderRadius:10,alignItems:"center",justifyContent:"center",paddingVertical:5}}>
                            <Text style={{color:'#fff'}}>ADD TO</Text>
                            <Feather name="shopping-cart" size={24} color="#fff" />
                    </TouchableOpacity>
              </View>
          </View>
      )
    
  }
}

export default RenderItems;