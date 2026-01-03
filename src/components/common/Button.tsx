import { TouchableOpacity, Text, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { ButtonProps } from "../../interfaces/interface"

export function Button({ title, onPress, variant = "primary", icon, loading, disabled, className = "" }: ButtonProps) {
  const variantStyles = {
    primary: "bg-primary",
    secondary: "bg-dark-card border border-dark-border",
    danger: "bg-error",
    ghost: "bg-transparent",
  }

  const textStyles = {
    primary: "text-white",
    secondary: "text-white",
    danger: "text-white",
    ghost: "text-primary",
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center overflow-hidden justify-center gap-2 py-4 px-6 rounded-xl ${variantStyles[variant]} ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={20} color="#fff" />}
          <Text className={`text-base font-bold ${textStyles[variant]}`}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}
