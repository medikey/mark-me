"use client"

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native"
import { z } from "zod"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useApp } from "@/contexts/AppContext"
import { useToast } from "@/hooks/useToast"
import { logIn } from "@/utils/auth"
import { showToast } from "@/utils/toast"
import { MarkMeFullLogo } from "@/images/images"

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type FormData = z.infer<typeof schema>

export default function LoginScreen() {
  const router = useRouter()
  const { setIsAuthenticated } = useApp()
  const { show } = useToast()
  const [passwordVisible, setPasswordVisible] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  /**
   * Handle login form submission
   * Marks onboarding as complete and authenticates user
   */
  const onSubmit = async (data: FormData) => {
    console.log("Login form submitted:", data.email)
    try {
      // Mark onboarding as complete when user logs in
      await AsyncStorage.setItem("hasSeenOnboarding", "true")

      const result = await logIn(data)
      console.log("Login successful:", result)
      setIsAuthenticated(true)
      // Replaced show with showToast
      showToast("Welcome back!", "success")
      setTimeout(() => {
        router.push("/(tabs)/classes")
      }, 100)
    } catch (error: any) {
      console.log("Login error:", error.message)
      // Replaced show with showToast
      showToast(error.message || "Login failed", "error")
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-[#101c22]" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerClassName="flex-grow justify-center p-6" showsVerticalScrollIndicator={false}>
        {/* Header Section with Logo */}
        <View className="items-center mb-8">
           <View className="mb-4 flex-row gap-4 justify-center items-center">
          <View className="w-25 h-25 rounded-3xl overflow-hidden bg-white justify-center items-center mb-6 shadow-xl">
            <Image source={MarkMeFullLogo} className="w-20 h-20 mb-4" resizeMode="cover" />
          </View>
          <View>
          <Text className="text-4xl font-semibold text-white">MarkMe</Text>
          <Text className="text-base text-[#8b9faa] mb-6">Educator's Assistant</Text>
          </View>
          </View>
          <Text className="text-white text-3xl font-bold">Welcome Back</Text>
          <Text className="text-base text-[#8b9faa]">Streamline your classroom management.</Text>
        </View>

        {/* Tab Switcher - Login/Signup */}
        <View className="flex-row bg-[#192b33] rounded-xl p-1 mb-8">
          <TouchableOpacity className="flex-1 py-3 items-center rounded-lg bg-[#13a4ec]">
            <Text className="text-base font-semibold text-white">Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-3 items-center rounded-lg"
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text className="text-base font-semibold text-[#8b9faa]">Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View className="gap-4">
          {/* Email Field */}
          <View>
            <Text className="text-sm font-semibold text-white mb-2">Email</Text>
            <View className="flex-row items-center bg-[#192b33] rounded-xl px-4 h-14 border border-[#325567]">
              <MaterialCommunityIcons name="email-outline" size={20} color="#92b7c9" className="mr-3" />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 text-base text-white focus:outline-none"
                    placeholder="teacher@school.edu"
                    placeholderTextColor="#92b7c9"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </View>
            {errors.email && <Text className="text-[#EF4444] text-sm mt-1">{errors.email.message}</Text>}
          </View>

          {/* Password Field with Toggle Visibility */}
          <View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-semibold text-white ">Password</Text>
              <TouchableOpacity>
                <Text className="text-sm text-[#13a4ec] font-semibold">Forgot?</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center bg-[#192b33] rounded-xl px-4 h-14 border border-[#325567]">
              <MaterialCommunityIcons name="lock-outline" size={20} color="#92b7c9" className="mr-3" />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 text-base text-white focus:outline-none"
                    placeholder="••••••••"
                    placeholderTextColor="#92b7c9"
                    secureTextEntry={!passwordVisible}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {/* Toggle password visibility button */}
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Ionicons name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#92b7c9" />
              </TouchableOpacity>
            </View>
            {errors.password && <Text className="text-[#EF4444] text-sm mt-1">{errors.password.message}</Text>}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="flex-row bg-[#13a4ec] py-4 rounded-xl items-center justify-center gap-2 mt-4 shadow-lg"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-lg font-semibold text-white">Log In</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-[#325567]" />
            <Text className="text-[#8b9faa] text-sm mx-4">Or continue with</Text>
            <View className="flex-1 h-px bg-[#325567]" />
          </View>

          {/* OAuth Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-[#192b33] py-3.5 rounded-xl gap-2 border border-[#325567]">
              <Ionicons name="logo-google" size={20} color="#fff" />
              <Text className="text-base font-semibold text-white">Google</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-[#192b33] py-3.5 rounded-xl gap-2 border border-[#325567]">
              <Ionicons name="logo-apple" size={20} color="#fff" />
              <Text className="text-base font-semibold text-white">Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Support Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-[#8b9faa] text-sm">Trouble logging in? </Text>
            <TouchableOpacity>
              <Text className="text-[#13a4ec] text-sm font-semibold">Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
