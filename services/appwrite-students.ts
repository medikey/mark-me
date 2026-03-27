import { ID, Query } from "react-native-appwrite"
import { database } from "./appwrite"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { dedupRequest } from "../src/utils/requestDedup"
import type { Student } from "@/interfaces/interface"

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!
const STUDENTS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_STUDENTS_COLLECTION_ID!

// Cache configuration
const CACHE_DURATION = 3 * 60 * 1000 // 3 minutes (more frequent updates than classes)
const getCacheKey = (classId: string) => `@markme:students_${classId}`
const getCacheTimestampKey = (classId: string) => `@markme:students_timestamp_${classId}`

export const studentsService = {
  async addStudent(classId: string, student: Omit<Student, "id">): Promise<Student> {
    try {
      const response = await database.createDocument(DATABASE_ID, STUDENTS_COLLECTION_ID, ID.unique(), {
        ...student,
        classId,
        grades: student.grades ? JSON.stringify(student.grades) : JSON.stringify({}),
      })
      // Invalidate cache after adding student
      await this.invalidateClassCache(classId)
      return this.mapDocumentToStudent(response as any)
    } catch (error) {
      throw new Error(`Failed to add student: ${error}`)
    }
  },

  async getStudentsByClass(classId: string): Promise<Student[]> {
    return dedupRequest(`students:${classId}`, async () => {
      try {
        // Check cache first
        const cacheKey = getCacheKey(classId)
        const cachedStudents = await AsyncStorage.getItem(cacheKey)
        const cachedTimestamp = await AsyncStorage.getItem(getCacheTimestampKey(classId))

        if (cachedStudents && cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp)
          if (age < CACHE_DURATION) {
            console.log(`Using cached students for class ${classId}`)
            return JSON.parse(cachedStudents)
          }
        }

        // Fetch from server if cache is missing or stale
        const response = await database.listDocuments(DATABASE_ID, STUDENTS_COLLECTION_ID, [
          Query.equal("classId", classId),
        ])
        const students = response.documents.map((doc) => this.mapDocumentToStudent(doc as any))

        // Cache the results
        await AsyncStorage.setItem(cacheKey, JSON.stringify(students))
        await AsyncStorage.setItem(getCacheTimestampKey(classId), Date.now().toString())

        return students
      } catch (error) {
        // Return cached data on error if available
        const cacheKey = getCacheKey(classId)
        const cachedStudents = await AsyncStorage.getItem(cacheKey)
        if (cachedStudents) {
          console.warn(`Using stale cache for class ${classId} due to fetch error`)
          return JSON.parse(cachedStudents)
        }
        throw new Error(`Failed to fetch students: ${error}`)
      }
    })
  },

  async updateStudent(studentId: string, updates: Partial<Student>, classId?: string): Promise<Student> {
    try {
      const data: any = { ...updates }
      if (updates.grades) data.grades = JSON.stringify(updates.grades)

      const response = await database.updateDocument(DATABASE_ID, STUDENTS_COLLECTION_ID, studentId, data)
      
      // Invalidate cache if classId is provided
      if (classId) {
        await this.invalidateClassCache(classId)
      }
      
      return this.mapDocumentToStudent(response as any)
    } catch (error) {
      throw new Error(`Failed to update student: ${error}`)
    }
  },

  async deleteStudent(studentId: string, classId?: string): Promise<void> {
    try {
      await database.deleteDocument(DATABASE_ID, STUDENTS_COLLECTION_ID, studentId)
      
      // Invalidate cache if classId is provided
      if (classId) {
        await this.invalidateClassCache(classId)
      }
    } catch (error) {
      throw new Error(`Failed to delete student: ${error}`)
    }
  },

  mapDocumentToStudent(doc: any): Student {
    return {
      id: doc.$id,
      name: doc.name,
      avatar: doc.avatar,
      status: doc.status || "present",
      grades: doc.grades ? JSON.parse(doc.grades) : {},
    }
  },

  async invalidateClassCache(classId: string): Promise<void> {
    await AsyncStorage.removeItem(getCacheKey(classId))
    await AsyncStorage.removeItem(getCacheTimestampKey(classId))
    console.log(`Invalidated students cache for class ${classId}`)
  },

  async clearAllCache(): Promise<void> {
    const allKeys = await AsyncStorage.getAllKeys()
    const studentCacheKeys = allKeys.filter((key) => key.startsWith("@markme:students"))
    await AsyncStorage.multiRemove(studentCacheKeys)
    console.log("Cleared all students cache")
  },
}
