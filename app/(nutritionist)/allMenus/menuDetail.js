import { StyleSheet, Text, View, Image, Pressable, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native'
import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { firebase } from '../../../firebase';

const menuDetail = () => {
     const router = useRouter();
     const navigation = useNavigation();
     const route = useRoute();
     const { params } = route;
     const { menuData } = params || {};

     const [ingredients, setIngredients] = useState([]);

     const [method, setMethod] = useState([]);

     useEffect(() => {
          if (menuData) {
               setIngredients(menuData.ingredients);
               setMethod(menuData.method);
          }

     }, [menuData]);

     const handleItemPress = () => {
          if (menuData) {
               navigation.navigate('methodTTS', { menuData });
          }
     }

     const handleEditPress = () => {
          if (menuData) {
               navigation.navigate('editMenu', { menuData });
          }
     }

     const handledeleteMemu = async () => {
          try {
               const response = await axios.delete(`http://192.168.56.1:5500/menu/delete/${menuData._id}`);

               if (response.status === 200) {
                    Alert.alert("ลบสำเร็จ");
                    router.replace('/allMenus');
                    console.log('Menu deleted successfully');
               }
          } catch (error) {
               console.log('Error deleting Menu', error);
          }
     };

     return (
          <ScrollView>
               <View style={{ flexDirection: "row" }}>
                    <View style={{ marginTop: 15 }}>
                         <Pressable onPress={() => navigation.goBack()}>
                              <AntDesign name="arrowleft" size={24} color="black" />
                         </Pressable>
                    </View>

                    <View style={{ fontSize: 20, alignItems: 'center', alignContent: 'center', fontWeight: 'bold', width: '87%', marginTop: 15 }}>
                         <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{menuData.menuName}</Text>
                    </View>
               </View>



               <Image style={{ width: 450, height: 250, marginTop: 15 }} source={{ uri: menuData.image }} />


               <View style={styles.buttong}>
                    <Text style={{ fontSize: 16 }}>พิวรีน: <Text style={{ color: '#ffa13f', fontWeight: 'bold' }}>{menuData.purine}</Text> มิลลิกรัม</Text>
                    <Text style={{ fontSize: 16 }}>กรดยูริก: <Text style={{ color: '#4AB4A2', fontWeight: 'bold' }}>{menuData.uric}</Text> มิลลิกรัม</Text>
               </View>

               <View>
                    <Text style={{ fontSize: 17, marginLeft: 35, marginTop: 20 }}>วัตถุดิบ</Text>
                    <View style={styles.lineStyle} />

                    <View>
                         {ingredients.map((ingr, index) => (
                              <View key={index} style={{ marginLeft: 40, marginTop: 10, flexDirection: 'row' }}>
                                   <Entypo name="dot-single" size={24} color="black" />
                                   <Text>{ingr.ingrName}</Text>
                              </View>
                         ))}
                    </View>
               </View>

               <View>
                    <Text style={{ fontSize: 17, marginLeft: 35, marginTop: 20 }}>วิธีการทำอาหาร</Text>
                    <View style={styles.lineStyle} />

                    <View style={{ padding: 50, marginTop: -50 }}>
                         {method.map((methodText, index) => (
                              <View key={index} style={{ marginTop: 10 }}>
                                   <Text>{index + 1}. {methodText}</Text>
                              </View>
                         ))}
                    </View>
               </View>
               <View style={{flexDirection:'row',justifyContent: 'center',    alignItems: 'center',}}>
                    <Pressable style={styles.button} onPress={handleItemPress}>
                         <Text style={{ color: '#ffa13f' }}>ดูวิธีการทำ</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={handleEditPress}>
                         <Text style={{ color: 'black' }}>แก้ไข</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={handledeleteMemu}>
                         <Text style={{ color: 'red' }}>ลบ</Text>
                    </Pressable>

               </View>

          </ScrollView>
     )
}

export default menuDetail

const styles = StyleSheet.create({
     lineStyle: {
          borderWidth: 0.5,
          width: '80%',
          // alignContent: 'center',
          alignSelf: 'center',
          marginTop: 9
     },
     button: {
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 20,
          borderColor: '#ffa13f',
          borderWidth: 2,
          textAlign: 'center',
          width: 100,
          padding: 15,
          borderRadius: 50,
          margin:20
     },
     buttonw: {
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 20,
          backgroundColor: '#ffa13f',
          textAlign: 'center',
          width: 150,
          padding: 15,
          borderRadius: 50,
     },
     buttong: {
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 20,
          textAlign: 'center',
          width: '85%',
          // padding: 15,

          flexDirection: 'row',
          alignSelf: 'center',
     }
})