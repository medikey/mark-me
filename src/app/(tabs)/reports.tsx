"use client"

import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Card } from "../../components/common/Card"
import { useApp } from "../../contexts/AppContext"
import { useRouter } from "expo-router"
import { calculateClassGradeStats } from "../../utils/gradeAnalytics"
import { GradeDistributionChart } from "../../components/charts/GradeDistributionChart"
import { useState } from "react"

export default function ReportsScreen() {
  const { classes, getAttendanceStats, assignments, grades } = useApp()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"attendance" | "grades">("attendance")

  const overallStats = classes.reduce(
    (acc, classItem) => {
      const stats = getAttendanceStats(classItem.id)
      return {
        totalStudents: acc.totalStudents + classItem.studentCount,
        totalSessions: acc.totalSessions + stats.totalSessions,
        totalAttendanceRate: acc.totalAttendanceRate + stats.averageAttendance,
        classCount: acc.classCount + 1,
      }
    },
    { totalStudents: 0, totalSessions: 0, totalAttendanceRate: 0, classCount: 0 },
  )

  const averageAttendanceRate =
    overallStats.classCount > 0 ? overallStats.totalAttendanceRate / overallStats.classCount : 0

  const classesWithStats = classes.map((c) => {
    const stats = getAttendanceStats(c.id)
    return { ...c, attendanceRate: stats.averageAttendance, sessions: stats.totalSessions }
  })

  const topClasses = [...classesWithStats].sort((a, b) => b.attendanceRate - a.attendanceRate).slice(0, 5)

  const overallGradeStats = classes.reduce(
    (acc, classItem) => {
      const stats = calculateClassGradeStats(classItem, assignments, grades)
      const validStudents = stats.studentGrades.filter((s) => s.overallGrade > 0)

      return {
        totalGradedStudents: acc.totalGradedStudents + validStudents.length,
        totalAverageGrade: acc.totalAverageGrade + stats.averageGrade,
        totalAssignments: acc.totalAssignments + stats.totalAssignments,
        classCount: acc.classCount + (validStudents.length > 0 ? 1 : 0),
        gradeDistribution: {
          A: acc.gradeDistribution.A + stats.gradeDistribution.A,
          B: acc.gradeDistribution.B + stats.gradeDistribution.B,
          C: acc.gradeDistribution.C + stats.gradeDistribution.C,
          D: acc.gradeDistribution.D + stats.gradeDistribution.D,
          F: acc.gradeDistribution.F + stats.gradeDistribution.F,
        },
      }
    },
    {
      totalGradedStudents: 0,
      totalAverageGrade: 0,
      totalAssignments: 0,
      classCount: 0,
      gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
    },
  )

  const overallAverage =
    overallGradeStats.classCount > 0 ? overallGradeStats.totalAverageGrade / overallGradeStats.classCount : 0

  const classesWithGradeStats = classes.map((c) => {
    const stats = calculateClassGradeStats(c, assignments, grades)
    return { ...c, averageGrade: stats.averageGrade, totalAssignments: stats.totalAssignments }
  })

  const topGradeClasses = [...classesWithGradeStats]
    .filter((c) => c.averageGrade > 0)
    .sort((a, b) => b.averageGrade - a.averageGrade)
    .slice(0, 5)

  return (
    <View className="flex-1 bg-[#101c22]">
      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-white mb-2">Analytics & Reports</Text>
        <Text className="text-base text-[#8b9faa] mb-6">View performance metrics and insights</Text>

        <View className="flex-row bg-[#192b33] rounded-xl p-1 mb-5">
          <TouchableOpacity
            onPress={() => setActiveTab("attendance")}
            className={`flex-1 py-3 rounded-lg ${activeTab === "attendance" ? "bg-[#13a4ec]" : ""}`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-center font-semibold ${activeTab === "attendance" ? "text-[#101c22]" : "text-[#8b9faa]"}`}
            >
              Attendance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("grades")}
            className={`flex-1 py-3 rounded-lg ${activeTab === "grades" ? "bg-[#13a4ec]" : ""}`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-center font-semibold ${activeTab === "grades" ? "text-[#101c22]" : "text-[#8b9faa]"}`}
            >
              Grades
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "attendance" ? (
          <>
            <Card className="mb-4">
              <View className="flex-row items-center gap-3 mb-4">
                <Ionicons name="bar-chart" size={24} color="#13a4ec" />
                <Text className="text-lg font-bold text-white">Overall Attendance</Text>
              </View>
              <View className="gap-3">
                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-sm text-[#8b9faa]">Average Attendance</Text>
                  <Text className="text-lg font-bold text-white">{averageAttendanceRate.toFixed(1)}%</Text>
                </View>
                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-sm text-[#8b9faa]">Total Students</Text>
                  <Text className="text-lg font-bold text-white">{overallStats.totalStudents}</Text>
                </View>
                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-sm text-[#8b9faa]">Total Classes</Text>
                  <Text className="text-lg font-bold text-white">{overallStats.classCount}</Text>
                </View>
                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-sm text-[#8b9faa]">Total Sessions</Text>
                  <Text className="text-lg font-bold text-white">{overallStats.totalSessions}</Text>
                </View>
              </View>
            </Card>

            <Card className="mb-4">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-3">
                  <Ionicons name="trophy" size={24} color="#10B981" />
                  <Text className="text-lg font-bold text-white">Top Classes by Attendance</Text>
                </View>
              </View>
              {topClasses.length > 0 ? (
                <View className="gap-3">
                  {topClasses.map((classItem, index) => (
                    <TouchableOpacity
                      key={classItem.id}
                      onPress={() => router.push(`/attendance-history/${classItem.id}`)}
                      activeOpacity={0.7}
                      className="flex-row justify-between items-center py-3 border-b border-[#325567]"
                    >
                      <View className="flex-row items-center gap-3">
                        <View className="w-8 h-8 bg-[#13a4ec]/20 rounded-full items-center justify-center">
                          <Text className="text-[#13a4ec] font-bold">{index + 1}</Text>
                        </View>
                        <View>
                          <Text className="text-white font-semibold">{classItem.name}</Text>
                          <Text className="text-[#8b9faa] text-xs">{classItem.section}</Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-[#13a4ec] font-bold text-lg">{classItem.attendanceRate.toFixed(1)}%</Text>
                        <Text className="text-[#8b9faa] text-xs">{classItem.sessions} sessions</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text className="text-sm text-[#8b9faa]">No attendance data yet. Start taking attendance!</Text>
              )}
            </Card>
          </>
        ) : (
          <>
            <Card className="mb-4">
              <View className="flex-row items-center gap-3 mb-4">
                <Ionicons name="school" size={24} color="#8B5CF6" />
                <Text className="text-lg font-bold text-white">Overall Grade Performance</Text>
              </View>
              <View className="gap-3">
                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-sm text-[#8b9faa]">Average Grade</Text>
                  <Text className="text-lg font-bold text-white">{overallAverage.toFixed(1)}%</Text>
                </View>
                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-sm text-[#8b9faa]">Graded Students</Text>
                  <Text className="text-lg font-bold text-white">{overallGradeStats.totalGradedStudents}</Text>
                </View>
                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-sm text-[#8b9faa]">Total Assignments</Text>
                  <Text className="text-lg font-bold text-white">{overallGradeStats.totalAssignments}</Text>
                </View>
                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-sm text-[#8b9faa]">Classes with Grades</Text>
                  <Text className="text-lg font-bold text-white">{overallGradeStats.classCount}</Text>
                </View>
              </View>
            </Card>

            <Card className="mb-4">
              <View className="flex-row items-center gap-3 mb-4">
                <Ionicons name="pie-chart" size={24} color="#F59E0B" />
                <Text className="text-lg font-bold text-white">Grade Distribution</Text>
              </View>
              {overallGradeStats.totalGradedStudents > 0 ? (
                <GradeDistributionChart distribution={overallGradeStats.gradeDistribution} />
              ) : (
                <Text className="text-sm text-[#8b9faa]">No grade data yet. Start grading students!</Text>
              )}
            </Card>

            <Card className="mb-4">
              <View className="flex-row items-center gap-3 mb-4">
                <Ionicons name="star" size={24} color="#10B981" />
                <Text className="text-lg font-bold text-white">Top Classes by Grade</Text>
              </View>
              {topGradeClasses.length > 0 ? (
                <View className="gap-3">
                  {topGradeClasses.map((classItem, index) => (
                    <TouchableOpacity
                      key={classItem.id}
                      onPress={() => router.push(`/grade-students/${classItem.id}`)}
                      activeOpacity={0.7}
                      className="flex-row justify-between items-center py-3 border-b border-[#325567]"
                    >
                      <View className="flex-row items-center gap-3">
                        <View className="w-8 h-8 bg-[#13a4ec]/20 rounded-full items-center justify-center">
                          <Text className="text-[#13a4ec] font-bold">{index + 1}</Text>
                        </View>
                        <View>
                          <Text className="text-white font-semibold">{classItem.name}</Text>
                          <Text className="text-[#8b9faa] text-xs">{classItem.section}</Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-[#13a4ec] font-bold text-lg">{classItem.averageGrade.toFixed(1)}%</Text>
                        <Text className="text-[#8b9faa] text-xs">{classItem.totalAssignments} assignments</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text className="text-sm text-[#8b9faa]">No grade data yet. Start grading students!</Text>
              )}
            </Card>
          </>
        )}

        <Card>
          <View className="flex-row items-center gap-3 mb-4">
            <Ionicons name="list" size={24} color="#F59E0B" />
            <Text className="text-lg font-bold text-white">All Classes</Text>
          </View>
          {classes.length > 0 ? (
            <View className="gap-2">
              {classes.map((classItem) => {
                const attendanceStats = getAttendanceStats(classItem.id)
                const gradeStats = calculateClassGradeStats(classItem, assignments, grades)
                return (
                  <TouchableOpacity
                    key={classItem.id}
                    onPress={() =>
                      router.push(
                        activeTab === "attendance"
                          ? `/attendance-history/${classItem.id}`
                          : `/grade-students/${classItem.id}`,
                      )
                    }
                    activeOpacity={0.7}
                    className="flex-row justify-between items-center py-3 border-b border-[#325567]"
                  >
                    <View>
                      <Text className="text-white font-medium">{classItem.name}</Text>
                      <Text className="text-[#8b9faa] text-xs">{classItem.section}</Text>
                    </View>
                    <View className="items-end">
                      {activeTab === "attendance" ? (
                        <>
                          <Text className="text-white font-semibold">
                            {attendanceStats.averageAttendance.toFixed(1)}%
                          </Text>
                          <Text className="text-[#8b9faa] text-xs">{attendanceStats.totalSessions} sessions</Text>
                        </>
                      ) : (
                        <>
                          <Text className="text-white font-semibold">{gradeStats.averageGrade.toFixed(1)}%</Text>
                          <Text className="text-[#8b9faa] text-xs">{gradeStats.totalAssignments} assignments</Text>
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          ) : (
            <Text className="text-sm text-[#8b9faa]">No classes yet</Text>
          )}
        </Card>
      </ScrollView>
    </View>
  )
}
