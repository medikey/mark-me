"use client"

import { useEffect, useRef } from "react"
import { Text, Animated, TouchableOpacity, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { ToastType } from "@/interfaces/interface"

interface ToastProps {
  visible: boolean
  message: string
  type: ToastType
  onHide: () => void
  duration?: number
}

export function Toast({ visible, message, type, onHide, duration = 3000 }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(-100)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start()

      const timer = setTimeout(() => {
        hideToast()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [visible])

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide()
    })
  }

  if (!visible) return null

  const getIcon = () => {
    switch (type) {
      case "success":
        return "checkmark-circle"
      case "error":
        return "close-circle"
      case "warning":
        return "warning"
      default:
        return "information-circle"
    }
  }

  const getColor = () => {
    switch (type) {
      case "success":
        return "bg-[#10B981]"
      case "error":
        return "bg-[#EF4444]"
      case "warning":
        return "bg-[#F59E0B]"
      default:
        return "bg-[#13a4ec]"
    }
  }

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
      className={`absolute top-16 left-5 right-5 z-50 ${Platform.OS === "ios" ? "top-20" : "top-16"}`}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={hideToast}
        className={`${getColor()} rounded-xl p-4 flex-row items-center gap-3 shadow-lg`}
      >
        <Ionicons name={getIcon()} size={24} color="#fff" />
        <Text className="flex-1 text-white text-base font-semibold">{message}</Text>
        <TouchableOpacity onPress={hideToast}>
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  )
}
