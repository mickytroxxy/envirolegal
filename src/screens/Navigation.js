import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Home';
import Register from './Register';
import ConfirmScreen from './ConfirmScreen';
import Login from './Login';
import SubmitQuestion from './SubmitQuestion';
import AboutApp from './About';
import Contact from './Contact';
import Profile from './Profile';
import Entry from './Entry';
import NotificationScreen from './NotificationScreen';
import SubmitNotification from './SubmitNotification';

const RootStack = createStackNavigator();
const Navigation = props => {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Entry"
        screenOptions={{
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: "#009387",
            borderBottomWidth: 0,
          },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false
        }}
      >
        <RootStack.Screen
          name="Login"
          component={Login}
        />
        <RootStack.Screen
          name="Home"
          component={Home}
        />
        <RootStack.Screen
          name="Entry"
          component={Entry}
        />
        
        <RootStack.Screen
          name="Register"
          component={Register}
        />

        <RootStack.Screen
          name="ConfirmScreen"
          component={ConfirmScreen}
        />
        <RootStack.Screen
          name="SubmitQuestion"
          component={SubmitQuestion}
        />
        <RootStack.Screen
          name="AboutApp"
          component={AboutApp}
        />
        <RootStack.Screen
          name="Contact"
          component={Contact}
        />
        <RootStack.Screen
          name="Profile"
          component={Profile}
        />
        <RootStack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <RootStack.Screen
          name="SubmitNotification"
          component={SubmitNotification}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default React.memo(Navigation);