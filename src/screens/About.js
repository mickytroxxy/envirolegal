import { createStackNavigator } from '@react-navigation/stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View, SafeAreaView ,Linking,ScrollView, Platform,TouchableOpacity,Text,TextInput} from "react-native";
import {MaterialCommunityIcons,AntDesign,Feather } from "@expo/vector-icons";
import { Col, Row, Grid } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/AppContext';
import AisInput from '../components/forms/AisInput';
import { WebView } from 'react-native-webview';
import { LoadCategory, searchApi } from '../context/Api';
const RootStack = createStackNavigator();
let searchResults;
let aboutHeader;
const AboutApp = ({navigation,route}) =>{
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    const data = route?.params;

    if(data.header){
        searchResults = data;
    }else{
        aboutHeader = data;
    }
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title:aboutHeader.toUpperCase(),
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
    const {appState:{apiSearch,setApiSearch,contentInfo,selectedPage,setSelectedPage,fontFamilyObj:{fontBold,fontLight}} } = useContext(AppContext);
    const [htmlContent,setHtmlContent] = useState(null);
    const [keyWord,setKeyWord] = useState("");
    React.useEffect(() => {
        if(searchResults){
            const {val1,val2,val3,val4} = searchResults.contentValue;
            LoadCategory(val1,val2,val3,val4,(response) => setHtmlContent(response))
        }
        //LoadCategory(5,0,false,false,(response) => setHtmlContent(response))
        setSelectedPage(contentInfo?.filter(item => item.header === aboutHeader.toUpperCase())[0])
    },[])
    function onMessage(message) {
        const info = message.nativeEvent.data;
        if(message.nativeEvent.data === "submitYourQuestion"){
            navigation.navigate("SubmitQuestion")
        }else{
            navigation.navigate("WebBrowser",info)
        }
    }
    console.log(htmlContent)
    return(
        <View style={styles.container}>
            <LinearGradient colors={["#fff","#fff","#fff","#A2DDF3"]} style={{flex:1,paddingTop:10,borderRadius:10}}>
                {!htmlContent && <ScrollView style={{padding:10,paddingBottom:50,borderRadius:10,borderWidth:1,borderColor:'#757575',margin:10}}>
                    <View style={{paddingBottom:80}}>
                        <AisInput attr={{field:'search',icon:{name:'search',type:'Feather',min:5,color:'green'},keyboardType:null,placeholder:'Search here...',color:'#009387',handleChange:(field,value) => {
                            if(value.length > 2){
                                searchApi(value,(response) => {
                                    if(response && !JSON.stringify(response).includes('AxiosError')){
                                        setApiSearch(response)
                                    }
                                })
                            }else{
                                setApiSearch(null)
                            }
                        }}} />
                        {!apiSearch && selectedPage?.list.map((item,i) => 
                            {
                                if(item.header.toUpperCase().includes(keyWord.toUpperCase()) || keyWord === ""){
                                    return(
                                        <TouchableOpacity key={i} style={{marginTop:10,flexDirection:'row'}} onPress={()=>{
                                            if(!item.list){
                                                setHtmlContent(null)
                                                navigation.navigate("SearchedContent",item)
                                            }else{
                                                navigation.navigate("Page1",item);
                                            }
                                        }}>
                                            <Text style={{fontFamily:fontBold,fontSize:14,flex:1}}>{item.header}</Text>
                                            <AntDesign name='right' color={"#757575"} size={18}></AntDesign>
                                        </TouchableOpacity>
                                    )
                                }
                            }
                        )}
                        {apiSearch && apiSearch?.data.map((item,i) => 
                            {
                                const data = JSON.parse(item)
                                if(data.title !== undefined ){
                                    return(
                                        <TouchableOpacity key={i} style={{marginTop:10,flexDirection:'row'}} onPress={()=>{
                                            navigation.navigate("SearchedContent",data)
                                            //alert(data.title)
                                        }}>
                                            <Text style={{fontFamily:fontBold,fontSize:14,flex:1}}>{data.title}</Text>
                                            <AntDesign name='right' color={"#757575"} size={18}></AntDesign>
                                        </TouchableOpacity>
                                    )
                                }
                            }
                        )}
                    </View>
                </ScrollView>}
                {htmlContent && <WebView source={{ html: `
                <!DOCTYPE html><html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <script>
                    window.postMessage("Sending data from WebView");
                    function SubmitYourQuestion(){
                        window.ReactNativeWebView.postMessage('submitYourQuestion')
                    }
                    function OpenInSystemBrowser(data){
                        window.ReactNativeWebView.postMessage(data)
                    }
                </script>
                <body>
                    ${htmlContent}
                </body>
                ` }} onMessage={onMessage}  />} 
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