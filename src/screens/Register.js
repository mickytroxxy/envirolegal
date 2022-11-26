import { createStackNavigator } from '@react-navigation/stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View, Dimensions ,Image,ScrollView, Platform,TouchableOpacity,Text,TextInput, AppState} from "react-native";
import {FontAwesome,AntDesign,Feather,Ionicons } from "@expo/vector-icons";
import AisInput from '../components/forms/AisInput';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/AppContext';
import Location from '../components/forms/Location';
import { createData, getUserDetails, getUserDetailsByPhone } from '../context/Api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountrySelector from '../components/forms/CountrySelector';
const RootStack = createStackNavigator();
const Register = ({navigation}) =>{
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "CREATE AN ACCOUNT",
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
    const {appState:{
      setConfirmDialog,
      showToast,
      sendSms,
      phoneNoValidation,
      countryData,
      fontFamilyObj:{fontBold}},
    } = useContext(AppContext);
    const [formData,setFormData] = useState({phoneNumber:'',fname:'',emailAddress:'',password:''});
    const handleChange = (field,value) => setFormData(v =>({...v, [field] : value}));
    const register = () =>{
      if(formData.fname !== '' && formData.password.length > 5 && formData.phoneNumber.length > 7 && formData.emailAddress.length > 5){
        setConfirmDialog({isVisible:true,text:`Hi ${formData.fname}, please confirm if you have entered the correct details`,okayBtn:'CONFIRM',cancelBtn:'Cancel',response:(res) => { 
          const phoneNumber = phoneNoValidation(formData.phoneNumber,countryData.dialCode);
          if(phoneNumber){
            if(res){
              const code = Math.floor(Math.random()*89999+10000);
              const obj = {...formData,date:Date.now(),phoneNumber,code}
              navigation.navigate("ConfirmScreen",obj);
              sendSms(phoneNumber,`Hi ${formData.fname}, your EnviroLegal confirmation code is ${code}`)
            }else{
              showToast("Invalid phonenumber")
            }
          }
        }})
      }else{
        showToast('Please carefully fill in to proceed!')
      }
    }

    return(
      <View style={styles.container}>
        <LinearGradient colors={["#fff","#fff","#fff","#A2DDF3"]} style={{flex:1,paddingTop:10,borderRadius:10}}>
            <ScrollView style={{padding:10}}>
              <View style={{alignItems:'center'}}>
              <Image source={require('../../assets/en_logo.png')} style={{width:200,height:200,borderRadius:300}}/>
              </View>
              <CountrySelector />
              <AisInput attr={{field:'phoneNumber',icon:{name:'phone',type:'Feather',min:5,color:'green'},keyboardType:'phone-pad',placeholder:'Mobile Number',color:'#009387',handleChange}} />
              <AisInput attr={{field:'landline',icon:{name:'phone',type:'Feather',min:5,color:'green'},keyboardType:'phone-pad',placeholder:'Land Line Number',color:'#009387',handleChange}} />
              <AisInput attr={{field:'fname',icon:{name:'user',type:'Feather',min:5,color:'green'},keyboardType:null,placeholder:'Your First Name',color:'#009387',handleChange}} />
              <AisInput attr={{field:'lname',icon:{name:'user',type:'Feather',min:5,color:'green'},keyboardType:null,placeholder:'Your last Name',color:'#009387',handleChange}} />
              <AisInput attr={{field:'emailAddress',icon:{name:'mail',type:'AntDesign',min:5,color:'green'},keyboardType:null,placeholder:'Email Address',color:'#009387',handleChange}} />
              
              <AisInput attr={{field:'password',icon:{name:'lock',type:'Feather',color:'green',min:6},keyboardType:null,placeholder:'Password',color:'#009387',handleChange}} />
              
              <View style={{alignItems:'center',marginTop:15}}>
                <TouchableOpacity onPress={register}>
                  <FontAwesome name='check-circle' size={120} color="green"></FontAwesome>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{marginTop:15}} onPress={()=>navigation.goBack()}><Text style={{fontFamily:fontBold,textAlign:'center',color:'#757575'}}>Have an account? Login Now</Text></TouchableOpacity>
            </ScrollView>
        </LinearGradient>
      </View>
    )
};
export default Register;
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