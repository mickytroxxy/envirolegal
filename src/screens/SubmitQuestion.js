import { createStackNavigator } from '@react-navigation/stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View, ScrollView,TouchableOpacity,Text} from "react-native";
import {Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/AppContext';
import AisInput from '../components/forms/AisInput';
const RootStack = createStackNavigator();
const SubmitQuestion = ({navigation}) =>{
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "SUBMIT YOUR QUESTION",
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
    const {appState:{fontFamilyObj:{fontBold},nativeLink,showToast,setConfirmDialog} } = useContext(AppContext);
    const [formData,setFormData] = useState({subject:'',body:''});
    const handleChange = (field,value) => setFormData(v =>({...v, [field] : value}));
    const sendEmail = () =>{
        const {subject,body} = formData;
        if(subject !== '' && body !== ''){
            setConfirmDialog({isVisible:true,text:`You are about to submit a question to us. Press Submit to proceed`,okayBtn:'SUBMIT',cancelBtn:'CANCEL',response:(res) => { 
                if(res){
                    nativeLink('email',{email:'lvdw@global.co.za',subject,body,cc:''})
                }
            }})
        }else{
            showToast("Please fill in carefully before proceeding!")
        }
    }
    return(
        <View style={styles.container}>
            <LinearGradient colors={["#fff","#fff","#fff","green"]} style={{flex:1,paddingTop:10,borderRadius:10}}>
                <ScrollView style={{padding:10}}>
                    <AisInput attr={{field:'subject',icon:{name:'list',type:'Feather',min:5,color:'#5586cc'},keyboardType:null,placeholder:'Title...',color:'#009387',handleChange}} />
                    <AisInput attr={{field:'body',icon:{name:'list',type:'Feather',min:5,color:'#5586cc'},keyboardType:null,placeholder:'Type your question...',color:'#009387',height:100,handleChange}} />
                    <TouchableOpacity onPress={sendEmail} style={{marginTop:30,width:'90%',marginLeft:'5%',backgroundColor:'green',padding:20,borderRadius:5}}>
                        <Text style={{textAlign:'center',fontFamily:fontBold,color:'#fff'}}>SEND YOUR QUESTION</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </View>
    )
};
export default SubmitQuestion;
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