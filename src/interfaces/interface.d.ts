import type { ReactNode } from "react"
import type { Ionicons } from "@expo/vector-icons"

// Core domain interfaces
export interface Student {
  id: string
  name: string
  avatar?: string
  status: "present" | "absent"
  grades?: {
    [criteria: string]: number
  }
}

export interface Class {
  id: string
  name: string
  section: string
  time: string
  room: string
  studentCount: number
  image: string
  students: Student[]
  semester: string
  gradingCriteriaNew?: GradingCriterion[]
  gradingCriteria?: string[]
  assignments?: Assignment[]
  gradingSystem?: "points" | "letter" | "passfail"
}

export interface AttendanceRecord {
  id: string
  classId: string
  date: string
  studentRecords: {
    studentId: string
    status: "present" | "absent"
  }[]
}

export interface GradeRecord {
  classId: string
  studentId: string
  date: string
  grades: {
    [criteria: string]: number
  }
}

// Context interfaces
export interface AppContextType {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  classes: Class[]
  assignments: Assignment[]
  grades: StudentGrade[] 
  setClasses: (classes: Class[] | ((prev: Class[]) => Class[])) => void
  updateStudentStatus: (classId: string, studentId: string, status: "present" | "absent") => void
  userProfile: UserProfile
  updateUserProfile: (profile: Partial<UserProfile>) => void
  deleteClass: (classId: string) => void
  updateClass: (classId: string, updates: Partial<Class>) => void
  addStudent: (classId: string, student: Student) => void
  updateStudent: (classId: string, studentId: string, updates: Partial<Student>) => void
  deleteStudent: (classId: string, studentId: string) => void
  saveGrade: (classId: string, assignmentId: string, grade: StudentGrade) => void
  getStudentGrades: (classId: string, studentId: string) => StudentGrade[]
  addAssignment: (classId: string, assignment: Assignment) => void
  updateGradingCriteria: (classId: string, criteria: GradingCriterion[]) => void
  logout: () => Promise<void>
  isLoading: boolean
  attendanceRecords: AttendanceRecord[]
  saveAttendanceRecord: (classId: string, date: string) => void
  getAttendanceHistory: (classId: string) => AttendanceRecord[]
  getStudentAttendanceHistory: (studentId: string, classId: string) => AttendanceRecord[]
  getAttendanceStats: (classId: string) => {
    totalSessions: number
    averageAttendance: number
    studentStats: { studentId: string; presentCount: number; absentCount: number; rate: number }[]
  }
}

export interface UserProfile {
  name: string
  title: string
  email: string
  phone?: string
  avatar?: string
}

// Component prop interfaces
export interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "danger" | "ghost"
  icon?: keyof typeof Ionicons.glyphMap
  loading?: boolean
  disabled?: boolean
  className?: string
}

export interface HeaderProps {
  title: string
  subtitle?: string
  rightElement?: ReactNode
  showBack?: boolean
}


export interface CardProps {
  children: ReactNode
  className?: string
  onPress?: () => void
}

export interface AvatarProps {
  uri?: string
  name: string
  size?: number
}

export interface ToggleProps {
  value: boolean
  onValueChange: (value: boolean) => void
}

export interface ClassCardProps {
  classItem: Class
}

export interface StudentCardProps {
  student: Student
  onToggleStatus?: () => void
  showAttendance?: boolean
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
}

export interface StatsCardProps {
  icon: keyof typeof Ionicons.glyphMap
  iconColor: string
  borderColor: string
  value: number
  label: string
}

export type ToastType = "success" | "error" | "info" | "warning"

export interface ToastProps {
  visible: boolean
  message: string
  type: ToastType
  onHide: () => void
  duration?: number
}

export interface ConfirmModalProps {
  visible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: "danger" | "primary"
}

export interface EditStudentModalProps {
  visible: boolean
  student: Student | null
  onSave: (student: Student) => void
  onCancel: () => void
}

export interface EditClassModalProps {
  visible: boolean
  classItem: Class | null
  onSave: (classItem: Partial<Class>) => void
  onCancel: () => void
}

// Comprehensive grading interfaces
export interface GradingCriterion {
  id: string
  name: string
  weight: number // percentage weight
  maxScore: number
  description?: string
}

export interface Assignment {
  id: string
  name: string
  classId: string
  date: string
  criteria: GradingCriterion[]
  gradingSystem: "points" | "letter" | "passfail"
}

export interface StudentGrade {
  studentId: string
  assignmentId: string
  scores: {
    [criterionId: string]: number
  }
  overallGrade?: number
  letterGrade?: string
  comment?: string
  gradedAt: string
}

// Grading component interfaces
export interface ManageCriteriaModalProps {
  visible: boolean
  classId: string
  criteria: GradingCriterion[]
  onSave: (criteria: GradingCriterion[]) => void
  onCancel: () => void
}

export interface GradeInputModalProps {
  visible: boolean
  student: Student
  criterion: GradingCriterion
  currentScore?: number
  onSave: (score: number) => void
  onCancel: () => void
}
