import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, query, where, deleteDoc, updateDoc, onSnapshot   } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import * as Network from 'expo-network';
import * as st from "firebase/storage";
import axios from "axios";
const APPSERVER = "https://app.envirolegalapp.co.za/";
const firebaseConfig = {
    apiKey: "AIzaSyAySeqdmLHyKluN-68PnSaIN3qeduLwVDQ",
    authDomain: "envirolegal-4cdc9.firebaseapp.com",
    projectId: "envirolegal-4cdc9",
    storageBucket: "envirolegal-4cdc9.appspot.com",
    messagingSenderId: "1025666694755",
    appId: "1:1025666694755:web:f35022e27126337ae30256"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export const createData = async (tableName,docId,data) => {
    try {
        await setDoc(doc(db, tableName, docId), data);
        return true;
    } catch (e) {
        alert(e)
        return false;
    }
}
export const loginApi = async (email,password,cb) => {
    try {
        const res = await axios.get(`https://app.envirolegalapp.co.za/mobile/login?email=${email}&password=${password}`);
        cb(res.data)
    } catch (e) {
        cb(e);
    }
}
export const searchApi = async (key_word,cb) => {
    try {
        const res = await axios.get(`https://app.envirolegalapp.co.za/mobile/search?key_word=${key_word}`);
        cb(res.data)
    } catch (e) {
        cb(e);
    }
}
export const registerApi = async (obj,cb) => {
    try {
        const {fname,lname,emailAddress,password,landline,deviceid,phoneNumber} = obj;
        const res = await axios.get(`http://app.envirolegalapp.co.za/mobile/register?firstname=${fname}&lastname=${lname}&email=${emailAddress}&mobile=${phoneNumber}&landline=${landline}&pwd=${password}&deviceid=${deviceid}`);
        cb(res.data)
    } catch (e) {
        cb(e);
    }
}
export const getNotifications = async (cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "notifications")));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getContentInfo = async (cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "contentInfo")));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data[0])
    } catch (e) {
        cb(e);
    }
}
export const getNotificationTokens = async (cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "notificationTokens")));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getUserDetails = async (accountId,cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "clients"), where("id", "==", accountId)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getUserDetailsByPhone = async (phoneNumber,cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "clients"), where("phoneNumber", "==", phoneNumber)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getMyProducts = async (accountId,cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "purchases"), where("accountId", "==", accountId)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getTrending = async (cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "purchases")));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const verifyItem = async (itemId,cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "productItems"), where("itemId", "==", itemId)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getScans = async (productOwner,cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "scans"), where("productOwner", "==", productOwner)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getProductList = async (cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "productList")));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const updateData = async (tableName,docId,obj) => {
    try {
        const docRef = doc(db, tableName, docId);
        await updateDoc(docRef, obj);
        return true;
    } catch (e) {
        return false;
    }
}
export const uploadFile = async (file,path,cb) =>{
    const storage = st.getStorage(app);
    const fileRef = st.ref(storage, path);
    const response = await fetch(file);
    const blob = await response.blob();
    const uploadTask = await st.uploadBytesResumable(fileRef, blob);
    const url = await st.getDownloadURL(uploadTask.ref);
    cb(url)
}

export const LoadCategory = async (categoryid,contentid,frommenu,fromroot,cb) =>{
    const res = await axios.get(APPSERVER+'mobile/category', {params: {categoryid,contentid} });
    cb(res.data.content)
}