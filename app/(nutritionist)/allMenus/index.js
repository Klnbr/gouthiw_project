import { StyleSheet, Text, View, ScrollView, TextInput, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import ShowMenu from '../../../components/ShowMenu'

const index = () => {
     const router = useRouter();
     const [menus, setMenus] = useState([]);
     const [input, setInput] = useState("");
     useEffect(() => {
          const fetchMenuData = async () => {
               try {
                    const response = await axios.get("http://192.168.56.1:5500/menus", { timeout: 10000 });
                    setMenus(response.data);
               } catch (error) {
                    console.log("Error fetching menus data", error.message)
               }
          }
          fetchMenuData();
     }, [])
     return (
          <View>
               <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "white" }}>
                    {/* <AntDesign onPress={() => router.push("/allMenus")} name="arrowleft" size={24} color="black" /> */}
                    <Pressable style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 7, backgroundColor: "white", height: 40, borderRadius: 4, flex: 1 }}>
                         <TextInput value={input} onChangeText={(text) => setInput(text)} style={{ flex: 1 }} placeholder='Search' />
                         <AntDesign name="search1" size={24} color="black" />

                         {menus.length > 0 && (
                              <View>
                                   <Pressable>
                                        <AntDesign name="pluscircle" size={24} color="black" />
                                   </Pressable>
                              </View>
                         )}
                    </Pressable>
               </View>

               {menus.length > 0 ? (
                    <View>
                         <ShowMenu data={menus} />
                    </View>

               ) : (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                         <Text>ไม่มีข้อมูลเมนู</Text>
                         <Text>กดสัญลักษณ์รูปบวกเพื่อเพิ่มข้อมูล</Text>
                    </View>
               )}
          </View>
     )
}

export default index

const styles = StyleSheet.create({})