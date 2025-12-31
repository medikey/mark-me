"use client"

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { z } from "zod"
import { useApp } from "../../contexts/AppContext"
import { useToast } from "../../hooks/useToast"
import { signUp } from "../../utils/auth"

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormData = z.infer<typeof schema>

export default function SignUpScreen() {
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

  const onSubmit = (data: FormData) => {
    try {
      signUp(data)
      show("Account created successfully!", "success")
      router.push("/(auth)/login")
    } catch (error: any) {
      show(error.message || "Signup failed", "error")
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-[#101c22]" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerClassName="flex-grow justify-center p-6" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-8">
          <View className="flex-row justify-center items-center gap-4 mt-10">
          <View className="w-20 h-20 rounded-3xl bg-[#192b33] justify-center items-center mb-10">
            <Ionicons name="school" size={48} color="#13a4ec" />
          </View>
          <Text className="text-4xl mb-10 font-bold text-white">MarkMe</Text>
          </View>
          <Text className="text-white text-3xl font-bold">Welcome Onboard</Text>
          <Text className="text-base text-[#8b9faa]">Start your journey with us.</Text>
        </View>

        <View className="flex-row bg-[#192b33] rounded-xl p-1 mb-8">
          <TouchableOpacity
            className="flex-1 py-3 items-center rounded-lg"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-base font-semibold text-[#8b9faa]">Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 py-3 items-center rounded-lg bg-[#13a4ec]">
            <Text className="text-base font-semibold text-white">Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View className="gap-4">
          <View>
            <Text className="text-sm font-semibold text-white mb-2">First Name</Text>
            <View className="flex-row items-center bg-[#192b33] rounded-xl px-4 h-14 border border-[#325567]">
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className=" focus:outline-none flex-1 text-base text-white"
                    placeholder="John"
                    placeholderTextColor="#92b7c9"
                    autoCapitalize="words"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </View>
            {errors.firstName && <Text className="text-[#EF4444] text-sm mt-1">{errors.firstName.message}</Text>}
          </View>

          <View>
            <Text className="text-sm font-semibold text-white mb-2">Last Name</Text>
            <View className="flex-row items-center bg-[#192b33] rounded-xl px-4 h-14 border border-[#325567]">
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="focus:outline-none flex-1 text-base text-white"
                    placeholder="Doe"
                    placeholderTextColor="#92b7c9"
                    autoCapitalize="words"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </View>
            {errors.lastName && <Text className="text-[#EF4444] text-sm mt-1">{errors.lastName.message}</Text>}
          </View>

          <View>
            <Text className="text-sm font-semibold text-white mb-2">Email</Text>
            <View className="flex-row items-center bg-[#192b33] rounded-xl px-4 h-14 border border-[#325567]">
              <MaterialCommunityIcons name="email-outline" size={20} color="#92b7c9" className="mr-3" />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="focus:outline-none flex-1 text-base text-white"
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

          <View>
            <Text className="text-sm font-semibold text-white mb-2">Password</Text>
            <View className="flex-row items-center bg-[#192b33] rounded-xl px-4 h-14 border border-[#325567]">
              <MaterialCommunityIcons name="lock-outline" size={20} color="#92b7c9" className="mr-3" />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="focus:outline-none flex-1 text-base text-white"
                    placeholder="••••••••"
                    placeholderTextColor="#92b7c9"
                    secureTextEntry={!passwordVisible}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Ionicons name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#92b7c9" />
              </TouchableOpacity>
            </View>
            {errors.password && <Text className="text-[#EF4444] text-sm mt-1">{errors.password.message}</Text>}
          </View>

          <TouchableOpacity
            className="flex-row bg-[#13a4ec] py-4 rounded-xl items-center justify-center gap-2 mt-4 shadow-lg"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-lg font-semibold text-white">Sign Up</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-[#325567]" />
            <Text className="text-[#8b9faa] text-sm mx-4">Or continue with</Text>
            <View className="flex-1 h-px bg-[#325567]" />
          </View>

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

          <View className="flex-row justify-center mt-6">
            <Text className="text-[#8b9faa] text-sm">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text className="text-[#13a4ec] text-sm font-semibold">Log In</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-4">
            <Text className="text-[#8b9faa] text-sm">Trouble signing up? </Text>
            <TouchableOpacity>
              <Text className="text-[#13a4ec] text-sm font-semibold">Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
