import { View, Text } from "react-native"

interface GradeDistributionChartProps {
  distribution: { A: number; B: number; C: number; D: number; F: number }
}

export function GradeDistributionChart({ distribution }: GradeDistributionChartProps) {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0)

  const grades = [
    { grade: "A", count: distribution.A, color: "#10B981" },
    { grade: "B", count: distribution.B, color: "#3B82F6" },
    { grade: "C", count: distribution.C, color: "#F59E0B" },
    { grade: "D", count: distribution.D, color: "#EF4444" },
    { grade: "F", count: distribution.F, color: "#DC2626" },
  ]

  const maxCount = Math.max(...Object.values(distribution), 1)

  return (
    <View className="gap-3">
      {grades.map(({ grade, count, color }) => {
        const percentage = total > 0 ? (count / total) * 100 : 0
        const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0

        return (
          <View key={grade} className="gap-2">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded items-center justify-center" style={{ backgroundColor: color }}>
                  <Text className="text-white font-bold">{grade}</Text>
                </View>
                <Text className="text-[#94a3b8] text-sm">{count} students</Text>
              </View>
              <Text className="text-white font-semibold">{percentage.toFixed(0)}%</Text>
            </View>
            <View className="h-2 bg-[#1a2730] rounded-full overflow-hidden">
              <View className="h-full rounded-full" style={{ width: `${barWidth}%`, backgroundColor: color }} />
            </View>
          </View>
        )
      })}
    </View>
  )
}
