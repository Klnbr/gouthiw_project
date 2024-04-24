import { FlatList, StyleSheet, Text, View, Image, VirtualizedList, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const UserBreakfast = ({ menuBreakfast }) => {
     const [menu, setMenus] = useState([]);
     const router = useRouter();
     useEffect(() => {
          const fetchMenuData = async () => {
               try {
                    const response = await axios.get("http://192.168.56.1:5500/menus", { timeout: 1000 });
                    setMenus(response.data);
               } catch (error) {
                    console.log("Error fetching menus data", error.message)
               }
          }
          fetchMenuData();
     }, [])

     const handledelete = async (itemId) => {
          try {
               const response = await axios.delete(`http://192.168.56.1:5500/breakfast/delete/${itemId}`);

               if (response.status === 200) {
                    Alert.alert("ลบสำเร็จ");
                    router.replace('/diary');
               }
          } catch (error) {
               console.log('Error deleting breakfast', error);
               // Handle error, show a message, or perform other actions as needed
          }
     };

     return (
          <View>
               <FlatList data={menuBreakfast} renderItem={({ item }) => {
                    const compareData = menu.find((menuItem) => menuItem?.menuName === item?.menuName);

                    return (
                         <Pressable style={[styles.button, styles.shadowProp]}>
                              <View style={{ width: '30%' }}>
                                   <Image style={{ width: 100, height: 60, borderRadius: 12, padding: 5 }} source={compareData?.image ? { uri: compareData?.image } : require('../assets/food_unknown.jpg')} />
                              </View>

                              <View style={{ width: '60%', marginLeft: 10 }}>
                                   <Text style={{ color: '#ffa13f', fontSize: 18 }}>{item?.menuName}
                                        <Text style={{ color: 'black', fontSize: 12}}>  x {item?.qty}</Text>
                                   </Text>
                                   <Text style={{ fontSize: 12 }}>พิวรีน: {item?.purine}</Text>
                                   <Text style={{ fontSize: 12 }}>กรดยูริก: {item?.uric}</Text>

                              </View>

                              <Pressable style={{  }} onPress={() => handledelete(item?._id)}>
                                   <MaterialCommunityIcons name="delete-circle-outline" size={24} color="grey" />
                              </Pressable>
                         </Pressable>
                    );
               }}
                    keyExtractor={(item) => item._id}
               />
          </View>
     )
}

export default UserBreakfast

const styles = StyleSheet.create({
     button: {
          borderRadius: 6,
          padding: 10,
          // alignItems: "center",
          marginVertical: 5,
          backgroundColor: "white",
          flexDirection: 'row',
          height: 80,
          justifyContent: 'space-between',
          margin: 10, marginTop: 10
     },
     shadowProp: {
          shadowColor: '#171717',
          elevation: 10
     },
})