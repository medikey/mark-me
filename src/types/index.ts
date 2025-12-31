// export interface Student {
//   id: string
//   name: string
//   avatar?: string
//   status: "present" | "absent"
//   grades?: {
//     [criteria: string]: number
//   }
// }

// export interface Class {
//   id: string
//   name: string
//   subject: string
//   section: string
//   time: string
//   room: string
//   studentCount: number
//   image: string
//   students: Student[]
//   semester: string
//   gradingCriteria?: string[]
// }

// export interface AttendanceRecord {
//   classId: string
//   date: string
//   students: {
//     studentId: string
//     status: "present" | "absent"
//   }[]
// }

// export interface GradeRecord {
//   classId: string
//   studentId: string
//   date: string
//   grades: {
//     [criteria: string]: number
//   }
// }
// export interface GradingCriterion {
//   id: string
//   name: string
//   maxScore: number
// }

// export type { Student, Class, AttendanceRecord, GradeRecord, GradingCriterion } from "@/interfaces/interface"
