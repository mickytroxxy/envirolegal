import { createStackNavigator } from '@react-navigation/stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View, Dimensions ,Image,ScrollView, Platform,TouchableOpacity,Text,TextInput, AppState} from "react-native";
import {FontAwesome,AntDesign,Feather,Ionicons } from "@expo/vector-icons";
import AisInput from '../components/forms/AisInput';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/AppContext';
import CountrySelector from '../components/forms/CountrySelector';
import { loginApi } from '../context/Api';

const RootStack = createStackNavigator();
const inputs = [
    {field:'email',icon:{name:'mail',type:'Feather',min:5,color:'green'},keyboardType:null,placeholder:'ENTER YOUR EMAIL ADDRESS',color:'#009387'},
    {field:'password',icon:{name:'lock',type:'Feather',color:'green',min:6},keyboardType:null,placeholder:'ENTER YOUR PASSWORD',color:'#009387'}
]
const Login = ({navigation}) =>{
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "LOGIN TO PROCEED",
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
      showToast,
      phoneNoValidation,
      countryData,
      saveUser,
      fontFamilyObj:{fontBold}},
    } = useContext(AppContext);
    const [formData,setFormData] = useState({email:'',password:''});
    const handleChange = (field,value) => setFormData(v =>({...v, [field] : value}));

    const login = () =>{
        // lvdw@global.co.za
        // Bicardirudi1
        if(formData.email.length > 6 && formData.password.length > 5){
          loginApi(formData.email,formData.password,(response)=>{
            if(response.success){
                saveUser({...response,password:formData.password,emailAddress:formData.email});
            }else{
                showToast(response.message)
            }
          })
        }else{
          showToast("Please properly fill in before proceeding!");
        }
    }
    return(
      <View style={styles.container}>
        <LinearGradient colors={["#fff","#fff","#fff","#A2DDF3"]} style={{flex:1,paddingTop:10,borderRadius:10}}>
            <ScrollView style={{padding:10}}> 
                <View style={{alignItems:'center'}}>
                <Image source={require('../../assets/en_logo.png')} style={{width:200,height:200,borderRadius:300}}/>
                </View>
                {inputs.map((item,i) =>(
                    <AisInput attr={{...item,handleChange}} key={i} />
                ))}
                <View style={{marginTop:15,alignItems:'center'}}>
                    <TouchableOpacity onPress={() => login()}>
                        <FontAwesome name='check-circle' size={120} color="green"></FontAwesome>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginTop:15}} onPress={()=>navigation.navigate("Register")}><Text style={{fontFamily:fontBold,textAlign:'center',color:'#757575'}}>Don't have an account? Register Now</Text></TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
      </View>
    )
};
export default Login;
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