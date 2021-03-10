import React ,{useEffect, useState} from 'react';
import { View, Text, TouchableOpacity ,Dimensions,Image, FlatList,ActivityIndicator, AsyncStorage, Platform} from 'react-native';
import settings from '../Appsettings'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { StatusBar } from 'expo-status-bar';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Constants from 'expo-constants';
import HttpClient from '../helpers/HttpsClient';
import { Feather ,MaterialIcons,AntDesign} from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { SliderBox } from "react-native-image-slider-box";
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import * as actionTypes from '../actions/actionTypes';
import RenderItems from './RenderItems';
import Modal from "react-native-modal";
import Toast, {DURATION} from 'react-native-easy-toast';
import {Linking} from 'react-native';
const themecolor = settings.themecolor
const url = settings.url
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const images =[
         require('../assets/images/Banner.png'),
         require('../assets/images/banner 2.png'),
]


 class  HomeScreen extends React.Component {
    constructor(props) {
    super(props);
    homeScreen = this;
    this.mounted=false
    this.state = {
        mostBoughtItems:[],
        mostBoughtOffset:0,
        forYouItems:[],
        forYouOffset:0,
        allProductsItem:[],
        allProductsOffset:0,
        cartItems :this.props.cart,
        cartLoaderShow:false,
        modalVisible:false,
        selectedProduct:null,
        variantShow:false,
        selectedStore:this.props.selectedStore,
        appDetails:null
    };

  }
   
    getAppDetails = async()=>{
      const api = `${url}/api/POS/getstoreLite/`
      let details =await HttpClient.get(api)
      if(details.type=="success"){
          this.setState({appDetails:details.data})
      }
    }
   
     mostBought =async()=>{
        const api = `${url}/api/POS/productliteApp/?limit=2&offset=${this.state.mostBoughtOffset}&type=most_bought`
         let data = await HttpClient.get(api) 
          
         if(data.type=="success"){
             this.setState({mostBoughtItems:this.state.mostBoughtItems.concat(data.data.results)})
             
         } 
         console.log(api,"uuuu") 
    }
      forYou =async()=>{
         // console.log("forr called")
         const api = `${url}/api/POS/productliteApp/?limit=2&offset=${this.state.forYouOffset}&type=for_you`
         let data = await HttpClient.get(api) 
 
         if(data.type=="success"){
             this.setState({forYouItems:this.state.forYouItems.concat(data.data.results)})
            
         } 
        // console.log(api,"uuuu")  
    }
     allProducts =async()=>{
         const api = `${url}/api/POS/productliteApp/?limit=2&offset=${this.state.allProductsOffset}&type=all`
         let data = await HttpClient.get(api)   
         if(data.type=="success"){
             this.setState({allProductsItem:this.state.allProductsItem.concat(data.data.results)})
             
         }
         //console.log(api,"uuuu")   
    }
  componentDidMount(){  
      //console.log(this.props,"hhjhj")
   
      this.mostBought()
      this.forYou()
      this.allProducts()
      this.getAppDetails()
      this.getServiceCart()
          this._unsubscribe = this.props.navigation.addListener('focus', () => {
            console.log("calleddd")
                
                  this.getServiceCart()
              });
  }
  componentWillUnmount(){
    this._unsubscribe();
  }
   openVariantSelection=(variants,type)=>{
     console.log(variants,'gjhjhjkjk');
    this.setState({selectionType:type,selectedProduct:variants,variantShow:true})
  }

 getServiceCart =async()=>{
        const userPk = await AsyncStorage.getItem("csrf")
        if(userPk!=null){
    
           const api =(`${url}/api/POS/cartService/`)
        const data = await HttpClient.get(api)
        console.log(data)
        if(data.type=="success"){
           
            let arr =[]
            data.data.data.forEach((i)=>{
               arr.push({count:i.qty,pk:i.pk})

          })
           this.props.setInitialFunction(arr,data.data.cartQtyTotal,data.data.cartPriceTotal)
           this.props.setCounterAmount(data.data.cartQtyTotal,data.data.cartPriceTotal,data.data.saved)
           this.setState({cartItems:arr})
       }else{
        this.props.setInitialFunction([],0,0)
        this.props.setCounterAmount(0,0,0)
      }
        }else{
          return 
        }
        
    }
  
   footer =()=>{
          return(
              <View style={{alignItems:"center",justifyContent:"center",height:height*0.3}}>
                <ActivityIndicator size="large" color={themecolor} />
              </View>
          )
    }

    updateCart = (args) =>{
    if(args.type == 'delete'){
      this.props.removeItemFunction(args)
      return
    }
    if (args.type == actionTypes.ADD_TO_CART){
        this.props.addTocartFunction(args);
    }
    if (args.type == actionTypes.INCREASE_CART){
        this.props.increaseCartFunction(args);

    }
    if (args.type == actionTypes.DECREASE_FROM_CART){
        this.props.decreaseFromCartFunction(args);

    }

  }
   setModalVisible=(bool)=>{
    this.setState({modalVisible:bool})
  }
  variantSelection =()=>{
    var value2 = []
    if(this.state.selectedProduct!=null){
         if(this.state.selectedProduct.value2!=null&&this.state.selectedProduct.value2!=undefined){
           value2 = this.state.selectedProduct.value2
         }
    }




   selectVariant =(name,index,id)=>{
     console.log(this.refs[id],'hsjcdjk');
      this.setState({selectedProduct:null,variantShow:false})
      if(this.state.selectionType=='mostBought'){
        this.refs[id].dropDownChanged(name,index)
      }else if(this.state.selectionType=='forYou'){
        this.refs['forYou'+id].dropDownChanged(name,index)
      }else if(this.state.selectionType=='allProducts'){
        this.refs['allProducts'+id].dropDownChanged(name,index)
      }
    }

      return(
        <Modal isVisible={this.state.variantShow} propagateSwipe={true}  animationIn="fadeIn" useNativeDriver={true} animationOut="fadeOut" hasBackdrop={true} useNativeDriver={true} propagateSwipe={true} onRequestClose={()=>this.setState({variantShow:false,selectedProduct:null})} onBackdropPress={()=>{this.setState({variantShow:false,selectedProduct:null})}} >
         {this.state.selectedProduct!=null&&
           <View style={{alignItems:"center",justifyContent:"center",backgroundColor:"#fff",height:height*0.3,borderRadius:10}}>
                
                  <Text style={{marginTop:15}}>Available Quantities for</Text>
                  <Text style={{marginTop:15}}>{this.state.selectedProduct.name}</Text>
                  <FlatList contentContainerStyle={{alignItems:"center",justifyContent:"center",marginTop:15}}
                        data={this.state.selectedProduct.variants}
                        keyExtractor={(item,index) => {
                          return index.toString();
                        }}
                        horizontal={false}
                        onEndThreshold={0}
                        extraData={this.state}
                        renderItem={({item, index}) => {
                          if(value2[index]!=undefined&&value2[index]!=null){
                            value2[index] = null
                          }
                          var sizeFont = value2[index]!=null?13:16
                          return(
                            <TouchableOpacity key={index} onPress={()=>selectVariant(item,index,this.state.selectedProduct.indexFind)}  style={{flexDirection:'row'}}
                             style={{}}
                            >
                              <View style={{width:value2[index]==null?width-80:width-120,paddingVertical:5,}}>
                                <View style={{flexDirection:'row',backgroundColor:this.state.selectedProduct.selectedIndex==index?themecolor:'#fff',borderRadius:5,borderWidth:this.state.selectedProduct.selectedIndex==index?0:1,borderColor:'#d2d2d2',paddingVertical:5,paddingHorizontal:10,alignItems:'center',justifyContent:'center',width:'100%'}}>
                                <Text style={{color:this.state.selectedProduct.selectedIndex==index?'#fff':'grey',fontSize:sizeFont,fontWeight:'700'}}>{item.name}  -</Text>
                                <Text style={{color:this.state.selectedProduct.selectedIndex==index?'#fff':'grey',fontSize:sizeFont,fontWeight:'700',textDecorationLine: 'line-through',marginHorizontal:10, textDecorationStyle: 'solid'}}>&#8377;{item.mrp}</Text>
                                 <Text style={{color:this.state.selectedProduct.selectedIndex==index?'#fff':'grey',fontSize:sizeFont,fontWeight:'700'}}>-  &#8377;{Math.round(item.sellingPrice)}</Text>
                                </View>
                              </View>
                              {value2[index]!=null&&value2[index]!=undefined&&
                                <View key={index}  style={{width:30,paddingVertical:5,marginHorizontal:5}}>
                                  <View style={{flexDirection:'row',backgroundColor:'#fff',borderRadius:5,borderWidth:1,borderColor:'#d2d2d2',paddingVertical:5,paddingHorizontal:5,alignItems:'center',justifyContent:'center',}}>
                                    <View  style={{backgroundColor: value2[index],width:18,height:18,borderRadius:9}}>
                                    </View>
                                  </View>
                                </View>
                              }
                            </TouchableOpacity>
                          )}}
                  />
             
           </View>
         }
        
        </Modal>
      )

  }
  
  render(){
      const {navigation} =this.props
     return (
        <View style={{flex:1}}>
          <Toast style={{backgroundColor: 'red'}}  textStyle={{color: '#fff'}} ref="toast" position = 'center'/>
             <StatusBar style="light" backgroundColor={themecolor} />
                                 {/* HEADERS */}
                <View style={{marginTop:Constants.statusBarHeight,flexDirection:"row",backgroundColor:"#fff",height:height*0.07,alignItems:"center"}}>
                    <TouchableOpacity style={{flex:0.15,alignItems:"center",justifyContent:"center"}}
                    onPress ={()=>{navigation.openDrawer()}}
                    >
                            <FontAwesome name="bars" color={themecolor} size={23}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:0.6,borderWidth:2,borderColor:themecolor,height:height*0.04,alignItems:"flex-end",justifyContent:"center",borderRadius:width*0.035}}
                    onPress={()=>{navigation.navigate("SearchScreen")}}
                    >
                        <EvilIcons name="search" color={themecolor} size={23}/>
                    </TouchableOpacity>
                    <View style={{flex:0.25,alignItems:"center",justifyContent:"center"}} >
                        <Image source ={require('../assets/sterlingsplash1.png')}  style={{height:"70%",width:"100%",resizeMode:"contain"}} />
                    </View>
                </View>
         <ScrollView>
             <View style={{height:height*0.04,backgroundColor:themecolor,alignItems:"center",justifyContent:"center"}}>
                  <Text style={{color:"#fff"}}>{this.state.appDetails?.headerTitle}</Text>
             </View>
                             
                                        {/* CAROUSEL */}
                             
             <View style={{height:height*0.2,}}>
                 <SliderBox 
                   images={images} 
                   dotColor={themecolor}
                   imageLoadingColor={themecolor}
                   ImageComponentStyle={{height:"100%",width:"100%",resizeMode:"cover"}}
                   autoplay={true}
                   circleLoop={true}
                 />
             </View>
                                       {/* MOST BOUGHT */}
       
                                
             <View>
                   <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",padding:20}}>
                      <Text style={{fontWeight:"bold",textDecorationLine:'underline'}}>Most Bought</Text>
                       <TouchableOpacity onPress={()=>{navigation.navigate("ViewAllProducts")}}>
                           <Text style={{color:"green",fontWeight:"bold"}}>VIEW ALL</Text>
                       </TouchableOpacity>
                   </View>
                   <View>
                       <FlatList
                         horizontal={true}
                         showsHorizontalScrollIndicator={false}
                         contentContainerStyle={{flexDirection:"row",marginHorizontal:10,}}
                         data={this.state.mostBoughtItems}
                         keyExtractor={(item,index)=>index.toString()}
                         renderItem={({item,index})=> 
                         <View>
                           <RenderItems 
                            ref={(ref) => {this.refs[index] = ref}} 
                            setCounterAmount={(counter,totalAmount,saved)=>this.props.setCounterAmount(counter,totalAmount,saved)} 
                            product={item} 
                            key={index} 
                            cartLoaderShow={this.state.cartLoaderShow} 
                            index={index} 
                            openVariantSelection={(state)=>{this.openVariantSelection(state,'mostBought')}} 
                            selectedStore={this.state.selectedStore} 
                            cartItems={this.state.cartItems} 
                            onChange={ (args)=> this.updateCart(args)} 
                            navigation={this.props.navigation} 
                            userScreen={this.state.userScreen} 
                            store={this.state.store} 
                            modalVisible={(bool)=>{this.setModalVisible(bool)}}
                            select ={(product)=>{this.select(product)}} 
                            
                         />
                         </View>
                         
                        }
                         onEndReached={()=>{this.setState({mostBoughtOffset:this.state.mostBoughtOffset+2},()=>{
                               this.mostBought()
                         })}}
                         onEndReachedThreshold={0.1}
                         ListFooterComponent={this.footer()}
                       />
                   </View>
             </View>

                                            {/*FOR U */}
             <View>
                   <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",padding:20}}>
                      <Text style={{fontWeight:"bold",textDecorationLine:'underline'}}>For You</Text>
                       <TouchableOpacity onPress={()=>{navigation.navigate("ViewAllProducts")}}>
                           <Text style={{color:"green",fontWeight:"bold"}}>VIEW ALL</Text>
                       </TouchableOpacity>
                   </View>
                   <View>
                       <FlatList
                         horizontal={true}
                         showsHorizontalScrollIndicator={false}
                         contentContainerStyle={{flexDirection:"row",marginHorizontal:10,}}
                         data={this.state.forYouItems}
                         keyExtractor={(item,index)=>index.toString()}
                         renderItem={({item,index})=>
                            <View>
                              <RenderItems 
                            ref={(ref) => this.refs['forYou'+index] = ref} 
                            setCounterAmount={(counter,totalAmount,saved)=>this.props.setCounterAmount(counter,totalAmount,saved)} 
                            product={item} 
                            key={index} 
                            cartLoaderShow={this.state.cartLoaderShow} 
                            index={index} 
                            openVariantSelection={(state)=>{this.openVariantSelection(state,'forYou')}} 
                            selectedStore={this.state.selectedStore} 
                            cartItems={this.state.cartItems} 
                            onChange={ (args)=> this.updateCart(args)} 
                            navigation={this.props.navigation} 
                            userScreen={this.state.userScreen} 
                            store={this.state.store} 
                            modalVisible={(bool)=>{this.setModalVisible(bool)}} 
                            select ={(product)=>{this.select(product)}}
                        
                         />
                            </View>
                       

                         }
                         onEndReached={()=>{this.setState({forYouOffset:this.state.forYouOffset+2},()=>{
                               this.forYou()
                         })}}
                         onEndReachedThreshold={0.1}
                         ListFooterComponent={this.footer()}
                       />
                   </View>
             </View>
                                  {/* CAROUSEL 2 */}

               <View style={{height:height*0.2,}}>
                    <SliderBox 
                   images={images} 
                   dotColor={themecolor}
                   imageLoadingColor={themecolor}
                   ImageComponentStyle={{height:"100%",width:"100%",resizeMode:"cover"}}
                   autoplay={true}
                   circleLoop={true}
                 />
               </View>

                                                    {/* VIEW ALL PRODUCTS */}
       
                                
             <View>
                   <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",padding:20}}>
                      <Text style={{fontWeight:"bold",textDecorationLine:'underline'}}>View All Products</Text>
                       <TouchableOpacity onPress={()=>{navigation.navigate("ViewAllProducts")}}>
                           <Text style={{color:"green",fontWeight:"bold"}}>VIEW ALL</Text>
                       </TouchableOpacity>
                   </View>
                   <View>
                       <FlatList
                         horizontal={true}
                         showsHorizontalScrollIndicator={false}
                         contentContainerStyle={{flexDirection:"row",marginHorizontal:10,}}
                         data={this.state.allProductsItem}
                         keyExtractor={(item,index)=>index.toString()}
                         renderItem={({item,index})=> 
                         <View>
                         <RenderItems
                            ref={(ref) => this.refs["allProducts"+index] = ref} 
                            setCounterAmount={(counter,totalAmount,saved)=>this.props.setCounterAmount(counter,totalAmount,saved)} 
                            product={item} 
                            key={index} 
                            cartLoaderShow={this.state.cartLoaderShow} 
                            index={index} 
                            openVariantSelection={(state)=>{this.openVariantSelection(state,'allProducts')}} 
                            selectedStore={this.state.selectedStore} 
                            cartItems={this.state.cartItems} 
                            onChange={ (args)=> this.updateCart(args)} 
                            navigation={this.props.navigation} 
                            userScreen={this.state.userScreen} 
                            store={this.state.store} 
                            modalVisible={(bool)=>{this.setModalVisible(bool)}}
                            select ={(product)=>{this.select(product)}} 
                           
                         />
                         </View>}


                         onEndReached={()=>{this.setState({allProductsOffset:this.state.allProductsOffset+2},()=>{
                               this.allProducts()
                         })}}
                         onEndReachedThreshold={0.1}
                         ListFooterComponent={this.footer()}
                       />
                   </View>
                           {
                             this.variantSelection()
                           }
             </View>
                                   {/* FOOTER */}
             <View style={{height:height*0.05,backgroundColor:themecolor,flexDirection:"row",alignItems:'center',justifyContent:'center'}}>
                 <View style={{flexDirection:'row',flex:0.6}}>
                   <View style={{flexDirection:'row',flex:0.5,alignItems:'center',justifyContent:"space-around"}}>
                         <Text style={{color:"#fff",fontWeight:'bold'}}>Connect</Text>
                         <TouchableOpacity 
                          onPress={()=>{
                            if(Platform.OS=="android"){
                              Linking.openURL(`tel:${this.state.appDetails?.mobile}`)
                            }else{
                              
                                 Linking.canOpenURL(`telprompt:${this.state.appDetails?.mobile}`)
                            }
                          }}
                         >
                              <Feather name="phone" size={24} color="#fff" />
                         </TouchableOpacity>
                       
                   </View>
                   <View style={{flex:0.5,alignItems:'center',justifyContent:'space-around',flexDirection:'row'}}>
                           <TouchableOpacity 
                             onPress={()=>{
                              let  urll = `sms:${this.state.appDetails?.mobile}${Platform.OS === "ios" ? "&" : "?"}body=${""}`

                                  Linking.openURL(urll);
                             }}
                           >
                             <MaterialIcons name="message" size={24} color="#fff" />
                           </TouchableOpacity>
                     <TouchableOpacity 
                      onPress={()=>{
                        Linking.openURL(`whatsapp://send?phone=${this.state.appDetails?.whatsappNo}`)
                      }}
                     >
                        <FontAwesome name="whatsapp" size={24} color="#fff" />
                       </TouchableOpacity>    
                   
                   </View>
                  
                 </View>
                 <View style={{flex:0.4}}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:"space-around"}}>
                      <Text style={{color:"#fff"}}>Follow</Text>
                      <TouchableOpacity 
                       onPress={()=>{
                           Linking.openURL(`${this.state.appDetails?.instagramLink}`)
                       }}
                      >
                         <AntDesign name="instagram" size={24} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                         onPress={()=>{
                           Linking.openURL(`${this.state.appDetails?.fbLink}`)
                       }}
                      >
                            <AntDesign name="facebook-square" size={24} color="#fff" />
                      </TouchableOpacity>
                      
                    </View>
                 </View>
             </View>
              </ScrollView>     
        </View>
    )
  }
    
}

