import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';

export default function StartScreen({ navigation }) {
  // const [qrCodeScanned, setQRCodeScanned] = useState(false);

  // const handleQRCodePress = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //       {
  //         title: '카메라 권한 요청',
  //         message: 'QR 코드를 스캔하기 위해 카메라 권한이 필요합니다.',
  //         buttonPositive: '확인',
  //         buttonNegative: '취소',
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       if (Platform.OS === 'ios') {
  //         launchImageLibrary({ mediaType: 'photo' }, handleQRCodeScan);
  //       } else {
  //         launchCamera({ mediaType: 'photo' }, handleQRCodeScan);
  //       }
  //     } else {
  //       console.log('카메라 권한이 거부되었습니다.');
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  // const handleQRCodeScan = (response) => {
  //   if (response.didCancel) {
  //     console.log('QR 코드 스캔이 취소되었습니다.');
  //   } else if (response.error) {
  //     console.log('QR 코드 스캔 중 오류가 발생했습니다.');
  //   } else {
  //     // Access the scanned QR code data
  //     console.log('Scanned QR Code:', response.data);
  //     setQRCodeScanned(true);
  //   }
  // };

  return (
    <Background>
      <Logo />
      <Header style={{ fontSize: 28, fontWeight: 'bold', color: 'black' }}>발주 관리 시스템</Header>
      <Paragraph style={{ color: 'black' }}>
        통합 발주 관리 시스템입니다. <br />로그인하여 이용해주시길 바랍니다.
      </Paragraph>
      <Button mode="contained" onPress={() => navigation.navigate('LoginScreen')} color="#262627">
        로그인
      </Button>
      {/* <TouchableOpacity onPress={qrCodeScanned ? null : handleQRCodePress} style={styles.qrCodeContainer}>
        {qrCodeScanned ? (
          <Text style={{ color: 'black' }}>QR 코드가 스캔되었습니다!</Text>
        ) : (
          <QRCode value="QR Code Value" size={200} />
        )} */}
      {/* </TouchableOpacity> */}
    </Background>
  );
}

const styles = StyleSheet.create({
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
