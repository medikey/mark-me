import { View, Text, TouchableOpacity, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface CreateOptionModalProps {
  visible: boolean
  onCreateClass: () => void
  onCreateGroup: () => void
  onCancel: () => void
}

/**
 * CreateOptionModal Component
 * Bottom sheet modal that presents the user with two options:
 * 1. Create a Class Group (folder for organizing multiple classes)
 * 2. Create a Class (single class instance)
 */
export function CreateOptionModal({ visible, onCreateClass, onCreateGroup, onCancel }: CreateOptionModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      {/* Modal backdrop with blur effect */}
      <View className="flex-1 bg-black/60 justify-end">
        {/* Bottom sheet container */}
        <View className="bg-[#111c22] rounded-t-[28px] pb-8">
          {/* Drag handle */}
          <View className="w-full items-center justify-center pt-4 pb-2">
            <View className="h-1.5 w-10 rounded-full bg-[#325567]" />
          </View>

          {/* Title */}
          <View className="px-6 pt-2 pb-4">
            <Text className="text-white text-xl font-bold text-center">What would you like to create?</Text>
          </View>

          {/* Options list */}
          <View className="px-4 space-y-3">
            {/* Create Class Group Option */}
            <TouchableOpacity
              onPress={onCreateGroup}
              className="flex-row items-center gap-4 p-4 rounded-2xl bg-[#1a262e] border border-transparent active:scale-[0.98]"
            >
              {/* Icon */}
              <View className="w-12 h-12 rounded-xl bg-[#233c48] items-center justify-center">
                <Ionicons name="folder" size={28} color="#13a4ec" />
              </View>

              {/* Text */}
              <View className="flex-1">
                <Text className="text-white text-[17px] font-semibold">Create Class Group</Text>
                <Text className="text-slate-400 text-sm mt-1">Organize multiple classes together</Text>
              </View>

              {/* Chevron */}
              <Ionicons name="chevron-forward" size={24} color="#64748b" />
            </TouchableOpacity>

            {/* Create Class Option */}
            <TouchableOpacity
              onPress={onCreateClass}
              className="flex-row items-center gap-4 p-4 rounded-2xl bg-[#1a262e] border border-transparent active:scale-[0.98]"
            >
              {/* Icon */}
              <View className="w-12 h-12 rounded-xl bg-[#233c48] items-center justify-center">
                <Ionicons name="school" size={28} color="#13a4ec" />
              </View>

              {/* Text */}
              <View className="flex-1">
                <Text className="text-white text-[17px] font-semibold">Create Class</Text>
                <Text className="text-slate-400 text-sm mt-1">A single class for attendance</Text>
              </View>

              {/* Chevron */}
              <Ionicons name="chevron-forward" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View className="h-6" />

          {/* Cancel button */}
          <View className="px-4">
            <TouchableOpacity
              onPress={onCancel}
              className="w-full h-14 items-center justify-center rounded-xl bg-[#233c48] active:bg-[#2d4b5a]"
            >
              <Text className="text-white text-base font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Safe area spacer for devices with notch */}
          <View className="h-4" />
        </View>
      </View>
    </Modal>
  )
}
