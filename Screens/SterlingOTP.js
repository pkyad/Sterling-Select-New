import React from 'react';

import {

  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Slider,
  Dimensions,
  TextInput,FlatList,AsyncStorage,TouchableHighlight, Alert,Button,ToastAndroid,ActivityIndicator,Image,StatusBar
} from 'react-native';
import { FontAwesome ,MaterialIcons} from '@expo/vector-icons';
;
import  Constants  from 'expo-constants';
const { width } = Dimensions.get('window');
import settings from '../Appsettings';
import Toast, {DURATION} from 'react-native-easy-toast';
import { Ionicons } from '@expo/vector-icons';
const SERVER_URL = settings.url
const themeColor = settings.themecolor
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import * as actionTypes from '../actions/actionTypes';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import HttpsClient from '../helpers/HttpsClient';


const domain = settings.domain
class SterlingOTP extends React.Component {

static navigationOptions =  {
  header:null
}

  constructor(props){
    console.log(props)
    super(props);
    //  const screentype = props.navigation.getParam('screentype',null)
    //  const mobileNo = props.navigation.getParam('username',null)
    this.state = {
      username:'',
      otp:[],
      needOTP:true,
      text:'',
      screen:'',
      mobileNo:"",
      checked:true,
      store:this.props.store,
      selectedStore:this.props.selectedStore,
      csrf:null,
      cartItems:this.props.cart,
      sessionid:null,
      loadingVisible:false,
      screentype:"",
    };
    this.otpTextInput = []
  }
    getHash = () =>
     
        RNOtpVerify.getHash()
        .then()
        .catch(console.log);

    startListeningForOtp = () => {
        RNOtpVerify.getOtp()
        .then(p => RNOtpVerify.addListener(this.otpHandler))
        .catch(p => console.log(p));
    }
        otpHandler = async(message) => {
            var reg = /\d+/;
            console.log("your message is",message);
            var result = message.match(reg)

            var otp = result[0].split('')
            console.log(result[0],'jjjj');
            // otp.forEach((i,index)=>{
            //       this.otpTextInput[index].setNativeProps({
            //   text:i
            // });
            // })
            await this.setState({otp:result[0]})
            this.verify();
           
          /*   otp.forEach((i,index)=>{
             
              console.log(  this.otpTextInput.current.setNativeProps,"pprprp")
            
            }) */
          //   this.otpTextInput= [this.otpTextInput,otp]
          //   console.log(this.otpTextInput,"texttxt")
          //  

          
           /*  const otp = /(\d{6})/g.exec(message)[1];
            console.log(otp);
             */
            
            // Keyboard.dismiss();
    }
  componentDidMount(){
    // this.getHash();
    // this.startListeningForOtp();
    // var screen = this.props.navigation.getParam('screen',null)
    // var username = this.props.navigation.getParam('username',null)
    // var userPk = this.props.navigation.getParam('userPk',null)
    // var token = this.props.navigation.getParam('token',null)
    // var mobile = this.props.navigation.getParam('mobile',null)
    // var csrf = this.props.navigation.getParam('csrf',null)
    // console.log(this.state.cartItems,'ghjjjjjjjjj');

    // setTimeout(() => this.ref.focus(), 50)
    // if(screen == 'LogInScreen'){
    //   this.setState({text:'Login to Happypockets',screen:'login',username:username})
    // }else{
    //   this.setState({text:'Register to Happypockets',screen:'register',username:username,mobileNo:username})
    //   this.setState({userPk: userPk,token:token,mobile:mobile,mobileNo:username,csrf:csrf})
    // }
  }

  copyCodeFromClipBoardOnAndroid=()=>{
    if (Platform.OS === "android") {
            this.checkPinCodeFromClipBoard()
            this._timer = setInterval(() => {
                this.checkPinCodeFromClipBoard()
            }, 400)
}
  }

