import { FlatList, StyleSheet, Text, View, Image, SafeAreaView, Pressable } from 'react-native'
import React from 'react'
import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ShowTrivia = ({ data, input, setInput }) => {
     const router = useRouter();
     const navigation = useNavigation();
     const handleItemPress = async (itemId) => {
          try {
               const response = await axios.get(`http://192.168.56.1:5500/trivia/${itemId}`);
               const triviaData = response.data;
               console.log("triviaData: ", triviaData)

               navigation.navigate('edit', { triviaData });
          } catch (error) {
               console.log('Error fetching trivia data', error.message);
          }
     };
     return (
          <View>
               <FlatList data={data} renderItem={({ item }) => {
                    return (
                         <Pressable onPress={() => handleItemPress(item?._id)} style={[styles.button, styles.shadowProp]}>
                              <View style={{ width: '65%', padding: 10 }}>
                                   <Text style={{ color: '#ffa13f', fontSize: 20 }}>{item?.head}</Text>
                                   <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: 16, padding: 5 }}>{item?.content}</Text>
                              </View>

                              <View style={{ width: '30%' }}>
                                   <Image style={{ width: '100%', height: '100%', borderRadius: 12, padding: 5 }} source={{ uri: item?.image }} />
                              </View>
                         </Pressable>
                    );
               }}
                    keyExtractor={(item) => item._id}
               />
          </View>
     )
}

export default ShowTrivia

const styles = StyleSheet.create({
     button: {
          borderRadius: 6,
          padding: 10,
          alignItems: "center",
          marginVertical: 5,
          backgroundColor: "white",
          flexDirection: 'row',
          height: 100,
          justifyContent: 'space-between',
          margin: 10, marginTop: 10
     },
     shadowProp: {
          shadowColor: '#171717',
          elevation: 10
     },
})