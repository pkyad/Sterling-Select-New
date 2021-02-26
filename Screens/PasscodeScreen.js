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
import { FontAwesome,MaterialIcons } from '@expo/vector-icons';

import HttpsClient from '../helpers/HttpsClient';
import  Constants  from 'expo-constants';
const { width } = Dimensions.get('window');
import settings from '../Appsettings';
import Toast, {DURATION} from 'react-native-easy-toast';
import { Ionicons } from '@expo/vector-icons';
const SERVER_URL = settings.url
const themeColor = settings.themecolor



let deviceId = Constants.deviceId


 class PasscodeScreen extends React.Component {
 
 constructor(props){
    super(props);
    this.state={
       passCode:[],
       deviceId,
       userPk:null,
       token:null,
       mobile:null
    }
     this.passCodeTextInput = []
 }
 componentDidMount(){
  //  if(this.passCodeTextInput.length>0){
  //   this.passCodeTextInput[0].focus()
  //  }
  
 }
   focusPrevious=(key, index)=>{
         if (key === 'Backspace' && index !== 0)
             this.passCodeTextInput[index - 1].focus();
     }

     focusNext=(index, value)=>{
        if (index < this.passCodeTextInput.length - 1 && value) {
            this.passCodeTextInput[index + 1].focus();
        }
        if (index === this.passCodeTextInput.length - 1) {
            this.passCodeTextInput[index].blur();
        }
        const passCode = this.state.passCode;
        passCode[index] = value;
        this.setState({passCode});
        console.log(this.state.passCode,'ggggggggg');
    }
  login=async()=>{
         const otp = [1,2,3,4]
            otp.forEach((i,index)=>{
                  this.passCodeTextInput[index].setNativeProps({
              text:null
            });
            })
      let passcode = this.state.passCode.join('')
      const  sendData ={
        username:this.state.deviceId,
        passcode:Number(passcode)
      }
     var data = new FormData();
    //   data.append("username", this.state.username);
    //   data.append("otp", this.state.otp);
      
      data.append( "username", this.state.deviceId );
      data.append( "passcode", Number(passcode) );
      fetch(SERVER_URL + '/login/?otpMode=true&mode=api&device=ios', {
        method: 'POST',
        body: data,
        headers: {
        "host":'sterling.happypockets.in'
        }
      }).then((response) => {
         
            if(response.status == 200 || response.status==201 ){
                  var sessionid = response.headers.get('set-cookie').split('sessionid=')[1].split(';')[0]
          var csrftoken = response.headers.get('set-cookie').split('csrftoken=')[1].split(';')[0]
         var d = response.json()
         console.log(sessionid,csrftoken,"lllll")
          AsyncStorage.setItem("csrf", csrftoken)
          this.setState({ sessionid: sessionid })
          AsyncStorage.setItem("sessionid", sessionid)
         return d
       }else{
          this.refs.toast.show('invalid passcode ');
       }
      })
      .then((responseJson) => {
         // console.log(responseJson,"jjjjjj")
            console.log(responseJson,'egdssssssssssssss');
        this.setState({ needOTP: false })
        // if(Platform.OS==='android'){
          AsyncStorage.setItem("csrf", responseJson.csrf_token)
          this.setState({ csrf: responseJson.csrf_token })
        // }
        AsyncStorage.setItem("userpk", responseJson.pk+'')
        // this.getInitial(responseJson.pk,responseJson.csrf_token)
        this.setState({loader:false})
        AsyncStorage.setItem("login", JSON.stringify(true)).then(res => {
               
          return this.props.navigation.navigate('HomeScreen', {
            screen: 'ProfileScreen',
          })
      
        });
        this.setState({ userPk: responseJson.pk,token:responseJson.token,mobile:responseJson.mobile,username:this.state.mobileNo })
         })
         .catch((error) => {
       return

     });
    
    }
 renderInputs=()=>{
          const inputs = Array(4).fill(0);
          const txt = inputs.map(
              (i, j) => <View key={j} style={{paddingHorizontal:10,flexDirection:"row"}}>
                  <TextInput
                      style={[ { height:40,width:40,borderBottomWidth:3,borderColor:'grey',borderRadius: 0,paddingHorizontal:0,color:'#000',textAlign:'center',fontSize:18 }]}
                      keyboardType="numeric"
                     
                      selectionColor={themeColor}
                      maxLength={1}
                      onChangeText={v => this.focusNext(j, v)}
                      onKeyPress={e => this.focusPrevious(e.nativeEvent.key, j)}
                      ref={input => { this.passCodeTextInput[j] = input}}
                      secureTextEntry={true}
                  />
               </View>
          );
          return txt;
      }
    render() {
        return (
            <View style={{flex:1,alignItems:"center",justifyContent:'center'}}>
              <View style={{flex: 0.2,flexDirection:"row",marginTop:Constants.statusBarHeight}}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}} style={{paddingLeft: 15,paddingRight:0,paddingVertical:10,}}>
                  <MaterialIcons name={'arrow-back'} size={23} color={themeColor}/>
               </TouchableOpacity>
                <View style={{flex: 1,alignItems:"flex-end"}}>
                     
                   <Image source={require('../assets/images/1.png')} style={{flex:1,resizeMode:'cover',width:100,height:100}} />
                      
                </View>
              </View>
              <View style={{flex: 0.6,alignItems:"center",}}>
                    <Toast style={{backgroundColor: 'grey'}} textStyle={{color: '#fff'}} ref="toast" position = 'top'/>
            
                      <Text style={{fontWeight:"bold",fontSize:20,color:"#000"}}>Enter Passcode</Text>
                      <Text style={{marginTop:20,color:"gray"}}>Enter your 4 digit Passcode</Text>
             
               
              <View style={{flexDirection:'row',margin:30}}>
                      {this.renderInputs()}
              </View>
              <View style={{flexDirection:"row",marginTop:20}}>
                    <View style={{flex: 1,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('LogInScreen')}}>
                             <Text style={{color:"gray"}}>Forgot Passcode</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                       onPress={()=>{this.props.navigation.navigate('SterlingLogin',{screentype:"OTPLOGIN"})}}
                        >
                            <Text style={{color:"gray"}}>Sign In with OTP</Text>
                        </TouchableOpacity>
                        
                    </View>
              </View>
              <View style={{marginTop:25}}>
                  <TouchableOpacity style={{paddingVertical:10,backgroundColor:themeColor,paddingHorizontal:width*0.3}}
                    onPress={()=>{this.login()}}
                  >
                        <Text style={{color:"#fff",fontWeight:"bold"}}>ENTER</Text>
                  </TouchableOpacity>
              </View>
              </View>
              <View style={{flex: 0.2,flexDirection:"row",alignItems:"center",justifyContent:"space-between",}}>
                <Image source={require('../assets/images/2.png')} style={{flex:0.5,resizeMode:"cover",width:"100%",height:"100%",}} />
                <Image source={require('../assets/images/3.png')} style={{flex:0.5,resizeMode:"cover",width:"100%",height:"100%",}} />
              </View>  
            </View>
        )
    }
}


export default PasscodeScreen;