import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Pressable, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Entypo, AntDesign } from '@expo/vector-icons';
import * as  ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native'
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import * as FileSystem from "expo-file-system";
import { firebase } from '../../../firebase';


const data = [
     { label: 'ต้ม', value: '1' },
     { label: 'ผัด', value: '2' },
     { label: 'แกง', value: '3' },
     { label: 'ทอด', value: '4' }
];

const ing = [
     { label: '(ไม่ระบุ)', value: '1' },
     { label: 'กรัม', value: '2' },
     { label: 'กิโลกรัม', value: '3' },
     { label: 'ช้อนโต๊ะ', value: '4' },
     { label: 'ช้อนชา', value: '5' }
];

const editMenu = () => {
     const router = useRouter();
     const route = useRoute();
     const { params } = route;
     const { menuData } = params || {};

     const [isFocus, setIsFocus] = useState(false);
     const [hasGalleryPermission, setHasGalleryPermission] = useState(null)

     const [menuName, setMenuName] = useState("");
     const [category, setCategory] = useState("");

     const [ingrList, setIngrList] = useState([]);
     const [ingredients, setIngredients] = useState(menuData.ingredients);
     const [ingrName, setIngrName] = useState("");
     const [ingrQty, setIngrQty] = useState(0);
     const [ingrUnit, setIngrUnit] = useState("");

     const [method, setMethod] = useState([]);
     const [methodText, setMethodText] = useState("");
     const [step, setStep] = useState(1);

     const [purine, setPurine] = useState(0);
     const [uric, setUric] = useState(0);
     const [image, setImage] = useState("");

     useEffect(() => {
          const fetchIngrData = async () => {
               try {
                    const response = await axios.get("http://192.168.56.1:5500/ingrs", { timeout: 10000 });
                    setIngrList(response.data);
               } catch (error) {
                    console.log("Error fetching ingrs data", error.message)
               }
          }
          fetchIngrData();
          calculate();
          if (menuData) {
               setMenuName(menuData.menuName);
               setCategory(menuData.category);
               // setIngredients(menuData.ingredients);
               // setIngrName(menuData.ingredients.ingrName);
               // setIngrQty(menuData.ingredients.ingrQty);
               setMethod(menuData.method);
               setPurine(menuData.purine.toString());
               setUric(menuData.uric.toString());
               setImage(menuData.image);
               setStep((prevStep) => prevStep + 2);
          }

     }, [menuData]);

     const handleEditMenu = async () => {
          try {
               const uploadedUrl = await uploadFile();

               const updatemenuData = {
                    menuName: menuName,
                    category: category,
                    ingredients: ingredients,
                    method: method,
                    purine: purine,
                    uric: uric,
                    image: uploadedUrl,
                    isDeleted: false
               };

               console.log('Updated Menu Data:', updatemenuData);

               const response = await axios.put(`http://192.168.56.1:5500/menu/edit/${menuData._id}`, updatemenuData);

               console.log('Menu updated', response.data);

               if (response.status === 200) {
                    router.replace('/allMenus'); // Navigate to the ingrList screen after successful update
               }
          } catch (error) {
               console.log('Error updating menu', error);
          }

     }

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

     const addIngr = () => {
          if (ingrName && ingrQty) {

               setIngredients(prevIngredients => [
                    ...prevIngredients,
                    { ingrName: ingrName, ingrQty: parseFloat(ingrQty) }
               ]);

               setIngrName("");
               setIngrQty("");
               calculate();
          }
     };

     const handleIngrQtyChange = (index, text) => {
          setIngredients((prevIngredients) => {
               const updatedIngredients = [...prevIngredients];
               updatedIngredients[index].ingrQty = text;
               return updatedIngredients;
          });
          calculate();
     };

     const removeIngr = (indexToRemove) => {
          const updatedIngredients = [...ingredients];
          updatedIngredients.splice(indexToRemove, 1);
          setIngredients(updatedIngredients);
          calculate();
     };

     const calculate = () => {
          console.log("ingredients for add:", ingredients)

          let totalPurine = 0;
          let totalUric = 0;

          ingrList.forEach(ingrList => {
               ingredients.forEach(ingr => {
                    if (ingrList.name === ingr.ingrName) {
                         totalPurine += (ingrList.purine * parseFloat(ingr.ingrQty)) / 100;
                         totalUric += (ingrList.uric * parseFloat(ingr.ingrQty)) / 100;
                    }
               })
          });

          setPurine(totalPurine.toFixed(2));
          setUric(totalUric.toFixed(2));
     };

     const addMethod = () => {
          if (methodText) {
               setMethod(prevMethod => [...prevMethod, methodText]);
               setMethodText("");
               setStep((prevStep) => prevStep + 1)
          }
     };

     const handleMethodTextChange = (index, text) => {
          setMethod((prevMethod) => {
               const updatedMethod = [...prevMethod];
               updatedMethod[index] = text;
               return updatedMethod;
          });
     };

     const removeMethod = (indexToRemove) => {
          const updatedMethod = [...method];
          updatedMethod.splice(indexToRemove, 1);

          // ปรับปรุง state ด้วยวัตถุดิบที่ถูกลบ
          setMethod(updatedMethod);
          setStep((prevStep) => prevStep - 1);
     };

     return (
          <ScrollView>
               <View style={styles.container}>
                    <View style={{ flexDirection: 'row' }}>
                         <Pressable onPress={() => router.push("/home")}>
                              <AntDesign name="arrowleft" size={24} color="black" />
                         </Pressable>
                         <View style={{ alignItems: 'right', flexDirection: 'row', justifyContent: 'flex-end', position: 'absolute', right: 0 }}>
                              <Text onPress={handleEditMenu} style={{ fontSize: 15, marginRight: 10 }}>บันทึก</Text>
                              <Text style={{ fontSize: 15 }}>ยกเลิก</Text>
                         </View>
                    </View>

                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                         <Pressable onPress={() => pickImage()} style={{ backgroundColor: "gray", borderRadius: 20, width: 200 }}>
                              <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 30, width: 200, height: 200 }}>

                                   {image ? (
                                        <Image source={{ uri: image }} style={{ width: 200, height: 200, borderRadius: 20 }} />
                                   ) : (<Entypo name="camera" size={50} color="white" />)}
                              </View>
                         </Pressable>
                    </View>


                    <Text style={{ marginTop: 15, }}>ชื่ออาหาร</Text>
                    <TextInput value={menuName} onChangeText={(text) => setMenuName(text)} style={[styles.dropdown]} placeholder='กรอกชื่ออาหาร'></TextInput>

                    <Text style={{ marginTop: 15, paddingLeft: 16 }}>หมวดหมู่</Text>
                    <Dropdown
                         style={[styles.dropdown, isFocus && { borderColor: 'black' }]}
                         placeholderStyle={styles.placeholderStyle}
                         selectedTextStyle={styles.selectedTextStyle}
                         inputSearchStyle={styles.inputSearchStyle}
                         iconStyle={styles.iconStyle}
                         data={data}
                         search
                         maxHeight={300}
                         labelField="label"
                         valueField="value"
                         placeholder='เลือกหมวดหมู่ของอาหาร'
                         searchPlaceholder="Search..."
                         value={category}
                         onFocus={() => setIsFocus(true)}
                         onBlur={() => setIsFocus(false)}
                         onChange={item => {
                              setCategory(item.value);
                              setIsFocus(false);
                         }} />
                    <View style={{ flexDirection: "row", marginTop: 15, paddingLeft: 16 }}>
                         <Text style={{ textAlign: 'left' }}>วัตถุดิบ</Text>
                         <Text style={{ marginLeft:210}} onPress={() => router.push('./addIngre')}>เพิ่มรายการวัตถุดิบ</Text>
                    </View>
                    {ingredients.map((ingredient, index) => (
                         <View key={index} style={{ flexDirection: "row", paddingLeft: 16, alignItems: "center", marginTop: 10 }}>
                              <Dropdown
                                   style={[styles.dropdown2, isFocus && { borderColor: 'black' }]}
                                   placeholderStyle={styles.placeholderStyle}
                                   selectedTextStyle={styles.selectedTextStyle}
                                   inputSearchStyle={styles.inputSearchStyle}
                                   iconStyle={styles.iconStyle}
                                   data={ingrList.map(ingredient => ({ label: ingredient.name, value: ingredient.name }))}
                                   search
                                   maxHeight={300}
                                   labelField="label"
                                   valueField="value"
                                   // placeholder='ชื่อวัตถุดิบ'
                                   searchPlaceholder="Search..."
                                   value={ingredient.ingrName}
                                   onFocus={() => setIsFocus(true)}
                                   onBlur={() => setIsFocus(false)}
                                   onChange={item => {
                                        setIngrName(item.value);
                                        setIsFocus(false);
                                   }}
                              />
                              <TextInput
                                   style={styles.ingrInput2}
                                   value={ingredient.ingrQty.toString()}
                                   onChangeText={(text) => {
                                        console.log('TextInput Value:', text);
                                        handleIngrQtyChange(index, text)
                                   }
                                   }
                                   placeholder="ปริมาณ"
                              />
                              <Dropdown
                                   style={[styles.ingrInput2, isFocus && { borderColor: 'black', padding: 16, }]}
                                   placeholderStyle={styles.placeholderStyle}
                                   selectedTextStyle={styles.selectedTextStyle}
                                   inputSearchStyle={styles.inputSearchStyle}
                                   iconStyle={styles.iconStyle}
                                   data={ing}
                                   search
                                   maxHeight={300}
                                   labelField="label"
                                   valueField="value"
                                   // placeholder='หน่วย'
                                   searchPlaceholder="Search..."
                                   value={ingredient.ingrUnit}
                                   onFocus={() => setIsFocus(true)}
                                   onBlur={() => setIsFocus(false)}
                                   onChange={item => {
                                        setIngrUnit(item.value);
                                        setIsFocus(false);
                                   }} />

                              <AntDesign
                                   style={{ flex: 1 }}
                                   name="minuscircle"
                                   size={24}
                                   color="black"
                                   onPress={() => removeIngr(index)}
                              />
                         </View>
                    ))}

                    <View style={{ flexDirection: "row", paddingLeft: 16, alignItems: "center", marginTop: 10 }}>
                         {/* <TextInput style={styles.ingrInput} value={ingrName} onChangeText={(text) => setIngrName(text)} placeholder='ชื่อวัตถุดิบ'></TextInput> */}
                         <Dropdown
                              style={[styles.dropdown2, isFocus && { borderColor: 'black' }]}
                              placeholderStyle={styles.placeholderStyle}
                              selectedTextStyle={styles.selectedTextStyle}
                              inputSearchStyle={styles.inputSearchStyle}
                              iconStyle={styles.iconStyle}
                              data={ingrList.map(ingredient => ({ label: ingredient.name, value: ingredient.name }))}
                              search
                              maxHeight={300}
                              labelField="label"
                              valueField="value"
                              placeholder='ชื่อวัตถุดิบ'
                              searchPlaceholder="Search..."
                              value={ingrName}
                              onFocus={() => setIsFocus(true)}
                              onBlur={() => setIsFocus(false)}
                              onChange={item => {
                                   setIngrName(item.value);
                                   setIsFocus(false);
                              }} />
                         <TextInput style={styles.ingrInput2} value={ingrQty} onChangeText={(text) => setIngrQty(text)} placeholder='ปริมาณ'></TextInput>
                         <Dropdown
                              style={[styles.ingrInput2, isFocus && { borderColor: 'black', padding: 16, }]}
                              placeholderStyle={styles.placeholderStyle}
                              selectedTextStyle={styles.selectedTextStyle}
                              inputSearchStyle={styles.inputSearchStyle}
                              iconStyle={styles.iconStyle}
                              data={ing}
                              search
                              maxHeight={300}
                              labelField="label"
                              valueField="value"
                              placeholder='หน่วย'
                              searchPlaceholder="Search..."
                              value={ing}
                              onFocus={() => setIsFocus(true)}
                              onBlur={() => setIsFocus(false)}
                              onChange={item => {
                                   setIngrUnit(item.value);
                                   setIsFocus(false);
                              }} />
                         <AntDesign
                              style={{ flex: 1 }}
                              name="pluscircle"
                              size={24}
                              color="black"
                              onPress={() => {
                                   addIngr();
                              }}
                         />

                    </View>

                    <Text style={{ marginTop: 15 }}>วิธีการทำอาหาร</Text>
                    {method.map((methodText, index) => (
                         <View key={index} style={{ flexDirection: "row", paddingLeft: 16, alignItems: "center", marginTop: 5 }}>
                              <Text style={{ flex: 0.5 }}>{index + 1}</Text>
                              <TextInput
                                   style={[styles.dropdown]}
                                   value={methodText}
                                   onChangeText={(text) => handleMethodTextChange(index, text)}
                              />
                              <AntDesign
                                   style={{ flex: 1 }}
                                   name="minuscircle"
                                   size={24}
                                   color="black"
                                   onPress={() => removeMethod(index)}
                              />
                         </View>
                    ))}

                    <View style={{ flexDirection: "row", paddingLeft: 16, alignItems: "center", marginTop: 5 }}>
                         <Text style={{ flex: 0.5 }}>{step}</Text>
                         <TextInput
                              style={[styles.dropdown]}
                              value={methodText}
                              onChangeText={(text) => setMethodText(text)}>
                         </TextInput>
                         <AntDesign
                              style={{ flex: 1 }}
                              name="pluscircle"
                              size={24}
                              color="black"
                              onPress={addMethod} />
                    </View>

                    <Text style={{ marginTop: 15 }}>ค่าสารอาหารรวม</Text>

                    <View style={{ alignContent: 'center', alignItems: 'center' }}>

                         <View style={{ marginTop: 15, flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                              <Text>พิวรีน</Text>
                              <TextInput style={[styles.input]} value={purine} placeholder='รอการคำนวณ...' />
                              <Text>มิลลิกรัม</Text>
                         </View>

                         <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                              <Text>กรดยูริก</Text>
                              <TextInput style={[styles.input]} value={uric} placeholder='รอการคำนวณ...' />
                              <Text>มิลลิกรัม</Text>
                         </View>
                    </View>


               </View>
          </ScrollView>
     );
};
export default editMenu

const styles = StyleSheet.create({
     container: {
          padding: 16,
          flex: 1,
          backgroundColor: 'white'
     },
     dropdown: {
          padding: 10,
          backgroundColor: '#F1F1F1',
          marginLeft: 15,
          marginRight: 15,
          borderRadius: 10,
          flex: 9
     },
     dropdown2: {
          marginRight: 5,
          padding: 10,
          backgroundColor: '#F1F1F1',
          borderRadius: 10,
          height: 50,
          flex: 4
     },
     input: {
          margin: 10,
          width: 150,
          padding: 10,
          backgroundColor: '#F1F1F1',
          borderRadius: 10,
     },
     ingrInput: {
          padding: 10,
          marginRight: 5,
          width: 95,
          height: 50,
          borderRadius: 10,
          marginTop: 2,
          padding: 10,
          backgroundColor: '#F1F1F1',
     },
     ingrInput2: {
          marginRight: 5,
          width: 95,
          height: 50,
          borderRadius: 10,
          marginTop: 2,
          padding: 10,
          backgroundColor: '#F1F1F1',
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
})