import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const index = () => {
     const router = useRouter();
     return (
          <ScrollView>
               <View style={{ backgroundColor: "#FFA13F", borderBottomLeftRadius: 50, borderBottomRightRadius: 50, padding: 20 }}>
                    <Text style={{ textAlign: "center", color: "#FFFFFF", fontSize: 14 }}>ยินดีต้อนรับ</Text>
                    <Text style={{ padding: 10, textAlign: "center", color: "#FFFFFF", fontSize: 18, fontWeight:'bold' }}>นางสาวนาตยา พลพาหะ</Text>
               </View>
               <View style={{ marginTop: 20, alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                         <Pressable onPress={() => router.push("/(nutritionist)/home/addMenu")} style={[styles.button, styles.shadowProp]}>
                              <View style={styles.iconButton}>
                                   <MaterialCommunityIcons name="food-fork-drink" size={24} color="#4AB4A2" />
                              </View>
                              <Text style={{ color: "#4AB4A2", marginLeft: 10, fontSize: 16, fontWeight: "600", }}>เพิ่มอาหาร</Text>
                         </Pressable>
                         <Pressable onPress={() => router.push("/(nutritionist)/home/ingrList")} style={[styles.button, styles.shadowProp]}>
                              <View style={styles.iconButton}>
                                   <MaterialCommunityIcons name="fruit-cherries" size={24} color="#4AB4A2" />
                              </View>
                              <Text style={{ color: "#4AB4A2", marginLeft: 10, fontSize: 16, fontWeight: "600", }}>จัดการวัตถุดิบ</Text>
                         </Pressable>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", gap: 12 }}>
                         <Pressable onPress={() => router.push("/(nutritionist)/home/addTrivia")} style={[styles.button, styles.shadowProp,]}>
                              <View style={styles.iconButton}>
                                   <FontAwesome5 name="question" size={24} color="#4AB4A2" />
                              </View>
                              <Text style={{ color: "#4AB4A2", marginLeft: 10, fontSize: 16, fontWeight: "600" }}>ตอบกระทู้</Text>
                         </Pressable>
                         <Pressable onPress={() => router.push("/(nutritionist)/home/addTrivia")} style={[styles.button, styles.shadowProp]}>
                              <View style={styles.iconButton}>
                                   <MaterialCommunityIcons name="lightbulb-on" size={24} color="#4AB4A2" />
                              </View>
                              <Text style={{ color: "#4AB4A2", marginLeft: 10, fontSize: 16, fontWeight: "600", }}>เพิ่มเกร็ดความรู้</Text>
                         </Pressable>
                    </View>
               </View>
          </ScrollView>
     )
}

export default index

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