import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from './src/core/theme';
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
  MenuList,
  Menulist,
  Orderlist,
  Weather,
  Orderslist,
} from './src/screens';
import { RecoilRoot } from 'recoil';
import StoreOrdersDetail from './src/screens/StoreOrdersDetail';
import Cart from './src/screens/cart';


StatusBar.setBarStyle('light-content');
const Stack = createStackNavigator();

export default function App() {
  return (
    <RecoilRoot>
      <Provider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="StartScreen"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="StartScreen" component={StartScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Menulist" component={Menulist} />
            <Stack.Screen name="Orderlist" component={Orderlist} />
            <Stack.Screen name="Orderslist" component={Orderslist} />
            <Stack.Screen name="Weather" component={Weather} />
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
            />
            <Stack.Screen name="StoreOrdersDetail" component={StoreOrdersDetail} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </RecoilRoot>
  );
}
