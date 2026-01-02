// "use client"

// import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
// import { mockClasses } from "@/constants/data"
// import { storage } from "@/utils/storage"
// import type {
//   AppContextType,
//   Class,
//   UserProfile,
//   Student,
//   Assignment,
//   GradingCriterion,
//   StudentGrade,
//   AttendanceRecord,
// } from "@/interfaces/interface"

// const AppContext = createContext<AppContextType | undefined>(undefined)

// export function AppProvider({ children }: { children: ReactNode }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [classes, setClasses] = useState<Class[]>([])
//   const [assignments, setAssignments] = useState<Assignment[]>([])
//   const [grades, setGrades] = useState<StudentGrade[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])

//   const [userProfile, setUserProfile] = useState<UserProfile>({
//     name: "Alex Johnson",
//     title: "Senior Mathematics Teacher",
//     email: "alex.johnson@school.edu",
//     phone: "+1 (555) 123-4567",
//     avatar: "https://i.pravatar.cc/100?img=5",
//   })

//   useEffect(() => {
//     loadPersistedData()
//   }, [])

//   const loadPersistedData = async () => {
//     try {
//       setIsLoading(true)

//       const [savedAuth, savedClasses, savedAssignments, savedGrades, savedProfile, savedAttendance] = await Promise.all(
//         [
//           storage.getAuth(),
//           storage.getClasses(),
//           storage.getAssignments(),
//           storage.getGrades(),
//           storage.getUserProfile(),
//           storage.getItem("attendanceRecords"),
//         ],
//       )

//       setIsAuthenticated(savedAuth)
//       setClasses(savedClasses || mockClasses)
//       setAssignments(savedAssignments || [])
//       setGrades(savedGrades || [])
//       setAttendanceRecords(savedAttendance ? JSON.parse(savedAttendance) : [])

//       if (savedProfile) {
//         setUserProfile(savedProfile)
//       }
//     } catch (error) {
//       console.error("Error loading persisted data:", error)
//       setClasses(mockClasses)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (!isLoading) {
//       storage.saveAuth(isAuthenticated)
//     }
//   }, [isAuthenticated, isLoading])

//   useEffect(() => {
//     if (!isLoading) {
//       storage.saveClasses(classes)
//     }
//   }, [classes, isLoading])

//   useEffect(() => {
//     if (!isLoading) {
//       storage.saveAssignments(assignments)
//     }
//   }, [assignments, isLoading])

//   useEffect(() => {
//     if (!isLoading) {
//       storage.saveGrades(grades)
//     }
//   }, [grades, isLoading])

//   useEffect(() => {
//     if (!isLoading) {
//       storage.saveUserProfile(userProfile)
//     }
//   }, [userProfile, isLoading])

//   useEffect(() => {
//     if (!isLoading) {
//       storage.saveItem("attendanceRecords", JSON.stringify(attendanceRecords))
//     }
//   }, [attendanceRecords, isLoading])

//   const updateStudentStatus = (classId: string, studentId: string, status: "present" | "absent") => {
//     setClasses((prev) =>
//       prev.map((c) =>
//         c.id === classId
//           ? {
//               ...c,
//               students: c.students.map((s) => (s.id === studentId ? { ...s, status } : s)),
//             }
//           : c,
//       ),
//     )
//   }

//   const updateUserProfile = (profile: Partial<UserProfile>) => {
//     setUserProfile((prev) => {
//       const updated = { ...prev, ...profile }
//       return updated
//     })
//   }

//   const deleteClass = (classId: string) => {
//     setClasses((prev) => prev.filter((c) => c.id !== classId))
//   }

//   const updateClass = (classId: string, updates: Partial<Class>) => {
//     setClasses((prev) => prev.map((c) => (c.id === classId ? { ...c, ...updates } : c)))
//   }

//   const addStudent = (classId: string, student: Student) => {
//     setClasses((prev) =>
//       prev.map((c) =>
//         c.id === classId
//           ? {
//               ...c,
//               students: [...c.students, student],
//               studentCount: c.studentCount + 1,
//             }
//           : c,
//       ),
//     )
//   }

