import { StyleSheet, Text, View, Pressable, Animated, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'expo-router';
import UserLastedMenu from '../../../components/UserLastedMenu'
import { MaterialCommunityIcons, Fontisto, FontAwesome5, AntDesign } from '@expo/vector-icons';

import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import Svg, { G, Circle } from 'react-native-svg'
import Donut from './Donut'



const index = () => {
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const [menus, setMenus] = useState([]);

  const fetchMenuData = async () => {
    try {
      const response = await axios.get("http://192.168.56.1:5500/menus", { timeout: 10000 });
      setMenus(response.data);
    } catch (error) {
      console.log("Error fetching menus data", error.message)
    }
  }
  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://192.168.56.1:5500/users", { timeout: 10000 });
      setUser(response.data);
    } catch (error) {
      console.log("Error fetching breakfast data", error.message)
    }
  }

  useEffect(() => {


    setTimeout(() => {
      setIsLoading(false);
    }, 100);
    fetchMenuData();
    fetchUserData();
  }, [])

  const [selectedTab, setselectedTab] = useState(0)

  // animation
  const halfCircle = 150 + 35;
  const Circlecumference = 2 * Math.PI * 150;

  const AnimatedCircle = Animated.createAnimatedComponent(Circle)
  const AnimatedValue = React.useRef(new Animated.Value(0)).current;
  const animation = (toValue) => {
    return Animated.timing(AnimatedValue, {
      toValue,
      duration,
      delay,
      useNativeDriver: true
    })
  }
  const CircleRef = React.useRef();

  const handleRefresh = () => {
    setRefreshing(true)
    fetchUserData()
    fetchMenuData()
    setRefreshing(false)
  }

  return (
    <ScrollView style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
    >
      {
        isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="larger" color="#4AB4A2" />
          </View>
        ) : (
          <View style={{ alignContent: 'center', alignSelf: 'center', alignItems: 'center' }}>

            <View style={{ backgroundColor: "#FFA13F", height: 100, width: 450, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}>
              <Text style={{ textAlign: "center", fontSize: 20, color: 'white', fontWeight: 'bold', marginTop: 25 }}>GOUTHIW</Text>
            </View>

            {/* บล็อคขาว */}
            <View style={[styles.shadowProp]}>
              <View style={{ flexDirection: "row", width: 120, height: 34, borderWidth: 2, borderRadius: 20, borderColor: '#4AB4A2' }}>
                <View style={{ flexDirection: "row", padding: 2 }}>
                  <TouchableOpacity style={{ width: 57, height: 27, backgroundColor: selectedTab == 0 ? '#4AB4A2' : 'white', borderRadius: 15 }}
                    onPress={() => {
                      setselectedTab(0)
                    }}>
                    <Text style={{ color: selectedTab == 0 ? 'white' : '#4AB4A2', marginTop: 3, textAlign: 'center' }}>พิวรีน</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{
                    width: 55, height: 27, backgroundColor: selectedTab == 0 ? 'white' : '#4AB4A2', borderRadius: 15
                  }} onPress={() => {
                    setselectedTab(1)
                  }}>
                    <Text style={{ color: selectedTab == 0 ? '#4AB4A2' : 'white', marginTop: 3, textAlign: 'center' }}>กรดยูริก</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {selectedTab == 0 ? (
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap', alignItems: 'center' }}>
                    {user.map((user, index) => {
                      return <Donut key={index} percentage={user.purine} decimalPlaces={2} color='#4AB4A2' delay={500 + 500 * index} max={400} />
                    })}
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <View style={{ flexDirection: "column" }}>
                      <Text>จำกัด</Text>
                      <Text>400 มิลลิกรัม</Text>
                    </View>
                    <View style={{ flexDirection: "column", marginLeft: 100 }}>
                      <Text>รับได้อีก</Text>
                      {user.map((user, index) => (
                        <Text key={index}>{400 - user.purine} มิลลิกรัม</Text>
                      ))}
                    </View>
                  </View>
                </View>
              ) : (
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap', alignItems: 'center' }}>
                    {user.map((user, index) => {
                      return <Donut key={index} percentage={user.uric} color='#4AB4A2' delay={500 + 500 * index} max={800} />
                    })}
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <View style={{ flexDirection: "column" }}>
                      <Text>จำกัด</Text>
                      <Text>800 มิลลิกรัม</Text>
                    </View>
                    <View style={{ flexDirection: "column", marginLeft: 100 }}>
                      <Text>รับได้อีก</Text>
                      {user.map((user, index) => (
                        <Text key={index}>{800 - user.uric} มิลลิกรัม</Text>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* เมนูทั้ง 4 */}
            <View style={{ flexDirection: "row" }}>
              <Pressable onPress={() => router.push("./homeUser/calpurine")}>
                <View style={styles.button}>
                  <MaterialCommunityIcons name="food-fork-drink" size={24} color="white" />

                </View>
                <Text style={{ width: 80, color: "black", fontSize: 13, fontWeight: "600", textAlign: 'center', marginTop: 10 }}>คำนวณพิวรีนจากวัตถุดิบ</Text>
              </Pressable>

              <Pressable onPress={() => router.push("./homeUser/pills")}>
                <View style={styles.button}>
                  <Fontisto name="pills" size={24} color="white" />
                </View>
                <Text style={{ width: 70, color: "black", fontSize: 13, fontWeight: "600", textAlign: 'center', marginTop: 10 }}>บันทึกรายการยา</Text>
              </Pressable>

              <Pressable onPress={() => router.push("./homeUser/topic")}>
                <View style={styles.button}>
                  <FontAwesome5 name="question" size={24} color="white" />
                </View>
                <Text style={{ width: 70, color: "black", fontSize: 13, fontWeight: "600", textAlign: 'center', marginTop: 10 }}>ตั้งกระทู้คำถาม</Text>
              </Pressable>

              <Pressable onPress={() => router.push("./homeUser/trivia")}>
                <View style={styles.button}>
                  <MaterialCommunityIcons name="lightbulb-on" size={25} color="white" />
                </View>
                <Text style={{ width: 70, color: "black", fontSize: 13, fontWeight: "600", textAlign: 'center', marginTop: 10 }}>เกร็ดความรู้</Text>
              </Pressable>
            </View>

            <View>
              <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>รายการอาหารใหม่ล่าสุด</Text>
                <Text style={{ fontSize: 16, color: '#FFA13F', marginLeft: 79 }}>ดูทั้งหมด</Text>
              </View>

              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flexDirection: "row" }}>
                {menus.length > 0 ? (
                  <View>
                    <UserLastedMenu data={menus} style={{ marginLeft: 20 }} />
                    {/* <View>
              <AntDesign name="rightcircleo" size={24} color="black" />
            </View> */}
                  </View>

                ) : (
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>ไม่มีข้อมูลเมนู</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        )
      }
    </ScrollView>
  )
}

export default index

const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: '#171717',
    elevation: 10,
    width: 340,
    backgroundColor: 'white',
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 50,
    marginTop: -35,
    padding: 20,
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center'
  },
  button: {
    width: 60,
    backgroundColor: "#FFA13F",
    marginTop: 20,
    marginBottom: -5,
    padding: 17,
    margin: 10,
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }

})