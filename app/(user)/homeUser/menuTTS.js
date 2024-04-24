// import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, Alert, Button } from 'react-native'
// import React, { useState, useEffect } from 'react'
// import * as speech from 'expo-speech'
// import { TouchableHighlight } from 'react-native-gesture-handler'
// import { StatusBar } from 'expo-status-bar'
// import { useRouter, useNavigation } from 'expo-router';
// import { useRoute } from '@react-navigation/native'
// import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons';

// const menuTTS = () => {

//      const navigation = useNavigation();
//      const router = useRouter();
//      const route = useRoute();
//      const { params } = route;
//      const { menuData } = params || {};
//      const [method, setMethod] = useState([]);
//      const [methodText, setMethodText] = useState(0);
   
//      useEffect(() => {
//           if (menuData) {
//             setMethod(menuData.method);
//           }
//           listAllVoiceOptions();
//         }, [menuData]);
      
//         const listAllVoiceOptions = async () => {
//           let voices = await speech.getAvailableVoicesAsync();
//           console.log(voices)
//         }

//         const speak = () => {
//           const tts = method[methodText] || '';
//           Option = {
//             language: 'th',
//           }
//           speech.speak(tts, Option)
//         };
      
//         const showNextStep = () => {
//           if (methodText < method.length - 1) {
//             setMethodText(methodText + 1);
//           } else {
//             // Handle the case when there are no more steps
//             console.log('No more steps');
//           }
//         };
      
//         const showPrevStep = () => {
//           if (methodText > 0) {
//             setMethodText(methodText - 1);
//           } else {
//             // Handle the case when there are no previous steps
//             console.log('No previous steps');
//           }
//         };

//   return (
//      <View>
//       <View style={{ flexDirection: "row" }}>
//         <View style={{ marginTop: 15 }}>
//           <Pressable onPress={() => navigation.goBack()}>
//             <AntDesign name="arrowleft" size={24} color="black" />
//           </Pressable>
//         </View>


//         <View style={{position:'relative', fontSize: 20, alignItems: 'center', alignContent: 'center', fontWeight: 'bold', width: '87%', marginTop: 15 }}>
//           <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{menuData.menuName}</Text>

//         </View>

//       </View>

//       <View style={{ justifyContent: "center", alignItems: "center" }}>
//         <View style={{ borderColor: 'black', borderWidth: 1, width: 330, height: 280, marginTop: 20, borderRadius: 20 }}>

//           <Text style={{ textAlign: 'center', fontSize: 23, marginTop: 10, flexDirection: 'row', padding: 30 }}>
//             {method[methodText]}
//           </Text>

//         </View>
//         <AntDesign name="sound" onPress={speak} size={55} color="black" style={{ marginTop: 110 }} />

//         <View>
//           {methodText > 0 && methodText < method.length - 1 && (
//             <View style={{ flexDirection: 'row', width: 200, justifyContent: 'center', alignItems: "center" }}>
//               <Pressable style={styles.button} onPress={showPrevStep}>
//                 <Text style={{ color: 'white' }}>ขั้นตอนก่อนหน้า</Text>
//               </Pressable>
//               <Pressable style={styles.button} onPress={showNextStep}>
//                 <Text style={{ color: 'white' }}>ขั้้นตอนถัดไป</Text>
//               </Pressable>
//             </View>
//           )}
//           {methodText == 0 && (
//             <Pressable style={styles.button} onPress={showNextStep}>
//               <Text style={{ color: 'white' }}>ขั้้นตอนถัดไป</Text>
//             </Pressable>
//           )}
//           {methodText == method.length - 1 && (
//             <View>
//               <Pressable style={styles.button} onPress={showPrevStep}>
//                 <Text style={{ color: 'white' }}>ขั้นตอนก่อนหน้า</Text>
//               </Pressable>
//             </View>
//           )}

//         </View>

//       </View>
//     </View>
//   )
// }

// export default menuTTS

// const styles = StyleSheet.create({
//      button: {
//           justifyContent: 'center',
//           alignItems: "center",
//           marginTop: 80,
//           backgroundColor: '#ffa13f',
//           textAlign: 'center',
//           width: 150,
//           padding: 10,
//           borderRadius: 50,
//         }
// })