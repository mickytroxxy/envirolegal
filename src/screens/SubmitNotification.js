import { createStackNavigator } from '@react-navigation/stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View, ScrollView,TouchableOpacity,Text} from "react-native";
import {Feather, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/AppContext';
import AisInput from '../components/forms/AisInput';
import { createData, getNotificationTokens } from '../context/Api';
const RootStack = createStackNavigator();
const SubmitNotification = ({navigation}) =>{
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "SEND NOTIFICATION",
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
    const {appState:{fontFamilyObj:{fontBold},showToast,setConfirmDialog,sendPushNotification} } = useContext(AppContext);
    const [formData,setFormData] = useState({subject:'',body:''});
    const [isSubmitted,setIsSubmitted] = useState(false);
    const handleChange = (field,value) => setFormData(v =>({...v, [field] : value}));
    const sendNotification = () =>{
        const {subject,body} = formData;
        if(subject !== '' && body !== ''){
            setConfirmDialog({isVisible:true,text:`Press SUBMIT button to send your notification to all users`,okayBtn:'SUBMIT',cancelBtn:'CANCEL',response:(res) => { 
                if(res){
                    const id = Math.floor(Math.random()*8999999+1000009).toString();
                    const obj = {...formData,id}
                    createData('notifications',id,obj);
                    getNotificationTokens((notificationTokens) => {
                        notificationTokens.length > 0 && notificationTokens.map((item) => {
                            sendPushNotification(item.notificationToken,subject,body,{})
                        })
                        setIsSubmitted(true);
                    })
                }
            }})
        }else{
            showToast("Please fill in carefully before proceeding!")
        }
    }
    return(
        <View style={styles.container}>
            <LinearGradient colors={["#fff","#fff","#fff","#A2DDF3"]} style={{flex:1,paddingTop:10,borderRadius:10}}>
                {!isSubmitted && (
                    <ScrollView style={{padding:10}}>
                        <AisInput attr={{field:'subject',icon:{name:'list',type:'Feather',min:5,color:'#5586cc'},keyboardType:null,placeholder:'Title...',color:'#009387',handleChange}} />
                        <AisInput attr={{field:'body',icon:{name:'list',type:'Feather',min:5,color:'#5586cc'},keyboardType:null,placeholder:'Type your message...',color:'#009387',height:100,handleChange}} />
                        <TouchableOpacity onPress={sendNotification} style={{marginTop:30,width:'90%',marginLeft:'5%',backgroundColor:'green',padding:20,borderRadius:5}}>
                            <Text style={{textAlign:'center',fontFamily:fontBold,color:'#fff'}}>SEND NOTIFICATION</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
                {isSubmitted && (
                    <View style={{flex:1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                        <FontAwesome name='check-circle' color={'green'} size={200}></FontAwesome>
                        <Text style={{textAlign:'center',color:'#757575',fontFamily:fontBold}}>MESSAGE BROADCASTED SUCCESSFULLY</Text>
                    </View>
                )}
            </LinearGradient>
        </View>
    )
};
export default SubmitNotification;
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
        backgroundColor: "blue",
        marginTop:5,
        borderRadius:10,
        elevation:5
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