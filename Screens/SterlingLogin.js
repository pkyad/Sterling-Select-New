import * as React from 'react';
import { Text, View, StyleSheet, Button, StatusBar,TouchableOpacity, Platform, Image,AsyncStorage,Alert,ScrollView ,Clipboard,ToastAndroid,Dimensions,FlatList,BackHandler,TextInput,Keyboard} from 'react-native';
import Constants from 'expo-constants';
import { Octicons ,MaterialCommunityIcons,MaterialIcons,SimpleLineIcons} from '@expo/vector-icons';
import settings  from '../Appsettings';
import Toast, {DURATION} from 'react-native-easy-toast';
import HttpsClient from '../helpers/HttpsClient';
const domain = settings.domain
const themeColor = settings.themecolor
const SERVER_URL = settings.url;
const deviceId = Constants.deviceId ;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


class SterlingLogin extends React.Component {

    static navigationOptions =  {
        header:null
    }

    constructor(props) {
      super(props);
      
    //   const screentype = props.navigation.getParam('screentype',null)
    //   const mobileNo = props.navigation.getParam('mobileNo',null)
    //   console.log(mobileNo,"mobileNomobileNo")
    // console.log(screentype,'screentypescreentype')
      this.state = {
        email:'',
        password:'',
        scrollHeight:Dimensions.get('window').height-100,
        keyboardOpen : false,
        keyboardHeight:0,
        disableSignUp:false,
        error:false,
        store: this.props.store,
        cartItems : this.props.cart,
        keyboardOffset:0,
        mobileNo:null,
        screentype:null,
      };
      this.mobileTextInput = []
      Keyboard.addListener('keyboardDidHide',this.keyboardDidHide)
      Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    }

    handleBackButtonClick=()=> {
      this.props.navigation.navigate('Home');
      return true;
    };

    componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setState({disableSignUp:false,error:false,email:'',password:'',});
    }
  }

  keyboardDidShow=(event)=> {
        this.setState({
            keyboardOffset: event.endCoordinates.height+27,
            keyboardOpen:true
        })
    }

    keyboardDidHide=()=> {
        this.setState({
            keyboardOffset: 27,
            keyboardOpen:false
        })
   }

  componentWillUnmount(){
    Keyboard.removeListener('keyboardDidShow', this.keyboardDidShow);
    Keyboard.removeListener('keyboardDidHide', this.keyboardDidHide);
  }

    showNoInternet=()=>{
      if(this.refs.toast!=undefined){
        this.refs.toast.show('No Internet Connection')
      }
    }

    getCellularInfo=async()=>{
      var mobileState = await Cellular.carrier
      console.log(mobileState,'cajnjndl');
    }

    componentDidMount(){
      // this.getCellularInfo()
      // this.setState({disableSignUp:false,error:false,email:'',password:''})
      // this.setState({unsubscribe:NetInfo.addEventListener(state =>{
      //    this.handleConnectivityChange(state);
      //  })})
    }

    handleConnectivityChange=(state)=>{
      if(state.isConnected){
         this.setState({connectionStatus : true})
      }else{
        this.setState({connectionStatus : false})
        this.showNoInternet()
      }
    }

    onChangeText=(text)=>{
      this.setState({email:text,error:false})
    }

    getOtp() {
    if(this.state.mobileNo == undefined){
      this.refs.toast.show('Mobile no was incorrect ');
    }
    else{
      var data = new FormData();
      data.append( "mobile", this.state.mobileNo );
      fetch( SERVER_URL + '/api/homepage/registration/', {
        method: 'POST',
        body: data
      }).then((response)=>{
        if(response.status == 200 || response.status==201 ){
          var d = response.json()
          return d
        }else{
          this.refs.toast.show('Mobile No Already register with user ');
        }
      })
      .then((responseJson) => {
         this.setState({ userPk: responseJson.pk,token:responseJson.token,mobile:responseJson.mobile,username:this.state.mobileNo });
         AsyncStorage.setItem("userpk", responseJson.pk + '')
         this.props.navigation.navigate('OtpScreen',{
           username:this.state.mobileNo,
           screen:'',
           userPk:responseJson.pk,
           token:responseJson.token,
           mobile:responseJson.mobile,
           csrf:responseJson.csrf,
           mobileOTP:'',
         });
       })
      .catch((error) => {
        return
      });
    }
}

    sendOtp  = async() =>{
      // const send  = await HttpsClient.post(`${SERVER_URL}/generateOTP/`,{
      //   id:"7010117137"
      // })
      // console.log(send,"jjk")
  
    var mob = /^[1-9]{1}[0-9]{9}$/;
    var mobileNo = this.state.mobileNo
    if (mobileNo == undefined || mob.test(mobileNo) == false) {
      this.refs.toast.show('Enter Correct Mobile No');
    } else {
      this.refs.toast.show('OTP request sent.');
      var data = new FormData()
       data.append("id", mobileNo);
      console.log(SERVER_URL)
      fetch(SERVER_URL + '/generateOTP/', {
        method: 'POST',
        body: data,
        'headers':{
          'Host':domain,
        }
      })
        .then((response) => {
            console.log(response.status,"oooo")
          if (response.status == 200) {
            this.setState({ username: mobileNo })
          
            return response.json()
          }
        })
        .then((responseJson) => {
          if (responseJson == undefined){
            //  this.getOtp()
          }else{
            this.setState({ OTP: responseJson })
            this.props.navigation.navigate('SterlingOTP',{
              screen:'LogInScreen',
              username:mobileNo,
              screentype:this.state.screentype
            });
            return
          }
        })
        .catch((error) => {
          this.refs.toast.show(error.toString());
          return
        });
    }
}

