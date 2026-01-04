// // "use client"

// // import { useState } from "react"
// // import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native"
// // import { useRouter } from "expo-router"
// // import { Ionicons } from "@expo/vector-icons"
// // import { useApp } from "@/contexts/AppContext"

// // type TabType = "classes" | "groups"

// // export default function AddItemsToGroupScreen() {
// //   const router = useRouter()
// //   const { classes, classGroups, getRootItems } = useApp()

// //   // UI state
// //   const [activeTab, setActiveTab] = useState<TabType>("classes")
// //   const [searchQuery, setSearchQuery] = useState("")
// //   const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])
// //   const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])

// //   // Get root items (not in any group) for selection
// //   const { classes: availableClasses, groups: availableGroups } = getRootItems()

// //   /**
// //    * Toggle class selection
// //    */
// //   const toggleClassSelection = (classId: string) => {
// //     setSelectedClassIds((prev) => (prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]))
// //   }

// //   /**
// //    * Toggle group selection
// //    */
// //   const toggleGroupSelection = (groupId: string) => {
// //     setSelectedGroupIds((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
// //   }

// //   /**
// //    * Filter items based on search query
// //    */
// //   const filteredClasses = availableClasses.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

// //   const filteredGroups = availableGroups.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))

// //   /**
// //    * Handle done - navigate back with selected items
// //    * In a real implementation, this would pass the selected items back to the parent screen
// //    */
// //   const handleDone = () => {
// //     // TODO: Pass selected items back to the create class group screen
// //     router.back()
// //   }

// //   const totalSelected = selectedClassIds.length + selectedGroupIds.length

// //   return (
// //     <View className="flex-1 bg-[#f6f7f8] dark:bg-[#101c22]">
// //       {/* Top App Bar */}
// //       <View className="h-12 w-full bg-[#101c22]" />
// //       <View className="flex-row items-center justify-between px-4 py-3 bg-[#101c22]">
// //         <TouchableOpacity
// //           onPress={() => router.back()}
// //           className="w-10 h-10 items-center justify-center rounded-full active:bg-white/10"
// //         >
// //           <Ionicons name="close" size={24} color="#94a3b8" />
// //         </TouchableOpacity>
// //         <Text className="text-lg font-bold text-white">Add Items</Text>
// //         <TouchableOpacity onPress={handleDone} disabled={totalSelected === 0}>
// //           <Text className={`text-base font-bold ${totalSelected > 0 ? "text-primary" : "text-slate-500"}`}>Done</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Scrollable Content */}
// //       <ScrollView className="flex-1 pb-24" showsVerticalScrollIndicator={false}>
// //         {/* Search Bar */}
// //         <View className="px-4 py-2 sticky top-0 z-10 bg-[#101c22]">
// //           <View className="relative">
// //             <View className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center pointer-events-none z-10">
// //               <Ionicons name="search" size={20} color="#94a3b8" />
// //             </View>
// //             <TextInput
// //               className="w-full pl-10 pr-3 py-3 rounded-xl border-none bg-[#233c48] text-white placeholder:text-slate-400 focus:bg-[#192b33]"
// //               placeholder="Search classes or groups..."
// //               placeholderTextColor="#94a3b8"
// //               value={searchQuery}
// //               onChangeText={setSearchQuery}
// //             />
// //           </View>
// //         </View>

// //         {/* Segmented Control */}
// //         <View className="px-4 py-2">
// //           <View className="flex-row p-1 bg-[#233c48] rounded-xl">
// //             <TouchableOpacity
// //               onPress={() => setActiveTab("classes")}
// //               className={`flex-1 py-1.5 rounded-lg ${activeTab === "classes" ? "bg-[#192b33] shadow-sm" : ""}`}
// //             >
// //               <Text
// //                 className={`text-sm font-medium text-center ${
// //                   activeTab === "classes" ? "text-white" : "text-slate-400"
// //                 }`}
// //               >
// //                 Classes
// //               </Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity
// //               onPress={() => setActiveTab("groups")}
// //               className={`flex-1 py-1.5 rounded-lg ${activeTab === "groups" ? "bg-[#192b33] shadow-sm" : ""}`}
// //             >
// //               <Text
// //                 className={`text-sm font-medium text-center ${
// //                   activeTab === "groups" ? "text-white" : "text-slate-400"
// //                 }`}
// //               >
// //                 Groups
// //               </Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>

