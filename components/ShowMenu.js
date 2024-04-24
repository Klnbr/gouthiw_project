import { StyleSheet, Text, View, Image, Pressable, FlatList } from 'react-native'
import React from 'react'
import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ShowMenu = ({ data }) => {
     const router = useRouter();
     const navigation = useNavigation();
     const handleItemPress = async (itemId) => {
          try {
               const response = await axios.get(`http://192.168.56.1:5500/menu/${itemId}`);
               const menuData = response.data;
               console.log("menuData: ", menuData)

               navigation.navigate('menuDetail', { menuData });
          } catch (error) {
               console.log('Error fetching menu data', error.message);
          }
     };
     return (
          <FlatList data={data} numColumns={2} contentContainerStyle={styles.container} renderItem={({ item }) => {
               return (
                    <Pressable onPress={() => handleItemPress(item?._id)}>
                         <View style={[styles.card, styles.shadowProp]}>
                              <View style={{ backgroundColor: 'orange', height: 85, borderRadius: 10 }}>
                                   <Image style={{ height: 90, borderRadius: 12, padding: 5 }} source={{ uri: item?.image }} />
                              </View>

                              <View style={{ padding: 5 }}>
                                   <Text style={{ fontSize: 19}}>{item?.menuName}</Text>
                                   <Text>พิวรีน: {item?.purine}</Text>
                                   <Text>กรดยูริก: {item?.uric}</Text>
                              </View>
                         </View>
                    </Pressable>
               );
          }}
               keyExtractor={(item) => item._id}
          />
     )
}

export default ShowMenu

const styles = StyleSheet.create({
     container: {
          alignSelf: "center",
     },
     card: {
          backgroundColor: 'white',
          margin: 5,
          borderRadius: 10,
          padding: 10,
          width: 190,
          marginTop:20,          
          justifyContent: "center",
     },
     shadowProp: {
          shadowColor: '#171717',
          elevation: 10
     },
})