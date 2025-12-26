import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { AppProvider } from "@/contexts/AppContext"
import "../global.css"

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="light" backgroundColor="#101c22" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#101c22",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "600",
          },
          contentStyle: {
            backgroundColor: "#101c22",
          },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  )
}