// //         {/* Create New Actions */}
// //         <View className="px-4 mt-4 space-y-3">
// //           <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">Create New</Text>

// //           {/* Create Class */}
// //           <TouchableOpacity
// //             onPress={() => router.push("/create-class")}
// //             className="w-full flex-row items-center justify-between p-4 bg-[#233c48] rounded-xl active:scale-[0.99]"
// //           >
// //             <View className="flex-row items-center gap-4">
// //               <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
// //                 <Ionicons name="add-circle" size={24} color="#13a4ec" />
// //               </View>
// //               <View>
// //                 <Text className="font-medium text-white">Create New Class</Text>
// //                 <Text className="text-xs text-slate-400">Add a single class instance</Text>
// //               </View>
// //             </View>
// //             <Ionicons name="chevron-forward" size={20} color="#64748b" />
// //           </TouchableOpacity>

// //           {/* Create Group */}
// //           <TouchableOpacity
// //             onPress={() => router.push("/create-class-group")}
// //             className="w-full flex-row items-center justify-between p-4 bg-[#233c48] rounded-xl active:scale-[0.99]"
// //           >
// //             <View className="flex-row items-center gap-4">
// //               <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
// //                 <Ionicons name="folder-open" size={24} color="#13a4ec" />
// //               </View>
// //               <View>
// //                 <Text className="font-medium text-white">Create New Group</Text>
// //                 <Text className="text-xs text-slate-400">Add a folder for nested items</Text>
// //               </View>
// //             </View>
// //             <Ionicons name="chevron-forward" size={20} color="#64748b" />
// //           </TouchableOpacity>
// //         </View>

// //         {/* Available Items List */}
// //         <View className="px-4 mt-6 space-y-3">
// //           <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">Available Items</Text>

// //           {activeTab === "classes" ? (
// //             // Display classes
// //             filteredClasses.length > 0 ? (
// //               filteredClasses.map((classItem) => {
// //                 const isSelected = selectedClassIds.includes(classItem.id)
// //                 return (
// //                   <TouchableOpacity
// //                     key={classItem.id}
// //                     onPress={() => toggleClassSelection(classItem.id)}
// //                     className={`flex-row items-center justify-between p-4 rounded-xl ${
// //                       isSelected ? "bg-primary/10 border border-primary/30" : "bg-[#233c48]"
// //                     }`}
// //                   >
// //                     <View className="flex-row items-center gap-4 flex-1 overflow-hidden">
// //                       <View
// //                         className={`w-10 h-10 rounded-lg items-center justify-center ${
// //                           isSelected ? "bg-white dark:bg-[#192b33]" : "bg-[#192b33]"
// //                         }`}
// //                       >
// //                         <Ionicons name="school" size={20} color="#a78bfa" />
// //                       </View>
// //                       <View className="flex-1">
// //                         <Text className="font-medium text-white" numberOfLines={1}>
// //                           {classItem.name}
// //                         </Text>
// //                         <View className="flex-row items-center gap-1">
// //                           <Ionicons name="people" size={12} color="#94a3b8" />
// //                           <Text className="text-xs text-slate-400">{classItem.studentCount} Students</Text>
// //                         </View>
// //                       </View>
// //                     </View>
// //                     <View className="relative flex items-center justify-center">
// //                       <Ionicons
// //                         name={isSelected ? "checkmark-circle" : "checkmark-circle-outline"}
// //                         size={24}
// //                         color={isSelected ? "#13a4ec" : "#64748b"}
// //                       />
// //                     </View>
// //                   </TouchableOpacity>
// //                 )
// //               })
// //             ) : (
// //               <Text className="text-center text-slate-400 py-8">No classes available</Text>
// //             )
// //           ) : // Display groups
// //           filteredGroups.length > 0 ? (
// //             filteredGroups.map((group) => {
// //               const isSelected = selectedGroupIds.includes(group.id)
// //               return (
// //                 <TouchableOpacity
// //                   key={group.id}
// //                   onPress={() => toggleGroupSelection(group.id)}
// //                   className={`flex-row items-center justify-between p-4 rounded-xl ${
// //                     isSelected ? "bg-primary/10 border border-primary/30" : "bg-[#233c48]"
// //                   }`}
// //                 >
// //                   <View className="flex-row items-center gap-4 flex-1 overflow-hidden">
// //                     <View
// //                       className={`w-10 h-10 rounded-lg items-center justify-center ${
// //                         isSelected ? "bg-white dark:bg-[#192b33]" : "bg-[#192b33]"
// //                       }`}
// //                     >
// //                       <Ionicons name="folder" size={20} color="#60a5fa" />
// //                     </View>
// //                     <View className="flex-1">
// //                       <Text className="font-medium text-white" numberOfLines={1}>
// //                         {group.name}
// //                       </Text>
// //                       <Text className="text-xs text-slate-400">
// //                         Contains {group.classIds.length + group.subGroupIds.length} items
// //                       </Text>
// //                     </View>
// //                   </View>
// //                   <View className="relative flex items-center justify-center">
// //                     <Ionicons
// //                       name={isSelected ? "checkmark-circle" : "checkmark-circle-outline"}
// //                       size={24}
// //                       color={isSelected ? "#13a4ec" : "#64748b"}
// //                     />
// //                   </View>
// //                 </TouchableOpacity>
// //               )
// //             })
// //           ) : (
// //             <Text className="text-center text-slate-400 py-8">No groups available</Text>
// //           )}
// //         </View>
// //       </ScrollView>

