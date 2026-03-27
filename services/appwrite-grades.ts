import { Client, Databases, ID, Query } from "react-native-appwrite"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { dedupRequest } from "../src/utils/requestDedup"

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "")

const databases = new Databases(client)

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || ""
const GRADES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_GRADES_COLLECTION_ID || ""
const CRITERIA_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_CRITERIA_COLLECTION_ID || ""

// Cache configuration
const CACHE_DURATION = 2 * 60 * 1000 // 2 minutes (frequently updated)
const getStudentGradesCacheKey = (studentId: string, classId: string) =>
  `@markme:grades_${studentId}_${classId}`
const getClassCriteriaCacheKey = (classId: string) => `@markme:criteria_${classId}`
const getCacheTimestampKey = (key: string) => `${key}_timestamp`

interface Grade {
  studentId: string
  classId: string
  assignmentId: string
  score: number
  maxScore: number
  criteriaBreakdown?: Record<string, number>
  gradedDate: string
}

interface GradingCriteria {
  classId: string
  name: string
  description?: string
  maxPoints: number
  weight?: number
}

export const gradesService = {
  // Save grade (0-100 scale)
  async saveGrade(grade: Grade): Promise<void> {
    try {
      console.log("Saving grade for student:", grade.studentId)

      await databases.createDocument(DATABASE_ID, GRADES_COLLECTION_ID, ID.unique(), {
        studentId: grade.studentId,
        classId: grade.classId,
        assignmentId: grade.assignmentId,
        score: grade.score,
        maxScore: grade.maxScore,
        criteriaBreakdown: JSON.stringify(grade.criteriaBreakdown || {}),
        gradedDate: grade.gradedDate,
        createdAt: new Date().toISOString(),
      })

      // Invalidate related caches
      await this.invalidateStudentGradesCache(grade.studentId, grade.classId)

      console.log("Grade saved successfully")
    } catch (error: any) {
      console.error("Save grade error:", error)
      throw new Error(error.message || "Failed to save grade")
    }
  },

  // Get grades for a student in a class (cached and deduped)
  async getStudentGrades(studentId: string, classId: string): Promise<Grade[]> {
    return dedupRequest(`grades:${studentId}:${classId}`, async () => {
      try {
        // Check cache first
        const cacheKey = getStudentGradesCacheKey(studentId, classId)
        const cachedGrades = await AsyncStorage.getItem(cacheKey)
        const cachedTimestamp = await AsyncStorage.getItem(getCacheTimestampKey(cacheKey))

        if (cachedGrades && cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp)
          if (age < CACHE_DURATION) {
            console.log(`Using cached grades for student ${studentId}`)
            return JSON.parse(cachedGrades)
          }
        }

        // Fetch from server if cache is missing or stale
        const documents = await databases.listDocuments(DATABASE_ID, GRADES_COLLECTION_ID, [
          Query.equal("studentId", studentId),
          Query.equal("classId", classId),
        ])

        const grades = documents.documents.map((doc: any) => ({
          studentId: doc.studentId,
          classId: doc.classId,
          assignmentId: doc.assignmentId,
          score: doc.score,
          maxScore: doc.maxScore,
          criteriaBreakdown: doc.criteriaBreakdown ? JSON.parse(doc.criteriaBreakdown) : {},
          gradedDate: doc.gradedDate,
        }))

        // Cache the results
        await AsyncStorage.setItem(cacheKey, JSON.stringify(grades))
        await AsyncStorage.setItem(getCacheTimestampKey(cacheKey), Date.now().toString())

        return grades
      } catch (error: any) {
        console.error("Get grades error:", error)
        // Return cached data on error if available
        const cacheKey = getStudentGradesCacheKey(studentId, classId)
        const cachedGrades = await AsyncStorage.getItem(cacheKey)
        if (cachedGrades) {
          console.warn("Using stale cache due to fetch error")
          return JSON.parse(cachedGrades)
        }
        return []
      }
    })
  },

  // Create grading criteria for a class
  async createCriteria(classId: string, criteria: GradingCriteria): Promise<void> {
    try {
      console.log("Creating criteria for class:", classId)

      await databases.createDocument(DATABASE_ID, CRITERIA_COLLECTION_ID, ID.unique(), {
        classId,
        name: criteria.name,
        description: criteria.description,
        maxPoints: criteria.maxPoints,
        weight: criteria.weight,
        createdAt: new Date().toISOString(),
      })

      // Invalidate cache after creating criteria
      await this.invalidateCriteriaCache(classId)

      console.log("Criteria created successfully")
    } catch (error: any) {
      console.error("Create criteria error:", error)
      throw new Error(error.message || "Failed to create criteria")
    }
  },

  // Get criteria for a class (cached and deduped)
  async getClassCriteria(classId: string): Promise<GradingCriteria[]> {
    return dedupRequest(`criteria:${classId}`, async () => {
      try {
        // Check cache first
        const cacheKey = getClassCriteriaCacheKey(classId)
        const cachedCriteria = await AsyncStorage.getItem(cacheKey)
        const cachedTimestamp = await AsyncStorage.getItem(getCacheTimestampKey(cacheKey))

        if (cachedCriteria && cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp)
          if (age < CACHE_DURATION) {
            console.log(`Using cached criteria for class ${classId}`)
            return JSON.parse(cachedCriteria)
          }
        }

        // Fetch from server if cache is missing or stale
        const documents = await databases.listDocuments(DATABASE_ID, CRITERIA_COLLECTION_ID, [
          Query.equal("classId", classId),
        ])

        const criteria = documents.documents.map((doc: any) => ({
          classId: doc.classId,
          name: doc.name,
          description: doc.description,
          maxPoints: doc.maxPoints,
          weight: doc.weight,
        }))

        // Cache the results
        await AsyncStorage.setItem(cacheKey, JSON.stringify(criteria))
        await AsyncStorage.setItem(getCacheTimestampKey(cacheKey), Date.now().toString())

        return criteria
      } catch (error: any) {
        console.error("Get criteria error:", error)
        // Return cached data on error if available
        const cacheKey = getClassCriteriaCacheKey(classId)
        const cachedCriteria = await AsyncStorage.getItem(cacheKey)
        if (cachedCriteria) {
          console.warn("Using stale cache due to fetch error")
          return JSON.parse(cachedCriteria)
        }
        return []
      }
    })
  },

  // Calculate average grade for a student in a class (0-100)
  async getStudentAverageGrade(studentId: string, classId: string): Promise<number> {
    try {
      const grades = await this.getStudentGrades(studentId, classId)

      if (grades.length === 0) return 0

      const totalPercentage = grades.reduce((sum, grade) => {
        const percentage = (grade.score / grade.maxScore) * 100
        return sum + percentage
      }, 0)

      const average = totalPercentage / grades.length
      return Math.round(average * 10) / 10
    } catch (error: any) {
      console.error("Calculate average error:", error)
      return 0
    }
  },

  // Cache invalidation methods
  async invalidateStudentGradesCache(studentId: string, classId: string): Promise<void> {
    const cacheKey = getStudentGradesCacheKey(studentId, classId)
    await AsyncStorage.removeItem(cacheKey)
    await AsyncStorage.removeItem(getCacheTimestampKey(cacheKey))
    console.log(`Invalidated grades cache for student ${studentId}`)
  },

  async invalidateCriteriaCache(classId: string): Promise<void> {
    const cacheKey = getClassCriteriaCacheKey(classId)
    await AsyncStorage.removeItem(cacheKey)
    await AsyncStorage.removeItem(getCacheTimestampKey(cacheKey))
    console.log(`Invalidated criteria cache for class ${classId}`)
  },

  async clearAllCache(): Promise<void> {
    const allKeys = await AsyncStorage.getAllKeys()
    const gradesCacheKeys = allKeys.filter((key) => key.startsWith("@markme:grades") || key.startsWith("@markme:criteria"))
    await AsyncStorage.multiRemove(gradesCacheKeys)
    console.log("Cleared all grades and criteria cache")
  },
}
