
import React, { Component ,} from 'react';
import { View, Text ,Dimensions,TouchableOpacity,ScrollView} from 'react-native';
import  Constants  from 'expo-constants';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themecolor
import settings from '../Appsettings';
import { AntDesign ,MaterialCommunityIcons} from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default class PaymentScreenNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{flex:1,}}>
                      
                         {/* HEADERS */}
              <View style={{flexDirection:"row",height:height*0.1,backgroundColor:"#fff",marginTop:Constants.statusBarHeight}}>
              
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
                            <View style={{height:10,backgroundColor:themeColor,width:30,borderBottomRightRadius:5,marginLeft:-10,borderTopRightRadius:5}}>

                           </View>
                           <View style={{height:25,width:25,borderRadius:15,backgroundColor:themeColor,marginLeft:-10}}>
                              <Text style={{marginTop:height*0.035,width:width*0.2,marginLeft:-20,textAlign:"center"}}>payment</Text>  
                           </View>
                            <View style={{height:10,backgroundColor:themeColor,width:30,borderBottomRightRadius:5,marginLeft:-10,borderTopRightRadius:5}}>

                           </View>
                       </View>
                      
                  </View>
               
                    
              </View>    

                           {/* PAYMENTS */}

               <ScrollView>
                                   {/* FREQUENTLY USED */}
                   <View style={{height:height*0.06,backgroundColor:"gray",justifyContent:'center',}}>
                       <Text style={{marginLeft:20,fontWeight:"bold"}}>Frequently Used</Text>
                   </View>
                   <View style={{height:height*0.13,}}>
                      <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",flex:0.5}}>
                          <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image 
                                 source={require('../assets/images/visa.png')}
                                 style={{height:"70%",width:"70%",resizeMode:'contain'}}
                               />
                          </View>
                          <View style={{flex:0.6}}>
                              <Text style={{marginLeft:20}}>67585666756</Text>  
                          </View>
                          <View style={{flex:0.2}}>
                               <Entypo name="chevron-right" size={24} color="black" style={{marginLeft:20}} />
                          </View>
                      </View>
                         <TouchableOpacity style={{flexDirection:"row",flex:0.5,alignItems:"center",paddingHorizontal:20}}>
                       <Feather name="plus-square" size={24} color={themeColor} />
                         <Text style={{color:themeColor,marginLeft:10}}>Add Credit /Debit Card</Text>
                      </TouchableOpacity>
                   </View>
                  
                                    {/* FOOD CARDS */}
                   <View style={{height:height*0.06,backgroundColor:"gray",justifyContent:'center',}}>
                       <Text style={{marginLeft:20,fontWeight:"bold"}}>Food cards</Text>
                   </View>
                      <View style={{height:height*0.13,}}>
                      <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",flex:0.5}}>
                          <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image 
                                 source={require('../assets/images/sodexo.png')}
                                 style={{height:"70%",width:"70%",resizeMode:'contain'}}
                               />
                          </View>
                          <View style={{flex:0.6}}>
                              <Text style={{marginLeft:20}}>67585666756</Text>  
                          </View>
                          <View style={{flex:0.2}}>
                               <Entypo name="chevron-right" size={24} color="black" style={{marginLeft:20}} />
                          </View>
                      </View>
                         <TouchableOpacity style={{flexDirection:"row",flex:0.5,alignItems:"center",paddingHorizontal:20}}>
                       <Feather name="plus-square" size={24} color={themeColor} />
                         <Text style={{color:themeColor,marginLeft:10}}>Add new Food Card</Text>
                      </TouchableOpacity>
                   </View>    

                                         {/*UPI  */}
                    <View style={{height:height*0.06,backgroundColor:"gray",justifyContent:'center',}}>
                       <Text style={{marginLeft:20,fontWeight:"bold"}}>UPI</Text>
                   </View>  
                      <View style={{height:height*0.3,}}>
                      <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",flex:0.5}}>
                          <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image 
                                 source={require('../assets/images/phonepe.png')}
                                 style={{height:"70%",width:"70%",resizeMode:'contain'}}
                               />
                          </View>
                          <View style={{flex:0.6}}>
                              <Text style={{marginLeft:20}}></Text>  
                          </View>
                          <View style={{flex:0.2}}>
                               <Entypo name="chevron-right" size={24} color="black" style={{marginLeft:20}} />
                          </View>
                      </View>
                         <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",flex:0.5}}>
                          <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image 
                                 source={require('../assets/images/sodexo.png')}
                                 style={{height:"70%",width:"70%",resizeMode:'contain'}}
                               />
                          </View>
                          <View style={{flex:0.6}}>
                              <Text style={{marginLeft:20}}></Text>  
                          </View>
                          <View style={{flex:0.2}}>
                               <Entypo name="chevron-right" size={24} color="black" style={{marginLeft:20}} />
                          </View>
                      </View>
                           <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",flex:0.5}}>
                          <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image 
                                 source={require('../assets/images/sodexo.png')}
                                 style={{height:"70%",width:"70%",resizeMode:'contain'}}
                               />
                          </View>
                          <View style={{flex:0.6}}>
                              <Text style={{marginLeft:20}}>XXXXX@sbi</Text>  
                          </View>
                          <View style={{flex:0.2}}>
                               <Entypo name="chevron-right" size={24} color="black" style={{marginLeft:20}} />
                          </View>
                      </View>
                         <TouchableOpacity style={{flexDirection:"row",flex:0.5,alignItems:"center",paddingHorizontal:20}}>
                       <Feather name="plus-square" size={24} color={themeColor} />
                         <Text style={{color:themeColor,marginLeft:10}}>Add new UPI ID</Text>
                      </TouchableOpacity>
                   </View> 

                                        {/* WAllet */}
                    <View style={{height:height*0.06,backgroundColor:"gray",justifyContent:'center',}}>
                       <Text style={{marginLeft:20,fontWeight:"bold"}}>Wallet</Text>
                   </View>
                      <View style={{height:height*0.15,}}>
                      <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",flex:0.5}}>
                          <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image 
                                 source={require('../assets/images/paytm.png')}
                                 style={{height:"70%",width:"70%",resizeMode:'contain'}}
                               />
                          </View>
                          <View style={{flex:0.5}}>
                              <Text style={{marginLeft:20}}></Text>  
                          </View>
                          <View style={{flex:0.3}}>
                                 <Text style={{color:themeColor,fontWeight:"bold"}}>LINK ACCOUNT</Text>
                          </View>
                      </View>
                         <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",flex:0.5}}>
                          <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image 
                                 source={require('../assets/images/phonepe.png')}
                                 style={{height:"70%",width:"70%",resizeMode:'contain'}}
                               />
                          </View>
                          <View style={{flex:0.5}}>
                              <Text style={{marginLeft:20}}></Text>  
                          </View>
                          <View style={{flex:0.3}}>
                               <Text style={{color:themeColor,fontWeight:"bold"}}>LINK ACCOUNT</Text>
                          </View>
                      </View>
                   </View>

                                          {/*cards  */}
                   <View style={{height:height*0.06,backgroundColor:"gray",justifyContent:'center',}}>
                       <Text style={{marginLeft:20,fontWeight:"bold"}}>Credit/Debit cards</Text>
                   </View>
                   <View style={{height:height*0.13,}}>
                      <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",flex:0.5}}>
                          <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image 
                                 source={require('../assets/images/visa.png')}
                                 style={{height:"70%",width:"70%",resizeMode:'contain'}}
                               />
                          </View>
                          <View style={{flex:0.6}}>
                              <Text style={{marginLeft:20}}>67585666756</Text>  
                          </View>
                          <View style={{flex:0.2}}>
                               <Entypo name="chevron-right" size={24} color="black" style={{marginLeft:20}} />
                          </View>
                      </View>
                         <TouchableOpacity style={{flexDirection:"row",flex:0.5,alignItems:"center",paddingHorizontal:20}}>
                       <Feather name="plus-square" size={24} color={themeColor} />
                         <Text style={{color:themeColor,marginLeft:10}}>Add Credit /Debit Card</Text>
                      </TouchableOpacity>
                   </View>
                    
                                       {/* Net banking */}
                   <View style={{height:height*0.06,backgroundColor:"gray",justifyContent:'center',}}>
                       <Text style={{marginLeft:20,fontWeight:"bold"}}>Net Banking</Text>
                   </View>
                    <View style={{height:height*0.13,}}>
                      <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",flex:0.5}}>
                          <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image 
                                 source={require('../assets/images/visa.png')}
                                 style={{height:"70%",width:"70%",resizeMode:'contain'}}
                               />
                          </View>
                          
                      </View>
                         <TouchableOpacity style={{flexDirection:"row",flex:0.5,alignItems:"center",paddingHorizontal:20}}>
                          <View style={{flex:0.8}}>
                             <Text style={{color:themeColor,marginLeft:10}}>more banks</Text>
                          </View>
                          <View style={{flex:0.2}}>
                               <Entypo name="chevron-right" size={24} color="black" style={{marginLeft:20}} />

                          </View>
                      </TouchableOpacity>
                   </View>

                             {/* Pay on Delivery */}
                    <View style={{height:height*0.06,backgroundColor:"gray",justifyContent:'center',}}>
                       <Text style={{marginLeft:20,fontWeight:"bold"}}>Pay on Delivey</Text>
                   </View>
                     <View style={{height:height*0.13,}}>
                      <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",flex:1}}>
                          <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <MaterialCommunityIcons name="cash" size={50} color="green" />
                          </View>
                          <View style={{flex:0.6}}>
                              <Text style={{marginLeft:20,color:'#000',fontWeight:"bold"}}>CASH/UPI</Text>  
                              <Text style={{marginLeft:20,fontSize:10}}>online payment recommended to reduce contact</Text>  
                          </View>
                          <View style={{flex:0.2}}>
                               <Entypo name="chevron-right" size={24} color="black" style={{marginLeft:20}} />
                          </View>
                      </View>
                     
                   </View>
               </ScrollView>
      </View>
    );
  }
}
