"use client"

import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useApp } from "@/contexts/AppContext"
import { ConfirmModal } from "@/components/common/ConfirmModal"
import { EditClassModal } from "@/components/modals/EditClassModal"
import { Toast } from "@/components/common/Toast"
import { useToast } from "@/hooks/useToast"
import type { Class } from "@/interfaces/interface"
import { Avatar } from "@/components/common/Avatar"

export default function ClassesScreen() {
  const router = useRouter()
  const { classes, deleteClass, updateClass, userProfile } = useApp()
  const { toast, hide, success } = useToast()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null)

  const handleDeleteClass = () => {
    if (selectedClass) {
      deleteClass(selectedClass.id)
      setShowDeleteModal(false)
      setSelectedClass(null)
      setShowOptionsId(null)
      success("Class deleted successfully")
    }
  }

  const handleEditClass = (updates: Partial<Class>) => {
    if (selectedClass) {
      updateClass(selectedClass.id, updates)
      setShowEditModal(false)
      setSelectedClass(null)
      setShowOptionsId(null)
      success("Class updated successfully")
    }
  }

  return (
    <View className="flex-1 bg-[#0F1419]">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hide} />

      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Class"
        message={`Are you sure you want to delete ${selectedClass?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteClass}
        onCancel={() => {
          setShowDeleteModal(false)
          setSelectedClass(null)
        }}
      />

      <EditClassModal
        visible={showEditModal}
        classItem={selectedClass}
        onSave={handleEditClass}
        onCancel={() => {
          setShowEditModal(false)
          setSelectedClass(null)
        }}
      />

      <View className="flex-row justify-between items-center px-5 pt-15 pb-5">
        <View className="flex-row items-center gap-3">
          <Avatar key={userProfile.avatar} uri={userProfile.avatar} name={userProfile.name} size={64} />
          <Text className="text-2xl font-bold text-white">My Classes</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-lg font-semibold text-[#94a3b8]">Fall Semester 2023</Text>
          <View className="bg-[#1a2730] px-3 py-1.5 rounded-full">
            <Text className="text-xs font-semibold text-[#13a4ec]">{classes.length} Active Classes</Text>
          </View>
        </View>

        {classes.map((classItem) => (
          <View key={classItem.id} className="relative mb-4">
            <TouchableOpacity
              className="flex-row bg-[#1a2730] rounded-2xl overflow-hidden"
              onPress={() => router.push(`/(tabs)/classes/${classItem.id}`)}
            >
              <View className="flex-1 p-5">
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center gap-1.5 bg-[#0F1419] px-2.5 py-1.5 rounded-lg">
                    <Ionicons name="people" size={14} color="#94A3B8" />
                    <Text className="text-xs text-[#94a3b8] font-semibold">
                      {classItem.students?.length || 0} Students
                    </Text>
                  </View>
                  <View className="relative">
                    <TouchableOpacity
                      className="p-1"
                      onPress={(e) => {
                        e.stopPropagation()
                        setShowOptionsId(showOptionsId === classItem.id ? null : classItem.id)
                      }}
                    >
                      <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text className="text-2xl font-bold text-white mb-2">{classItem.name}</Text>
                <Text className="text-sm text-[#94a3b8] mb-4">
                  {classItem.time} • {classItem.room}
                </Text>
                <TouchableOpacity className="flex-row items-center gap-2 bg-[#0F1419] px-4 py-2.5 rounded-lg self-start">
                  <Text className="text-sm font-semibold text-[#13a4ec]">Manage Class</Text>
                  <Ionicons name="arrow-forward" size={16} color="#13a4ec" />
                </TouchableOpacity>
              </View>
              <Image source={{ uri: classItem.image }} className="w-35 h-full" />
            </TouchableOpacity>

            {showOptionsId === classItem.id && (
              <View className="absolute right-5 top-16 bg-[#192b33] rounded-xl overflow-hidden shadow-2xl z-50 w-52 border border-[#325567]">
                <TouchableOpacity
                  className="flex-row items-center gap-3 px-4 py-3.5 border-b border-[#325567] active:bg-[#1a2730]"
                  onPress={(e) => {
                    e.stopPropagation()
                    setSelectedClass(classItem)
                    setShowEditModal(true)
                    setShowOptionsId(null)
                  }}
                >
                  <Ionicons name="create-outline" size={18} color="#94a3b8" />
                  <Text className="text-white text-sm font-medium">Edit Class Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-row items-center gap-3 px-4 py-3.5 border-b border-[#325567] active:bg-[#1a2730]"
                  onPress={(e) => {
                    e.stopPropagation()
                    setShowOptionsId(null)
                    router.push(`/attendance/${classItem.id}`)
                  }}
                >
                  <Ionicons name="calendar-outline" size={18} color="#94a3b8" />
                  <Text className="text-white text-sm font-medium">View Attendance</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-row items-center gap-3 px-4 py-3.5 border-b border-[#325567] active:bg-[#1a2730]"
                  onPress={(e) => {
                    e.stopPropagation()
                    setShowOptionsId(null)
                    router.push(`/grade-students/${classItem.id}`)
                  }}
                >
                  <Ionicons name="school-outline" size={18} color="#94a3b8" />
                  <Text className="text-white text-sm font-medium">View Grades</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-row items-center gap-3 px-4 py-3.5 active:bg-[#1a2730]"
                  onPress={(e) => {
                    e.stopPropagation()
                    setSelectedClass(classItem)
                    setShowDeleteModal(true)
                    setShowOptionsId(null)
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  <Text className="text-red-500 text-sm font-medium">Delete Class</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-25 right-5 bg-[#13a4ec] flex-row items-center gap-2 py-4 px-6 rounded-full shadow-lg"
        onPress={() => router.push("/create-class")}
      >
        <Ionicons name="add" size={28} color="#fff" />
        <Text className="text-base font-bold text-white">New Class</Text>
      </TouchableOpacity>
    </View>
  )
}
