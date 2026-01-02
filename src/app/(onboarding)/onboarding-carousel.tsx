"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"

/**
 * Onboarding data for the carousel screens
 * Each screen highlights a key feature of the app
 */
const onboardingData = [
  {
    id: 1,
    title: "Effortless Attendance",
    description:
      "Forget the paper lists. Mark students present or absent with a single tap. Save time for what matters most—teaching.",
    illustrationComponent: AttendanceIllustration,
  },
  {
    id: 2,
    title: "Smart Grading System",
    description:
      "Create custom grading criteria and evaluate students instantly. Get insights into class performance at a glance.",
    illustrationComponent: GradingIllustration,
  },
  {
    id: 3,
    title: "Instant Reports",
    description:
      "Generate detailed attendance and grade reports in seconds. Share them with parents or administrators effortlessly.",
    illustrationComponent: ReportsIllustration,
  },
]

/**
 * Onboarding Carousel Screen - Multi-step walkthrough of app features
 * Features:
 * - Swipeable carousel with 3 screens
 * - Page indicators (dots)
 * - Skip button to bypass onboarding
 * - Next/Get Started button based on current step
 * - Smooth animations and transitions
 */
export default function OnboardingCarouselScreen() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const screenWidth = Dimensions.get("window").width

  /**
   * Handle horizontal scroll to update current page index
   */
  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x
    const index = Math.round(contentOffset / screenWidth)
    setCurrentIndex(index)
  }

  /**
   * Navigate to next screen or complete onboarding
   */
  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      // Move to next carousel item
      setCurrentIndex(currentIndex + 1)
    } else {
      // Complete onboarding and go to signup
      router.push("/(auth)/signup")
    }
  }

  /**
   * Skip onboarding and go directly to login
   */
  const handleSkip = () => {
    router.push("/(auth)/login")
  }

  return (
    <View className="flex-1 bg-[#101c22]">
      {/* Background Decorative Glows */}
      <View className="absolute top-[-20%] left-[-20%] w-[70%] h-[50%] rounded-full bg-[#13a4ec]/20 blur-[100px]" />
      <View className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] rounded-full bg-[#13a4ec]/10 blur-[80px]" />

      {/* Top Bar with Skip Button */}
      <View className="items-end p-4 pt-12 z-10">
        <TouchableOpacity className="px-4 py-2 rounded-full" activeOpacity={0.7} onPress={handleSkip}>
          <Text className="text-[#92b7c9] text-sm font-bold">Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area - Single Page (No Scroll for MVP) */}
      <View className="flex-1 items-center justify-center px-6 gap-8">
        {/* Current Screen Content */}
        {onboardingData[currentIndex].illustrationComponent()}

        {/* Text Content */}
        <View className="items-center max-w-md">
          <Text className="text-white text-[32px] font-bold text-center mb-3 leading-tight tracking-tight">
            {onboardingData[currentIndex].title}
          </Text>
          <Text className="text-[#92b7c9] text-base text-center leading-relaxed">
            {onboardingData[currentIndex].description}
          </Text>
        </View>
      </View>

      {/* Footer Actions */}
      <View className="items-center justify-end w-full p-6 pt-8 pb-10 gap-8">
        {/* Page Indicators (Dots) */}
        <View className="flex-row items-center gap-3">
          {onboardingData.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "w-8 bg-[#13a4ec]" : "w-2 bg-[#325567]"
              }`}
            />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <TouchableOpacity
          className="w-full flex-row items-center justify-between bg-[#13a4ec] h-14 rounded-2xl px-6 shadow-lg"
          activeOpacity={0.8}
          onPress={handleNext}
        >
          <Text className="text-white font-bold text-lg">
            {currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
          </Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

/**
 * Illustration Component: Attendance Feature
 * Shows a mockup of the attendance tracking interface
 */
function AttendanceIllustration() {
  return (
    <View className="relative w-full aspect-4/5 max-h-[50vh] rounded-3xl overflow-hidden shadow-2xl bg-[#1d2931]">
      {/* Background Gradient */}
      <View className="absolute inset-0 bg-linear-to-br from-[#1d2931] to-[#111c22]" />

      {/* Mock App UI */}
      <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#111c22] border border-white/10 rounded-2xl p-4 shadow-xl">
        {/* Fake Header */}
        <View className="h-4 w-1/3 bg-[#325567] rounded mb-6" />

        {/* Student List Item 1 (Checked) */}
        <View className="flex-row items-center justify-between mb-4 p-3 bg-white/5 rounded-xl border border-[#13a4ec]/30">
          <View className="flex-row items-center gap-3">
            <View className="h-8 w-8 rounded-full bg-[#325567]" />
            <View className="h-3 w-24 bg-white/20 rounded" />
          </View>
          <Ionicons name="checkmark-circle" size={24} color="#13a4ec" />
        </View>

        {/* Student List Item 2 (Checked) */}
        <View className="flex-row items-center justify-between mb-4 p-3 bg-white/5 rounded-xl border border-[#13a4ec]/30">
          <View className="flex-row items-center gap-3">
            <View className="h-8 w-8 rounded-full bg-[#325567]" />
            <View className="h-3 w-20 bg-white/20 rounded" />
          </View>
          <Ionicons name="checkmark-circle" size={24} color="#13a4ec" />
        </View>

        {/* Student List Item 3 (Pending) */}
        <View className="flex-row items-center justify-between p-3 bg-white/5 rounded-xl opacity-60">
          <View className="flex-row items-center gap-3">
            <View className="h-8 w-8 rounded-full bg-[#325567]" />
            <View className="h-3 w-28 bg-white/20 rounded" />
          </View>
          <View className="h-6 w-6 rounded-full border-2 border-white/20" />
        </View>

        {/* Decorative Glow for Interaction */}
        <View className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#13a4ec]/20 blur-3xl rounded-full" />
      </View>
    </View>
  )
}

/**
 * Illustration Component: Grading Feature
 * Shows a mockup of the grading interface
 */
function GradingIllustration() {
  return (
    <View className="relative w-full aspect-4/5 max-h-[50vh] rounded-3xl overflow-hidden shadow-2xl bg-[#1d2931]">
      {/* Background Gradient */}
      <View className="absolute inset-0 bg-linear-to-br from-[#1d2931] to-[#111c22]" />

      {/* Mock App UI */}
      <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#111c22] border border-white/10 rounded-2xl p-4 shadow-xl">
        {/* Fake Header */}
        <View className="h-4 w-2/5 bg-[#325567] rounded mb-6" />

        {/* Grade Cards */}
        <View className="gap-3">
          {/* Grade Card 1 */}
          <View className="bg-white/5 rounded-xl p-4 border border-[#13a4ec]/30">
            <View className="flex-row items-center justify-between mb-2">
              <View className="h-3 w-20 bg-white/20 rounded" />
              <Text className="text-[#13a4ec] font-bold text-lg">A+</Text>
            </View>
            <View className="h-2 w-full bg-[#325567] rounded-full overflow-hidden">
              <View className="h-full w-[95%] bg-[#13a4ec] rounded-full" />
            </View>
          </View>

          {/* Grade Card 2 */}
          <View className="bg-white/5 rounded-xl p-4 border border-[#325567]/30">
            <View className="flex-row items-center justify-between mb-2">
              <View className="h-3 w-24 bg-white/20 rounded" />
              <Text className="text-[#92b7c9] font-bold text-lg">B</Text>
            </View>
            <View className="h-2 w-full bg-[#325567] rounded-full overflow-hidden">
              <View className="h-full w-[75%] bg-[#92b7c9] rounded-full" />
            </View>
          </View>
        </View>

        {/* Decorative Glow */}
        <View className="absolute -top-10 -left-10 w-32 h-32 bg-[#13a4ec]/20 blur-3xl rounded-full" />
      </View>
    </View>
  )
}

/**
 * Illustration Component: Reports Feature
 * Shows a mockup of the reports/analytics interface
 */
function ReportsIllustration() {
  return (
    <View className="relative w-full aspect-4/5 max-h-[50vh] rounded-3xl overflow-hidden shadow-2xl bg-[#1d2931]">
      {/* Background Gradient */}
      <View className="absolute inset-0 bg-linear-to-br from-[#1d2931] to-[#111c22]" />

      {/* Mock App UI */}
      <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#111c22] border border-white/10 rounded-2xl p-4 shadow-xl">
        {/* Fake Header */}
        <View className="h-4 w-1/4 bg-[#325567] rounded mb-6" />

        {/* Report Stats */}
        <View className="gap-4">
          {/* Stat Card 1 */}
          <View className="bg-white/5 rounded-xl p-4 border border-[#13a4ec]/30">
            <View className="h-2 w-16 bg-white/20 rounded mb-2" />
            <Text className="text-[#13a4ec] font-bold text-2xl">94%</Text>
          </View>

          {/* Stat Card 2 */}
          <View className="bg-white/5 rounded-xl p-4">
            <View className="h-2 w-20 bg-white/20 rounded mb-2" />
            <Text className="text-white font-bold text-2xl">28</Text>
          </View>

          {/* Mini Chart Representation */}
          <View className="flex-row items-end gap-2 mt-4 h-20">
            <View className="flex-1 bg-[#13a4ec]/50 rounded-t-lg" style={{ height: "60%" }} />
            <View className="flex-1 bg-[#13a4ec]/70 rounded-t-lg" style={{ height: "80%" }} />
            <View className="flex-1 bg-[#13a4ec] rounded-t-lg" style={{ height: "100%" }} />
            <View className="flex-1 bg-[#13a4ec]/60 rounded-t-lg" style={{ height: "70%" }} />
          </View>
        </View>

        {/* Decorative Glow */}
        <View className="absolute -bottom-10 right-0 w-40 h-32 bg-[#13a4ec]/20 blur-3xl rounded-full" />
      </View>
    </View>
  )
}
