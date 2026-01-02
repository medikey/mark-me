"use client"

import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useApp } from "@/contexts/AppContext"
import { ConfirmModal } from "@/components/common/ConfirmModal"
import { EditClassModal } from "@/components/modals/EditClassModal"
import { CreateOptionModal } from "@/components/modals/CreateOptionModal"
import { Toast } from "@/components/common/Toast"
import { useToast } from "@/hooks/useToast"
import type { Class } from "@/interfaces/interface"

export default function ClassesScreen() {
  const router = useRouter()
  const { classes, deleteClass, updateClass, userProfile, classGroups, getRootItems, getGroupChildren } = useApp()
  const { toast, hide, success } = useToast()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

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

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  const { classes: rootClasses, groups: rootGroups } = getRootItems()

  return (
    <View className="flex-1 bg-[#101c22]">
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

      <CreateOptionModal
        visible={showCreateModal}
        onCreateClass={() => {
          setShowCreateModal(false)
          router.push("/create-class")
        }}
        onCreateGroup={() => {
          setShowCreateModal(false)
          router.push("/create-class-group")
        }}
        onCancel={() => setShowCreateModal(false)}
      />

      <View className="flex-row justify-between items-center px-5 pt-12 pb-4 bg-[#101c22]/95 border-b border-gray-800">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full overflow-hidden border border-gray-700">
            <Image
              source={{ uri: userProfile.avatar || "https://i.pravatar.cc/100?img=5" }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <Text className="text-xl font-bold text-white tracking-tight">My Classes</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full hover:bg-gray-800">
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-sm font-medium text-[#92b7c9]">Fall Semester 2023</Text>
          <View className="bg-[#13a4ec]/10 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-[#13a4ec]">{classes.length} Active Classes</Text>
          </View>
        </View>

        <View className="flex-col gap-4">
          {rootGroups.map((group) => {
            const isExpanded = expandedGroups.has(group.id)
            const { classes: groupClasses, subGroups } = getGroupChildren(group.id)

            return (
              <View key={group.id} className="flex-col">
                <View className="rounded-2xl bg-[#192b33] shadow-sm border border-gray-800 overflow-hidden">
                  <TouchableOpacity
                    className="flex-row items-center justify-between px-4 py-3 bg-gray-50/5 border-b border-gray-800"
                    onPress={() => toggleGroup(group.id)}
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <TouchableOpacity
                        className="h-8 w-8 items-center justify-center rounded-full"
                        onPress={(e) => {
                          e.stopPropagation()
                          toggleGroup(group.id)
                        }}
                      >
                        <Ionicons name={isExpanded ? "chevron-down" : "chevron-forward"} size={20} color="#92b7c9" />
                      </TouchableOpacity>

                      <View className="flex-col flex-1">
                        <View className="flex-row items-center gap-2">
                          <Ionicons name={isExpanded ? "folder-open" : "folder"} size={20} color="#13a4ec" />
                          <Text className="font-bold text-white">{group.name}</Text>
                        </View>
                        <Text className="text-xs text-[#92b7c9] ml-7">
                          {groupClasses.length} {groupClasses.length === 1 ? "Class" : "Classes"}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      className="p-2"
                      onPress={(e) => {
                        e.stopPropagation()
                        router.push(`/(tabs)/classes/groups/${group.id}`)
                      }}
                    >
                      <Ionicons name="ellipsis-vertical" size={20} color="#92b7c9" />
                    </TouchableOpacity>
                  </TouchableOpacity>

                  {isExpanded && groupClasses.length > 0 && (
                    <View className="flex-col gap-3 p-3 bg-black/20">
                      <View className="border-l-2 border-gray-700 pl-3 flex-col gap-3">
                        {groupClasses.map((classItem) => (
                          <View key={classItem.id} className="relative">
                            <TouchableOpacity
                              className="flex-row bg-[#192b33] rounded-xl overflow-hidden shadow-sm border border-gray-800"
                              onPress={() => router.push(`/(tabs)/classes/${classItem.id}`)}
                            >
                              <View className="flex-1 p-3">
                                <View className="mb-3">
                                  <View className="flex-row items-start justify-between">
                                    <View className="flex-row items-center bg-[#233c48] px-2 py-0.5 rounded-md">
                                      <Ionicons name="people" size={14} color="#92b7c9" />
                                      <Text className="text-[10px] font-medium text-[#92b7c9] ml-1">
                                        {classItem.students?.length || 0} Students
                                      </Text>
                                    </View>

                                    <TouchableOpacity
                                      className="p-1"
                                      onPress={(e) => {
                                        e.stopPropagation()
                                        setShowOptionsId(showOptionsId === classItem.id ? null : classItem.id)
                                      }}
                                    >
                                      <Ionicons name="ellipsis-vertical" size={18} color="#92b7c9" />
                                    </TouchableOpacity>
                                  </View>

                                  <Text className="text-base font-bold text-white leading-tight mt-1">
                                    {classItem.name}
                                  </Text>

                                  <Text className="text-xs text-[#92b7c9] mt-0.5">
                                    {classItem.time} • {classItem.room}
                                  </Text>
                                </View>

                                <TouchableOpacity
                                  className="flex-row items-center gap-1 bg-[#13a4ec]/10 px-3 py-1.5 rounded-lg self-start"
                                  onPress={() => router.push(`/(tabs)/classes/${classItem.id}`)}
                                >
                                  <Text className="text-xs font-semibold text-[#13a4ec]">Manage</Text>
                                  <Ionicons name="arrow-forward" size={14} color="#13a4ec" />
                                </TouchableOpacity>
                              </View>

                              <View className="w-24 min-w-[100px] bg-gray-700">
                                <Image source={{ uri: classItem.image }} className="w-full h-full" resizeMode="cover" />
                              </View>
                            </TouchableOpacity>

                            {showOptionsId === classItem.id && (
                              <View className="absolute right-3 top-14 bg-[#192b33] rounded-xl overflow-hidden shadow-2xl z-50 w-48 border border-[#325567]">
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
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )
          })}

          {rootClasses.map((classItem) => (
            <View key={classItem.id} className="relative">
              <TouchableOpacity
                className="flex-row bg-[#192b33] rounded-2xl overflow-hidden shadow-sm border border-gray-800"
                onPress={() => router.push(`/(tabs)/classes/${classItem.id}`)}
              >
                <View className="flex-1 p-4">
                  <View className="mb-4">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-row items-center bg-[#233c48] px-2 py-1 rounded-md mb-2">
                        <Ionicons name="people" size={16} color="#92b7c9" />
                        <Text className="text-xs font-medium text-[#92b7c9] ml-1">
                          {classItem.students?.length || 0} Students
                        </Text>
                      </View>

                      <TouchableOpacity
                        className="p-1"
                        onPress={(e) => {
                          e.stopPropagation()
                          setShowOptionsId(showOptionsId === classItem.id ? null : classItem.id)
                        }}
                      >
                        <Ionicons name="ellipsis-vertical" size={20} color="#92b7c9" />
                      </TouchableOpacity>
                    </View>

                    <Text className="text-lg font-bold text-white leading-tight">{classItem.name}</Text>

                    <Text className="text-sm text-[#92b7c9] mt-1">
                      {classItem.time} • {classItem.room}
                    </Text>
                  </View>

                  <TouchableOpacity
                    className="flex-row items-center gap-2 bg-[#13a4ec]/10 px-4 py-2 rounded-lg self-start"
                    onPress={() => router.push(`/(tabs)/classes/${classItem.id}`)}
                  >
                    <Text className="text-sm font-semibold text-[#13a4ec]">Manage</Text>
                    <Ionicons name="arrow-forward" size={18} color="#13a4ec" />
                  </TouchableOpacity>
                </View>

                <View className="w-32 min-w-[120px] bg-gray-700">
                  <Image source={{ uri: classItem.image }} className="w-full h-full" resizeMode="cover" />
                </View>
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

          {rootClasses.length === 0 && rootGroups.length === 0 && (
            <View className="items-center justify-center py-20">
              <View className="w-24 h-24 rounded-full bg-[#192b33] items-center justify-center mb-4">
                <Ionicons name="school-outline" size={48} color="#64748b" />
              </View>
              <Text className="text-xl font-bold text-white mb-2">No Classes Yet</Text>
              <Text className="text-sm text-[#92b7c9] text-center max-w-[280px]">
                Get started by creating your first class or organizing them into groups
              </Text>
            </View>
          )}
        </View>

        <View className="h-24" />
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-24 right-5 z-30 flex-row items-center gap-2 bg-[#13a4ec] pl-4 pr-6 py-3.5 rounded-full shadow-lg"
        style={{
          shadowColor: "#13a4ec",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        onPress={() => setShowCreateModal(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
        <Text className="text-base font-bold text-white tracking-wide">Create</Text>
      </TouchableOpacity>
    </View>
  )
}
