"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockClasses } from "@/constants/data"
import { storage } from "@/utils/storage"
import type {
  AppContextType,
  Class,
  UserProfile,
  Student,
  Assignment,
  GradingCriterion,
  StudentGrade,
  AttendanceRecord,
  ClassGroup,
} from "@/interfaces/interface"
import {
  getGroupChildren,
  getRootItems,
  getAllGroupAncestors,
  getAllGroupDescendants,
  getGroupItemCounts,
} from "@/utils/group"
import { classesService } from "@/../services/appwrite-classes"
import { classGroupsService } from "@/../services/appwrite-class-groups"
import { attendanceService } from "@/../services/appwrite-attendance"
import { gradesService } from "@/../services/appwrite-grades"
import { useAuth } from "@/contexts/AuthContext"

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [classes, setClasses] = useState<Class[]>([])
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [grades, setGrades] = useState<StudentGrade[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    title: "Teacher",
    email: "",
    phone: "",
    avatar: "",
  })

  /* ---------------- AUTH ---------------- */

  useEffect(() => {
    if (authUser) {
      setUserProfile((prev) => ({
        ...prev,
        name: `${authUser.firstName} ${authUser.lastName}`,
        email: authUser.email,
        phone: authUser.phone || "",
        avatar: authUser.avatar || "https://i.pravatar.cc/100?img=5",
        title: authUser.title || "Teacher",
      }))
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [authUser])

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    loadPersistedData()
  }, [])

  const loadPersistedData = async () => {
    try {
      setIsLoading(true)

      const [appwriteClasses, appwriteGroups] = await Promise.all([
        classesService.getClasses().catch(() => []),
        classGroupsService.getGroups().catch(() => []),
      ])

      setClasses(appwriteClasses.length ? appwriteClasses : mockClasses)
      setClassGroups(appwriteGroups)

      const [savedAssignments, savedProfile] = await Promise.all([
        storage.getAssignments(),
        storage.getUserProfile(),
      ])

      setAssignments(savedAssignments || [])
      if (savedProfile && !authUser) setUserProfile(savedProfile)
    } catch (err) {
      console.error("Load failed:", err)
      setClasses(mockClasses)
    } finally {
      setIsLoading(false)
    }
  }

  /* ---------------- SYNC CLASSES (FIXED) ---------------- */

  useEffect(() => {
    if (isLoading) return

    const syncClasses = async () => {
      try {
        for (const c of classes) {
          // CREATE
          if (!c.appwriteId) {
            const created = await classesService.createClass(c)
            setClasses((prev) =>
              prev.map((cls) =>
                cls.id === c.id
                  ? { ...cls, appwriteId: created.appwriteId }
                  : cls
              )
            )
          }
          // UPDATE
          else {
            await classesService.updateClass(c.appwriteId, c)
          }
        }
      } catch (err) {
        console.error("Failed to sync classes:", err)
      }
    }

    syncClasses()
  }, [classes, isLoading])

  /* ---------------- STUDENTS ---------------- */

  const updateStudentStatus = (classId: string, studentId: string, status: "present" | "absent") => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? { ...c, students: c.students.map((s) => (s.id === studentId ? { ...s, status } : s)) }
          : c
      )
    )
  }

  const addStudent = (classId: string, student: Student) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? { ...c, students: [...c.students, student], studentCount: c.studentCount + 1 }
          : c
      )
    )
  }

  const updateStudent = (classId: string, studentId: string, updates: Partial<Student>) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? { ...c, students: c.students.map((s) => (s.id === studentId ? { ...s, ...updates } : s)) }
          : c
      )
    )
  }

  const deleteStudent = (classId: string, studentId: string) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? {
              ...c,
              students: c.students.filter((s) => s.id !== studentId),
              studentCount: c.studentCount - 1,
            }
          : c
      )
    )
  }

  /* ---------------- CLASS CRUD ---------------- */

  const updateClass = (classId: string, updates: Partial<Class>) => {
    setClasses((prev) => prev.map((c) => (c.id === classId ? { ...c, ...updates } : c)))
  }

  const deleteClass = (classId: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId))
  }

  /* ---------------- ATTENDANCE ---------------- */

  useEffect(() => {
    if (isLoading) return

    attendanceRecords.forEach((r) => {
      r.studentRecords.forEach((sr) => {
        attendanceService.saveAttendanceRecord({
          classId: r.classId,
          studentId: sr.studentId,
          date: r.date,
          status: sr.status,
        })
      })
    })
  }, [attendanceRecords, isLoading])

  /* ---------------- GRADES ---------------- */

  useEffect(() => {
    if (isLoading) return

    grades.forEach((g) => {
      gradesService.saveGrade({
        studentId: g.studentId,
        classId: g.classId,
        assignmentId: g.assignmentId,
        score: g.score,
        maxScore: g.maxScore,
        gradedDate: new Date().toISOString(),
      })
    })
  }, [grades, isLoading])

  /* ---------------- PROVIDER ---------------- */

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        classes,
        setClasses,
        classGroups,
        setClassGroups,
        assignments,
        grades,
        attendanceRecords,
        isLoading,
        userProfile,
        updateUserProfile: (p) => setUserProfile((prev) => ({ ...prev, ...p })),
        deleteClass,
        updateClass,
        updateStudentStatus,
        addStudent,
        updateStudent,
        deleteStudent,
        logout: async () => {
          await storage.saveAuth(false)
          setIsAuthenticated(false)
        },
        getGroupChildren: (id) => getGroupChildren(id, classGroups, classes),
        getRootItems: () => getRootItems(classGroups, classes),
        getAllGroupAncestors: (id) => getAllGroupAncestors(id, classGroups),
        getAllGroupDescendants: (id) => getAllGroupDescendants(id, classGroups),
        getGroupItemCounts: (id) => getGroupItemCounts(id, classGroups),
        saveGrade: () => {},
        getStudentGrades: () => [],
        addAssignment: () => {},
        updateGradingCriteria: () => {},
        saveAttendanceRecord: () => {},
        getAttendanceHistory: () => [],
        getStudentAttendanceHistory: () => [],
        getAttendanceStats: () => ({
          totalSessions: 0,
          averageAttendance: 0,
          studentStats: [],
        }),
        createClassGroup: () => {
          throw new Error("Handled elsewhere")
        },
        updateClassGroup: () => {},
        deleteClassGroup: () => {},
        addItemsToGroup: () => {},
        removeItemFromGroup: () => {},
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
