import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'

export default function StartScreen({ navigation }) {
  return (
    <Background>
      <Logo />
      <Header>발주 관리 시스템</Header>
      <Paragraph>
  통합 발주 관리 시스템입니다<br />로그인 하여 이용해주시길 바랍니다.
</Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        로그인
      </Button>
    </Background>
  )
}
