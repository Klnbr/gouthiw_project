import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Modal, TextInput, Button, Alert } from 'react-native';
import { AntDesign, Fontisto } from '@expo/vector-icons';
import axios from 'axios';
import { useRoute } from '@react-navigation/native'
import { useRouter } from 'expo-router';

const Checkbox = ({ label, isChecked, toggleCheckbox, onPress }) => {
     return (
          <TouchableOpacity onPress={() => { toggleCheckbox(); onPress(); }} style={styles.checkboxContainer}>
               <Fontisto name={isChecked ? 'checkbox-active' : 'checkbox-passive'} size={24} color="black" />
               <Text style={styles.label}>{label}</Text>
          </TouchableOpacity>
     );
}

const createMenu = () => {
     const router = useRouter();
     const route = useRoute();
     const meal = route.params.meal;
     const [ingrList, setIngrList] = useState([]);
     const [selectedIngr, setSelectedIngr] = useState(null);
     const [quantity, setQuantity] = useState(0);
     const [unit, setUnit] = useState('');
     const [modalVisible, setModalVisible] = useState(false);
     const [modalFood, setModalFood] = useState(false);

     const [purine, setPurine] = useState(0);
     const [uric, setUric] = useState(0);

     const [foodName, setFoodName] = useState('');

     console.log("meal:", meal)

     const toggleCheckbox = (index) => {
          setModalVisible(true);
          setIngrList((prevState) => {
               const updatedIngrList = [...prevState];
               updatedIngrList[index].isChecked = !updatedIngrList[index].isChecked;
               if (updatedIngrList[index].isChecked) {
                    setModalVisible(true);
               } else {
                    setModalVisible(false);

                    let totalPurine = 0;
                    let totalUric = 0;

                    updatedIngrList.forEach((ingr) => {
                         if (ingr.isChecked) {
                              totalPurine += ingr.purine * parseFloat(ingr.quantity) / 100;
                              totalUric += ingr.uric * parseFloat(ingr.quantity) / 100;
                         }
                    });

                    setPurine(totalPurine.toFixed(2));
                    setUric(totalUric.toFixed(2));
               }
               return updatedIngrList;
          });

     }

     const handleAddQuantity = () => {
          if (quantity !== '') {
               const updatedIngrList = ingrList.map((ingr, index) => {
                    if (index === selectedIngr) {
                         return { ...ingr, quantity: quantity };
                    }
                    return ingr;

               });

               setIngrList(updatedIngrList);
               setModalVisible(false);

               let totalPurine = 0;
               let totalUric = 0;

               updatedIngrList.forEach((ingr) => {
                    if (ingr.isChecked) {
                         totalPurine += ingr.purine * parseFloat(ingr.quantity) / 100;
                         totalUric += ingr.uric * parseFloat(ingr.quantity) / 100;
                    }
               });

               setPurine(totalPurine.toFixed(2));
               setUric(totalUric.toFixed(2));
               setQuantity('');
          } else {
               Alert.alert('กรุณากรอกปริมาณวัตถุดิบ');
          }
     }

     useEffect(() => {
          const fetchIngrData = async () => {
               try {
                    const response = await axios.get("http://192.168.56.1:5500/ingrs", { timeout: 10000 });
                    setIngrList(response.data.map((ingr) => ({
                         ...ingr,
                         isChecked: false,
                         quantity: 0,
                         unit: "กรัม"
                    })));
               } catch (error) {
                    console.log("Error fetching ingrs data", error.message)
               }
          }
          fetchIngrData();
     }, []);

     const handleAddFood = async () => {
          try {
               const purineValue = parseFloat(purine);
               const uricValue = parseFloat(uric);

               console.log(typeof purineValue); // ตรวจสอบชนิดข้อมูลของ purineValue
               console.log(typeof uricValue);

               const mealData = {
                    menuName: foodName,
                    purine: purineValue,
                    uric: uricValue,
                    qty: 1,
               };

               console.log("mealData: ", mealData)

               let apiEndpoint = '';

               if (meal === 'breakfast') {
                    apiEndpoint = "http://192.168.56.1:5500/user/addBreakfast";
               } else if (meal === 'lunch') {
                    apiEndpoint = "http://192.168.56.1:5500/user/addLunch";
               } else if (meal === 'dinner') {
                    apiEndpoint = "http://192.168.56.1:5500/user/addDinner";
               } else {
                    throw new Error("Invalid meal type");
               }

               const response = await axios.post(apiEndpoint, mealData);

               if (response.status === 201) {
                    Alert.alert("เพิ่มเข้าสำเร็จ");
                    setModalFood(false);
                    router.replace("/diary");
               }
          } catch (error) {
               Alert.alert("เพิ่มเข้าไม่สำเร็จ", error.response?.data.message || "Unknown error");
               console.log("error creating meal", error);
          }
     };

     return (
          <View>
               <Text>เลือกวัตถุดิบ</Text>
               <View>
                    <View style={{ backgroundColor: 'lightgray', width: 350, height: 200, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', padding: 20, margin: 20, borderRadius: 20 }}>
                         {ingrList.map((ingr, index) => (
                              ingr.isChecked &&
                              <View key={index} style={{ flexDirection: "row" }}>
                                   <Text>{ingr.name} - {ingr.quantity} {unit.quantity}</Text>
                              </View>
                         ))}
                         <View>
                              <Text>พิวรีนรวม: {purine}</Text>
                              <Text>กรดยูริกรวม: {uric}</Text>
                         </View>
                    </View>
                    <Pressable onPress={() => setModalFood(true)}>
                         <Text>เพิ่มเป็นเมนู</Text>
                    </Pressable>
                    <Modal
                         animationType="slide"
                         transparent={true}
                         visible={modalFood}
                         onRequestClose={() => {
                              setModalFood(false);
                         }}
                    >
                         <View style={styles.centeredView}>
                              <View style={styles.modalView}>
                                   <TextInput
                                        style={styles.input}
                                        onChangeText={setFoodName} // สร้าง state เพื่อเก็บชื่ออาหาร
                                        value={foodName} // ใช้ค่า state เพื่อเซ็ตค่าของ TextInput
                                        placeholder="ชื่ออาหาร"
                                   />
                                   <Button onPress={handleAddFood} title="เพิ่ม" />
                                   <Button title="Cancel" onPress={() => setModalFood(false)} />  
                              </View>
                         </View>
                    </Modal>
               </View>
               {ingrList.map((ingr, index) => (
                    <View key={index} style={{ flexDirection: "row", margin: 15 }}>
                         <Checkbox
                              label={ingr.name}
                              isChecked={ingr.isChecked}
                              toggleCheckbox={() => toggleCheckbox(index)}
                              onPress={() => setSelectedIngr(index)} />
                    </View>
               ))}
               <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                         setModalVisible(false);
                    }}
               >
                    <View style={styles.centeredView}>
                         <View style={styles.modalView}>
                              <TextInput
                                   style={styles.input}
                                   onChangeText={setQuantity}
                                   value={quantity}
                                   placeholder="ใส่ปริมาณ"
                                   keyboardType="numeric"
                              />
                              <Button onPress={handleAddQuantity} title="OK" />
                              <Button title="Cancel" onPress={() => setModalVisible(false)} />  
                         </View>
                    </View>
               </Modal>

          </View>
     )
}

export default createMenu

const styles = StyleSheet.create({
     container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
     },
     checkboxContainer: {
          flexDirection: 'row',
          alignItems: 'center',
     },
     label: {
          marginLeft: 8,
     },
     centeredView: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 22
     },
     modalView: {
          margin: 20,
          backgroundColor: "white",
          borderRadius: 20,
          padding: 35,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
               width: 0,
               height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5
     },
     input: {
          height: 40,
          width: '100%',
          margin: 12,
          borderWidth: 1,
          padding: 10,
          borderRadius: 10
     }
});