import React ,{useEffect, useState} from 'react';
import { View, Text, TouchableOpacity ,Dimensions,Image, FlatList,ActivityIndicator} from 'react-native';
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
import RNPickerSelect from 'react-native-picker-select';
const themecolor = settings.themecolor
const url = settings.url
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
 function ViewAllProducts({navigation}) {
     const[products,setProducts] = useState([]);
     const[offset,setOffset] = useState(0);
     const [type,setType]= useState("most_bought")
        let data = [{
      value: 'Most Viewed',
    }, {
      value: 'For you',
    }, {
      value: 'All Products',
    }];

    const getProducts =async()=>{
          const api = `${url}/api/POS/productliteApp/?limit=5&offset=${offset}&type=${type}`
          let product = await HttpClient.get(api)
           if(product.type=="success"){
               console.log(product.data.results[0])
               setProducts(products.concat(product.data.results))
           }
    }

    useEffect(()=>{
          getProducts();
    },[offset])
    const footer =()=>{
        return(
            <View style={{height:height*0.2,alignItems:"center",justifyContent:"center"}}>
                       <ActivityIndicator size="large" color={themecolor} />
                       <Text> Hang on Loading...</Text>
            </View>
        )
    }
   const  renderProducts =({item,index})=>{
       
       return(
           <View style={{flexDirection:"row",height:height*0.2,}}>
                <View style={{flex: 0.3,alignItems:"center",justifyContent:"center"}}>
                     <Image source={{uri:`${url}/media/${item.image}`}} style={{height:"80%",width:"80%",resizeMode:"contain"}} />
                </View>

                <View style={{flex: 0.4,alignItems:"flex-start",justifyContent:"center"}}>
                    <Text>{item.name}</Text>
                    <Text>{item?.variant[0]?.value} {item.variant[0].unitType}</Text>
                    <View style={{flexDirection:"row",alignItems:'center'}}>
                       <Text style={{color:themecolor,fontWeight:"bold",fontSize:20}}>₹{item.sellingPrice}</Text>
                       <Text style={{color:"gray",textDecorationLine:'line-through',marginLeft:10}}>₹{item.price}</Text>
                    </View>
                
                </View>

                <View style={{flex: 0.3,alignItems:"center",justifyContent:"center",}}>
                     <TouchableOpacity style={{width:width*0.2,height:height*0.05,borderColor:"gray",borderWidth:2,borderRadius:20,alignItems:"center",justifyContent:"center"}}>
                             <FontAwesome name="cart-plus" size={24} color="gray"/> 
                     </TouchableOpacity>   
               </View>
           </View>
       )
   }
    return (
        <View style={{flex: 1,}}>
                        {/* HEADERS */}
             <View style={{marginTop:Constants.statusBarHeight,height:height*0.07,backgroundColor:themecolor,alignItems:'center',flexDirection:"row"}}>
                   <TouchableOpacity style={{marginLeft:15,flex: 0.17,}}
                    onPress={()=>{navigation.goBack()}}
                   >
                       <Ionicons name="md-arrow-back" size={24} color="#fff" />
                    </TouchableOpacity> 
                    <View style={{flex:0.6,alignItems:'center'}}>
                         <Text style={{color:"#fff",fontWeight:"bold",fontSize:18}}>ALL PRODUCTS</Text>
                    </View>
                    <View style={{}}>

                    </View>
             </View> 

                             {/*FILTERS  */}
               <View style={{backgroundColor:"#fff",flexDirection:"row",alignItems:"center",justifyContent:"space-around",minHeight:height*0.07 }}>
                      <Feather name="filter" size={24} color="black" /> 
                      <View style={{width:width*0.3}}>
            <RNPickerSelect
                 onValueChange={(value) => console.log(value)}
                 items={[
                     { label: "Most Bought", value: "most_bought" },
                     { label: "For You", value: "for_you" },
                     { label: "All Products", value: "all" },
                   
                 ]}
             />
                      </View>
                     
                      <Text>{products.length} items listed</Text>
                </View> 
               
                <FlatList
                    data={products}
                    keyExtractor={(item,index)=>index.toString()}
                    renderItem ={renderProducts}
                    onEndReached={()=>{setOffset(offset+5)}}
                    onEndReachedThreshold ={0.1}
                    ListFooterComponent ={footer}
                />             
        </View>
    )
}

export default ViewAllProducts;