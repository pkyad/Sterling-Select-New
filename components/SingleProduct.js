import * as React from 'react';
import { StatusBar, View, Text, Image, Dimensions, StyleSheet, Picker, TouchableOpacity, FlatList, Alert, Button, AsyncStorage ,ActivityIndicator,ToastAndroid,Platform,TouchableWithoutFeedback,ScrollView} from 'react-native';
import { FontAwesome,MaterialIcons } from '@expo/vector-icons';
import  Constants  from 'expo-constants';
import DropDownPicker from 'react-native-dropdown-picker';
import * as actionTypes from '../actions/actionTypes'
import Toast, {DURATION} from 'react-native-easy-toast';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import settings from '../Appsettings';
import { Feather } from '@expo/vector-icons';
const SERVER_URL = settings.url
const storeType = settings.storeType
const priceTitle = settings.priceTitle
const themeColor = settings.themecolor
//import { Dropdown } from 'react-native-material-dropdown';
import Modal from "react-native-modal";
//import { Text } from './StyledText';
import NetInfo from '@react-native-community/netinfo';
import HttpsClient from '../helpers/HttpsClient';
import { TouchableRipple } from 'react-native-paper';
const url = settings.url
const themecolor = settings.themecolor
export default class SingleProduct extends React.Component {
  constructor(props) {
    super(props);

    var prod = props.product;
    var cartLoaderShow=props.cartLoaderShow
    var customUnit = ''
    var varientChoices = []
    var varientChoicesName = []
    var varientChoicesText = []
    var listofPk = []
    var stock = []
    listofPk[0] = null
    var varientCount = []
    var varientCart = []
    var varientMinOrderQty = []
    var varientMaxOrderQty = []
    var image = prod.image
    var value2 = []
    var gstType=props.product.gstType
    var taxRate=0.00
    if(isFinite(String(props.product.taxRate))){
      taxRate = Number(props.product.taxRate).toFixed(2)
    }
    function getUnit(type,value){
      if(value!=null){
        var newValue = value
        if (type == 'Litre') {
          unit = 'L'
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
        }else if (type == 'Kilogram') {
          unit = 'kg'
        }else if (type == 'Quantity') {
          unit = 'Qty'
        }else{
          unit = type
        }
        return newValue+' '+unit
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

    prod.variant.sort((a,b)=>{
      var first = a.price-a.sellingPrice
      var second = b.price-b.sellingPrice
      if(a.stock==null||a.stock==0){
        first = 0
      }
      if(b.stock==null||b.stock==0){
        second = 0
      }
      return second-first
    })
    // prod.variant.forEach((i)=>{
    //   if(i.pk==257){
    //   }
    // })
    // var variantStock = []
    // prod.variant.forEach((i,index)=>{
    //   if(i.stock==null||i.stock==0){
    //     variantStock.push(index)
    //   }
    // })
    // var stockProducts = []
    // variantStock.forEach((i)=>{
    //   prod.variant.splice(i,1)
    //   stockProducts.push(prod.variant.splice(i,1))
    // })
    // stockProducts.forEach((i)=>{
    //   prod.variant.push(i)
    // })
    var salePrices = []

    for (var i = 0; i < prod.variant.length; i++) {
      var salePrice = prod.variant[i].sellingPrice
      if(taxRate!=null&&gstType=='gst_extra'){
          salePrice = salePrice+(salePrice*taxRate)/100
       }else{
        salePrice = salePrice
       }
       salePrices.push(salePrice)
      listofPk.push(prod.variant[i].pk)
      stock.push(prod.variant[i].stock)
      varientMinOrderQty.push(prod.variant[i].minQtyOrder)
      varientMaxOrderQty.push(prod.variant[i].maxQtyOrder)
      varientChoices.push(prod.variant[i].displayName)
      if(prod.variant[i].displayName!=null){
        if(prod.variant[i].value!=null){
          var unit =
          varientChoicesText.push(getUnit(prod.variant[i].unitType,prod.variant[i].value))
          }else{
            varientChoicesText.push(getUnit(prod.variant[i].unitType,null))
          }
      }else{
        varientChoicesText.push(getUnit(prod.variant[i].unitType,prod.variant[i].value))
      }
        if(prod.variant[i].displayName!=null){
        var showText = prod.variant[i].displayName.replace(prod.name,'')
      }else{
        var showText = ''
      }
        if(prod.variant[i].unitType == 'Size and Color'||prod.variant[i].unitType == 'Quantity and Color'){
          var text =  prod.variant[i].value
          var color = prod.variant[i].value2
          if(value2.includes(text)){
            var id = value2.indexOf(text)
            if(color!=null){
              varientChoicesName[id].value2.push({color:color,index:i})
              varientChoicesName.push(null)
            }
          }else{
            if(color==null){
              var arr = []
            }else{
              var arr = [{color:color,index:i}]
            }
            varientChoicesName.push({unit:'Size',showText:showText,label:text,color:color,value:i,value2:arr})
            value2.push(text)
          }
          customUnit = 'Size and Color'
        }else{
          varientChoicesName.push({unit:prod.variant[i].unitType,showText:showText,label:prod.variant[i].displayName.replace(prod.name,''),color:'#000000',value:i,value2:null})
          customUnit = prod.variant[i].unitType
        }

      varientCount.push(0)
      varientCart.push(null)
      if(i==0&&prod.variant[i].images.length>0){
        var image = prod.variant[i].images[0].attachment
      }
    }

    if(prod.variant[0]==undefined){
       var select = null
       var selectName = null
       var salePrice = null
       var discount = null
       var mrp = null
       var maxOrder = null
       var minOrder = null
       var sku = null
       var unit = null
       var unitPerpack = null
    }else{
      var select = prod.name
      if(prod.variant[0].value!=null){
        var selectName = prod.variant[0].value +' '+prod.variant[0].unitType
      }else{
        var selectName = prod.variant[0].unitType
      }
      var salePrice = prod.variant[0].sellingPrice
      if(taxRate!=null&&gstType=='gst_extra'){
          salePrice = salePrice+(salePrice*taxRate)/100
     }else{
      salePrice = salePrice
     }
      var discount = (prod.variant[0].price-salePrice)
      var mrp = prod.variant[0].price
      var maxOrder = prod.variant[0].maxQtyOrder
      var minOrder = prod.variant[0].minQtyOrder
      var sku = prod.variant[0].sku
      var unit = prod.variant[0].unitType
      var unitPerpack = prod.variant[0].displayName
    }


    this.state = {
      select: select,
      parentName: select,
      selectName: selectName,
      quantity: 1,
      product : props.product,
      varientChoices : varientChoices,
      inCart : 0,
      pkList:listofPk,
      mrp : mrp,
      stock:stock,
      inStock:stock[0],
      salePrice : salePrice,
      discount : discount,
      dp : SERVER_URL +image,
      maxOrder : maxOrder,
      minOrder : minOrder,
      selectedPk : null,
      selectedIndex : 0,
      varientCount : varientCount,
      varientCart : varientCart,
      selectedQty: 1,
      sku : sku,
      unit:unit,
      unitPerpack:unitPerpack,
      store:props.store,
      selectedStore:props.selectedStore,
      varientChoicesName:varientChoicesName,
      varientChoicesText:varientChoicesText,
      user:null,
      sessionid:null,
      csrf:null,
      cartItems:props.cartItems,
      customUnit:customUnit,
      selectedIdx:0,
      colorIndex:0,
      modalVisible:false,
      taxRate:taxRate,
      gstType:gstType,
      indexFind:props.index,
      cartLoder:cartLoaderShow,
      alias:props.product.alias,
      taxRate:taxRate,
      salePrices:salePrices,
      login:false,
      cartLoaderShow:cartLoaderShow,

    }
  }





  UNSAFE_componentWillReceiveProps({cartItems,cartLoaderShow}){

    var varientCount = this.state.varientCount;
    var varientCart = this.state.varientCart;
    for (var i = 0; i < varientCount.length; i++) {
      varientCount[i] = 0
    }
    cartItems.forEach((item,idx)=>{
      // if(item.store==this.state.selectedStore.pk){
        this.state.product.variant.forEach((i,id)=>{
          if(item.pk == i.pk ){
            varientCount[id] = cartItems[idx].count
            // varientCart[id] = cartItems[idx].cart
          }
        })
      // }
    })
    this.setState({varientCount:varientCount,varientCart:varientCart})
    if(this.props.cartLoaderShow!=cartLoaderShow){
      this.setState({cartLoder:cartLoaderShow})
    }
    // this.setState({inCart:this.state.varientCount[this.state.selectedIndex]})
    // this.dropDownChanged(this.state.varientChoicesText[this.state.selectedIndex],this.state.selectedIndex)
    this.getUser()

  }
  getUser=async()=>{
    var login =  await AsyncStorage.getItem('login');
    if(JSON.parse(login)){
      var pk =  await AsyncStorage.getItem('userpk');
      var csrf =  await AsyncStorage.getItem('csrf');
      var sessionid =  await AsyncStorage.getItem('sessionid');
      var login =  await AsyncStorage.getItem('login');
      this.setState({user:pk,csrf:csrf,sessionid:sessionid,login:login})
    }else{
      this.setState({user:pk,csrf:csrf,sessionid:sessionid,login:false})
    }
  }
  componentDidMount() {
    var varientCount = this.state.varientCount;
    var varientCart = this.state.varientCart;
    for (var i = 0; i < varientCount.length; i++) {
      varientCount[i] = 0
    }
    this.state.cartItems.forEach((item,idx)=>{
      // if(item.store==this.state.selectedStore.pk){
        this.state.product.variant.forEach((i,id)=>{
          if(item.pk == i.pk ){
            varientCount[id] = this.state.cartItems[idx].count
            // varientCart[id] = this.state.cartItems[idx].cart
          }
        })
      // }
    })
    this.setState({varientCount:varientCount,varientCart:varientCart})
    this.setState({inCart:this.state.varientCount[this.state.selectedIndex]})
    this.getUser()
  }

  dropDownChanged = (itemValue, itemIndex) => {
   this.setState({selectedIndex : itemIndex ,})

    var image = this.state.product.image
    var variant = this.state.product.variant[itemIndex]
    var salePrice = variant.sellingPrice
    if(variant.images.length>0){
      var image = variant.images[0].attachment
    }
    if(this.state.gstType=='gst_extra'){
      salePrice = salePrice*(1.00+this.state.taxRate/100)
    }

    var discount = variant.price-salePrice

    this.setState({dp : SERVER_URL + image, mrp : variant.price ,   selectedPk : variant.pk,discount:discount, inCart : this.state.varientCount[itemIndex],  sku : variant.sku,unit:variant.unitType,unitPerpack:variant.displayName,inStock:variant.stock})
    this.setState({maxOrder:variant.maxQtyOrder,minOrder:variant.minQtyOrder})
    this.setState({ selectName:itemValue})
    // this.setState({ selectName:itemValue,})

    }
  changeParent = (itemValue, itemIndex)  =>{
    this.setState({selectedIdx:itemIndex})
    var image = this.state.product.image
    var variant = this.state.product.variant[itemIndex]

    if(variant.images.length>0){
      var image = variant.images[0].attachment
    }
    this.setState({dp : SERVER_URL + image, mrp : variant.price , salePrice : variant.sellingPrice , discount : variant.price-variant.sellingPrice, selectedPk : variant.pk, selectedIndex : itemIndex , sku : variant.sku,unit:variant.unitType,unitPerpack:variant.displayName,inStock:this.state.stock[itemIndex]})
    this.setState({ selectName:itemValue,colorIndex:0})
    // this.setState({ select: this.state.varientChoices[itemIndex],selectName:itemValue,colorIndex:0})
  }
  changeItem = (colorIndex,itemIndex) => {

    this.setState({colorIndex:colorIndex})
    var image = this.state.product.image
    var variant = this.state.product.variant[itemIndex]

    if(variant.images.length>0){
      var image = variant.images[0].attachment
    }
    this.setState({dp : SERVER_URL + image, mrp : variant.price , salePrice : variant.sellingPrice , discount : variant.price-variant.sellingPrice, selectedPk : variant.pk,  selectedIndex : itemIndex , sku : variant.sku,unit:variant.unitType,unitPerpack:variant.displayName,inStock:this.state.stock[itemIndex]})
    // this.setState({ select: this.state.varientChoices[itemIndex] })

    }



  dropDownChangedIos = (itemValue, itemIndex) => {
    if(itemIndex == -1){
      itemIndex = 0
    }
    var image = this.state.product.image
    var variant = this.state.product.variant[itemIndex]

    if(variant.images.length>0){
      var image = variant.images[0].attachment
    }
    this.setState({dp : SERVER_URL + image, mrp : variant.price , salePrice : variant.sellingPrice , discount : variant.price-variant.sellingPrice, selectedPk : variant.pk, inCart : this.state.varientCount[itemIndex], selectedIndex : itemIndex , sku : variant.sku,unit:variant.unitType,unitPerpack:variant.displayName,inStock:variant.stock})
    this.setState({maxOrder:variant.maxQtyOrder,minOrder:variant.minQtyOrder})
    // this.setState({ select: itemValue })
  }


  addToCartUpdate = async()=>{
    const pk = await AsyncStorage.getItem("Pk")

    NetInfo.fetch().then(state => {
      if(state.isConnected){
     var selected = this.state.product.variant[this.state.selectedIndex]
     var obj = {productVariant:selected.pk,store:this.state.selectedStore.pk,count:selected.minQtyOrder,type:actionTypes.ADD_TO_CART,}
     if(pk!=null){
     this.postServiceCart(obj)
     }else{
         this.props.navigation.navigate("SterlingLogin")
     }

   
  }
})
  }

  cartDataUpdate=async(obj)=>{
    this.setState({cartLoder:true})

    var sessionid =  this.state.sessionid;
    var csrf = this.state.csrf;

     console.log(obj.count,'jjjjjjjjjjjjjjjj');
      var data = {
        productVariant:obj.productVariant,
        store:obj.store,
        qty:obj.count
       }
       var api = `${url}/api/POS/cartService/`
       let cartUpdate = await HttpsClient.post(api,data)
       if(cartUpdate.type =="success"){
           this.setState({cartLoder:false})

           
             
                
                obj.pk = cartUpdate.data.pk
                obj.count = cartUpdate.data.qty
                this.setState({inCart : cartUpdate.data.qty})
                if(cartUpdate.data.qty==0){
                  obj.type = 'delete'
                }
                this.props.onChange(obj)
                this.props.setCounterAmount(cartUpdate.data.cartQtyTotal,cartUpdate.data.cartPriceTotal,cartUpdate.data.saved)
       
    }
        //  fetch(SERVER_URL +'/api/POS/cartService/' , {
        //   method: 'POST',
        //   headers:{
        //     "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json',
        //     'Referer': SERVER_URL+'/api/POS/cartService/',
        //     'X-CSRFToken': csrf
        //   },
        //   credentials: 'omit',
        //   body: JSON.stringify(data)
        // })
        //   .then((response) => {
        //     console.log(response.status,'ptjhujthiop');
        //     if(response.status==201||response.status==200){
        //       return response.json()
        //     }else{
        //       return undefined
        //     }
        //   })
        //   .then((responseJson) => {
        //     this.setState({cartLoder:false})

        //     console.log(responseJson,'ptjhujthiop');
        //       if(responseJson!=undefined){
        //         if(responseJson.msg.length>0){
        //           this.refs.toast.show(responseJson.msg)
        //         }
        //         obj.pk = responseJson.pk
        //         obj.count = responseJson.qty
        //         this.setState({inCart : responseJson.qty})
        //         if(responseJson.qty==0){
        //           obj.type = 'delete'
        //         }
        //         this.props.onChange(obj)
        //         this.props.setCounterAmount(responseJson.cartQtyTotal,responseJson.cartPriceTotal,responseJson.saved)
        //       }

        //   }).catch((err)=>{
        //     this.setState({cartLoder:false})
        //   })


  }

  postServiceCart = async(obj)=>{
    this.setState({cartLoder:true})

    var sessionid =  this.state.sessionid;
    var csrf = this.state.csrf;

      var data = {
        productVariant:obj.productVariant,
        store:obj.store,
        qty:obj.count,
       }
        var api =`${url}/api/POS/cartService/`
        let postItem = await HttpsClient.post(api,data)
      console.log(postItem,"hjhjj");
      if(postItem.type=="success"){
          this.setState({cartLoder:false})
            
           
              obj.pk = postItem.data.pk
              obj.count = postItem.data.qty
              this.setState({inCart : postItem.data.qty})
              this.props.onChange(obj)
              this.props.setCounterAmount(postItem.data.cartQtyTotal,postItem.data.cartPriceTotal,postItem.data.saved)
      }else{
          this.setState({cartLoder:false})
          
      }
        // fetch(SERVER_URL +'/api/POS/cartService/' , {
        //   method: 'POST',
        //   headers:{
        //     "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json',
        //     'Referer': SERVER_URL+'/api/POS/cartService/',
        //     'X-CSRFToken': csrf
        //   },
        //   credentials: 'omit',
        //   body: JSON.stringify(data)
        // })
        //   .then((response) => {
        //     console.log(response.status,'responseresponse');
        //     if(response.status==201||response.status==200){
        //       return response.json()
        //     }else{
        //       return undefined
        //     }
        //   })
        //   .then((responseJson) => {
        //     this.setState({cartLoder:false})
        //     console.log(responseJson,'responseresponse');
        //     if(responseJson!=undefined){
        //       if(responseJson.msg.length>0){
        //         this.refs.toast.show(responseJson.msg)
        //       }
        //       obj.pk = responseJson.pk
        //       obj.count = responseJson.qty
        //       this.setState({inCart : responseJson.qty})
        //       this.props.onChange(obj)
        //       this.props.setCounterAmount(responseJson.cartQtyTotal,responseJson.cartPriceTotal,responseJson.saved)
        //     }

        //   }).catch((err)=>{

        //     this.setState({cartLoder:false})
        //   })

  }
  postCart = (obj,varientCount)=>{

    var sessionid =  this.state.sessionid;
    var csrf = this.state.csrf;
    if(obj.user != null){
      this.setState({cartLoder:true})
      var data = {
        product:obj.product,
        productVariant:obj.productVariant,
        store:obj.store,
        qty:obj.count,
       }
       NetInfo.fetch().then(state => {
         if(state.isConnected){
        fetch(SERVER_URL +'/api/POS/cart/' , {
          method: 'POST',
          headers:{
            "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Referer': SERVER_URL+'/api/POS/cart/',
            'X-CSRFToken': csrf
          },
          credentials: 'omit',
          body: JSON.stringify(data)
        })
          .then((response) => {
            if(response.status==201||response.status==200){
              return response.json()
            }else{
              return undefined
            }
          })
          .then((responseJson) => {
            if(responseJson!=undefined){
            obj.product = responseJson.product.pk,
            obj.productVariant = responseJson.productVariant.pk,
            obj.store = responseJson.store,
            obj.count = responseJson.qty,
            obj.sellingPrice = responseJson.sellingPrice,
            obj.mrp = responseJson.productVariant.price,
            obj.discount = responseJson.price-responseJson.sellingPrice,
            obj.bulkChart = responseJson.bulk,
            obj.discountedPrice = responseJson.sellingPrice
            obj.cart = responseJson.pk
            obj.count = responseJson.qty
            obj.addon = responseJson.addon
            obj.customDetails = responseJson.customDetails
            obj.customFile = responseJson.customFile
            obj.is_fav = responseJson.is_fav
            obj.is_changed = responseJson.is_changed
            obj.taxPrice = responseJson.taxPrice
            obj.taxRate = responseJson.product.taxRate
            obj.addonPrice = responseJson.addonPrice
            obj.bulkDiscount = responseJson.bulkDiscount
            obj.promoValue = responseJson.promoValue
            obj.totalPrice = responseJson.price
              // this.setState({ inCart: responseJson.qty  , varientCount : varientCount })
              if(responseJson.qty>0){
              this.props.onChange(obj)
            }
            }
            this.setState({cartLoder:false})
          }).catch((err)=>{
            this.setState({cartLoder:false})
          })
        }else{
          this.setState({cartLoder:false})
        }
      })

    }else{
      obj.count = obj.count
      obj.cart = obj.cart
      this.setState({ inCart: obj.count , varientCount : varientCount })
      this.props.onChange(obj)

    }
  }
  cartUpdate =(obj,type)=>{
    var sessionid =  this.state.sessionid;
    var csrf = this.state.csrf;
    if(type=='increase'){
      var qty = obj.count+1
    }else{
      var qty = obj.count-1
    }
    if(obj.user != null){
     this.setState({cartLoder:true})
      var data = {
        qty:qty,
       }
       NetInfo.fetch().then(state => {
         if(state.isConnected){
         fetch(SERVER_URL +'/api/POS/cart/'+obj.cart+'/' , {
          method: 'PATCH',
          headers:{
            "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Referer': SERVER_URL+'/api/POS/cart/'+obj.cart+'/',
            'X-CSRFToken': csrf
          },
          credentials: 'omit',
          body: JSON.stringify(data)
        })
          .then((response) => {
            if(response.status==201||response.status==200){
              return response.json()
            }else{
              return undefined
            }
          })
          .then((responseJson) => {
            if(responseJson!=undefined){
              obj.product = responseJson.product.pk,
            obj.productVariant = responseJson.productVariant.pk,
            obj.store = responseJson.store,
            obj.count = responseJson.qty,
            obj.sellingPrice = responseJson.sellingPrice,
            obj.mrp = responseJson.productVariant.price,
            obj.discount = responseJson.price-responseJson.sellingPrice,
            obj.bulkChart = responseJson.bulk,
            obj.discountedPrice = responseJson.sellingPrice
            obj.cart = responseJson.pk
            obj.count = responseJson.qty
            obj.addon = responseJson.addon
            obj.customDetails = responseJson.customDetails
            obj.customFile = responseJson.customFile
            obj.is_fav = responseJson.is_fav
            obj.is_changed = responseJson.is_changed
            obj.taxPrice = responseJson.taxPrice
            obj.taxRate = responseJson.product.taxRate
            obj.addonPrice = responseJson.addonPrice
            obj.bulkDiscount = responseJson.bulkDiscount
            obj.promoValue = responseJson.promoValue
            obj.totalPrice = responseJson.price
              var varientCount = this.state.varientCount;
              varientCount[this.state.selectedIndex] = responseJson.qty
              this.setState({ inCart: responseJson.qty , varientCount : varientCount })
              this.props.onChange(obj)
            }
            this.setState({cartLoder:false})
          }).catch((err)=>{
            this.setState({cartLoder:false})
          })
        }else{
           this.setState({cartLoder:false})
        }
          })

    }else{
      var varientCount = this.state.varientCount;
      varientCount[this.state.selectedIndex] = qty
      this.setState({ inCart: qty , varientCount : varientCount })
      this.props.onChange(obj)
    }
  }

  increaseCart = ()=>{
    var varientCount = this.state.varientCount;

    NetInfo.fetch().then(state => {
      if(state.isConnected){
    var selected = this.state.product.variant[this.state.selectedIndex]
    // if(this.state.user==null){
    //   this.props.navigation.navigate('LogInScreen')
    //   return
    // }
    var obj = {productVariant:selected.pk,store:this.state.selectedStore.pk,count:varientCount[this.state.selectedIndex]+1,type:actionTypes.INCREASE_CART,}
    this.cartDataUpdate(obj)
    // if (varientCount[this.state.selectedIndex] >= selected.maxQtyOrder) {
    //   this.refs.toast.show('You cannot order more than '+ selected.maxQtyOrder);
    // //   var msg = 'You cannot order more than '+ selected.maxQtyOrder
    // //   ToastAndroid.showWithGravityAndOffset(
    // //   `You cannot order more than +${selected.maxQtyOrder}`,
    // //   ToastAndroid.SHORT, //can be SHORT, LONG
    // //   ToastAndroid.CENTER, //can be TOP, BOTTON, CENTER
    // //   25,
    // //   50
    // // );
    //   return;
    // }
    // if (varientCount[this.state.selectedIndex] >= selected.stock) {
    //   this.refs.toast.show('We have only '+ selected.stock+' pcs available right now');
    //   return;
    // }
    // var image = selected.images.length>0?selected.images[0].attachment:null
    //
    // var totalPrice = selected.sellingPrice
    // var taxRate = this.state.product.taxRate
    // var gstType = this.state.product.gstType
    // var taxPrice = 0
    // if(gstType=='gst_extra'&&taxRate!=null){
    //   totalPrice = totalPrice+(totalPrice*taxRate)/100
    //   taxPrice = (selected.sellingPrice*taxRate)/100
    // }
    // if(taxRate==null){
    //   taxRate = 0
    // }
    //
    // var obj = {product:this.state.product.pk,taxPrice:taxPrice,totalPrice:totalPrice*(varientCount[this.state.selectedIndex]+1),taxRate:taxRate,productVariant:selected.pk,store:this.state.selectedStore.pk,count:varientCount[this.state.selectedIndex],type:actionTypes.INCREASE_CART,customizable:selected.customizable,sellingPrice:selected.sellingPrice,mrp:selected.price,stock:selected.stock,discount:selected.price-selected.sellingPrice,maxQtyOrder:selected.maxQtyOrder,minQtyOrder:selected.minQtyOrder,dp:image,displayName:selected.displayName,user:this.state.user,cart:this.state.varientCart[this.state.selectedIndex],bulkChart:null,discountedPrice:selected.sellingPrice}
    // this.cartUpdate(obj,'increase')

  }
})

  }


  decreaseCart = ()=>{
    var varientCount = this.state.varientCount;

    NetInfo.fetch().then(state => {
      if(state.isConnected){
    var selected = this.state.product.variant[this.state.selectedIndex]
    // if(this.state.user==null){
    //   this.props.navigation.navigate('LogInScreen')
    //   return
    // }
    var obj = {productVariant:selected.pk,store:this.state.selectedStore.pk,count:varientCount[this.state.selectedIndex]-1,type:actionTypes.DECREASE_FROM_CART,}
    this.cartDataUpdate(obj)

    // if (this.state.inCart <= selected.minQtyOrder) {
    //     // this.setState({inCart:0})
    //     var incart = 0
    // }

    // if (this.state.minQtyOrder!=undefined&&varientCount[this.state.selectedIndex] <= this.state.minQtyOrder) {
    //     var incart = 0
    // }else{
    //   var incart = varientCount[this.state.selectedIndex]
    // }
    //
    //
    // var image = selected.images.length>0?selected.images[0].attachment:null
    //
    // var totalPrice = selected.sellingPrice
    // var taxRate = this.state.product.taxRate
    // var gstType = this.state.product.gstType
    // var taxPrice = 0
    // if(gstType=='gst_extra'&&taxRate!=null){
    //   totalPrice = totalPrice+(totalPrice*taxRate)/100
    //   taxPrice = (selected.sellingPrice*taxRate)/100
    // }
    // if(taxRate==null){
    //   taxRate = 0
    // }
    // var obj = {product:this.state.product.pk,taxRate:taxRate,taxPrice:taxPrice,totalPrice:totalPrice*(varientCount[this.state.selectedIndex]-1),productVariant:selected.pk,store:this.state.selectedStore.pk,count:varientCount[this.state.selectedIndex],type:actionTypes.DECREASE_FROM_CART,customizable:selected.customizable,sellingPrice:selected.sellingPrice,mrp:selected.price,stock:selected.stock,discount:selected.price-selected.sellingPrice,maxQtyOrder:selected.maxQtyOrder,minQtyOrder:selected.minQtyOrder,dp:image,displayName:selected.displayName,user:this.state.user,cart:this.state.varientCart[this.state.selectedIndex],bulkChart:null,discountedPrice:selected.sellingPrice}
    //
    // if(obj.count>selected.minQtyOrder&&obj.count>0){
    //   this.cartUpdate(obj,'decrease')
    // }else{
    //   this.removeCart(obj)
    // }
  }
})
  }

  removeCart=(obj)=>{
    NetInfo.fetch().then(state => {
      if(state.isConnected){
    var sessionid =  this.state.sessionid;
    var csrf = this.state.csrf;
    if(obj.user != null){
      this.setState({cartLoder:true})
      NetInfo.fetch().then(state => {
        if(state.isConnected){
      fetch(SERVER_URL +'/api/POS/cart/'+obj.cart+'/' , {
        method: 'DELETE',
        headers:{
          "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Referer': SERVER_URL,
          'X-CSRFToken': csrf
        },
        credentials: 'omit',
      })
        .then((response) => {
          if(response.status==201||response.status==200||response.status==204){
            obj.type ='delete'
            this.props.onChange(obj)
            return
          }
          })
        .then((responseJson) => {
          this.setState({cartLoder:false})
          return
        }).catch((err)=>{
          this.setState({cartLoder:false})
        })
      }else{
      this.setState({cartLoder:false})
      }
    })
    }else{
      obj.type ='delete'
      this.props.onChange(obj)
    }
  }
})
  }

  openVarientSelection=()=>{
    var variantChoices = this.state.varientChoicesText.map((s, i) => {
      return {name:s,sellingPrice:this.state.salePrices[i],mrp:this.state.product.variant[i].price}
    })
    var obj = {name:this.state.select,variants:variantChoices,selectedIndex:this.state.selectedIndex,indexFind:this.state.indexFind}
    this.props.openVariantSelection(obj)
  }

  renderOption=(settings)=>{
    var { item, getLabel } = settings
    return (
      <View style={styles.optionContainer}>
        <View style={styles.innerContainer}>
          <View style={[styles.box, { backgroundColor: item.color }]} />
          <Text style={{ color: item.color,  alignSelf: 'flex-start' }}>{getLabel(item)}</Text>
        </View>
      </View>
    )
  }

  showHide=()=>{
    this.setState({modalVisible:!this.state.modalVisible})
  }

  cartActions=()=>{
      let {gstType,taxRate} = this.state

    let varientChoicesText = this.state.varientChoicesText.map( (s, i) => {
      return <Picker.Item key={i} value={s} label={s}  ></Picker.Item>
    });
    let varientChoicesName = this.state.varientChoicesName.map( (s, i) => {
      if(s!=null&&s!=undefined){
        return <Picker.Item key={i} value={s.showText} label={s.showText}  ></Picker.Item>
      }
    });
 

    let varientChoicesIos = this.state.varientChoices.map( (s, i) => {
       return {label:s,value:s}
    });
    let units = this.state.select

    if(this.state.cartLoder){
        return(
            <View style={{width: width * 0.16, height: 27, alignItems:'center',marginTop:5,justifyContent:'center'}}><ActivityIndicator size={20} color={themeColor} /></View>
        )
    }else{
        if(this.state.varientCount[this.state.selectedIndex] == 0){
           
            return(
                 <TouchableOpacity style={{flexDirection:"row",backgroundColor:themecolor,width:width*0.5,borderRadius:10,alignItems:"center",justifyContent:'center',height:height*0.05}}
                   onPress={this.addToCartUpdate}
                 >
                            <Text style={{color:'#fff',marginRight:10,fontWeight:"bold"}}>ADD TO</Text>
                            <Feather name="shopping-cart" size={24} color="#fff" style={{marginRight:10}}/>
                    </TouchableOpacity>
            )
        }else{
            return(
           <View style={{flexDirection:"row",width:width*0.5,borderColor:"gray",borderWidth:2,borderRadius:10,alignItems:'center',justifyContent:"space-around"}}>
              <TouchableOpacity style={{}}
                onPress={this.decreaseCart}
              >
                  <Text style={{color:"gray",fontSize:25,fontWeight:"bold"}}>-</Text>
              </TouchableOpacity>
              <Text style={{color:themeColor}}>
              {this.state.varientCount[this.state.selectedIndex]}
              </Text>
              <TouchableOpacity style={{}}
                onPress={this.increaseCart}
              >
                  <Text style={{color:"gray",fontSize:20,fontWeight:"bold"}}>+</Text>
              </TouchableOpacity>
           </View>
            )
        }
    }
                      
                    //     <TouchableOpacity style={{flexDirection:"row",backgroundColor:themecolor,width:"70%",borderRadius:10,alignItems:"center",justifyContent:"center",paddingVertical:5}}
                    //   onPress={this.addToCartUpdate}
                    //     >
                    //         <Text style={{color:'#fff'}}>ADD TO</Text>
                    //         <Feather name="shopping-cart" size={24} color="#fff" />
                    // </TouchableOpacity>
  }


  render(){
       var item = this.props.product
    return (
  <View style={{height:height*0.2,alignItems:'center',justifyContent:"center"}}>
                       <View style={{flex:0.33,alignItems:"center",justifyContent:'center'}}>
                           <Text style={{color:"green",fontWeight:"bold"}}>Selling Price</Text>
                       </View>
                       <View style={{flex:0.33,flexDirection:"row",alignItems:"center",justifyContent:'center'}}>
                            <View style={{flex:0.33,alignItems:"center",justifyContent:"center"}}>
                                 {
                                 this.state.varientChoicesName.length <=1 && this.state.customUnit!='Size and Color'&&this.state.varientChoicesName[0]!=undefined&&
                            
                                 <Text>{this.state.varientChoicesText[0]}</Text>
                            
                                  }
                                    { (this.state.customUnit!='Size and Color'&&this.state.varientChoices.length >1)  &&
                             <TouchableOpacity style={{flexDirection:'row',alignItems:"center",justifyContent:'center',borderColor:'#000',borderWidth:1}}
                               onPress={()=>{this.openVarientSelection()}}
                             >
                                   <Text>{this.state.varientChoicesText[this.state.selectedIndex]}</Text>
                                   <View>
                                       <MaterialIcons name={'arrow-drop-down'} color={themeColor} size={30} />
                                   </View>
                             </TouchableOpacity>
                         }
                            </View>
                            <View style={{flex:0.33,alignItems:"center",justifyContent:"center"}}>
                               <Text style={{color:themecolor,fontWeight:"bold",fontSize:30}}>₹{Math.round(this.state.salePrices[this.state.selectedIndex])}</Text>
                            </View>
                            <View style={{flex:0.33,alignItems:"center",justifyContent:"center"}}>
                               <Text style={{color:"gray",fontWeight:"bold",fontSize:20,textDecorationLine:"line-through"}}>₹{Math.round(this.state.mrp)}</Text>
                                
                            </View>
                       </View>
                       <View style={{flex:0.33,alignItems:"center",justifyContent:"center"}}>
                              {this.state.inStock!=null&&this.state.inStock < 1 &&
                            <View style={{alignItems:'center',justifyContent:'center',height:27,paddingHorizontal:5,backgroundColor: 'red' ,marginTop:5,}}>
                                <Text style={{ color: '#fff',  fontSize: 13, fontWeight: '300', textAlign: 'center',  borderWidth: 0, }}>SOLD OUT</Text>
                            </View>
                        }
                        {this.state.inStock ==null &&
                            <View style={{alignItems:'center',justifyContent:'center',height:27,paddingHorizontal:5,backgroundColor: 'red' ,marginTop:5,}}>
                                <Text style={{ color: '#fff',  fontSize: 13, fontWeight: '300', textAlign: 'center',  borderWidth: 0,  }}>SOLD OUT</Text>
                            </View>
                        }
                         {this.state.inStock!=null&&this.state.inStock >= 1 &&
                            <View>
                                {this.cartActions()}
                            </View>
                        }
                           
                       </View>
         </View>
      

    );
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
  modalView: {
     backgroundColor: '#fff',
     marginHorizontal: width-30 ,
     borderRadius:5,
    },
})

const pickerVarientStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 12,
    height: 25, width: width * 0.30 ,
    paddingLeft:3,
    color: '#000',
    borderWidth: 1,
    borderColor:'red'// to ensure the text is never behind the icon
  },
});


