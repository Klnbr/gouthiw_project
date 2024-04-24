import React from 'react';
import { Tabs, Stack } from 'expo-router';
import { Foundation, Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native'


export default function Layout() {
     return (
          <Tabs>
               <Tabs.Screen
                    name="home"
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
               <Tabs.Screen name="allMenus" options={{
                    tabBarLabel: ({ focused, color }) => (
                         focused ? (
                              <Text style={{ color: "#FFA13F", fontWeight: 'bold', fontSize: 10 }}>เมนูอาหาร</Text>
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
               <Tabs.Screen name="allTrivia" options={{
                    tabBarLabel: ({ focused, color }) => (
                         focused ? (
                              <Text style={{ color: "#FFA13F", fontWeight: 'bold', fontSize: 10 }}>เกร็ดความรู้</Text>
                         ) : null
                    ),
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => (
                         <Ionicons
                              name="ios-newspaper-sharp"
                              size={size}
                              style={{ color: focused ? "#FFA13F" : 'gray', marginBottom: focused ? -5 : 0 }}
                         />
                    )
               }} />
               <Tabs.Screen name="nutrProfile" options={{
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