// This file now serves as a compatibility layer for any legacy imports

/**
 * Type definitions for MARKMe application
 *
 * Note: All types are defined in @/interfaces/interface.d.ts
 * This file re-exports them for backward compatibility and convenience
 */

export type {
  // Core domain types
  Student,
  Class,
  AttendanceRecord,
  // GradeRecord,
  // Context types
  AppContextType,
  UserProfile,
  // Component prop types
  ButtonProps,
  HeaderProps,
  CardProps,
  AvatarProps,
  ToggleProps,
  ClassCardProps,
  StudentCardProps,
  StatsCardProps,
  // Toast and Modal types
  ToastType,
  ToastProps,
  ConfirmModalProps,
  EditStudentModalProps,
  EditClassModalProps,
  // Grading system types
  GradingCriterion,
  Assignment,
  StudentGrade,
  ManageCriteriaModalProps,
  GradeInputModalProps,
} from "@/interfaces/interface"
