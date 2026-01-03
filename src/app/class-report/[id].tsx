"use client"

import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useApp } from "@/contexts/AppContext"
import { Card } from "@/components/common/Card"
import { GradeDistributionChart } from "@/components/charts/GradeDistributionChart"
import { calculateClassGradeStats } from "@/utils/gradeAnalytics"

export default function ClassReportScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { classes, assignments, grades, getAttendanceStats } = useApp()

  const classItem = classes.find((c) => c.id === id)

  if (!classItem) {
    return (
      <View className="flex-1 bg-[#101c22] items-center justify-center">
        <Text className="text-white text-lg">Class not found</Text>
        <TouchableOpacity
          className="mt-4 px-6 py-3 bg-[#13a4ec] rounded-lg"
          onPress={() => router.push("/(tabs)/classes")}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const attendanceStats = getAttendanceStats(classItem.id)
  const gradeStats = calculateClassGradeStats(classItem, assignments, grades)

  return (
    <View className="flex-1 bg-[#101c22]">
      <View className="flex-row items-center gap-3 px-5 pt-12 pb-4 bg-[#101c22]/95 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#13a4ec" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-white">{classItem.name}</Text>
          <Text className="text-sm text-[#92b7c9] mt-1">{classItem.section}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Attendance Overview */}
        <Card className="mb-4">
          <View className="flex-row items-center gap-3 mb-4">
            <Ionicons name="calendar-outline" size={24} color="#10B981" />
            <Text className="text-lg font-bold text-white">Attendance Overview</Text>
          </View>
          <View className="gap-3">
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-sm text-[#8b9faa]">Total Sessions</Text>
              <Text className="text-lg font-bold text-white">{attendanceStats.totalSessions}</Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-sm text-[#8b9faa]">Class Attendance Rate</Text>
              <Text className="text-lg font-bold text-[#10B981]">{attendanceStats.averageAttendance.toFixed(1)}%</Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-sm text-[#8b9faa]">Total Students</Text>
              <Text className="text-lg font-bold text-white">{classItem.students.length}</Text>
            </View>
          </View>
        </Card>

        {/* Student Attendance Details */}
        {attendanceStats.studentStats.length > 0 && (
          <Card className="mb-4">
            <View className="flex-row items-center gap-3 mb-4">
              <Ionicons name="people-outline" size={24} color="#13a4ec" />
              <Text className="text-lg font-bold text-white">Student Attendance</Text>
            </View>
            <View className="gap-2">
              {attendanceStats.studentStats.map((stat) => {
                const student = classItem.students.find((s) => s.id === stat.studentId)
                return (
                  <View
                    key={stat.studentId}
                    className="flex-row justify-between items-center py-3 border-b border-[#325567]"
                  >
                    <View className="flex-1">
                      <Text className="text-white font-medium">{student?.name || "Unknown"}</Text>
                      <Text className="text-xs text-[#8b9faa]">
                        {stat.presentCount} present, {stat.absentCount} absent
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text
                        className={`text-lg font-bold ${
                          stat.rate >= 80 ? "text-[#10B981]" : stat.rate >= 60 ? "text-yellow-500" : "text-red-500"
                        }`}
                      >
                        {stat.rate.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                )
              })}
            </View>
          </Card>
        )}

        {/* Grade Overview */}
        <Card className="mb-4">
          <View className="flex-row items-center gap-3 mb-4">
            <Ionicons name="school-outline" size={24} color="#8B5CF6" />
            <Text className="text-lg font-bold text-white">Grade Overview</Text>
          </View>
          <View className="gap-3">
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-sm text-[#8b9faa]">Total Assignments</Text>
              <Text className="text-lg font-bold text-white">{gradeStats.totalAssignments}</Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-sm text-[#8b9faa]">Class Average</Text>
              <Text className="text-lg font-bold text-[#13a4ec]">{gradeStats.averageGrade.toFixed(1)}%</Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-sm text-[#8b9faa]">Graded Students</Text>
              <Text className="text-lg font-bold text-white">
                {gradeStats.studentGrades.filter((s) => s.overallGrade > 0).length}
              </Text>
            </View>
          </View>
        </Card>

        {/* Grade Distribution */}
        {gradeStats.studentGrades.some((s) => s.overallGrade > 0) && (
          <Card className="mb-4">
            <View className="flex-row items-center gap-3 mb-4">
              <Ionicons name="pie-chart-outline" size={24} color="#F59E0B" />
              <Text className="text-lg font-bold text-white">Grade Distribution</Text>
            </View>
            <GradeDistributionChart distribution={gradeStats.gradeDistribution} />
          </Card>
        )}

        {/* Student Grade Details */}
        {gradeStats.studentGrades.length > 0 && (
          <Card className="mb-6">
            <View className="flex-row items-center gap-3 mb-4">
              <Ionicons name="list-outline" size={24} color="#F59E0B" />
              <Text className="text-lg font-bold text-white">Student Grades</Text>
            </View>
            <View className="gap-2">
              {gradeStats.studentGrades.map((gradeInfo) => {
                const student = classItem.students.find((s) => s.id === gradeInfo.studentId)
                return (
                  <View
                    key={gradeInfo.studentId}
                    className="flex-row justify-between items-center py-3 border-b border-[#325567]"
                  >
                    <View className="flex-1">
                      <Text className="text-white font-medium">{student?.name || "Unknown"}</Text>
                      {gradeInfo.letterGrade && (
                        <Text className="text-xs text-[#8b9faa]">Grade: {gradeInfo.letterGrade}</Text>
                      )}
                    </View>
                    <View className="items-end">
                      <Text className="text-lg font-bold text-[#13a4ec]">
                        {gradeInfo.overallGrade?.toFixed(1) || "—"}%
                      </Text>
                    </View>
                  </View>
                )
              })}
            </View>
          </Card>
        )}

        <View className="h-6" />
      </ScrollView>
    </View>
  )
}
