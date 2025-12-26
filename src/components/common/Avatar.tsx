import { View, Image, Text } from "react-native"
import type { AvatarProps } from "@/interfaces/interface"

export function Avatar({ uri, name, size = 48 }: AvatarProps) {
  if (uri) {
    return <Image source={{ uri }} className="rounded-full" style={{ width: size, height: size }} />
  }

  return (
    <View className="bg-[#325567] rounded-full justify-center items-center" style={{ width: size, height: size }}>
      <Text className="text-white font-bold" style={{ fontSize: size / 3 }}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  )
}
