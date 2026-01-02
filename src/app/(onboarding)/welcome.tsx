"use client"
import { useRouter } from "expo-router"
import { ImageBackground, Text, TouchableOpacity, View, Image } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { MarkMeFullLogo, MarkMeLogo } from "@/images/images"

/**
 * Welcome Screen - First screen users see when opening the app
 * Features:
 * - Hero image with gradient overlay
 * - App logo with primary branding
 * - Main CTA buttons (Get Started & Log In)
 * - Smooth gradient background effects
 */
export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <View className="flex-1 bg-[#101c22]">
      {/* Background Decorative Glows */}
      <View className="absolute top-[-20%] left-[-20%] w-[70%] h-[50%] rounded-full bg-[#13a4ec]/20 blur-[100px]" />
      <View className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] rounded-full bg-[#13a4ec]/10 blur-[80px]" />

      {/* Main Content Container */}
      <View className="flex-1">
        {/* Hero Section with Background Image */}
        <View className="relative w-full h-[55%]">
          {/* Background Image */}
          <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80" }}
            className="absolute inset-0"
            resizeMode="cover"
          >
            {/* Gradient Overlay for smooth transition */}
            <LinearGradient
              colors={["rgba(16, 28, 34, 0.3)", "rgba(16, 28, 34, 0.6)", "#101c22"]}
              locations={[0, 0.5, 1]}
              className="absolute inset-0"
            />
          </ImageBackground>

          {/* Logo Container - Positioned at bottom of hero */}
          <View className="absolute bottom-6 left-0 right-0 items-center">
            <View className="w-24 h-24 bg-white rounded-3xl items-center justify-center shadow-xl overflow-hidden">
              <Image source={MarkMeFullLogo} className="w-20 h-20 mb-4 ml-1.5" resizeMode="contain" />
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View className="flex-1 px-6 pb-8">
          {/* Headline & Description */}
          <View className="items-center text-center mt-10 mb-auto">
            <Text className="text-3xl font-bold tracking-tight text-white text-center mb-3">Welcome to MarkMe</Text>
            <Text className="text-[#92b7c9] text-base text-center leading-relaxed max-w-[320px]">
              Streamline your classroom. Track attendance, grade assignments, and generate reports in seconds.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 w-full mt-8">
            {/* Primary Button: Get Started */}
            <TouchableOpacity
              className="w-full h-14 bg-[#13a4ec] rounded-xl items-center justify-center shadow-lg"
              activeOpacity={0.8}
              onPress={() => router.push("/(onboarding)/get-started")}
            >
              <Text className="text-white text-lg font-bold">Get Started</Text>
            </TouchableOpacity>

            {/* Secondary Button: Log In */}
            <TouchableOpacity
              className="w-full h-12 bg-transparent items-center justify-center"
              activeOpacity={0.7}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text className="text-[#92b7c9] text-sm">
                Already have an account? <Text className="font-bold text-white">Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Safe Area Spacer */}
          <View className="h-4" />
        </View>
      </View>
    </View>
  )
}
