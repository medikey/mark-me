import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Class, Assignment, StudentGrade, UserProfile } from "@/interfaces/interface"

const STORAGE_KEYS = {
  AUTH: "@markme:auth",
  CLASSES: "@markme:classes",
  ASSIGNMENTS: "@markme:assignments",
  GRADES: "@markme:grades",
  USER_PROFILE: "@markme:userProfile",  
  ONBOARDING: "@markme:hasSeenOnboarding",
}

export const storage = {
  // Authentication
  async saveAuth(isAuthenticated: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated))
    } catch (error) {
      console.error("Error saving auth state:", error)
    }
  },

  async getAuth(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.AUTH)
      return value ? JSON.parse(value) : false
    } catch (error) {
      console.error("Error loading auth state:", error)
      return false
    }
  },

    // Onboarding helper methods
  /**
   * Marks onboarding as complete
   * Called when user completes onboarding or signs up/logs in
   */
  async setOnboardingComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, "true")
    } catch (error) {
      console.error("Error saving onboarding state:", error)
    }
  },
  
  /**
   * Resets onboarding state (useful for testing)
   * Allows user to see onboarding screens again
   */
  async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING)
    } catch (error) {
      console.error("Error resetting onboarding state:", error)
    }
  },

  // Classes
  async saveClasses(classes: Class[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes))
    } catch (error) {
      console.error("Error saving classes:", error)
    }
  },

  async getClasses(): Promise<Class[] | null> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.CLASSES)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error("Error loading classes:", error)
      return null
    }
  },

  // Assignments
  async saveAssignments(assignments: Assignment[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments))
    } catch (error) {
      console.error("Error saving assignments:", error)
    }
  },

  async getAssignments(): Promise<Assignment[] | null> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error("Error loading assignments:", error)
      return null
    }
  },

  // Grades
  async saveGrades(grades: StudentGrade[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades))
    } catch (error) {
      console.error("Error saving grades:", error)
    }
  },

  async getGrades(): Promise<StudentGrade[] | null> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.GRADES)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error("Error loading grades:", error)
      return null
    }
  },

  // User Profile
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile))
    } catch (error) {
      console.error("Error saving user profile:", error)
    }
  },

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error("Error loading user profile:", error)
      return null
    }
  },

  async saveItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`@markme:${key}`, value)
    } catch (error) {
      console.error(`Error saving ${key}:`, error)
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(`@markme:${key}`)
    } catch (error) {
      console.error(`Error loading ${key}:`, error)
      return null
    }
  },

  // Clear all data (for logout)
  async clearAll(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys()
      const markmeKeys = allKeys.filter((key) => key.startsWith("@markme:"))
      await AsyncStorage.multiRemove(markmeKeys)
    } catch (error) {
      console.error("Error clearing storage:", error)
    }
  },
}
