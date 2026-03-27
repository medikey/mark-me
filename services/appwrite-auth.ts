import { Client, Account, Databases, ID } from "react-native-appwrite"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { dedupRequest } from "../src/utils/requestDedup"
import { parseAppwriteError, logAppwriteError } from "../src/utils/appwriteErrorHandler"

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "")

const account = new Account(client)
const databases = new Databases(client)

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || ""
const USERS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID || ""

// Cache keys
const CACHE_KEYS = {
  USER_PROFILE: "@markme:user_profile_cache",
  USER_PROFILE_TIMESTAMP: "@markme:user_profile_timestamp",
  SESSION_CHECK_TIMESTAMP: "@markme:session_check_timestamp",
}

interface TeacherData {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface TeacherProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  title?: string
  phone?: string
  avatar?: string
  createdAt: string
}

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000

export const appwriteAuth = {
  // Sign up new teacher account
  async signUp(data: TeacherData): Promise<{ userId: string; email: string }> {
    try {
      console.log("Starting teacher signup for:", data.email)

      // Create user in Appwrite Auth
      const user = await account.create(ID.unique(), data.email, data.password, `${data.firstName} ${data.lastName}`)

      // Create user profile in database
      await databases.createDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id, {
        userId: user.$id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: "teacher",
        createdAt: new Date().toISOString(),
      })

      // Cache the user profile
      const profile = {
        id: user.$id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        title: "Teacher",
        phone: "",
        avatar: "",
        createdAt: new Date().toISOString(),
      }
      await AsyncStorage.setItem(CACHE_KEYS.USER_PROFILE, JSON.stringify(profile))
      await AsyncStorage.setItem(CACHE_KEYS.USER_PROFILE_TIMESTAMP, Date.now().toString())

      console.log("Teacher signup successful:", user.$id)
      return { userId: user.$id, email: user.email }
    } catch (error: any) {
      logAppwriteError("Signup error", error)
      const parsed = parseAppwriteError(error)
      throw new Error(parsed.message)
    }
  },

  // Login teacher
  async login(email: string, password: string): Promise<{ userId: string; email: string; profile?: TeacherProfile }> {
    try {
      console.log("Starting login for:", email)

      const session = await account.createEmailPasswordSession(email, password)

      // Fetch full profile in the same call to reduce API requests
      let profile: TeacherProfile | null = null
      try {
        const profileDoc = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, session.userId)
        profile = {
          id: profileDoc.userId,
          firstName: profileDoc.firstName,
          lastName: profileDoc.lastName,
          email: profileDoc.email,
          title: profileDoc.title || "Teacher",
          phone: profileDoc.phone || "",
          avatar: profileDoc.avatar || "",
          createdAt: profileDoc.createdAt,
        }

        // Cache the profile to reduce future API calls
        await AsyncStorage.setItem(CACHE_KEYS.USER_PROFILE, JSON.stringify(profile))
        await AsyncStorage.setItem(CACHE_KEYS.USER_PROFILE_TIMESTAMP, Date.now().toString())
      } catch (err) {
        logAppwriteError("Failed to fetch profile during login", err)
      }

      console.log("Login successful:", session.userId)
      return { userId: session.userId, email: email, profile: profile || undefined }
    } catch (error: any) {
      logAppwriteError("Login error", error)
      const parsed = parseAppwriteError(error)
      throw new Error(parsed.message)
    }
  },

  // Get current logged-in user with caching and dedup
  async getCurrentUser(): Promise<TeacherProfile | null> {
    return dedupRequest("auth:getCurrentUser", async () => {
      try {
        // Check cache first
        const cachedProfile = await AsyncStorage.getItem(CACHE_KEYS.USER_PROFILE)
        const cachedTimestamp = await AsyncStorage.getItem(CACHE_KEYS.USER_PROFILE_TIMESTAMP)

        if (cachedProfile && cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp)
          if (age < CACHE_DURATION) {
            console.log("Using cached user profile")
            return JSON.parse(cachedProfile)
          }
        }

        // Fetch from server if not cached
        const user = await account.get()
        const profileDoc = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id)

        const profile = {
          id: profileDoc.userId,
          firstName: profileDoc.firstName,
          lastName: profileDoc.lastName,
          email: profileDoc.email,
          title: profileDoc.title,
          phone: profileDoc.phone,
          avatar: profileDoc.avatar,
          createdAt: profileDoc.createdAt,
        }

        // Update cache
        await AsyncStorage.setItem(CACHE_KEYS.USER_PROFILE, JSON.stringify(profile))
        await AsyncStorage.setItem(CACHE_KEYS.USER_PROFILE_TIMESTAMP, Date.now().toString())

        return profile
      } catch (error) {
        console.log("No active session or failed to fetch profile")
        // Clear cache on error
        await AsyncStorage.removeItem(CACHE_KEYS.USER_PROFILE)
        await AsyncStorage.removeItem(CACHE_KEYS.USER_PROFILE_TIMESTAMP)
        return null
      }
    })
  },

  // Logout teacher
  async logout(): Promise<void> {
    try {
      await account.deleteSession("current")
      // Clear cache on logout
      await AsyncStorage.removeItem(CACHE_KEYS.USER_PROFILE)
      await AsyncStorage.removeItem(CACHE_KEYS.USER_PROFILE_TIMESTAMP)
      console.log("Logout successful")
    } catch (error: any) {
      console.error("Logout error:", error)
    }
  },

  // Update teacher profile
  async updateProfile(userId: string, updates: Partial<TeacherProfile>): Promise<void> {
    try {
      await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, userId, updates)
      
      // Update cache with new data
      const cachedProfile = await AsyncStorage.getItem(CACHE_KEYS.USER_PROFILE)
      if (cachedProfile) {
        const profile = { ...JSON.parse(cachedProfile), ...updates }
        await AsyncStorage.setItem(CACHE_KEYS.USER_PROFILE, JSON.stringify(profile))
      }

      console.log("Profile updated")
    } catch (error: any) {
      console.error("Update profile error:", error)
      throw new Error(error.message || "Failed to update profile")
    }
  },

  // Check if session exists (optimized - no double API call, deduped)
  async isSessionActive(): Promise<boolean> {
    return dedupRequest("auth:isSessionActive", async () => {
      try {
        // First check if we have a cached profile that's still fresh
        const cachedTimestamp = await AsyncStorage.getItem(CACHE_KEYS.USER_PROFILE_TIMESTAMP)
        if (cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp)
          if (age < CACHE_DURATION) {
            console.log("Session valid (cached)")
            return true
          }
        }

        // If cache is stale, do a lightweight session check
        await account.get()
        return true
      } catch {
        return false
      }
    })
  },

  // Clear cache manually if needed
  async clearCache(): Promise<void> {
    await AsyncStorage.removeItem(CACHE_KEYS.USER_PROFILE)
    await AsyncStorage.removeItem(CACHE_KEYS.USER_PROFILE_TIMESTAMP)
  },
}