//   const updateStudent = (classId: string, studentId: string, updates: Partial<Student>) => {
//     setClasses((prev) =>
//       prev.map((c) =>
//         c.id === classId
//           ? {
//               ...c,
//               students: c.students.map((s) => (s.id === studentId ? { ...s, ...updates } : s)),
//             }
//           : c,
//       ),
//     )
//   }

//   const deleteStudent = (classId: string, studentId: string) => {
//     setClasses((prev) =>
//       prev.map((c) =>
//         c.id === classId
//           ? {
//               ...c,
//               students: c.students.filter((s) => s.id !== studentId),
//               studentCount: c.studentCount - 1,
//             }
//           : c,
//       ),
//     )
//   }

//   const saveGrade = (classId: string, assignmentId: string, grade: StudentGrade) => {
//     setGrades((prev) => {
//       const existing = prev.findIndex((g) => g.studentId === grade.studentId && g.assignmentId === assignmentId)
//       if (existing >= 0) {
//         const updated = [...prev]
//         updated[existing] = grade
//         return updated
//       }
//       return [...prev, grade]
//     })
//   }

//   const getStudentGrades = (classId: string, studentId: string): StudentGrade[] => {
//     const classAssignments = assignments.filter((a) => a.classId === classId)
//     const assignmentIds = classAssignments.map((a) => a.id)
//     return grades.filter((g) => g.studentId === studentId && assignmentIds.includes(g.assignmentId))
//   }

//   const addAssignment = (classId: string, assignment: Assignment) => {
//     setAssignments((prev) => [...prev, assignment])
//   }

//   const updateGradingCriteria = (classId: string, criteria: GradingCriterion[]) => {
//     setClasses((prev) => prev.map((c) => (c.id === classId ? { ...c, gradingCriteriaNew: criteria } : c)))
//   }

//   const logout = async () => {
//     await storage.saveAuth(false)
//     setIsAuthenticated(false)
//     // Note: Removed storage.clearAll() to preserve user's classes, assignments, grades, and profile
//   }

//   const saveAttendanceRecord = (classId: string, date: string) => {
//     const classItem = classes.find((c) => c.id === classId)
//     if (!classItem) return

//     const recordId = `${classId}-${date}`
//     const studentRecords = classItem.students.map((s) => ({
//       studentId: s.id,
//       status: s.status,
//     }))

//     setAttendanceRecords((prev) => {
//       const existingIndex = prev.findIndex((r) => r.id === recordId)
//       if (existingIndex >= 0) {
//         const updated = [...prev]
//         updated[existingIndex] = { id: recordId, classId, date, studentRecords }
//         return updated
//       }
//       return [...prev, { id: recordId, classId, date, studentRecords }]
//     })
//   }

//   const getAttendanceHistory = (classId: string): AttendanceRecord[] => {
//     return attendanceRecords.filter((r) => r.classId === classId).sort((a, b) => b.date.localeCompare(a.date))
//   }

//   const getStudentAttendanceHistory = (studentId: string, classId: string): AttendanceRecord[] => {
//     return attendanceRecords
//       .filter((r) => r.classId === classId && r.studentRecords.some((sr) => sr.studentId === studentId))
//       .sort((a, b) => b.date.localeCompare(a.date))
//   }

//   const getAttendanceStats = (classId: string) => {
//     const classItem = classes.find((c) => c.id === classId)
//     if (!classItem) {
//       return {
//         totalSessions: 0,
//         averageAttendance: 0,
//         studentStats: [],
//       }
//     }

//     const classRecords = attendanceRecords.filter((r) => r.classId === classId)
//     const totalSessions = classRecords.length

//     if (totalSessions === 0) {
//       return {
//         totalSessions: 0,
//         averageAttendance: 0,
//         studentStats: classItem.students.map((s) => ({
//           studentId: s.id,
//           presentCount: 0,
//           absentCount: 0,
//           rate: 0,
//         })),
//       }
//     }

