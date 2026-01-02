import type { Class } from "@/interfaces/interface"

export const mockClasses: Class[] = [
  {
    id: "1",
    name: "Advanced Mathematics",
    subject: "Mathematics", // Added subject property
    section: "Section A",
    time: "10:00 AM",
    room: "Room 301",
    studentCount: 24,
    semester: "Fall 2024",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    gradingCriteria: ["collaborative", "technical", "english"],
    students: [
      { id: "2023001", name: "Jane Doe", avatar: "https://i.pravatar.cc/100?img=1", status: "present" },
      { id: "2023002", name: "John Smith", avatar: "https://i.pravatar.cc/100?img=2", status: "absent" },
      { id: "2023003", name: "Alice Johnson", avatar: "https://i.pravatar.cc/100?img=3", status: "present" },
      { id: "2023004", name: "Robert Fox", avatar: "https://i.pravatar.cc/100?img=4", status: "present" },
      { id: "2023005", name: "Cody Fisher", avatar: "https://i.pravatar.cc/100?img=5", status: "absent" },
      { id: "2023006", name: "Eleanor Davis", status: "present" },
    ],
  },
  {
    id: "2",
    name: "English Literature",
    subject: "English", // Added subject property
    section: "Section B",
    time: "01:00 PM",
    room: "Room 204",
    studentCount: 30,
    semester: "Fall 2024",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
    gradingCriteria: ["collaborative", "technical", "english"],
    students: [
      { id: "2023007", name: "Michael Brown", avatar: "https://i.pravatar.cc/100?img=6", status: "present" },
      { id: "2023008", name: "Sarah Wilson", avatar: "https://i.pravatar.cc/100?img=7", status: "present" },
    ],
  },
  {
    id: "3",
    name: "Physics Lab",
    subject: "Physics", // Added subject property
    section: "Lab 4B",
    time: "03:00 PM",
    room: "Lab 4B",
    studentCount: 18,
    semester: "Fall 2024",
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400",
    gradingCriteria: ["collaborative", "technical", "english"],
    students: [
      { id: "2023009", name: "David Lee", avatar: "https://i.pravatar.cc/100?img=8", status: "present" },
      { id: "2023010", name: "Emma Davis", avatar: "https://i.pravatar.cc/100?img=9", status: "present" },
    ],
  },
]
