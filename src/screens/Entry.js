import React, { memo, useContext } from 'react'
import { View } from 'react-native'
import Home from './Home';
import Login from './Login';
import { AppContext } from '../context/AppContext';


const Entry = memo(({navigation}) => {
    const {appState:{accountInfo}} = useContext(AppContext);
    return (
        <View style={{flex:1}}>
            {accountInfo ? <Home navigation={navigation} /> : <Login navigation={navigation} />}
        </View>
    )
})

export default Entry