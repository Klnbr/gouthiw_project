import React from 'react';
import { Tabs, Stack } from 'expo-router';
import { Foundation, Ionicons, FontAwesome } from '@expo/vector-icons';
import { Text } from 'react-native'


export default function Layout() {
     return (
          <Tabs>
               <Tabs.Screen
                    name="homeUser"
                    options={({ route }) => ({
                         tabBarLabel: ({ focused, color }) => (
                              focused ? (
                                   <Text style={{ color: "#FFA13F", fontWeight: 'bold', fontSize: 10 }}>หน้าหลัก</Text>
                              ) : null
                         ),
                         headerShown: false,
                         tabBarIcon: ({ focused, color, size }) => (
                              <Foundation
                                   name="home"
                                   size={size}
                                   style={{ color: focused ? "#FFA13F" : 'gray', marginBottom: focused ? -5 : 0 }}
                              />
                         )
                    })} />
               <Tabs.Screen name="diary" options={{
                    tabBarLabel: ({ focused, color }) => (
                         focused ? (
                              <Text style={{ color: "#FFA13F", fontWeight: 'bold', fontSize: 10 }}>ไดอารี่</Text>
                         ) : null
                    ),
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                         <Ionicons
                              name="fast-food"
                              size={size}
                              style={{ color: focused ? "#FFA13F" : 'gray', marginBottom: focused ? -5 : 0 }}
                         />
                    )
               }} />
               <Tabs.Screen name="noti" options={{
                    tabBarLabel: ({ focused, color }) => (
                         focused ? (
                              <Text style={{ color: "#FFA13F", fontWeight: 'bold', fontSize: 10 }}>แจ้งเตือน</Text>
                         ) : null
                    ),
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                         <FontAwesome
                              name="bell"
                              size={size}
                              style={{ color: focused ? "#FFA13F" : 'gray', marginBottom: focused ? -5 : 0 }}
                         />
                    )
               }} />
               <Tabs.Screen name="profile" options={{
                    tabBarLabel: ({ focused, color }) => (
                         focused ? (
                              <Text style={{ color: "#FFA13F", fontWeight: 'bold', fontSize: 10 }}>โปรไฟล์</Text>
                         ) : null
                    ),
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                         <Ionicons
                              name="person"
                              size={size}
                              style={{ color: focused ? "#FFA13F" : 'gray', marginBottom: focused ? -5 : 0 }}
                         />
                    )
               }} />
          </Tabs>
     )
}