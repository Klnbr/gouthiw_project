import { StyleSheet, Text, View, Pressable, Animated, ScrollView, LogBox, ActivityIndicator,RefreshControl  } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { AntDesign, MaterialCommunityIcons, Fontisto, FontAwesome5, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import UserBreakfast from '../../../components/UserBreakfast'
import UserLunch from '../../../components/UserLunch'
import UserDinner from '../../../components/UserDinner'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Svg, { G, Circle } from 'react-native-svg'
import Donut from './Donut'

import CreateMenu from '../homeUser/createMenu'


const index = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [user, setUser] = useState([]);
  const [menu, setMenus] = useState([]);

  const [menuBreakfast, setMenuBreakfast] = useState([]);
  const [menuLunch, setMenuLunch] = useState([]);
  const [menuDinner, setMenuDinner] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedTab, setselectedTab] = useState(0)
  // animation
  const halfCircle = 150 + 35;
  const Circlecumference = 2 * Math.PI * 150;

  const AnimatedCircle = Animated.createAnimatedComponent(Circle)
  const AnimatedValue = React.useRef(new Animated.Value(0)).current;
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const animation = (toValue) => {
    return Animated.timing(AnimatedValue, {
      toValue,
      duration,
      delay,
      useNativeDriver: true
    })
  }
  const CircleRef = React.useRef();

  const fetchListData = async () => {
    try {
      const responseBreakfast = await axios.get("http://192.168.56.1:5500/breakfast", { timeout: 500 });
      const responseLunch = await axios.get("http://192.168.56.1:5500/lunch", { timeout: 500 });
      const responseDinner = await axios.get("http://192.168.56.1:5500/dinner", { timeout: 500 });
      setMenuBreakfast(responseBreakfast.data);
      setMenuLunch(responseLunch.data);
      setMenuDinner(responseDinner.data);
    } catch (error) {
      console.log("Error fetching menu list data", error.message)
    }

  }
  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://192.168.56.1:5500/users", { timeout: 10000 });
      setUser(response.data);
      setMenuLunch(response.data)
    } catch (error) {
      console.log("Error fetching breakfast data", error.message)
    }
  }
  const fetchMenuData = async () => {
    try {
      const response = await axios.get("http://192.168.56.1:5500/menus", { timeout: 10000 });
      setMenus(response.data);
    } catch (error) {
      console.log("Error fetching breakfast data", error.message)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
    // animation
    const maxPerc = 100 * 75 / 100;
    const strokeDashoffset = Circlecumference - (Circlecumference * 75) / 100;

    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

    fetchListData();
    fetchUserData();
    fetchMenuData();
  }, [])

  // console.log("first: ", menuBreakfast)
  const handleAdd = (mealType) => {
    setSelectedMeal(mealType);
    setDropdownVisible(true);
  }
  const handleRefresh = () =>{
    setRefreshing(true)
    fetchListData()
    fetchUserData()
    fetchMenuData()
    setRefreshing(false)
  }

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const searchMenu = () => {
    navigation.navigate('searchMenu', { mealType: selectedMeal });
  };

  const createMenu = (meal) => {
    console.log("Received meal:", meal);
    navigation.navigate('createMenu', { meal });
  };


  return (
  
      <ScrollView
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
          <View>
            <View>
              <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 22, fontWeight: 'bold' }}>วันที่</Text>
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
                      return <Donut key={index} percentage={user.purine} color='#4AB4A2' delay={500 + 500 * index} max={400} />
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

            <Text style={{ textAlign: 'center', marginTop: 25, fontSize: 18, fontWeight: 'bold' }}>รายการอาหาร</Text>
            <View style={styles.lineStyle} />

            <View style={{ margin: 17, marginBottom: -5 }}>
              <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 16 }}>มื้อเช้า</Text>
              {menuBreakfast.length > 0 ? (
                <View>
                  <View>
                    <UserBreakfast menuBreakfast={menuBreakfast} />
                  </View>
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Pressable style={styles.addBox} onPress={() => handleAdd('breakfast')}>
                      <AntDesign name="pluscircleo" size={24} color="gray" />
                    </Pressable>
                    <Modal isVisible={isDropdownVisible} onBackdropPress={closeDropdown}>
                      <View style={styles.dropdownContainer}>
                        <Pressable style={styles.dropdownItem} onPress={() => createMenu(selectedMeal)}>
                          <Text>สร้างเมนูเอง</Text>
                        </Pressable>
                        <Pressable style={styles.dropdownItem} onPress={searchMenu}>
                          <Text>ค้นหาเมนู</Text>
                        </Pressable>
                      </View>
                    </Modal>
                  </View>
                </View>


              ) : (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Pressable style={styles.addBox} onPress={() => handleAdd('breakfast')}>
                    <AntDesign name="pluscircleo" size={24} color="gray" />
                  </Pressable>
                  <Modal isVisible={isDropdownVisible} onBackdropPress={closeDropdown}>
                    <View style={styles.dropdownContainer}>
                      <Pressable style={styles.dropdownItem} onPress={() => createMenu(selectedMeal)}>
                        <Text>สร้างเมนูเอง</Text>
                      </Pressable>
                      <Pressable style={styles.dropdownItem} onPress={searchMenu}>
                        <Text>ค้นหาเมนู</Text>
                      </Pressable>
                    </View>
                  </Modal>
                </View>
              )}
            </View>

            <View style={{ margin: 17, marginBottom: -5 }}>
              <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 16 }}>มื้อกลางวัน</Text>
              {menuLunch.length > 0 ? (
                <View>
                  <View>
                    <UserLunch menuLunch={menuLunch} />
                  </View>
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Pressable style={styles.addBox} onPress={() => handleAdd('lunch')}>
                      <AntDesign name="pluscircleo" size={24} color="gray" />
                    </Pressable>
                    <Modal isVisible={isDropdownVisible} onBackdropPress={closeDropdown}>
                      <View style={styles.dropdownContainer}>
                        <Pressable style={styles.dropdownItem} onPress={() => createMenu(selectedMeal)}>
                          <Text>สร้างเมนูเอง</Text>
                        </Pressable>
                        <Pressable style={styles.dropdownItem} onPress={searchMenu}>
                          <Text>ค้นหาเมนู</Text>
                        </Pressable>
                      </View>
                    </Modal>
                  </View>
                </View>
              ) : (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Pressable style={styles.addBox} onPress={() => handleAdd('lunch')}>
                    <AntDesign name="pluscircleo" size={24} color="gray" />
                  </Pressable>
                  <Modal isVisible={isDropdownVisible} onBackdropPress={closeDropdown}>
                    <View style={styles.dropdownContainer}>
                      <Pressable style={styles.dropdownItem} onPress={() => createMenu(selectedMeal)}>
                        <Text>สร้างเมนูเอง</Text>
                      </Pressable>
                      <Pressable style={styles.dropdownItem} onPress={searchMenu}>
                        <Text>ค้นหาเมนู</Text>
                      </Pressable>
                    </View>
                  </Modal>
                </View>
              )}
            </View>

            <View style={{ margin: 17 }}>
              <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 16 }}>มื้อเย็น</Text>
              {menuDinner.length > 0 ? (
                <View>
                  <View>
                    <UserDinner menuDinner={menuDinner} />
                  </View>
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Pressable style={styles.addBox} onPress={() => handleAdd('dinner')}>
                      <AntDesign name="pluscircleo" size={24} color="gray" />
                    </Pressable>
                    <Modal isVisible={isDropdownVisible} onBackdropPress={closeDropdown}>
                      <View style={styles.dropdownContainer}>
                        <Pressable style={styles.dropdownItem} onPress={() => createMenu(selectedMeal)}>
                          <Text>สร้างเมนูเอง</Text>
                        </Pressable>
                        <Pressable style={styles.dropdownItem} onPress={searchMenu}>
                          <Text>ค้นหาเมนู</Text>
                        </Pressable>
                      </View>
                    </Modal>
                  </View>
                </View>


              ) : (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Pressable style={styles.addBox} onPress={() => handleAdd('dinner')}>
                    <AntDesign name="pluscircleo" size={24} color="gray" />
                  </Pressable>
                  <Modal isVisible={isDropdownVisible} onBackdropPress={closeDropdown}>
                    <View style={styles.dropdownContainer}>
                      <Pressable style={styles.dropdownItem} onPress={() => createMenu(selectedMeal)}>
                        <Text>สร้างเมนูเอง</Text>
                      </Pressable>
                      <Pressable style={styles.dropdownItem} onPress={searchMenu}>
                        <Text>ค้นหาเมนู</Text>
                      </Pressable>
                    </View>
                  </Modal>
                </View>
              )}
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
    marginTop: 20,
    padding: 20,
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center'
  },
  lineStyle: {
    borderWidth: 0.5,
    width: '80%',
    alignSelf: 'center',
    color: 'lightgray',
    backgroundColor: 'lightgray',
    marginTop: 9
  },
  addBox: {
    borderStyle: "dashed",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    width: 350,
    alignItems: "center",
    padding: 20,
    marginTop: 10
  },
  dropdownContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
})