"use client"
import { MarkMeFullLogo, GettingStarted } from "@/images/images"
import { useRouter } from "expo-router"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"

/**
 * Get Started Screen - Showcases the main value proposition
 * Features:
 * - Hero image with decorative glow effect
 * - Floating badge element for visual interest
 * - Skip button for quick navigation
 * - Primary and secondary CTAs
 * - Terms of service footer
 */
export default function GetStartedScreen() {
  const router = useRouter()

  return (
    <View className="flex-1 bg-[#101c22]">
      {/* Top Navigation with Skip Button */}
      <View className="absolute top-0 left-0 right-0 z-10 items-end p-6 pt-12">
        <TouchableOpacity
          className="px-4 py-2 rounded-full"
          activeOpacity={0.7}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text className="text-[#92b7c9] text-sm font-bold">Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerClassName="flex-grow items-center justify-center px-6 pt-20 pb-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Illustration Section */}
        <View className="relative w-full max-w-70 mb-10">
          {/* Decorative Glow Effect */}
          <View className="absolute inset-0 scale-1.1 rounded-full bg-[#13a4ec]/20 blur-3xl" />

          {/* Main Hero Image */}
          <View className="relative w-full aspect-4/5 rounded-3xl overflow-hidden bg-[#1d2931] shadow-2xl">
            <Image
              source={GettingStarted}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Subtle Overlay Gradient */}
            <View className="absolute inset-0 bg-linear-to-t from-[#101c22]/20 to-transparent" />
          </View>

          {/* Floating Badge Element - Bottom Right */}
          <View className="absolute -bottom-6 right-8 w-24 h-24 bg-white rounded-4xl items-center justify-center shadow-lg border-4 border-[#101c22] overflow-hidden will-change-variable">
            <Image source={MarkMeFullLogo} className="w-16 h-16 mb-2" resizeMode="contain" />
          </View>
        </View>

        {/* Text Content */}
        <View className="items-center max-w-md">
          <Text className="text-3xl font-bold text-white text-center mb-4 leading-tight tracking-tight">
            Classroom management made simple.
          </Text>
          <Text className="text-[#92b7c9] text-base text-center leading-relaxed">
            Join thousands of educators saving time on grading and attendance today.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Section */}
      <View className="w-full px-6 pb-10 pt-4">
        <View className="w-full max-w-md mx-auto gap-4">
          {/* Primary Button: Create Account */}
          <TouchableOpacity
            className="w-full h-14 bg-[#13a4ec]/70 rounded-full items-center justify-center shadow-lg"
            activeOpacity={0.8}
            onPress={() => router.push("/(onboarding)/onboarding-carousel")}
          >
            <Text className="text-white text-base font-bold">Create Account</Text>
          </TouchableOpacity>

          {/* Secondary Button: Log In */}
          <TouchableOpacity
            className="w-full h-14 bg-transparent rounded-full items-center justify-center border border-[#325567]"
            activeOpacity={0.7}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-white text-base font-bold">Log In</Text>
          </TouchableOpacity>

          {/* Terms Footer */}
          <Text className="text-[#92b7c9] text-xs text-center leading-normal mt-4">
            By continuing, you agree to our <Text className="underline">Terms of Service</Text> and{" "}
            <Text className="underline">Privacy Policy</Text>.
          </Text>
        </View>
      </View>
    </View>
  )
}