  checkPinCodeFromClipBoard=()=>{

    Clipboard.getString().then(code => {
             if ( this.state.clipboard !== code) {
                 this.setState({clipboard:code})
             }
          })
  }
  resend(){
   this.refs.toast.show('request sent!');
   if(this.state.screen == 'login'){
     var data = new FormData();
     data.append("id", this.state.username);
     fetch(SERVER_URL + '/generateOTP/', {
       method: 'POST',
       body: data
     })
       .then((response) => {

         if (response.status == 200) {
           this.setState({ username: this.state.username })
           this.setState({ needOTP: true })
           return response.json()
         }

       })

       .then((responseJson) => {
         if (responseJson == undefined){
           this.refs.toast.show('No user found , Please register');
         }else{
           return
         }
       })
       .catch((error) => {
         this.refs.toast.show(error.toString());
         return
       });
   }else{
     var data = new FormData();
     data.append( "mobile", this.state.mobileNo );
     fetch( SERVER_URL + '/api/homepage/registration/', {
       method: 'POST',
       body: data
     })
     .then((response) =>{
       if(response.status == 200 || response.status==201 ){
         var d = response.json()
         this.setState({ needOTP: true })
         return d
       }else{
         this.refs.toast.show('Mobile No Already register with user ');
       }
     })
     .then((responseJson) => {
        this.setState({ userPk: responseJson.pk,token:responseJson.token,mobile:responseJson.mobile,username:this.state.mobileNo })
         })
     .catch((error) => {
       return

     });
   }

  }

  requestPost=(item,sessionid,csrf)=>{
    var data = {
      product:item.product,
      productVariant:item.productVariant,
      store:item.store,
      qty:item.count,
     }
    return new Promise(resolve => {
     fetch(SERVER_URL + '/api/POS/cart/',{
       method: 'POST',
       headers:{
         "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'Referer': SERVER_URL,
         'X-CSRFToken': csrf
       },
       body: JSON.stringify(data)
     })
     .then((response) => response.json())
     .then((responseJson) => {
        resolve(responseJson);
      })
     .catch((error) => {
       resolve();
     });
   })
  }

  requestPatch =(item,count,sessionid,csrf)=>{
    var data = {
      qty:count,
     }
    return new Promise(resolve => {
     fetch(SERVER_URL + '/api/POS/cart/'+item.pk+'/',{
       method: 'PATCH',
       headers:{
         "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'Referer': SERVER_URL,
         'X-CSRFToken': csrf
       },
       body: JSON.stringify(data)
     })
     .then((response) => response.json())
     .then((responseJson) => {
        resolve(responseJson);
      })
     .catch((error) => {
       resolve();
     });
   })
  }

  getInitial=async(pk,csrf)=>{
    console.log('jjjjjjjjjjjjj');
    var sessionid =  await AsyncStorage.getItem('sessionid');
    console.log(SERVER_URL,this.state.selectedStore,sessionid,csrf,pk);
    if(sessionid!=null){
    fetch(SERVER_URL + '/api/POS/cart/?user='+pk+'&store='+this.state.selectedStore.pk)
      .then((response) => response.json())
      .then((responseJson) => {
        var count = 0
        var arr = responseJson.map((item)=>{
          if(item.productVariant.images.length>0){
            var image = item.productVariant.images[0].attachment
          }else{
            var image = null
          }
            count += item.qty
            var obj = {product:item.product.pk,productVariant:item.productVariant.pk,store:item.store,count:item.qty,type:'GET_CART',customizable:item.productVariant.customizable,sellingPrice:item.productVariant.sellingPrice,mrp:item.productVariant.price,stock:item.productVariant.stock,discount:item.productVariant.price-item.productVariant.sellingPrice,maxQtyOrder:item.productVariant.maxQtyOrder,minQtyOrder:item.productVariant.minQtyOrder,dp:image,displayName:item.productVariant.displayName,user:pk,cart:item.pk}
            return obj
        })

        var promises = [];
        var cartItems = this.state.cartItems

        console.log(cartItems,'lllllllllll');

        if(cartItems.length>0){
          cartItems.forEach((item,index)=>{
            item.check = false
            arr.forEach((i,idx)=>{
              if(i.product == item.product&&i.productVariant == item.productVariant&&i.store == item.store){
                item.check = true
                promises.push(this.requestPatch(i,item.count+i.count,sessionid,csrf));
             }
           })
           if(!item.check){
             promises.push(this.requestPost(item,sessionid,csrf));
           }
        })
      }
      this.setState({loader:false})
        Promise.all(promises).then(() => {
          AsyncStorage.setItem("login", JSON.stringify(true)).then(res => {
            return this.props.navigation.navigate('HomeScreen', {
              screen: 'ProfileScreen',
            })
          });
        })

      })
      .catch((error) => {
        this.setState({loader:false})
        AsyncStorage.setItem("login", JSON.stringify(true)).then(res => {
          return this.props.navigation.navigate('HomeScreen', {
            screen: 'ProfileScreen',
          })
        });
      });
    }

  }


