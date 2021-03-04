import React, { Component } from 'react';
import { View, Text ,Dimensions,TouchableOpacity,AsyncStorage, ScrollView} from 'react-native';
import  Constants  from 'expo-constants';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themecolor
import settings from '../Appsettings';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import HttpsClient from '../helpers/HttpsClient'
const SERVER_URL = settings.url
 class CheckoutScreenNew extends Component {
      static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {header:null}
  };
  constructor(props) {
       console.log("calleddd")
    super(props);
    this.state = {
      defaultAddress:[]
    };
  }
getUserInfo=async()=>{
 
  const userToken = await AsyncStorage.getItem('userpk');
  const userDetails = await HttpsClient.get(SERVER_URL+'/api/HR/users/'+ userToken + '/')
  console.log(userDetails,"ghgh")
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
          
           this.setState({defaultAddress:filter})
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
  render() {
    return (
      <View style={{flex:1,marginTop:Constants.statusBarHeight}}>
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
                           
                         />
                         <TouchableOpacity style={{backgroundColor:"gray",height:height*0.05,alignItems:"center",justifyContent:"center",paddingHorizontal:width*0.08,borderRadius:13,marginLeft:-20}}>
                         
                            <Text style={{fontWeight:"bold",color:'#000'}}>APPLY</Text>
                         </TouchableOpacity>
                      
                  </View>

                  <View style={{paddingHorizontal:20,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                      <View style={{flexDirection:"row",}}>
                              <MaterialIcons name="local-offer" size={24} color="green" />
                             <Text style={{color:"green",paddingLeft:10}}>"sterling10"</Text>
                             <Text style={{paddingLeft:10}}>Coupon is Applied</Text>
                      </View>
                      <TouchableOpacity style={{}}>
                          <Text style={{textDecorationLine:"underline"}}>CHANGE</Text>
                      </TouchableOpacity>
                  </View>
                     
                                        {/* NOTES */}
                  <View style={{height:height*0.2,alignItems:'center',justifyContent:"center"}}>
                        <View style={{padding:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between",width}}>
                           <Text style={{color:'#000',fontWeight:"bold",}}>Delivery note</Text>
                           <TouchableOpacity>
                               <Text style={{color:'#000',fontWeight:"bold"}}>EDIT</Text>
                           </TouchableOpacity>
                        </View>
                        <View style={{padding: 10,width}}>
                            <Text>deliver good food </Text>
                        </View>
                        <View>

                        </View>
                  </View>

                                          {/* SUMMARY */}
                  <View style={{height:height*0.3,paddingVertical:10}}>
                        <View style={{padding:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <Text style={{color:'#000'}}>Subtotal</Text>
                            <Text style={{color:'#000'}}>₹120</Text>
                        </View>
                        <View style={{padding:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <Text style={{color:'#000'}}>PromoCode</Text>
                            <Text style={{color:'#000'}}>-₹20</Text>
                        </View>
                        <View style={{padding:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <Text style={{color:themeColor,fontWeight:"bold"}}>Free Delivery</Text>
                            <Text style={{color:themeColor}}>0</Text>
                        </View>
                         <View style={{padding:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <Text style={{color:'#000'}}>Total</Text>
                            <Text style={{color:'#000'}}>₹100</Text>
                        </View>
                          <View style={{padding:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <Text style={{color:'#000'}}>You Saved</Text>
                            <Text style={{color:'#000'}}>₹100</Text>
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
                                <Text style={{color:themeColor,fontWeight:"bold",textAlign:"center",fontSize:20}}>₹120</Text>
                         </View>    
                     </View>
                      <TouchableOpacity style={{flex:0.5,backgroundColor:themeColor,alignItems:"center",justifyContent:"center"}}
                        onPress={()=>{this.props.navigation.navigate('PaymentScreenNew')}}
                      >
                         
                                    <Text style={{color:"#fff",fontWeight:"bold",fontSize:20}}>Proceed</Text>
                         
                          
                     </TouchableOpacity>
                </View>
            </View>
      </View>
    );
  }
}

export default CheckoutScreenNew;