import { StyleSheet, Text, View, Image, Pressable, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native'
import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { firebase } from '../../../firebase';
import * as  ImagePicker from 'expo-image-picker';

const menu_Detail = () => {
     const router = useRouter();
     const navigation = useNavigation();
     const route = useRoute();
     const [isDropdownVisible, setDropdownVisible] = useState(false);
     const { params } = route;
     const { menuData } = params || {};
     const [ingredients, setIngredients] = useState([]);
     const [method, setMethod] = useState([]);

     const [name, setName] = useState("");
     const [purine, setPurine] = useState("");
     const [uric, setUric] = useState("");
     const [image, setImage] = useState("");

     const [menuBreakfast, setMenuBreakfast] = useState([]);
     const [menuLunch, setMenuLunch] = useState([]);
     const [menuDinner, setMenuDinner] = useState([]);
     const [qty, setQty] = useState(1);


     useEffect(() => {
          if (menuData) {
               setIngredients(menuData.ingredients);
               setMethod(menuData.method);
          }

     }, [menuData]);

     const pickImage = async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
               mediaTypes: ImagePicker.MediaTypeOptions.Images,
               allowsEditing: true,
               aspect: [4, 4],
               quality: 1,
          })
          console.log(result)

          if (!result.canceled) {
               setImage(result.assets[0].uri)
          }
     }

     const uploadFile = async () => {
          try {
               // Ensure that 'image' contains a valid file URI
               console.log("Image URI:", image);

               const { uri } = await FileSystem.getInfoAsync(image);

               if (!uri) {
                    throw new Error("Invalid file URI");
               }

               const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                         resolve(xhr.response);
                    };
                    xhr.onerror = (e) => {
                         reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", uri, true);
                    xhr.send(null);
               });

               const filename = image.substring(image.lastIndexOf("/") + 1);

               const ref = firebase.storage().ref().child(filename);
               await ref.put(blob);

               const downloadURL = await ref.getDownloadURL();
               console.log("Download URL:", downloadURL);
               // setUrl(downloadURL);
               return downloadURL;
               // Alert.alert("Photo uploaded");
          } catch (error) {
               console.log("Error:", error);
               // Handle the error or display a user-friendly message
          }
     };

     const handleItemPress = () => {
          if (menuData) {
               navigation.navigate('methodTTS', { menuData });
          }
     }

     const handleAddDiary = () => {
          setDropdownVisible(true);
     }

     const handleMethod = () => {
          if (menuData) {
               navigation.navigate('editMenu', { menuData });
          }
     }

     const handleBreakfast = async () => {
          try {
               const breakfastData = {
                    menuName: menuData.menuName,
                    purine: menuData.purine,
                    uric: menuData.uric,
                    qty: qty,
               };

               console.log("Menu Data:", breakfastData);

               const response = await axios.post("http://192.168.56.1:5500/user/addBreakfast", breakfastData);

               console.log("Breakfast created", response.data);
               if (response.status === 201) {
                    Alert.alert("เพิ่มเข้าสำเร็จ");
                    router.replace("/diary");
               }
          } catch (error) {
               Alert.alert("เพิ่มเข้าไม่สำเร็จ", error.response.data.message || "Unknown error");
               console.log("error creating Breakfast", error);
          }

          closeDropdown();
     }

     const handleLunch = async () => {
          try {
               const lunchData = {
                    menuName: menuData.menuName,
                    purine: menuData.purine,
                    uric: menuData.uric,
                    qty: qty,
               };

               console.log("Menu Data:", lunchData);

               const response = await axios.post("http://192.168.56.1:5500/user/addLunch", lunchData);

               console.log("Lunch created", response.data);
               if (response.status === 201) {
                    Alert.alert("เพิ่มเข้าสำเร็จ");
                    router.replace("/diary");
               }
          } catch (error) {
               Alert.alert("เพิ่มเข้าไม่สำเร็จ", error.response.data.message || "Unknown error");
               console.log("error creating Lunch", error);
          }
          closeDropdown();
     }

     const handleDinner = async () => {
          try {
               const dinnerData = {
                    menuName: menuData.menuName,
                    purine: menuData.purine,
                    uric: menuData.uric,
                    qty: qty,
               };

               console.log("Menu Data:", dinnerData);

               const response = await axios.post("http://192.168.56.1:5500/user/addDinner", dinnerData);

               console.log("Dinner created", response.data);
               if (response.status === 201) {
                    Alert.alert("เพิ่มเข้าสำเร็จ");
                    router.replace("/diary");
               }
          } catch (error) {
               Alert.alert("เพิ่มเข้าไม่สำเร็จ", error.response.data.message || "Unknown error");
               console.log("error creating Dinner", error);
          }
          closeDropdown();
     }

     const closeDropdown = () => {
          setDropdownVisible(false);
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
                    <Text style={{ fontSize: 16, marginRight: 24 }}>พิวรีน: <Text style={{ color: '#ffa13f', fontWeight: 'bold' }}>{menuData.purine}</Text> มิลลิกรัม</Text>
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
               <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Pressable style={styles.buttonw} onPress={handleItemPress}>
                         <Text style={{ color: '#ffa13f' }}>ดูวิธีการทำ</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={handleAddDiary}>
                         <Text style={{ color: 'white' }}>เพิ่มเข้าในไดอารี่</Text>
                    </Pressable>
                    <Modal isVisible={isDropdownVisible} onBackdropPress={closeDropdown}>
                         <View style={styles.dropdownContainer}>
                              <Pressable style={styles.dropdownItem} onPress={handleBreakfast}>
                                   <Text>มื้อเช้า</Text>
                              </Pressable>
                              <Pressable style={styles.dropdownItem} onPress={handleLunch}>
                                   <Text>มื้อกลางวัน</Text>
                              </Pressable>
                              <Pressable style={styles.dropdownItem} onPress={handleDinner}>
                                   <Text>มื้อเย็น</Text>
                              </Pressable>
                         </View>
                    </Modal>
               </View>

          </ScrollView>
     )
}

export default menu_Detail

const styles = StyleSheet.create({
     dropdownContainer: {
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          margin: 20,
     },
     dropdownItem: {
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: 'lightgray',
     },
     buttong: {
          justifyContent: "center",
          alignItems: "center",
          textAlign: 'center',
          margin: 20,
          flexDirection: 'row',
          marginRight: 20,

     },
     button: {
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: '#ffa13f',
          width: 150,
          height: 42,
          margin: 10,
          borderRadius: 20
     },
     buttonw: {
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1.6,
          borderColor: '#ffa13f',
          width: 150,
          height: 42,
          margin: 10,
          borderRadius: 20
     },
     lineStyle: {
          borderWidth: 0.5,
          width: '80%',
          // alignContent: 'center',
          alignSelf: 'center',
          marginTop: 9
     }
})   