// <Picker
//   selectedValue={this.state.selectName}
//   mode="dropdown"
//   style={{ flex:1,height:25, width: this.state.store.quickadd?(width * 0.27):(width * 0.54) }}
//   onValueChange={(itemValue, itemIndex)=>this.dropDownChanged(itemValue, itemIndex)}>
//   {varientChoicesText}
// </Picker>


// <TouchableWithoutFeedback onPress={()=>{if(this.state.store.quickadd) return;this.props.navigation.navigate('ProductDetails',{product:this.state.product.pk,userScreen:this.props.userScreen})}}>
//   <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 10 }}>
//     <View style={{ width: width * 0.27, paddingHorizontal: 3, paddingVertical: 2, borderWidth: 1, borderColor: themeColor, borderRadius: 3, marginRight: 10 }}>
//       <Text style={{ textAlign: 'center', color: 'black' }}>Save</Text>
//       <Text style={{ textAlign: 'center', color: 'red' }}>&#8377;{Math.round(this.state.discount)}</Text>
//     </View>
//     <View >
//       <Text style={{ color: '#a2a2a2', marginTop: 2, fontSize: 14 }}>MRP &#8377;{this.state.mrp}</Text>
//       <Text style={{ color: themeColor, marginTop: 1, fontSize: 14 }}>{priceTitle} &#8377;{Math.round(this.state.salePrice)}</Text>
//     </View>
//   </View>
//   </TouchableWithoutFeedback>
