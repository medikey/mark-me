"use client"

import { View, Text, Image, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import type { ClassCardProps } from "../../interfaces/interface"

export function ClassCard({ classItem }: ClassCardProps) {
  const router = useRouter()

  return (
    <TouchableOpacity onPress={() => router.push(`/(tabs)/classes/${classItem.id}`)}>
      <View className="bg-[#192b33] rounded-2xl overflow-hidden mb-4">
        <Image source={{ uri: classItem.image }} className="w-full h-32" />
        <View className="p-4">
          <Text className="text-white text-lg font-bold mb-1">{classItem.name}</Text>
          <View className="flex-row items-center gap-2 mb-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="people" size={14} color="#64748B" />
              <Text className="text-[#64748b] text-xs">{classItem.studentCount} Students</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="time" size={14} color="#64748B" />
              <Text className="text-[#64748b] text-xs">{classItem.time}</Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-[#94a3b8] text-sm">{classItem.section}</Text>
            <Text className="text-[#94a3b8] text-sm">{classItem.room}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
