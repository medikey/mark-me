"use client"

import { useState } from "react"
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useApp } from "@/contexts/AppContext"
import { Header } from "@/components/common/Header"
import { Button } from "@/components/common/Button"
import { Avatar } from "@/components/common/Avatar"
import { Card } from "@/components/common/Card"
import { Toast } from "@/components/common/Toast"
import { useToast } from "@/hooks/useToast"
import { pickImage } from "@/utils/fileOperations"

export default function EditProfileScreen() {
  const router = useRouter()
  const { userProfile, updateUserProfile } = useApp()
  const [name, setName] = useState(userProfile.name)
  const [title, setTitle] = useState(userProfile.title)
  const [email, setEmail] = useState(userProfile.email)
  const [phone, setPhone] = useState(userProfile.phone || "")
  const [avatar, setAvatar] = useState(userProfile.avatar)
  const [loading, setLoading] = useState(false)
  const { toast, hide, success, error } = useToast()

  const handlePickImage = async (useCamera: boolean) => {
    try {
      setLoading(true)
      const imageUri = await pickImage(useCamera)
      if (imageUri) {
        setAvatar(imageUri)
        success("Image selected")
      }
    } catch (err) {
      error("Failed to pick image. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const showImageOptions = () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      {
        text: "Take Photo",
        onPress: () => handlePickImage(true),
      },
      {
        text: "Choose from Library",
        onPress: () => handlePickImage(false),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ])
  }

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      error("Name and email are required")
      return
    }

    updateUserProfile({
      name: name.trim(),
      title: title.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatar,
    })

    success("Profile updated successfully")
    setTimeout(() => router.back(), 500)
  }

  return (
    <View className="flex-1 bg-[#0F1419]">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hide} />

      <Header title="Edit Profile" />

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Card className="items-center p-6 mb-6">
          <View className="relative mb-4">
            <Avatar uri={avatar} name={name} size={100} />
            <TouchableOpacity
              className="absolute bottom-0 right-0 w-10 h-10 bg-[#0ea5e9] rounded-full justify-center items-center border-2 border-[#192b33]"
              onPress={showImageOptions}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="camera" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-[#94a3b8]">Tap camera icon to change photo</Text>
        </Card>

        <Text className="text-sm font-semibold text-white mb-2">Full Name *</Text>
        <TextInput
          className="bg-[#192b33] rounded-xl border border-[#325567] px-4 py-4 text-base text-white mb-4"
          placeholder="Enter your full name"
          placeholderTextColor="#64748B"
          value={name}
          onChangeText={setName}
        />

        <Text className="text-sm font-semibold text-white mb-2">Job Title *</Text>
        <TextInput
          className="bg-[#192b33] rounded-xl border border-[#325567] px-4 py-4 text-base text-white mb-4"
          placeholder="Enter your job title"
          placeholderTextColor="#64748B"
          value={title}
          onChangeText={setTitle}
        />

        <Text className="text-sm font-semibold text-white mb-2">Email Address *</Text>
        <TextInput
          className="bg-[#192b33] rounded-xl border border-[#325567] px-4 py-4 text-base text-white mb-4"
          placeholder="Enter your email"
          placeholderTextColor="#64748B"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text className="text-sm font-semibold text-white mb-2">Phone Number</Text>
        <TextInput
          className="bg-[#192b33] rounded-xl border border-[#325567] px-4 py-4 text-base text-white mb-6"
          placeholder="Enter your phone number"
          placeholderTextColor="#64748B"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </ScrollView>

      <View className="px-5 pb-8 gap-3">
        <Button title="Save Changes" onPress={handleSave} icon="save" />
        <Button title="Cancel" onPress={() => router.back()} variant="secondary" />
      </View>
    </View>
  )
}
