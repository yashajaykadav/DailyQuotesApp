# QuoteVault 🔐

> A full-featured Quote Discovery app with Cloud Sync, built in record time using an AI-First workflow.

## 📋 Project Overview

**QuoteVault** is a modern mobile application designed to discover, collect, and share inspiring quotes. Built with **React Native (Expo)** and **Supabase**, it features secure user authentication, real-time database syncing, and native sharing capabilities.

This project was developed as a submission for the Mobile Application Developer Assignment, focusing on **AI-assisted development efficiency**.

### 4. Database Setup (Supabase)

Run the following SQL script in your Supabase SQL Editor. 

> **Note:** This script includes a robust **Trigger** that automatically creates a public user profile row whenever a new user signs up via Authentication.

<details>
<summary><strong>👇 Click to view the full SQL Schema & Triggers</strong></summary>

```sql
-- 1. CLEANUP
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. ENABLE UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. PROFILES (Updated to include full_name)
CREATE TABLE profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text, 
  avatar_url text,
  updated_at timestamp with time zone
);

-- 4. QUOTES
CREATE TABLE quotes (
  id uuid primary key default uuid_generate_v4(),
  content text not null,
  author text not null,
  category text not null check (category in ('Motivation','Love','Success','Wisdom','Humor')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. FAVORITES
CREATE TABLE favorites (
  user_id uuid references auth.users(id) on delete cascade,
  quote_id uuid references quotes(id) on delete cascade,
  primary key (user_id, quote_id)
);

-- 6. SECURITY (RLS)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public quotes are viewable by everyone" ON quotes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 7. AUTOMATION: Trigger to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- 8. SEED DATA (Optional)
INSERT INTO quotes (content, author, category) VALUES
('The only way to do great work is to love what you do.', 'Steve Jobs', 'Success'),
('Success is not final, failure is not fatal.', 'Winston Churchill', 'Success');

</details>
```

## 📋 Project ScreenShots

https://github.com/yashajaykadav/DailyQuotesApp/issues/1#issue-3809893910
<p align="center">
  <img src="https://github.com/yashajaykadav/DailyQuotesApp/blob/main/screenshots/home.jpeg" width="30%" />
  <img src="https://github.com/yashajaykadav/DailyQuotesApp/blob/main/screenshots/share.jpeg" width="30%" /> 
  <img src="https://github.com/yashajaykadav/DailyQuotesApp/blob/main/screenshots/search.jpeg" width="30%" />
</p>

<p align="center">
  <img src="https://github.com/yashajaykadav/DailyQuotesApp/blob/main/screenshots/profile.jpeg" width="30%" />
  <img src="https://github.com/yashajaykadav/DailyQuotesApp/blob/main/screenshots/saved.jpeg" width="30%" /> 
</p>
## ✨ Features

### ✅ Core Requirements Implemented

- [x] **Authentication**: Secure Sign Up/Login with Email & Password (Supabase Auth).
- [x] **Discovery**: Infinite scrolling feed with "Quote of the Day" and pull-to-refresh.
- [x] **Smart Search**: Filter quotes by category (Motivation, Love, Success) or keyword.
- [x] **Favorites & Collections**: "Heart" quotes to save them to your personal profile (Cloud Sync).
- [x] **Social Sharing**: Generate beautiful, shareable images of quotes for Instagram/WhatsApp.
- [x] **Profile Management**: User profile with "Sign Out" and settings interface.
- [ ] **Notifications**: Logic for daily 9:00 AM inspiration reminders.
      Notification is not posibile to implement because of react native compartibility issue

## 🤖 The AI Workflow

This project demonstrates an **AI-First Development Strategy**. I utilized AI tools to act as an architect and debugger, significantly reducing dev time.

| Task                      | AI Tool Used      | Implementation Details                                                                                   |
| ------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------- |
| **Database Architecture** | ChatGPT / Claude  | Generated complex SQL Schema with RLS (Row Level Security) policies for secure user data.                |
| **Logic & State**         | Gemini            | Generated the `AuthContext` and Supabase client logic to handle session persistence across app restarts. |
| **UI Design**             | Text-to-UI        | Generated the `QuoteCard` styling and "Share as Image" logic using `react-native-view-shot`.             |
| **Debugging**             | AI Chat           | Solved a critical Android crash (`SecureStore` 2KB limit) by refactoring to `AsyncStorage`.              |

## Ai Prompts which used in projects

--**B. Create Login Screen** (`app/auth/login.tsx`):

Use AI prompt:
```
Create a React Native login screen with email/password fields using Expo Router.
Include form validation, loading states, and error handling.
Style it with a modern, clean design. Include link to signup.

--**B. Create useQuotes Hook** (`src/hooks/useQuotes.ts`):

AI Prompt:
```
Create a React Query hook for fetching quotes from Supabase with:
- Pagination (20 quotes per page)
- Category filtering
- Search by text/author
- Error handling
Include TypeScript types
```

**C. Home Screen** (`app/(tabs)/index.tsx`):

AI Prompt:
```
Create a React Native home screen with:
- "Quote of the Day" card at top (larger, featured)
- Horizontal category filter chips
- FlatList of quote cards with infinite scroll
- Pull-to-refresh
- Search bar
- Handle loading and empty states
Use modern, card-based design with shadows
```

**D. Quote Card Component** (`src/components/quote/QuoteCard.tsx`):

AI Prompt:
```
Create a reusable QuoteCard component with:
- Quote text (larger font)
- Author name
- Category badge
- Heart icon (favorite button)
- Share button
- Smooth press animations
- Support light/dark mode
Include TypeScript props
```


## 🛠️ Tech Stack

- **Framework**: React Native
- **Language**: TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **Navigation**: File-based routing (`app/` directory)
- **State Management**: React Context + Hooks
- **UI Components**: Native components with `StyleSheet`

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

_Scan the QR code with the **Expo Go** app on your Android/iOS device._

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

- **Notifications on Expo Go**: The daily notification scheduling uses `expo-notifications`. Due to recent changes in Expo SDK 53, push notifications are restricted in the "Expo Go" client. The logic is fully implemented in `lib/notifications.ts` but may require a Development Build to fire correctly on some devices.

---

**Developed by Yash** _Built with ❤️ and AI_