//     const studentStats = classItem.students.map((student) => {
//       const presentCount = classRecords.filter((r) =>
//         r.studentRecords.some((sr) => sr.studentId === student.id && sr.status === "present"),
//       ).length

//       const absentCount = totalSessions - presentCount
//       const rate = totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0

//       return {
//         studentId: student.id,
//         presentCount,
//         absentCount,
//         rate: Math.round(rate * 10) / 10,
//       }
//     })

//     const averageAttendance = studentStats.reduce((sum, stat) => sum + stat.rate, 0) / (studentStats.length || 1)

//     return {
//       totalSessions,
//       averageAttendance: Math.round(averageAttendance * 10) / 10,
//       studentStats,
//     }
//   }

//   return (
//     <AppContext.Provider
//       value={{
//         isAuthenticated,
//         setIsAuthenticated,
//         classes,
//         assignments,
//         grades,
//         setClasses,
//         updateStudentStatus,
//         userProfile,
//         updateUserProfile,
//         deleteClass,
//         updateClass,
//         addStudent,
//         updateStudent,
//         deleteStudent,
//         saveGrade,
//         getStudentGrades,
//         addAssignment,
//         updateGradingCriteria,
//         logout,
//         isLoading,
//         attendanceRecords,
//         saveAttendanceRecord,
//         getAttendanceHistory,
//         getStudentAttendanceHistory,
//         getAttendanceStats,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   )
// }

