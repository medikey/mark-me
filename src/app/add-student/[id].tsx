"use client"

import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useApp } from "@/contexts/AppContext"
import { Toast } from "@/components/common/Toast"
import { useToast } from "@/hooks/useToast"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useState } from "react"

export default function AddStudentScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { classes, addStudent } = useApp()
  const { toast, hide, success, error } = useToast()

  const [studentName, setStudentName] = useState("")
  const [studentId, setStudentId] = useState("")

  const classItem = classes.find((c) => c.id === id)

  if (!classItem) {
    return (
      <View className="flex-1 justify-center items-center bg-[#101c22]">
        <Text className="text-white">Class not found</Text>
      </View>
    )
  }

  const handleAddStudent = () => {
    if (!studentName.trim()) {
      error("Please enter a student name")
      return
    }

    if (!studentId.trim()) {
      error("Please enter a student ID")
      return
    }

    // Check if student ID already exists
    const existingStudent = classItem.students.find((s) => s.id === studentId.trim())
    if (existingStudent) {
      error("A student with this ID already exists")
      return
    }

    const newStudent = {
      id: studentId.trim(),
      name: studentName.trim(),
      avatar: "",
      status: "present" as const,
    }

    addStudent(classItem.id, newStudent)
    success("Student added successfully")
    router.back()
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-[#101c22]" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hide} />

      <View className="flex-row justify-between items-center px-4 pt-16 pb-4 bg-[#101c22]/90">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-[#1a2730]"
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-white">Add Student</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <View className="bg-[#192b33] border border-[#325567] rounded-2xl p-6 mb-6">
            <View className="items-center mb-6">
              <View className="w-20 h-20 rounded-full bg-[#13a4ec]/10 items-center justify-center mb-3">
                <Ionicons name="person-add" size={36} color="#13a4ec" />
              </View>
              <Text className="text-base text-[#8b9faa]">Add to {classItem.name}</Text>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-2 text-[#8b9faa]">Student Name</Text>
              <TextInput
                className="h-14 px-4 text-base text-white bg-[#0F1419] border border-[#325567] rounded-xl focus:outline-none"
                value={studentName}
                onChangeText={setStudentName}
                placeholder="Enter full name"
                placeholderTextColor="#64748b"
                autoFocus
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-2 text-[#8b9faa]">Student ID</Text>
              <TextInput
                className="h-14 px-4 text-base text-white bg-[#0F1419] border border-[#325567] rounded-xl focus:outline-none"
                value={studentId}
                onChangeText={setStudentId}
                placeholder="Enter student ID"
                placeholderTextColor="#64748b"
              />
            </View>
          </View>

          <View className="bg-[#192b33] border border-[#325567] rounded-2xl p-4">
            <View className="flex-row items-start gap-3">
              <View className="w-8 h-8 rounded-full bg-[#13a4ec]/10 items-center justify-center mt-0.5">
                <Ionicons name="information" size={16} color="#13a4ec" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-white mb-1">Quick Add</Text>
                <Text className="text-xs text-[#8b9faa] leading-5">
                  This is for adding individual students. To add multiple students at once, use the Import Data feature
                  from the class details screen.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-4 py-4 bg-[#101c22]/95 border-t border-white/10">
        <TouchableOpacity
          onPress={handleAddStudent}
          className="h-12 w-full items-center justify-center rounded-xl bg-[#13a4ec] active:bg-[#13a4ec]/90"
        >
          <Text className="text-base font-bold text-white">Add Student</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
