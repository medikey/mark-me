"use client"

import { useState } from "react"
import { View, Text, TextInput, ScrollView, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Header } from "@/components/common/Header"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Toast } from "@/components/common/Toast"
import { useToast } from "@/hooks/useToast"
import { pickCSVFile, downloadCSVTemplate } from "@/utils/fileOperations"
import { useApp } from "@/contexts/AppContext"
import type { Student } from "@/interfaces/interface"

export default function CreateClassScreen() {
  const router = useRouter()
  const { classes, setClasses } = useApp()
  const [className, setClassName] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const { toast, hide, success, error } = useToast()

  const handleUploadCSV = async () => {
    try {
      setLoading(true)
      const csvStudents = await pickCSVFile()

      const formattedStudents: Student[] = csvStudents.map((s) => ({
        id: s.studentId,
        name: `${s.firstName} ${s.lastName}`,
        status: "present" as const,
        avatar: `https://i.pravatar.cc/100?u=${s.studentId}`,
      }))

      setStudents(formattedStudents)
      success(`Imported ${formattedStudents.length} students from CSV`)
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to upload CSV")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      setLoading(true)
      await downloadCSVTemplate()
      success("CSV template downloaded")
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to download template")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveClass = () => {
    if (!className.trim()) {
      error("Please enter a class name")
      return
    }

    if (students.length === 0) {
      error("Please add students to the class")
      return
    }

    const newClass = {
      id: `class-${Date.now()}`,
      name: className.trim(),
      section: "New Section",
      time: "TBD",
      room: "TBD",
      studentCount: students.length,
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400",
      students,
      semester: "Current",
    }

    setClasses([...classes, newClass])
    success("Class created successfully")
    setTimeout(() => router.back(), 1000)
  }

  return (
    <View className="flex-1 bg-[#0F1419]">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hide} />

      <Header title="Create New Class" />

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text className="text-sm font-semibold text-white mb-2">Class Name</Text>
        <TextInput
          className="bg-[#192b33] rounded-xl border border-[#325567] px-4 py-4 text-base text-white mb-6"
          placeholder="e.g., Biology 101 - Fall Semester"
          placeholderTextColor="#64748B"
          value={className}
          onChangeText={setClassName}
        />

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-semibold text-white">Student List</Text>
          <View className="bg-[#192b33] px-2 py-1 rounded border border-[#325567]">
            <Text className="text-[10px] font-bold text-[#64748b] tracking-wider">
              {students.length > 0 ? `${students.length} STUDENTS` : "REQUIRED"}
            </Text>
          </View>
        </View>

        <Card className="border-2 border-dashed border-[#325567] p-8 items-center gap-3 mb-4">
          <View className="w-16 h-16 rounded-full bg-[#0F1419] justify-center items-center">
            {loading ? (
              <ActivityIndicator size="large" color="#0EA5E9" />
            ) : (
              <Ionicons name="document" size={32} color="#0EA5E9" />
            )}
          </View>
          <Text className="text-lg font-bold text-white">Upload CSV File</Text>
          <Text className="text-sm text-[#64748b] text-center">
            Tap to browse your files. Supports .csv format only.
          </Text>
          <Button
            title={students.length > 0 ? "Replace File" : "Browse Files"}
            onPress={handleUploadCSV}
            variant="secondary"
            className="mt-2"
            disabled={loading}
          />
        </Card>

        <Button
          title="Download Sample CSV Template"
          onPress={handleDownloadTemplate}
          icon="download-outline"
          variant="ghost"
          className="mb-4"
          disabled={loading}
        />

        <Text className="text-center text-sm font-semibold text-[#64748b] mb-4">OR</Text>

        <Card className="flex-row items-center gap-3 p-4 mb-4" onPress={() => router.push("/add-student/new")}>
          <View className="w-12 h-12 rounded-full bg-[#0F1419] justify-center items-center">
            <Ionicons name="person-add" size={24} color="#0EA5E9" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-white mb-1">Add Students Manually</Text>
            <Text className="text-xs text-[#64748b]">Input student details individually</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#64748B" />
        </Card>

        <Card className="flex-row gap-3 p-4 border border-[#0ea5e9] mb-6">
          <Ionicons name="information-circle" size={20} color="#0EA5E9" />
          <Text className="flex-1 text-xs text-[#94a3b8] leading-relaxed">
            Make sure your CSV includes columns for <Text className="font-bold text-white">Student ID</Text>,{" "}
            <Text className="font-bold text-white">First Name</Text>, and{" "}
            <Text className="font-bold text-white">Last Name</Text>.
          </Text>
        </Card>
      </ScrollView>

      <View className="px-5 pb-8">
        <Button title="Save Class" onPress={handleSaveClass} icon="save" disabled={loading} />
      </View>
    </View>
  )
}
