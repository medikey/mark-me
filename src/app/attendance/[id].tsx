"use client"

import { View, Text, ScrollView, TouchableOpacity, Image, Switch } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useApp } from "@/contexts/AppContext"
import { Toast } from "@/components/common/Toast"
import { useToast } from "@/hooks/useToast"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useState, useEffect } from "react"

export default function AttendanceScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { classes, updateStudent } = useApp()
  const { toast, hide, success } = useToast()

  const classItem = classes.find((c) => c.id === id)
  const [attendanceState, setAttendanceState] = useState<Record<string, boolean>>({})
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (classItem) {
      const initialState: Record<string, boolean> = {}
      classItem.students.forEach((student) => {
        initialState[student.id] = student.status === "present"
      })
      setAttendanceState(initialState)
    }
  }, [classItem])

  if (!classItem) {
    return (
      <View className="flex-1 justify-center items-center bg-[#101c22]">
        <Text className="text-white">Class not found</Text>
      </View>
    )
  }

  const presentCount = Object.values(attendanceState).filter((isPresent) => isPresent).length
  const absentCount = classItem.students.length - presentCount

  const toggleAttendance = (studentId: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }))
    setHasChanges(true)
  }

  const markAllPresent = () => {
    const newState: Record<string, boolean> = {}
    classItem.students.forEach((student) => {
      newState[student.id] = true
    })
    setAttendanceState(newState)
    setHasChanges(true)
  }

  const markAllAbsent = () => {
    const newState: Record<string, boolean> = {}
    classItem.students.forEach((student) => {
      newState[student.id] = false
    })
    setAttendanceState(newState)
    setHasChanges(true)
  }

  const handleSaveAttendance = () => {
    classItem.students.forEach((student) => {
      const newStatus = attendanceState[student.id] ? "present" : "absent"
      if (student.status !== newStatus) {
        updateStudent(classItem.id, student.id, { status: newStatus })
      }
    })
    setHasChanges(false)
    success("Attendance saved successfully")
  }

  const handleDownload = () => {
    success("Attendance list downloaded")
  }

  const handleGradeClass = () => {
    router.push(`/grade-students/${id}`)
  }

  return (
    <View className="flex-1 bg-[#101c22]">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hide} />

      <View className="flex-row items-center justify-between px-4 pt-16 pb-3 bg-[#101c22] border-b border-[#325567]/30">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-white/10"
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-lg font-bold text-white">{classItem.name}</Text>
          <Text className="text-xs font-medium text-[#92b7c9]">{classItem.subject}</Text>
        </View>
        <Text className="text-sm font-bold text-[#13a4ec]">
          {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </Text>
      </View>

      <View className="px-4 py-3">
        <View className="flex-row gap-3">
          <View className="flex-1 flex-row items-center gap-3 rounded-xl border border-[#325567] bg-[#192b33] p-3">
            <View className="w-10 h-10 items-center justify-center rounded-full bg-green-500/20">
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            </View>
            <View>
              <Text className="text-base font-bold text-white">{presentCount}</Text>
              <Text className="text-xs font-medium text-[#92b7c9]">Present</Text>
            </View>
          </View>
          <View className="flex-1 flex-row items-center gap-3 rounded-xl border border-[#325567] bg-[#192b33] p-3">
            <View className="w-10 h-10 items-center justify-center rounded-full bg-red-500/20">
              <Ionicons name="close-circle" size={24} color="#EF4444" />
            </View>
            <View>
              <Text className="text-base font-bold text-white">{absentCount}</Text>
              <Text className="text-xs font-medium text-[#92b7c9]">Absent</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="px-4 pb-2 flex-col gap-3">
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={markAllPresent}
            className="flex-1 h-10 items-center justify-center rounded-lg bg-[#233c48] active:bg-[#2f4d5b]"
          >
            <Text className="text-sm font-bold text-white">Mark All Present</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={markAllAbsent}
            className="flex-1 h-10 items-center justify-center rounded-lg bg-[#233c48] active:bg-[#2f4d5b]"
          >
            <Text className="text-sm font-bold text-white">Mark All Absent</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleDownload}
          className="flex-row items-center justify-center gap-2 h-10 rounded-lg border border-[#325567] bg-[#192b33] active:bg-white/5"
        >
          <Ionicons name="download-outline" size={20} color="#ffffff" />
          <Text className="text-sm font-bold text-white">Download Attendance List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleGradeClass}
          className="flex-row items-center justify-center gap-2 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 active:bg-indigo-500/20"
        >
          <Ionicons name="school-outline" size={20} color="#a78bfa" />
          <Text className="text-sm font-bold text-[#a78bfa]">Grade Class</Text>
        </TouchableOpacity>
      </View>

      <View className="px-4 py-2">
        <Text className="text-sm font-semibold text-[#92b7c9] uppercase tracking-wider">Student List</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="flex-col gap-1 pb-32">
          {classItem.students.map((student) => {
            const isPresent = attendanceState[student.id] ?? student.status === "present"
            return (
              <View
                key={student.id}
                className="flex-row items-center gap-4 rounded-xl border border-transparent hover:border-[#325567] bg-[#192b33] p-3"
              >
                <View className="flex-1 flex-row items-center gap-3">
                  {student.avatar ? (
                    <Image
                      source={{ uri: student.avatar }}
                      className="w-12 h-12 rounded-full border-2 border-[#325567]"
                    />
                  ) : (
                    <View className="w-12 h-12 rounded-full border-2 border-[#325567] bg-slate-700 items-center justify-center">
                      <Text className="text-sm font-bold text-slate-300">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </Text>
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="text-base font-bold text-white">{student.name}</Text>
                    <Text className="text-xs text-[#92b7c9]">ID: {student.id}</Text>
                  </View>
                </View>
                <View className="flex-col items-center gap-1">
                  <Switch
                    value={isPresent}
                    onValueChange={() => toggleAttendance(student.id)}
                    trackColor={{ false: "#233c48", true: "#13a4ec" }}
                    thumbColor="#ffffff"
                  />
                  <Text className={`text-[10px] font-bold ${isPresent ? "text-[#13a4ec]" : "text-[#92b7c9]"}`}>
                    {isPresent ? "Present" : "Absent"}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>

      <View className="px-4 py-4 bg-[#101c22]/95 border-t border-white/10">
        <TouchableOpacity
          onPress={handleSaveAttendance}
          disabled={!hasChanges}
          className={`h-14 w-full flex-row items-center justify-center gap-2 rounded-xl ${
            hasChanges ? "bg-[#13a4ec] active:bg-[#0e8fd1]" : "bg-[#233c48]"
          }`}
        >
          <Ionicons name="save-outline" size={24} color="#ffffff" />
          <Text className="text-lg font-bold text-white">Save Attendance</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
