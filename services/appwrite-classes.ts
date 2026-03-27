import { ID, Query } from "react-native-appwrite"
import { database } from "./appwrite"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Class } from "@/interfaces/interface"

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!
const CLASSES_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_CLASSES_COLLECTION_ID!

// Cache keys and duration
const CACHE_KEY = "@markme:classes_cache"
const CACHE_TIMESTAMP_KEY = "@markme:classes_cache_timestamp"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * IMPORTANT SCHEMA NOTES (Appwrite Console):
 * ----------------------------------------
 * students           → string (JSON array)
 * gradingCriteria    → string (JSON array)
 * assignments        → string (JSON array)
 * parentGroupId      → string | null
 */

export const classesService = {
  /* ---------------- CREATE ---------------- */
  async createClass(classData: Omit<Class, "id">): Promise<Class> {
    try {
      const response = await database.createDocument(
        DATABASE_ID,
        CLASSES_COLLECTION_ID,
        ID.unique(),
        {
          name: classData.name,
          subject: classData.subject,
          time: classData.time,
          room: classData.room,
          studentCount: classData.students?.length ?? 0,
          image: classData.image,
          semester: classData.semester,
          parentGroupId: classData.parentGroupId ?? null,

          // Store arrays as JSON strings
          students: JSON.stringify(classData.students ?? []),
          gradingCriteria: JSON.stringify(classData.gradingCriteria ?? []),
          assignments: JSON.stringify(classData.assignments ?? []),
        }
      )

      // Invalidate cache after creating new class
      await this.invalidateCache()

      return mapDocumentToClass(response)
    } catch (error) {
      console.error("Create class failed:", error)
      throw new Error("Failed to create class")
    }
  },

  /* ---------------- READ ---------------- */
  async getClasses(): Promise<Class[]> {
    try {
      // Check cache first
      const cachedClasses = await AsyncStorage.getItem(CACHE_KEY)
      const cachedTimestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY)

      if (cachedClasses && cachedTimestamp) {
        const age = Date.now() - parseInt(cachedTimestamp)
        if (age < CACHE_DURATION) {
          console.log("Using cached classes")
          return JSON.parse(cachedClasses)
        }
      }

      // Fetch from server if cache is missing or stale
      const response = await database.listDocuments(
        DATABASE_ID,
        CLASSES_COLLECTION_ID
      )

      const classes = response.documents.map(mapDocumentToClass)

      // Cache the results
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(classes))
      await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())

      return classes
    } catch (error) {
      console.error("Fetch classes failed:", error)
      // Return cached data on error if available
      const cachedClasses = await AsyncStorage.getItem(CACHE_KEY)
      if (cachedClasses) {
        console.warn("Using stale cache due to fetch error")
        return JSON.parse(cachedClasses)
      }
      throw new Error("Failed to fetch classes")
    }
  },

  async getClassById(classId: string): Promise<Class | null> {
    try {
      const response = await database.getDocument(
        DATABASE_ID,
        CLASSES_COLLECTION_ID,
        classId
      )
      return mapDocumentToClass(response)
    } catch (error) {
      console.warn("Class not found:", classId)
      return null
    }
  },

  async getClassesByTeacher(teacherId: string): Promise<Class[]> {
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
        CLASSES_COLLECTION_ID,
        [Query.equal("parentGroupId", teacherId)]
      )

      return response.documents.map(mapDocumentToClass)
    } catch (error) {
      console.error("Fetch teacher classes failed:", error)
      throw new Error("Failed to fetch teacher classes")
    }
  },

  /* ---------------- UPDATE ---------------- */
  async updateClass(classId: string, updates: Partial<Class>): Promise<Class> {
    try {
      const payload: any = {}

      if (updates.name !== undefined) payload.name = updates.name
      if (updates.subject !== undefined) payload.subject = updates.subject
      if (updates.time !== undefined) payload.time = updates.time
      if (updates.room !== undefined) payload.room = updates.room
      if (updates.studentCount !== undefined)
        payload.studentCount = updates.studentCount
      if (updates.image !== undefined) payload.image = updates.image
      if (updates.semester !== undefined) payload.semester = updates.semester
      if (updates.parentGroupId !== undefined)
        payload.parentGroupId = updates.parentGroupId

      // Convert arrays to strings before sending to Appwrite
      if (updates.students) payload.students = JSON.stringify(updates.students)
      if (updates.gradingCriteria)
        payload.gradingCriteria = JSON.stringify(updates.gradingCriteria)
      if (updates.assignments)
        payload.assignments = JSON.stringify(updates.assignments)

      const response = await database.updateDocument(
        DATABASE_ID,
        CLASSES_COLLECTION_ID,
        classId,
        payload
      )

      // Invalidate cache after updating class
      await this.invalidateCache()

      return mapDocumentToClass(response)
    } catch (error) {
      console.error("Update class failed:", error)
      throw new Error("Failed to update class")
    }
  },

  /* ---------------- DELETE ---------------- */
  async deleteClass(classId: string): Promise<void> {
    try {
      await database.deleteDocument(DATABASE_ID, CLASSES_COLLECTION_ID, classId)
      // Invalidate cache on delete
      await this.invalidateCache()
    } catch (error) {
      console.error("Delete class failed:", error)
      throw new Error("Failed to delete class")
    }
  },

  /* ---------------- CACHE MANAGEMENT ---------------- */
  async invalidateCache(): Promise<void> {
    await AsyncStorage.removeItem(CACHE_KEY)
    await AsyncStorage.removeItem(CACHE_TIMESTAMP_KEY)
    console.log("Classes cache invalidated")
  },

  async clearCache(): Promise<void> {
    await AsyncStorage.removeItem(CACHE_KEY)
    await AsyncStorage.removeItem(CACHE_TIMESTAMP_KEY)
  },
}

/* ---------------- MAPPERS ---------------- */
function mapDocumentToClass(doc: any): Class {
  return {
    id: doc.$id,
    name: doc.name,
    subject: doc.subject,
    time: doc.time,
    room: doc.room,
    studentCount: doc.studentCount,
    image: doc.image,
    semester: doc.semester,
    parentGroupId: doc.parentGroupId ?? null,

    students: safeParse(doc.students),
    gradingCriteria: safeParse(doc.gradingCriteria),
    assignments: safeParse(doc.assignments),
  }
}

function safeParse(value: any) {
  try {
    return value ? JSON.parse(value) : []
  } catch {
    return []
  }
}
