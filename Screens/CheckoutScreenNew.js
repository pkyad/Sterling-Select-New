import React, { Component } from 'react';
import { View, Text ,Dimensions,TouchableOpacity,AsyncStorage, ScrollView} from 'react-native';
import  Constants  from 'expo-constants';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themecolor
import settings from '../Appsettings';
import { AntDesign ,Entypo} from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import * as actionTypes from '../actions/actionTypes'
import HttpsClient from '../helpers/HttpsClient';
import Modal from "react-native-modal";
import Toast, {DURATION} from 'react-native-easy-toast';
const SERVER_URL = settings.url


 class CheckoutScreenNew extends Component {

      static navigationOptions = ({ navigation }) => {
     const { params = {} } = navigation.state
     return {header:null}

  };
  constructor(props) {
    super(props);
    this.state = {
      defaultAddress:[],
      coupon:"",
      modal:false,
      deliveryNote :null,
      shippingPrice:{},
      textInput : React.createRef()
    }
  }
getUserInfo=async()=>{
 
  const userToken = await AsyncStorage.getItem('userpk');
  const userDetails = await HttpsClient.get(SERVER_URL+'/api/HR/users/'+ userToken + '/')
  
}

  getAddress = async()=>{
      const pk = await AsyncStorage.getItem("Pk")
      const api = `${SERVER_URL}/api/POS/address/?user=${pk}`
      const address = await HttpsClient.get(api)
    
       if(address.type=="success"){
           this.setState({address:address.data,})

           const filter = address.data.filter((i)=>{
             return i.primary 
           })
          
           this.setState({defaultAddress:filter},()=>{
                  this.getShippingPrice();
           })
       }
      
  }
  getShippingPrice = async()=>{
      const api =`${SERVER_URL}/api/POS/getShippingPrice/?coupon=${this.state.coupon}&addressid=${this.state.defaultAddress[0].pk}`
      const price = await HttpsClient.get(api)
      if(price.type=="success"){
          this.setState({shippingPrice:price.data})
      }
  }
componentDidMount(){

  this.getUserInfo() 
  this.getAddress()

     this._unsubscribe = this.props.navigation.addListener('focus', () => {
                     this.setState({loader:true})
                    this.getAddress();
                  
              });
}
componentWillUnmount(){
  this._unsubscribe();
}
createOrder = async()=>{
  const api  =`${SERVER_URL}/api/POS/createOrder/`
  
  let sendData = {
       billingAddress:{
         street:'',
         city:'',
         state:'',
         pincode:0,
         country:'India',
         landMark:'',
       },
       mobile:null,
            address:{
         billingStreet:this.state.defaultAddress[0].billingStreet,
         billingCity:this.state.defaultAddress[0].billingCity,
         billingState:this.state.defaultAddress[0].billingState,
         billingPincode:this.state.defaultAddress[0].billingPincode,
         billingCountry:this.state.defaultAddress[0].billingCountry,
         billingLandMark:this.state.defaultAddress[0].billingLandMark,
         title:this.state.defaultAddress[0].title,
         primary:this.state.defaultAddress[0].primary,
         city:this.state.defaultAddress[0].city,
         country : this.state.defaultAddress[0].country,
         landMark:this.state.defaultAddress[0].landMark,
         mobileNo:this.state.defaultAddress[0].mobileNo,
         pincode:this.state.defaultAddress[0].pincode,
         sameAsShipping:this.state.defaultAddress[0].sameAsShipping,
         state:this.state.defaultAddress[0].state,
         street:this.state.defaultAddress[0].street,
         pk:this.state.defaultAddress[0].pk

       },
       modeOfPayment:"COD",
       modeOfShopping:"online",
       paidAmount:0,
       total:Math.round(this.props.totalAmount-this.state.shippingPrice.discountPrice+this.state.shippingPrice.shippingPrice),
       shippingPrice:this.state.shippingPrice.shippingPrice,
       
  
  }


       if(this.state.couponDiscount!=undefined&&this.state.couponDiscount!=null){
        sendData.coupon = this.state.couponDiscount.pk
     }

     let postOrder = await HttpsClient.post(api,sendData)
     console.log(postOrder,"gftu",api)
}
applyCoupon  =async()=>{
   const api = `${SERVER_URL}/api/POS/getShippingPrice/?coupon=${this.state.coupon}&addressid=${this.state.defaultAddress[0].pk}`
   let discount = await HttpsClient.get(api)
    if(discount.type="success"){
         if(discount.data.couponDiscount==undefined){
            this.refs.toast.show('Invalid Coupon Code')
         }
        this.setState({shippingPrice:discount.data,couponDiscount:discount.data.couponDiscount})
    }
}
removeCoupon = async()=>{
     const api = `${SERVER_URL}/api/POS/getShippingPrice/?coupon=""&addressid=${this.state.defaultAddress[0].pk}`
   let discount = await HttpsClient.get(api)
    if(discount.type="success"){
      this.refs.toast.show('coupon removed')
        this.setState({shippingPrice:discount.data,couponDiscount:discount.data.couponDiscount})
    }
}
  render() {
    return (
      <View style={{flex:1,marginTop:Constants.statusBarHeight}}>
          <Toast style={{backgroundColor: 'red'}}  textStyle={{color: '#fff'}} ref="toast" position = 'center'/>

                           {/* HEADERS */}


              <View style={{flexDirection:"row",height:height*0.1,backgroundColor:"#fff",elevation:5}}>
              
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

                            <View style={{height:10,backgroundColor:themeColor,width:30,marginLeft:-10}}>

                           </View>
                           <View style={{height:25,width:25,borderRadius:15,backgroundColor:themeColor,marginLeft:-10}}>
                              <Text style={{marginTop:height*0.035,width:width*0.2,marginLeft:-20,textAlign:"left"}}>Address</Text>  
                           </View>
                            <View style={{height:10,backgroundColor:themeColor,width:30,borderBottomRightRadius:5,marginLeft:-10,borderTopRightRadius:5}}>

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

           <View style={{flex: 0.93,}}>
                                 {/* Address */}
                 <ScrollView>
                    <View style={{height:height*0.3,}}>
                      <View style={{flexDirection:"row",padding:20,alignItems:"center",justifyContent:'space-between'}}>
                              <View style={{flexDirection:"row"}}>
                                    <FontAwesome name="send" size={24} color="green" />  
                                    <Text style={{marginLeft:10,fontWeight:"bold",color:"#000"}}>Deliver to</Text>
                              </View>
                              <TouchableOpacity onPress={()=>{this.props.navigation.navigate("AddressScreen")}}>
                                    <Text style={{fontWeight:"bold",color:'#000'}}>EDIT</Text>
                              </TouchableOpacity>
                              
                      </View>
                       <View style={{padding: 20,height:height*0.2}}>
                            {
                              this.state.defaultAddress.length>0?<View style={{flex:1}}>
                            <Text style={{color:'#000'}}>{this.state.defaultAddress[0].title}</Text>
                            <Text style={{color:'#000'}}>{this.state.defaultAddress[0].street}</Text>
                            <Text style={{}}>{this.state.defaultAddress[0].landMark}</Text>
                            <Text style={{}}>{this.state.defaultAddress[0].city} {this.state.defaultAddress[0].pincode}</Text>
                            <Text style={{}}>{this.state.defaultAddress[0].billingState} </Text>
                            <Text style={{}}>{this.state.defaultAddress[0].mobileNo} </Text>

                              </View>:<TouchableOpacity style={{padding: 20,height:height*0.2,alignItems:'center',justifyContent:'center'}}
                              onPress={()=>{this.props.navigation.navigate("AddressScreen")}}
                              >
                                   <Text style={{fontWeight:'bold',color:themeColor}}>SELECT AN ADDRESS +</Text>
                              </TouchableOpacity>
                            }
                       </View>
                  </View>

                                        {/* PROMO CODE */}
                  <View style={{height:height*0.1,alignItems:'center',justifyContent:"center",flexDirection:"row",}}>
                         <TextInput
                           style={{flex: 0.8,height:height*0.05,backgroundColor:"#fff",marginLeft:10,borderRadius:10,paddingLeft:10}}
                           placeholder="Enter PromoCode"
                           onChangeText={(coupon)=>{this.setState({coupon})}}
                           ref = {this.state.textInput}
                         />
                         <TouchableOpacity style={{backgroundColor:"gray",height:height*0.05,alignItems:"center",justifyContent:"center",paddingHorizontal:width*0.08,borderRadius:13,marginLeft:-20}}
                          onPress={()=>{this.applyCoupon()}}
                         >
                         
                            <Text style={{fontWeight:"bold",color:'#000'}}>APPLY</Text>
                         </TouchableOpacity>
                      
                  </View>

                 {this.state.couponDiscount?.pk&& <View style={{paddingHorizontal:20,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                      <View style={{flexDirection:"row",}}>
                              <MaterialIcons name="local-offer" size={24} color="green" />
                             <Text style={{color:"green",paddingLeft:10}}>"{this.state.coupon}"</Text>
                             <Text style={{paddingLeft:10}}>Coupon is Applied</Text>
                             <TouchableOpacity style={{marginLeft:10}}
                              onPress={()=>{this.removeCoupon()}}
                             >
                                  <Entypo name="circle-with-cross" size={24} color="red" />
                             </TouchableOpacity>
                              
                      </View>
                      <TouchableOpacity style={{}}
                        onPress={()=>{this.state.textInput.current.focus()}}
                      >
                          <Text style={{textDecorationLine:"underline"}}>CHANGE</Text>
                      </TouchableOpacity>
                  </View>}
                     
                                        {/* NOTES */}
                  <View style={{height:height*0.2,alignItems:'center',justifyContent:"center"}}>
                        <View style={{padding:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between",width}}>
                           <Text style={{color:'#000',fontWeight:"bold",}}>Delivery note</Text>
                           <TouchableOpacity 
                            onPress={()=>{this.setState({modal:true})}}
                           >
                               <Text style={{color:'#000',fontWeight:"bold"}}>EDIT</Text>
                           </TouchableOpacity>
                        </View>
                        <View style={{padding: 10,width}}>
                            <Text>{this.state.deliveryNote} </Text>
                        </View>
                        <View>

                        </View>
                  </View>

                                          {/* SUMMARY */}

                  <View style={{height:height*0.3,paddingVertical:10}}>
                        <View style={{padding:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <Text style={{color:'#000'}}>Subtotal</Text>
                            <Text style={{color:'#000'}}>₹{Math.round(this.props.totalAmount)}</Text>
                        </View>
                        <View style={{padding:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <Text style={{color:'#000'}}>PromoCode</Text>
                            <Text style={{color:'#000'}}>-{this.state.shippingPrice.discountPrice}</Text>
                        </View>
                       {this.state.shippingPrice.shippingPrice==0&&<View style={{padding:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <Text style={{color:themeColor,fontWeight:"bold"}}>Free Delivery</Text>
                            <Text style={{color:themeColor}}>₹{this.state.shippingPrice.shippingPrice}</Text>
                        </View>}
                      {this.state.shippingPrice.shippingPrice>0&&<View style={{padding:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <Text style={{color:"red",fontWeight:"bold"}}>Delivery charge</Text>
                            <Text style={{color:"red"}}>₹{this.state.shippingPrice.shippingPrice}</Text>
                        </View>}
                         <View style={{padding:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <Text style={{color:'#000'}}>Total</Text>
                            <Text style={{color:'#000'}}>₹{Math.round(this.props.totalAmount-this.state.shippingPrice.discountPrice+this.state.shippingPrice.shippingPrice)}</Text>
                        </View>
                          <View style={{padding:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <Text style={{color:'#000'}}>You Saved</Text>
                            <Text style={{color:'#000'}}>₹{Math.round(this.props.saved+this.state.shippingPrice.discountPrice)}</Text>
                        </View>
                  </View>



                     
          
                 </ScrollView>
              </View>  
            <View style={{flex:0.07,}}>
                     
                    <View style={{width:width,flex:1,flexDirection:"row",}}>
                     <View style={{flex:0.5,backgroundColor:"#eee"}}>
                         <View style={{}}>
                             <Text style={{color:themeColor,marginLeft:5}}>Total(incl of Taxes)</Text>
                         </View>
                         <View style={{flex: 1,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                                <Text style={{color:themeColor,fontWeight:"bold",textAlign:"center",fontSize:20}}>₹{Math.round(this.props.totalAmount-this.state.shippingPrice.discountPrice+this.state.shippingPrice.shippingPrice)}</Text>
                         </View>    
                     </View>
                      <TouchableOpacity style={{flex:0.5,backgroundColor:themeColor,alignItems:"center",justifyContent:"center"}}
                         onPress={()=>{this.props.navigation.navigate('PaymentScreenNew')}}
                        // onPress={()=>{this.createOrder()}}
                      >
                         
                                    <Text style={{color:"#fff",fontWeight:"bold",fontSize:20}}>Proceed</Text>
                         
                          
                     </TouchableOpacity>
                </View>
            </View>
            <Modal
             isVisible={this.state.modal}
             onBackdropPress={()=>{this.setState({modal:false})}}
            >
            <View style={{flex:1,alignItems:'center',justifyContent:'center',alignItems:'center',justifyContent:'center'}}>
                <View style={{height:height*0.25,backgroundColor:'#EEE',borderRadius:10,width:width*0.8,alignItems:'center',justifyContent:"space-around"}}>
                  <View>
                      <Text style={{color:'#000',fontWeight:'bold'}}>Delivery Note</Text>
                  </View>
                     <TextInput
                       style={{backgroundColor:"#D3D3D3",width:width*0.7,height:height*0.1,borderRadius:10,textAlign:'center'}}
                       placeholder="Add notes here"
                       selectionColor={themeColor}
                       autoFocus={true}
                       onChangeText={(text)=>{this.setState({deliveryNote:text})}}
                       value ={this.state.deliveryNote}
                     />
                     <TouchableOpacity style={{backgroundColor:themeColor,height:height*0.05,width:width*0.3,alignItems:'center',justifyContent:'center',borderRadius:5}}
                      onPress={()=>{this.setState({modal:false})}}
                     >
                         <Text style={{color:'#fff',fontWeight:"bold"}}>SUBMIT</Text>
                     </TouchableOpacity>
                </View>
                
            </View>

            </Modal>
      </View>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutScreenNew);