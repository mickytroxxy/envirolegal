import 'react-native-gesture-handler';
import React,{useState,useContext} from 'react';
import { Text, View, Dimensions, ScrollView, StyleSheet, TouchableOpacity, Image, ImageBackground, Platform } from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { AppContext } from "../context/AppContext";
import { LinearGradient } from 'expo-linear-gradient';
import AisInput from '../components/forms/AisInput';

import { AntDesign, Ionicons, Feather, FontAwesome } from "@expo/vector-icons";
import { createData, loginApi } from '../context/Api';
let PARALLAX_HEIGHT = 0;
const KeyRef = ({navigation}) =>{
    const {height} = Dimensions.get("screen");
    PARALLAX_HEIGHT = parseInt((0.475 * parseFloat(height)).toFixed(0));
    const [parallaxH,setParallaxH]= useState(PARALLAX_HEIGHT);
    return (
        <View style={styles.container}>
            <ParallaxScrollView
                backgroundColor="transparent"
                contentBackgroundColor="transparent"
                backgroundScrollSpeed={5}
                fadeOutForeground ={true}
                showsVerticalScrollIndicator ={false}
                parallaxHeaderHeight={parallaxH}
                renderForeground={() => <Foreground navigation={navigation}/>}
                renderBackground={() => <HeaderSection navigation={navigation}/>}
                renderContentBackground={() => <BodySection navigation={navigation} />}
            />
        </View>
    )
};
export default React.memo(KeyRef);