const mapStateToProps =(state) => {
    return {
    counter: state.cartItems.counter,
    totalAmount: state.cartItems.totalAmount,
    cart : state.cartItems.cartItem,
    user : state.cartItems.user,
    store:state.cartItems.store,
    myStore:state.cartItems.myStore,
    storeType:state.cartItems.storeType,
    selectedStore:state.cartItems.selectedStore,
    selectedLandmark:state.cartItems.selectedLandmark,
    signedIn:state.cartItems.signedIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTocartFunction:  (args) => dispatch(actions.addToCart(args)),
    decreaseFromCartFunction:  (args) => dispatch(actions.decreaseFromCart(args)),
    increaseCartFunction:  (args) => dispatch(actions.increaseCart(args)),
    setInitialFunction:  (cart,counter,totalAmount) => dispatch(actions.setInitial(cart,counter,totalAmount)),
    removeItemFunction:  (args) => dispatch(actions.removeItem(args)),
    emptyCartFunction:()=>dispatch(actions.emptyCart()),
    setMyStoreFunction:(myStore,storeRole)=>dispatch(actions.setMyStore(myStore,storeRole)),
    removeMyStoreFunction:()=>dispatch(actions.removeMyStore()),
    setCounterAmount:  (counter,totalAmount,saved) => dispatch(actions.setCounterAmount(counter,totalAmount,saved)),
    setDeliveryMessage:  (msg) => dispatch(actions.setDeliveryMessage(msg)),
    setShareMessage:  (msg) => dispatch(actions.setShareMessage(msg)),
    setPlaystoreUrl:  (msg) => dispatch(actions.setPlaystoreUrl(msg)),
    setAppstoreUrl:  (msg) => dispatch(actions.setAppstoreUrl(msg)),
    signedInFunction:  (args) => dispatch(actions.signedIn(args)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);