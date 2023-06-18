import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo3() {
  return <Image source={require('../assets/logo3.png')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    marginBottom: 8,
  },
})
