import { FlatList, StyleSheet, Text, View, Alert, Pressable } from 'react-native'
import React from 'react'
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const ShowIngredient = ({ data, input, setInput }) => {
     const navigation = useNavigation();
     const router = useRouter();
     const handleItemPress = async (itemId) => {
          try {
               const response = await axios.get(`http://192.168.56.1:5500/ingr/${itemId}`);
               const ingrData = response.data;
               console.log("ingrData: ", ingrData)

               navigation.navigate('editIngr', { ingrData });
          } catch (error) {
               console.log('Error fetching ingr data', error.message);
          }

     };
    
     return (
          <ScrollView>
               <View style={{ padding: 10, marginBottom: 80 }}>
                    <View style={styles.headerTopBar}>
                         <Text style={styles.headerTopBarText}>รายการวัตถุดิบ</Text>
                    </View>
                    <View style={styles.header}>
                         <Text style={styles.heading}>ชื่อวัตถุดิบ</Text>
                         <Text style={styles.heading}>ค่าพิวรีน{"\n"}<Text style={styles.span}>(โดยเฉลี่ย)</Text></Text>
                         <Text style={styles.heading}>ค่ากรดยูริก{"\n"}<Text style={styles.span}>(โดยเฉลี่ย)</Text></Text>
                         <Text style={styles.headingCenter}>แก้ไข{"\n"}</Text>

                    </View>
                    <FlatList data={data} renderItem={({ item }) => {
                         return (
                              <View style={styles.header}>
                                   <Text style={styles.heading}>{item?.name}</Text>
                                   <Text style={styles.heading}>{item?.purine}</Text>
                                   <Text style={styles.heading}>{item?.uric}</Text>
                                   <Pressable style={styles.headingCenter} onPress={() => handleItemPress(item?._id)}>
                                        {/* <Text >แก้ไข</Text> */}
                                        <AntDesign style={{marginLeft:25}} name="edit" size={24} color="black" />
                                   </Pressable>

                                 

                              </View>
                         )
                    }}
                         keyExtractor={(item) => item._id}
                    />
               </View>
          </ScrollView>

     )
}

export default ShowIngredient

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#fff',
          paddingVertical: 30,
          paddingHorizontal: 30
     },
     headerTopBar: {
          backgroundColor: '#ffa13f',
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 5,
          elevation: 2,
     },
     headerTopBarText: {
          color: 'white',
          fontSize: 16
     },
     header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 10,
          marginTop: 5
     },
     heading: {
          flex: 1,
          fontSize: 15,
          marginLeft:10
     },
     headingCenter: {
          flex: 1,
          fontSize: 15,
          textAlign: "center"
     },
     row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 8,
          marginVertical: 2,
          elevation: 1,
          borderRadius: 3,
          borderColor: '#fff',
          padding: 10,
          backgroundColor: '#fff'
     },
     cell: {
          fontSize: 15,
          textAlign: 'left',
          flex: 1
     },
     span: {
          flex: 1,
          fontSize: 10
     }
})