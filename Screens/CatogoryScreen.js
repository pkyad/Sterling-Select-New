import { View, Text, TouchableOpacity ,Dimensions,Image, FlatList,ActivityIndicator} from 'react-native';
import settings from '../Appsettings'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { StatusBar } from 'expo-status-bar';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Constants from 'expo-constants';
import HttpClient from '../helpers/HttpsClient';
import { Feather } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { SliderBox } from "react-native-image-slider-box";
const themecolor = settings.themecolor
const url = settings.url
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

import React, { Component } from 'react';


 class CatogoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        Catagories:[],
        selected:{},
        offset:0,
        loading:true,
        products:[],
        loadFinished:false
    };
  } 

componentDidMount(){

   this.getCatagories();

}

       updateProducts =async()=>{
       
        const api = `${url}/api/POS/productliteApp/?category=${this.state.selected.pk}&format=json&limit=5&offset=${this.state.offset}`
        let data = await HttpClient.get(api)
         if(data.type=="success"){
             this.setState({products:this.state.products.concat(data.data.results)})  
         }
         if(data.data.next==null){
             this.setState({loading:false,loadFinished:true})
         }
         console.log("update called",api)
     }

  

   getProducts =async(pk)=>{
        this.setState({offset:0,loadFinished:false,products:[],loading:true})
        const api =`${url}/api/POS/productliteApp/?category=${pk}&format=json&limit=5&offset=0`
        let data = await HttpClient.get(api)
        if(data.type=="success"){
            this.setState({products:data.data.results})
        }
        if(data.data.next==null){
              this.setState({loading:false,loadFinished:true})
              
        }
     console.log(api,"nee")
    }


      getCatagories = async()=>{
         let data =  await HttpClient.get(`${url}/api/POS/getCategoryList/`)
         if(data.type="success"){
               this.setState({selected:data.data.cats[0],Catagories:data.data.cats})
             
           this.getProducts(data.data.cats[0].pk) 
         }
        
     }
    footer =()=>{
       if(this.state.loading){
             return(
              <View style={{alignItems:"center",justifyContent:"center",height:height*0.2}}>
                 <Text>Hang on,Loading</Text> 
                <ActivityIndicator size="large" color={themecolor} />
              </View>
          )
       }else{
           return <View style={{alignItems:"center",justifyContent:"center",height:height*0.1}}>
               <Text>NO MORE PRODUCTS</Text>
           </View>
       }
         
    }
     renderProducts =(item,index)=>{
       
       return(
           <View style={{flexDirection:"row",height:height*0.2,}}>
                <View style={{flex: 0.3,alignItems:"center",justifyContent:"center"}}>
                     <Image source={{uri:`${url}/media/${item.image}`}} style={{height:"80%",width:"80%",resizeMode:"contain"}} />
                </View>

                <View style={{flex: 0.4,alignItems:"flex-start",justifyContent:"center"}}>
                    <Text>{item.name}</Text>
                    {/* <Text>{item?.variant[0]?.value} {item.variant[0].unitType}</Text> */}
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
  render() {
    return (
      <View style={{flex:1}}>

                       {/* HEADERS */}
                <View style={{marginTop:Constants.statusBarHeight,flexDirection:"row",backgroundColor:"#fff",height:height*0.07,alignItems:"center"}}>
                    <TouchableOpacity style={{flex:0.15,alignItems:"center",justifyContent:"center"}}
                    onPress ={()=>{this.props.navigation.openDrawer()}}
                    >
                            <FontAwesome name="bars" color={themecolor} size={23}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:0.6,borderWidth:2,borderColor:themecolor,height:height*0.04,alignItems:"flex-end",justifyContent:"center",borderRadius:width*0.035}}
                    onPress={()=>{this.props.navigation.navigate("SearchScreen2")}}
                    >
                        <EvilIcons name="search" color={themecolor} size={23}/>
                    </TouchableOpacity>
                    <View style={{flex:0.25,alignItems:"center",justifyContent:"center"}} >
                        <Image source ={require('../assets/sterlingsplash1.png')}  style={{height:"70%",width:"100%",resizeMode:"contain"}} />
                    </View>
                  
                    
                </View>
             <View style={{height:height*0.07,width:width}}>
                     <FlatList 
                   contentContainerStyle={{flexDirection:"row",alignItems:"center",justifyContent:'space-around'}}
                   horizontal={true}
                   data={this.state.Catagories}
                   keyExtractor={(item,index)=>index.toString()}
                   showsHorizontalScrollIndicator={false}
                   renderItem={({item,index})=>{
                       return(
                           <TouchableOpacity style={{paddingHorizontal:10}} 
                            onPress={()=>{this.setState({selected:item},()=>{
                                this.getProducts(item.pk)
                            })}}
                           >
                                <Text style={{color:(item.pk==this.state.selected.pk?themecolor:"#000")}}>{item.name}</Text>
                                {this.state.selected.pk==item.pk&&<View style={{borderColor:themecolor,borderWidth:2,marginTop:5}}>

                                </View>}
                           </TouchableOpacity>
                       )
                   }}
                 />
                </View>
                <FlatList
                     data={this.state.products}
                     keyExtractor={(item,index)=>index.toString()}
                     renderItem ={({item,index})=>this.renderProducts(item,index)}
                     onEndReached={()=>{!this.state.loadFinished&&this.setState({loading:true,offset:this.state.offset+5},()=>{
                           this.updateProducts()
                     })}}
                     ListFooterComponent={this.footer()}
                     onEndReachedThreshold={0.1}
                /> 

        </View>
    );
  }
}

export default  CatogoryScreen;
 
   
     
    

