import React, { memo, useContext } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import AisInput from '../components/forms/AisInput';
import { searchApi } from '../context/Api';
import { AppContext } from '../context/AppContext';
import { AntDesign, Ionicons } from "@expo/vector-icons";

const Search = memo(({navigation}) => {
    const {appState:{setApiSearch,apiSearch,fontFamilyObj:{fontBold}}} = useContext(AppContext);
    return (
        <View style={{flex:1,padding:10}}>
            <View style={{position:'absolute',zIndex:1000,width:'100%',bottom:15,alignContent:'center',alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>{
                    navigation.goBack()
                    setApiSearch(null)
                }} style={{alignContent:'center',alignItems:'center',justifyContent:'center',flex:1}}>
                    <Ionicons name='arrow-back-circle-outline' color="#757575" size={48}/>
                </TouchableOpacity>
            </View>
            <View style={{width:'100%',paddingBottom:120}}>
                <View style={{width:'100%'}}>
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
                </View>
                <ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
                    {apiSearch && apiSearch?.data.map((item,i) => 
                        {
                            const data = JSON.parse(item)
                            if(data.title !== undefined ){
                                return(
                                    <TouchableOpacity key={i} style={{marginTop:10,flexDirection:'row'}} onPress={()=>{
                                        navigation.navigate("SearchedContent",data)
                                        setApiSearch(null)
                                    }}>
                                        <Text style={{fontFamily:fontBold,fontSize:14,flex:1}}>{data.title}</Text>
                                        <AntDesign name='right' color={"#757575"} size={18}></AntDesign>
                                    </TouchableOpacity>
                                )
                            }
                        }
                    )}
                </ScrollView>
            </View>
        </View>
    )
})
const styles = StyleSheet.create({
    image: {
        justifyContent: "center",
        backgroundColor:'#A2DDF3',width:'100%',
        height:Platform.OS === 'ios' ? 420 : 330,
        alignItems:'center',
        alignContent:'center',
        justifyContent:'center'
    }
});
export default Search