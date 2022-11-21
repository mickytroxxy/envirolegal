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
    const [notificationToken,setNotificationToken] = useState("")
    const [countryData,setCountryData] = useState({dialCode:'+27',name:'South Africa',flag:'https://cdn.kcak11.com/CountryFlags/countries/za.svg'})
    const [contentInfo,setContentInfo] = useState([
        {
            header:'ABOUT APP',
            list:[
                {header:'WELCOME',contentValue:{val1:1,val2:1,val3:false,val4:true}},
                {header:'TERMS & CONDITIONS',contentValue:{val1:1,val2:2,val3:false,val4:true}}
            ]
        },
        {
            header:'KEY OBLIGATIONS',
            list:[
                {header:'AIR',list:[
                    {header:'AUTHORISATIONS',contentValue:{val1:5,val2:5,val3:false,val4:true}},
                    {header:'REGISTRATION',contentValue:{val1:5,val2:6,val3:false,val4:true}},
                    {header:'OPERATIONAL REQUIREMENTS',contentValue:{val1:5,val2:7,val3:false,val4:true}},
                    {header:'SUBMISSIONS & NOTIFICATIONS',contentValue:{val1:5,val2:8,val3:false,val4:true}}
                ]},
                {header:'WATER',list:[
                    {header:'AUTHORISATIONS',contentValue:{val1:6,val2:33,val3:false,val4:true}},
                    {header:'REGISTRATION',contentValue:{val1:6,val2:34,val3:false,val4:true}},
                    {header:'OPERATIONAL REQUIREMENTS',contentValue:{val1:6,val2:35,val3:false,val4:true}},
                    {header:'SUBMISSIONS & NOTIFICATIONS',contentValue:{val1:6,val2:36,val3:false,val4:true}}
                ]},
                {header:'WASTE',list:[
                    {header:'AUTHORISATIONS',contentValue:{val1:7,val2:29,val3:false,val4:true}},
                    {header:'REGISTRATION',contentValue:{val1:7,val2:30,val3:false,val4:true}},
                    {header:'OPERATIONAL REQUIREMENTS',contentValue:{val1:7,val2:31,val3:false,val4:true}},
                    {header:'SUBMISSIONS & NOTIFICATIONS',contentValue:{val1:7,val2:32,val3:false,val4:true}}
                ]},
                {header:'HAZ SUBSTANCES',list:[
                    {header:'AUTHORISATIONS',contentValue:{val1:8,val2:38,val3:false,val4:true}},
                    {header:'REGISTRATION',contentValue:{val1:8,val2:39,val3:false,val4:true}},
                    {header:'OPERATIONAL REQUIREMENTS',contentValue:{val1:8,val2:40,val3:false,val4:true}},
                    {header:'SUBMISSIONS & NOTIFICATIONS',contentValue:{val1:8,val2:41,val3:false,val4:true}}
                ]},
                {header:'PROTECTED SPECIES',list:[
                    {header:'AUTHORISATIONS',contentValue:{val1:9,val2:43,val3:false,val4:true}},
                    {header:'OPERATIONAL REQUIREMENTS',contentValue:{val1:9,val2:44,val3:false,val4:true}},
                ]},
                {header:'ALIEN & INVADER SPECIES',list:[
                    {header:'AUTHORISATIONS',contentValue:{val1:10,val2:45,val3:false,val4:true}},
                    {header:'OPERATIONAL REQUIREMENTS',contentValue:{val1:10,val2:46,val3:false,val4:true}},
                ]},
                {header:'INVIRO IMPACT ASSESSMENT (EIA)',list:[
                    {header:'AUTHORISATIONS',contentValue:{val1:48,val2:48,val3:false,val4:true}}
                ]},
                {header:'OTHER: ALL',list:[
                    {header:'EA & EMPr AMENDMENTS',contentValue:{val1:49,val2:60,val3:false,val4:true}},
                    {header:'HERITAGE RESOURCES',contentValue:{val1:49,val2:61,val3:false,val4:true}},
                    {header:'VELD FIRE PREVENTION',contentValue:{val1:49,val2:62,val3:false,val4:true}},
                    {header:'ENERGY INFORMATION',contentValue:{val1:49,val2:63,val3:false,val4:true}},
                    {header:'ACCESS TO INFORMATION',contentValue:{val1:49,val2:64,val3:false,val4:true}},
                    {header:'WHISLEBLOWER PROTECTION',contentValue:{val1:49,val2:65,val3:false,val4:true}},
                ]},
                {header:'OTHER MINING',list:[
                    {header:'AUTHORISATIONS',contentValue:{val1:51,val2:92,val3:false,val4:true}},
                    {header:'MINE CLOSURE',contentValue:{val1:51,val2:194,val3:false,val4:true}},
                    {header:'OPERATIONAL REQUIREMENTS',contentValue:{val1:51,val2:108,val3:false,val4:true}},
                    {header:'SUBMISSIONS & NOTIFICATIONS',contentValue:{val1:51,val2:109,val3:false,val4:true}}
                ]},
                {header:'CONSOLIDATED DATABASE A-Z',contentValue:{val1:1,val2:2,val3:false,val4:true}}
            ]
        },
        {
            header:'WEEKLY UPDATES',
            list:[
                {header:'Week 1 (24 Dec 21 - 7 Jan 22)',contentValue:{val1:3,val2:3,val3:false,val4:true}},
                {header:'Week 2 (8 -14 January 2022)',contentValue:{val1:3,val2:4,val3:false,val4:true}},
                {header:'Week 3 (15 - 21 January 2022)',contentValue:{val1:3,val2:82,val3:false,val4:true}},
                {header:'Week 4 (22 - 28 January 2022)',contentValue:{val1:3,val2:83,val3:false,val4:true}},
                {header:'Week 5 (29 Jan -  4 Feb 2022)',contentValue:{val1:3,val2:84,val3:false,val4:true}},
                {header:'Week 6 (5 - 11 February 2022)',contentValue:{val1:3,val2:85,val3:false,val4:true}},
                {header:'Week 7 (12-18 February 2022)',contentValue:{val1:3,val2:86,val3:false,val4:true}},
                {header:'Week 8 (19 - 25 February 2022)',contentValue:{val1:3,val2:87,val3:false,val4:true}},
                {header:'Week 9 (26 Feb - 4 March 2022)',contentValue:{val1:3,val2:88,val3:false,val4:true}},
                {header:'Week 10 (5 - 11 March 2022)',contentValue:{val1:3,val2:89,val3:false,val4:true}},
                {header:'Week 11 (12 - 18 March 2022)',contentValue:{val1:3,val2:90,val3:false,val4:true}},
                {header:'Week 12 (19 -25 March 2022)',contentValue:{val1:3,val2:140,val3:false,val4:true}},
                {header:'Week 13 (26 March - 1 April 2022)',contentValue:{val1:3,val2:141,val3:false,val4:true}},
                {header:'Week 14  (2 - 8 April 2022)',contentValue:{val1:3,val2:161,val3:false,val4:true}},
                {header:'Week 15  (9 - 15 April 2022)',contentValue:{val1:3,val2:162,val3:false,val4:true}},
                {header:'Week 16 (16 - 22 April 2022)',contentValue:{val1:3,val2:163,val3:false,val4:true}},
                {header:'Week 17 (23 - 29 April 2022)',contentValue:{val1:3,val2:164,val3:false,val4:true}},
                {header:'Week 18 (30 April -  6 May 2022)',contentValue:{val1:3,val2:165,val3:false,val4:true}},
                {header:'Week 19 (7 - 13 May 2022)',contentValue:{val1:3,val2:166,val3:false,val4:true}},
                {header:'Week 20 (14 - 20  May 2022)',contentValue:{val1:3,val2:167,val3:false,val4:true}},
                {header:'Week 21 (21 -  27 May  2022)',contentValue:{val1:3,val2:168,val3:false,val4:true}},
                {header:'Week 22 (28 May-3 June 2022)',contentValue:{val1:3,val2:169,val3:false,val4:true}},
                {header:'Week 23 (4 - 10 June 2022)',contentValue:{val1:3,val2:170,val3:false,val4:true}},
                {header:'Week 24 (11- 17 June 2022)',contentValue:{val1:3,val2:171,val3:false,val4:true}},
                {header:'Week 25  (18 - 24 June 2022)',contentValue:{val1:3,val2:172,val3:false,val4:true}},
                {header:'Week  26 ( 25 June  - 1 July  2022)',contentValue:{val1:3,val2:173,val3:false,val4:true}},
                {header:'Week  27 (2  - 8 July 2022)',contentValue:{val1:3,val2:174,val3:false,val4:true}},
                {header:'Week 28 (9 - 15 July 2022)',contentValue:{val1:3,val2:175,val3:false,val4:true}},
                {header:'Week  29 (16 - 22 July 2022)',contentValue:{val1:3,val2:176,val3:false,val4:true}},
                {header:'Week 30 (23 - 29 July 2022)',contentValue:{val1:3,val2:177,val3:false,val4:true}},
                {header:'Week 31 (30 July - 5 August 2022)',contentValue:{val1:3,val2:178,val3:false,val4:true}},
                {header:'Week 32 (6 - 12 August 2022)',contentValue:{val1:3,val2:179,val3:false,val4:true}},
                {header:'Week 33 (13 - 19 August 2022)',contentValue:{val1:3,val2:187,val3:false,val4:true}},
                {header:'Week 34 (20 - 26 August 2022)',contentValue:{val1:3,val2:188,val3:false,val4:true}},
                {header:'Week 35 (27 Aug -1 September 2022)',contentValue:{val1:3,val2:189,val3:false,val4:true}},
                {header:'Week  36 (2 - 8 September 2022)',contentValue:{val1:3,val2:190,val3:false,val4:true}},
                {header:'Week 37 (9 - 15 September 2022)',contentValue:{val1:3,val2:191,val3:false,val4:true}},
                {header:'Week 38 (16 - 23 September 2022)',contentValue:{val1:3,val2:191,val3:false,val4:true}},
                {header:'Week 39 (24 - 30 September 2022)',contentValue:{val1:3,val2:192,val3:false,val4:true}},
                {header:'Week 40  (1 - 7 October 2022)',contentValue:{val1:3,val2:193,val3:false,val4:true}},
                {header:'Week 41 ( 8 - 14 October 2022)',contentValue:{val1:3,val2:194,val3:false,val4:true}},
                {header:'Week 42 (15 - 21 October 2022)',contentValue:{val1:3,val2:195,val3:false,val4:true}},
                {header:'Week 43  (22 - 28 October 2022)',contentValue:{val1:3,val2:196,val3:false,val4:true}},
                {header:'Week 44 (29 Oct - 4 Nov 2022)',contentValue:{val1:3,val2:207,val3:false,val4:true}},
            ]
        },
        {
            header:'PRACTICAL HELP',
            list:[
                {header:'AIR',list:[
                    {header:'OZONE DEPLETION',contentValue:{val1:39,val2:119,val3:false,val4:false}},
                    {header:'GREEN HOUSE EFFECT',contentValue:{val1:39,val2:120,val3:false,val4:false}},
                    {header:'GHG ESTIMATION',contentValue:{val1:39,val2:121,val3:false,val4:false}}
                ]},
                {header:'WATER',list:[
                    {header:'STORM WATER MONITORING',contentValue:{val1:60,val2:0,val3:false,val4:false}},
                    {header:'WATER BALANCE',contentValue:{val1:61,val2:0,val3:false,val4:true}}
                ]},
                {header:'WASTE',list:[
                    {header:'DEFINITION OF WASTE',contentValue:{val1:41,val2:78,val3:false,val4:true}},
                    {header:'SANS 10234 CLASSIFICATION',contentValue:{val1:41,val2:81,val3:false,val4:true}},
                    {header:'WASTE TYPE ASSESSMENT',contentValue:{val1:41,val2:103,val3:false,val4:true}},
                    {header:'LANDFILL RESTRICTIONS',contentValue:{val1:41,val2:104,val3:false,val4:true}},
                    {header:'OIL RECYCLERS CHECKLIST',contentValue:{val1:41,val2:105,val3:false,val4:true}},
                    {header:'METAL RECYCLERS CHECKLIST',contentValue:{val1:41,val2:106,val3:false,val4:true}},
                    {header:'WASTE MANIFEST',contentValue:{val1:41,val2:107,val3:false,val4:true}},
                    {header:'TEMPLATE WASTE REGISTER',contentValue:{val1:41,val2:108,val3:false,val4:true}}
                ]},
                {header:'HAZ SUBSTANCES',list:[
                    {header:'BANNED & RESTRICTED SUBSTANCES',contentValue:{val1:42,val2:112,val3:false,val4:true}},
                    {header:'CHEMICAL STORAGE GUIDE',contentValue:{val1:42,val2:122,val3:false,val4:true}}
                ]},
                {header:'PROTECTED SPECIES',contentValue:{val1:43,val2:0,val3:false,val4:true}},
                {header:'DECLARED INVADER SPECIES',contentValue:{val1:45,val2:0,val3:false,val4:true}},
                {header:'MINING',contentValue:{val1:46,val2:0,val3:false,val4:true}}
            ]
        },
        {
            header:'HOT TOPICS',
            list:[
                {header:'Q1-2022 CHANGES UNPACKED',list:[
                    {header:'ORGANIC WASTE TREATMENT',contentValue:{val1:64,val2:148,val3:false,val4:false}},
                    {header:'CHEMICAL  MANUFACTURING',contentValue:{val1:64,val2:149,val3:false,val4:false}},
                    {header:'CARBON TAX CHANGES',contentValue:{val1:64,val2:150,val3:false,val4:false}},
                    {header:'NEW PROTECTED TREES',contentValue:{val1:64,val2:152,val3:false,val4:false}},
                    {header:'NEW DECLARED WEED',contentValue:{val1:64,val2:153,val3:false,val4:false}},
                    {header:'MOKOLO & MATLABAS CATCHMENT',contentValue:{val1:64,val2:155,val3:false,val4:false}},
                    {header:'EAP REGISTRATION',contentValue:{val1:64,val2:156,val3:false,val4:false}},
                    {header:'NEW MINING POLICIES',contentValue:{val1:64,val2:157,val3:false,val4:false}},
                    {header:'PROPOSED CHANGES',contentValue:{val1:64,val2:158,val3:false,val4:false}},
                    {header:'MINING & LANDOWNER`S CONSENT',contentValue:{val1:64,val2:168,val3:false,val4:false}}

                ]},
                {header:'Q1-2022 CHANGES UNPACKED',list:[
                    {header:'CHEMICALS',contentValue:{val1:65,val2:181,val3:false,val4:false}},
                    {header:'NEMA CHANGES',contentValue:{val1:65,val2:182,val3:false,val4:true}},
                    {header:'NEM:WA CHANGES',contentValue:{val1:65,val2:183,val3:false,val4:true}},
                    {header:'NEM:AQA CHANGES',contentValue:{val1:65,val2:185,val3:false,val4:true}},
                    {header:'PROPOSED CHANGES',contentValue:{val1:65,val2:186,val3:false,val4:true}}
                ]},
                {header:'Q1-2022 CHANGES UNPACKED',list:[
                    {header:'DISCHARGES INTO THE SEA',contentValue:{val1:66,val2:197,val3:false,val4:true}},
                    {header:'POWERLINES & SUB. EA Exclusion',contentValue:{val1:66,val2:198,val3:false,val4:true}},
                    {header:'EAP: NB AMENDMENTS - S 24H',contentValue:{val1:66,val2:199,val3:false,val4:true}},
                    {header:'MINISTERIAL ADVISORS: AELs',contentValue:{val1:66,val2:200,val3:false,val4:true}},
                    {header:'REV. BIODIVERSITY FRAMEWORK',contentValue:{val1:66,val2:201,val3:false,val4:true}},
                    {header:'TESTING GREENER REFRIGERANTS',contentValue:{val1:66,val2:202,val3:false,val4:true}},
                    {header:'BREEDE- GOURITS WMA: RESERVE',contentValue:{val1:66,val2:203,val3:false,val4:true}},
                    {header:'Mzimvubu-Tsitsik: Water Resolution',contentValue:{val1:66,val2:204,val3:false,val4:true}},
                    {header:'NEW BYLAWS',contentValue:{val1:66,val2:205,val3:false,val4:true}},
                    {header:'PROPOSED CHANGES',contentValue:{val1:66,val2:206,val3:false,val4:true}}
                ]}
            ]
        }
    ])
    let customFonts = {
        'fontLight': require('..//../fonts/MontserratAlternates-Light.otf'),
        'fontBold': require('..//../fonts/MontserratAlternates-Bold.otf'),
    };

    // notification part

    const notificationListener = useRef();
    const responseListener = useRef();
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => openUserProfile(response.notification.request.content.data));
    const lastNotification = Notifications.useLastNotificationResponse();
    lastNotificationResponse=lastNotification;

    React.useEffect(()=>{
        loadFontsAsync();

        registerForPushNotificationsAsync(token => setNotificationToken(token));
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
        accountInfo,notificationToken,pickCurrentLocation,nativeLink,checkGuestScan,saveScan,setAccountInfo,saveUser,logout,fontFamilyObj,setModalState,setConfirmDialog,getLocation,sendPushNotification,showToast,takePicture,pickImage,sendSms,phoneNoValidation,countryData,setCountryData,aboutHeader,setAboutHeader,contentInfo
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
const registerForPushNotificationsAsync = async(cb)=> {
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
        token = (await Notifications.getExpoPushTokenAsync()).data;
        cb(token)
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