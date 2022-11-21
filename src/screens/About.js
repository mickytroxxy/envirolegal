import { createStackNavigator } from '@react-navigation/stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View, SafeAreaView ,Image,ScrollView, Platform,TouchableOpacity,Text,TextInput} from "react-native";
import {MaterialCommunityIcons,AntDesign,Feather,Ionicons, FontAwesome } from "@expo/vector-icons";
import { Col, Row, Grid } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/AppContext';
import AisInput from '../components/forms/AisInput';
import { WebView } from 'react-native-webview';
import { LoadCategory } from '../context/Api';
const RootStack = createStackNavigator();
let searchResults;
const AboutApp = ({navigation,route}) =>{
    const {appState:{fontFamilyObj,aboutHeader}} = useContext(AppContext);
    searchResults = route?.params
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title:aboutHeader,
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
    const {appState:{setAboutHeader,aboutHeader,contentInfo,fontFamilyObj:{fontBold,fontLight}} } = useContext(AppContext);
    const [htmlContent,setHtmlContent] = useState(null);
    const [selectedPage,setSelectedPage] = useState(null);

    const [searchRes,setSearchRes] = useState([]);
    const [keyWord,setKeyWord] = useState("");
    React.useEffect(() => {
        if(searchResults){
            const {val1,val2,val3,val4} = searchResults.contentValue;
            LoadCategory(val1,val2,val3,val4,(response) => setHtmlContent(response))
        }
        setSelectedPage(contentInfo.filter(item => item.header === aboutHeader.toUpperCase())[0])
    },[])
    return(
        <View style={styles.container}>
            <LinearGradient colors={["#fff","#fff","#fff","green"]} style={{flex:1,paddingTop:10,borderRadius:10}}>
                {!htmlContent && <ScrollView style={{padding:10,paddingBottom:50,borderRadius:10,borderWidth:1,borderColor:'#757575',margin:10}}>
                    <AisInput attr={{field:'search',icon:{name:'search',type:'Feather',min:5,color:'green'},keyboardType:null,placeholder:'Search here...',color:'#009387',handleChange:(field,value) => {
                        if(value.length > 1){
                            setKeyWord(value)
                        }else{
                            setKeyWord("")
                        }
                    }}} />
                    {selectedPage?.list.map((item,i) => 
                        {
                            if(item.header.toUpperCase().includes(keyWord.toUpperCase()) || keyWord === ""){
                                return(
                                    <TouchableOpacity key={i} style={{marginTop:10,flexDirection:'row'}} onPress={()=>{
                                        setAboutHeader(item.header);
                                        if(!item.list){
                                            setHtmlContent(null)
                                            LoadCategory(item.contentValue.val1,item.contentValue.val2,item.contentValue.val3,item.contentValue.val4,(response) => setHtmlContent(response))
                                        }else{
                                            setSelectedPage(item)
                                        }
                                    }}>
                                        <Text style={{fontFamily:fontBold,fontSize:14,flex:1}}>{item.header}</Text>
                                        <AntDesign name='right' color={"#757575"} size={18}></AntDesign>
                                    </TouchableOpacity>
                                )
                            }
                        }
                    )}
                </ScrollView>}
                {htmlContent && <WebView source={{ html: `
                <!DOCTYPE html><html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body>
                    ${htmlContent}
                </body>
                ` }}  />} 
            </LinearGradient>
        </View>
    )
};
export default AboutApp;
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