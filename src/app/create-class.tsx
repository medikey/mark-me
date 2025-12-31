// "use client"

// import { useState } from "react"
// import { View, Text, TextInput, ScrollView, ActivityIndicator } from "react-native"
// import { useRouter } from "expo-router"
// import { Ionicons } from "@expo/vector-icons"
// import { Header } from "@/components/common/Header"
// import { Button } from "@/components/common/Button"
// import { Card } from "@/components/common/Card"
// import { Toast } from "@/components/common/Toast"
// import { useToast } from "@/hooks/useToast"
// import { pickCSVFile, downloadCSVTemplate } from "@/utils/fileOperations"
// import { useApp } from "@/contexts/AppContext"
// import type { Student } from "@/interfaces/interface"

// export default function CreateClassScreen() {
//   const router = useRouter()
//   const { classes, setClasses } = useApp()
//   const [className, setClassName] = useState("")
//   const [students, setStudents] = useState<Student[]>([])
//   const [loading, setLoading] = useState(false)
//   const { toast, hide, success, error } = useToast()

//   const handleUploadCSV = async () => {
//     try {
//       setLoading(true)
//       const csvStudents = await pickCSVFile()

//       const formattedStudents: Student[] = csvStudents.map((s) => ({
//         id: s.studentId,
//         name: `${s.firstName} ${s.lastName}`,
//         status: "present" as const,
//         avatar: `https://i.pravatar.cc/100?u=${s.studentId}`,
//       }))

//       setStudents(formattedStudents)
//       success(`Imported ${formattedStudents.length} students from CSV`)
//     } catch (err) {
//       error(err instanceof Error ? err.message : "Failed to upload CSV")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDownloadTemplate = async () => {
//     try {
//       setLoading(true)
//       await downloadCSVTemplate()
//       success("CSV template downloaded")
//     } catch (err) {
//       error(err instanceof Error ? err.message : "Failed to download template")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSaveClass = () => {
//     if (!className.trim()) {
//       error("Please enter a class name")
//       return
//     }

//     if (students.length === 0) {
//       error("Please add students to the class")
//       return
//     }

//     const newClass = {
//       id: `class-${Date.now()}`,
//       name: className.trim(),
//       subject: "General Studies",
//       section: "New Section",
//       time: "TBD",
//       room: "TBD",
//       studentCount: students.length,
//       image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400",
//       students,
//       semester: "Current",
//     }

//     setClasses([...classes, newClass])
//     success("Class created successfully")
//     setTimeout(() => router.back(), 1000)
//   }

//   return (
//     <View className="flex-1 bg-[#0F1419]">
//       <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hide} />

//       <Header title="Create New Class" />

//       <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
//         <Text className="text-sm font-semibold text-white mb-2">Class Name</Text>
//         <TextInput
//           className="bg-[#192b33] rounded-xl border border-[#325567] px-4 py-4 text-base text-white mb-6"
//           placeholder="e.g., Biology 101 - Fall Semester"
//           placeholderTextColor="#64748B"
//           value={className}
//           onChangeText={setClassName}
//         />

//         <View className="flex-row justify-between items-center mb-2">
//           <Text className="text-sm font-semibold text-white">Student List</Text>
//           <View className="bg-[#192b33] px-2 py-1 rounded border border-[#325567]">
//             <Text className="text-[10px] font-bold text-[#64748b] tracking-wider">
//               {students.length > 0 ? `${students.length} STUDENTS` : "REQUIRED"}
//             </Text>
//           </View>
//         </View>

//         <Card className="border-2 border-dashed border-[#325567] p-8 items-center gap-3 mb-4">
//           <View className="w-16 h-16 rounded-full bg-[#0F1419] justify-center items-center">
//             {loading ? (
//               <ActivityIndicator size="large" color="#0EA5E9" />
//             ) : (
//               <Ionicons name="document" size={32} color="#0EA5E9" />
//             )}
//           </View>
//           <Text className="text-lg font-bold text-white">Upload CSV File</Text>
//           <Text className="text-sm text-[#64748b] text-center">
//             Tap to browse your files. Supports .csv format only.
//           </Text>
//           <Button
//             title={students.length > 0 ? "Replace File" : "Browse Files"}
//             onPress={handleUploadCSV}
//             variant="secondary"
//             className="mt-2"
//             disabled={loading}
//           />
//         </Card>

//         <Button
//           title="Download Sample CSV Template"
//           onPress={handleDownloadTemplate}
//           icon="download-outline"
//           variant="ghost"
//           className="mb-4"
//           disabled={loading}
//         />

//         <Text className="text-center text-sm font-semibold text-[#64748b] mb-4">OR</Text>

//         <Card className="flex-row items-center gap-3 p-4 mb-4" onPress={() => router.push("/add-student/new")}>
//           <View className="w-12 h-12 rounded-full bg-[#0F1419] justify-center items-center">
//             <Ionicons name="person-add" size={24} color="#0EA5E9" />
//           </View>
//           <View className="flex-1">
//             <Text className="text-base font-bold text-white mb-1">Add Students Manually</Text>
//             <Text className="text-xs text-[#64748b]">Input student details individually</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={20} color="#64748B" />
//         </Card>

//         <Card className="flex-row gap-3 p-4 border border-[#0ea5e9] mb-6">
//           <Ionicons name="information-circle" size={20} color="#0EA5E9" />
//           <Text className="flex-1 text-xs text-[#94a3b8] leading-relaxed">
//             Make sure your CSV includes columns for <Text className="font-bold text-white">Student ID</Text>,{" "}
//             <Text className="font-bold text-white">First Name</Text>, and{" "}
//             <Text className="font-bold text-white">Last Name</Text>.
//           </Text>
//         </Card>
//       </ScrollView>

