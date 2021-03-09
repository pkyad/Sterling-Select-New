import React ,{useEffect, useState ,useRef,Component} from 'react';
import { View, Text, TouchableOpacity ,Dimensions,Image, FlatList,ActivityIndicator, TextInput} from 'react-native';
import settings from '../Appsettings'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { StatusBar } from 'expo-status-bar';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Constants from 'expo-constants';
import HttpClient from '../helpers/HttpsClient';
import { Feather } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import { ScrollView } from 'react-native-gesture-handler';
import { SliderBox } from "react-native-image-slider-box";
import { Ionicons } from '@expo/vector-icons';
import ProductCard from './ProductCard';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import Modal from "react-native-modal";
import * as actionTypes from '../actions/actionTypes';
import Toast, {DURATION} from 'react-native-easy-toast';
const themecolor = settings.themecolor
const url = settings.url
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;



 class SearchScreen2 extends Component {
   constructor(props) {
    super(props);
   
    this.state = {
        products:"",
        selected:{},
        offset:0,
        loading:true,
        loadFinished:false,
        cartItems :this.props.cart,
        cartLoaderShow:false,
        modalVisible:false,
        selectedProduct:null,
        variantShow:false,
        selectedStore:this.props.selectedStore,
        searchloading:false
    };
  } 

  componentDidMount (){
    this.getServiceCart()
  }
   searchProducts =async(query)=>{
          this.setState({searchloading:true})
          const api =`${url}/api/POS/searchProductV3/?search=${query}&limit=10`
          let data = await HttpClient.get(api)
          if(data.type=="success"){
              this.setState({products:data.data,searchloading:false})
          }
     }

    
  
   getServiceCart =async()=>{
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
     openVariantSelection=(variants,type)=>{
     console.log(variants,'gjhjhjkjk',type);
    this.setState({selectionType:type,selectedProduct:variants,variantShow:true})
  }
  render() {
    const {navigation} =this.props
    return (
           <View style={{flex:1,}}>
          <Toast style={{backgroundColor: 'red'}}  textStyle={{color: '#fff'}} ref="toast" position = 'center'/>

                        {/* Headers */}
           <View style={{marginTop:Constants.statusBarHeight,height:height*0.07,backgroundColor:themecolor,flexDirection:"row",alignItems:'center',}}>
              <TouchableOpacity style={{flex: 0.15,alignItems:"center",justifyContent:'center'}} 
               onPress={()=>{navigation.goBack()}}
              >
                 <Ionicons name="md-arrow-back" size={24} color="#fff" />
             </TouchableOpacity>  
             <View style={{flex: 0.8,}}>
                 <View style={{backgroundColor:"#fff",height:height*0.05,width:width*0.8,borderRadius:20,flexDirection:"row",alignItems:"center"}}>
                    <EvilIcons name="search" size={28} color={themecolor} />
                     <TextInput 
                       style={{height:height*0.05,width:width*0.7,fontSize:15}}
                       placeholder="search products"
                       selectionColor={themecolor}
                       placeholderTextColor={themecolor}
                       autoFocus={true} 
                       onChangeText={(text)=>{this.searchProducts(text)}}
                     />
                 </View>
             </View>
           </View>
             {
                  !this.state.searchloading&&this.state.products!==""&&this.state.products.length==0&&<View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                       <View>
                         <Text>No match found</Text>
                       </View>
                  </View>
            }
                {
                  !this.state.searchloading&& typeof this.state.products==""&&<View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                       <View>
                         <Text>Search Products</Text>
                       </View>
                  </View>
            }
           {!this.state.searchloading&&<FlatList
                     data={this.state.products}
                     keyExtractor={(item,index)=>index.toString()}
                     renderItem ={({item,index})=>
                     <ProductCard 
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
                    }
                    //  onEndReached={()=>{!this.state.loadFinished&&this.setState({loading:true,offset:this.state.offset+5},()=>{
                    //        this.updateProducts()
                    //  })}}
                    //  ListFooterComponent={this.footer()}
                     onEndReachedThreshold={0.1}
                /> }
                {
                  this.state.searchloading&&<View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                         <ActivityIndicator size="large" color={themecolor}/>
                  </View>
                }
                {
                  this.variantSelection()
                }
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
export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen2);