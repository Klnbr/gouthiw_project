import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

const index = () => {
  const router = useRouter();
  return (
    <View style={{flexDirection:'row',justifyContent: 'center',    alignItems: 'center',}}>
      <Pressable style={styles.Button} onPress={() => router.push('../role')}>
        <Text style={{ color: "white", fontSize: 18 }}>ออกจากระบบ</Text>
      </Pressable>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  Button: {
    backgroundColor: "red",
    width: 380,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    padding: 16,
    borderRadius: 50
  }
})