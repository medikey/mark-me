"use client"

import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useApp } from "@/contexts/AppContext"
import { Avatar } from "@/components/common/Avatar"
import { Card } from "@/components/common/Card"
import { Toast } from "@/components/common/Toast"
import { useToast } from "@/hooks/useToast"
import { pickImage } from "@/utils/fileOperations"
import { useState } from "react"
import { ConfirmModal } from "@/components/common/ConfirmModal"

export default function SettingsScreen() {
  const router = useRouter()
  const { logout, userProfile, updateUserProfile } = useApp()
  const [loading, setLoading] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { toast, hide, success, error } = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      success("Logged out successfully")
      router.replace("/(auth)/login")
    } catch (err) {
      error("Failed to log out")
    } finally {
      setShowLogoutModal(false)
    }
  }

  const handleQuickPhotoUpdate = async () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      {
        text: "Take Photo",
        onPress: async () => {
          try {
            setLoading(true)
            const imageUri = await pickImage(true)
            if (imageUri) {
              console.log("[v0] Settings - Updating avatar to:", imageUri)
              updateUserProfile({ avatar: imageUri })
              setTimeout(() => {
                success("Profile picture updated!")
              }, 100)
            }
          } catch (error) {
            console.log("[v0] Settings - Error updating avatar:", error)
            error("Failed to update picture")
          } finally {
            setLoading(false)
          }
        },
      },
      {
        text: "Choose from Library",
        onPress: async () => {
          try {
            setLoading(true)
            const imageUri = await pickImage(false)
            if (imageUri) {
              console.log("[v0] Settings - Updating avatar to:", imageUri)
              updateUserProfile({ avatar: imageUri })
              setTimeout(() => {
                success("Profile picture updated!")
              }, 100)
            }
          } catch (error) {
            console.log("[v0] Settings - Error updating avatar:", error)
            error("Failed to update picture")
          } finally {
            setLoading(false)
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ])
  }

  return (
    <View className="flex-1 bg-[#0F1419]">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hide} />

      <ConfirmModal
        visible={showLogoutModal}
        title="Log Out"
        message="Are you sure you want to log out? All unsaved data will be preserved."
        confirmText="Log Out"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />

      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <Card className="flex-row justify-between items-center p-5 mb-8">
          <View className="flex-row items-center gap-4">
            <View className="relative">
              <Avatar key={userProfile.avatar} uri={userProfile.avatar} name={userProfile.name} size={64} />
              <View className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-[#10b981] rounded-full border-2 border-[#192b33]" />
            </View>
            <View>
              <Text className="text-xl font-bold text-white">{userProfile.name}</Text>
              <Text className="text-sm text-[#94a3b8]" numberOfLines={1}>
                {userProfile.title}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="w-10 h-10 justify-center items-center"
            onPress={handleQuickPhotoUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#13a4ec" />
            ) : (
              <Ionicons name="pencil" size={18} color="#13a4ec" />
            )}
          </TouchableOpacity>
        </Card>

        <Text className="text-xs font-bold text-[#64748b] tracking-wider mb-3">ACCOUNT & PREFERENCES</Text>
        <Card className="mb-8 overflow-hidden">
          <SettingItem
            icon="person"
            iconBg="#0EA5E9"
            title="Edit Profile"
            onPress={() => router.push("/edit-profile")}
          />
          <View className="h-px bg-[#0F1419]" />
          <SettingItem icon="notifications" iconBg="#0EA5E9" title="Notification Settings" onPress={() => {}} />
        </Card>

        <Text className="text-xs font-bold text-[#64748b] tracking-wider mb-3">SUPPORT & INFO</Text>
        <Card className="overflow-hidden">
          <SettingItem icon="help-circle" iconBg="#0EA5E9" title="Help & Support" onPress={() => {}} />
          <View className="h-px bg-[#0F1419]" />
          <SettingItem
            icon="information-circle"
            iconBg="#8B5CF6"
            title="About MarkMe"
            badge="v1.0.2"
            onPress={() => {}}
          />
        </Card>

        <TouchableOpacity
          className="flex-row items-center justify-center gap-2 bg-[#192b33] py-4 rounded-xl my-6"
          onPress={() => setShowLogoutModal(true)}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="text-base font-bold text-[#ef4444]">Log Out</Text>
        </TouchableOpacity>

        <Text className="text-center text-xs text-[#64748b] mb-8">MarkMe Inc. © 2025</Text>
      </ScrollView>
    </View>
  )
}

function SettingItem({
  icon,
  iconBg,
  title,
  badge,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap
  iconBg: string
  title: string
  badge?: string
  onPress: () => void
}) {
  return (
    <TouchableOpacity className="flex-row justify-between items-center p-4" onPress={onPress}>
      <View className="flex-row items-center gap-3">
        <View
          className="w-10 h-10 rounded-full justify-center items-center shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <Ionicons name={icon} size={20} color="#fff" />
        </View>
        <Text className="text-base font-semibold text-white">{title}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        {badge && <Text className="text-sm text-[#64748b]">{badge}</Text>}
        <Ionicons name="chevron-forward" size={20} color="#64748b" />
      </View>
    </TouchableOpacity>
  )
}
