import type { ReactNode } from "react"
import type { Ionicons } from "@expo/vector-icons"
import type { AttendanceRecord } from "./AttendanceRecord" // Added import for AttendanceRecord

/**
 * Core domain interfaces
 * These define the primary data structures used throughout the application
 */

export interface AttendanceRecord {
  id: string
  classId: string
  date: string // ISO date string (YYYY-MM-DD)
  studentRecords: Array<{
    id: string // NEW: Added id field for the attendance record entry
    studentId: string
    name: string
    status: "present" | "absent"
  }>
  takenBy?: string // Educator who recorded attendance
  notes?: string // Optional notes about the session
  createdAt: string // ISO timestamp when record was created
  updatedAt: string // ISO timestamp when record was last updated
}
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
  subject: string // Moved to top as seen in pasted file
  id: string
  name: string
  section: string
  time: string
  room: string
  studentCount: number
  image: string
  students: Student[]
  semester: string
  gradingCriteriaNew?: GradingCriterion[] // NEW - Added from pasted file for backward compatibility
  gradingCriteria?: string[] // NEW - Added legacy string array format from pasted file
  assignments?: Assignment[]
  gradingSystem?: "points" | "letter" | "passfail"
  parentGroupId?: string // Optional - if set, this class belongs to a group
}

/**
 * ClassGroup interface
 * Allows educators to organize multiple classes or sub-groups together
 * Supports nested hierarchy for complex organizational structures
 */
export interface ClassGroup {
  id: string
  name: string
  description?: string
  classIds: string[] // IDs of classes directly in this group
  subGroupIds: string[] // IDs of nested groups within this group
  parentGroupId?: string // Optional - if set, this group is nested within another group
  createdAt: string
  updatedAt: string
  icon?: string // Material icon name for visual identification
  color?: string // Hex color for group badge/highlight
}

/**
 * Context interfaces
 * These define the shape of the global app state and its methods
 */
export interface AppContextType {
  // Authentication state
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void

  // Core data state
  classes: Class[]
  setClasses: (classes: Class[] | ((prev: Class[]) => Class[])) => void
  classGroups: ClassGroup[]
  setClassGroups: (groups: ClassGroup[] | ((prev: ClassGroup[]) => ClassGroup[])) => void
  assignments: Assignment[]
  grades: StudentGrade[]
  attendanceRecords: AttendanceRecord[]
  isLoading: boolean

  // User profile management
  userProfile: UserProfile
  updateUserProfile: (profile: Partial<UserProfile>) => void

  // Class management methods
  deleteClass: (classId: string) => void
  updateClass: (classId: string, updates: Partial<Class>) => void

  // Class Group management methods
  createClassGroup: (group: Omit<ClassGroup, "id" | "createdAt" | "updatedAt">) => ClassGroup
  updateClassGroup: (groupId: string, updates: Partial<ClassGroup>) => void
  deleteClassGroup: (groupId: string) => void
  addItemsToGroup: (groupId: string, classIds: string[], subGroupIds: string[]) => void
  removeItemFromGroup: (groupId: string, itemId: string, itemType: "class" | "group") => void
  getGroupChildren: (groupId: string) => { classes: Class[]; subGroups: ClassGroup[] }
  getRootItems: () => { classes: Class[]; groups: ClassGroup[] } // Get items not in any group

  getAllGroupAncestors: (groupId: string) => ClassGroup[] // Returns ClassGroup[] instead of string[]
  getAllGroupDescendants: (groupId: string) => ClassGroup[] // Returns ClassGroup[] instead of string[]
  getGroupItemCounts: (groupId: string) => { classCount: number; subGroupCount: number } // NEW - Added getGroupItemCounts to interface definition

  // Student management methods
  updateStudentStatus: (classId: string, studentId: string, status: "present" | "absent") => void
  addStudent: (classId: string, student: Student) => void
  updateStudent: (classId: string, studentId: string, updates: Partial<Student>) => void
  deleteStudent: (classId: string, studentId: string) => void

  // Grading methods
  saveGrade: (classId: string, assignmentId: string, grade: StudentGrade) => void
  getStudentGrades: (classId: string, studentId: string) => StudentGrade[]
  addAssignment: (classId: string, assignment: Assignment) => void
  updateGradingCriteria: (classId: string, criteria: GradingCriterion[]) => void

  // Attendance methods
  saveAttendanceRecord: (classId: string, date: string) => void
  getAttendanceHistory: (classId: string) => AttendanceRecord[]
  getStudentAttendanceHistory: (studentId: string, classId: string) => AttendanceRecord[]
  getAttendanceStats: (classId: string) => {
    totalSessions: number
    averageAttendance: number
    studentStats: { studentId: string; presentCount: number; absentCount: number; rate: number }[]
  }

  // System methods
  logout: () => Promise<void>
}

export interface UserProfile {
  name: string
  title: string
  email: string
  phone?: string
  avatar?: string
}

/**
 * Component prop interfaces
 * These define the props accepted by reusable UI components
 */
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
  onPress?: () => void // Makes Card touchable for navigation
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

/**
 * Toast and Modal interfaces
 * Used for user feedback and confirmation dialogs
 */
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

/**
 * Grading system interfaces
 * Comprehensive grading system with criteria, assignments, and student grades
 */
export interface GradingCriterion {
  id: string
  name: string
  weight: number // Percentage weight of this criterion
  maxScore: number // Maximum achievable score
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

export interface GradeRecord {
  classId: string
  studentId: string
  date: string
  grades: {
    [criteria: string]: number
  }
}

/**
 * Grading component interfaces
 * Props for grading-related modal components
 */
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