//       <View className="px-5 pb-8">
//         <Button title="Save Class" onPress={handleSaveClass} icon="save" disabled={loading} />
//       </View>
//     </View>
//   )
// }
"use client"

import { useState } from "react"
import { View, Text, TextInput, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
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
  const { toast, hide, show } = useToast()

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

  const handleAddManually = () => {
    if (!className.trim()) {
      show("Please enter a class name first", "error")
      return
    }

    // Create a temporary class ID to use for adding students
    const tempClassId = `class-${Date.now()}`

    // Store the temporary class data in a way we can retrieve it
    router.push({
      pathname: "/add-student-manual",
      params: { className: className.trim(), tempId: tempClassId },
    })
  }

  const handleSaveClass = () => {
    if (!className.trim()) {
      show("Please enter a class name", "error")
      return
    }

    if (students.length === 0) {
      show("Please add students to the class", "error")
      return
    }

    const newClass = {
      id: `class-${Date.now()}`,
      name: className.trim(),
      section: "New Section",
      subject: "General Studies",
      time: "TBD",
      room: "TBD",
      studentCount: students.length,
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400",
      students,
      semester: "Current",
    }

    setClasses([...classes, newClass])
    show("Class created successfully", "success")
    setTimeout(() => router.back(), 1000)
  }

  return (
    <View className="flex-1 bg-[#101c22]">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hide} />

      <View className="h-12 w-full bg-[#101c22]" />
      <View className="flex-row items-center justify-between px-4 pb-4 bg-[#101c22]">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-[#1a2730]"
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-white pr-10">Create New Class</Text>
      </View>

      <ScrollView className="flex-1 px-5 py-2" showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="text-sm font-medium text-[#cbd5e1] mb-2 ml-1">Class Name</Text>
          <View className="relative">
            <TextInput
              className="bg-[#192b33] rounded-xl border border-[#334155] px-4 h-14 text-base text-white"
              placeholder="e.g., Biology 101 - Fall Semester"
              placeholderTextColor="#64748b"
              value={className}
              onChangeText={setClassName}
            />
            <View className="absolute right-4 top-0 bottom-0 justify-center">
              <Ionicons name="create-outline" size={20} color="#64748b" />
            </View>
          </View>
        </View>

        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-2 ml-1">
            <Text className="text-sm font-medium text-[#cbd5e1]">Student List</Text>
            <View className="bg-[#1e293b] px-2 py-1 rounded">
              <Text className="text-[10px] font-bold text-[#64748b] tracking-widest uppercase">Required</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleUploadCSV}
            disabled={loading}
            activeOpacity={0.7}
            className="border-2 border-dashed border-[#334155] bg-[#192b33] rounded-2xl px-6 py-10 items-center mb-5"
          >
            <View className="w-14 h-14 rounded-full bg-[#13a4ec]/10 items-center justify-center mb-4">
              {loading ? (
                <ActivityIndicator size="large" color="#13a4ec" />
              ) : (
                <Ionicons name="cloud-upload-outline" size={28} color="#13a4ec" />
              )}
            </View>
            <Text className="text-base font-bold text-white text-center mb-1">Upload CSV File</Text>
            <Text className="text-sm text-[#64748b] text-center max-w-[240px] leading-5 mb-6">
              Tap to browse your files. Supports .csv format only.
            </Text>
            <View className="bg-[#1e293b] px-4 py-2.5 rounded-lg">
              <Text className="text-sm font-semibold text-white">Browse Files</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDownloadTemplate}
            disabled={loading}
            className="flex-row items-center justify-center gap-1.5 mb-5"
          >
            <Ionicons name="download-outline" size={18} color="#13a4ec" />
            <Text className="text-sm font-medium text-[#13a4ec] underline">Download Sample CSV Template</Text>
          </TouchableOpacity>

          <View className="flex-row items-center mb-5">
            <View className="flex-1 h-px bg-[#334155]" />
            <Text className="mx-4 text-xs font-bold text-[#64748b] uppercase tracking-widest">Or</Text>
            <View className="flex-1 h-px bg-[#334155]" />
          </View>

          <TouchableOpacity
            onPress={handleAddManually}
            activeOpacity={0.7}
            className="flex-row items-center justify-between rounded-2xl border-2 border-[#334155] bg-[#192b33] px-5 py-4"
          >
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-full bg-[#13a4ec]/10 items-center justify-center">
                <Ionicons name="person-add-outline" size={24} color="#13a4ec" />
              </View>
              <View>
                <Text className="text-base font-bold text-white leading-tight">Add Students Manually</Text>
                <Text className="text-sm text-[#64748b] mt-0.5">Input student details individually</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View className="rounded-xl bg-[#15232d] p-4 flex-row gap-3 items-start border border-[#1e3a4a] mb-32">
          <Ionicons name="information-circle-outline" size={20} color="#13a4ec" className="mt-0.5" />
          <Text className="flex-1 text-sm text-[#94a3b8] leading-5">
            Make sure your CSV includes columns for <Text className="font-medium text-white">Student ID</Text>,{" "}
            <Text className="font-medium text-white">First Name</Text>, and{" "}
            <Text className="font-medium text-white">Last Name</Text>.
          </Text>
        </View>
      </ScrollView>

      <View className="px-5 py-5 bg-[#101c22]/90 border-t border-[#1e293b]">
        <TouchableOpacity
          onPress={handleSaveClass}
          disabled={loading}
          className="w-full h-14 flex-row items-center justify-center gap-2 rounded-xl bg-[#13a4ec] active:bg-[#0ea5e9] shadow-lg"
        >
          <Ionicons name="save-outline" size={20} color="#ffffff" />
          <Text className="text-base font-bold text-white tracking-wide">Save Class</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
