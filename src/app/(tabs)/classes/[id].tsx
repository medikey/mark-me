// "use client"

// import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
// import { useRouter, useLocalSearchParams } from "expo-router"
// import { useApp } from "@/contexts/AppContext"
// import { Button } from "@/components/common/Button"
// import { StudentCard } from "@/components/students/StudentCard"
// import { StatsCard } from "@/components/stats/StatsCard"
// import { Toast } from "@/components/common/Toast"
// import { ConfirmModal } from "@/components/common/ConfirmModal"
// import { EditStudentModal } from "@/components/modals/EditStudentModal"
// import { EditClassModal } from "@/components/modals/EditClassModal"
// import { useToast } from "@/hooks/useToast"
// import { downloadAttendanceCSV } from "@/utils/fileOperations"
// import type { Student, Class } from "@/interfaces/interface"
// import Ionicons from "@expo/vector-icons/Ionicons"
// import { useState } from "react"

// export default function ClassDetailScreen() {
//   const router = useRouter()
//   const { id } = useLocalSearchParams()
//   const {
//     classes,
//     updateStudentStatus,
//     setClasses,
//     deleteClass,
//     updateClass,
//     updateStudent,
//     deleteStudent,
//     saveAttendanceRecord,
//     userProfile,
//   } = useApp()
//   const [downloading, setDownloading] = useState(false)
//   const { toast, hide, success, error } = useToast()

//   const [showDeleteClassModal, setShowDeleteClassModal] = useState(false)
//   const [showEditClassModal, setShowEditClassModal] = useState(false)
//   const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false)
//   const [showEditStudentModal, setShowEditStudentModal] = useState(false)
//   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
//   const [showOptionsId, setShowOptionsId] = useState<string | null>(null)

//   const classItem = classes.find((c) => c.id === id)

//   if (!classItem) {
//     return (
//       <View className="flex-1 justify-center items-center bg-[#101c22]">
//         <Text className="text-white">Class not found</Text>
//       </View>
//     )
//   }

//   const presentCount = classItem.students.filter((s) => s.status === "present").length
//   const absentCount = classItem.students.filter((s) => s.status === "absent").length

//   const handleMarkAllPresent = () => {
//     setClasses((prev) =>
//       prev.map((c) =>
//         c.id === classItem.id
//           ? {
//               ...c,
//               students: c.students.map((s) => ({ ...s, status: "present" as const })),
//             }
//           : c,
//       ),
//     )
//     success("All students marked as present")
//   }

//   const handleMarkAllAbsent = () => {
//     setClasses((prev) =>
//       prev.map((c) =>
//         c.id === classItem.id
//           ? {
//               ...c,
//               students: c.students.map((s) => ({ ...s, status: "absent" as const })),
//             }
//           : c,
//       ),
//     )
//     success("All students marked as absent")
//   }

//   const handleDownloadAttendance = async () => {
//     try {
//       setDownloading(true)
//       const today = new Date().toLocaleDateString()
//       await downloadAttendanceCSV(classItem.name, classItem.students, today)
//       success("Attendance downloaded successfully")
//     } catch (err) {
//       error(err instanceof Error ? err.message : "Failed to download attendance")
//     } finally {
//       setDownloading(false)
//     }
//   }

//   const handleSaveAttendance = () => {
//     const today = new Date().toISOString().split("T")[0]
//     saveAttendanceRecord(classItem.id, today)
//     success("Attendance saved successfully")
//   }

//   const handleViewHistory = () => {
//     router.push(`/attendance-history/${id}`)
//   }

//   const handleDeleteClass = () => {
//     deleteClass(classItem.id)
//     success("Class deleted successfully")
//     router.back()
//   }

//   const handleEditClass = (updates: Partial<Class>) => {
//     updateClass(classItem.id, updates)
//     setShowEditClassModal(false)
//     success("Class updated successfully")
//   }

