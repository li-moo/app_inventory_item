import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRecoilValue, useRecoilState, atom } from 'recoil';
import Background from '../components/Background';
import axios from 'axios';

const logInState = atom({
  key: 'logInState',
  default: {},
});

const weatherState = atom({
  key: 'weatherState',
  default: {},
});

// Add a new atom for the message state
const messageState = atom({
  key: 'messageState',
  default: 'Welcome to the app!',
});

export default function Weather() {
  const logInData = useRecoilValue(logInState);
  const [weatherdata, setWeatherdata] = useRecoilState(weatherState);
  const [message, setMessage] = useRecoilState(messageState); // Use the message state

  console.log("login data test", logInData);

  useEffect(() => {
    getWeatherInfo();
  }, []);

  const getWeatherInfo = async () => {
    try {
      const response = await axios.post('http://localhost:8080/staff/weather', {
        store_id: logInData.store_id,
        area: logInData.area
      });
      const data = response.data;
      setWeatherdata(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [currentDate, setCurrentDate] = useState(new Date());

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentDate(new Date());
  //   }, 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.heading}>날씨 정보</Text>
          <View style={styles.content}>
            <Text style={styles.text}>{logInData.name}님 안녕하세요!</Text>
            <Text style={styles.text}>현재 지역: {logInData.area}</Text>
            <Text style={styles.text}>스토어 아이디: {logInData.store_id}</Text>
            <Text style={styles.text}>날씨 정보: {weatherdata.presentWeather}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>오늘 날짜 시간</Text>
          <View style={styles.content}>
            <Text style={styles.text}>{currentDate.toLocaleDateString()}</Text>
            <Text style={styles.text}>{currentDate.toLocaleTimeString()}</Text>
          </View>
        </View>
        {/* <View style={styles.section}>
          <Text style={styles.heading}>메시지</Text>
          <View style={styles.content}>
            <Text style={styles.text}>{message}</Text>
            <Button title="Update Message" onPress={() => setMessage('Hello from Recoil!')} />
          </View>
        </View> */}
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
  },
});
