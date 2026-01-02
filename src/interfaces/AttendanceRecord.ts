/**
 * AttendanceRecord interface
 * Represents a single attendance session for a class
 * Tracks individual student attendance status and metadata
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
}