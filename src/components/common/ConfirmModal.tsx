import { View, Text, Modal, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { ConfirmModalProps } from "@/interfaces/interface"

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "primary",
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <View className="bg-[#1a2730] rounded-2xl w-full max-w-md overflow-hidden">
          <View className="p-6">
            <View
              className={`w-14 h-14 rounded-full items-center justify-center mb-4 ${
                variant === "danger" ? "bg-red-500/20" : "bg-[#13a4ec]/20"
              }`}
            >
              <Ionicons
                name={variant === "danger" ? "warning" : "help-circle"}
                size={28}
                color={variant === "danger" ? "#EF4444" : "#13a4ec"}
              />
            </View>
            <Text className="text-xl font-bold text-white mb-2">{title}</Text>
            <Text className="text-[#94a3b8] mb-6">{message}</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-[#0F1419] py-3 rounded-xl items-center"
                onPress={onCancel}
                activeOpacity={0.7}
              >
                <Text className="text-white font-semibold">{cancelText}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl items-center ${variant === "danger" ? "bg-red-500" : "bg-[#13a4ec]"}`}
                onPress={onConfirm}
                activeOpacity={0.7}
              >
                <Text className="text-white font-semibold">{confirmText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