// //       {/* Sticky Footer Action */}
// //       {totalSelected > 0 && (
// //         <View className="absolute bottom-0 w-full px-4 py-5 bg-linear-to-t from-[#101c22] via-[#101c22] to-transparent z-30">
// //           <TouchableOpacity
// //             onPress={handleDone}
// //             className="w-full h-14 bg-[#13a4ec] hover:bg-sky-500 active:bg-sky-600 rounded-xl shadow-lg shadow-primary/20 flex-row items-center justify-center gap-2 active:scale-[0.98]"
// //           >
// //             <Text className="font-bold text-lg text-white">Add {totalSelected} Selected</Text>
// //             <View className="bg-white/20 px-2 py-0.5 rounded-full">
// //               <Text className="text-white text-xs font-bold">{totalSelected}</Text>
// //             </View>
// //           </TouchableOpacity>
// //         </View>
// //       )}
// //     </View>
// //   )
// // }"use client"

// import { useState } from "react"
// import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native"
// import { useRouter, useLocalSearchParams } from "expo-router"
// import { Ionicons } from "@expo/vector-icons"
// import { useApp } from "@/contexts/AppContext"

// type TabType = "classes" | "groups"

// export default function AddItemsToGroupScreen() {
//   const router = useRouter()
//   const { groupId } = useLocalSearchParams()
//   const { classes, classGroups, getRootItems,getAllGroupAncestors, getAllGroupDescendants, addItemsToGroup } = useApp()

//   // UI state
//   const [activeTab, setActiveTab] = useState<TabType>("classes")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])
//   const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])

//   // Get root items (not in any group) for selection
//   const { classes: availableClasses, groups: availableGroups } = getRootItems()

//   const getFilteredGroups = () => {
//     if (!groupId) return availableGroups

//     const forbiddenGroupIds = new Set([
//       groupId as string,
//       ...getAllGroupAncestors(groupId as string),
//       ...getAllGroupDescendants(groupId as string),
//     ])

//     return availableGroups.filter((g) => !forbiddenGroupIds.has(g.id))
//   }

//   const filteredGroups = getFilteredGroups()

//   /**
//    * Toggle class selection
//    */
//   const toggleClassSelection = (classId: string) => {
//     setSelectedClassIds((prev) => (prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]))
//   }

//   /**
//    * Toggle group selection
//    */
//   const toggleGroupSelection = (groupId: string) => {
//     setSelectedGroupIds((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
//   }

//   /**
//    * Filter items based on search query
//    */
//   const filteredClasses = availableClasses.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

//   const filteredGroupsSearch = filteredGroups.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))

//   /**
//    * Handle done - save selected items to group and navigate back
//    */
//   const handleDone = () => {
//     if (groupId && selectedClassIds.length + selectedGroupIds.length > 0) {
//       addItemsToGroup(groupId as string, selectedClassIds, selectedGroupIds)
//     }
//     router.back()
//   }

//   const totalSelected = selectedClassIds.length + selectedGroupIds.length