// export function useApp() {
//   const context = useContext(AppContext)
//   if (context === undefined) {
//     throw new Error("useApp must be used within an AppProvider")
//   }
//   return context
// }

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

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [classes, setClasses] = useState<Class[]>([])
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [grades, setGrades] = useState<StudentGrade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Alex Johnson",
    title: "Senior Mathematics Teacher",
    email: "alex.johnson@school.edu",
    phone: "+1 (555) 123-4567",
    avatar: "https://i.pravatar.cc/100?img=5",
  })

  useEffect(() => {
    loadPersistedData()
  }, [])

  const loadPersistedData = async () => {
    try {
      setIsLoading(true)

      const [savedAuth, savedClasses, savedAssignments, savedGrades, savedProfile, savedAttendance, savedGroups] =
        await Promise.all([
          storage.getAuth(),
          storage.getClasses(),
          storage.getAssignments(),
          storage.getGrades(),
          storage.getUserProfile(),
          storage.getItem("attendanceRecords"),
          storage.getItem("classGroups"),
        ])

      setIsAuthenticated(savedAuth)
      setClasses(savedClasses || mockClasses)
      setAssignments(savedAssignments || [])
      setGrades(savedGrades || [])
      setAttendanceRecords(savedAttendance ? JSON.parse(savedAttendance) : [])
      setClassGroups(savedGroups ? JSON.parse(savedGroups) : [])

      if (savedProfile) {
        setUserProfile(savedProfile)
      }
    } catch (error) {
      console.error("Error loading persisted data:", error)
      setClasses(mockClasses)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoading) {
      storage.saveAuth(isAuthenticated)
    }
  }, [isAuthenticated, isLoading])

  useEffect(() => {
    if (!isLoading) {
      storage.saveClasses(classes)
    }
  }, [classes, isLoading])

  useEffect(() => {
    if (!isLoading) {
      storage.saveAssignments(assignments)
    }
  }, [assignments, isLoading])

  useEffect(() => {
    if (!isLoading) {
      storage.saveGrades(grades)
    }
  }, [grades, isLoading])

  useEffect(() => {
    if (!isLoading) {
      storage.saveUserProfile(userProfile)
    }
  }, [userProfile, isLoading])

  useEffect(() => {
    if (!isLoading) {
      storage.saveItem("attendanceRecords", JSON.stringify(attendanceRecords))
    }
  }, [attendanceRecords, isLoading])

  useEffect(() => {
    if (!isLoading) {
      storage.saveItem("classGroups", JSON.stringify(classGroups))
    }
  }, [classGroups, isLoading])

  const updateStudentStatus = (classId: string, studentId: string, status: "present" | "absent") => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? {
              ...c,
              students: c.students.map((s) => (s.id === studentId ? { ...s, status } : s)),
            }
          : c,
      ),
    )
  }

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...profile }
      return updated
    })
  }

  const deleteClass = (classId: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId))
  }

  const updateClass = (classId: string, updates: Partial<Class>) => {
    setClasses((prev) => prev.map((c) => (c.id === classId ? { ...c, ...updates } : c)))
  }

  const addStudent = (classId: string, student: Student) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? {
              ...c,
              students: [...c.students, student],
              studentCount: c.studentCount + 1,
            }
          : c,
      ),
    )
  }

  const updateStudent = (classId: string, studentId: string, updates: Partial<Student>) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? {
              ...c,
              students: c.students.map((s) => (s.id === studentId ? { ...s, ...updates } : s)),
            }
          : c,
      ),
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
          : c,
      ),
    )
  }

  const saveGrade = (classId: string, assignmentId: string, grade: StudentGrade) => {
    setGrades((prev) => {
      const existing = prev.findIndex((g) => g.studentId === grade.studentId && g.assignmentId === assignmentId)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = grade
        return updated
      }
      return [...prev, grade]
    })
  }

  const getStudentGrades = (classId: string, studentId: string): StudentGrade[] => {
    const classAssignments = assignments.filter((a) => a.classId === classId)
    const assignmentIds = classAssignments.map((a) => a.id)
    return grades.filter((g) => g.studentId === studentId && assignmentIds.includes(g.assignmentId))
  }

  const addAssignment = (classId: string, assignment: Assignment) => {
    setAssignments((prev) => [...prev, assignment])
  }

  const updateGradingCriteria = (classId: string, criteria: GradingCriterion[]) => {
    setClasses((prev) => prev.map((c) => (c.id === classId ? { ...c, gradingCriteriaNew: criteria } : c)))
  }

  const logout = async () => {
    await storage.saveAuth(false)
    setIsAuthenticated(false)
    // Note: Removed storage.clearAll() to preserve user's classes, assignments, grades, and profile
  }

  const saveAttendanceRecord = (classId: string, date: string) => {
    const classItem = classes.find((c) => c.id === classId)
    if (!classItem) return

    const recordId = `${classId}-${date}`
    const studentRecords = classItem.students.map((s) => ({
      studentId: s.id,
      status: s.status,
    }))

    setAttendanceRecords((prev) => {
      const existingIndex = prev.findIndex((r) => r.id === recordId)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = { id: recordId, classId, date, studentRecords }
        return updated
      }
      return [...prev, { id: recordId, classId, date, studentRecords }]
    })
  }

  const getAttendanceHistory = (classId: string): AttendanceRecord[] => {
    return attendanceRecords.filter((r) => r.classId === classId).sort((a, b) => b.date.localeCompare(a.date))
  }

  const getStudentAttendanceHistory = (studentId: string, classId: string): AttendanceRecord[] => {
    return attendanceRecords
      .filter((r) => r.classId === classId && r.studentRecords.some((sr) => sr.studentId === studentId))
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  const getAttendanceStats = (classId: string) => {
    const classItem = classes.find((c) => c.id === classId)
    if (!classItem) {
      return {
        totalSessions: 0,
        averageAttendance: 0,
        studentStats: [],
      }
    }

    const classRecords = attendanceRecords.filter((r) => r.classId === classId)
    const totalSessions = classRecords.length

    if (totalSessions === 0) {
      return {
        totalSessions: 0,
        averageAttendance: 0,
        studentStats: classItem.students.map((s) => ({
          studentId: s.id,
          presentCount: 0,
          absentCount: 0,
          rate: 0,
        })),
      }
    }

    const studentStats = classItem.students.map((student) => {
      const presentCount = classRecords.filter((r) =>
        r.studentRecords.some((sr) => sr.studentId === student.id && sr.status === "present"),
      ).length

      const absentCount = totalSessions - presentCount
      const rate = totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0

      return {
        studentId: student.id,
        presentCount,
        absentCount,
        rate: Math.round(rate * 10) / 10,
      }
    })

    const averageAttendance = studentStats.reduce((sum, stat) => sum + stat.rate, 0) / (studentStats.length || 1)

    return {
      totalSessions,
      averageAttendance: Math.round(averageAttendance * 10) / 10,
      studentStats,
    }
  }

  const createClassGroup = (group: Omit<ClassGroup, "id" | "createdAt" | "updatedAt">): ClassGroup => {
    const now = new Date().toISOString()
    const newGroup: ClassGroup = {
      ...group,
      id: `group-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    setClassGroups((prev) => [...prev, newGroup])
    return newGroup
  }

  const updateClassGroup = (groupId: string, updates: Partial<ClassGroup>) => {
    setClassGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : g,
      ),
    )
  }

  const deleteClassGroup = (groupId: string) => {
    setClassGroups((prev) => prev.filter((g) => g.id !== groupId))
    setClasses((prev) => prev.map((c) => (c.parentGroupId === groupId ? { ...c, parentGroupId: undefined } : c)))
    setClassGroups((prev) =>
      prev.map((g) => ({
        ...g,
        subGroupIds: g.subGroupIds.filter((id) => id !== groupId),
      })),
    )
  }

  const addItemsToGroup = (groupId: string, classIds: string[], subGroupIds: string[]) => {
    setClassGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              classIds: [...new Set([...g.classIds, ...classIds])],
              subGroupIds: [...new Set([...g.subGroupIds, ...subGroupIds])],
              updatedAt: new Date().toISOString(),
            }
          : g,
      ),
    )
    setClasses((prev) => prev.map((c) => (classIds.includes(c.id) ? { ...c, parentGroupId: groupId } : c)))
    setClassGroups((prev) =>
      prev.map((g) =>
        subGroupIds.includes(g.id) ? { ...g, parentGroupId: groupId, updatedAt: new Date().toISOString() } : g,
      ),
    )
  }

  const removeItemFromGroup = (groupId: string, itemId: string, itemType: "class" | "group") => {
    if (itemType === "class") {
      setClassGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? {
                ...g,
                classIds: g.classIds.filter((id) => id !== itemId),
                updatedAt: new Date().toISOString(),
              }
            : g,
        ),
      )
      setClasses((prev) => prev.map((c) => (c.id === itemId ? { ...c, parentGroupId: undefined } : c)))
    } else {
      setClassGroups((prev) =>
        prev.map((g) => {
          if (g.id === groupId) {
            return {
              ...g,
              subGroupIds: g.subGroupIds.filter((id) => id !== itemId),
              updatedAt: new Date().toISOString(),
            }
          }
          if (g.id === itemId) {
            return { ...g, parentGroupId: undefined, updatedAt: new Date().toISOString() }
          }
          return g
        }),
      )
    }
  }

  const getGroupChildren = (groupId: string): { classes: Class[]; subGroups: ClassGroup[] } => {
    const group = classGroups.find((g) => g.id === groupId)
    if (!group) return { classes: [], subGroups: [] }

    return {
      classes: classes.filter((c) => group.classIds.includes(c.id)),
      subGroups: classGroups.filter((g) => group.subGroupIds.includes(g.id)),
    }
  }

  const getRootItems = (): { classes: Class[]; groups: ClassGroup[] } => {
    return {
      classes: classes.filter((c) => !c.parentGroupId),
      groups: classGroups.filter((g) => !g.parentGroupId),
    }
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        classes,
        assignments,
        grades,
        setClasses,
        classGroups,
        setClassGroups,
        createClassGroup,
        updateClassGroup,
        deleteClassGroup,
        addItemsToGroup,
        removeItemFromGroup,
        getGroupChildren,
        getRootItems,
        updateStudentStatus,
        userProfile,
        updateUserProfile,
        deleteClass,
        updateClass,
        addStudent,
        updateStudent,
        deleteStudent,
        saveGrade,
        getStudentGrades,
        addAssignment,
        updateGradingCriteria,
        logout,
        isLoading,
        attendanceRecords,
        saveAttendanceRecord,
        getAttendanceHistory,
        getStudentAttendanceHistory,
        getAttendanceStats,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
