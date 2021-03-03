import React ,{useEffect, useState,Component} from 'react';
import { View, Text, TouchableOpacity ,Dimensions,Image, FlatList,ActivityIndicator} from 'react-native';
import settings from '../Appsettings'
import { AntDesign } from '@expo/vector-icons';


const themecolor = settings.themecolor
const url = settings.url
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default class Resolved extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
      const{navigation} = this.props
    return (
      <View style={{flex:1}}>
        <Text> Resolved </Text>
        <View style={{position:"absolute",bottom:height*0.05,right:30}}>
            <TouchableOpacity onPress={()=>{navigation.navigate("RaiseConcern")}}>
                  <AntDesign name="pluscircle" size={45} color={themecolor} />
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}
