import { View, Text, Image } from "react-native"
import type { AvatarProps } from "@/interfaces/interface"

export function Avatar({ uri, name, size = 48 }: AvatarProps) {
  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(" ")
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
    }
    return fullName.charAt(0).toUpperCase()
  }

  const getColorFromName = (name: string) => {
    const colors = [
      "#13a4ec", // Blue
      "#10b981", // Green
      "#f59e0b", // Amber
      "#8b5cf6", // Purple
      "#ec4899", // Pink
      "#14b8a6", // Teal
    ]
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  const initials = getInitials(name)
  const bgColor = getColorFromName(name)

   if (uri && (uri.startsWith("http") || uri.startsWith("file://"))) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
  }

  return (
    <View
      className="rounded-full justify-center items-center w-10 h-10"
      style={{ width: size, height: size, backgroundColor: bgColor }}
    >
      <Text className="text-white font-bold" style={{ fontSize: size / 2.5 }}>
        {initials}
      </Text>
    </View>
  )
}
