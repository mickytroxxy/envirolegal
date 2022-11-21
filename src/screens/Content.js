import { createStackNavigator } from '@react-navigation/stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View, SafeAreaView ,Linking,ScrollView, Platform,TouchableOpacity,Text,TextInput} from "react-native";
import {MaterialCommunityIcons,AntDesign,Feather,Ionicons, FontAwesome } from "@expo/vector-icons";
import { Col, Row, Grid } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/AppContext';
import { WebView } from 'react-native-webview';
import { LoadCategory } from '../context/Api';
const RootStack = createStackNavigator();
let searchResults;
const Content = ({navigation,route}) =>{
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
    const {appState:{fontFamilyObj:{fontBold,fontLight}} } = useContext(AppContext);
    const [htmlContent,setHtmlContent] = useState(null);
    React.useEffect(() => {
        if(searchResults){
            const {val1,val2,val3,val4} = searchResults.contentValue;
            LoadCategory(val1,val2,val3,val4,(response) => setHtmlContent(response))
        }
    },[])
    function onMessage(message) {
        const info = message.nativeEvent.data;
        if(message.nativeEvent.data === "submitYourQuestion"){
            navigation.navigate("SubmitQuestion")
        }else{
            navigation.navigate("WebBrowser",info)
        }
    }
    return(
        <View style={styles.container}>
            <LinearGradient colors={["#fff","#fff","#fff","#A2DDF3"]} style={{flex:1,paddingTop:10,borderRadius:10}}>
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
export default Content;
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