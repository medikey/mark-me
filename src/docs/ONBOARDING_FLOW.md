# MarkMe Onboarding Flow Documentation

## Overview

The MarkMe app features a comprehensive onboarding experience for first-time users, introducing them to the key features of the classroom management platform.

## Onboarding Screens

### 1. Welcome Screen (`app/(onboarding)/welcome.tsx`)

**Purpose**: First impression and main value proposition

**Features**:
- Hero background image with gradient overlay
- Animated app logo (checkmark circle with rotation effect)
- Main headline: "Welcome to MarkMe"
- Feature description
- Two primary CTAs:
  - "Get Started" → Navigate to Get Started screen
  - "Already have an account? Log In" → Skip to login

**Design Elements**:
- Decorative background glows (20% and 10% primary color opacity)
- Hero section takes 55% of screen height
- Clean, modern typography using Lexend font family
- Sky blue primary color (#13a4ec)
- Dark theme background (#101c22)

---

### 2. Get Started Screen (`app/(onboarding)/get-started.tsx`)

**Purpose**: Showcase the main value proposition with social proof

**Features**:
- Skip button in top-right corner → Go directly to login
- Hero image with decorative glow effect
- Floating badge element (bottom-right) with checkmark icon
- Main headline: "Classroom management made simple."
- Social proof copy: "Join thousands of educators..."
- Two action buttons:
  - "Create Account" → Navigate to onboarding carousel
  - "Log In" → Go to login screen
- Terms of Service footer with links

**Design Elements**:
- Decorative 3D glow effect behind hero image
- Floating badge with border ring effect
- Aspect ratio 4:5 for hero image
- Maximum width constraints for readability

---

### 3. Onboarding Carousel (`app/(onboarding)/onboarding-carousel.tsx`)

**Purpose**: Interactive walkthrough of key app features

**Features**:
- Skip button in top-right corner
- Three feature screens:
  1. **Effortless Attendance**: Single-tap attendance tracking
  2. **Smart Grading System**: Custom criteria and instant evaluation
  3. **Instant Reports**: Generate and share reports easily
- Page indicators (dots) showing current position
- Next/Get Started button (changes on last screen)
- Custom illustrations for each feature using mock UI components

**Feature Illustrations**:

1. **Attendance Illustration**:
   - Mock app interface showing student list
   - Checkmark icons for present students
   - Unchecked circle for pending
   - Decorative glow effect

2. **Grading Illustration**:
   - Grade cards with letter grades (A+, B)
   - Progress bars showing achievement levels
   - Color-coded by performance

3. **Reports Illustration**:
   - Stats cards with percentages
   - Mini bar chart visualization
   - Clean, data-focused design

**Interactions**:
- Current index tracks which screen is visible
- Button text changes: "Next" → "Get Started" on last screen
- Active page indicator expands (8px width vs 2px)

---

## Navigation Flow

```
App Start (index.tsx)
    ↓
Check hasSeenOnboarding in AsyncStorage
    ↓
┌───────────────────────┬────────────────────┬──────────────────┐
│   First Time User     │   Returning User   │  Authenticated   │
│   (no onboarding)     │   (has onboarding) │     User         │
├───────────────────────┼────────────────────┼──────────────────┤
│  → welcome.tsx        │   → login.tsx      │  → /tabs/classes │
│     ↓                 │                    │                  │
│  → get-started.tsx    │                    │                  │
│     ↓                 │                    │                  │
│  → carousel.tsx       │                    │                  │
│     ↓                 │                    │                  │
│  → signup.tsx         │                    │                  │
└───────────────────────┴────────────────────┴──────────────────┘
         ↓                       ↓                    ↓
    Mark onboarding complete (AsyncStorage)
         ↓
    Authenticate user
         ↓
    → /tabs/classes (Main App)
```

## Skip Options

Users can bypass onboarding at multiple points:

1. **Welcome Screen**: "Log In" button → Direct to login
2. **Get Started Screen**: "Skip" button (top-right) → Direct to login
3. **Get Started Screen**: "Log In" button → Direct to login
4. **Carousel Screen**: "Skip" button (top-right) → Direct to login

All skip actions mark onboarding as complete via AsyncStorage.

---

## Technical Implementation

### Storage Management

**Key**: `hasSeenOnboarding` (stored in AsyncStorage)
**Location**: `utils/storage.ts`

**Helper Methods**:
```typescript
// Mark onboarding as complete
await storage.setOnboardingComplete()

// Check if user has seen onboarding
const hasCompleted = await storage.hasCompletedOnboarding()

// Reset onboarding (for testing)
await storage.resetOnboarding()
```

### Entry Point Logic (`app/index.tsx`)

1. Check authentication state from AppContext
2. Check onboarding completion status from AsyncStorage
3. Route user based on combined state:
   - Authenticated → Main app
   - Has completed onboarding → Login
   - First time → Welcome screen

### Onboarding Completion Triggers

Onboarding is marked complete when:
- User completes signup (`app/(auth)/signup.tsx`)
- User logs in (`app/(auth)/login.tsx`)
- User clicks "Skip" on any onboarding screen

---

## Design System

### Colors

- **Primary**: `#13a4ec` (Sky Blue)
- **Background Dark**: `#101c22`
- **Surface Dark**: `#1d2931`
- **Border**: `#325567`
- **Text Muted**: `#92b7c9`
- **White**: `#ffffff`

### Typography

- **Font Family**: Lexend (sans-serif)
- **Headings**: 32px - 48px, bold, tight tracking
- **Body**: 16px, normal weight, relaxed leading
- **Labels**: 14px, medium weight

### Spacing

- Consistent use of Tailwind spacing scale
- Gaps: 3 (12px), 4 (16px), 8 (32px)
- Padding: 4 (16px), 6 (24px)

### Border Radius

- Cards: `xl` (12px)
- Buttons: `xl` (12px) to `2xl` (16px)
- Images: `3xl` (24px)
- Icons: `2xl` (16px)

### Shadows

- Buttons: `shadow-lg` with primary color tint
- Cards: `shadow-2xl` for depth
- Glows: Blur effects with 20% opacity

---

## Components Structure

### Layout Pattern

All onboarding screens follow this structure:

```
<View className="flex-1 bg-[#101c22]">
  {/* Background Decorative Glows */}
  
  {/* Top Bar (Skip Button) */}
  
  {/* Main Content (Illustration + Text) */}
  
  {/* Bottom Actions (Buttons + Indicators) */}
</View>
```

### Reusable Elements

1. **Skip Button**: Top-right, subtle gray text
2. **Logo/Icon**: Checkmark circle in primary color
3. **Headline**: Large, bold, white text
4. **Description**: Muted color, readable line height
5. **Primary Button**: Full-width, primary background, shadow
6. **Secondary Button**: Transparent/border style

---

## Accessibility Considerations

- **Color Contrast**: All text meets WCAG AA standards
- **Touch Targets**: Buttons minimum 44x44 points
- **Screen Reader Support**: Proper alt text for illustrations
- **Keyboard Navigation**: All interactive elements accessible
- **Loading States**: Loading indicator during navigation

---

## Future Enhancements

Potential improvements to the onboarding flow:

1. **Animated Transitions**: Smooth fade/slide between screens
2. **Video Tutorials**: Embed short demo videos
3. **Interactive Tutorial**: Let users try features in sandbox
4. **Progress Persistence**: Save current carousel position
5. **A/B Testing**: Track which screens convert better
6. **Skip Analytics**: Monitor how many users skip onboarding
7. **Personalization**: Ask user role (teacher, admin, etc.)
8. **Language Selection**: Multi-language support

---

## Testing Checklist

- [ ] First time user sees welcome screen
- [ ] Returning user goes to login
- [ ] Authenticated user goes to main app
- [ ] Skip buttons work from all screens
- [ ] Carousel navigation works correctly
- [ ] Page indicators update properly
- [ ] Button states change on last carousel screen
- [ ] AsyncStorage persists onboarding state
- [ ] All navigation routes work correctly
- [ ] Images load properly with fallbacks
- [ ] Responsive design works on various screen sizes
- [ ] Dark theme applies consistently
- [ ] Typography scales correctly

---

## Troubleshooting

### Issue: User stuck in onboarding loop

**Solution**: Clear AsyncStorage key manually
```typescript
await AsyncStorage.removeItem('hasSeenOnboarding')
```

### Issue: Onboarding shows after login

**Solution**: Ensure login/signup handlers set onboarding flag
```typescript
await AsyncStorage.setItem('hasSeenOnboarding', 'true')
```

### Issue: Images not loading

**Solution**: Check network connection and image URLs are valid. Use placeholder images as fallback.

---

## Dependencies

Required packages:
- `expo-router`: Navigation between screens
- `@react-native-async-storage/async-storage`: Persistent storage
- `expo-linear-gradient`: Gradient overlays
- `@expo/vector-icons`: Icons (Ionicons)
- `react-native`: Core components (View, Text, Image, etc.)

---

## File Structure

```
app/
├── (onboarding)/
│   ├── _layout.tsx              # Onboarding stack navigator
│   ├── welcome.tsx              # Screen 1: Welcome
│   ├── get-started.tsx          # Screen 2: Get Started
│   └── onboarding-carousel.tsx  # Screen 3: Feature carousel
├── (auth)/
│   ├── login.tsx                # Login screen (marks onboarding complete)
│   └── signup.tsx               # Signup screen (marks onboarding complete)
├── index.tsx                    # Entry point with routing logic
└── _layout.tsx                  # Root layout (includes onboarding route)

utils/
└── storage.ts                   # Storage helpers including onboarding state

docs/
└── ONBOARDING_FLOW.md           # This documentation file
```

---

## Contact

For questions or issues related to the onboarding flow, refer to the main project documentation or contact the development team.
