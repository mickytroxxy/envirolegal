import React,{useState,useMemo, useEffect, useRef} from 'react';
export const AppContext = React.createContext();
import AsyncStorage from "@react-native-async-storage/async-storage";
import geohash from "ngeohash";
import {Alert,ToastAndroid,Platform, Linking } from 'react-native';
import * as Font from "expo-font";
import ModalCoontroller from '../components/ModalController';
import ConfirmDialog from '../components/ConfirmDialog';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { createData, getContentInfo } from './Api';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
});
let lastNotificationResponse;


export const AppProvider = (props) =>{
    const [fontFamilyObj,setFontFamilyObj] = useState(null);
    const [aboutHeader,setAboutHeader] = useState("");
    const [accountInfo,setAccountInfo] = useState(null);
    const [modalState,setModalState] = useState({isVisible:false,attr:{headerText:'HEADER TEXT'}})
    const [confirmDialog,setConfirmDialog] = useState({isVisible:false,text:'Would you like to come today for a fist?',okayBtn:'VERIFY',cancelBtn:'CANCEL',isSuccess:false})
    const [currentLocation,setCurrentLocation] = useState(null);
    const [notificationToken,setNotificationToken] = useState("");
    const [selectedPage,setSelectedPage] = useState(null);
    const [countryData,setCountryData] = useState({dialCode:'+27',name:'South Africa',flag:'https://cdn.kcak11.com/CountryFlags/countries/za.svg'})
    const [contentInfo,setContentInfo] = useState(null)
    let customFonts = {
        'fontLight': require('..//../fonts/MontserratAlternates-Light.otf'),
        'fontBold': require('..//../fonts/MontserratAlternates-Bold.otf'),
    };

    // notification part

    const notificationListener = useRef();
    const responseListener = useRef();
    //responseListener.current = Notifications.addNotificationResponseReceivedListener(response => openUserProfile(response.notification.request.content.data));
    const lastNotification = Notifications.useLastNotificationResponse();
    lastNotificationResponse=lastNotification;

    React.useEffect(()=>{
        loadFontsAsync();

        registerForPushNotificationsAsync(accountInfo,token => setNotificationToken(token));
        getContentInfo(response => setContentInfo(response.contentInfo))
        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    },[]);
    const loadFontsAsync = async ()=> {
        await Font.loadAsync(customFonts);
        setFontFamilyObj({fontLight:'fontLight',fontBold:'fontBold'})
    }
    const getLocation = (cb)=>{
        if(currentLocation){
            cb(currentLocation);
        }else{
            getCurrentLocation((latitude,longitude,heading,hash)=>{
                setCurrentLocation({latitude,longitude,heading,hash});
                cb({latitude,longitude,heading,hash});
            })
        }
        getCurrentLocation((latitude,longitude,heading,hash) => setCurrentLocation({latitude,longitude,heading,hash}));
    }
    useEffect(()=>{
        const getUser = async() => {
            try {
                const user = await AsyncStorage.getItem("user");
                user && setAccountInfo(JSON.parse(user));
                registerForPushNotificationsAsync(JSON.parse(user),token => setNotificationToken(token));
            } catch (e) {
                showToast(e);
            }
        }
        getUser();
    },[])
    const saveUser = async user =>{
        try {
          await AsyncStorage.setItem("user", JSON.stringify(user));
          setAccountInfo(user);
        } catch (e) {
          showToast(e);
        }
    }
    const checkGuestScan = async() => {
        try {
            const user = await AsyncStorage.getItem("guestScan");
            return user;
        } catch (e) {
            showToast(e);
            return null;
        }
    }
    const saveScan = async user =>{
        try {
          await AsyncStorage.setItem("guestScan", JSON.stringify(user));
        } catch (e) {
          showToast(e);
        }
    }
    const logout = async () =>{
        try {
            await AsyncStorage.removeItem("user");
            setAccountInfo(null);
        } catch (e) {
            showToast(e);
        }
    }
    const appState = {
        accountInfo,notificationToken,selectedPage,setSelectedPage,pickCurrentLocation,nativeLink,checkGuestScan,saveScan,setAccountInfo,saveUser,logout,fontFamilyObj,setModalState,setConfirmDialog,getLocation,sendPushNotification,showToast,takePicture,pickImage,sendSms,phoneNoValidation,countryData,setCountryData,aboutHeader,setAboutHeader,contentInfo
    }

    return(
        <AppContext.Provider value={{appState}}>
            {fontFamilyObj && props.children} 
            {(modalState.isVisible && fontFamilyObj ) && (<ModalCoontroller modalState={{...modalState,setModalState}}/>)}
            {(confirmDialog.isVisible  && fontFamilyObj )&& (<ConfirmDialog modalState={{...confirmDialog,setConfirmDialog}}/>)}
        </AppContext.Provider>
    )
}
const getCurrentLocation = (cb) =>{
    const latitude= -26.2163;
    const longitude=28.0369;
    if(askPermissionsAsync()){
        Location.installWebGeolocationPolyfill()
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const heading = position?.coords?.heading;
            const hash = geohash.encode(latitude, longitude);
            cb(latitude,longitude,heading,hash);
        },error => {
            showToast(error.message)
            const hash = geohash.encode(latitude, longitude);
            cb(latitude,longitude,0,hash);
        },{ 
            enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
        );
    }else{
        showToast("You did not grant us permission to get your current location");
        const hash = geohash.encode(latitude, longitude);
        cb(latitude,longitude,0,hash);
    }
}
const askPermissionsAsync = async() => {
    const { status: location } = await Permissions.askAsync(Permissions.LOCATION);
    if (location !== "granted") {
        return false;
    }else{
        return true;
    }
}
const pickCurrentLocation = (cb) =>{
    getCurrentLocation((latitude,longitude)=>{
        axios.request({method: 'post',url : "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+ longitude+"&sensor=true&key=AIzaSyB_Yfjca_o4Te7-4Lcgi7s7eTjrmer5g5Y"}).then((response) => { 
            if(response){
                const short_name = response.data.results[0].address_components.filter(item => item.types.filter(x => x === 'country')[0])[0].short_name
                const long_name = response.data.results[0].address_components.filter(item => item.types.filter(x => x === 'country')[0])[0].long_name 
                cb({latitude,longitude,venueName:response.data.results[0].formatted_address,short_name,long_name})
            }
        }).catch((e) => {
            //alert(e.response);
        });
    })
}
const showToast = (message)=>{
    if (Platform.OS == 'android') {
        ToastAndroid.show(message, ToastAndroid.LONG); 
    }else{
        alert(message);
    }
}
const takePicture = async (type,cb) => {
    try {
        const permissionRes = await ImagePicker.requestCameraPermissionsAsync();
        const { granted } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
        if(granted || permissionRes.granted){
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: type=="avatar"?[1, 1]:null,
                quality: 0.5,
            });
            if (!result.cancelled) {
                cb(result.uri)
            }
        }
    } catch (error) {
        showToast(error)
    }
}
const pickImage = async (type,cb) => {
    try {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(permissionResult.granted){
            let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: type=="avatar"?[1, 1]:null,
                quality: 0.5,
            });
            if (!result.cancelled) {
                cb(result.uri);
            }
        }
    } catch (error) {
        showToast(error)
    }
};
const sendSms = (phoneNo,msg) =>{
    var request = new XMLHttpRequest();
    request.open('POST', 'https://rest.clicksend.com/v3/sms/send');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', 'Basic aW5mb0BlbXBpcmVkaWdpdGFscy5vcmc6ZW1waXJlRGlnaXRhbHMxIUA=');
    request.onreadystatechange = function (response) {
        showToast("message sent to "+phoneNo)
    };
    var body = {
        'messages': [
        {
            'source': 'javascript',
            'from': "uberFlirt",
            'body': msg,
            'to': phoneNo,
            'schedule': '',
            'custom_string': ''
        }
        ]
    };
    request.send(JSON.stringify(body));
}
const phoneNoValidation = (phone,countryCode) =>{
    countryCode = countryCode.slice(1,countryCode.length);
    let phoneNumber = phone.replace(/ /g, '');
    if ((phoneNumber.length < 16) && (phoneNumber.length > 7)) {
      if(phoneNumber[0] === "0" && phoneNumber[1] !== "0"){
        phoneNumber = phoneNumber.slice(1,phoneNumber.length)
      }else if(phoneNumber[0]!== '0'){
        phoneNumber = phoneNumber;
      }
      if(countryCode !== ""){
        if(countryCode[0] === "+"){
          countryCode = countryCode.slice(1,countryCode.length)
        }else{
          if(countryCode[0] === "0" && countryCode[1] === "0"){
            countryCode=countryCode.slice(2,countryCode.length)
          }
        }
        return countryCode+phoneNumber;
      }else{
        return false;
      }
    }else{
      return false;
    }
}
const nativeLink = (type,obj) => {
    if(type === 'map'){
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${obj.lat},${obj.lng}`;
        const label = obj.label;
        const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
    }else if(type === 'call'){
        let phoneNumber = obj.phoneNumber;
        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${obj.phoneNumber}`;
        }else{
            phoneNumber = `tel:${obj.phoneNumber}`;
        }
        Linking.canOpenURL(phoneNumber).then(supported => {
            if (!supported) {
                Alert.alert('Phone number is not available');
            } else {
                return Linking.openURL(phoneNumber);
            }
        }).catch(err => console.log(err));
    }else if(type === 'email'){
        if(!obj.subject){
            Linking.openURL(`mailto:${obj.email}`)
        }else{
            Linking.openURL(`mailto:${obj.email}?subject=${obj.subject}&body=${obj.body}&cc=${obj.cc}`)
        }
    }
}
const sendPushNotification = async (to,title,body,data)=> {
    if(to!=null || to!=undefined || to!=""){
        const message = {
            to: to,
            sound: 'default',
            title: title,
            body: body,
            data,
            priority: 'high',
        };
        try {
            await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });
        } catch (error) {}
    }
}
const registerForPushNotificationsAsync = async(accountInfo,cb)=> {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }
        // token = (await Notifications.getExpoPushTokenAsync()).data;
        // cb(token)
        await Notifications.getExpoPushTokenAsync().then((res) => {
            const notificationToken = res.data;
            if(accountInfo){
                const obj = {owner:accountInfo.emailAddress,notificationToken}
                createData("notificationTokens",accountInfo.emailAddress,obj)
            }
            cb(notificationToken);
        })
    } else {
      //alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
}