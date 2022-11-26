import { createStackNavigator } from '@react-navigation/stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View,Text, TouchableOpacity} from "react-native";
import {Feather, FontAwesome } from "@expo/vector-icons";
import { AppContext } from '../context/AppContext';
const RootStack = createStackNavigator();
const Contact = ({navigation,route}) =>{
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "CONTACT US",
            headerTintColor: '#757575',
            headerTitleStyle: {
                fontWeight: '900',
                fontSize:16,
                fontFamily:fontFamilyObj.fontBold
            },
        }}/>
        </RootStack.Navigator>
    )
};
const PageContent = ({navigation}) =>{
    const {appState:{accountInfo,nativeLink,fontFamilyObj:{fontBold,fontLight}} } = useContext(AppContext);
    return(
        <View style={styles.container}>
            <View style={{marginBottom:30}}>
                <View style={{backgroundColor:'#2277BA',padding:20,borderRadius:10}}><Text style={{fontFamily:fontBold,color:'#fff'}}>ACCOUNT ENQUIRY</Text></View>
                <TouchableOpacity style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{flex:1}}><Feather name='user' color='#757575' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontBold}}> HENRY VAN DYK</Text></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nativeLink('email',{phoneNumber:'henry@global.co.za'})} style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{flex:1}}><Feather name='mail' color='#757575' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontLight}}>henry@global.co.za</Text></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nativeLink('call',{phoneNumber:'+27 82 374 7083'})} style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{flex:1}}><Feather name='phone' color='#757575' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontBold}}>+27 82 374 7083</Text></View>
                </TouchableOpacity>
            </View>

            <View style={{marginBottom:30}}>
                <View style={{backgroundColor:'#2277BA',padding:20,borderRadius:10}}><Text style={{fontFamily:fontBold,color:'#fff'}}>CONTENT ENQUIRY & FEEDBACK</Text></View>
                <TouchableOpacity style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{flex:1}}><Feather name='user' color='#757575' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontBold}}>LIZETTE VAN DER WALT</Text></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nativeLink('email',{phoneNumber:'Ivdw@global.co.za'})} style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{flex:1}}><Feather name='mail' color='#757575' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontLight}}>Ivdw@global.co.za</Text></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nativeLink('call',{phoneNumber:'+27 83 272 5245'})} style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{flex:1}}><Feather name='phone' color='#757575' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontBold}}>+27 83 272 5245</Text></View>
                </TouchableOpacity>
            </View>
        </View>
    )
};
export default Contact;
const styles = StyleSheet.create({
    searchInputHolder:{
        height:40,
        borderRadius:10,
        flexDirection:'row',
        borderWidth:0.5,
        borderColor:'#a8a6a5'
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop:5,
        borderRadius:10,
        elevation:5,
        padding:10
    },
    myBubble:{
        backgroundColor:'#7ab6e6',
        padding:5,
        minWidth:100,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});