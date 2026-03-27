"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { appwriteAuth } from "@/../services/appwrite-auth"

interface TeacherProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  title?: string
  phone?: string
  avatar?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: TeacherProfile | null
  isLoading: boolean
  signUp: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<TeacherProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<TeacherProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Check if session is active
      const isActive = await appwriteAuth.isSessionActive()
      if (isActive) {
        // Fetch user (now uses cache to prevent double API call)
        const currentUser = await appwriteAuth.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          setIsAuthenticated(true)
        }
      }
    } catch (error) {
      console.error("Auth status check error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    try {
      setIsLoading(true)
      const result = await appwriteAuth.signUp(data)
      console.log("Signup complete, user:", result.userId)
      // User needs to log in after signup
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      // Login now returns the profile to avoid double API call
      const result = await appwriteAuth.login(email, password)
      
      // Use the profile from login response if available, otherwise fetch it
      let currentUser = result.profile
      if (!currentUser) {
        currentUser = await appwriteAuth.getCurrentUser()
      }
      
      if (currentUser) {
        setUser(currentUser)
        setIsAuthenticated(true)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await appwriteAuth.logout()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateProfile = async (updates: Partial<TeacherProfile>) => {
    try {
      if (!user) return
      await appwriteAuth.updateProfile(user.id, updates)
      setUser({ ...user, ...updates })
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        signUp,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