//   return (
//     <View className="flex-1 bg-[#f6f7f8] dark:bg-[#101c22]">
//       {/* Top App Bar */}
//       <View className="h-12 w-full bg-[#101c22]" />
//       <View className="flex-row items-center justify-between px-4 py-3 bg-[#101c22]">
//         <TouchableOpacity
//           onPress={() => router.back()}
//           className="w-10 h-10 items-center justify-center rounded-full active:bg-white/10"
//         >
//           <Ionicons name="close" size={24} color="#94a3b8" />
//         </TouchableOpacity>
//         <Text className="text-lg font-bold text-white">Add Items</Text>
//         <TouchableOpacity onPress={handleDone} disabled={totalSelected === 0}>
//           <Text className={`text-base font-bold ${totalSelected > 0 ? "text-primary" : "text-slate-500"}`}>Done</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Scrollable Content */}
//       <ScrollView className="flex-1 pb-24" showsVerticalScrollIndicator={false}>
//         {/* Search Bar */}
//         <View className="px-4 py-2 sticky top-0 z-10 bg-[#101c22]">
//           <View className="relative">
//             <View className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center pointer-events-none z-10">
//               <Ionicons name="search" size={20} color="#94a3b8" />
//             </View>
//             <TextInput
//               className="w-full pl-10 pr-3 py-3 rounded-xl border-none bg-[#233c48] text-white placeholder:text-slate-400 focus:bg-[#192b33]"
//               placeholder="Search classes or groups..."
//               placeholderTextColor="#94a3b8"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//           </View>
//         </View>

//         {/* Segmented Control */}
//         <View className="px-4 py-2">
//           <View className="flex-row p-1 bg-[#233c48] rounded-xl">
//             <TouchableOpacity
//               onPress={() => setActiveTab("classes")}
//               className={`flex-1 py-1.5 rounded-lg ${activeTab === "classes" ? "bg-[#192b33] shadow-sm" : ""}`}
//             >
//               <Text
//                 className={`text-sm font-medium text-center ${
//                   activeTab === "classes" ? "text-white" : "text-slate-400"
//                 }`}
//               >
//                 Classes
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => setActiveTab("groups")}
//               className={`flex-1 py-1.5 rounded-lg ${activeTab === "groups" ? "bg-[#192b33] shadow-sm" : ""}`}
//             >
//               <Text
//                 className={`text-sm font-medium text-center ${
//                   activeTab === "groups" ? "text-white" : "text-slate-400"
//                 }`}
//               >
//                 Groups
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Create New Actions */}
//         <View className="px-4 mt-4 space-y-3">
//           <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">Create New</Text>

//           {/* Create Class */}
//           <TouchableOpacity
//             onPress={() => router.push("/create-class")}
//             className="w-full flex-row items-center justify-between p-4 bg-[#233c48] rounded-xl active:scale-[0.99]"
//           >
//             <View className="flex-row items-center gap-4">
//               <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
//                 <Ionicons name="add-circle" size={24} color="#13a4ec" />
//               </View>
//               <View>
//                 <Text className="font-medium text-white">Create New Class</Text>
//                 <Text className="text-xs text-slate-400">Add a single class instance</Text>
//               </View>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color="#64748b" />
//           </TouchableOpacity>

//           {/* Create Group */}
//           <TouchableOpacity
//             onPress={() => router.push("/create-class-group")}
//             className="w-full flex-row items-center justify-between p-4 bg-[#233c48] rounded-xl active:scale-[0.99]"
//           >
//             <View className="flex-row items-center gap-4">
//               <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
//                 <Ionicons name="folder-open" size={24} color="#13a4ec" />
//               </View>
//               <View>
//                 <Text className="font-medium text-white">Create New Group</Text>
//                 <Text className="text-xs text-slate-400">Add a folder for nested items</Text>
//               </View>
//             </View>
//             <Ionicons name="chevron-forward" size={20} color="#64748b" />
//           </TouchableOpacity>
//         </View>

//         {/* Available Items List */}
//         <View className="px-4 mt-6 space-y-3">
//           <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">Available Items</Text>