focusPrevious=(key, index)=>{
       if (key === 'Backspace' && index !== 0)
           this.mobileTextInput[index - 1].focus();
   }

   focusNext=(index, value)=>{
      if (index < this.mobileTextInput.length - 1 && value) {
          this.mobileTextInput[index + 1].focus();
      }
      if (index === this.mobileTextInput.length - 1) {
          this.mobileTextInput[index].blur();
      }
      const mobileNo = this.state.mobileNo;
      // if(mobileNo.length==10){
      //   Keyboard.dismiss()
      // }
      mobileNo[index] = value;
      this.setState({ mobileNo });
      console.log(this.state.mobileNo,'ggggggggg');
  }

renderInputs=()=>{
  return(
  <View style={{marginHorizontal:30,width:width-60,marginVertical:15,}}>
                     <View style={{position:'absolute',top:-9,left:20,zIndex:2,backgroundColor:'#fff'}}>
                        <Text style={{fontSize:12,paddingHorizontal:5,color:'grey',fontWeight:"bold"}}>Mobile</Text>
                     </View>
                     <TextInput style={{height: 45,borderWidth:1,borderColor:themeColor,width:'100%',borderRadius:10,color:"#000",paddingHorizontal:15}}
                         placeholder=""
                         selectionColor={'#000'}
                         onChangeText={number => { this.setState({mobileNo:number}) }}
                         value={this.state.mobileNo}
                         keyboardType={'numeric'}
                      />
                    </View>
  )
        // const inputs = Array(10).fill(0);
        // const txt = inputs.map(
        //     (i, j) => <View key={j} style={{paddingHorizontal:10}}>
        //         <TextInput
        //             style={[ { height:40,width:width/30,borderBottomWidth:1,borderColor:'#000',borderRadius: 0,paddingHorizontal:0,color:'#000',textAlign:'center' }]}
        //             keyboardType="numeric"
        //             selectionColor={'#ffffff'}
        //             maxLength={1}
        //             onChangeText={v => this.focusNext(j, v)}
        //             onKeyPress={e => this.focusPrevious(e.nativeEvent.key, j)}
        //             ref={input => { this.mobileTextInput[j] = input}}
        //         />
        //     </View>
        // );
        // return txt;
          
    }



  render(){
  
    return(
      <ScrollView style={{flex:1,backgroundColor: '#fff',}}>
          <Toast style={{backgroundColor: 'grey'}} textStyle={{color: '#fff'}} ref="toast" position = 'top'/>
          <View style={{height: Constants.statusBarHeight,backgroundColor: themeColor}} >
            <StatusBar  translucent={true} barStyle="light-content" backgroundColor={themeColor} networkActivityIndicatorVisible={false}    />
          </View>
         <View style={{flexDirection:"row",height:height*0.15,}}>
            <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}} style={{paddingLeft: 15,paddingRight:0,paddingVertical:10,}}>
                  <MaterialIcons name={'arrow-back'} size={23} color={themeColor}/>
               </TouchableOpacity>
              <View style={{flex: 1,alignItems:"flex-end"}}>
                   <Image source={require('../assets/images/1.png')} style={{flex:1,resizeMode:'cover',width:100,height:100}} />
                      
                </View>
         </View>
          <View style={{height:height*0.5,}} >
          <View style={{alignItems:"center",}}>


                   <Image source={require('../assets/sterlingsplash1.png')} style={{width:width*0.67,height:height*0.25,resizeMode:"contain"}} />
                        
               
               
                      <Text style={{fontSize:18,color:'#000',textAlign:'center',fontWeight:"bold",paddingBottom:20,marginTop:20}}>LOGIN</Text>
                      <View style={{flexDirection:'row'}}>
                          {this.renderInputs()}
                      </View>
                      <TouchableOpacity onPress={()=>{this.sendOtp()}} style={{paddingHorizontal:width*0.23,paddingVertical:5,marginTop:20,backgroundColor:themeColor,borderRadius:10}}>
                         <Text style={{color:'#fff',fontSize:20,fontWeight:"bold"}}>Sign in with OTP</Text>
                      </TouchableOpacity>
              
              </View>

          </View>
         <View style={{height:height*0.2,flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:height*0.1}}>
                <Image source={require('../assets/images/2.png')} style={{flex:0.5,resizeMode:"cover",width:"100%",height:"100%",}} />
                <Image source={require('../assets/images/3.png')} style={{flex:0.5,resizeMode:"cover",width:"100%",height:"100%",}} />
              </View> 
      </ScrollView>
     )
  }
}


const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusBar: {
   height: Constants.statusBarHeight,
 },
 inputStyle:{
   height: 50,
   width:'100%',
   borderRadius:5,
   paddingHorizontal: 15,
   paddingVertical: 5,
   fontSize: 16,
   flexDirection: 'row',
 },
 login:{
   height: 40,
   backgroundColor:'#032757',
   width:'100%',
   borderRadius:5,
   borderTopLeftRadius:20,
   paddingHorizontal: 15,
   paddingVertical: 5,
   fontSize: 16,
   alignItems: 'center',
   justifyContent: 'center'
 },
 btn:{
   borderRadius:10,
   height: 40,
   alignItems: 'center',
   justifyContent: 'center',
   width:'100%',
   flexDirection: 'row',
   paddingHorizontal: 15,
 }


})


export default SterlingLogin;

