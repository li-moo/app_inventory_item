import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, Platform, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Background from '../components/Background';
import Logo from '../components/Logo2';
import BackButton from '../components/BackButton';
import * as Permissions from 'react-native-permissions';

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

  const handleCart = () => {
    navigation.navigate('Cart');
  };

  const handleQrCode = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: '카메라 권한 요청',
          message: 'QR 코드를 스캔하기 위해 카메라 권한이 필요합니다.',
          buttonPositive: '확인',
          buttonNegative: '취소',
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          navigation.navigate('QR코드');
        } else {
          // console.log('카메라 권한이 거부되었습니다.');
        }
      } else if (Platform.OS === 'ios') {
        const status = await Permissions.request('camera');
        if (status === 'authorized') {
          navigation.navigate('QR코드');
        } else {
          // console.log('카메라 권한이 거부되었습니다.');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };
  
  return (
    <Background>
      <BackButton goBack={handleBack} />
      <Logo />
      <TouchableOpacity onPress={handleWeatherPress} style={styles.button}>
        <Text style={styles.buttonText}>내정보보기</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={handleMenuListPress} style={styles.button}>
        <Text style={styles.buttonText}>상품리스트</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity onPress={handleOrderListPress} style={styles.button}>
        <Text style={styles.buttonText}>발주목록</Text>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={handleOrdersListPress} style={styles.button}>
        <Text style={styles.buttonText}>발주내역</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleQrCode} style={styles.button}>
        <Text style={styles.buttonText}>QR 코드</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCart} style={styles.button}>
        <Text style={styles.buttonText}>유통기한 관리</Text>
      </TouchableOpacity>
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

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#262627',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 20,
    marginBottom: 30,
    alignSelf: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

export default DashBoard;
