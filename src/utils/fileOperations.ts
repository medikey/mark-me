import * as DocumentPicker from "expo-document-picker"
import * as Sharing from "expo-sharing"
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system/legacy"

export interface CSVStudent {
  studentId: string
  firstName: string
  lastName: string
}

// Parse CSV file content
export const parseCSV = (csvContent: string): CSVStudent[] => {
  const lines = csvContent.trim().split("\n")
  const headers = lines[0]
    .toLowerCase()
    .split(",")
    .map((h) => h.trim())

  const studentIdIndex = headers.findIndex((h) => h.includes("id") || h.includes("student"))
  const firstNameIndex = headers.findIndex((h) => h.includes("first") || h.includes("fname"))
  const lastNameIndex = headers.findIndex((h) => h.includes("last") || h.includes("lname"))

  if (studentIdIndex === -1 || firstNameIndex === -1 || lastNameIndex === -1) {
    throw new Error("CSV must contain Student ID, First Name, and Last Name columns")
  }

  const students: CSVStudent[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())
    if (values.length >= 3 && values[studentIdIndex]) {
      students.push({
        studentId: values[studentIdIndex],
        firstName: values[firstNameIndex],
        lastName: values[lastNameIndex],
      })
    }
  }

  return students
}

// Pick CSV file from device
export const pickCSVFile = async (): Promise<CSVStudent[]> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "text/csv",
      copyToCacheDirectory: true,
    })

    if (result.canceled) {
      throw new Error("File selection cancelled")
    }

    const uri = result.assets[0].uri
    const response = await fetch(uri)
    const fileContent = await response.text()
    return parseCSV(fileContent)
  } catch (error) {
    throw new Error(`Failed to pick CSV: ${error}`)
  }
}

// Generate CSV template
export const generateCSVTemplate = (): string => {
  return "Student ID,First Name,Last Name\n001,John,Doe\n002,Jane,Smith\n003,Michael,Johnson"
}

// Download CSV template
export const downloadCSVTemplate = async (): Promise<void> => {
  try {
    const csvContent = generateCSVTemplate()
    const blob = new Blob([csvContent], { type: "text/csv" })
    const reader = new FileReader()

    reader.onload = async () => {
      if (reader.result && typeof reader.result === "string") {
        const base64 = reader.result.split(",")[1]
        const fileUri = `${FileSystem.cacheDirectory}student_template.csv`

        await FileSystem.writeAsStringAsync(fileUri, csvContent, {
          encoding: FileSystem.EncodingType.UTF8,
        })

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri)
        }
      }
    }
    reader.readAsDataURL(blob)
  } catch (error) {
    throw new Error(`Failed to download template: ${error}`)
  }
}

// Generate attendance CSV
export const generateAttendanceCSV = (
  className: string,
  students: Array<{ id: string; name: string; status: "present" | "absent" }>,
  date: string,
): string => {
  let csv = "Student ID,Student Name,Status,Date\n"
  students.forEach((student) => {
    csv += `${student.id},${student.name},${student.status},${date}\n`
  })
  return csv
}

// Download attendance list as CSV
export const downloadAttendanceCSV = async (
  className: string,
  students: Array<{ id: string; name: string; status: "present" | "absent" }>,
  date: string,
): Promise<void> => {
  try {
    const csvContent = generateAttendanceCSV(className, students, date)
    const fileName = `${className.replace(/\s+/g, "_")}_attendance_${date.replace(/\s+/g, "_")}.csv`
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`

    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    })

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Share Attendance List",
      })
    } else {
      throw new Error("Sharing is not available on this device")
    }
  } catch (error) {
    throw new Error(`Failed to download attendance: ${error}`)
  }
}

// Pick image from gallery or camera
export const pickImage = async (useCamera = false): Promise<string | null> => {
  try {
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        })

    if (!result.canceled) {
      return result.assets[0].uri
    }
    return null
  } catch (error) {
    throw new Error(`Failed to pick image: ${error}`)
  }
}
