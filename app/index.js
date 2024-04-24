import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router';

const index = () => {
  return (
    <View>
      <Redirect href="/(nutritionist)/home" />
      {/* <Redirect href="/(user)/profile" /> */}
       {/* <Redirect href="/(user)/menu/menuTTS" /> */}
      {/* <Redirect href="/(nutritionist)/allMenus" /> */}
    </View>
  )
}

export default index

const styles = StyleSheet.create({})