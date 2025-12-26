"use client"

import { useState, useEffect } from "react"
import { View, Text, Modal, TouchableOpacity, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { EditStudentModalProps } from "@/interfaces/interface"

export function EditStudentModal({ visible, student, onSave, onCancel }: EditStudentModalProps) {
  const [name, setName] = useState("")

  useEffect(() => {
    if (student) {
      setName(student.name)
    }
  }, [student])

  const handleSave = () => {
    if (!student || !name.trim()) return
    onSave({ ...student, name: name.trim() })
    setName("")
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View className="flex-1 bg-black/70 justify-end">
        <View className="bg-[#1a2730] rounded-t-3xl overflow-hidden">
          <View className="p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-white">Edit Student</Text>
              <TouchableOpacity onPress={onCancel} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-[#94a3b8] mb-2">Student Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter student name"
                placeholderTextColor="#64748B"
                className="bg-[#0F1419] px-4 py-3 rounded-xl text-white"
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-[#0F1419] py-4 rounded-xl items-center"
                onPress={onCancel}
                activeOpacity={0.7}
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-[#13a4ec] py-4 rounded-xl items-center"
                onPress={handleSave}
                activeOpacity={0.7}
                disabled={!name.trim()}
              >
                <Text className="text-white font-semibold">Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
