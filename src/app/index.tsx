// "use client"

// import { useEffect } from "react"
// import { useRouter } from "expo-router"
// import { View, ActivityIndicator, Text } from "react-native"
// import { useApp } from "@/contexts/AppContext"

// export default function Index() {
//   const router = useRouter()
//   const { isAuthenticated, isLoading } = useApp()

//   useEffect(() => {
//     if (!isLoading) {
//       const timer = setTimeout(() => {
//         if (isAuthenticated) {
//           router.replace("/(tabs)/classes")
//         } else {
//           router.replace("/(auth)/login")
//         }
//       }, 500)

//       return () => clearTimeout(timer)
//     }
//   }, [isAuthenticated, isLoading])

//   return (
//     <View className="flex-1 justify-center items-center bg-[#0F1419]">
//       <ActivityIndicator size="large" color="#0EA5E9" />
//       <Text className="text-white text-base mt-4">Loading MARKME...</Text>
//     </View>
//   )
// }
"use client"

import { useEffect } from "react"
import { useRouter } from "expo-router"
import { View, ActivityIndicator, Text } from "react-native"
import { useApp } from "@/contexts/AppContext"

export default function Index() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useApp()

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          router.replace("/(tabs)/classes")
        } else {
          router.replace("/(auth)/login")
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, isLoading])

  return (
    <View className="flex-1 justify-center items-center bg-[#0F1419]">
      <ActivityIndicator size="large" color="#0EA5E9" />
      <Text className="text-white text-base mt-4">Loading MARKME...</Text>
    </View>
  )
}
