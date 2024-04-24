import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Pressable, Alert, } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Entypo, AntDesign } from '@expo/vector-icons';
import * as  ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
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


const index = () => {
     const router = useRouter();
     const [isFocus, setIsFocus] = useState(false);
     const [hasGalleryPermission, setHasGalleryPermission] = useState(null)

     const [menuName, setMenuName] = useState("");
     const [category, setCategory] = useState("");

     const [ingrList, setIngrList] = useState([]);
     const [ingredients, setIngredients] = useState([]);
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
          (async () => {
               const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
               setHasGalleryPermission(galleryStatus.status === 'granted')
          })();
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
     }, [ingredients]);
     console.log(ingredients)

     const pickImage = async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
               mediaTypes: ImagePicker.MediaTypeOptions.Images,
               allowsEditing: true,
               aspect: [4, 3],
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

     const handleAddMenu = async () => {
          try {
               const uploadedUrl = await uploadFile();
               console.log("Uploaded URL:", uploadedUrl);

               const menuData = {
                    menuName: menuName,
                    category: category,
                    ingredients: ingredients,
                    method: method,
                    purine: purine,
                    uric: uric,
                    image: uploadedUrl,
                    isDeleted: false
               };

               console.log("Menu Data:", menuData);

               const response = await axios.post(
                    "http://192.168.56.1:5500/addMenu", menuData
               );

               console.log("Menu created", response.data);
               if (response.status === 201) {
                    Alert.alert("เพิ่มเข้าสำเร็จ");
                    router.replace("/home");
               }
          } catch (error) {
               Alert.alert("เพิ่มเข้าไม่สำเร็จ", error.response.data.message || "Unknown error");
               console.log("error creating menu", error);
          }
     };

     const addIngr = () => {
          if (ingrName && ingrUnit) { // ตรวจสอบว่ามีชื่อวัตถุดิบและปริมาณ
              if (ingrQty) { // ตรวจสอบว่ามีหน่วยหรือไม่
                  setIngredients(prevIngredients => [
                      ...prevIngredients,
                      { ingrName, ingrQty, ingrUnit }
                  ]);
              } else {
                  const ingrQty = 0
                  setIngredients(prevIngredients => [
                      ...prevIngredients,
                      { ingrName, ingrQty, ingrUnit }
                  ]);
              }
      
              setIngrName("");
              setIngrQty("");
              setIngrUnit("");
              calculate();
          } else {
               Alert.alert("กรุณากรอกให้ครบ")
          }
      };

     const calculate = () => {
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

     const handleRefresh = () =>{
          setRefreshing(true)
          fetchListData()
          fetchUserData()
          fetchMenuData()
          setRefreshing(false)
        }

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
                              <Text onPress={handleAddMenu} style={{ fontSize: 15, marginRight: 10 }}>บันทึก</Text>
                              <Text style={{ fontSize: 15 }}>ยกเลิก</Text>
                         </View>
                    </View>

                    <View style={{ width: 412, padding: 0 }}>
                         <Pressable onPress={() => pickImage()} style={{ padding: -16, backgroundColor: "lightgray", height: 200, marginTop: 15 }}>
                              <View style={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
                                   {image ? (
                                        <Image style={{ width: 400, height: 200 }} source={{ uri: image }} />
                                   ) : (
                                        <Entypo name="camera" size={50} color="white" />
                                   )}
                              </View>
                         </Pressable>
                    </View>


                    {/* {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />} */}

                    <Text style={{ marginTop: 15, paddingLeft: 16, paddingBottom: 16 }}>ชื่ออาหาร</Text>
                    <TextInput value={menuName} onChangeText={(text) => setMenuName(text)} style={[styles.dropdown]} placeholder='กรอกชื่ออาหาร'></TextInput>

                    <Text style={{ marginTop: 15, paddingLeft: 16, paddingBottom: 16 }}>หมวดหมู่</Text>
                    <Dropdown
                         style={[styles.dropdown, isFocus && { borderColor: 'black', padding: 16, }]}
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
                                   style={[styles.dropdown2, isFocus && { borderColor: 'black', padding: 16 }]}
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
                                   // value={value}
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
                                   value={ingredient.ingrQty}
                                   onChangeText={(text) => handleIngrQtyChange(index, text)}
                                   placeholder="ปริมาณ(ถ้ามี)"
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
                         <TextInput style={styles.ingrInput2} value={ingrQty} onChangeText={(text) => setIngrQty(text)} placeholder='ปริมาณ(ถ้ามี)'></TextInput>

                         <Dropdown
                              style={[styles.ingrInput2, isFocus && { borderColor: 'black' }]}
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
                              style={{ marginLeft: 3, flex: 1 }}
                              name="pluscircle"
                              size={24}
                              color="black"
                              onPress={addIngr}
                         />

                    </View>
                    <Text style={styles.ingrInput2 && { paddingLeft: 16, paddingBottom: 6, marginTop: 10 }}>วิธีการทำอาหาร</Text>
                    {method.map((methodText, index) => (
                         <View key={index} style={{ flexDirection: "row", paddingLeft: 16, alignItems: "center", marginTop: 5 }}>
                              <Text style={{ flex: 0.5 }}>{index + 1}</Text>
                              <TextInput
                                   style={styles.dropdown}
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
                    {/* <TextInput style={styles.ingrInput} value={ingrName} onChangeText={(text) => setIngrName(text)} placeholder='ชื่อวัตถุดิบ'></TextInput> */}

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

                    <Text style={{ marginTop: 10, padding: 16, marginBottom: -20 }}>ค่าสารอาหารรวม</Text>

                    <View style={{ alignContent: 'center', alignItems: 'center', padding: 16 }}>

                         <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                              <Text>พิวรีน</Text>
                              <TextInput style={[styles.input]} defaultValue={purine.toString()} placeholder='รอการคำนวณ...' />
                              <Text>มิลลิกรัม</Text>
                         </View>

                         <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                              <Text>กรดยูริก</Text>
                              <TextInput style={[styles.input]} defaultValue={uric.toString()} placeholder='รอการคำนวณ...' />
                              <Text>มิลลิกรัม</Text>
                         </View>
                    </View>


               </View>
          </ScrollView>
     );
};

export default index;

const styles = StyleSheet.create({
     container: {
          backgroundColor: 'white',
          flex: 1
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
});