  getMyStore = async ()=>{
    fetch(SERVER_URL + '/api/POS/getMyStore/',{
      headers: {
        "Cookie" :"csrftoken="+this.state.csrf+";sessionid=" + this.state.sessionid +";",
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': SERVER_URL,
        'X-CSRFToken': this.state.csrf
      }
    })
     .then((response) => {return response.json()})
     .then((responseJson) => {
          if(responseJson.found){
            this.props.setMyStoreFunction(responseJson.store,responseJson.role)
          }else{
            this.props.removeMyStoreFunction()
          }
        })
     .catch((error) => {
       return
     });
  }

getMyDetails =async(sessionid,csrf)=>{

  const api = `${SERVER_URL}'/api/HR/users/?mode=mySelf&format=json`
  // let data = await HttpsClient.get(api)
  // console.log(data,"ddddd")
 await fetch(SERVER_URL + '/api/HR/users/?mode=mySelf&format=json',{
      headers: {
        "Cookie" :"csrftoken="+csrf+";sessionid=" +sessionid +";",
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': SERVER_URL,
        'X-CSRFToken':csrf
      }
    })
     .then(async(response) => {return response.json()})
     .then(async(responseJson) => {
       const userPk = responseJson[0].pk
        AsyncStorage.setItem("Pk", userPk.toString())
       console.log(userPk,"pkpkpk")
  
       const data =await AsyncStorage.getAllKeys()
       console.log(data,"yyyyyyyy")
        })
     .catch((error) => {
       return
     });
    
}

