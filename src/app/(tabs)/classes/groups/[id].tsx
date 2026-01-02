"use client"

import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useApp } from "@/contexts/AppContext"
import { Toast } from "@/components/common/Toast"
import { ConfirmModal } from "@/components/common/ConfirmModal"
import { useToast } from "@/hooks/useToast"
import type { ClassGroup } from "@/interfaces/interface"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useState, useEffect } from "react"

export default function ClassGroupDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { classGroups, classes, deleteClassGroup, updateClassGroup, getGroupChildren, removeItemFromGroup } = useApp()
  const { toast, hide, success, error } = useToast()

  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false)
  const [showRemoveItemModal, setShowRemoveItemModal] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<{ id: string; type: "class" | "group" } | null>(null)
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null)

  const classGroup = classGroups.find((g) => g.id === id)

  const { classes: childClasses, groups: childGroups } = classGroup
    ? getGroupChildren(classGroup.id)
    : { classes: [], groups: [] }

  useEffect(() => {
    if (classGroup) {
      setGroupName(classGroup.name)
      setGroupDescription(classGroup.description || "")
    }
  }, [classGroup])

  if (!classGroup) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0F1419]">
        <Ionicons name="folder-open-outline" size={64} color="#64748b" />
        <Text className="text-white text-lg font-bold mt-4">Class Group not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-6 py-3 bg-[#13a4ec] rounded-xl">
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const handleDeleteGroup = () => {
    deleteClassGroup(classGroup.id)
    success("Class group deleted successfully")
    router.back()
  }

  const handleRemoveItem = () => {
    if (itemToRemove) {
      removeItemFromGroup(classGroup.id, itemToRemove.id, itemToRemove.type)
      setShowRemoveItemModal(false)
      setItemToRemove(null)
      setShowOptionsId(null)
      success(`${itemToRemove.type === "class" ? "Class" : "Group"} removed from group`)
    }
  }

  const handleSaveChanges = () => {
    const updates: Partial<ClassGroup> = {}

    if (groupName.trim() && groupName !== classGroup.name) {
      updates.name = groupName.trim()
    }

    if (groupDescription !== classGroup.description) {
      updates.description = groupDescription.trim() || undefined
    }

    if (Object.keys(updates).length > 0) {
      updateClassGroup(classGroup.id, updates)
      success("Group details updated successfully")
    } else {
      success("No changes to save")
    }
  }

  return (
    <View className="flex-1 bg-[#0F1419]">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hide} />

      <ConfirmModal
        visible={showDeleteGroupModal}
        title="Delete Class Group"
        message="Are you sure you want to delete this class group? All items will be moved to root level."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteGroup}
        onCancel={() => setShowDeleteGroupModal(false)}
      />

      <ConfirmModal
        visible={showRemoveItemModal}
        title={`Remove ${itemToRemove?.type === "class" ? "Class" : "Group"}`}
        message={`Remove this ${itemToRemove?.type} from the group? It will be moved to root level.`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleRemoveItem}
        onCancel={() => {
          setShowRemoveItemModal(false)
          setItemToRemove(null)
        }}
      />

      <View className="flex-row justify-between items-center px-4 pt-16 pb-4 bg-[#0F1419]/90">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-[#1a2730]"
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-white">Group Details</Text>
        <TouchableOpacity
          onPress={() => setShowDeleteGroupModal(true)}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-red-500/10"
        >
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-[#1a2730] mx-4 mt-4 p-4 rounded-2xl border border-[#325567]">
          <Text className="text-xs font-bold uppercase tracking-wide mb-3 text-[#94a3b8]">Group Information</Text>

          {/* Group Name Input */}
          <View className="flex-row items-center bg-[#0F1419] border border-[#325567] rounded-xl overflow-hidden mb-3">
            <TextInput
              className="flex-1 h-14 px-4 text-base text-white"
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Enter group name"
              placeholderTextColor="#64748b"
            />
            <View className="w-14 h-14 items-center justify-center">
              <Ionicons name="folder" size={20} color="#13a4ec" />
            </View>
          </View>

          {/* Description Input */}
          <TextInput
            className="bg-[#0F1419] border border-[#325567] rounded-xl px-4 py-3 text-base text-white min-h-[80px]"
            value={groupDescription}
            onChangeText={setGroupDescription}
            placeholder="Add a description (optional)"
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* Stats */}
          <View className="flex-row gap-4 mt-3">
            <View className="flex-1 bg-[#0F1419] p-3 rounded-xl border border-[#325567]">
              <Text className="text-xs text-[#94a3b8] mb-1">Classes</Text>
              <Text className="text-sm font-semibold text-white">{childClasses.length}</Text>
            </View>
            <View className="flex-1 bg-[#0F1419] p-3 rounded-xl border border-[#325567]">
              <Text className="text-xs text-[#94a3b8] mb-1">Sub-Groups</Text>
              <Text className="text-sm font-semibold text-white">{childGroups.length}</Text>
            </View>
            <View className="flex-1 bg-[#0F1419] p-3 rounded-xl border border-[#325567]">
              <Text className="text-xs text-[#94a3b8] mb-1">Total Items</Text>
              <Text className="text-sm font-semibold text-white">{childClasses.length + childGroups.length}</Text>
            </View>
          </View>
        </View>

        <View className="px-4 pt-4">
          <TouchableOpacity
            onPress={() => router.push(`/add-items-to-group?groupId=${classGroup.id}`)}
            className="flex-row items-center justify-center gap-2 bg-[#1a2730] border border-dashed border-[#325567] rounded-xl p-4 active:opacity-80"
          >
            <View className="w-10 h-10 items-center justify-center rounded-full bg-[#13a4ec]/10">
              <Ionicons name="add" size={24} color="#13a4ec" />
            </View>
            <Text className="text-sm font-bold text-white">Add Classes or Sub-Groups</Text>
          </TouchableOpacity>
        </View>

        {childGroups.length > 0 && (
          <View className="px-4 pt-6">
            <Text className="text-sm font-semibold text-[#94a3b8] mb-3 uppercase tracking-wider">Sub-Groups</Text>
            {childGroups.map((group) => (
              <View key={group.id} className="relative mb-3">
                <TouchableOpacity
                  className="flex-row items-center bg-[#1a2730] rounded-2xl p-4"
                  onPress={() => router.push(`/(tabs)/classes/groups/${group.id}`)}
                >
                  <View className="w-12 h-12 rounded-xl bg-[#13a4ec]/10 items-center justify-center mr-4">
                    <Ionicons name="folder" size={28} color="#13a4ec" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-white mb-1">{group.name}</Text>
                    <Text className="text-sm text-[#94a3b8]">
                      {group.classIds.length} classes • {group.subGroupIds.length} groups
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation()
                      setShowOptionsId(showOptionsId === group.id ? null : group.id)
                    }}
                    className="w-10 h-10 items-center justify-center"
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                  </TouchableOpacity>
                </TouchableOpacity>

                {showOptionsId === group.id && (
                  <View className="absolute right-4 top-16 bg-[#192b33] rounded-xl overflow-hidden shadow-2xl z-50 w-48 border border-[#325567]">
                    <TouchableOpacity
                      className="flex-row items-center gap-3 px-4 py-3.5 border-b border-[#325567] active:bg-[#1a2730]"
                      onPress={(e) => {
                        e.stopPropagation()
                        setShowOptionsId(null)
                        router.push(`/(tabs)/classes/groups/${group.id}`)
                      }}
                    >
                      <Ionicons name="folder-open-outline" size={18} color="#94a3b8" />
                      <Text className="text-white text-sm font-medium">Open Group</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-row items-center gap-3 px-4 py-3.5 active:bg-[#1a2730]"
                      onPress={(e) => {
                        e.stopPropagation()
                        setItemToRemove({ id: group.id, type: "group" })
                        setShowRemoveItemModal(true)
                      }}
                    >
                      <Ionicons name="remove-circle-outline" size={18} color="#EF4444" />
                      <Text className="text-red-500 text-sm font-medium">Remove</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {childClasses.length > 0 && (
          <View className="px-4 pt-6 pb-6">
            <Text className="text-sm font-semibold text-[#94a3b8] mb-3 uppercase tracking-wider">Classes</Text>
            {childClasses.map((classItem) => (
              <View key={classItem.id} className="relative mb-3">
                <TouchableOpacity
                  className="flex-row bg-[#1a2730] rounded-2xl overflow-hidden"
                  onPress={() => router.push(`/(tabs)/classes/${classItem.id}`)}
                >
                  <View className="flex-1 p-4">
                    <View className="flex-row justify-between items-center mb-2">
                      <View className="flex-row items-center gap-1.5 bg-[#0F1419] px-2.5 py-1.5 rounded-lg">
                        <Ionicons name="people" size={14} color="#94A3B8" />
                        <Text className="text-xs text-[#94a3b8] font-semibold">
                          {classItem.students?.length || 0} Students
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation()
                          setShowOptionsId(showOptionsId === classItem.id ? null : classItem.id)
                        }}
                        className="w-8 h-8 items-center justify-center"
                      >
                        <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                    <Text className="text-xl font-bold text-white mb-2">{classItem.name}</Text>
                    <Text className="text-sm text-[#94a3b8]">
                      {classItem.time} • {classItem.room}
                    </Text>
                  </View>
                  <Image source={{ uri: classItem.image }} className="w-28 h-full" />
                </TouchableOpacity>

                {showOptionsId === classItem.id && (
                  <View className="absolute right-4 top-14 bg-[#192b33] rounded-xl overflow-hidden shadow-2xl z-50 w-48 border border-[#325567]">
                    <TouchableOpacity
                      className="flex-row items-center gap-3 px-4 py-3.5 border-b border-[#325567] active:bg-[#1a2730]"
                      onPress={(e) => {
                        e.stopPropagation()
                        setShowOptionsId(null)
                        router.push(`/(tabs)/classes/${classItem.id}`)
                      }}
                    >
                      <Ionicons name="school-outline" size={18} color="#94a3b8" />
                      <Text className="text-white text-sm font-medium">Open Class</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-row items-center gap-3 px-4 py-3.5 active:bg-[#1a2730]"
                      onPress={(e) => {
                        e.stopPropagation()
                        setItemToRemove({ id: classItem.id, type: "class" })
                        setShowRemoveItemModal(true)
                      }}
                    >
                      <Ionicons name="remove-circle-outline" size={18} color="#EF4444" />
                      <Text className="text-red-500 text-sm font-medium">Remove</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {childClasses.length === 0 && childGroups.length === 0 && (
          <View className="items-center justify-center py-20">
            <View className="w-20 h-20 rounded-full bg-[#1a2730] items-center justify-center mb-4">
              <Ionicons name="folder-open-outline" size={40} color="#64748b" />
            </View>
            <Text className="text-lg font-bold text-white mb-2">Empty Group</Text>
            <Text className="text-sm text-[#94a3b8] text-center max-w-[250px]">
              Add classes or create sub-groups to organize your content
            </Text>
          </View>
        )}

        <View className="h-32" />
      </ScrollView>

      <View className="px-4 py-4 bg-[#0F1419]/95 border-t border-white/10">
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
