import React, { Component ,} from 'react';
import { View, Text ,Dimensions,TouchableOpacity,ScrollView} from 'react-native';
import  Constants  from 'expo-constants';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themecolor
import settings from '../Appsettings';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
export default class PaymentScreenNew extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {header:null}
  };
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{marginTop:Constants.statusBarHeight,flex:1}}>
                       {/* HEADERS */}


              <View style={{flexDirection:"row",height:height*0.1,backgroundColor:"#fff",}}>
              
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

            <ScrollView style={{marginTop:height*0.05}}>

                                         {/* FREQUENTLY USED */}
                     <View>
                        <View style={{backgroundColor:'#eee',height:height*0.06,justifyContent:"center",}}>
                            <Text style={{marginLeft:10,fontWeight:'bold'}}>Frequently used</Text>

                         </View>
                        <View style={{flexDirection:"row",marginVertical:10}}>
                            <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image  source={{uri:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png"}} style={{height:30,width:30,resizeMode:'stretch'}}/>
                            </View>
                            <View style={{flex:0.8,alignItems:"center",justifyContent:"space-between",flexDirection:"row",paddingHorizontal:10}}>
                                <Text>677867867845767</Text>
                                 <Entypo name="chevron-right" size={24} color="black" />
                            </View>
                        </View>
                        <TouchableOpacity style={{flexDirection:"row",alignItems:"center",padding: 10,}}>
                                <Feather name="plus-square" size={24} color={themeColor} />
                                <Text style={{color:themeColor,marginLeft:10}}>Add Credit /Debit Card</Text>
                        </TouchableOpacity>
                     </View>                    
                   
                                {/* Food Cards */}
                      <View>
                              <View style={{backgroundColor:'#eee',height:height*0.06,justifyContent:"center",}}>
                                  <Text style={{marginLeft:10,fontWeight:'bold'}}>Food Cards</Text>
 
                                 </View>
                                <View style={{flexDirection:"row",marginVertical:10}}>
                            <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image  source={{uri:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png"}} style={{height:30,width:30,resizeMode:'stretch'}}/>
                            </View>
                            <View style={{flex:0.8,alignItems:"center",justifyContent:"space-between",flexDirection:"row",paddingHorizontal:10}}>
                                <Text>677867867845767</Text>
                                 <Entypo name="chevron-right" size={24} color="black" />
                            </View>
                        </View>
                        <TouchableOpacity style={{flexDirection:"row",alignItems:"center",padding: 10,}}>
                                <Feather name="plus-square" size={24} color={themeColor} />
                                <Text style={{color:themeColor,marginLeft:10}}>Add New Food cards</Text>
                        </TouchableOpacity>
                      </View>     

                                         {/* UPI */}
                      <View> 
                          <View style={{backgroundColor:'#eee',height:height*0.06,justifyContent:"center",}}>
                                  <Text style={{marginLeft:10,fontWeight:'bold'}}>UPI</Text>
 
                         </View>
                        <TouchableOpacity style={{flexDirection:"row",marginVertical:10}}>
                            <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image  source={{uri:"https://banner2.cleanpng.com/20180501/lfe/kisspng-google-pay-send-mobile-payment-5ae7ece0662496.4892518115251488964184.jpg"}} style={{height:30,width:50,resizeMode:'stretch'}}/>
                            </View>
                            <View style={{flex:0.8,alignItems:"flex-end",paddingHorizontal:10}}>
                                
                                 <Entypo name="chevron-right" size={24} color="black" />
                            </View>
                        </TouchableOpacity>
                               <TouchableOpacity style={{flexDirection:"row",marginVertical:10}}>
                            <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image  source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX1y9bRtwN4tkv5dwh33YdbbnJIBj-PRHmWg&usqp=CAU"}} style={{height:30,width:30,resizeMode:'stretch'}}/>
                            </View>
                            <View style={{flex:0.8,alignItems:"flex-end",paddingHorizontal:10}}>
                                
                                 <Entypo name="chevron-right" size={24} color="black" />
                            </View>
                        </TouchableOpacity>
                         <TouchableOpacity style={{flexDirection:"row",alignItems:"center",padding: 10,}}>
                                <Feather name="plus-square" size={24} color={themeColor} />
                                <Text style={{color:themeColor,marginLeft:10}}>Add New UPI ID</Text>
                        </TouchableOpacity>
                    </View>     

                                      {/* WALLET */}
                  <View>
                      <View style={{backgroundColor:'#eee',height:height*0.06,justifyContent:"center",}}>
                                  <Text style={{marginLeft:10,fontWeight:'bold'}}>Wallet</Text>
 
                     </View>
                      <TouchableOpacity style={{flexDirection:"row",marginVertical:10}}>
                            <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image  source={{uri:"https://trak.in/wp-content/uploads/2020/06/Paytm-Logo-1280x720.jpg"}} style={{height:30,width:50,resizeMode:'stretch'}}/>
                            </View>
                            <View style={{flex:0.8,alignItems:"flex-end",paddingHorizontal:10}}>
                                
                                 <Text style={{color:themeColor}}>Link Account</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection:"row",marginVertical:10}}>
                            <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image  source={{uri:"data:image/png;base64,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"}} style={{height:30,width:50,resizeMode:'stretch'}}/>
                            </View>
                            <View style={{flex:0.8,alignItems:"flex-end",paddingHorizontal:10}}>
                                
                                 <Text style={{color:themeColor}}>Link Account</Text>
                            </View>
                        </TouchableOpacity>
                  </View>
                                  {/* COD */}
                    
                    <View>
                          <View style={{backgroundColor:'#eee',height:height*0.06,justifyContent:"center",}}>
                                  <Text style={{marginLeft:10,fontWeight:'bold'}}>Pay on Delivery</Text>
 
                         </View>
                             <TouchableOpacity style={{flexDirection:"row",marginVertical:10}}>
                            <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                               <Image  source={{uri:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png"}} style={{height:30,width:30,resizeMode:'stretch'}}/>
                            </View>
                            <View style={{flex:0.9,alignItems:"center",justifyContent:"space-between",flexDirection:"row",paddingHorizontal:10}}>
                                <View style={{flex: 0.8,}}>
                                    <Text style={{fontWeight:"bold",color:'#000',}}>Cash / UPI</Text>
                                    <Text style={{fontSize:10}}>Online payment recommended to reduce contact</Text>
                                </View>
                                  
                                 <Entypo name="chevron-right" size={24} color="black" />
                            </View>
                        </TouchableOpacity>
                    </View>              
            </ScrollView>
      </View>
    );
  }
}
