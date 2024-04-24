import { Stack } from 'expo-router';

export default function Layout() {
     return (
          <Stack screenOptions={{ headerShown: false }}>
               <Stack.Screen name="index" />
               <Stack.Screen name="menu_Detail" />
               <Stack.Screen name="Donut" />
               <Stack.Screen name="searchMenu" />
               <Stack.Screen name="createMenu" />
               {/* <Stack.Screen name="menuTTS" /> */}
               
               {/* <Stack.Screen name="calpurine" />
               <Stack.Screen name="pills" />
               <Stack.Screen name="topic" />
               <Stack.Screen name="trivia" /> */}
          </Stack>
     )
}