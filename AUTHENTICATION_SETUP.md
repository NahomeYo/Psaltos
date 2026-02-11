# Firebase Authentication Setup Guide

## ✅ What's Been Implemented

1. **Firebase Configuration** (`src/firebase.js`)
2. **Authentication Context** (`src/contexts/AuthContext.js`)
3. **Login Page** (`src/Login.js`)
4. **Signup Page** (`src/Signup.js`)
5. **Hymn Actions** (`src/utils/hymnActions.js`) - like, unlike, download functions
6. **Updated Components**:
   - App.js - wrapped with AuthProvider
   - Navbar.js - conditional profile picture & dropdown menu
   - Home.js - like/download buttons on hymns

## 🔧 Setup Steps Required

### 1. Install Firebase Dependencies
```bash
npm install firebase
```

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or use existing project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Enable "Google" (optional but recommended)
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database (start in test mode for development)
   - Set location

### 3. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click web icon (</>) to add a web app
4. Register app with nickname "Psaltos"
5. Copy the firebaseConfig object

### 4. Update Firebase Config File

Open `src/firebase.js` and replace the placeholder config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 5. Set Up Firestore Security Rules

In Firebase Console > Firestore Database > Rules, add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read hymns (if you add hymn documents)
    match /hymns/{hymnId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 6. Test the Authentication Flow

1. Start your app: `npm start`
2. Click "Sign In" button in navbar
3. Try creating an account
4. Try signing in with Google (if enabled)
5. Check that profile picture appears when logged in
6. Try liking a hymn (heart icon turns red)
7. Try downloading a hymn

## 🎨 Features Implemented

### User Features:
- ✅ Sign up with email/password
- ✅ Sign in with email/password
- ✅ Sign in with Google
- ✅ Sign out
- ✅ Profile picture in navbar (only when logged in)
- ✅ Profile dropdown menu
- ✅ Like hymns (heart icon)
- ✅ Unlike hymns
- ✅ Download hymns
- ✅ Persistent liked hymns (stored in Firestore)

### UI Changes:
- ✅ Profile picture hidden until user logs in
- ✅ "Sign In" button shown when logged out
- ✅ Profile dropdown with user info and logout
- ✅ Like button (heart icon) on each hymn
- ✅ Download button on each hymn
- ✅ Visual feedback (heart fills red when liked)
- ✅ Buttons scale on hover

## 📊 Database Structure

```
users/
  {userId}/
    displayName: string
    email: string
    photoURL: string (optional)
    likedHymns: array of hymnIds
    downloadedHymns: array of hymnIds
    createdAt: timestamp
```

## 🔐 Security Notes

- Users can only read/write their own data
- Authentication required for liking/downloading
- Firestore rules protect user privacy
- Email/password requires 6+ characters

## 🚀 Next Steps (Optional)

1. **Profile Page Enhancement**: Show user's liked hymns
2. **Playlist Feature**: Let users create custom playlists
3. **Sharing**: Share hymns with other users
4. **Comments**: Add comments to hymns
5. **Admin Panel**: Manage hymns and users

## ⚠️ Important Notes

- Remember to switch Firestore to production rules before deploying
- Keep your Firebase config secure (don't commit to public repos)
- Consider adding environment variables for sensitive data
- Test authentication flow thoroughly before going live

## 🐛 Troubleshooting

**If authentication isn't working:**
1. Check Firebase config is correct
2. Verify Authentication is enabled in Firebase Console
3. Check browser console for errors
4. Ensure Firestore rules allow access

**If likes/downloads aren't saving:**
1. Check Firestore is created and accessible
2. Verify security rules allow user data access
3. Check browser network tab for failed requests

## 📱 Testing Checklist

- [ ] Sign up with new account works
- [ ] Sign in with existing account works
- [ ] Google sign-in works (if enabled)
- [ ] Profile picture shows after login
- [ ] Profile dropdown appears
- [ ] Logout works
- [ ] Like button works
- [ ] Unlike button works
- [ ] Download button works
- [ ] Liked hymns persist after refresh
- [ ] Profile picture hidden when logged out
