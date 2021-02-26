import React ,{useEffect, useState ,useRef} from 'react';
import { View, Text, TouchableOpacity ,Dimensions,Image, FlatList,ActivityIndicator, TextInput} from 'react-native';
import settings from '../Appsettings'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { StatusBar } from 'expo-status-bar';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Constants from 'expo-constants';
import HttpClient from '../helpers/HttpsClient';
import { Feather } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import { ScrollView } from 'react-native-gesture-handler';
import { SliderBox } from "react-native-image-slider-box";
import { Ionicons } from '@expo/vector-icons';


const themecolor = settings.themecolor
const url = settings.url
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
function SearchScreen2({navigation}) {
     const inputRef = useRef();
     useEffect(()=>{
       inputRef.current.focus()
     },[])
     const searchProducts =async(query)=>{
          const api =`${url}/api/POS/searchProduct/?search=${query}&limit=10`
          let data = await HttpClient.get(api)
          console.log(api,data)
     }
    return ( 
        <View style={{flex:1,}}>
                        {/* Headers */}
           <View style={{marginTop:Constants.statusBarHeight,height:height*0.07,backgroundColor:themecolor,flexDirection:"row",alignItems:'center',}}>
              <TouchableOpacity style={{flex: 0.15,alignItems:"center",justifyContent:'center'}} 
               onPress={()=>{navigation.goBack()}}
              >
                 <Ionicons name="md-arrow-back" size={24} color="#fff" />
             </TouchableOpacity>  
             <View style={{flex: 0.8,}}>
                 <View style={{backgroundColor:"#fff",height:height*0.05,width:width*0.8,borderRadius:20,flexDirection:"row",alignItems:"center"}}>
                    <EvilIcons name="search" size={28} color={themecolor} />
                     <TextInput 
                       style={{height:height*0.05,width:width*0.7,fontSize:15}}
                       placeholder="search products"
                       selectionColor={themecolor}
                       placeholderTextColor={themecolor}
                       ref={inputRef}
                       onChangeText={(text)=>{searchProducts(text)}} 
                     />
                 </View>
             </View>
           </View>
        </View>
    )
}


export default SearchScreen2;