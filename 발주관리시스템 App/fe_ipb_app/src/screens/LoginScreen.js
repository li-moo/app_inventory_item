import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Logo3 from '../components/Logo3';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { identifierValidator } from '../helpers/identifierValidator';
import { passwordValidator } from '../helpers/passwordValidator';
import axios from 'axios';
import { useRecoilValue, useRecoilState, atom } from 'recoil';
import { logInState } from '../state/loginState';

const MAX_LOGIN_ATTEMPTS = 5; // Maximum number of login attempts allowed

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [loginError, setLoginError] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const [logInData, setLogInData] = useRecoilState(logInState);

  const onLoginPressed = () => {
    const identifierError = identifierValidator(identifier.value);
    const passwordError = passwordValidator(password.value);
    if (identifierError || passwordError) {
      setIdentifier({ ...identifier, error: identifierError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    const url = 'http://43.202.9.215:8080/staff/login'; // Replace with your backend URL

    axios
      .post(url, {
        login_id: identifier.value,
        pwd: password.value,
      })
      .then(function (response) {
        const staff = response.data;

        if (staff !== null && staff !== '') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
          }
          );
          setLogInData(staff)
        } else {
          handleLoginFailure();
        }
      })
      .catch(function (error) {
        console.error(error);
        // Handle error
      });
  };

  const handleLoginFailure = () => {
    setLoginAttempts(loginAttempts + 1);

    if (loginAttempts + 1 === MAX_LOGIN_ATTEMPTS) {
      setLoginError(true);
    } else {
      setLoginError(false);
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo3 />
      <Header style={{ color: 'black', fontSize: 35, fontWeight: 'bold' }}>환영합니다</Header>
      <TextInput
        label="아이디"
        returnKeyType="next"
        value={identifier.value}
        onChangeText={(text) => setIdentifier({ value: text, error: '' })}
        error={!!identifier.error}
        errorText={identifier.error}
        autoCapitalize="none"
        autoCompleteType="off"
        textContentType="none"
        style={{ backgroundColor: 'gray' }} // 배경색 설정
        color="black" // 텍스트 색상 설정
      />
      <TextInput
        label="비밀번호"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        style={{ backgroundColor: 'gray' }} // 배경색 설정
        color="black" // 텍스트 색상 설정
      />
      {loginError && (
        <Text style={styles.errorText}>로그인에 실패했습니다. 아이디 비밀번호를 다시 확인해주세요</Text>
      )}
      <Button
        mode="contained"
        onPress={onLoginPressed}
        disabled={loginAttempts >= MAX_LOGIN_ATTEMPTS}
        color="#262627" // Change the button color to your desired color
      >
        Login
      </Button>
      {loginAttempts >= MAX_LOGIN_ATTEMPTS && (
        <Text style={styles.errorText}>최대 허용 시도 횟수를 초과했습니다. 잠시후 다시이용해주세요</Text>
      )}
    </Background>
  );
}
  
const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  // Your other custom styles here
});
