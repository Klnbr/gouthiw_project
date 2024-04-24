import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Image, Alert, Modal, Button } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native'
import * as FileSystem from 'expo-file-system';
import { firebase } from '../../../firebase';

const EditTrivia = () => {
     const router = useRouter();
     const route = useRoute();
     const { params } = route;
     const { triviaData } = params || {};
     console.log("Received triviaData in EditTrivia:", triviaData);
     const [head, setHead] = useState("");
     const [image, setImage] = useState("");
     const [content, setContent] = useState("");

     const [modalVisible, setModalVisible] = useState(false);
     const [modalDelete, setModalDelete] = useState(false);

     useEffect(() => {
          if (triviaData) {
               console.log("triviaData: ", triviaData)
               setHead(triviaData.head);
               setImage(triviaData.image);
               setContent(triviaData.content);
          }
     }, [triviaData]);

     const pickImage = async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
               mediaTypes: ImagePicker.MediaTypeOptions.Images,
               allowsEditing: true,
               aspect: [4, 4],
               quality: 1,
          });

          if (!result.canceled) {
               setImage(result.uri);
          }
     };

     const handleDeleteTrivia = async () => {
          try {
               const response = await axios.delete(`http://192.168.56.1:5500/trivia/delete/${triviaData._id}`);

               if (response.status === 200) {
                    router.replace('/allTrivia');
                    console.log('Trivia deleted successfully');
                    // You can perform additional actions here if needed
               }

          } catch (error) {
               console.log('Error deleting Trivia', error);
               // Handle error, show a message, or perform other actions as needed
          }
     };

     const handleEditTrivia = async () => {
          try {
               const uploadedUrl = await uploadFile();

               const updatedTrivData = {
                    head: head,
                    image: uploadedUrl,
                    content: content
               };

               console.log('Updated Trivia Data:', updatedTrivData);

               const response = await axios.put(`http://192.168.56.1:5500/trivia/edit/${triviaData._id}`, updatedTrivData);

               console.log('Trivia updated', response.data);

               if (response.status === 200) {
                    router.replace('/allTrivia'); // Navigate to the Home screen after successful update
               }
          } catch (error) {
               console.log('Error updating trivia', error);
          }
     };

     const uploadFile = async () => {
          try {
               const { uri } = await FileSystem.getInfoAsync(image);

               if (!uri) {
                    throw new Error('Invalid file URI');
               }

               const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => resolve(xhr.response);
                    xhr.onerror = (e) => reject(new TypeError('Network request failed'));
                    xhr.responseType = 'blob';
                    xhr.open('GET', uri, true);
                    xhr.send(null);
               });

               const filename = image.substring(image.lastIndexOf('/') + 1);

               const ref = firebase.storage().ref().child(filename);
               await ref.put(blob);

               const downloadURL = await ref.getDownloadURL();
               console.log('Download URL:', downloadURL);

               return downloadURL;
          } catch (error) {
               console.log('Error:', error);
          }
     };


     return (
          <View style={styles.container}>
               <View style={{ flexDirection: 'row' }}>
                    <Pressable onPress={() => router.push("/allTrivia")}>
                         <AntDesign name="arrowleft" size={24} color="black" />
                    </Pressable>
                    <View style={{ alignItems: 'right', flexDirection: 'row', justifyContent: 'flex-end', position: 'absolute', right: 0 }}>
                         <Text onPress={() => setModalDelete(true)} style={{ fontSize: 15, marginRight: 10 }}>ลบ</Text>

                         <Text onPress={handleEditTrivia} style={{ fontSize: 15, marginRight: 10 }}>บันทึก</Text>

                         <Text onPress={() => router.canGoBack()} style={{ fontSize: 15 }}>ยกเลิก</Text>

                    </View>
               </View>

               <Text style={{ marginTop: 30, fontWeight: 'bold', fontSize: 20 }}>หัวข้อ</Text>
               <Pressable>
                    <TextInput
                         value={head}
                         onChangeText={(text) => setHead(text)}
                         style={{
                              padding: 10,
                              padding: 10,
                              backgroundColor: '#F1F1F1',
                              borderRadius: 10,
                              height: 50,
                              marginTop: 10
                         }}
                    />
               </Pressable>

               <Text style={{ marginTop: 30, fontWeight: 'bold', fontSize: 20 }}>เนื้อหาของความรู้</Text>
               <Pressable>
                    <TextInput
                         value={content}
                         onChangeText={(text) => setContent(text)}
                         multiline={true}
                         numberOfLines={6}
                         style={{
                              padding: 10,
                              borderColor: '#d0d0d0',
                              borderWidth: 1,
                              borderRadius: 5,
                              marginTop: 10
                         }}
                    />
               </Pressable>
               <Text style={{ marginTop: 30, fontWeight: 'bold', fontSize: 20 }}>ภาพประกอบ(ถ้ามี)</Text>
               <View style={{ alignItems: "center", justifyContent: "center" }}>


                    <Pressable onPress={pickImage}>
                         <View style={{ width: 200, height: 200, marginTop: 20 }}>

                              {image ? (
                                   <Image source={{ uri: image }} style={{ width: 200, height: 200, borderRadius: 20 }} />
                              ) : (<Entypo name="camera" size={50} color="white" />)}
                         </View>
                    </Pressable>
               </View>

               <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalDelete}
                    onRequestClose={() => {
                         setModalDelete(false);
                    }}
               >
                    <View style={styles.centeredView}>
                         <View style={styles.modalView}>
                              <Text>ต้องการลบใช่หรือไม่</Text>
                              <View style={{ flexDirection: 'row', }}>
                                   <Button style={{ marginRight: 20 }} title="OK" onPress={handleDeleteTrivia} />
                                   <Button title="Cancel" onPress={() => setModalDelete(false)} />
                              </View>

                         </View>
                    </View>
               </Modal>


          </View>

     );
};

export default EditTrivia;

const styles = StyleSheet.create({
     container: {
          backgroundColor: 'white',
          padding: 18,
          flex: 1,
     }, centeredView: {
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
     }, input: {
          height: 40,
          width: '100%',
          margin: 12,
          borderWidth: 1,
          padding: 10,
          borderRadius: 10
     },
});
