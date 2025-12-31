"use client"

import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useApp } from "@/contexts/AppContext"
import { Toast } from "@/components/common/Toast"
import { useToast } from "@/hooks/useToast"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useState } from "react"

export default function AddStudentManualScreen() {
  const router = useRouter()
  const { className } = useLocalSearchParams()
  const { classes, setClasses } = useApp()
  const { toast, hide, show } = useToast()

  const [studentName, setStudentName] = useState("")
  const [students, setStudents] = useState<Array<{ id: string; name: string; avatar: string; status: "present" }>>([])

  const handleAddStudent = () => {
    if (!studentName.trim()) {
      show("Please enter a student name", "error")
      return
    }

    // Auto-generate student ID based on timestamp
    const studentId = `ST-${Date.now()}`

    const newStudent = {
      id: studentId,
      name: studentName.trim(),
      avatar: `https://i.pravatar.cc/100?u=${studentId}`,
      status: "present" as const,
    }

    setStudents([...students, newStudent])
    setStudentName("")
    show("Student added successfully", "success")
  }

  const handleRemoveStudent = (studentId: string) => {
    setStudents(students.filter((s) => s.id !== studentId))
    show("Student removed", "success")
  }
  // </CHANGE>

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Get random gradient colors for avatar backgrounds
  const getAvatarColors = (index: number) => {
    const colors = [
      { from: "#dbeafe", to: "#bfdbfe", text: "#13a4ec" }, // blue
      { from: "#e9d5ff", to: "#d8b4fe", text: "#a855f7" }, // purple
      { from: "#d1fae5", to: "#a7f3d0", text: "#10b981" }, // emerald
      { from: "#fef3c7", to: "#fde68a", text: "#f59e0b" }, // amber
    ]
    return colors[index % colors.length]
  }
  // </CHANGE>

  const handleSaveClass = () => {
    if (students.length === 0) {
      show("Please add at least one student", "error")
      return
    }

    const newClass = {
      id: `class-${Date.now()}`,
      name: className as string,
      section: "New Section",
      time: "TBD",
      subject: "General Studies",
      room: "TBD",
      studentCount: students.length,
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400",
      students,
      semester: "Current",
    }

    setClasses([...classes, newClass])
    show("Class created successfully", "success")
    setTimeout(() => router.push("/(tabs)/classes"), 1000)
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-[#101c22]" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hide} />

      <View className="h-12 w-full bg-[#101c22]" />
      <View className="flex-row items-center justify-between px-4 pb-4 bg-[#101c22] border-b border-[#1e293b]">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 -ml-2 items-center justify-center rounded-full active:bg-[#1e293b]"
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-white pr-8">Add Students</Text>
      </View>
      {/* </CHANGE> */}

      <ScrollView className="flex-1 pb-32" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6 bg-[#101c22] border-b border-[#1e293b] mb-6">
          <Text className="text-sm font-medium text-[#94a3b8] mb-2">Student Name</Text>
          <View className="flex-row gap-3">
            <View className="flex-1 relative">
              <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
                <Ionicons name="person" size={20} color="#64748b" />
              </View>
              <TextInput
                className="h-14 pl-10 pr-4 bg-[#192b33] border border-[#325567] rounded-xl text-white placeholder:text-[#92b7c9]"
                value={studentName}
                onChangeText={setStudentName}
                placeholder="Enter full name"
                placeholderTextColor="#64748b"
                onSubmitEditing={handleAddStudent}
                returnKeyType="done"
              />
            </View>
            <TouchableOpacity
              onPress={handleAddStudent}
              className="bg-[#13a4ec] active:bg-[#0ea5e9] rounded-xl px-5 items-center justify-center"
            >
              <Text className="text-white font-bold text-sm">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </CHANGE> */}

        <View className="px-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-white">Class List</Text>
            <View className="bg-[#13a4ec]/20 px-2.5 py-1 rounded-full border border-[#13a4ec]/30">
              <Text className="text-[#13a4ec] text-xs font-bold">{students.length} Students</Text>
            </View>
          </View>

          <View className="space-y-3">
            {students.map((student, index) => {
              const colors = getAvatarColors(index)
              return (
                <View
                  key={student.id}
                  className="flex-row items-center gap-4 p-3 pr-4 rounded-2xl bg-[#192b33] border border-[#325567]/50"
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.from }}
                  >
                    <Text className="font-bold text-sm" style={{ color: colors.text }}>
                      {getInitials(student.name)}
                    </Text>
                  </View>
                  <View className="flex-1 min-w-0">
                    <Text className="text-base font-medium text-white" numberOfLines={1}>
                      {student.name}
                    </Text>
                    <Text className="text-xs text-[#94a3b8]" numberOfLines={1}>
                      ID: {student.id}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveStudent(student.id)}
                    className="w-9 h-9 items-center justify-center rounded-lg active:bg-red-900/20"
                  >
                    <Ionicons name="trash-outline" size={20} color="#94a3b8" />
                  </TouchableOpacity>
                </View>
              )
            })}
          </View>
        </View>
        {/* </CHANGE> */}
      </ScrollView>

      <View className="absolute bottom-0 left-0 w-full p-4 bg-[#101c22]/95 border-t border-[#1e293b]">
        <TouchableOpacity
          onPress={handleSaveClass}
          disabled={students.length === 0}
          className={`w-full h-12 flex-row items-center justify-center gap-2 rounded-xl ${
            students.length === 0 ? "bg-[#334155]" : "bg-[#13a4ec] active:bg-[#0ea5e9]"
          }`}
        >
          <Ionicons name="save-outline" size={20} color="#ffffff" />
          <Text className="text-white font-bold text-base">Save Students</Text>
        </TouchableOpacity>
      </View>
      {/* </CHANGE> */}
    </KeyboardAvoidingView>
  )
}
