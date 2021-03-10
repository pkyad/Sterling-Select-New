import React ,{useEffect, useState,Component} from 'react';
import { TextInput,View, Text, TouchableOpacity ,Dimensions,Image, FlatList,ActivityIndicator, AsyncStorage} from 'react-native';
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
import Toast, {DURATION} from 'react-native-easy-toast';
import RenderItems from './RenderItems';
import Modal from "react-native-modal";
import SingleProduct from '../components/SingleProduct';
const themecolor = settings.themecolor
const url = settings.url
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

 class productInfo extends Component {
  constructor(props) {
    super(props);

 
    this.state = {
        productDetails:null,
        images:[],
        similarProducts:[],
        cartItems :this.props.cart,
        cartLoaderShow:false,
        cartLoaderShow2:false,
        modalVisible:false,
        selectedProduct:null,
        variantShow:false,
        selectedStore:this.props.selectedStore,
        productLoading:true,
        modal:false,
        
    };
  }

                     
  

getDetails =async(pk)=>{
  let data =  await HttpClient.get(`${url}/api/POS/productDetail/${pk}/`)
  
  if(data.type=="success"){
      this.setState({productDetails:data.data.product,similarProducts:data.data.similar_products,productLoading:false,broughtTogether:data.data.brought_together},()=>{
          
      })
        let images =[]

      data.data.product.variant[0].images.forEach((i)=>{
           images.push(`${url}${i.attachment}`)
      })
     this.setState({images})
    
  }
  console.log(`${url}/api/POS/productDetails/${pk}/`)
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
  
 componentDidMount(){
 
  this.getDetails(this.props.route.params.pk)
  this.getServiceCart()
  }
   openVariantSelection=(variants,type)=>{
    //  console.log(variants,'gjhjhjkjk');
    this.setState({selectionType:type,selectedProduct:variants,variantShow:true})
  }
  reviewModal =()=>{
    return(
           <Modal
             isVisible={this.state.modal}
             onBackdropPress={()=>{this.setState({modal:false})}}
            >
            <View style={{flex:1,alignItems:'center',justifyContent:'center',alignItems:'center',justifyContent:'center'}}>
                <View style={{height:height*0.25,backgroundColor:'#EEE',borderRadius:10,width:width*0.8,alignItems:'center',justifyContent:"space-around"}}>
                  <View>
                      <Text style={{color:'#000',fontWeight:'bold'}}>Add Review</Text>
                  </View>
                     <TextInput
                       style={{backgroundColor:"#D3D3D3",width:width*0.7,height:height*0.1,borderRadius:10,textAlign:'center'}}
                       placeholder="Add notes here"
                       selectionColor={themecolor}
                       autoFocus={true}
                       onChangeText={(text)=>{this.setState({deliveryNote:text})}}
                       value ={this.state.deliveryNote}
                     />
                     <TouchableOpacity style={{backgroundColor:themecolor,height:height*0.05,width:width*0.3,alignItems:'center',justifyContent:'center',borderRadius:5}}
                      onPress={()=>{this.setState({modal:false})}}
                     >
                         <Text style={{color:'#fff',fontWeight:"bold"}}>SUBMIT</Text>
                     </TouchableOpacity>
                </View>
                
            </View>

            </Modal>
    )
  }
   footer =()=>{
     if(this.state.productLoading){
              return(
              <View style={{alignItems:"center",justifyContent:"center",height:height*0.3}}>
                <ActivityIndicator size="large" color={themecolor} />
              </View>
          )
     }else{
       return null
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
      if(this.state.selectionType=='similar products'){
        this.refs["similar products"+id].dropDownChanged(name,index)
      }else if(this.state.selectionType=='brought Together'){
        this.refs['brought Together'+id].dropDownChanged(name,index)
      }
      else if(this.state.selectionType=='single'){
        this.refs['single'+id].dropDownChanged(name,index)
      }
    }

      return(
        <Modal isVisible={this.state.variantShow} propagateSwipe={true}  animationIn="fadeIn" useNativeDriver={true} animationOut="fadeOut" hasBackdrop={true} useNativeDriver={true} propagateSwipe={true} onRequestClose={()=>this.setState({variantShow:false,selectedProduct:null})} onBackdropPress={()=>{this.setState({variantShow:false,selectedProduct:null})}} >
         {this.state.selectedProduct!=null&&
           <View style={{alignItems:"center",justifyContent:"center",backgroundColor:"#fff",height:height*0.3,borderRadius:10}}>
                
                  <Text style={{marginTop:15}}>Available Quantities for</Text>
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
  
  render() {
      const{product} =this.state
      const{navigation} =this.props
    return (
      <View style={{flex:1}}>
          <Toast style={{backgroundColor: 'red'}}  textStyle={{color: '#fff'}} ref="toast" position = 'center'/>

                 {/* HEADERS */}
             <View style={{marginTop:Constants.statusBarHeight,height:height*0.07,backgroundColor:themecolor,alignItems:'center',flexDirection:"row"}}>
                   <TouchableOpacity style={{marginLeft:15,flex: 0.17,}}
                    onPress={()=>{navigation.goBack()}}
                   >
                       <Ionicons name="md-arrow-back" size={24} color="#fff" />
                    </TouchableOpacity> 
                    <View style={{flex:0.6,alignItems:'center'}}>
                         <Text style={{color:"#fff",fontWeight:"bold",fontSize:18}} numberOfLines={1}>{this.state.productDetails?.name}</Text>
                    </View>
                    <View style={{}}>

                    </View>
             </View>  
             <ScrollView>
                    {/* SLIDES */}
                       <View style={{height:height*0.3,}}>
                 <SliderBox 
                   images={this.state.images} 
                   dotColor={themecolor}
                   imageLoadingColor={themecolor}
                   ImageComponentStyle={{height:"100%",width:"100%",resizeMode:"cover"}}
                   autoplay={true}
                   circleLoop={true}
                 />
                
             </View>
                     {/* DESCRIPTION */}
                  <View>
                        <View>
                             <Text style={{fontWeight:"bold",fontSize:20,color:"#000",marginLeft:20}}>{this.state.productDetails?.name}</Text>
                        </View>
                        <View style={{padding: 10,}}>
                            <Text>{this.state.productDetails?.description}</Text> 
                        </View>
                  </View>
                        {/* CART ACTION */}
                 { this.state.productDetails!=null&&<SingleProduct 
                          ref={(ref) => {this.refs['single'+1] = ref}} 
                            setCounterAmount={(counter,totalAmount,saved)=>this.props.setCounterAmount(counter,totalAmount,saved)} 
                            product={this.state.productDetails} 
                
                            cartLoaderShow={this.state.cartLoaderShow} 
                            index={1} 
                            openVariantSelection={(state)=>{this.openVariantSelection(state,'single')}} 
                            selectedStore={this.state.selectedStore} 
                            cartItems={this.state.cartItems} 
                            onChange={ (args)=> this.updateCart(args)} 
                            navigation={this.props.navigation} 
                            userScreen={this.state.userScreen} 
                            store={this.state.store} 
                            modalVisible={(bool)=>{this.setModalVisible(bool)}}
                            select ={(product)=>{this.select(product)}} 
                        
                        />}
                  {/* <View style={{height:height*0.2,alignItems:'center',justifyContent:"center"}}>
                       <View style={{flex:0.33,alignItems:"center",justifyContent:'center'}}>
                           <Text style={{color:"green",fontWeight:"bold"}}>Selling Price</Text>
                       </View>
                       <View style={{flex:0.33,flexDirection:"row",alignItems:"center",justifyContent:'center'}}>
                            <View style={{flex:0.33,alignItems:"center",justifyContent:"center"}}>
                                <Text>jjj</Text>
                            </View>
                            <View style={{flex:0.33,alignItems:"center",justifyContent:"center"}}>
                               <Text style={{color:themecolor,fontWeight:"bold",fontSize:30}}>₹{this.state.productDetails.sellingPrice}</Text>
                            </View>
                            <View style={{flex:0.33,alignItems:"center",justifyContent:"center"}}>
                               <Text style={{color:"gray",fontWeight:"bold",fontSize:20,textDecorationLine:"line-through"}}>₹{this.state.productDetails.price}</Text>
                                
                            </View>
                       </View>
                       <View style={{flex:0.33,alignItems:"center",justifyContent:"center"}}>
                           <TouchableOpacity style={{borderColor:'gray',borderWidth:2,flexDirection:"row",width:width*0.5,height:height*0.05,alignItems:"center",justifyContent:"center",borderRadius:20}}>
                                  <Text>ADD TO</Text>
                            <Feather name="shopping-cart" size={24} color="gray" style={{marginRight:10}}/>

                           </TouchableOpacity>
                       </View>
                  </View>       */}

                               {/* SIMILAR PRODUCTS */}
                   <View style={{padding: 10,}}>
                       <Text style={{color:"#000",textDecorationLine:'underline',fontWeight:"bold"}}>Similar Products</Text>
                    </View>  
                        <FlatList
                         horizontal={true}
                         showsHorizontalScrollIndicator={false}
                         contentContainerStyle={{flexDirection:"row",marginHorizontal:10,}}
                         data={this.state.similarProducts}
                         keyExtractor={(item,index)=>index.toString()}
                         renderItem={({item,index})=> 
                 
                           <RenderItems 
                            ref={(ref) => {this.refs['similar products'+index] = ref}} 
                            setCounterAmount={(counter,totalAmount,saved)=>this.props.setCounterAmount(counter,totalAmount,saved)} 
                            product={item} 
                            key={index} 
                            cartLoaderShow={this.state.cartLoaderShow} 
                            index={index} 
                            openVariantSelection={(state)=>{this.openVariantSelection(state,'similar products')}} 
                            selectedStore={this.state.selectedStore} 
                            cartItems={this.state.cartItems} 
                            onChange={ (args)=> this.updateCart(args)} 
                            navigation={this.props.navigation} 
                            userScreen={this.state.userScreen} 
                            store={this.state.store} 
                            modalVisible={(bool)=>{this.setModalVisible(bool)}}
                            select ={(product)=>{this.select(product)}} 
                            
                         />
                      
                         
                        }
                        
                         ListFooterComponent={this.footer()}
                       />

                                        {/*BROUGHT TOGTHER   */}
                    <View style={{padding: 10,}}>
                       <Text style={{color:"#000",textDecorationLine:'underline',fontWeight:"bold"}}>Brought together (Recommended)</Text>
                    </View> 
                    <FlatList
                         horizontal={true}
                         showsHorizontalScrollIndicator={false}
                         contentContainerStyle={{flexDirection:"row",marginHorizontal:10,}}
                         data={this.state.broughtTogether}
                         keyExtractor={(item,index)=>index.toString()}
                         renderItem={({item,index})=> 
                 
                           <RenderItems 
                            ref={(ref) => {this.refs['brought Together'+index] = ref}} 
                            setCounterAmount={(counter,totalAmount,saved)=>this.props.setCounterAmount(counter,totalAmount,saved)} 
                            product={item} 
                            key={index} 
                            cartLoaderShow={this.state.cartLoaderShow} 
                            index={index} 
                            openVariantSelection={(state)=>{this.openVariantSelection(state,'brought Together')}} 
                            selectedStore={this.state.selectedStore} 
                            cartItems={this.state.cartItems} 
                            onChange={ (args)=> this.updateCart(args)} 
                            navigation={this.props.navigation} 
                            userScreen={this.state.userScreen} 
                            store={this.state.store} 
                            modalVisible={(bool)=>{this.setModalVisible(bool)}}
                            select ={(product)=>{this.select(product)}} 
                            
                         />
                      
                         
                        }
                        
                         ListFooterComponent={this.footer()}
                       /> 

                                {/* RECIPES */}
                    <View style={{height:height*0.15,marginTop:10,backgroundColor:"#fff"}}>
                      <View style={{padding: 10,}}>
                      <Text style={{color:"#000",fontWeight:"bold"}}>Recipes(includeds)</Text>
                         
                      </View>
                         
                    </View >
                              {/* REVIEWS */}
                      <View style={{height:height*0.15,backgroundColor:"#fff"}}>
                           <View style={{padding: 10,alignItems:'center',justifyContent:'space-between',flexDirection:"row"}}>
                      <Text style={{color:"#000",fontWeight:"bold"}}>Reviews</Text>
                      <TouchableOpacity 
                        onPress={()=>{this.setState({modal:true})}}
                      >
                      <Text style={{color:"#000",fontWeight:"bold"}}>+ Add</Text>
                          
                      </TouchableOpacity>
                         
                      </View>
                      </View>
             </ScrollView> 
                    {
                      this.variantSelection()
                    }  
                    {
                      this.reviewModal()
                    }
      </View>
    );
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
export default connect(mapStateToProps, mapDispatchToProps)(productInfo);
