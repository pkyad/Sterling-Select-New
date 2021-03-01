import { View, Text, TouchableOpacity ,Dimensions,Image, FlatList,ActivityIndicator} from 'react-native';
import settings from '../Appsettings'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { StatusBar } from 'expo-status-bar';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Constants from 'expo-constants';
import HttpClient from '../helpers/HttpsClient';
import { Feather } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { SliderBox } from "react-native-image-slider-box";
import Modal from "react-native-modal";
const themecolor = settings.themecolor
const url = settings.url
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import * as actionTypes from '../actions/actionTypes';
import Toast, {DURATION} from 'react-native-easy-toast';
import React, { Component } from 'react';
import ProductCard from './ProductCard';


 class CatogoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        Catagories:[],
        selected:{},
        offset:0,
        loading:true,
        products:[],
        loadFinished:false,
        cartItems :this.props.cart,
        cartLoaderShow:false,
        modalVisible:false,
        selectedProduct:null,
        variantShow:false,
        selectedStore:this.props.selectedStore,
        
    };
  } 

componentDidMount(){

    this.getCatagories();
    this.getServiceCart()

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
   openVariantSelection=(variants,type)=>{
     console.log(variants,'gjhjhjkjk');
    this.setState({selectionType:type,selectedProduct:variants,variantShow:true})
  }
       updateProducts =async()=>{
       
        const api = `${url}/api/POS/productliteApp/?category=${this.state.selected.pk}&format=json&limit=5&offset=${this.state.offset}`
        let data = await HttpClient.get(api)
         if(data.type=="success"){
             this.setState({products:this.state.products.concat(data.data.results)})  
         }
         if(data.data.next==null){
             this.setState({loading:false,loadFinished:true})
         }
         console.log("update called",api)
     }

  

   getProducts =async(pk)=>{
        this.setState({offset:0,loadFinished:false,products:[],loading:true})
        const api =`${url}/api/POS/productliteApp/?category=${pk}&format=json&limit=5&offset=0`
        let data = await HttpClient.get(api)
        if(data.type=="success"){
            this.setState({products:data.data.results})
        }
        if(data.data.next==null){
              this.setState({loading:false,loadFinished:true})
              
        }
     console.log(api,"nee")
    }


      getCatagories = async()=>{
         let data =  await HttpClient.get(`${url}/api/POS/getCategoryList/`)
         if(data.type="success"){
               this.setState({selected:data.data.cats[0],Catagories:data.data.cats})
             
           this.getProducts(data.data.cats[0].pk) 
         }
        
     }
    footer =()=>{
       if(this.state.loading){
             return(
              <View style={{alignItems:"center",justifyContent:"center",height:height*0.2}}>
                 <Text>Hang on,Loading</Text> 
                <ActivityIndicator size="large" color={themecolor} />
              </View>
          )
       }else{
           return <View style={{alignItems:"center",justifyContent:"center",height:height*0.1}}>
               <Text>NO MORE PRODUCTS</Text>
           </View>
       }
         
    }
//      renderProducts =(item,index)=>{
       
//        return(
//            <View style={{flexDirection:"row",height:height*0.2,}}>
//                 <View style={{flex: 0.3,alignItems:"center",justifyContent:"center"}}>
//                      <Image source={{uri:`${url}/media/${item.image}`}} style={{height:"80%",width:"80%",resizeMode:"contain"}} />
//                 </View>

//                 <View style={{flex: 0.4,alignItems:"flex-start",justifyContent:"center"}}>
//                     <Text>{item.name}</Text>
//                     {/* <Text>{item?.variant[0]?.value} {item.variant[0].unitType}</Text> */}
//                     <View style={{flexDirection:"row",alignItems:'center'}}>
//                        <Text style={{color:themecolor,fontWeight:"bold",fontSize:20}}>₹{item.sellingPrice}</Text>
//                        <Text style={{color:"gray",textDecorationLine:'line-through',marginLeft:10}}>₹{item.price}</Text>
//                     </View>
                
//                 </View>

//                 <View style={{flex: 0.3,alignItems:"center",justifyContent:"center",}}>
//                      <TouchableOpacity style={{width:width*0.2,height:height*0.05,borderColor:"gray",borderWidth:2,borderRadius:20,alignItems:"center",justifyContent:"center"}}>
//                              <FontAwesome name="cart-plus" size={24} color="gray"/> 
//                      </TouchableOpacity>   
//                </View>
//            </View>
//        )
//    }
  render() {
    return (
      <View style={{flex:1}}>
          <Toast style={{backgroundColor: 'red'}}  textStyle={{color: '#fff'}} ref="toast" position = 'center'/>
        
                       {/* HEADERS */}
                <View style={{marginTop:Constants.statusBarHeight,flexDirection:"row",backgroundColor:"#fff",height:height*0.07,alignItems:"center"}}>
                    <TouchableOpacity style={{flex:0.15,alignItems:"center",justifyContent:"center"}}
                    onPress ={()=>{this.props.navigation.openDrawer()}}
                    >
                            <FontAwesome name="bars" color={themecolor} size={23}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:0.6,borderWidth:2,borderColor:themecolor,height:height*0.04,alignItems:"flex-end",justifyContent:"center",borderRadius:width*0.035}}
                    onPress={()=>{this.props.navigation.navigate("SearchScreen2")}}
                    >
                        <EvilIcons name="search" color={themecolor} size={23}/>
                    </TouchableOpacity>
                    <View style={{flex:0.25,alignItems:"center",justifyContent:"center"}} >
                        <Image source ={require('../assets/sterlingsplash1.png')}  style={{height:"70%",width:"100%",resizeMode:"contain"}} />
                    </View>
                  
                    
                </View>
             <View style={{height:height*0.07,width:width}}>
                     <FlatList 
                   contentContainerStyle={{flexDirection:"row",alignItems:"center",justifyContent:'space-around'}}
                   horizontal={true}
                   data={this.state.Catagories}
                   keyExtractor={(item,index)=>index.toString()}
                   showsHorizontalScrollIndicator={false}
                   renderItem={({item,index})=>{
                       return(
                           <TouchableOpacity style={{paddingHorizontal:10}} 
                            onPress={()=>{this.setState({selected:item},()=>{
                                this.getProducts(item.pk)
                            })}}
                           >
                                <Text style={{color:(item.pk==this.state.selected.pk?themecolor:"#000")}}>{item.name}</Text>
                                {this.state.selected.pk==item.pk&&<View style={{borderColor:themecolor,borderWidth:2,marginTop:5}}>

                                </View>}
                           </TouchableOpacity>
                       )
                   }}
                 />
                </View>
                <FlatList
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
                     onEndReached={()=>{!this.state.loadFinished&&this.setState({loading:true,offset:this.state.offset+5},()=>{
                           this.updateProducts()
                     })}}
                     ListFooterComponent={this.footer()}
                     onEndReachedThreshold={0.1}
                /> 
                {
                  this.variantSelection()
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
export default connect(mapStateToProps, mapDispatchToProps)(CatogoryScreen);
 
   
     
    

