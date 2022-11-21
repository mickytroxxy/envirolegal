import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Home from './src/screens/Home';
import { AppProvider } from './src/context/AppContext';
import Navigation from './src/screens/Navigation';
import { LogBox } from 'react-native';
import Constants from 'expo-constants'
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
export default function App() {
  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? Constants.statusBarHeight === 20 ? Constants.statusBarHeight : Constants.statusBarHeight - 5 : StatusBar.currentHeight,backgroundColor:"#A2DDF3" }}>
      <StatusBar backgroundColor="#88C9E8" translucent={false} style="light" barStyle="dark-content"/>
      <AppProvider>
        <Navigation/>
      </AppProvider>
    </View>
  );
}