const HeaderSection = () =>{
    const {appState:{accountInfo,logout,notificationToken,showToast}} = useContext(AppContext);
    React.useEffect(() => {
        loginApi(accountInfo?.emailAddress,accountInfo?.password,(response) => {
            if(!response.success){
                logout();
            }else{
                const obj = {owner:accountInfo.emailAddress,notificationToken}
                createData("notificationTokens",accountInfo.emailAddress,obj)
            }
        })
    },[])
    return(
        <View style={{backgroundColor:"#A2DDF3",height:600}}>
            <ImageBackground source={require('../../assets/bg3.png')} resizeMode="cover" style={styles.image}>
            
            </ImageBackground>
        </View>
    )
}
const Foreground = (props) =>{
    const {navigation} = props;
    const {appState : {fontFamilyObj:{fontLight},contentInfo,setAboutHeader}} = useContext(AppContext);
    const [searchResults,setSearchResults] = useState([]);
    const [showSearchBoard,setSearchBoard]=useState(false);
    const [keyWord,setKeyWord] = useState("");
    const searchResultClicked = (clickedObj) => {
        setAboutHeader(clickedObj.header)
        props.navigation.navigate("AboutApp",clickedObj)
    }
    return(
        <View>
            <View style={styles.headerStyle}>
                <TouchableOpacity style={{flex:1}} onPress={() => navigation.navigate("Contact")}>
                  <Feather name="phone" size={36} color="white"></Feather>
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1}} onPress={() => navigation.navigate("Profile")}>
                  <Feather name="user" size={36} color="white"></Feather>
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1}} onPress={()=> setSearchBoard(!showSearchBoard)}>
                  <Feather name="search" size={36} color="white"></Feather>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")}>
                  <AntDesign name="notification" size={36} color="white"/>
                </TouchableOpacity>
            </View>
            {showSearchBoard && 
                <View style={styles.searchBoard}>
                    <View style={{width:'100%'}}>
                        <AisInput attr={{field:'search',icon:{name:'search',type:'Feather',min:5,color:'green'},keyboardType:null,placeholder:'Search here...',color:'#009387',handleChange:(field,value) => {
                            if(value.length > 1){
                                setSearchResults(contentInfo.filter(item => JSON.stringify(item).toUpperCase().includes(value.toUpperCase())))
                                setKeyWord(value)
                            }else{
                                setSearchResults([])
                            }
                        }}} />
                    </View>
                    <ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
                        {searchResults.length > 0 && searchResults.map((item,i) => {
                            if(item.list){
                                return item.list.map((item,i) => {
                                    if(item.list){
                                        return item.list.map((item,i) => {
                                            if(item.list){
                                                return(
                                                    <TouchableOpacity onPress={()=>searchResultClicked(item)} key={i} style={{flexDirection:'row',padding:10,borderBottomColor:'#D2DCE3',borderBottomWidth:0.5}}>
                                                        <View><Feather name='list' size={18} color='#757575'/></View>
                                                        <View style={{alignContent:'center',justifyContent:'center',alignItems:'center',marginLeft:10}}><Text style={{fontFamily:fontLight}}>{item.header}</Text></View>
                                                    </TouchableOpacity>
                                                )
                                            }
                                            if(item.header.toUpperCase().includes(keyWord.toUpperCase())){
                                                return(
                                                    <TouchableOpacity onPress={()=>searchResultClicked(item)} key={i} style={{flexDirection:'row',padding:10,borderBottomColor:'#D2DCE3',borderBottomWidth:0.5}}>
                                                        <View><Feather name='list' size={18} color='#757575'/></View>
                                                        <View style={{alignContent:'center',justifyContent:'center',alignItems:'center',marginLeft:10}}><Text style={{fontFamily:fontLight}}>{item.header}</Text></View>
                                                    </TouchableOpacity>
                                                )
                                            }
                                        })
                                    }
                                    if(item.header.toUpperCase().includes(keyWord.toUpperCase())){
                                        return(
                                            <TouchableOpacity onPress={()=>searchResultClicked(item)} key={i} style={{flexDirection:'row',padding:10,borderBottomColor:'#D2DCE3',borderBottomWidth:0.5}}>
                                                <View><Feather name='list' size={18} color='#757575'/></View>
                                                <View style={{alignContent:'center',justifyContent:'center',alignItems:'center',marginLeft:10}}><Text style={{fontFamily:fontLight}}>{item.header}</Text></View>
                                            </TouchableOpacity>
                                        )
                                    }
                                })
                            }
                            if(item.header.toUpperCase().includes(keyWord.toUpperCase())){
                                return(
                                    <TouchableOpacity onPress={()=>searchResultClicked(item)} key={i} style={{flexDirection:'row',padding:10,borderBottomColor:'#D2DCE3',borderBottomWidth:0.5}}>
                                        <View><Feather name='list' size={18} color='#757575'/></View>
                                        <View style={{alignContent:'center',justifyContent:'center',alignItems:'center',marginLeft:10}}><Text style={{fontFamily:fontLight}}>{item.header}</Text></View>
                                    </TouchableOpacity>
                                )
                            }
                        })}        
                    </ScrollView>
                </View>
            }
        </View>
    )
}
const BodySection = (props) =>{
    const {appState:{fontFamilyObj,setAboutHeader}} = useContext(AppContext);
    const btns = ['About App','Key Obligations','Weekly Updates','Submit Question','Practical Help','Hot Topics']
    const {navigation} = props;
    const on_btn_pressed = btn =>{
        if(btn === 'Submit Question'){
            navigation.navigate("SubmitQuestion")
        }else{
            navigation.navigate("AboutApp",btn)
        }
    }
    return(
        <LinearGradient colors={["#BED0D8","#A2DDF3","#EFEFEF","#EFEFEF"]} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }} style={styles.footerStyle}>
            <View><Text style={{fontFamily:fontFamilyObj.fontBold,color:'#757575',textAlign:'center',margin:15}}>WHAT WOULD YOU LIKE TO DO?</Text></View>
            <View style={{flexDirection:'row',alignContent:'center',alignItems:'center',display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',flexWrap: 'wrap'}}>
                {btns.map((btn,i) => {
                    return(
                        <TouchableOpacity onPress={()=>on_btn_pressed(btn)} key={i} style={{backgroundColor:'#2277BA',width:'48%',borderRadius:20,alignContent:'center',alignItems:'center',justifyContent:'center',padding:5,minHeight:120,marginTop:10}}>
                            {render_btn_icons(btn)}
                            <Text style={{fontFamily:fontFamilyObj.fontBold,color:'#fff',textAlign:'center'}}>{btn}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
            <View  style={{alignContent:'center',alignItems:'center', alignItems: 'center'}}>
                <Image source={require('../../assets/logo1.png')} style={{width:'80%',height:120}}/>
            </View>
        </LinearGradient>
    )
}

const render_btn_icons = btn =>{
  if(btn === 'About App'){
    return <AntDesign size={60} name="infocirlceo" color="rgba(0, 0, 0, 0.7)" />
  }else if(btn === 'Key Obligations'){
    return <FontAwesome name='sort-alpha-asc' color='rgba(0, 0, 0, 0.7)' size={60} />
  }else if(btn === 'Weekly Updates'){
    return <Ionicons name='notifications-outline' color='rgba(0, 0, 0, 0.7)' size={60} />
  }else if(btn === 'Submit Question'){
    return <AntDesign name='questioncircleo' color='rgba(0, 0, 0, 0.7)' size={60} />
  }else if(btn === 'Practical Help'){
    return <Feather name='target' color='#rgba(0, 0, 0, 0.7)' size={60} />
  }else if(btn === 'Hot Topics'){
    return <FontAwesome name='lightbulb-o' color='rgba(0, 0, 0, 0.7)' size={60} />
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e8e9f5',
    },
    footerStyle: {
        flex: 2,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        elevation: 10,
        paddingBottom:30,
        marginTop:-30
    },
    headerStyle:{
        position:'absolute',
        top:10,
        width:'90%',
        marginLeft:'5%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        padding:20,
        flexDirection:'row',
        borderTopRightRadius:50,
        borderBottomLeftRadius:50,
        borderRadius:5,
        alignItems:'center',
        alignContent:'center',
        flex:1,
        justifyContent:'center'
    },
    searchBoard:{
        position:'absolute',
        top:100,
        width:'90%',
        marginLeft:'5%',
        backgroundColor: '#fff', 
        padding:10,
        borderRadius:5,
        alignItems:'center',
        alignContent:'center',
        flex:1,
        justifyContent:'center',maxHeight:300
    },
    image: {
        justifyContent: "center",
        backgroundColor:'#A2DDF3',width:'100%',
        height:Platform.OS === 'ios' ? 380 : 320,
        alignItems:'center',
        alignContent:'center',
        justifyContent:'center'
    }
});