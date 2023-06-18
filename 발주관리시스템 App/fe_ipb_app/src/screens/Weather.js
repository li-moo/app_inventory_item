import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRecoilValue, useRecoilState, atom } from 'recoil';
import axios from 'axios';
import Logo3 from '../components/Logo3';
import Background from '../components/Background';
import BackButton from '../components/BackButton';

// Define states
const logInState = atom({ key: 'logInState', default: {} });
const weatherState = atom({ key: 'weatherState', default: {} });

export default function Weather({ navigation }) {
  // Define hooks
  const logInData = useRecoilValue(logInState);
  const [weatherdata, setWeatherdata] = useRecoilState(weatherState);

  // Component did mount effect
  useEffect(() => {
    getWeatherInfo();
  }, []);

  // Define internal functions
  const getWeatherInfo = async () => {
    try {
      const response = await axios.post('http://43.202.9.215:8080/staff/weather', {
        store_id: logInData.store_id,
        area: logInData.area
      });
      const data = response.data;
      setWeatherdata(data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderUserInfo = () => {
    const userInfo = [
      { label: '이름', value: logInData.name },
      { label: '현재 지역', value: logInData.area },
      { label: '스토어 아이디', value: logInData.store_id },
      { label: '날씨 정보', value: weatherdata.presentWeather },
    ];

    return (
      <View style={styles.userInfoContainer}>
        {userInfo.map((item, index) => (
          <View key={index} style={styles.userInfoItem}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Return component
  return (
    <Background>
      <View style={styles.container}>
        <Logo3 style={styles.logo} />
        <BackButton goBack={navigation.goBack} />
        <View style={styles.section}>
          <Text style={styles.heading}>내 정보</Text>
          <View style={styles.content}>
            {renderUserInfo()}
          </View>
        </View>
      </View>
    </Background>
  );
}

// Styles definition
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginTop: 20, // Adjust the margin as needed
  },
  section: {
    alignItems: 'center', // Center align the section horizontally
  },
  heading: {
    color: '#000000',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  userInfoContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  userInfoItem: {
    marginBottom: 15,
  },
  label: {
    color: '#000000',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  value: {
    color: '#000000',
    fontSize: 26,
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
  },
});
