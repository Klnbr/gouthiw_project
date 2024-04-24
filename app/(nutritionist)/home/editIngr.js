import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Entypo, AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { useRoute } from '@react-navigation/native'

const editIngr = () => {
     const router = useRouter();
     const route = useRoute();
     const { params } = route;
     const { ingrData } = params || {};
     console.log("Received ingrData in editIngr:", ingrData);
     const [name, setName] = useState("");
     const [purine, setPurine] = useState("");
     const [uric, setUric] = useState("");

     useEffect(() => {
          if (ingrData) {
               console.log("ingrData: ", ingrData)
               setName(ingrData.name);
               setPurine(ingrData.purine);
               setUric(ingrData.uric);
          }
     }, [ingrData]);

     console.log(ingrData)

     const handleEditIngre = async () => {
          try {
               const updateingreData = {
                    name: name,
                    purine: purine,
                    uric: uric
               };

               console.log('Updated Ingr Data:', updateingreData);

               const response = await axios.put(`http://192.168.56.1:5500/ingr/edit/${ingrData._id}`, updateingreData);

               console.log('Ingr updated', response.data);

               if (response.status === 200) {
                    router.replace('/home/ingrList'); // Navigate to the ingrList screen after successful update
               }
          } catch (error) {
               console.log('Error updating ingr', error);
          }

     }

     const handledeleteIngr = async (itemId) => {
          try {
               const response = await axios.delete(`http://192.168.56.1:5500/ingr/delete/${itemId}`);

               if (response.status === 200) {
                    // Ingredient soft deleted successfully
                    Alert.alert("ลบสำเร็จ");
                    router.replace('/home/ingrList');
                    console.log('Ingredient deleted successfully');
                    // You can perform additional actions here if needed
               }
          } catch (error) {
               console.log('Error deleting ingr', error);
               // Handle error, show a message, or perform other actions as needed
          }
     };

     return (
          <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
               <Pressable onPress={() => router.canGoBack()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
               </Pressable>
               <View style={{ padding: 10 }}>
                    <View style={{ marginVertical: 10 }}>
                         <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                              ชื่อวัตถุดิบ
                         </Text>
                         <TextInput
                              value={name}
                              onChangeText={(text) => setName(text)}
                              style={{
                                   padding: 10,
                                   borderColor: "#004AAD",
                                   borderWidth: 1,
                                   marginTop: 10,
                                   borderRadius: 5
                              }}
                               />
                    </View>

                    <View style={{ marginVertical: 10 }}>
                         <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                              ค่าพิวรีนสุทธิ
                         </Text>
                         <TextInput
                              // onPress={() => setIsEditing(!isEditing)}
                              value={purine.toString()}
                              onChangeText={(text) => setPurine(text)}
                              style={{
                                   padding: 10,
                                   borderColor: "#004AAD",
                                   borderWidth: 1,
                                   marginTop: 10,
                                   borderRadius: 5
                              }}
                               />
                    </View>

                    <View>
                         <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                              ค่ากรดยูริกสุทธิ
                         </Text>
                         <TextInput
                              // onPress={() => setIsEditing(!isEditing)}
                              value={uric.toString()}
                              onChangeText={(text) => setUric(text)}
                              style={{
                                   padding: 10,
                                   borderColor: "#004AAD",
                                   borderWidth: 1,
                                   marginTop: 10,
                                   borderRadius: 5
                              }}
                               />
                    </View>

                    <Pressable onPress={handleEditIngre} style={{ backgroundColor: "#FF66C4", padding: 10, marginTop: 20, justifyContent: "center", alignItems: "center", borderRadius: 5 }}>
                         <Text style={{ fontWeight: "bold", color: "white" }}>ยืนยัน</Text>
                    </Pressable>
                    <Pressable onPress={() => handledeleteIngr(ingrData._id)} style={{ backgroundColor: "red", padding: 10, marginTop: 20, justifyContent: "center", alignItems: "center", borderRadius: 5 }}>
                         <Text style={{ fontWeight: "bold", color: "white" }}>ลบวัตถุดิบ</Text>
                    </Pressable>

               </View>
          </ScrollView>
     )
}

export default editIngr

const styles = StyleSheet.create({
     container: {
          backgroundColor: 'white',
          padding: 16,
          flex: 1
     },
     dropdown: {
          padding: 10, borderBottomWidth: 1, marginTop: 10, borderBottomColor: 'black'
     },
     input: {
          margin: 10, width: 150, padding: 10, borderBottomWidth: 1, marginTop: 10, borderBottomColor: 'black'
     },
     icon: {
          marginRight: 5,
     },
     label: {
          position: 'absolute',
          backgroundColor: 'white',
          left: 22,
          top: 8,
          zIndex: 999,
          paddingHorizontal: 8,
          fontSize: 14,
     },
     placeholderStyle: {
          fontSize: 16,
     },
     selectedTextStyle: {
          fontSize: 16,
     },
     iconStyle: {
          width: 20,
          height: 20,
     },
     inputSearchStyle: {
          height: 40,
          fontSize: 16,
     },
});