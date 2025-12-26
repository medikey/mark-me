"use client"

import { useState, useEffect } from "react"
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { EditClassModalProps } from "@/interfaces/interface"

export function EditClassModal({ visible, classItem, onSave, onCancel }: EditClassModalProps) {
  const [name, setName] = useState("")
  const [section, setSection] = useState("")
  const [time, setTime] = useState("")
  const [room, setRoom] = useState("")

  useEffect(() => {
    if (classItem) {
      setName(classItem.name)
      setSection(classItem.section)
      setTime(classItem.time)
      setRoom(classItem.room)
    }
  }, [classItem])

  const handleSave = () => {
    if (!classItem || !name.trim()) return
    onSave({
      name: name.trim(),
      section: section.trim(),
      time: time.trim(),
      room: room.trim(),
    })
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setSection("")
    setTime("")
    setRoom("")
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View className="flex-1 bg-black/70 justify-end">
        <View className="bg-[#1a2730] rounded-t-3xl overflow-hidden max-h-[80%]">
          <View className="p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-white">Edit Class</Text>
              <TouchableOpacity onPress={onCancel} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="text-sm font-semibold text-[#94a3b8] mb-2">Class Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g., Advanced Mathematics"
                  placeholderTextColor="#64748B"
                  className="bg-[#0F1419] px-4 py-3 rounded-xl text-white"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-[#94a3b8] mb-2">Section</Text>
                <TextInput
                  value={section}
                  onChangeText={setSection}
                  placeholder="e.g., Section A"
                  placeholderTextColor="#64748B"
                  className="bg-[#0F1419] px-4 py-3 rounded-xl text-white"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-[#94a3b8] mb-2">Time</Text>
                <TextInput
                  value={time}
                  onChangeText={setTime}
                  placeholder="e.g., Mon, Wed, Fri 10:00 AM"
                  placeholderTextColor="#64748B"
                  className="bg-[#0F1419] px-4 py-3 rounded-xl text-white"
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-semibold text-[#94a3b8] mb-2">Room</Text>
                <TextInput
                  value={room}
                  onChangeText={setRoom}
                  placeholder="e.g., Room 203"
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
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  )
}