//           {activeTab === "classes" ? (
//             // Display classes
//             filteredClasses.length > 0 ? (
//               filteredClasses.map((classItem) => {
//                 const isSelected = selectedClassIds.includes(classItem.id)
//                 return (
//                   <TouchableOpacity
//                     key={classItem.id}
//                     onPress={() => toggleClassSelection(classItem.id)}
//                     className={`flex-row items-center justify-between p-4 rounded-xl ${
//                       isSelected ? "bg-primary/10 border border-primary/30" : "bg-[#233c48]"
//                     }`}
//                   >
//                     <View className="flex-row items-center gap-4 flex-1 overflow-hidden">
//                       <View
//                         className={`w-10 h-10 rounded-lg items-center justify-center ${
//                           isSelected ? "bg-white dark:bg-[#192b33]" : "bg-[#192b33]"
//                         }`}
//                       >
//                         <Ionicons name="school" size={20} color="#a78bfa" />
//                       </View>
//                       <View className="flex-1">
//                         <Text className="font-medium text-white" numberOfLines={1}>
//                           {classItem.name}
//                         </Text>
//                         <View className="flex-row items-center gap-1">
//                           <Ionicons name="people" size={12} color="#94a3b8" />
//                           <Text className="text-xs text-slate-400">{classItem.studentCount} Students</Text>
//                         </View>
//                       </View>
//                     </View>
//                     <View className="relative flex items-center justify-center">
//                       <Ionicons
//                         name={isSelected ? "checkmark-circle" : "checkmark-circle-outline"}
//                         size={24}
//                         color={isSelected ? "#13a4ec" : "#64748b"}
//                       />
//                     </View>
//                   </TouchableOpacity>
//                 )
//               })
//             ) : (
//               <Text className="text-center text-slate-400 py-8">No classes available</Text>
//             )
//           ) : // Display groups
//           filteredGroupsSearch.length > 0 ? (
//             filteredGroupsSearch.map((group) => {
//               const isSelected = selectedGroupIds.includes(group.id)
//               return (
//                 <TouchableOpacity
//                   key={group.id}
//                   onPress={() => toggleGroupSelection(group.id)}
//                   className={`flex-row items-center justify-between p-4 rounded-xl ${
//                     isSelected ? "bg-primary/10 border border-primary/30" : "bg-[#233c48]"
//                   }`}
//                 >
//                   <View className="flex-row items-center gap-4 flex-1 overflow-hidden">
//                     <View
//                       className={`w-10 h-10 rounded-lg items-center justify-center ${
//                         isSelected ? "bg-white dark:bg-[#192b33]" : "bg-[#192b33]"
//                       }`}
//                     >
//                       <Ionicons name="folder" size={20} color="#60a5fa" />
//                     </View>
//                     <View className="flex-1">
//                       <Text className="font-medium text-white" numberOfLines={1}>
//                         {group.name}
//                       </Text>
//                       <Text className="text-xs text-slate-400">
//                         Contains {group.classIds.length + group.subGroupIds.length} items
//                       </Text>
//                     </View>
//                   </View>
//                   <View className="relative flex items-center justify-center">
//                     <Ionicons
//                       name={isSelected ? "checkmark-circle" : "checkmark-circle-outline"}
//                       size={24}
//                       color={isSelected ? "#13a4ec" : "#64748b"}
//                     />
//                   </View>
//                 </TouchableOpacity>
//               )
//             })
//           ) : (
//             <Text className="text-center text-slate-400 py-8">
//               {!groupId
//                 ? "No groups available"
//                 : "All available groups have been selected or would create a circular hierarchy"}
//             </Text>
//           )}
//         </View>
//       </ScrollView>

//       {/* Sticky Footer Action */}
//       {totalSelected > 0 && (
//         <View className="absolute bottom-0 w-full px-4 py-5 bg-gradient-to-t from-[#101c22] via-[#101c22] to-transparent z-30">
//           <TouchableOpacity
//             onPress={handleDone}
//             className="w-full h-14 bg-[#13a4ec] hover:bg-sky-500 active:bg-sky-600 rounded-xl shadow-lg shadow-primary/20 flex-row items-center justify-center gap-2 active:scale-[0.98]"
//           >
//             <Text className="font-bold text-lg text-white">Add {totalSelected} Selected</Text>
//             <View className="bg-white/20 px-2 py-0.5 rounded-full">
//               <Text className="text-white text-xs font-bold">{totalSelected}</Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   )
// }

