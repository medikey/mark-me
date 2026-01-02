import { Stack } from "expo-router"

/**
 * Layout for the onboarding flow
 * This stack handles the intro screens shown to first-time users
 */
export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="get-started" />
      <Stack.Screen name="onboarding-carousel" />
    </Stack>
  )
}
