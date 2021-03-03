import React, { Component } from 'react'
import { Text, View ,Dimensions,AsyncStorage,ActivityIndicator} from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import  Constants  from 'expo-constants';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themecolor
import { Entypo } from '@expo/vector-icons';
import settings from '../Appsettings';
import NetInfo from '@react-native-community/netinfo';
import { TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native';
import { Image } from 'react-native';
import HttpsClient from '../helpers/HttpsClient';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import * as actionTypes from '../actions/actionTypes'
const SERVER_URL = settings.url


 class CheckoutProductsNew extends Component {
 static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state
    return {header:null}
   
  };
  constructor(props) {
      
    super(props);
       
    this.state = {
       cartItems : [],
       selectedStore:props.selectedStore,
       store:props.store,
       cartLoader:true,
    };
     willFocus = props.navigation.addListener(
      'willFocus',
        e => {
           this.getInitial() ;
           console.log("lisstsgghh")  
        }
      );
  }
getUnit=(type,value)=>{
    var unit =""
 if(value!=null){
   var newValue = value
   if (type == 'Litre') {
     unit = 'L'
     return newValue+' '+unit
   }else if (type == 'Millilitre') {
     if(newValue>=1000){
       unit = 'L'
       newValue = newValue/1000
       if(newValue % 1 != 0){
         newValue = (newValue/1000).toFixed(1)
       }
     }else{
       unit = 'ml'
     }
      return newValue+' '+unit
   }else if (type == 'Gram') {
     if(newValue>=1000){
       unit = 'kg'
       newValue = newValue/1000
       if(newValue % 1 != 0){
         newValue = (newValue/1000).toFixed(1)
       }
     }else{
       unit = 'gm'
     }
      return newValue+' '+unit
   }else if (type == 'Kilogram') {
     unit = 'kg'
      return newValue+' '+unit
   }else if (type == 'Quantity') {
     unit = 'Qty'
      return newValue+' '+unit
   }else{
     unit = type
      return unit+' '+newValue
   }
   return unit+' '+newValue
 }else{
   if (type == 'Litre') {
     unit = 'L'
   }else if (type == 'Millilitre') {
       unit = 'ml'
   }else if (type == 'Gram') {
     unit = 'gm'
   }else if (type == 'Kilogram') {
     unit = 'kg'
   }else if (type == 'Quantity') {
     unit = 'Qty'
   }else{
     unit = type
   }
   return unit
 }

}
  cartDataUpdate=async(obj,idx)=>{

 
  var sessionid =  await AsyncStorage.getItem('sessionid');
  var csrf = await AsyncStorage.getItem('csrf');
     console.log(obj.count,'jjjjjjjjjjjjjjjj');
      var data = {
        productVariant:obj.productVariant,
        store:obj.store,
        qty:obj.count
       }
       this.setState({cartLoader:true})
         fetch(SERVER_URL +'/api/POS/cartService/' , {
          method: 'POST',
          headers:{
            "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Referer': SERVER_URL,
            'X-CSRFToken': csrf
          },
          credentials: 'omit',
          body: JSON.stringify(data)
        })
          .then((response) => {
            console.log(response.status,'ptjhujthiop');
            if(response.status==201||response.status==200){
              return response.json()
            }else{
              return undefined
            }
          })
          .then((responseJson) => {
            this.setState({cartLoader:false,selectedIndex:null})
            console.log(responseJson,'ptjhujthiop');
              if(responseJson!=undefined){
              
                //this.getWaiverCharge()
                if(responseJson.msg.length>0){
                        
                  this.refs.toast.show(responseJson.msg)
                }
                obj.pk = responseJson.pk
                obj.count = responseJson.qty
                var cartItems = this.state.cartItems
                console.log(idx,'ttttttttttt');
                cartItems[idx].count = responseJson.qty
                console.log(cartItems[idx].count,'kkkkkkkkkkkkkkk');
                this.setState({cartItems:cartItems})
                if(responseJson.qty==0){
                  obj.type = 'delete'
                  cartItems.splice(idx,1)
                  this.setState({cartItems : cartItems})
                  this.props.removeItemFunction(obj)
                  this.props.setCounterAmount(responseJson.cartQtyTotal,responseJson.cartPriceTotal,responseJson.saved)
                  return
                }
                if(obj.type==actionTypes.INCREASE_CART){
                  this.props.increaseCartFunction(obj)
                }else{
                  this.props.decreaseFromCartFunction(obj);
                }
                this.props.setCounterAmount(responseJson.cartQtyTotal,responseJson.cartPriceTotal,responseJson.saved)

              }
          }).catch((err)=>{
            this.setState({cartLoader:false,selectedIndex:null})
          })


  }
     getInitial =async()=>{
            const pk =  await AsyncStorage.getItem('Pk');
           if(pk!=null){
                const cartdata = await HttpsClient.get(SERVER_URL + '/api/POS/getAllCart/?user='+pk+'&store='+this.state.selectedStore.pk)

            var count = 0
            if(cartdata.type=="success"){
                        var arr = cartdata.data.cartObj.map((item)=>{
                                if(item.productVariant.images.length>0){
                                    var image = '/media'+item.productVariant.images[0].attachment.split('/media')[1]
                                }else{
                                    var image = null
                                }
                        count += item.qty
                        var unit = this.getUnit(item.productVariant.unitType,item.productVariant.value)
                        var nameeDisplay = item.product.name
                        var obj = {nameDisplay:nameeDisplay,product:item.product.pk,productVariant:item.productVariant.pk,store:item.store,count:item.qty,type:'GET_CART',customizable:item.productVariant.customizable,taxRate:item.product.taxRate,sellingPrice:item.sellingPrice,mrp:item.productVariant.price,stock:item.productVariant.stock,discount:item.price-item.sellingPrice,maxQtyOrder:item.productVariant.maxQtyOrder,minQtyOrder:item.productVariant.minQtyOrder,dp:image,displayName:item.productVariant.displayName,user:pk,cart:item.pk,bulkChart:item.bulk,
                        discountedPrice:item.sellingPrice,totalPrice:item.price,addon:item.addon,customDetails:item.customDetails,customFile:item.customFile,is_fav:item.is_fav,is_changed:item.is_changed,taxPrice:item.taxPrice,addonPrice:item.addonPrice,bulkDiscount:item.bulkDiscount,promoValue:item.promoValue,qty:unit}
                        return obj
                    })
                   this.setState({cartItems:arr,cartLoader:false})
            }
           }else{
             return null
           }
            
            
         }
handleConnectivityChange = (state) => {
                if(state.isConnected){
                    this.setState({connectionStatus : true})
                }else{
                    this.setState({connectionStatus : false})
                }
};
        componentDidMount (){
                this.getInitial()
                  this.props.navigation.setParams({
                themeColor: this.state.store.themeColor,
                });
            this.setState({unsubscribe:NetInfo.addEventListener(state =>{
                this.handleConnectivityChange(state);
              })})
                this._unsubscribe = this.props.navigation.addListener('focus', () => {
                      this.getInitial()
              });
        }
   componentWillUnmount() {

       this._unsubscribe();
    }

  decreaseCart = (item,idx)=>{
    this.setState({selectedIndex:idx})
    if(!this.state.connectionStatus){
      this.showNoInternet()
      this.setState({disabled:false,selectedIndex:false,cartLoader:false})
      return
    }
    var decreaseObj = {productVariant:item.productVariant,store:item.store,count:item.count-1,type:actionTypes.DECREASE_FROM_CART,}
    this.cartDataUpdate(decreaseObj,idx)
 

  }
    increaseCart = (item,idx)=>{

    this.setState({selectedIndex:idx})
    if(!this.state.connectionStatus){
      this.showNoInternet()
      this.setState({disabled:false,selectedIndex:null,cartLoader:false})
      return
    }
    var increaseObj = {productVariant:item.productVariant,store:item.store,count:item.count+1,type:actionTypes.INCREASE_CART,}
    this.cartDataUpdate(increaseObj,idx)
    return
 

  }
    removeItem = (item,idx)=>{
    if(!this.state.connectionStatus){
      this.showNoInternet()
      this.setState({selectedIndex:null,cartLoader:false})
      return
    }
    var decreaseObj = {productVariant:item.productVariant,store:item.store,count:0,type:'delete',}
    this.cartDataUpdate(decreaseObj,idx)
    // this.removeCart(item,idx)

  }
  items =()=>{
      return(
          <FlatList
            data={this.state.cartItems}
             keyExtractor={(item,index)=>index.toString()}

             renderItem={({item,index})=>{
                 
                  return(
                      <View style={{height:height*0.14,margin:15,backgroundColor:'#fff',elevation:5,borderRadius:8,}}>
                          <TouchableOpacity style={{alignSelf:"flex-end",marginTop:-10}}
                           onPress={()=>this.removeItem(item,index)}
                          >
                                <Entypo name="circle-with-cross" size={24} color="gray" />
                          </TouchableOpacity>
                            <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                                <View style={{flex: 0.2,marginLeft:5}}>
                                    <Image source={{uri:`${SERVER_URL}${item.dp}`}} style={{height:height*0.1,width:"100%",}}/>
                                 </View>
                             <View  style={{flex: 0.8,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                                <View style={{flex:0.7,alignItems:"flex-start",justifyContent:"center"}}>
                                    <Text>{item.nameDisplay}</Text>
                                    <Text>{item.qty}</Text>
                                    
                                   <View style={{flexDirection:"row"}}>
                                        <Text style={{color:themeColor,textAlign:"center"}}>₹{Math.round(item.sellingPrice)}</Text>
                                        <Text style={{marginLeft:10,textDecorationLine:'line-through'}}>₹{item.mrp}</Text>
                                    </View>
                                    
                                </View>
                                <View style={{borderColor:"#000",borderWidth:1,borderRadius:10,height:height*0.04,width:width*0.2,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                                    <TouchableOpacity style={{alignItems:"center",justifyContent:"center"}}
                                    onPress={()=>{this.decreaseCart(item,index )}}
                                    >
                                            <Text style={{color:"#000",fontWeight:"bold",fontSize:30,textAlign:"center"}}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={{color:themeColor,fontWeight:'bold'}}>{item.count}</Text>
                                    <TouchableOpacity style={{alignItems:"center",justifyContent:"center"}}
                                    onPress={()=>this.increaseCart(item,index)}
                                    >
                                                  <Text style={{color:"#000",fontWeight:"bold",fontSize:20,textAlign:"center"}}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            </View>
                           
                      </View>
                  )
             }}
          />
      )
  }
    render() {
        return (
            <View style={{marginTop:Constants.statusBarHeight,flex:1}}>


                            {/* HEADERS */}


              <View style={{flexDirection:"row",height:height*0.1,backgroundColor:"#fff",elevation:5}}
              >
              
                  <TouchableOpacity style={{flex:0.2,alignItems:"center",justifyContent:"center",}}
                  onPress={()=>{this.props.navigation.goBack()}}
                  >
                        <AntDesign name="arrowleft" size={24} color={themeColor} />
                  </TouchableOpacity>
                  <View style={{flex:0.8,alignItems:"center",justifyContent:'center',flexDirection:"row"}}>
                 
                       <View style={{height:10,backgroundColor:"#eee",borderRadius:5,flex: 0.7,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                           <View style={{height:10,backgroundColor:themeColor,width:30,borderTopLeftRadius:5,borderBottomLeftRadius:5}}>

                           </View>
                           <View style={{height:25,width:25,borderRadius:15,backgroundColor:themeColor,marginLeft:-10}}>
                              <Text style={{marginTop:height*0.035,width:width*0.1,marginLeft:-5,textAlign:"center"}}>cart</Text>  
                           </View>
                            <View style={{height:10,backgroundColor:themeColor,width:30,borderBottomRightRadius:5,marginLeft:-10,borderTopRightRadius:5}}>

                           </View>

                            <View style={{height:10,backgroundColor:"#eee",width:30,borderTopLeftRadius:5,borderBottomLeftRadius:5}}>

                           </View>
                           <View style={{height:25,width:25,borderRadius:15,backgroundColor:'#eee',marginLeft:-10}}>
                              <Text style={{marginTop:height*0.035,width:width*0.2,marginLeft:-20,textAlign:"left"}}>Address</Text>  
                           </View>
                            <View style={{height:10,backgroundColor:'#eee',width:30,borderBottomRightRadius:5,marginLeft:-10,borderTopRightRadius:5}}>

                           </View>
                            <View style={{height:10,backgroundColor:'#eee',width:30,borderTopLeftRadius:5,borderBottomLeftRadius:5}}>

                           </View>
                           <View style={{height:25,width:25,borderRadius:15,backgroundColor:'#eee',marginLeft:-10}}>
                              <Text style={{marginTop:height*0.035,width:width*0.2,marginLeft:-20,textAlign:"center"}}>payment</Text>  
                           </View>
                            <View style={{height:10,backgroundColor:'#eee',width:30,borderBottomRightRadius:5,marginLeft:-10,borderTopRightRadius:5}}>

                           </View>
                       </View>
                      
                  </View>
               
                    
              </View> 

              <View style={{flex:1,}}>
                              {/* ITEMS */}
                  <View style={{flex:0.93,}}>
                        {!this.state.cartLoader&&this.items()}  
                         {this.state.cartLoader&&
                            <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                              <ActivityIndicator size={40} color={themeColor} />
                            </View>
                          }  
                  </View>

                                         {/* BOTTOM */}
                <View style={{height:height*0.1,width:width,flex:0.07,flexDirection:"row",elevation:5}}>
                     <View style={{flex:0.5,backgroundColor:"#eee"}}>
                         <View style={{}}>
                             <Text style={{color:themeColor,marginLeft:5,fontWeight:"bold",fontSize:12}}>Total(incl of Taxes)</Text>
                         </View>
                         <View style={{flex: 1,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                                <Text style={{color:themeColor,fontWeight:"bold",textAlign:"center",fontSize:20}}>₹{Math.round(this.props.totalAmount)}</Text>
                         </View>    
                     </View>
                      <TouchableOpacity style={{flex:0.5,backgroundColor:themeColor,alignItems:"center",justifyContent:"center"}}
                        onPress={()=>{this.props.navigation.navigate('CheckoutScreenNew')}}
                      >
                         
                                    <Text style={{color:"#fff",fontWeight:"bold",fontSize:20}}>Proceed</Text>
                         
                          
                     </TouchableOpacity>
                </View>
               </View>     
               
            </View>
        )
    }
}

const mapStateToProps =(state) => {
    return {
    counter: state.cartItems.counter,
    cart : state.cartItems.cartItem,
    totalAmount:state.cartItems.totalAmount,
    saved:state.cartItems.saved,
    selectedAddress : state.cartItems.selectedAddress,
    store:state.cartItems.store,
    selectedLandmark:state.cartItems.selectedLandmark,
    selectedStore:state.cartItems.selectedStore,
    masterStore:state.cartItems.masterStore,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    decreaseFromCartFunction:  (args) => dispatch(actions.decreaseFromCart(args)),
    increaseCartFunction:  (args) => dispatch(actions.increaseCart(args)),
    removeItemFunction:  (args) => dispatch(actions.removeItem(args)),
    emptyCartFunction:()=>dispatch(actions.emptyCart()),
    selectedAddressFunction:(address)=>dispatch(actions.selectedAddress(address)),
    setCounterAmount:  (counter,totalAmount,saved) => dispatch(actions.setCounterAmount(counter,totalAmount,saved)),

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutProductsNew);
