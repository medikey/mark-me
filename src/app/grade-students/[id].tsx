// "use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useApp } from "@/contexts/AppContext"
import { Header } from "@/components/common/Header"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Avatar } from "@/components/common/Avatar"
import { ManageCriteriaModal } from "@/components/modals/ManageCriteriaModal"
import { GradeInputModal } from "@/components/modals/GradeInputModal"
import { useToast } from "@/hooks/useToast"
import { calculateOverallGrade, getLetterGrade, getGradeColor } from "@/utils/gradeCalculations"
import type { GradingCriterion, Student } from "@/interfaces/interface"

export default function GradeStudentsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { classes, saveGrade, updateGradingCriteria } = useApp()
  const { show } = useToast()

  const [showCriteriaModal, setShowCriteriaModal] = useState(false)
  const [showGradeInput, setShowGradeInput] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedCriterion, setSelectedCriterion] = useState<GradingCriterion | null>(null)
  const [studentGrades, setStudentGrades] = useState<{ [studentId: string]: { [criterionId: string]: number } }>({})

  const classItem = classes.find((c) => c.id === id)

  if (!classItem) return null

  const criteria: GradingCriterion[] =
    Array.isArray(classItem.gradingCriteria) &&
    classItem.gradingCriteria.length > 0 &&
    typeof classItem.gradingCriteria[0] === "object"
      ? (classItem.gradingCriteria as unknown as GradingCriterion[])
      : [
          { id: "1", name: "Participation", weight: 20, maxScore: 100 },
          { id: "2", name: "Technical Skills", weight: 40, maxScore: 100 },
          { id: "3", name: "Communication", weight: 40, maxScore: 100 },
        ]

  const handleGradePress = (student: Student, criterion: GradingCriterion) => {
    setSelectedStudent(student)
    setSelectedCriterion(criterion)
    setShowGradeInput(true)
  }

  const handleSaveGrade = (score: number) => {
    if (!selectedStudent || !selectedCriterion) return

    setStudentGrades((prev) => ({
      ...prev,
      [selectedStudent.id]: {
        ...prev[selectedStudent.id],
        [selectedCriterion.id]: score,
      },
    }))

    show(`Grade saved for ${selectedStudent.name}`, "success")
    setShowGradeInput(false)
    setSelectedStudent(null)
    setSelectedCriterion(null)
  }

  const handleSaveCriteria = (newCriteria: GradingCriterion[]) => {
    updateGradingCriteria(classItem.id, newCriteria)
    setShowCriteriaModal(false)
    show("Grading criteria updated", "success")
  }

  const getStudentOverallGrade = (studentId: string) => {
    const scores = studentGrades[studentId] || {}
    return calculateOverallGrade(scores, criteria)
  }

  const gradedCount = Object.keys(studentGrades).filter(
    (studentId) => Object.keys(studentGrades[studentId] || {}).length === criteria.length,
  ).length

  return (
    <View className="flex-1 bg-[#0F1419]">
      <Header
        title="Grade Students"
        subtitle={`${classItem.name} - ${classItem.section}`}
        rightElement={<Text className="text-base font-semibold text-[#13a4ec]">Help</Text>}
      />

      <View className="flex-row justify-between items-center px-5 mb-4">
        <Text className="text-xs font-bold text-[#6b7280] tracking-wider">GRADING CRITERIA</Text>
        <TouchableOpacity onPress={() => setShowCriteriaModal(true)}>
          <Text className="text-xs font-semibold text-[#13a4ec]">Manage Criteria →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Criteria Overview */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5 px-5">
          <View className="flex-row gap-2">
            {criteria.map((criterion) => (
              <Card key={criterion.id} className="px-4 py-3 min-w-35">
                <Text className="text-sm font-bold text-[#ffffff] mb-1">{criterion.name}</Text>
                <Text className="text-xs text-[#94a3b8]">
                  Weight: {criterion.weight}% • Max: {criterion.maxScore}
                </Text>
              </Card>
            ))}
          </View>
        </ScrollView>

        {/* Students */}
        <View className="px-5">
          {classItem.students.map((student) => {
            const overallGrade = getStudentOverallGrade(student.id)
            const letterGrade = getLetterGrade(overallGrade)
            const gradeColor = getGradeColor(overallGrade)
            const isFullyGraded =
              studentGrades[student.id] && Object.keys(studentGrades[student.id]).length === criteria.length

            return (
              <Card key={student.id} className="p-4 mb-4">
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center gap-3 flex-1">
                    <Avatar uri={student.avatar} name={student.name} />
                    <View className="flex-1">
                      <Text className="text-base font-bold text-[#ffffff]">{student.name}</Text>
                      <Text className="text-xs text-[#6b7280]">
                        ID: {student.id} • {student.status === "present" ? "Present" : "Absent"}
                      </Text>
                    </View>
                  </View>
                  {isFullyGraded && (
                    <View className="items-end">
                      <Text className="text-2xl font-bold" style={{ color: gradeColor }}>
                        {overallGrade.toFixed(0)}%
                      </Text>
                      <Text className="text-xs text-[#94a3b8]">{letterGrade}</Text>
                    </View>
                  )}
                </View>

                {/* Grade Inputs */}
                {criteria.map((criterion) => {
                  const currentScore = studentGrades[student.id]?.[criterion.id]
                  return (
                    <TouchableOpacity
                      key={criterion.id}
                      onPress={() => handleGradePress(student, criterion)}
                      className="flex-row justify-between items-center py-3 border-t border-[#325567]"
                    >
                      <View>
                        <Text className="text-sm font-semibold text-[#ffffff]">{criterion.name}</Text>
                        <Text className="text-xs text-[#94a3b8]">
                          {criterion.weight}% • Max {criterion.maxScore}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        {currentScore !== undefined ? (
                          <>
                            <Text className="text-lg font-bold text-[#ffffff]">{currentScore}</Text>
                            <Text className="text-sm text-[#94a3b8]">/ {criterion.maxScore}</Text>
                            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                          </>
                        ) : (
                          <>
                            <Text className="text-sm text-[#6b7280]">Tap to grade</Text>
                            <Ionicons name="chevron-forward" size={20} color="#64748b" />
                          </>
                        )}
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </Card>
            )
          })}

          <View className="flex-row justify-between items-center my-6">
            <Text className="text-sm text-[#94a3b8]">
              {gradedCount}/{classItem.students.length} Students Fully Graded
            </Text>
            <TouchableOpacity onPress={() => setStudentGrades({})}>
              <Text className="text-sm font-semibold text-[#EF4444]">Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View className="px-5 pb-8 border-t border-[#325567] pt-4">
        <Button
          title="Save All Grades"
          onPress={() => {
            show("Grades saved successfully", "success")
            router.back()
          }}
          icon="save"
        />
      </View>

      {/* Modals */}
      <ManageCriteriaModal
        visible={showCriteriaModal}
        classId={classItem.id}
        criteria={criteria}
        onSave={handleSaveCriteria}
        onCancel={() => setShowCriteriaModal(false)}
      />

      {selectedStudent && selectedCriterion && (
        <GradeInputModal
          visible={showGradeInput}
          student={selectedStudent}
          criterion={selectedCriterion}
          currentScore={studentGrades[selectedStudent.id]?.[selectedCriterion.id]}
          onSave={handleSaveGrade}
          onCancel={() => {
            setShowGradeInput(false)
            setSelectedStudent(null)
            setSelectedCriterion(null)
          }}
        />
      )}
    </View>
  )
}
