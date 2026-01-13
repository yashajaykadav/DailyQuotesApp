# QuoteVault 🔐

> A full-featured Quote Discovery app with Cloud Sync, built in record time using an AI-First workflow.


## 📋 Project Overview

**QuoteVault** is a modern mobile application designed to discover, collect, and share inspiring quotes. Built with **React Native (Expo)** and **Supabase**, it features secure user authentication, real-time database syncing, and native sharing capabilities.

This project was developed as a submission for the Mobile Application Developer Assignment, focusing on **AI-assisted development efficiency**.

## 📋 Project ScreenShots

https://github.com/yashajaykadav/DailyQuotesApp/issues/1#issue-3809893910

## ✨ Features

### ✅ Core Requirements Implemented

* [x] **Authentication**: Secure Sign Up/Login with Email & Password (Supabase Auth).
* [x] **Discovery**: Infinite scrolling feed with "Quote of the Day" and pull-to-refresh.
* [x] **Smart Search**: Filter quotes by category (Motivation, Love, Success) or keyword.
* [x] **Favorites & Collections**: "Heart" quotes to save them to your personal profile (Cloud Sync).
* [x] **Social Sharing**: Generate beautiful, shareable images of quotes for Instagram/WhatsApp.
* [x] **Profile Management**: User profile with "Sign Out" and settings interface.
* [ ] **Notifications**: Logic for daily 9:00 AM inspiration reminders.
Notification is not posibile to implement because of react native compartibility issue

## 🤖 The AI Workflow

This project demonstrates an **AI-First Development Strategy**. I utilized AI tools to act as an architect and debugger, significantly reducing dev time.

| Task | AI Tool Used | Implementation Details |
| --- | --- | --- |
| **Database Architecture** | ChatGPT / Claude | Generated complex SQL Schema with RLS (Row Level Security) policies for secure user data. |
| **Logic & State** | Cursor (Composer) | Generated the `AuthContext` and Supabase client logic to handle session persistence across app restarts. |
| **UI Design** | Text-to-UI | Generated the `QuoteCard` styling and "Share as Image" logic using `react-native-view-shot`. |
| **Debugging** | AI Chat | Solved a critical Android crash (`SecureStore` 2KB limit) by refactoring to `AsyncStorage`. |

## 🛠️ Tech Stack

* **Framework**: React Native (Expo Router v3)
* **Language**: TypeScript
* **Backend**: Supabase (PostgreSQL + Auth)
* **Navigation**: File-based routing (`app/` directory)
* **State Management**: React Context + Hooks
* **UI Components**: Native components with `StyleSheet`

## 🚀 Setup & Installation

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/quotevault.git
cd QuoteVault

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Environment Configuration

Create a `.env` file in the root directory and add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

```

### 4. Database Setup (Supabase)

Run the following SQL script in your Supabase SQL Editor to seed the database:

```sql
-- Creates tables for Profiles, Quotes, and Favorites
-- (See the 'database_schema.sql' file in this repo for the full script)

```

### 5. Run the App

```bash
npx expo start

```

*Scan the QR code with the **Expo Go** app on your Android/iOS device.*

## 📂 Project Structure

```text
QuoteVault/
├── app/                  # Expo Router (Navigation)
│   ├── (auth)/           # Login & Signup Screens
│   ├── (tabs)/           # Main App Tabs (Home, Browse, Favorites)
│   └── _layout.tsx       # Root Layout (Auth Protection Logic)
├── components/           # Reusable UI (QuoteCard, Buttons)
├── lib/                  # Configuration (Supabase, Notifications)
└── assets/               # Static Images

```

## ⚠️ Known Limitations

* **Notifications on Expo Go**: The daily notification scheduling uses `expo-notifications`. Due to recent changes in Expo SDK 53, push notifications are restricted in the "Expo Go" client. The logic is fully implemented in `lib/notifications.ts` but may require a Development Build to fire correctly on some devices.

---

**Developed by [Yash]** *Built with ❤️ and AI*
