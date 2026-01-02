"use client"

import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import { View, ActivityIndicator, Text } from "react-native"
import { useApp } from "@/contexts/AppContext"
import AsyncStorage from "@react-native-async-storage/async-storage"

/**
 * Index Screen - App Entry Point
 * Determines the initial route based on user state:
 * 1. First time users -> Onboarding flow
 * 2. Authenticated users -> Main app (classes)
 * 3. Returning users -> Login screen
 */
export default function Index() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useApp()
  const [checkingOnboarding, setCheckingOnboarding] = useState(true)

  useEffect(() => {
    /**
     * Check if user has completed onboarding
     * Returns true if user has seen onboarding before
     */
    const checkOnboardingStatus = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding")
        return hasSeenOnboarding === "true"
      } catch (error) {
        console.error("Error checking onboarding status:", error)
        return false
      }
    }

    /**
     * Navigate to appropriate screen based on user state
     */
    const navigateToScreen = async () => {
      if (!isLoading) {
        const hasCompletedOnboarding = await checkOnboardingStatus()

        setCheckingOnboarding(false)

        const timer = setTimeout(() => {
          if (isAuthenticated) {
            // User is logged in -> Go to main app
            router.replace("/(tabs)/classes")
          } else if (hasCompletedOnboarding) {
            // User has seen onboarding before -> Go to login
            router.replace("/(auth)/login")
          } else {
            // First time user -> Show onboarding
            router.replace("/(onboarding)/welcome")
          }
        }, 500)

        return () => clearTimeout(timer)
      }
    }

    navigateToScreen()
  }, [isAuthenticated, isLoading])

  return (
    <View className="flex-1 justify-center items-center bg-[#0F1419]">
      <ActivityIndicator size="large" color="#13a4ec" />
      <Text className="text-white text-base mt-4">Loading MARKME...</Text>
    </View>
  )
}
