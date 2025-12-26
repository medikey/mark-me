import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { StatsCardProps } from "@/interfaces/interface"

export function StatsCard({ icon, iconColor, borderColor, value, label }: StatsCardProps) {
  return (
    <View className="flex-1 flex-row items-center gap-3 bg-[#192b33] p-4 rounded-2xl border" style={{ borderColor }}>
      <View className="w-12 h-12 justify-center items-center">
        <Ionicons name={icon} size={32} color={iconColor} />
      </View>
      <View>
        <Text className="text-white text-3xl font-bold">{value}</Text>
        <Text className="text-[#94a3b8] text-sm">{label}</Text>
      </View>
    </View>
  )
}
