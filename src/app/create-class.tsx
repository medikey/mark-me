"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { Toast } from "@/components/common/Toast"
import { useToast } from "@/hooks/useToast"
import { pickCSVFile, downloadCSVTemplate } from "@/utils/fileOperations"
import { useApp } from "@/contexts/AppContext"
import { classesService } from "@/../services/appwrite-classes"
import type { Student, Class } from "@/interfaces/interface"

export default function CreateClassScreen() {
  const router = useRouter()
  const { classes, setClasses } = useApp()

  const [className, setClassName] = useState("")
  const [subject, setSubject] = useState("")
  const [classTime, setClassTime] = useState("")
  const [location, setLocation] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)

  const { toast, hide, show } = useToast()

  /* ---------------- CSV HANDLERS ---------------- */
  const handleUploadCSV = async () => {
    try {
      setLoading(true)
      const csvStudents = await pickCSVFile()
      const formattedStudents: Student[] = csvStudents.map((s) => ({
        id: s.studentId,
        name: `${s.firstName} ${s.lastName}`,
        status: "present",
        avatar: `https://i.pravatar.cc/100?u=${s.studentId}`,
      }))
      setStudents(formattedStudents)
      show(`Imported ${formattedStudents.length} students from CSV`, "success")
    } catch (err) {
      show(err instanceof Error ? err.message : "Failed to upload CSV", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      setLoading(true)
      await downloadCSVTemplate()
      show("CSV template downloaded", "success")
    } catch (err) {
      show(err instanceof Error ? err.message : "Failed to download template", "error")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- SAVE CLASS ---------------- */
  const handleSaveClass = async () => {
    if (!className.trim()) return show("Please enter a class name", "error")
    if (!subject.trim()) return show("Please enter a subject", "error")
    if (students.length === 0) return show("Please add students to the class", "error")

    try {
      setLoading(true)

      // Safely set parentGroupId to string or null
      const parentGroupId: string | null = typeof (students[0]?.parentGroupId) === "string"
        ? students[0].parentGroupId
        : null

      const classPayload: Omit<Class, "id"> = {
        name: className.trim(),
        subject: subject.trim(),
        time: classTime.trim(),
        room: location.trim(),
        studentCount: students.length,
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400",
        semester: "Current",
        students,
        gradingCriteria: [],
        assignments: [],
        parentGroupId,
      }

      const createdClass = await classesService.createClass(classPayload)

      setClasses([...classes, createdClass])
      show("Class created successfully", "success")
      router.back()
    } catch (error) {
      console.error(error)
      show("Failed to create class", "error")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- UI ---------------- */
  return (
    <View className="flex-1 bg-[#101c22]">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hide} />

      <View className="h-12 w-full bg-[#101c22]" />

      <View className="flex-row items-center justify-between px-4 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full"
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-white pr-10">
          Create New Class
        </Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Input label="Class Name" placeholder="e.g., Biology 101" value={className} onChangeText={setClassName} icon="create-outline" />
        <Input label="Subject" placeholder="e.g., Biology" value={subject} onChangeText={setSubject} icon="book-outline" />
        <Input label="Class Time" placeholder="Mon, Wed 10am" value={classTime} onChangeText={setClassTime} icon="time-outline" />
        <Input label="Location" placeholder="Room 203" value={location} onChangeText={setLocation} icon="location-outline" />

        <TouchableOpacity onPress={handleUploadCSV} disabled={loading} className="border-2 border-dashed border-[#334155] bg-[#192b33] rounded-2xl px-6 py-10 items-center mb-5">
          {loading ? <ActivityIndicator size="large" color="#13a4ec" /> : <>
            <Ionicons name="cloud-upload-outline" size={28} color="#13a4ec" />
            <Text className="text-white mt-3 font-bold">Upload CSV File</Text>
          </>}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDownloadTemplate} disabled={loading} className="flex-row items-center justify-center gap-2 mb-24">
          <Ionicons name="download-outline" size={18} color="#13a4ec" />
          <Text className="text-[#13a4ec]">Download CSV Template</Text>
        </TouchableOpacity>
      </ScrollView>

      <View className="px-5 py-5 border-t border-[#1e293b]">
        <TouchableOpacity onPress={handleSaveClass} disabled={loading} className="w-full h-14 flex-row items-center justify-center gap-2 rounded-xl bg-[#13a4ec]">
          {loading ? <ActivityIndicator color="#fff" /> : <>
            <Ionicons name="save-outline" size={20} color="#fff" />
            <Text className="text-white font-bold">Save Class</Text>
          </>}
        </TouchableOpacity>
      </View>
    </View>
  )
}

/* ---------------- REUSABLE INPUT ---------------- */
function Input({ label, icon, ...props }: { label: string, icon: keyof typeof Ionicons.glyphMap, value: string, placeholder: string, onChangeText: (v: string) => void }) {
  return (
    <View className="mb-6">
      <Text className="text-sm font-medium text-[#cbd5e1] mb-2 ml-1">{label}</Text>
      <View className="relative">
        <TextInput className="bg-[#192b33] rounded-xl border border-[#334155] px-4 h-14 text-base text-white" placeholderTextColor="#64748b" {...props} />
        <View className="absolute right-4 top-0 bottom-0 justify-center">
          <Ionicons name={icon} size={20} color="#64748b" />
        </View>
      </View>
    </View>
  )
}
