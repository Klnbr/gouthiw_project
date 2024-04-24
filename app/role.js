import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const role = () => {
     const router = useRouter();
     return (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, justifyContent: "center" }}>
               <Pressable onPress={() => router.push("/(user)/homeUser")} style={[styles.button, styles.shadowProp]}>
                    <View style={styles.iconButton}>
                         <MaterialCommunityIcons name="food-fork-drink" size={24} color="#4AB4A2" />
                    </View>
                    <Text style={{ color: "#4AB4A2", marginLeft: 10, fontSize: 16, fontWeight: "600", }}>ผู้ป่วยโรคเกาต์</Text>
               </Pressable>
               <Pressable onPress={() => router.push("/(nutritionist)/home")} style={[styles.button, styles.shadowProp]}>
                    <View style={styles.iconButton}>
                         <MaterialCommunityIcons name="fruit-cherries" size={24} color="#4AB4A2" />
                    </View>
                    <Text style={{ color: "#4AB4A2", marginLeft: 10, fontSize: 16, fontWeight: "600", }}>นักโภชนาการ</Text>
               </Pressable>
          </View>
     )
}

export default role

const styles = StyleSheet.create({
     button: {
          borderRadius: 6,
          padding: 10,
          alignItems: "center",
          marginVertical: 15,
          backgroundColor: "#FFFFFF",
          width: 150,
     },
     shadowProp: {
          shadowColor: '#171717',
          elevation: 10
     },
     iconButton: {
          padding: 7,
          width: 45,
          height: 45,
          borderRadius: 7,
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center"
     }
})