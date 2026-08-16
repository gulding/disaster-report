# Prijavi Problem BiH

Prijavi Problem BiH is a mobile and backend application designed for citizens of Bosnia and Herzegovina to easily report local infrastructure issues, natural disasters, and other communal problems directly to the relevant authorities.

## 🚀 Features

- **Anonymous or Authenticated Reporting:** Users can submit reports anonymously or create an account to track the status of their reports.
- **GPS Integration:** Automatically captures the exact geographic coordinates of the reported issue.
- **Interactive Map:** Displays a live map of Bosnia and Herzegovina with all reported issues marked by category.
- **Photo Evidence:** Allows users to attach photos of the issue either by taking a new picture or uploading from the gallery.
- **Real-Time Status Tracking:** Users can track the status of their reports (New → In Progress → Resolved).
- **Categorization:** Issues are sorted into clear categories (Potholes, Floods, Fires, Vandalism, etc.) with priority levels.
- **Dynamic Dark/Light Mode:** Fully integrated and automated Dark/Light theme toggle that remembers user preferences.

## 🛠️ Technology Stack

- **Mobile App:** React Native, Expo (SDK 54), Expo Router
- **Mapping:** CartoDB Voyager Map Tiles (via `react-native-maps` and `UrlTile`)
- **Backend / Database:** Supabase (PostgreSQL, Authentication, Storage)
- **State Management:** React Hooks & Context
- **Language:** TypeScript & JavaScript

## 📱 Mobile Application Structure

The mobile application is built using **Expo Router** for file-based routing.

- `app/(tabs)` - Main application tabs (New Report, Map, My Reports, Profile)
- `app/login.tsx` & `app/register.tsx` - Authentication screens
- `app/report/[id].tsx` - Detailed view of a specific report
- `components/` - Reusable UI components (ReportCard, StatusBadge, CategoryPicker, LocationPicker, PhotoPicker)
- `constants/` - Theme colors and category definitions
- `lib/` - Supabase client initialization

## 📦 Setup Instructions

### Prerequisites
- Node.js installed
- Expo Go app installed on your physical device (or an emulator)
- A Supabase project

### 1. Database Setup (Supabase)
1. Create a new Supabase project.
2. Run the provided SQL schema in the SQL Editor to create the `reports` table and necessary Row Level Security (RLS) policies.
3. Create a public storage bucket named `report-photos`.

### 2. Mobile App Setup
1. Navigate to the `mobile` directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update your Supabase credentials in `lib/supabase.ts`:
   ```typescript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```
4. Start the Expo development server:
   ```bash
   npx expo start
   ```
5. Scan the generated QR code using the Expo Go app on your phone.

## 🇧🇦 Map Configuration
The application is specifically configured for Bosnia and Herzegovina. The interactive map uses CartoDB Voyager tiles for clear, high-contrast visibility and restricts the initial view and marker clustering to the geographic bounds of BiH. The map auto-refreshes using `useFocusEffect` to ensure all new reports immediately appear on screen.

## 📝 License
This project is open-source and available under the MIT License.
