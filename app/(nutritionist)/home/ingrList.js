import { StyleSheet, Text, View, Pressable, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import ShowIngredient from '../../../components/ShowIngredient';


const ingrList = () => {
     const router = useRouter();
     const [ingrs, setIngrs] = useState([]);
     const [input, setInput] = useState("");
     useEffect(() => {
          const fetchIngrData = async () => {
               try {
                    const response = await axios.get("http://192.168.56.1:5500/ingrs", { timeout: 10000 });
                    setIngrs(response.data);
               } catch (error) {
                    console.log("Error fetching ingrs data", error.message)
               }
          }
          fetchIngrData();
     }, [])
     console.log(ingrs)
     return (
          <View>
               <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "white" }}>
                    <AntDesign onPress={() => router.push("/home")} name="arrowleft" size={24} color="black" />
                    <Pressable style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 7, backgroundColor: "white", height: 40, borderRadius: 4, flex: 1 }}>
                         <TextInput value={input} onChangeText={(text) => setInput(text)} style={{ flex: 1 }} placeholder='Search' />
                         <AntDesign name="search1" size={24} color="black" />

                         {ingrs.length > 0 && (
                              <View>
                                   <Pressable onPress={() => router.push("/(nutritionist)/home/addIngre")}>
                                        <AntDesign name="pluscircle" size={24} color="black" />
                                   </Pressable>
                              </View>
                         )}
                    </Pressable>
               </View>

               {ingrs.length > 0 ? (
                    <View>
                         <ShowIngredient data={ingrs} input={input} setInput={setInput} />
                    </View>

               ) : (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                         <Text>ไม่มีข้อมูลวัตถุดิบ</Text>
                         <Text>กดสัญลักษณ์รูปบวกเพื่อเพิ่มข้อมูล</Text>
                    </View>
               )}
          </View>
     )
}

export default ingrList

const styles = StyleSheet.create({})