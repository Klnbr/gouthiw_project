import { StyleSheet, Text, View, TextInput, Pressable, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as  ImagePicker from 'expo-image-picker';
import { useRouter, useNavigation } from 'expo-router';
import axios from 'axios';
import * as FileSystem from "expo-file-system";
import { firebase } from '../../../firebase';

const addTrivia = () => {
  const router = useRouter();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null)

  const [head, setHead] = useState("")
  const [image, setImage] = useState("")
  const [content, setContent] = useState("")


  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasGalleryPermission(galleryStatus.status === 'granted')
    })();
  }, []);

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

  const handleAddTriv = async () => {
    try {
      const uploadedUrl = await uploadFile();
      console.log("Uploaded URL:", uploadedUrl);

      const trivData = {
        head: head,
        image: uploadedUrl,
        content: content,
        isDeleted: false
      };

      console.log("Triv Data:", trivData);

      const response = await axios.post(
        "http://192.168.56.1:5500/addTrivia", trivData
      );

      console.log("trivia created", response.data);
      if (response.status === 201) {
        Alert.alert("เพิ่มเข้าสำเร็จ");
        router.replace("/home");
      }
    } catch (error) {
      Alert.alert("เพิ่มเข้าไม่สำเร็จ", error.response.data.message || "Unknown error");
      console.log("error creating trivia", error);
    }
  };

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

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <Pressable onPress={() => router.push("/home")}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <View style={{ alignItems: 'right', flexDirection: 'row', justifyContent: 'flex-end', position: 'absolute', right: 0 }}>
          <Text onPress={handleAddTriv} style={{ fontSize: 15, marginRight: 10 }}>บันทึก</Text>

          <Text style={{ fontSize: 15 }}>ยกเลิก</Text>

        </View>
      </View>

      <Text style={{ marginTop: 30, fontWeight: 'bold', fontSize: 20 }}>หัวข้อ</Text>
      <TextInput value={head} onChangeText={(text) => setHead(text)} style={{ padding: 10, padding: 10,
          backgroundColor: '#F1F1F1',
          borderRadius:10,
          height:50, marginTop: 10 }} placeholder='ชื่อหัวข้อ'></TextInput>

      <Text style={{ marginTop: 30, fontWeight: 'bold', fontSize: 20 }}>เนื้อหาของความรู้</Text>
      <TextInput value={content} onChangeText={(text) => setContent(text)} multiline={true}
        numberOfLines={6} style={{ padding: 10, borderColor: '#d0d0d0', borderWidth: 1, borderRadius: 5, marginTop: 10 }} placeholder='เนื้อหา'></TextInput>

      <Text style={{ marginTop: 30, fontWeight: 'bold', fontSize: 20 }}>ภาพประกอบ(ถ้ามี)</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Pressable onPress={pickImage} style={{ backgroundColor: "gray", borderRadius: 20, width: 200, marginTop: 30 }}>
          <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 30, width: 200, height: 200 }}>

            {image ? (
              <Image source={{ uri: image }} style={{ width: 200, height: 200, borderRadius: 20 }} />
            ) : (<Entypo name="camera" size={50} color="white" />)}
          </View>
        </Pressable>

      </View>
    </View>
  )
}

export default addTrivia

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 18,
    flex: 1
  }
})
