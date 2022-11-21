import { createStackNavigator } from '@react-navigation/stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View,Text, TouchableOpacity} from "react-native";
import {Feather, AntDesign } from "@expo/vector-icons";
import { AppContext } from '../context/AppContext';
const RootStack = createStackNavigator();
const Profile = ({navigation,route}) =>{
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "MY ACCOUNT",
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
    const {appState:{accountInfo,setConfirmDialog,logout,fontFamilyObj:{fontBold,fontLight}} } = useContext(AppContext);
    return(
        <View style={styles.container}>
            <View style={{marginBottom:30}}>
                <View style={{backgroundColor:'#48933F',padding:20,borderRadius:10}}><Text style={{fontFamily:fontBold,color:'#fff'}}>{accountInfo?.firstname}</Text></View>
                <TouchableOpacity style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{flex:1}}><Feather name='twitter' color='#757575' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontBold}}> TWITTER</Text></View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{flex:1}}><Feather name='facebook' color='#757575' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontBold}}>Facebook</Text></View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{flex:1}}><Feather name='star' color='#757575' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontBold}}>Rate This App</Text></View>
                </TouchableOpacity>
            </View>

            <View style={{marginBottom:30}}>
                <TouchableOpacity style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontBold}}>Terms Of Use</Text></View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',marginTop:5,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontBold}}>Privacy Policy</Text></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setConfirmDialog({isVisible:true,text:`Would you like to logout? Your phone number and password may be required the next time you sign in.`,okayBtn:'NOT NOW',cancelBtn:'LOGOUT',response:(res) => { 
                        if(!res){
                          logout();
                          navigation.navigate("Login")
                        }
                    }})
                }} style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{flex:1}}><AntDesign name='logout' color='tomato' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontBold, color:'tomato'}}>Sign Out</Text></View>
                </TouchableOpacity>
            </View>
        </View>
    )
};
export default Profile;
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