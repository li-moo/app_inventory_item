import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Background from '../components/Background';
import Logo from '../components/Logo2';
import BackButton from '../components/BackButton';
import { useRecoilValue, useRecoilState } from 'recoil';
import { Button } from 'react-native-elements';
import { BarCodeScanner } from 'react-native-camera';

const QRCodeScreen = () => {
  const navigation = useNavigation();
  const [isScanning, setIsScanning] = useState(true);

  const handleBarCodeScanned = ({ data }) => {
    setIsScanning(false);
    navigation.navigate('QRCodeResult', { data });
  };

  useEffect(() => {
    return () => {
      setIsScanning(false);
    };
  }, []);

  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={styles.camera}
        onBarCodeScanned={isScanning ? handleBarCodeScanned : undefined}
      />
      {!isScanning && (
        <TouchableOpacity onPress={() => setIsScanning(true)} style={styles.scanButton}>
          <Text style={styles.scanButtonText}>다시 스캔</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const QRCodeResultScreen = ({ route }) => {
  const { data } = route.params;

  return (
    <Background>
      <Text style={styles.qrCodeData}>{data}</Text>
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

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Dashboard"
      component={DashBoard}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="QRCodeScreen"
      component={QRCodeScreen}
      options={{
        title: 'QR 코드 스캔',
      }}
    />
    <Stack.Screen
      name="QRCodeResult"
      component={QRCodeResultScreen}
      options={{
        title: 'QR 코드 결과',
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  scanButton: {
    backgroundColor: '#262627',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 20,
    alignSelf: 'center',
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  qrCodeData: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QrCode;
