import type { ReactNode } from "react"
import type { Ionicons } from "@expo/vector-icons"

/* ---------------- APPWRITE DOCUMENT REFERENCE ---------------- */
// Every entity synced with Appwrite now has an optional appwriteId
export interface AppwriteDoc {
  appwriteId?: string
}

/* ---------------- ATTENDANCE ---------------- */
export interface AttendanceRecord extends AppwriteDoc {
  id: string
  classId: string
  date: string // ISO date (YYYY-MM-DD)
  studentRecords: Array<{
    id: string
    studentId: string
    name: string
    status: "present" | "absent"
  }>
  takenBy?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

/* ---------------- STUDENTS ---------------- */
export interface Student extends AppwriteDoc {
  id: string
  name: string
  avatar?: string
  status: "present" | "absent"
  grades?: Record<string, number>
  parentGroupId?: string | null
}

/* ---------------- CLASSES ---------------- */
export interface Class extends AppwriteDoc {
  id: string
  subject: string
  name: string
  time: string
  room: string
  studentCount: number
  image: string
  students: Student[]
  semester: string
  gradingCriteriaNew?: GradingCriterion[]
  gradingCriteria?: string[] // legacy format
  assignments?: Assignment[]
  gradingSystem?: "points" | "letter" | "passfail"
  parentGroupId?: string | null
}

/* ---------------- CLASS GROUPS ---------------- */
export interface ClassGroup extends AppwriteDoc {
  id: string
  name: string
  description?: string
  classIds: string[]
  subGroupIds: string[]
  parentGroupId?: string
  createdAt: string
  updatedAt: string
  icon?: string
  color?: string
}

/* ---------------- USER PROFILE ---------------- */
export interface UserProfile {
  name: string
  title: string
  email: string
  phone?: string
  avatar?: string
}

/* ---------------- STUDENT GRADES ---------------- */
export interface GradingCriterion extends AppwriteDoc {
  id: string
  name: string
  weight: number
  maxScore: number
  description?: string
}

export interface Assignment extends AppwriteDoc {
  id: string
  name: string
  classId: string
  date: string
  criteria: GradingCriterion[]
  gradingSystem: "points" | "letter" | "passfail"
}

export interface StudentGrade extends AppwriteDoc {
  classId: string
  studentId: string
  assignmentId: string
  score: number
  maxScore: number
  scores: Record<string, number>
  overallGrade?: number
  letterGrade?: string
  comment?: string
  gradedAt: string
}

export interface GradeRecord {
  classId: string
  studentId: string
  date: string
  grades: Record<string, number>
}

/* ---------------- APP CONTEXT ---------------- */
export interface AppContextType {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void

  classes: Class[]
  setClasses: (classes: Class[] | ((prev: Class[]) => Class[])) => void
  classGroups: ClassGroup[]
  setClassGroups: (groups: ClassGroup[] | ((prev: ClassGroup[]) => ClassGroup[])) => void
  assignments: Assignment[]
  grades: StudentGrade[]
  attendanceRecords: AttendanceRecord[]
  isLoading: boolean

  userProfile: UserProfile
  updateUserProfile: (profile: Partial<UserProfile>) => void

  deleteClass: (classId: string) => void
  updateClass: (classId: string, updates: Partial<Class>) => void

  createClassGroup: (group: Omit<ClassGroup, "id" | "createdAt" | "updatedAt">) => ClassGroup
  updateClassGroup: (groupId: string, updates: Partial<ClassGroup>) => void
  deleteClassGroup: (groupId: string) => void
  addItemsToGroup: (groupId: string, classIds: string[], subGroupIds: string[]) => void
  removeItemFromGroup: (groupId: string, itemId: string, itemType: "class" | "group") => void
  getGroupChildren: (groupId: string) => { classes: Class[]; subGroups: ClassGroup[] }
  getRootItems: () => { classes: Class[]; groups: ClassGroup[] }
  getAllGroupAncestors: (groupId: string) => ClassGroup[]
  getAllGroupDescendants: (groupId: string) => ClassGroup[]
  getGroupItemCounts: (groupId: string) => { classCount: number; subGroupCount: number }

  updateStudentStatus: (classId: string, studentId: string, status: "present" | "absent") => void
  addStudent: (classId: string, student: Student) => void
  updateStudent: (classId: string, studentId: string, updates: Partial<Student>) => void
  deleteStudent: (classId: string, studentId: string) => void

  saveGrade: (classId: string, assignmentId: string, grade: StudentGrade) => void
  getStudentGrades: (classId: string, studentId: string) => StudentGrade[]
  addAssignment: (classId: string, assignment: Assignment) => void
  updateGradingCriteria: (classId: string, criteria: GradingCriterion[]) => void

  saveAttendanceRecord: (classId: string, date: string) => void
  getAttendanceHistory: (classId: string) => AttendanceRecord[]
  getStudentAttendanceHistory: (studentId: string, classId: string) => AttendanceRecord[]
  getAttendanceStats: (classId: string) => {
    totalSessions: number
    averageAttendance: number
    studentStats: { studentId: string; presentCount: number; absentCount: number; rate: number }[]
  }

  logout: () => Promise<void>
}

/* ---------------- UI COMPONENTS ---------------- */
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

/* ---------------- TOASTS & MODALS ---------------- */
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

/* ---------------- GRADING MODALS ---------------- */
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
