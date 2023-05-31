import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Background from '../components/Background';
import Logo from '../components/Logo2';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import { useRecoilValue, useRecoilState } from 'recoil';

const DashBoard = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.navigate('LoginScreen');
  };

  const handleWeatherPress = () => {
    navigation.navigate('Weather');
  };

  const handleMenuListPress = () => {
    navigation.navigate('Menulist');
  };

  const handleOrderListPress = () => {
    navigation.navigate('Orderlist');
  };

  const handleOrdersListPress = () => {
    navigation.navigate('Orderslist');
  };

  return (
    <Background>
      <BackButton goBack={handleBack} />
      <Logo />
      <Button mode="contained" onPress={handleWeatherPress}>
        내정보보기
      </Button>
      <Button mode="contained" onPress={handleMenuListPress}>
        상품리스트
      </Button>
      <Button mode="contained" onPress={handleOrderListPress}>
        발주목록
      </Button>
      <Button mode="contained" onPress={handleOrdersListPress}>
        발주목록
      </Button>
    </Background>
  );
};

const Stack = createStackNavigator();

const StartScreenNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="StartScreen"
      component={StartScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export default DashBoard;