"use client"

import { useState } from "react"
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useApp } from "@/contexts/AppContext"

type TabType = "classes" | "groups"

export default function AddItemsToGroupScreen() {
  const router = useRouter()
  const { groupId } = useLocalSearchParams()
  const { classes, classGroups, getRootItems, getAllGroupAncestors, getAllGroupDescendants, addItemsToGroup } = useApp()

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>("classes")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])

  // Get root items (not in any group) for selection
  const { classes: availableClasses, groups: availableGroups } = getRootItems()

  const getFilteredGroups = () => {
    if (!groupId) return availableGroups

    const forbiddenGroupIds = new Set([
      groupId as string,
      ...getAllGroupAncestors(groupId as string),
      ...getAllGroupDescendants(groupId as string),
    ])

    return availableGroups.filter((g) => !forbiddenGroupIds.has(g.id))
  }

  const filteredGroups = getFilteredGroups()

  /**
   * Toggle class selection
   */
  const toggleClassSelection = (classId: string) => {
    setSelectedClassIds((prev) => (prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]))
  }

  /**
   * Toggle group selection
   */
  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroupIds((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  /**
   * Filter items based on search query
   */
  const filteredClasses = availableClasses.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredGroupsSearch = filteredGroups.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))

  /**
   * Handle done - save selected items to group and navigate back
   */
  const handleDone = () => {
    if (groupId && selectedClassIds.length + selectedGroupIds.length > 0) {
      addItemsToGroup(groupId as string, selectedClassIds, selectedGroupIds)
    }
    router.back()
  }

  const totalSelected = selectedClassIds.length + selectedGroupIds.length

  return (
    <View className="flex-1 bg-[#101c22]">
      {/* Top App Bar */}
      <View className="h-12 w-full bg-[#101c22]" />
      <View className="flex-row items-center justify-between px-4 py-3 bg-[#101c22]">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-white/10"
        >
          <Ionicons name="close" size={24} color="#94a3b8" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Add Items</Text>
        <TouchableOpacity onPress={handleDone} disabled={totalSelected === 0}>
          <Text className={`text-base font-bold ${totalSelected > 0 ? "text-primary" : "text-slate-500"}`}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView className="flex-1 pb-24" showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View className="px-4 py-2 sticky top-0 z-10 bg-[#101c22]">
          <View className="relative">
            <View className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center pointer-events-none z-10">
              <Ionicons name="search" size={20} color="#94a3b8" />
            </View>
            <TextInput
              className="w-full pl-10 pr-3 py-3 rounded-xl border-none bg-[#233c48] text-white placeholder:text-slate-400 focus:bg-[#192b33]"
              placeholder="Search classes or groups..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Segmented Control */}
        <View className="px-4 py-2">
          <View className="flex-row p-1 bg-[#233c48] rounded-xl">
            <TouchableOpacity
              onPress={() => setActiveTab("classes")}
              className={`flex-1 py-1.5 rounded-lg ${activeTab === "classes" ? "bg-[#192b33] shadow-sm" : ""}`}
            >
              <Text
                className={`text-sm font-medium text-center ${
                  activeTab === "classes" ? "text-white" : "text-slate-400"
                }`}
              >
                Classes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("groups")}
              className={`flex-1 py-1.5 rounded-lg ${activeTab === "groups" ? "bg-[#192b33] shadow-sm" : ""}`}
            >
              <Text
                className={`text-sm font-medium text-center ${
                  activeTab === "groups" ? "text-white" : "text-slate-400"
                }`}
              >
                Groups
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Create New Actions */}
        <View className="px-4 mt-4 space-y-3">
          <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">Create New</Text>

          {/* Create Class */}
          <TouchableOpacity
            onPress={() => router.push("/create-class")}
            className="w-full flex-row items-center justify-between p-4 bg-[#233c48] rounded-xl active:scale-[0.99]"
          >
            <View className="flex-row items-center gap-4">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                <Ionicons name="add-circle" size={24} color="#13a4ec" />
              </View>
              <View>
                <Text className="font-medium text-white">Create New Class</Text>
                <Text className="text-xs text-slate-400">Add a single class instance</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </TouchableOpacity>

          {/* Create Group */}
          <TouchableOpacity
            onPress={() => router.push("/create-class-group")}
            className="w-full flex-row items-center justify-between p-4 bg-[#233c48] rounded-xl active:scale-[0.99]"
          >
            <View className="flex-row items-center gap-4">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                <Ionicons name="folder-open" size={24} color="#13a4ec" />
              </View>
              <View>
                <Text className="font-medium text-white">Create New Group</Text>
                <Text className="text-xs text-slate-400">Add a folder for nested items</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Available Items List */}
        <View className="px-4 mt-6 space-y-3">
          <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">Available Items</Text>

          {activeTab === "classes" ? (
            // Display classes
            filteredClasses.length > 0 ? (
              filteredClasses.map((classItem) => {
                const isSelected = selectedClassIds.includes(classItem.id)
                return (
                  <TouchableOpacity
                    key={classItem.id}
                    onPress={() => toggleClassSelection(classItem.id)}
                    className={`flex-row items-center justify-between p-4 rounded-xl ${
                      isSelected ? "bg-primary/10 border border-primary/30" : "bg-[#233c48]"
                    }`}
                  >
                    <View className="flex-row items-center gap-4 flex-1 overflow-hidden">
                      <View
                        className={`w-10 h-10 rounded-lg items-center justify-center ${
                          isSelected ? "bg-[#192b33]" : "bg-[#192b33]"
                        }`}
                      >
                        <Ionicons name="school" size={20} color="#a78bfa" />
                      </View>
                      <View className="flex-1">
                        <Text className="font-medium text-white" numberOfLines={1}>
                          {classItem.name}
                        </Text>
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="people" size={12} color="#94a3b8" />
                          <Text className="text-xs text-slate-400">{classItem.studentCount} Students</Text>
                        </View>
                      </View>
                    </View>
                    <View className="relative flex items-center justify-center">
                      <Ionicons
                        name={isSelected ? "checkmark-circle" : "checkmark-circle-outline"}
                        size={24}
                        color={isSelected ? "#13a4ec" : "#64748b"}
                      />
                    </View>
                  </TouchableOpacity>
                )
              })
            ) : (
              <Text className="text-center text-slate-400 py-8">No classes available</Text>
            )
          ) : // Display groups
          filteredGroupsSearch.length > 0 ? (
            filteredGroupsSearch.map((group) => {
              const isSelected = selectedGroupIds.includes(group.id)
              return (
                <TouchableOpacity
                  key={group.id}
                  onPress={() => toggleGroupSelection(group.id)}
                  className={`flex-row items-center justify-between p-4 rounded-xl ${
                    isSelected ? "bg-primary/10 border border-primary/30" : "bg-[#233c48]"
                  }`}
                >
                  <View className="flex-row items-center gap-4 flex-1 overflow-hidden">
                    <View
                      className={`w-10 h-10 rounded-lg items-center justify-center ${
                        isSelected ? "bg-[#192b33]" : "bg-[#192b33]"
                      }`}
                    >
                      <Ionicons name="folder" size={20} color="#60a5fa" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-white" numberOfLines={1}>
                        {group.name}
                      </Text>
                      <Text className="text-xs text-slate-400">
                        Contains {group.classIds.length + group.subGroupIds.length} items
                      </Text>
                    </View>
                  </View>
                  <View className="relative flex items-center justify-center">
                    <Ionicons
                      name={isSelected ? "checkmark-circle" : "checkmark-circle-outline"}
                      size={24}
                      color={isSelected ? "#13a4ec" : "#64748b"}
                    />
                  </View>
                </TouchableOpacity>
              )
            })
          ) : (
            <Text className="text-center text-slate-400 py-8">
              {!groupId
                ? "No groups available"
                : "All available groups have been selected or would create a circular hierarchy"}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Sticky Footer Action */}
      {totalSelected > 0 && (
        <View className="absolute bottom-0 w-full px-4 py-5 bg-linear-to-t from-[#101c22] via-[#101c22] to-transparent z-30">
          <TouchableOpacity
            onPress={handleDone}
            className="w-full h-14 bg-[#13a4ec] rounded-xl shadow-lg shadow-primary/20 flex-row items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Text className="font-bold text-lg text-white">Add {totalSelected} Selected</Text>
            <View className="bg-white/20 px-2 py-0.5 rounded-full">
              <Text className="text-white text-xs font-bold">{totalSelected}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}