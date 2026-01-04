import type { ClassGroup, Class } from "@/interfaces/interface"

/**
 * Get all direct children (classes and subgroups) of a group
 */
export const getGroupChildren = (
  groupId: string,
  classGroups: ClassGroup[],
  classes: Class[],
): { classes: Class[]; subGroups: ClassGroup[] } => {
  const group = classGroups.find((g) => g.id === groupId)
  if (!group) return { classes: [], subGroups: [] }

  return {
    classes: classes.filter((c) => group.classIds.includes(c.id)),
    subGroups: classGroups.filter((g) => group.subGroupIds.includes(g.id)),
  }
}

/**
 * Get all root-level items not in any group
 */
export const getRootItems = (
  classGroups: ClassGroup[],
  classes: Class[],
): { classes: Class[]; groups: ClassGroup[] } => {
  return {
    classes: classes.filter((c) => !c.parentGroupId),
    groups: classGroups.filter((g) => !g.parentGroupId),
  }
}

/**
 * Get all ancestor groups of a given group (parents, grandparents, etc.)
 */
export const getAllGroupAncestors = (groupId: string, classGroups: ClassGroup[]): string[] => {
  const ancestors: string[] = []
  let current = classGroups.find((g) => g.id === groupId)

  while (current?.parentGroupId) {
    ancestors.push(current.parentGroupId)
    current = classGroups.find((g) => g.id === current.parentGroupId)
  }

  return ancestors
}

/**
 * Get all descendant groups of a given group (all nested subgroups)
 */
export const getAllGroupDescendants = (groupId: string, classGroups: ClassGroup[]): string[] => {
  const descendants: string[] = []
  const group = classGroups.find((g) => g.id === groupId)

  if (!group) return descendants

  const queue = [...group.subGroupIds]
  while (queue.length > 0) {
    const current = queue.shift()
    if (current && !descendants.includes(current)) {
      descendants.push(current)
      const subGroup = classGroups.find((g) => g.id === current)
      if (subGroup) {
        queue.push(...subGroup.subGroupIds)
      }
    }
  }

  return descendants
}

/**
 * Count all classes and subgroups in a group, including nested items
 */
export const getGroupItemCounts = (
  groupId: string,
  classGroups: ClassGroup[],
): { classCount: number; subGroupCount: number } => {
  const group = classGroups.find((g) => g.id === groupId)
  if (!group) return { classCount: 0, subGroupCount: 0 }

  let classCount = group.classIds.length
  let subGroupCount = group.subGroupIds.length

  group.subGroupIds.forEach((subGroupId) => {
    const counts = getGroupItemCounts(subGroupId, classGroups)
    classCount += counts.classCount
    subGroupCount += counts.subGroupCount
  })

  return { classCount, subGroupCount }
}

/**
 * Recursively search for classes and groups matching a query
 */
export const searchClassesAndGroups = (
  query: string,
  classGroups: ClassGroup[],
  classes: Class[],
): { classes: Class[]; groups: ClassGroup[] } => {
  const lowerQuery = query.toLowerCase()
  const matchedClasses: Class[] = []
  const matchedGroups: ClassGroup[] = []

  // Search through all classes
  classes.forEach((cls) => {
    if (cls.name.toLowerCase().includes(lowerQuery) || cls.subject.toLowerCase().includes(lowerQuery)) {
      matchedClasses.push(cls)
    }
  })

  // Search through all groups recursively
  const searchGroups = (groups: ClassGroup[]) => {
    groups.forEach((group) => {
      if (group.name.toLowerCase().includes(lowerQuery)) {
        matchedGroups.push(group)
      }
      // Recursively search subgroups
      const subGroups = groups.filter((g) => group.subGroupIds.includes(g.id))
      if (subGroups.length > 0) {
        searchGroups(subGroups)
      }
    })
  }

  searchGroups(classGroups)
  return { classes: matchedClasses, groups: matchedGroups }
}