  verify() {

  //  RNOtpVerify.removeListener();
    var otp = this.state.otp
    
   
    if(otp.length < 4){
      this.setState({otp:this.state.clipboard})
    }
    this.setState({loadingVisible:true})
     
      var data = new FormData();
      data.append("username", this.state.username);
      data.append("otp", otp);
      fetch(SERVER_URL + '/login/?otpMode=True&mode=api&device=ios', {
        method: 'POST',
        body: data,
        'headers':{
          'Host':domain,
        }
      }).then((response) => {
        this.setState({loadingVisible:false})
        console.log(response.status,response.headers,'llll');
        if (response.status == 200) {
          console.log(response.headers,'loginmodeeeeee');
          var sessionid = response.headers.get('set-cookie').split('sessionid=')[1].split(';')[0]
          var csrftoken = response.headers.get('set-cookie').split('csrftoken=')[1].split(';')[0]
       
          AsyncStorage.setItem("csrf", csrftoken)
         
          this.setState({ sessionid: sessionid })
          AsyncStorage.setItem("sessionid", sessionid)
          this.props.signedInFunction(true)
          this.setState({ sessionid: sessionid },()=>{
            this.getMyStore()
            this.getMyDetails(sessionid,csrftoken)
          })
          return this.props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'Tab',
                  
                },
                
              ],
            })
          )
        }
        
        else {
          this.refs.toast.show('Incorrect OTP');
          this.setState({loadingVisible:false})
          return response.json()
        }
      })
  }

  focusPrevious=(key, index)=>{
         if (key === 'Backspace' && index !== 0)
             this.otpTextInput[index - 1].focus();
     }

     focusNext=(index, value)=>{
        if (index < this.otpTextInput.length - 1 && value) {
            this.otpTextInput[index + 1].focus();
        }
        if (index === this.otpTextInput.length - 1) {
            this.otpTextInput[index].blur();
        }
        const otp = this.state.otp;
        otp[index] = value;
        this.setState({ otp });
        console.log(this.state.otp,'ggggggggg');
    }

  renderInputs=()=>{
      return(
  <View style={{marginHorizontal:30,width:width-60,marginVertical:15,}}>
                     <View style={{position:'absolute',top:-9,left:20,zIndex:2,backgroundColor:'#f2f2f2'}}>
                        <Text style={{fontSize:12,paddingHorizontal:5,color:'grey',fontWeight:'bold'}}>OTP</Text>
                     </View>
                     <TextInput style={{height: 45,borderWidth:1,borderColor:themeColor,width:'100%',borderRadius:10,color:"#000",paddingHorizontal:15}}
                         placeholder=""
                         selectionColor={'#000'}
                         onChangeText={number => { this.setState({otp:number}) }}
                         value={this.state.otp}
                         keyboardType={'numeric'}
                       
                      />
                    </View>
  )
          // const inputs = Array(4).fill(0);
          // const txt = inputs.map(
          //     (i, j) => <View key={j} style={{paddingHorizontal:10}}>
          //         <TextInput
          //             style={[ { height:40,width:40,borderBottomWidth:3,borderColor:'#000',borderRadius: 0,paddingHorizontal:0,color:'#000',textAlign:'center',fontSize:18 }]}
          //             keyboardType="numeric"
                     
          //             selectionColor={'#ffffff'}
          //             maxLength={1}
          //             onChangeText={v => this.focusNext(j, v)}
          //             onKeyPress={e => this.focusPrevious(e.nativeEvent.key, j)}
          //             ref={input => { this.otpTextInput[j] = input}}
          //         />
          //     </View>
          // );
          // return txt;
      }


  render(){
    // var themeColor = this.props.store.themeColor
    // var {loadingVisible} = this.state
    return(


      <View style={{flex:1,backgroundColor: '#f2f2f2'}}>
      <View style={{height: Constants.statusBarHeight,  backgroundColor: themeColor}} >
        <StatusBar  translucent={true} barStyle="light-content" backgroundColor={themeColor} networkActivityIndicatorVisible={false}    />
      </View>
  
     
      <Toast style={{backgroundColor: 'grey'}} textStyle={{color: '#fff'}} ref="toast" position = 'top'/>
       <View style={{flex:0.2,flexDirection:"row"}}>
               <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}} style={{paddingLeft: 15,paddingRight:0,paddingVertical:10,}}>
                  <MaterialIcons name={'arrow-back'} size={23} color={themeColor}/>
               </TouchableOpacity>
              <View style={{flex: 1,alignItems:"flex-end"}}>
                   <Image source={require('../assets/images/1.png')} style={{flex:1,resizeMode:'cover',width:100,height:100}} />
                      
                </View>
         </View>
      <View style={{flex:0.6,}}>

          <View style={{flex:0.7,alignItems:'center',justifyContent:'center',paddingHorizontal:10}}>
             <View style={{flex:0.3,alignItems:'center',justifyContent:'center',}}>
             </View>
             <View style={{flex:0.7,alignItems:'center',justifyContent:'center'}}>
                 <View  style={{paddingHorizontal:15,paddingVertical:6,marginBottom:20}}>
                    <Text style={{color:'#000',fontSize:25,fontWeight:'700',textAlign:"center"}}>Enter OTP</Text>
                    <Text style={{marginTop:7}}>please check the OTP sent to your mobile number</Text>
                    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",marginTop:10}}>
                        <Text style={{color:'#000',fontSize:20,fontWeight:'700',textAlign:"center"}}>{this.state.mobileNo}</Text>
                        <TouchableOpacity style={{backgroundColor:themeColor,padding:5,borderRadius:10}}
                          onPress={()=>{this.props.navigation.navigate('LogInScreen',{mobileNo:this.state.mobileNo});RNOtpVerify.removeListener();}}
                        >
                               <Text style={{color:"#fff",fontWeight:"bold"}}>CHANGE</Text>
                        </TouchableOpacity>
                    </View>
                 </View>
                  <View style={{flexDirection:'row',marginBottom:30}}>
                      {this.renderInputs()}
                  </View>
                  <View style={{}}>
                      <TouchableOpacity onPress={() => {this.verify() }} style={{paddingVertical:2,paddingHorizontal:width*0.3,backgroundColor:themeColor}}><Text style={{fontSize:25,color:'#fff',fontWeight:"bold"}}>Verify</Text></TouchableOpacity>
                  </View>
                  <View style={{}}>
                      <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Pages',{url:'terms-and-conditions'})}}>
                        <Text style={{fontSize:14,color:'#000',textAlign:'center',fontWeight:'600',paddingTop:20}}>{`By verifying I'm accepting the Terms and Conditions`}</Text>
                      </TouchableOpacity>
                  </View>
                  <View onPress={() => this.resend()} style={{paddingTop:20}}>
                      <TouchableOpacity style={{paddingVertical:4,paddingHorizontal:15,borderWidth:0,}}><Text style={{fontSize:20,color:'#000'}}>Resend OTP</Text></TouchableOpacity>
                  </View>

             </View>
          </View>



         

      </View>
        <View style={{flex: 0.2,flexDirection:"row",}}>
                <Image source={require('../assets/images/2.png')} style={{flex:1,resizeMode:'cover',width:100,height:100}} />
                <Image source={require('../assets/images/3.png')} style={{flex:1,resizeMode:'cover',width:100,height:100}} />
              </View>
      </View>

    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#fff',
  },
  underlineStyleBase:{
    width: 40,
    height:45,
    borderWidth:2,
    borderColor: "#a2a2a2",
    marginHorizontal:25,
  },
  underlineStyleHighLighted: {
     borderColor: themeColor,
   },
  button:{
   backgroundColor:themeColor,
   },
  buttonText:{

   },


});



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
export default connect(mapStateToProps, mapDispatchToProps)(SterlingOTP);

