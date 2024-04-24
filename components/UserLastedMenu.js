import { StyleSheet, Text, View, FlatList, Pressable, Image } from 'react-native'
import React from 'react'
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const UserLastedMenu = ({ data }) => {
     const navigation = useNavigation();
     const handleItemPress = async (itemId) => {
          try {
               const response = await axios.get(`http://192.168.56.1:5500/menu/${itemId}`);
               const menuData = response.data;
               console.log("menuData: ", menuData)

               navigation.navigate('menu_Detail', { menuData });
          } catch (error) {
               console.log('Error fetching menu data', error.message);
          }
     };
     return (
          <FlatList data={data} numColumns={6} contentContainerStyle={styles.container} renderItem={({ item }) => {
               return (
                    <Pressable onPress={() => handleItemPress(item?._id)}>
                         <View style={[styles.card, styles.shadowProp]}>
                              <View style={{ backgroundColor: 'orange', height: 85, borderRadius: 10 }}>
                                   <Image style={{ width: '100%', height: '100%', borderRadius: 12, padding: 5 }} source={{ uri: item?.image }} />
                              </View>

                              <View style={{ padding: 5 }}>
                                   <Text style={{ fontSize: 16.8 }}>{item?.menuName}</Text>
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

export default UserLastedMenu


const styles = StyleSheet.create({
     container: {
          alignSelf: "center",
     },
     card: {
          backgroundColor: 'white',
          margin: 5,
          borderRadius: 10,
          padding: 10,
          width: 150,
          marginTop:20,          
          justifyContent: "center",
     },
     shadowProp: {
          shadowColor: '#171717',
          elevation: 10
     },
})