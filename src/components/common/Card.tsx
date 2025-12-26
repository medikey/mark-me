import { View, TouchableOpacity } from "react-native"
import type { CardProps } from "@/interfaces/interface"

export function Card({ children, className = "", onPress }: CardProps) {
  const baseClassName = `rounded-2xl p-4 bg-[#192b33] ${className}`

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} className={baseClassName} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    )
  }

  return <View className={baseClassName}>{children}</View>
}
