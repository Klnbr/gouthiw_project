import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Entypo, AntDesign } from '@expo/vector-icons';
import axios from 'axios';

const addIngre = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [purine, setPurine] = useState("");
  const [uric, setUric] = useState("");

  const handleAddIngre = () => {
    const ingreData = {
      name: name,
      purine: purine,
      uric: uric,
      isDeleted: false
    };

    axios.post("http://192.168.56.1:5500/addIngr", ingreData)
    .then((response) => {
      Alert.alert("เพิ่มเข้าสำเร็จ");
      setName("");
      setPurine("");
      setUric("");
    }).catch((error) => {
      Alert.alert("เพิ่มเข้าไม่สำเร็จ", error.response.data.message || "Unknown error");
      console.log(error);
    });
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white", padding:10 }}>
      <Pressable onPress={() => router.push("/home/ingrList")}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </Pressable>
      <View style={{ padding: 10 }}>
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            ชื่อวัตถุดิบ
          </Text>
          <TextInput value={name} onChangeText={(text) => setName(text)} style={{ padding: 10, marginTop: 10, backgroundColor: '#F1F1F1',borderRadius:10, height:50}} placeholder='กรอกชื่อวัตถุดิบ' placeholderTextColor={"black"} />
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            ค่าพิวรีนสุทธิ
          </Text>
          <TextInput value={purine} onChangeText={(text) => setPurine(text)} style={{ padding: 10, marginTop: 10,backgroundColor: '#F1F1F1',borderRadius:10, height:50 }} placeholder='รอการคำนวณพิวรีน...' placeholderTextColor={"black"} />
        </View>

        <View>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            ค่ากรดยูริกสุทธิ
          </Text>
          <TextInput value={uric} onChangeText={(text) => setUric(text)} style={{ padding: 10, marginTop: 10,padding: 10, backgroundColor: '#F1F1F1',borderRadius:10, height:50 }} placeholder='รอการคำนวณกรดยูริก...' placeholderTextColor={"black"} />
        </View>

        <Pressable onPress={handleAddIngre} style={{ backgroundColor: "#4AB4A2", padding: 10, marginTop: 20, justifyContent: "center", alignItems: "center", borderRadius: 5 }}>
          <Text style={{ fontWeight: "bold", color: "white" }}>เพิ่มวัตถุดิบ</Text>
        </Pressable>

        <Pressable onPress={() => router.replace("/home/ingrList")} style={{ backgroundColor: "#D51C1C", padding: 10, marginTop: 20, justifyContent: "center", alignItems: "center", borderRadius: 5 }}>
          <Text style={{ fontWeight: "bold", color: "white" }}>ลบวัตถุดิบ</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default addIngre

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    flex: 1
  },
  dropdown: {
    padding: 10, borderBottomWidth: 1, marginTop: 10, borderBottomColor: 'black'
  },
  input: {
    margin: 10, width: 150, padding: 10, borderBottomWidth: 1, marginTop: 10, borderBottomColor: 'black'
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