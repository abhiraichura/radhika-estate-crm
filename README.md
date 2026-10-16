# Radhika Estate Agency — Rajkot Field CRM & Deal OS

## 100% Browser-Only Setup Guide (GitHub + Vercel + Firebase)

### Step 1: Upload to GitHub (From Mobile or Browser)
1. Unzip this downloaded `Radhika_Estate_Agency_GitHub_Repo.zip` file.
2. Open your new repository on **GitHub.com**.
3. Tap **"Add file" -> "Upload files"**.
4. Select all extracted files/folders (`package.json`, `vite.config.js`, `index.html`, `public/`, `src/`) and tap **"Commit changes"**.
   *(Tip: Also upload your `PHOTO-2026-10-14-16-28-58.JPG` logo file into the `public/` folder so it loads everywhere automatically).*

### Step 2: Connect Vercel & Add Your Credentials
1. Log into **Vercel.com** -> Tap **"Add New..." -> "Project"** -> Import your GitHub repository.
2. Expand the **"Environment Variables"** section on Vercel before clicking Deploy and add these 7 variables:
   - `VITE_GEMINI_API_KEY` = Your Google AI Studio Gemini API Key
   - `VITE_FIREBASE_API_KEY` = From Firebase Project Settings -> Web App Config
   - `VITE_FIREBASE_AUTH_DOMAIN` = e.g. `radhika-crm.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID` = e.g. `radhika-crm`
   - `VITE_FIREBASE_STORAGE_BUCKET` = e.g. `radhika-crm.appspot.com`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` = Your Sender ID
   - `VITE_FIREBASE_APP_ID` = Your Web App ID
3. Tap **Deploy**! Vercel will build your live PWA in ~45 seconds.

### Step 3: Enable Firebase Authentication & Firestore Rules
1. In **Firebase Console**:
   - Go to **Authentication -> Sign-in method** -> Enable **Anonymous** sign-in.
   - Go to **Firestore Database -> Rules** and publish:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if request.auth != null;
         }
       }
     }
     ```
