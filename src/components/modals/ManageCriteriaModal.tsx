"use client"

import { useState } from "react"
import { View, Text, Modal, ScrollView, TextInput, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { ManageCriteriaModalProps, GradingCriterion } from "@/interfaces/interface"

export function ManageCriteriaModal({ visible, classId, criteria, onSave, onCancel }: ManageCriteriaModalProps) {
  const [localCriteria, setLocalCriteria] = useState<GradingCriterion[]>(criteria)

  const addCriterion = () => {
    const newCriterion: GradingCriterion = {
      id: Date.now().toString(),
      name: "",
      weight: 0,
      maxScore: 100,
      description: "",
    }
    setLocalCriteria([...localCriteria, newCriterion])
  }

  const updateCriterion = (id: string, updates: Partial<GradingCriterion>) => {
    setLocalCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const deleteCriterion = (id: string) => {
    setLocalCriteria((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSave = () => {
    const totalWeight = localCriteria.reduce((sum, c) => sum + c.weight, 0)
    if (totalWeight !== 100) {
      alert(`Total weight must equal 100%. Current: ${totalWeight}%`)
      return
    }
    onSave(localCriteria)
  }

  const totalWeight = localCriteria.reduce((sum, c) => sum + c.weight, 0)
  const isValidTotal = totalWeight === 100

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/80">
        <View className="flex-1 bg-[#111c22] mt-12 rounded-t-2xl max-w-md mx-auto w-full">
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#325567]/50 bg-[#111c22]/95 backdrop-blur">
            <TouchableOpacity
              onPress={onCancel}
              className="w-10 h-10 -ml-2 items-center justify-center rounded-full active:bg-[#192b33]"
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-white flex-1 text-center tracking-tight">
              Edit Grading Criteria
            </Text>
            <TouchableOpacity
              onPress={addCriterion}
              className="w-10 h-10 -mr-2 items-center justify-center rounded-full active:bg-[#192b33]"
            >
              <Ionicons name="add" size={24} color="#13a4ec" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 pb-24" showsVerticalScrollIndicator={false}>
            <View className="px-5 pt-6 pb-2">
              <View className="flex-row items-center gap-3 mb-2">
                <View className="w-1 h-6 bg-[#13a4ec] rounded-full" />
                <Text className="text-xl font-bold text-white tracking-tight">Grade 10 Math</Text>
              </View>
              <Text className="text-sm text-[#92b7c9] pl-4">Algebra II - Period 4</Text>
            </View>

            <View className="h-px bg-[#325567]/50 my-4 mx-auto" style={{ width: "90%" }} />

            <View className="px-5 mb-6 flex-row items-center justify-between">
              <Text className="text-sm font-medium text-[#92b7c9]">Total Weight</Text>
              <View className={`px-3 py-1 rounded-full ${isValidTotal ? "bg-green-500/10" : "bg-red-500/10"}`}>
                <Text className={`text-sm font-bold ${isValidTotal ? "text-green-500" : "text-red-500"}`}>
                  {totalWeight}%
                </Text>
              </View>
            </View>

            <View className="px-4 gap-4">
              {localCriteria.map((criterion, index) => {
                const isNew = !criterion.name || criterion.weight === 0
                return (
                  <View
                    key={criterion.id}
                    className={`bg-[#192b33] rounded-xl p-4 border ${isNew ? "border-[#13a4ec]/50 ring-2 ring-[#13a4ec]/20" : "border-[#325567]"}`}
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <Text
                        className={`text-xs font-semibold uppercase tracking-wider ${isNew ? "text-[#13a4ec]" : "text-[#92b7c9]/70"}`}
                      >
                        {isNew ? "New Criterion" : "Criterion Name"}
                      </Text>
                      <TouchableOpacity onPress={() => deleteCriterion(criterion.id)} className="p-1">
                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>

                    <View className="flex-row gap-3">
                      <View className="flex-1 relative">
                        <View className="absolute left-3 top-1/2 -mt-2.5 z-10">
                          <Ionicons
                            name={isNew ? "create-outline" : "document-text-outline"}
                            size={18}
                            color={isNew ? "#13a4ec" : "#6b7280"}
                          />
                        </View>
                        <TextInput
                          value={criterion.name}
                          onChangeText={(text) => updateCriterion(criterion.id, { name: text })}
                          placeholder="e.g. Quizzes"
                          placeholderTextColor="#6b7280"
                          className={`w-full bg-[#111c22] border ${isNew ? "border-[#13a4ec]/50" : "border-[#325567]"} rounded-lg py-2.5 pl-10 pr-3 text-sm font-medium text-white`}
                        />
                      </View>

                      <View className="w-24 relative">
                        <TextInput
                          value={criterion.weight?.toString() || ""}
                          onChangeText={(text) => updateCriterion(criterion.id, { weight: Number.parseInt(text) || 0 })}
                          placeholder="0"
                          placeholderTextColor="#6b7280"
                          keyboardType="numeric"
                          className={`w-full bg-[#111c22] border ${isNew ? "border-[#13a4ec]/50" : "border-[#325567]"} rounded-lg py-2.5 px-3 text-center text-sm font-bold text-[#13a4ec]`}
                        />
                        <Text className="absolute right-3 top-1/2 -mt-2 text-xs font-bold text-[#6b7280]">%</Text>
                      </View>
                    </View>
                  </View>
                )
              })}

              <TouchableOpacity
                onPress={addCriterion}
                className="flex-row items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-[#325567] rounded-xl active:bg-[#192b33] active:border-[#13a4ec]"
              >
                <Ionicons name="add-circle-outline" size={20} color="#92b7c9" />
                <Text className="font-medium text-[#92b7c9]">Add Another Criterion</Text>
              </TouchableOpacity>

              <View className="h-6" />
            </View>
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 p-4 bg-[#111c22]/95 backdrop-blur border-t border-[#325567]/50">
            <TouchableOpacity
              onPress={handleSave}
              className="w-full bg-[#13a4ec] h-14 rounded-lg items-center justify-center flex-row gap-2 active:bg-[#0b8acb]"
            >
              <Ionicons name="save-outline" size={20} color="#ffffff" />
              <Text className="text-base font-bold text-white">Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
