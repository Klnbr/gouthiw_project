import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import ShowTrivia from '../../../components/ShowTrivia';

const index = () => {
  const router = useRouter();
  const [trivs, setTrivia] = useState([]);
  const [input, setInput] = useState("");
  useEffect(() => {
    const fetchTriviaData = async () => {
      try {
        const response = await axios.get("http://192.168.56.1:5500/trivias", { timeout: 10000 });
        setTrivia(response.data);
      } catch (error) {
        console.log("Error fetching trivs data", error.message)
      }
    }
    fetchTriviaData();
  }, [])
  console.log(trivs)
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "white" }}>
        {/* <AntDesign onPress={() => router.push("/home")} name="arrowleft" size={24} color="black" /> */}
        <Pressable style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 7, backgroundColor: "white", height: 40, borderRadius: 4, flex: 1 }}>
          <TextInput value={input} onChangeText={(text) => setInput(text)} style={{ flex: 1 }} placeholder='Search' />
          <AntDesign name="search1" size={24} color="black" />

          {trivs.length > 0 && (
            <View>
              <Pressable>
                <AntDesign name="pluscircle" size={24} color="black" />
              </Pressable>
            </View>
          )}
        </Pressable>
      </View>

      {trivs.length > 0 ? (
        <Pressable>
          <View >

            <ShowTrivia data={trivs} input={input} setInput={setInput} />

          </View>
        </Pressable>

      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>ไม่มีข้อมูลวัตถุดิบ</Text>
          <Text>กดสัญลักษณ์รูปบวกเพื่อเพิ่มข้อมูล</Text>
        </View>
      )}
    </View>
  )
}

export default index

const styles = StyleSheet.create({})