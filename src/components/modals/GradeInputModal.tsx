"use client"

import { useState } from "react"
import { View, Text, Modal, TouchableOpacity, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { GradeInputModalProps } from "@/interfaces/interface"
import { Button } from "@/components/common/Button"
import { validateScore } from "@/utils/gradeCalculations"

export function GradeInputModal({ visible, student, criterion, currentScore, onSave, onCancel }: GradeInputModalProps) {
  const [score, setScore] = useState(currentScore?.toString() || "")
  const [comment, setComment] = useState("")

  const handleSave = () => {
    const numScore = Number.parseFloat(score)
    if (!validateScore(numScore, criterion.maxScore)) {
      alert(`Score must be between 0 and ${criterion.maxScore}`)
      return
    }
    onSave(numScore)
  }

  const percentage = score ? ((Number.parseFloat(score) / criterion.maxScore) * 100).toFixed(1) : "0"

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/80 justify-center items-center px-5">
        <View className="bg-[#192b33] rounded-2xl w-full max-w-md p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-white">Grade Input</Text>
            <TouchableOpacity onPress={onCancel}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-base text-white mb-1">{student.name}</Text>
            <Text className="text-sm text-[#94a3b8]">{criterion.name}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-xs text-[#94a3b8] mb-2">Score (Max: {criterion.maxScore} points)</Text>
            <View className="flex-row items-center gap-3">
              <TextInput
                value={score}
                onChangeText={setScore}
                keyboardType="decimal-pad"
                className="flex-1 bg-[#0F1419] border border-[#325567] rounded-xl px-4 py-3 text-2xl font-bold text-white text-center"
                placeholder="0"
                placeholderTextColor="#64748b"
                autoFocus
              />
              <View className="bg-[#13a4ec]/20 px-4 py-3 rounded-xl">
                <Text className="text-[#13a4ec] font-bold">{percentage}%</Text>
              </View>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-xs text-[#94a3b8] mb-2">Comment (optional)</Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Add feedback..."
              placeholderTextColor="#64748b"
              className="bg-[#0F1419] border border-[#325567] rounded-xl px-4 py-3 text-white"
              multiline
              numberOfLines={3}
            />
          </View>

          <View className="flex-row gap-3">
            <Button title="Cancel" onPress={onCancel} variant="secondary" className="flex-1" />
            <Button title="Save" onPress={handleSave} className="flex-1" />
          </View>
        </View>
      </View>
    </Modal>
  )
}