//   const handleEditStudent = (student: Student) => {
//     updateStudent(classItem.id, student.id, { name: student.name })
//     setShowEditStudentModal(false)
//     setSelectedStudent(null)
//     success("Student updated successfully")
//   }

//   const handleDeleteStudent = () => {
//     if (selectedStudent) {
//       deleteStudent(classItem.id, selectedStudent.id)
//       setShowDeleteStudentModal(false)
//       setSelectedStudent(null)
//       success("Student removed successfully")
//     }
//   }

//   return (
//     <View className="flex-1 bg-[#101c22]">
//       <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hide} />

//       <ConfirmModal
//         visible={showDeleteClassModal}
//         title="Delete Class"
//         message="Are you sure you want to delete this class? This action cannot be undone."
//         confirmText="Delete"
//         cancelText="Cancel"
//         variant="danger"
//         onConfirm={handleDeleteClass}
//         onCancel={() => setShowDeleteClassModal(false)}
//       />

//       <EditClassModal
//         visible={showEditClassModal}
//         classItem={classItem}
//         onSave={handleEditClass}
//         onCancel={() => setShowEditClassModal(false)}
//       />

//       <ConfirmModal
//         visible={showDeleteStudentModal}
//         title="Remove Student"
//         message={`Are you sure you want to remove ${selectedStudent?.name} from this class?`}
//         confirmText="Remove"
//         cancelText="Cancel"
//         variant="danger"
//         onConfirm={handleDeleteStudent}
//         onCancel={() => {
//           setShowDeleteStudentModal(false)
//           setSelectedStudent(null)
//         }}
//       />

//       <EditStudentModal
//         visible={showEditStudentModal}
//         student={selectedStudent}
//         onSave={handleEditStudent}
//         onCancel={() => {
//           setShowEditStudentModal(false)
//           setSelectedStudent(null)
//         }}
//       />

//       <View className="flex-row justify-between items-center px-5 pt-15 pb-5">
//         <View className="flex-row items-center gap-3">
//           <Image source={{ uri: userProfile.avatar }} className="w-10 h-10 rounded-full" />
//           <Text className="text-2xl font-bold text-white">{classItem.name}</Text>
//         </View>
//         <TouchableOpacity>
//           <Ionicons name="search" size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
//         <View className="flex-row gap-3 mb-4">
//           <StatsCard
//             icon="checkmark-circle"
//             iconColor="#10B981"
//             borderColor="#10B981"
//             value={presentCount}
//             label="Present"
//           />
//           <StatsCard icon="close-circle" iconColor="#EF4444" borderColor="#EF4444" value={absentCount} label="Absent" />
//         </View>

//         <View className="flex-row gap-3 mb-4">
//           <Button title="Mark All Present" onPress={handleMarkAllPresent} variant="secondary" className="flex-1" />
//           <Button title="Mark All Absent" onPress={handleMarkAllAbsent} variant="secondary" className="flex-1" />
//         </View>

//         <Button
//           title="View Attendance History"
//           onPress={handleViewHistory}
//           icon="calendar-outline"
//           variant="secondary"
//           className="mb-3"
//         />

//         <Button
//           title="Download Attendance List"
//           onPress={handleDownloadAttendance}
//           icon="download-outline"
//           variant="secondary"
//           className="mb-3"
//           loading={downloading}
//           disabled={downloading}
//         />
//         <Button
//           title="Grade Class"
//           onPress={() => router.push(`/grade-students/${id}`)}
//           icon="star"
//           variant="secondary"
//           className="mb-6"
//         />

//         <Text className="text-xs font-bold tracking-wider mb-4 text-[#8b9faa]">STUDENT LIST</Text>

//         {classItem.students.map((student) => (
//           <StudentCard
//             key={student.id}
//             student={student}
//             onToggleStatus={() => {
//               const newStatus = student.status === "present" ? "absent" : "present"
//               updateStudentStatus(classItem.id, student.id, newStatus)
//             }}
//             showActions={true}
//             onEdit={() => {
//               setSelectedStudent(student)
//               setShowEditStudentModal(true)
//             }}
//             onDelete={() => {
//               setSelectedStudent(student)
//               setShowDeleteStudentModal(true)
//             }}
//           />
//         ))}
//       </ScrollView>

