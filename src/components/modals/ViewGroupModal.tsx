"use client"

import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useApp } from "@/contexts/AppContext"
import type { ClassGroup } from "@/interfaces/interface"

interface ViewGroupModalProps {
  visible: boolean
  group: ClassGroup | null
  onClose: () => void
}

export function ViewGroupModal({ visible, group, onClose }: ViewGroupModalProps) {
  const { getGroupChildren, classGroups } = useApp()

  if (!group) return null

  const { classes: directClasses, subGroups } = getGroupChildren(group.id)

  const renderGroupContents = (groupId: string, depth = 0) => {
    const { classes, subGroups: nestedGroups } = getGroupChildren(groupId)
    const indent = depth * 20

    return (
      <View key={groupId} className="flex-col">
        {classes.map((classItem) => (
          <View
            key={classItem.id}
            style={{ marginLeft: indent }}
            className="flex-row items-center gap-2 py-2 px-3 bg-[#192b33] rounded-lg mb-2"
          >
            <Ionicons name="book" size={16} color="#13a4ec" />
            <View className="flex-1">
              <Text className="text-sm font-medium text-white">{classItem.name}</Text>
              <Text className="text-xs text-[#92b7c9]">{classItem.section}</Text>
            </View>
            <Text className="text-xs text-[#92b7c9]">{classItem.students?.length || 0} students</Text>
          </View>
        ))}

        {nestedGroups.map((nestedGroup) => (
          <View key={nestedGroup.id} style={{ marginLeft: indent }} className="flex-col mb-3">
            <View className="flex-row items-center gap-2 py-2 px-3 bg-[#233c48] rounded-lg mb-2">
              <Ionicons name="folder" size={16} color="#13a4ec" />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-white">{nestedGroup.name}</Text>
                {nestedGroup.description && (
                  <Text className="text-xs text-[#92b7c9] mt-0.5">{nestedGroup.description}</Text>
                )}
              </View>
            </View>
            {renderGroupContents(nestedGroup.id, depth + 1)}
          </View>
        ))}
      </View>
    )
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-12 bg-[#101c22] rounded-t-3xl flex-col">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-800">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white">{group.name}</Text>
              {group.description && <Text className="text-sm text-[#92b7c9] mt-1">{group.description}</Text>}
            </View>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
            {directClasses.length > 0 || subGroups.length > 0 ? (
              <View>
                <Text className="text-lg font-semibold text-white mb-4">
                  Contents ({directClasses.length + subGroups.length})
                </Text>
                {renderGroupContents(group.id)}
                <View className="h-6" />
              </View>
            ) : (
              <View className="items-center justify-center py-12">
                <Ionicons name="folder-open" size={48} color="#64748b" />
                <Text className="text-white font-semibold mt-4">Empty Group</Text>
                <Text className="text-sm text-[#92b7c9] text-center mt-2 max-w-70">
                  This group doesn't contain any classes or sub-groups yet
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