//       <View className="px-5 pb-8">
//         <Button title="Save Attendance" onPress={handleSaveAttendance} icon="save" />
//       </View>
//     </View>
//   )
// }
"use client"

import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useApp } from "@/contexts/AppContext"
import { Toast } from "@/components/common/Toast"
import { ConfirmModal } from "@/components/common/ConfirmModal"
import { EditStudentModal } from "@/components/modals/EditStudentModal"
import { useToast } from "@/hooks/useToast"
import type { Student } from "@/interfaces/interface"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useState } from "react"

export default function ClassDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { classes, setClasses, deleteClass, updateClass, updateStudent, deleteStudent } = useApp()
  const { toast, hide, success, error } = useToast()

  const [showDeleteClassModal, setShowDeleteClassModal] = useState(false)
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false)
  const [showEditStudentModal, setShowEditStudentModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [className, setClassName] = useState("")
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null)

  const classItem = classes.find((c) => c.id === id)

  if (classItem) {
    setClassName(classItem.name)
  }

  if (!classItem) {
    return (
      <View className="flex-1 justify-center items-center bg-[#101c22]">
        <Text className="text-white">Class not found</Text>
      </View>
    )
  }

  const handleDeleteClass = () => {
    deleteClass(classItem.id)
    success("Class deleted successfully")
    router.back()
  }

  const handleEditStudent = (student: Student) => {
    updateStudent(classItem.id, student.id, { name: student.name })
    setShowEditStudentModal(false)
    setSelectedStudent(null)
    success("Student updated successfully")
  }

  const handleDeleteStudent = () => {
    if (selectedStudent) {
      deleteStudent(classItem.id, selectedStudent.id)
      setShowDeleteStudentModal(false)
      setSelectedStudent(null)
      success("Student removed successfully")
    }
  }

  const handleSaveChanges = () => {
    if (className.trim() && className !== classItem.name) {
      updateClass(classItem.id, { name: className.trim() })
      success("Class name updated successfully")
    } else {
      success("Changes saved successfully")
    }
  }

  return (
    <View className="flex-1 bg-[#101c22]">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hide} />

      <ConfirmModal
        visible={showDeleteClassModal}
        title="Delete Class"
        message="Are you sure you want to delete this class? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteClass}
        onCancel={() => setShowDeleteClassModal(false)}
      />

      <ConfirmModal
        visible={showDeleteStudentModal}
        title="Remove Student"
        message={`Are you sure you want to remove ${selectedStudent?.name} from this class?`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteStudent}
        onCancel={() => {
          setShowDeleteStudentModal(false)
          setSelectedStudent(null)
        }}
      />

      <EditStudentModal
        visible={showEditStudentModal}
        student={selectedStudent}
        onSave={handleEditStudent}
        onCancel={() => {
          setShowEditStudentModal(false)
          setSelectedStudent(null)
        }}
      />

      <View className="flex-row justify-between items-center px-4 pt-16 pb-4 bg-[#101c22]/90">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-[#1a2730]"
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-white">Class Details</Text>
        <TouchableOpacity
          onPress={() => setShowDeleteClassModal(true)}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-red-500/10"
        >
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-3">
          <Text className="text-sm font-medium mb-2 text-[#8b9faa]">Class Name</Text>
          <View className="flex-row items-center bg-[#192b33] border border-[#325567] rounded-xl overflow-hidden">
            <TextInput
              className="flex-1 h-14 px-4 text-base text-white"
              value={className}
              onChangeText={setClassName}
              placeholder="Enter class name"
              placeholderTextColor="#64748b"
            />
            <View className="w-14 h-14 items-center justify-center">
              <Ionicons name="create-outline" size={20} color="#13a4ec" />
            </View>
          </View>
        </View>

        <View className="p-4">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push(`/add-student/${id}`)}
              className="flex-1 flex-col items-center justify-center gap-2 bg-[#192b33] border border-dashed border-[#325567] rounded-xl p-4 active:opacity-80"
            >
              <View className="w-10 h-10 items-center justify-center rounded-full bg-[#13a4ec]/10">
                <Ionicons name="add" size={24} color="#13a4ec" />
              </View>
              <Text className="text-xs font-bold text-white">Add Student</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push(`/import-data/${id}`)}
              className="flex-1 flex-col items-center justify-center gap-2 bg-[#192b33] border border-[#325567] rounded-xl p-4 active:opacity-80"
            >
              <View className="w-10 h-10 items-center justify-center rounded-full bg-white/5">
                <Ionicons name="cloud-upload-outline" size={24} color="#8b9faa" />
              </View>
              <Text className="text-xs font-bold text-white">Import Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push(`/grade-students/${id}`)}
              className="flex-1 flex-col items-center justify-center gap-2 bg-[#192b33] border border-[#325567] rounded-xl p-4 active:opacity-80"
            >
              <View className="w-10 h-10 items-center justify-center rounded-full bg-white/5">
                <Ionicons name="options-outline" size={24} color="#8b9faa" />
              </View>
              <Text className="text-xs font-bold text-white">Grading</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center justify-between px-4 pb-2 pt-4">
          <Text className="text-lg font-bold text-white">Enrolled Students</Text>
          <View className="bg-[#13a4ec]/10 px-2.5 py-0.5 rounded-full">
            <Text className="text-xs font-semibold text-[#13a4ec]">{classItem.students.length}</Text>
          </View>
        </View>

        <View className="flex-col">
          {classItem.students.map((student, index) => (
            <View
              key={student.id}
              className={`flex-row items-center justify-between gap-4 px-4 py-3 active:bg-white/5 ${
                index !== classItem.students.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <View className="flex-1 flex-row items-center gap-4">
                {student.avatar ? (
                  <Image source={{ uri: student.avatar }} className="w-12 h-12 rounded-full" />
                ) : (
                  <View className="w-12 h-12 rounded-full bg-indigo-500 items-center justify-center">
                    <Text className="text-lg font-bold text-white">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </Text>
                  </View>
                )}
                <View className="flex-col justify-center flex-1">
                  <Text className="text-base font-semibold text-white">{student.name}</Text>
                  <Text className="text-sm text-[#8b9faa]">ID: {student.id}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowOptionsId(showOptionsId === student.id ? null : student.id)}
                className="w-10 h-10 items-center justify-center rounded-full active:bg-white/10"
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#8b9faa" />
              </TouchableOpacity>

              {showOptionsId === student.id && (
                <View className="absolute right-4 top-16 bg-[#192b33] border border-[#325567] rounded-lg shadow-xl z-10 min-w-35">
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedStudent(student)
                      setShowEditStudentModal(true)
                      setShowOptionsId(null)
                    }}
                    className="flex-row items-center gap-3 px-4 py-3 border-b border-[#325567] active:bg-white/5"
                  >
                    <Ionicons name="create-outline" size={18} color="#13a4ec" />
                    <Text className="text-white">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedStudent(student)
                      setShowDeleteStudentModal(true)
                      setShowOptionsId(null)
                    }}
                    className="flex-row items-center gap-3 px-4 py-3 active:bg-white/5"
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    <Text className="text-[#EF4444]">Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        <View className="h-24" />
      </ScrollView>

      <View className="px-4 py-4 bg-[#101c22]/95 border-t border-white/10">
        <TouchableOpacity
          onPress={handleSaveChanges}
          className="h-12 w-full items-center justify-center rounded-xl bg-[#13a4ec] active:bg-[#13a4ec]/90"
        >
          <Text className="text-base font-bold text-white">Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
