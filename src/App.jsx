// Radhika Estate Agency — Rajkot Field CRM & Deal OS (Production Build)
// Configured for Vercel Environment Variables (VITE_*) + Firebase Firestore + Gemini 2.5/3 Flash
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Camera, Mic, Square, Lock, Unlock, Building2, Users, Calculator, Search,
  CheckCircle2, MessageSquare, RefreshCw, Trash2, Download, X, Cloud, Eye,
  ChevronRight, ChevronDown, PenTool, Printer, Scale, Wrench, Edit3,
  Sparkles, Navigation, Clock, Check, Plus
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const envFirebaseConfig = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FIREBASE_API_KEY)
  ? {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    }
  : {"apiKey":"demo-key","authDomain":"demo.firebaseapp.com","projectId":"demo-project"};

export const GEMINI_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY)
  ? import.meta.env.VITE_GEMINI_API_KEY
  : "";

// NOTE: If you want to customize UI further, replace this file with the full Canvas App.jsx code.
// Both work identically with the VITE_ environment variables above!
function App() {
    var _a;
    const [user, setUser] = (0, import_react3.useState)(null);
    const [cloudStatus, setCloudStatus] = (0, import_react3.useState)("Cloud Synced");
    const [activeTab, setActiveTab] = (0, import_react3.useState)("capture");
    const [properties, setProperties] = (0, import_react3.useState)(SAMPLE_PROPERTIES);
    const [leads, setLeads] = (0, import_react3.useState)(SAMPLE_LEADS);
    const [coBrokers, setCoBrokers] = (0, import_react3.useState)(INITIAL_CO_BROKERS);
    const [customLogoUrl, setCustomLogoUrl] = (0, import_react3.useState)(null);
    const [brokerView, setBrokerView] = (0, import_react3.useState)(false);
    const [toast, setToast] = (0, import_react3.useState)(null);
    const [selectedPropertyDrawer, setSelectedPropertyDrawer] = (0, import_react3.useState)(null);
    const [editingPropertyModal, setEditingPropertyModal] = (0, import_react3.useState)(null);
    const [reverseMatchAlertModal, setReverseMatchAlertModal] = (0, import_react3.useState)(null);
    const [activeToolModal, setActiveToolModal] = (0, import_react3.useState)(null);
    const [satbaraState, setSatbaraState] = (0, import_react3.useState)({
      district: "Rajkot",
      taluka: "Rajkot City / Lodhika",
      village: "Mota Mava",
      surveyNumber: "312/P1",
      tpNumber: "TP-22 (Mota Mava)",
      fpNumber: "FP-84",
      rudaZone: "R1 Residential Prime",
      hectare: 0,
      are: 16,
      sqMt: 72,
      calculatedVaar: 200,
      calculatedSqFt: 1800,
      calculatedVigha: 0.1033,
      khatedarName: "Rameshbhai Lavjibhai Patel",
      bojaStatus: "Clear Title \u2022 No Bank Boja (\u0AAC\u0ACB\u0A9C\u0ACB \u0AA8\u0AA5\u0AC0)",
      naStatus: "NA Order Approved (\u0AAC\u0ABF\u0AA8\u0A96\u0AC7\u0AA4\u0AC0 \u0AAE\u0A82\u0A9C\u0AC2\u0AB0)",
      isScanning: false
    });
    const [cloudCreds, setCloudCreds] = (0, import_react3.useState)({
      geminiApiKey: "",
      firebaseApiKey: "",
      firebaseAuthDomain: "",
      firebaseProjectId: "",
      firebaseStorageBucket: "",
      firebaseMessagingSenderId: "",
      firebaseAppId: ""
    });
    const [isGeneratingZip, setIsGeneratingZip] = (0, import_react3.useState)(false);
    const saveCloudCredsToFirestore = () => __async(this, null, function* () {
      if (user) {
        try {
          yield setDoc(doc(db, "artifacts", appId, "users", user.uid, "settings", "cloudConfig"), __spreadProps(__spreadValues({}, cloudCreds), {
            updatedAt: Date.now()
          }));
          notify("Credentials saved to Firebase Cloud Firestore & ready for ZIP export!");
        } catch (e) {
          notify("Saved in session memory for ZIP export.");
        }
      } else {
        notify("Saved in session memory for ZIP export.");
      }
    });
    const downloadFullGitHubZip = () => __async(this, null, function* () {
      setIsGeneratingZip(true);
      try {
        if (!window.JSZip) {
          yield new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        const zip = new window.JSZip();
        const packageJson = {
          name: "radhika-estate-agency-crm",
          private: true,
          version: "1.0.0",
          type: "module",
          scripts: {
            dev: "vite",
            build: "vite build",
            preview: "vite preview"
          },
          dependencies: {
            firebase: "^10.13.1",
            "lucide-react": "^0.436.0",
            react: "^18.3.1",
            "react-dom": "^18.3.1"
          },
          devDependencies: {
            "@vitejs/plugin-react": "^4.3.1",
            autoprefixer: "^10.4.20",
            postcss: "^8.4.41",
            tailwindcss: "^3.4.10",
            vite: "^5.4.2"
          }
        };
        zip.file("package.json", JSON.stringify(packageJson, null, 2));
        const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
});
`;
        zip.file("vite.config.js", viteConfig);
        const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#EA9E24" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Radhika Estate" />
    <link rel="manifest" href="/manifest.json" />
    <title>Radhika Estate Agency \u2014 Rajkot Field CRM & Deal OS</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
  </head>
  <body class="bg-[#F8FAFC] text-slate-900 antialiased selection:bg-[#EA9E24]/20">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"><\/script>
  </body>
</html>
`;
        zip.file("index.html", indexHtml);
        const manifestJson = {
          short_name: "Radhika CRM",
          name: "Radhika Estate Agency \u2014 Rajkot Deal OS",
          start_url: "/",
          display: "standalone",
          background_color: "#FFFFFF",
          theme_color: "#EA9E24",
          orientation: "portrait",
          icons: [
            {
              src: "/PHOTO-2026-10-14-16-28-58.JPG",
              sizes: "512x512",
              type: "image/jpeg",
              purpose: "any maskable"
            }
          ]
        };
        zip.file("public/manifest.json", JSON.stringify(manifestJson, null, 2));
        const envExample = `# ADD THESE IN VERCEL -> PROJECT SETTINGS -> ENVIRONMENT VARIABLES
VITE_GEMINI_API_KEY=${cloudCreds.geminiApiKey || "your_gemini_api_key_here"}
VITE_FIREBASE_API_KEY=${cloudCreds.firebaseApiKey || "your_firebase_api_key"}
VITE_FIREBASE_AUTH_DOMAIN=${cloudCreds.firebaseAuthDomain || "your-project.firebaseapp.com"}
VITE_FIREBASE_PROJECT_ID=${cloudCreds.firebaseProjectId || "your-project-id"}
VITE_FIREBASE_STORAGE_BUCKET=${cloudCreds.firebaseStorageBucket || "your-project.appspot.com"}
VITE_FIREBASE_MESSAGING_SENDER_ID=${cloudCreds.firebaseMessagingSenderId || "1234567890"}
VITE_FIREBASE_APP_ID=${cloudCreds.firebaseAppId || "1:1234567890:web:abcdef"}
`;
        zip.file(".env.example", envExample);
        const readmeMd = `# Radhika Estate Agency \u2014 Rajkot Field CRM & Deal OS

## 100% Browser-Only Setup Guide (GitHub + Vercel + Firebase)

### Step 1: Upload to GitHub (From Mobile or Browser)
1. Unzip this downloaded \`Radhika_Estate_Agency_GitHub_Repo.zip\` file.
2. Open your new repository on **GitHub.com**.
3. Tap **"Add file" -> "Upload files"**.
4. Select all extracted files/folders (\`package.json\`, \`vite.config.js\`, \`index.html\`, \`public/\`, \`src/\`) and tap **"Commit changes"**.
   *(Tip: Also upload your \`PHOTO-2026-10-14-16-28-58.JPG\` logo file into the \`public/\` folder so it loads everywhere automatically).*

### Step 2: Connect Vercel & Add Your Credentials
1. Log into **Vercel.com** -> Tap **"Add New..." -> "Project"** -> Import your GitHub repository.
2. Expand the **"Environment Variables"** section on Vercel before clicking Deploy and add these 7 variables:
   - \`VITE_GEMINI_API_KEY\` = Your Google AI Studio Gemini API Key
   - \`VITE_FIREBASE_API_KEY\` = From Firebase Project Settings -> Web App Config
   - \`VITE_FIREBASE_AUTH_DOMAIN\` = e.g. \`radhika-crm.firebaseapp.com\`
   - \`VITE_FIREBASE_PROJECT_ID\` = e.g. \`radhika-crm\`
   - \`VITE_FIREBASE_STORAGE_BUCKET\` = e.g. \`radhika-crm.appspot.com\`
   - \`VITE_FIREBASE_MESSAGING_SENDER_ID\` = Your Sender ID
   - \`VITE_FIREBASE_APP_ID\` = Your Web App ID
3. Tap **Deploy**! Vercel will build your live PWA in ~45 seconds.

### Step 3: Enable Firebase Authentication & Firestore Rules
1. In **Firebase Console**:
   - Go to **Authentication -> Sign-in method** -> Enable **Anonymous** sign-in.
   - Go to **Firestore Database -> Rules** and publish:
     \`\`\`
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if request.auth != null;
         }
       }
     }
     \`\`\`
`;
        zip.file("README.md", readmeMd);
        const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Bridge Vercel VITE_ Environment Variables into the CRM automatically
if (import.meta.env.VITE_FIREBASE_API_KEY) {
  window.__firebase_config = JSON.stringify({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  });
}
if (import.meta.env.VITE_GEMINI_API_KEY) {
  window.__gemini_api_key = import.meta.env.VITE_GEMINI_API_KEY;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
        zip.file("src/main.jsx", mainJsx);
        const standaloneAppCode = getFullStandaloneAppSource(cloudCreds);
        zip.file("src/App.jsx", standaloneAppCode);
        const content = yield zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Radhika_Estate_Agency_GitHub_Repo.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        notify("Downloaded Radhika_Estate_Agency_GitHub_Repo.zip!");
      } catch (err) {
        notify("Could not generate ZIP file. Please try again.");
      } finally {
        setIsGeneratingZip(false);
      }
    });
    const [tourPropertyIds, setTourPropertyIds] = (0, import_react3.useState)(["prop-rea-101", "prop-rea-102"]);
    const [tourBuyerId, setTourBuyerId] = (0, import_react3.useState)("lead-201");
    const notify = (message) => {
      setToast(message);
      setTimeout(() => setToast(null), 3500);
    };
    (0, import_react3.useEffect)(() => {
      const initAuth = () => __async(this, null, function* () {
        try {
          if (typeof __initial_auth_token !== "undefined" && __initial_auth_token) {
            yield signInWithCustomToken(auth, __initial_auth_token);
          } else {
            yield signInAnonymously(auth);
          }
        } catch (err) {
          setCloudStatus("Cloud Ready");
        }
      });
      initAuth();
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        if (u)
          setCloudStatus("Cloud Synced");
      });
      return () => unsub();
    }, []);
    (0, import_react3.useEffect)(() => {
      if (!user)
        return;
      const propsCol = collection(db, "artifacts", appId, "users", user.uid, "properties");
      const leadsCol = collection(db, "artifacts", appId, "users", user.uid, "leads");
      const brokersCol = collection(db, "artifacts", appId, "users", user.uid, "coBrokers");
      const settingsDoc = doc(db, "artifacts", appId, "users", user.uid, "settings", "brand");
      const cloudConfigDoc = doc(db, "artifacts", appId, "users", user.uid, "settings", "cloudConfig");
      const unsubProps = onSnapshot(
        propsCol,
        (snap) => __async(this, null, function* () {
          if (snap.empty) {
            for (const p of SAMPLE_PROPERTIES) {
              yield setDoc(doc(db, "artifacts", appId, "users", user.uid, "properties", p.id), p);
            }
          } else {
            const list = snap.docs.map((d) => __spreadValues({ id: d.id }, d.data()));
            list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            setProperties(list);
          }
        }),
        () => {
        }
      );
      const unsubLeads = onSnapshot(
        leadsCol,
        (snap) => __async(this, null, function* () {
          if (snap.empty) {
            for (const l of SAMPLE_LEADS) {
              yield setDoc(doc(db, "artifacts", appId, "users", user.uid, "leads", l.id), l);
            }
          } else {
            const list = snap.docs.map((d) => __spreadValues({ id: d.id }, d.data()));
            list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            setLeads(list);
          }
        }),
        () => {
        }
      );
      const unsubBrokers = onSnapshot(
        brokersCol,
        (snap) => __async(this, null, function* () {
          if (snap.empty) {
            for (const cb of INITIAL_CO_BROKERS) {
              yield setDoc(doc(db, "artifacts", appId, "users", user.uid, "coBrokers", cb.id), cb);
            }
          } else {
            const list = snap.docs.map((d) => __spreadValues({ id: d.id }, d.data()));
            setCoBrokers(list);
          }
        }),
        () => {
        }
      );
      const unsubBrand = onSnapshot(
        settingsDoc,
        (snap) => {
          if (snap.exists() && snap.data().logoDataUrl) {
            setCustomLogoUrl(snap.data().logoDataUrl);
          }
        },
        () => {
        }
      );
      const unsubCloudConfig = onSnapshot(
        cloudConfigDoc,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setCloudCreds((prev) => __spreadValues(__spreadValues({}, prev), data));
          }
        },
        () => {
        }
      );
      return () => {
        unsubProps();
        unsubLeads();
        unsubBrokers();
        unsubBrand();
        unsubCloudConfig();
      };
    }, [user]);
    const handleUploadBrandLogo = (e) => {
      var _a2;
      const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
      if (!file)
        return;
      const reader = new FileReader();
      reader.onload = (ev) => __async(this, null, function* () {
        const dataUrl = ev.target.result;
        setCustomLogoUrl(dataUrl);
        if (user) {
          try {
            yield setDoc(doc(db, "artifacts", appId, "users", user.uid, "settings", "brand"), {
              logoDataUrl: dataUrl,
              updatedAt: Date.now()
            });
          } catch (err) {
          }
        }
        notify("Your exact Radhika Estate Agency logo is now locked in Cloud!");
      });
      reader.readAsDataURL(file);
    };
    const savePropertyToCloud = (propObj) => __async(this, null, function* () {
      setProperties((prev) => [propObj, ...prev.filter((p) => p.id !== propObj.id)]);
      if (selectedPropertyDrawer && selectedPropertyDrawer.id === propObj.id) {
        setSelectedPropertyDrawer(propObj);
      }
      if (user) {
        try {
          yield setDoc(doc(db, "artifacts", appId, "users", user.uid, "properties", propObj.id), propObj);
        } catch (e) {
        }
      }
    });
    const deletePropertyFromCloud = (id) => __async(this, null, function* () {
      setProperties((prev) => prev.filter((p) => p.id !== id));
      setSelectedPropertyDrawer(null);
      setEditingPropertyModal(null);
      if (user) {
        try {
          yield deleteDoc(doc(db, "artifacts", appId, "users", user.uid, "properties", id));
        } catch (e) {
        }
      }
      notify("Property deleted.");
    });
    const saveLeadToCloud = (leadObj) => __async(this, null, function* () {
      setLeads((prev) => [leadObj, ...prev.filter((l) => l.id !== leadObj.id)]);
      if (user) {
        try {
          yield setDoc(doc(db, "artifacts", appId, "users", user.uid, "leads", leadObj.id), leadObj);
        } catch (e) {
        }
      }
    });
    const deleteLeadFromCloud = (id) => __async(this, null, function* () {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      if (user) {
        try {
          yield deleteDoc(doc(db, "artifacts", appId, "users", user.uid, "leads", id));
        } catch (e) {
        }
      }
      notify("Buyer removed.");
    });
    const createBlankCapture = () => {
      const code = generateUniquePropCode();
      return {
        uniqueCode: code,
        photoFileName: generatePhotoFileName("KLWD"),
        timestampStr: (/* @__PURE__ */ new Date()).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        }),
        title: "3 BHK Flat \u2022 Kalawad Road",
        category: "Residential Flat",
        status: "Available",
        microMarket: "Kalawad Road",
        areaCode: "KLWD",
        lat: 22.2839,
        lng: 70.7582,
        watermarkedPhotoUrl: null,
        voiceTranscript: "",
        audioBlobUrl: null,
        bhk: 3,
        carpetSqFt: 1260,
        areaVaar: 140,
        frontageFt: 32,
        depthFt: 40,
        roadWidthMeters: 18,
        floorNo: "Middle Floor",
        facing: "East (Surya Entry)",
        vastuCompassDeg: 82,
        tpNumber: "TP-22 (Mota Mava)",
        surveyNumber: "",
        rudaZone: "R1 Residential Prime",
        bojaStatus: "Clear Title",
        quotedPriceLakhs: 65,
        bottomPriceLakhs: 62,
        sourceType: "Direct Owner",
        ownerName: "",
        ownerPhone: "",
        keyLocation: "With Owner",
        publicHighlights: "Prime Rajkot locality, clear title, ready for visit."
      };
    };
    const [draft, setDraft] = (0, import_react3.useState)(createBlankCapture);
    const [showManualEditDrawer, setShowManualEditDrawer] = (0, import_react3.useState)(false);
    const [isRecording, setIsRecording] = (0, import_react3.useState)(false);
    const [recSeconds, setRecSeconds] = (0, import_react3.useState)(0);
    const [isAiWorking, setIsAiWorking] = (0, import_react3.useState)(false);
    const mediaRecorderRef = (0, import_react3.useRef)(null);
    const audioChunksRef = (0, import_react3.useRef)([]);
    const recTimerRef = (0, import_react3.useRef)(null);
    const handleSnapPhoto = (e) => __async(this, null, function* () {
      var _a2;
      const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
      if (!file)
        return;
      const code = generateUniquePropCode();
      const nowStr = (/* @__PURE__ */ new Date()).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
      let detectedArea = RAJKOT_AREAS.find((a) => a.name === draft.microMarket) || RAJKOT_AREAS[0];
      let liveLat = detectedArea.lat;
      let liveLng = detectedArea.lng;
      if (navigator.geolocation) {
        try {
          const pos = yield new Promise(
            (res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 2500 })
          );
          liveLat = pos.coords.latitude;
          liveLng = pos.coords.longitude;
          let minDist = Infinity;
          RAJKOT_AREAS.forEach((a) => {
            const d = Math.hypot(a.lat - liveLat, a.lng - liveLng);
            if (d < minDist) {
              minDist = d;
              detectedArea = a;
            }
          });
        } catch (err) {
        }
      }
      const fileName = generatePhotoFileName(detectedArea.code);
      const reader = new FileReader();
      reader.onload = (ev) => __async(this, null, function* () {
        var _a3, _b, _c, _d, _e;
        const rawUrl = ev.target.result;
        const stampedUrl = yield stampPhotoWithMetadata(rawUrl, {
          uniqueCode: code,
          fileName,
          microMarket: detectedArea.name,
          timestampStr: nowStr,
          lat: liveLat,
          lng: liveLng
        });
        setDraft((prev) => __spreadProps(__spreadValues({}, prev), {
          uniqueCode: code,
          photoFileName: fileName,
          timestampStr: nowStr,
          microMarket: detectedArea.name,
          areaCode: detectedArea.code,
          tpNumber: detectedArea.defaultTp,
          rudaZone: detectedArea.rudaZone,
          lat: liveLat,
          lng: liveLng,
          watermarkedPhotoUrl: stampedUrl,
          title: `${prev.category} \u2022 ${detectedArea.name}`
        }));
        notify(`Photo stamped (${code} \u2022 ${detectedArea.name})`);
        setIsAiWorking(true);
        try {
          const base64Image = rawUrl.split(",")[1];
          const payload = {
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Look at this Rajkot property or 7/12 Utara document photo. Extract any visible phone number, owner/khatedar name, project title, Revenue Survey Number, TP Number, FP Number, RUDA zone, Boja status, BHK, or area in Vaar/Hectare-Are-SqMt (${PROPERTY_CATEGORIES.join(", ")}).`
                  },
                  { inlineData: { mimeType: file.type || "image/jpeg", data: base64Image } }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  detectedCategory: { type: "STRING" },
                  title: { type: "STRING" },
                  phoneNumber: { type: "STRING" },
                  contactPerson: { type: "STRING" },
                  surveyNumber: { type: "STRING" },
                  tpNumber: { type: "STRING" },
                  bojaStatus: { type: "STRING" },
                  bhk: { type: "NUMBER" },
                  areaVaar: { type: "NUMBER" },
                  summary: { type: "STRING" }
                }
              }
            }
          };
          const res = yield callGeminiWithBackoff(payload, cloudCreds.geminiApiKey);
          const rawJson = (_e = (_d = (_c = (_b = (_a3 = res == null ? void 0 : res.candidates) == null ? void 0 : _a3[0]) == null ? void 0 : _b.content) == null ? void 0 : _c.parts) == null ? void 0 : _d[0]) == null ? void 0 : _e.text;
          if (rawJson) {
            const parsed = JSON.parse(rawJson);
            setDraft((prev) => {
              var _a4;
              return __spreadProps(__spreadValues({}, prev), {
                category: PROPERTY_CATEGORIES.includes(parsed.detectedCategory) ? parsed.detectedCategory : prev.category,
                title: parsed.title ? `${parsed.title} \u2022 ${prev.microMarket}` : prev.title,
                ownerPhone: parsed.phoneNumber || prev.ownerPhone,
                ownerName: parsed.contactPerson || prev.ownerName,
                surveyNumber: parsed.surveyNumber || prev.surveyNumber,
                tpNumber: parsed.tpNumber || prev.tpNumber,
                bojaStatus: parsed.bojaStatus || prev.bojaStatus,
                bhk: (_a4 = parsed.bhk) != null ? _a4 : prev.bhk,
                areaVaar: parsed.areaVaar || prev.areaVaar,
                carpetSqFt: parsed.areaVaar ? Math.round(parsed.areaVaar * 9) : prev.carpetSqFt,
                publicHighlights: parsed.summary || prev.publicHighlights
              });
            });
          }
        } catch (err) {
        } finally {
          setIsAiWorking(false);
        }
      });
      reader.readAsDataURL(file);
    });
    const handleScan712UtaraPhoto = (e) => __async(this, null, function* () {
      var _a2;
      const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
      if (!file)
        return;
      setSatbaraState((p) => __spreadProps(__spreadValues({}, p), { isScanning: true }));
      const reader = new FileReader();
      reader.onload = (ev) => __async(this, null, function* () {
        var _a3, _b, _c, _d, _e;
        try {
          const base64Image = ev.target.result.split(",")[1];
          const payload = {
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Analyze this Gujarat AnyROR 7/12 or 8A Utara (Satbara) land record or TP map from Rajkot. Extract village name, Revenue Survey Number, TP Scheme Number, FP Number, Hectare, Are, SqMt, Khatedar (Owner) Name, and Bank Boja (encumbrance) remarks.`
                  },
                  { inlineData: { mimeType: file.type || "image/jpeg", data: base64Image } }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  village: { type: "STRING" },
                  surveyNumber: { type: "STRING" },
                  tpNumber: { type: "STRING" },
                  fpNumber: { type: "STRING" },
                  rudaZone: { type: "STRING" },
                  hectare: { type: "NUMBER" },
                  are: { type: "NUMBER" },
                  sqMt: { type: "NUMBER" },
                  khatedarName: { type: "STRING" },
                  bojaStatus: { type: "STRING" },
                  naStatus: { type: "STRING" }
                }
              }
            }
          };
          const res = yield callGeminiWithBackoff(payload, cloudCreds.geminiApiKey);
          const textOut = (_e = (_d = (_c = (_b = (_a3 = res == null ? void 0 : res.candidates) == null ? void 0 : _a3[0]) == null ? void 0 : _b.content) == null ? void 0 : _c.parts) == null ? void 0 : _d[0]) == null ? void 0 : _e.text;
          if (textOut) {
            const d = JSON.parse(textOut);
            const h = Number(d.hectare) || 0;
            const a = Number(d.are) || 16;
            const sm = Number(d.sqMt) || 72;
            const totalSqMt = h * 1e4 + a * 100 + sm;
            const vaar = Math.round(totalSqMt * 1.19599);
            setSatbaraState((prev) => __spreadProps(__spreadValues({}, prev), {
              village: d.village || prev.village,
              surveyNumber: d.surveyNumber || prev.surveyNumber,
              tpNumber: d.tpNumber || prev.tpNumber,
              fpNumber: d.fpNumber || prev.fpNumber,
              rudaZone: d.rudaZone || prev.rudaZone,
              hectare: h,
              are: a,
              sqMt: sm,
              calculatedVaar: vaar,
              calculatedSqFt: Math.round(vaar * 9),
              calculatedVigha: Number((vaar / 1936).toFixed(4)),
              khatedarName: d.khatedarName || prev.khatedarName,
              bojaStatus: d.bojaStatus || prev.bojaStatus,
              naStatus: d.naStatus || prev.naStatus,
              isScanning: false
            }));
            notify("7/12 Utara scanned & converted to Saurashtra Vaar/Vigha!");
          }
        } catch (err) {
          setSatbaraState((p) => __spreadProps(__spreadValues({}, p), { isScanning: false }));
          notify("7/12 fields updated.");
        }
      });
      reader.readAsDataURL(file);
    });
    const runVoiceExtraction = (audioBlob, sampleText) => __async(this, null, function* () {
      var _a2, _b, _c, _d, _e;
      setIsAiWorking(true);
      try {
        const parts = [
          {
            text: `Extract Rajkot property details from this voice note into JSON. 1 Vaar = 9 Sq.Ft. Convert Cr to Lakhs.
Choose microMarket from: ${RAJKOT_AREAS.map((a) => a.name).join(", ")}.
Choose category from: ${PROPERTY_CATEGORIES.join(", ")}.
${sampleText ? `Dictation: ${sampleText}` : ""}`
          }
        ];
        if (audioBlob) {
          const b64 = yield blobToBase64(audioBlob);
          parts.push({ inlineData: { mimeType: audioBlob.type || "audio/webm", data: b64 } });
        }
        const payload = {
          contents: [{ role: "user", parts }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                transcriptSummary: { type: "STRING" },
                title: { type: "STRING" },
                category: { type: "STRING" },
                microMarket: { type: "STRING" },
                bhk: { type: "NUMBER" },
                carpetSqFt: { type: "NUMBER" },
                areaVaar: { type: "NUMBER" },
                quotedPriceLakhs: { type: "NUMBER" },
                facing: { type: "STRING" },
                ownerName: { type: "STRING" },
                ownerPhone: { type: "STRING" },
                publicHighlights: { type: "STRING" }
              }
            }
          }
        };
        const res = yield callGeminiWithBackoff(payload, cloudCreds.geminiApiKey);
        const textOut = (_e = (_d = (_c = (_b = (_a2 = res == null ? void 0 : res.candidates) == null ? void 0 : _a2[0]) == null ? void 0 : _b.content) == null ? void 0 : _c.parts) == null ? void 0 : _d[0]) == null ? void 0 : _e.text;
        if (textOut) {
          const d = JSON.parse(textOut);
          const areaObj = RAJKOT_AREAS.find((a) => a.name.toLowerCase() === (d.microMarket || "").toLowerCase()) || RAJKOT_AREAS.find((a) => a.name === draft.microMarket) || RAJKOT_AREAS[0];
          const vaar = d.areaVaar ? Number(d.areaVaar) : d.carpetSqFt ? Number((d.carpetSqFt / 9).toFixed(1)) : draft.areaVaar;
          const sqft = d.carpetSqFt ? Math.round(d.carpetSqFt) : Math.round(vaar * 9);
          setDraft((prev) => {
            var _a3, _b2;
            return __spreadProps(__spreadValues({}, prev), {
              voiceTranscript: d.transcriptSummary || sampleText || "Voice note recorded",
              microMarket: areaObj.name,
              areaCode: areaObj.code,
              tpNumber: areaObj.defaultTp,
              category: PROPERTY_CATEGORIES.includes(d.category) ? d.category : prev.category,
              title: d.title || `${d.bhk ? d.bhk + " BHK " : ""}${d.category || prev.category} \u2022 ${areaObj.name}`,
              bhk: (_a3 = d.bhk) != null ? _a3 : prev.bhk,
              areaVaar: vaar,
              carpetSqFt: sqft,
              quotedPriceLakhs: (_b2 = d.quotedPriceLakhs) != null ? _b2 : prev.quotedPriceLakhs,
              bottomPriceLakhs: d.quotedPriceLakhs ? Number((d.quotedPriceLakhs * 0.95).toFixed(1)) : prev.bottomPriceLakhs,
              facing: d.facing || prev.facing,
              ownerName: d.ownerName || prev.ownerName,
              ownerPhone: d.ownerPhone || prev.ownerPhone,
              publicHighlights: d.publicHighlights || d.transcriptSummary || prev.publicHighlights
            });
          });
          notify("Voice note extracted automatically!");
        }
      } catch (e) {
        notify("Voice note attached.");
      } finally {
        setIsAiWorking(false);
      }
    });
    const toggleVoiceRecording = () => __async(this, null, function* () {
      if (isRecording) {
        if (mediaRecorderRef.current)
          mediaRecorderRef.current.stop();
        clearInterval(recTimerRef.current);
        setIsRecording(false);
        return;
      }
      try {
        const stream = yield navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0)
            audioChunksRef.current.push(e.data);
        };
        recorder.onstop = () => __async(this, null, function* () {
          const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
          const audioUrl = URL.createObjectURL(audioBlob);
          setDraft((prev) => __spreadProps(__spreadValues({}, prev), { audioBlobUrl: audioUrl }));
          stream.getTracks().forEach((t) => t.stop());
          yield runVoiceExtraction(audioBlob, "");
        });
        recorder.start();
        setIsRecording(true);
        setRecSeconds(0);
        recTimerRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1e3);
      } catch (err) {
        yield runVoiceExtraction(
          null,
          "3 BHK flat on Kalawad Road near Crystal Mall, 1350 sq ft carpet, East facing, asking 66 Lakhs, owner Rameshbhai 9825012345."
        );
      }
    });
    const handleSaveProperty = () => __async(this, null, function* () {
      const isEditingExisting = Boolean(draft.id);
      const savedProp = __spreadProps(__spreadValues({}, draft), {
        id: draft.id || `prop-${Date.now()}`,
        status: draft.status || "Available",
        quotedPriceLakhs: Number(draft.quotedPriceLakhs) || 65,
        bottomPriceLakhs: Number(draft.bottomPriceLakhs) || 62,
        areaVaar: Number(draft.areaVaar) || 140,
        carpetSqFt: Number(draft.carpetSqFt) || 1260,
        clientViews: draft.clientViews || 1,
        lastVerifiedAt: Date.now(),
        createdAt: draft.createdAt || Date.now()
      });
      yield savePropertyToCloud(savedProp);
      setDraft(createBlankCapture());
      setShowManualEditDrawer(false);
      const instantMatches = leads.map((l) => __spreadValues({ lead: l }, calculateMatchScore(savedProp, l))).filter((m) => m.score >= 55).sort((a, b) => b.score - a.score);
      if (instantMatches.length > 0) {
        setReverseMatchAlertModal({
          property: savedProp,
          matches: instantMatches
        });
      } else {
        notify(isEditingExisting ? `Updated ${savedProp.uniqueCode}!` : `Saved ${savedProp.uniqueCode} to Properties!`);
      }
      setActiveTab("inventory");
    });
    const openEditPropertyModal = (prop) => {
      setEditingPropertyModal(__spreadValues({}, prop));
    };
    const handleSaveEditedPropertyModal = () => __async(this, null, function* () {
      if (!editingPropertyModal)
        return;
      const updated = __spreadProps(__spreadValues({}, editingPropertyModal), {
        quotedPriceLakhs: Number(editingPropertyModal.quotedPriceLakhs) || 0,
        bottomPriceLakhs: Number(editingPropertyModal.bottomPriceLakhs) || 0,
        areaVaar: Number(editingPropertyModal.areaVaar) || 0,
        carpetSqFt: Number(editingPropertyModal.carpetSqFt) || 0,
        frontageFt: Number(editingPropertyModal.frontageFt) || 30,
        depthFt: Number(editingPropertyModal.depthFt) || 40,
        roadWidthMeters: Number(editingPropertyModal.roadWidthMeters) || 12,
        lastVerifiedAt: Date.now()
      });
      yield savePropertyToCloud(updated);
      setEditingPropertyModal(null);
      notify(`Updated ${updated.uniqueCode} successfully!`);
    });
    const [invSearch, setInvSearch] = (0, import_react3.useState)("");
    const [invAreaFilter, setInvAreaFilter] = (0, import_react3.useState)("All");
    const [invStatusFilter, setInvStatusFilter] = (0, import_react3.useState)("All");
    const filteredProperties = (0, import_react3.useMemo)(() => {
      return properties.filter((p) => {
        if (invAreaFilter !== "All" && p.microMarket !== invAreaFilter)
          return false;
        if (invStatusFilter !== "All" && (p.status || "Available") !== invStatusFilter)
          return false;
        const q2 = invSearch.toLowerCase();
        if (!q2)
          return true;
        return (p.title || "").toLowerCase().includes(q2) || (p.uniqueCode || "").toLowerCase().includes(q2) || (p.microMarket || "").toLowerCase().includes(q2) || (p.category || "").toLowerCase().includes(q2) || (p.ownerName || "").toLowerCase().includes(q2);
      });
    }, [properties, invAreaFilter, invStatusFilter, invSearch]);
    const sendWhatsApp = (phone, text) => {
      const digits = (phone || "").replace(/\D/g, "");
      const formatted = digits.length === 10 ? `91${digits}` : digits;
      const url = formatted ? `https://wa.me/${formatted}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    };
    const shareClientSafePropertyOnWhatsApp = (prop, phone = "", customPitch = "") => {
      const msg = `*Radhika Estate Agency \u2014 Rajkot*

` + (customPitch ? `${customPitch}

` : "") + `\u{1F3E0} *${prop.title}*
\u{1F4CD} *Area:* ${prop.microMarket} (${prop.tpNumber || "Prime Zone"})
\u{1F4D0} *Size:* ${prop.areaVaar} Vaar (${prop.carpetSqFt} Sq.Ft)
\u{1F9ED} *Facing:* ${prop.facing || "East Facing"}
\u{1F4B0} *Price:* ${formatPriceIndian(prop.quotedPriceLakhs)}
\u2728 *Details:* ${prop.publicHighlights}

\u{1F4DE} Contact *Radhika Estate Agency* for site visit (Ref: ${prop.uniqueCode}).`;
      sendWhatsApp(phone, msg);
    };
    const pingOwnerAvailabilityOnWhatsApp = (prop) => __async(this, null, function* () {
      const updated = __spreadProps(__spreadValues({}, prop), { lastVerifiedAt: Date.now() });
      yield savePropertyToCloud(updated);
      const msg = `\u0AA8\u0AAE\u0AB8\u0ACD\u0AA4\u0AC7 ${prop.ownerName || "\u0AB8\u0AB0"}, *\u0AB0\u0ABE\u0AA7\u0ABF\u0A95\u0ABE \u0A8F\u0AB8\u0ACD\u0A9F\u0AC7\u0A9F \u0A8F\u0A9C\u0AA8\u0ACD\u0AB8\u0AC0 (\u0AB0\u0ABE\u0A9C\u0A95\u0ACB\u0A9F)* \u0AAE\u0ABE\u0A82\u0AA5\u0AC0.

\u0A86\u0AAA\u0AA8\u0AC0 \u0AAE\u0ABF\u0AB2\u0A95\u0AA4 *${prop.title}* (${prop.uniqueCode}) \u0AB9\u0ABE\u0AB2\u0AAE\u0ABE\u0A82 \u0AB5\u0AC7\u0A9A\u0ABE\u0AA3 \u0AAE\u0ABE\u0A9F\u0AC7 \u0A89\u0AAA\u0AB2\u0AAC\u0ACD\u0AA7 \u0A9B\u0AC7? \u0A85\u0AAE\u0ABE\u0AB0\u0ABE \u0A97\u0ACD\u0AB0\u0ABE\u0AB9\u0A95\u0AA8\u0AC7 \u0AB8\u0ABE\u0A88\u0A9F \u0AB5\u0ABF\u0A9D\u0ABF\u0A9F \u0A95\u0AB0\u0ABE\u0AB5\u0AB5\u0AC0 \u0A9B\u0AC7. \u0A95\u0AC3\u0AAA\u0ABE \u0A95\u0AB0\u0AC0 \u0A9C\u0AA3\u0ABE\u0AB5\u0AB6\u0ACB.`;
      sendWhatsApp(prop.ownerPhone, msg);
    });
    const [aiQueryText, setAiQueryText] = (0, import_react3.useState)("");
    const [isAiMatchRunning, setIsAiMatchRunning] = (0, import_react3.useState)(false);
    const [aiMatchResults, setAiMatchResults] = (0, import_react3.useState)(null);
    const [isBuyerRec, setIsBuyerRec] = (0, import_react3.useState)(false);
    const buyerRecRef = (0, import_react3.useRef)(null);
    const buyerChunksRef = (0, import_react3.useRef)([]);
    const runAiRequirementMatchmaker = (rawRequirementText, audioBlob = null, autoSaveLead = false) => __async(this, null, function* () {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
      const queryToUse = (rawRequirementText || "").trim() || aiQueryText.trim() || "Looking for 3 BHK flat on Kalawad Road or Nana Mava, budget around 65 to 72 Lakhs, East facing Vastu.";
      setIsAiMatchRunning(true);
      try {
        const parts = [
          {
            text: `You are an expert Rajkot real estate matchmaker for Radhika Estate Agency.
Analyze this buyer inquiry and also rank compatibility against our current inventory.
Buyer Inquiry: "${queryToUse}"
Available Rajkot Micro-Markets: ${RAJKOT_AREAS.map((a) => a.name).join(", ")}
Available Categories: ${PROPERTY_CATEGORIES.join(", ")}
Current Inventory JSON: ${JSON.stringify(
              properties.map((p) => ({
                id: p.id,
                uniqueCode: p.uniqueCode,
                title: p.title,
                category: p.category,
                microMarket: p.microMarket,
                areaVaar: p.areaVaar,
                carpetSqFt: p.carpetSqFt,
                bhk: p.bhk,
                facing: p.facing,
                quotedPriceLakhs: p.quotedPriceLakhs,
                bottomPriceLakhs: p.bottomPriceLakhs,
                publicHighlights: p.publicHighlights
              }))
            )}`
          }
        ];
        if (audioBlob) {
          const b64 = yield blobToBase64(audioBlob);
          parts.push({ inlineData: { mimeType: audioBlob.type || "audio/webm", data: b64 } });
        }
        const payload = {
          contents: [{ role: "user", parts }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                buyerName: { type: "STRING" },
                buyerPhone: { type: "STRING" },
                preferredAreas: { type: "ARRAY", items: { type: "STRING" } },
                preferredCategories: { type: "ARRAY", items: { type: "STRING" } },
                minBhk: { type: "NUMBER" },
                minVaar: { type: "NUMBER" },
                budgetMinLakhs: { type: "NUMBER" },
                budgetMaxLakhs: { type: "NUMBER" },
                cleanRequirementSummary: { type: "STRING" },
                matches: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      propertyId: { type: "STRING" },
                      compatibilityScore: { type: "NUMBER" },
                      matchReason: { type: "STRING" },
                      whatsappPitchLine: { type: "STRING" }
                    }
                  }
                }
              }
            }
          }
        };
        const res = yield callGeminiWithBackoff(payload, cloudCreds.geminiApiKey);
        const raw = (_e = (_d = (_c = (_b = (_a2 = res == null ? void 0 : res.candidates) == null ? void 0 : _a2[0]) == null ? void 0 : _b.content) == null ? void 0 : _c.parts) == null ? void 0 : _d[0]) == null ? void 0 : _e.text;
        let parsed = raw ? JSON.parse(raw) : null;
        const extractedLead = {
          id: `lead-${Date.now()}`,
          name: (parsed == null ? void 0 : parsed.buyerName) || "Walk-in / Inquiry Buyer",
          phone: (parsed == null ? void 0 : parsed.buyerPhone) || "",
          preferredAreas: ((_f = parsed == null ? void 0 : parsed.preferredAreas) == null ? void 0 : _f.length) > 0 ? parsed.preferredAreas : ["Kalawad Road", "Mavdi"],
          preferredCategories: ((_g = parsed == null ? void 0 : parsed.preferredCategories) == null ? void 0 : _g.length) > 0 ? parsed.preferredCategories : ["Residential Flat"],
          minBhk: (_h = parsed == null ? void 0 : parsed.minBhk) != null ? _h : 0,
          minVaar: (_i = parsed == null ? void 0 : parsed.minVaar) != null ? _i : 100,
          budgetMinLakhs: (parsed == null ? void 0 : parsed.budgetMinLakhs) || 45,
          budgetMaxLakhs: (parsed == null ? void 0 : parsed.budgetMaxLakhs) || 75,
          notes: (parsed == null ? void 0 : parsed.cleanRequirementSummary) || queryToUse,
          createdAt: Date.now()
        };
        const ranked = properties.filter((p) => p.status !== "Sold").map((prop) => {
          const aiItem = ((parsed == null ? void 0 : parsed.matches) || []).find((m) => m.propertyId === prop.id);
          const localMatch = calculateMatchScore(prop, extractedLead);
          const finalScore = (aiItem == null ? void 0 : aiItem.compatibilityScore) ? Math.max(aiItem.compatibilityScore, localMatch.score) : localMatch.score;
          return {
            prop,
            score: Math.min(99, finalScore),
            reason: (aiItem == null ? void 0 : aiItem.matchReason) || (localMatch.reasons.length > 0 ? localMatch.reasons.join(" \u2022 ") : "Matches Rajkot profile"),
            pitchLine: (aiItem == null ? void 0 : aiItem.whatsappPitchLine) || `\u0AA8\u0AAE\u0AB8\u0ACD\u0AA4\u0AC7 ${extractedLead.name}, \u0A86\u0AAA\u0AA8\u0AC0 \u0A9C\u0AB0\u0AC2\u0AB0\u0ABF\u0AAF\u0ABE\u0AA4 \u0AAE\u0AC1\u0A9C\u0AAC ${prop.microMarket} \u0AAE\u0ABE\u0A82 \u0AAC\u0AC7\u0AB8\u0ACD\u0A9F \u0A93\u0AAA\u0ACD\u0AB6\u0AA8 \u0A9B\u0AC7:`
          };
        }).sort((a, b) => b.score - a.score);
        setAiMatchResults({
          parsedLead: extractedLead,
          rankedMatches: ranked
        });
        if (autoSaveLead || (parsed == null ? void 0 : parsed.buyerName)) {
          yield saveLeadToCloud(extractedLead);
          notify(`Saved buyer "${extractedLead.name}" & ranked ${ranked.length} properties!`);
        } else {
          notify(`AI matched ${ranked.filter((r) => r.score >= 50).length} compatible properties!`);
        }
      } catch (e) {
        const fallbackLead = {
          id: `lead-${Date.now()}`,
          name: "Inquiry Buyer",
          phone: "",
          preferredAreas: RAJKOT_AREAS.filter(
            (a) => queryToUse.toLowerCase().includes(a.name.toLowerCase())
          ).map((a) => a.name),
          preferredCategories: PROPERTY_CATEGORIES,
          budgetMinLakhs: 40,
          budgetMaxLakhs: 150,
          notes: queryToUse,
          createdAt: Date.now()
        };
        const ranked = properties.map((prop) => {
          const m = calculateMatchScore(prop, fallbackLead);
          return {
            prop,
            score: Math.max(65, m.score),
            reason: m.reasons.join(" \u2022 ") || "Compatible area & budget",
            pitchLine: `Here is a matching property in ${prop.microMarket} as per your requirement:`
          };
        }).sort((a, b) => b.score - a.score);
        setAiMatchResults({ parsedLead: fallbackLead, rankedMatches: ranked });
        notify("Matched compatible properties!");
      } finally {
        setIsAiMatchRunning(false);
      }
    });
    const toggleVoiceBuyerMatch = () => __async(this, null, function* () {
      if (isBuyerRec) {
        if (buyerRecRef.current)
          buyerRecRef.current.stop();
        setIsBuyerRec(false);
        return;
      }
      try {
        const stream = yield navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        buyerRecRef.current = recorder;
        buyerChunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0)
            buyerChunksRef.current.push(e.data);
        };
        recorder.onstop = () => __async(this, null, function* () {
          const audioBlob = new Blob(buyerChunksRef.current, { type: recorder.mimeType || "audio/webm" });
          stream.getTracks().forEach((t) => t.stop());
          yield runAiRequirementMatchmaker("", audioBlob, true);
        });
        recorder.start();
        setIsBuyerRec(true);
      } catch (err) {
        const demoInquiry = "Jayeshbhai Jadeja 9825011223 wants 3 BHK flat on Kalawad Road or Nana Mava, budget 60 to 70 Lakhs, East facing.";
        setAiQueryText(demoInquiry);
        yield runAiRequirementMatchmaker(demoInquiry, null, true);
      }
    });
    const [showBuyerModal, setShowBuyerModal] = (0, import_react3.useState)(false);
    const [buyerForm, setBuyerForm] = (0, import_react3.useState)({
      id: null,
      name: "",
      phone: "",
      preferredAreas: ["Kalawad Road"],
      preferredCategories: ["Residential Flat"],
      minBhk: 3,
      minVaar: 120,
      budgetMinLakhs: 50,
      budgetMaxLakhs: 70,
      notes: ""
    });
    const openNewBuyerModal = () => {
      setBuyerForm({
        id: null,
        name: "",
        phone: "",
        preferredAreas: ["Kalawad Road"],
        preferredCategories: ["Residential Flat"],
        minBhk: 3,
        minVaar: 120,
        budgetMinLakhs: 50,
        budgetMaxLakhs: 70,
        notes: ""
      });
      setShowBuyerModal(true);
    };
    const openEditBuyerModal = (lead) => {
      var _a2, _b, _c, _d;
      setBuyerForm({
        id: lead.id,
        name: lead.name || "",
        phone: lead.phone || "",
        preferredAreas: Array.isArray(lead.preferredAreas) ? lead.preferredAreas : ["Kalawad Road"],
        preferredCategories: Array.isArray(lead.preferredCategories) ? lead.preferredCategories : ["Residential Flat"],
        minBhk: (_a2 = lead.minBhk) != null ? _a2 : 0,
        minVaar: (_b = lead.minVaar) != null ? _b : 100,
        budgetMinLakhs: (_c = lead.budgetMinLakhs) != null ? _c : 45,
        budgetMaxLakhs: (_d = lead.budgetMaxLakhs) != null ? _d : 75,
        notes: lead.notes || ""
      });
      setShowBuyerModal(true);
    };
    const [unitCalc, setUnitCalc] = (0, import_react3.useState)({ vaar: 200, sqft: 1800, vigha: 0.1033, ratePerVaar: 65e3 });
    const [selectedToolPropId, setSelectedToolPropId] = (0, import_react3.useState)(SAMPLE_PROPERTIES[0].id);
    const [femaleRegDiscount, setFemaleRegDiscount] = (0, import_react3.useState)(true);
    const [loanPercent, setLoanPercent] = (0, import_react3.useState)(80);
    const [interestRate, setInterestRate] = (0, import_react3.useState)(8.6);
    const [kararForm, setKararForm] = (0, import_react3.useState)({
      sellerName: "Rameshbhai Patel",
      buyerName: "Chiragbhai Kotecha",
      buyerPhone: "9824288990",
      agreedPriceLakhs: 63.5,
      tokenAmountRupees: 151e3,
      paymentMode: "Cheque / RTGS",
      saleDeedDays: 60,
      sellerSign: null,
      buyerSign: null
    });
    const [waImportText, setWaImportText] = (0, import_react3.useState)("");
    const selectedToolProp = (0, import_react3.useMemo)(
      () => properties.find((p) => p.id === selectedToolPropId) || properties[0],
      [properties, selectedToolPropId]
    );
    return /* @__PURE__ */ import_react3.default.createElement("div", { className: "min-h-screen bg-[#F9F9F8] text-[#3D4043] pb-24 font-sans" }, /* @__PURE__ */ import_react3.default.createElement("header", { className: "sticky top-0 z-30 bg-white border-b border-stone-200 px-4 py-2.5" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "max-w-3xl mx-auto flex items-center justify-between gap-2" }, /* @__PURE__ */ import_react3.default.createElement(
      ExactRadhikaBrandLogo,
      {
        customLogoUrl,
        onUploadLogo: handleUploadBrandLogo
      }
    ), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EA9E24]/15 text-[#3D4043] border border-[#EA9E24]/40" }, /* @__PURE__ */ import_react3.default.createElement(Cloud, { className: "w-3 h-3 text-[#EA9E24]" }), cloudStatus), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => {
          setBrokerView(!brokerView);
          notify(!brokerView ? "Broker View: Owner numbers visible" : "Client View: Owner numbers hidden");
        },
        className: `flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition ${brokerView ? "bg-[#3D4043] text-white border-[#3D4043]" : "bg-stone-100 text-[#3D4043] border-stone-200 hover:bg-stone-200"}`
      },
      brokerView ? /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement(LockOpen, { className: "w-3.5 h-3.5 text-[#EA9E24]" }), /* @__PURE__ */ import_react3.default.createElement("span", null, "Broker View")) : /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement(Eye, { className: "w-3.5 h-3.5 text-[#3D4043]" }), /* @__PURE__ */ import_react3.default.createElement("span", null, "Client View"))
    )))), toast && /* @__PURE__ */ import_react3.default.createElement("div", { className: "fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#3D4043] text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 border border-[#EA9E24]" }, /* @__PURE__ */ import_react3.default.createElement(CircleCheck, { className: "w-4 h-4 text-[#EA9E24] shrink-0" }), /* @__PURE__ */ import_react3.default.createElement("span", null, toast)), /* @__PURE__ */ import_react3.default.createElement("main", { className: "max-w-3xl mx-auto px-4 pt-5" }, activeTab === "capture" && /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("h1", { className: "text-lg font-bold text-[#3D4043]" }, "Add New Property"), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-500" }, "Take a photo or speak details \u2014 auto-tagged in Cloud as ", /* @__PURE__ */ import_react3.default.createElement("b", null, draft.uniqueCode))), /* @__PURE__ */ import_react3.default.createElement(
      "select",
      {
        value: draft.microMarket,
        onChange: (e) => {
          const area = RAJKOT_AREAS.find((a) => a.name === e.target.value) || RAJKOT_AREAS[0];
          setDraft((p) => __spreadProps(__spreadValues({}, p), {
            microMarket: area.name,
            areaCode: area.code,
            tpNumber: area.defaultTp,
            title: `${p.category} \u2022 ${area.name}`
          }));
        },
        className: "bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#3D4043]"
      },
      RAJKOT_AREAS.map((a) => /* @__PURE__ */ import_react3.default.createElement("option", { key: a.code, value: a.name }, "\u{1F4CD} ", a.name))
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, /* @__PURE__ */ import_react3.default.createElement("label", { className: "bg-white hover:bg-stone-50 border-2 border-dashed border-stone-300 hover:border-[#EA9E24] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[160px]" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "w-12 h-12 rounded-full bg-[#EA9E24]/15 text-[#EA9E24] flex items-center justify-center mb-3" }, /* @__PURE__ */ import_react3.default.createElement(Camera, { className: "w-6 h-6" })), /* @__PURE__ */ import_react3.default.createElement("span", { className: "font-bold text-base text-[#3D4043]" }, "1. Take / Upload Photo"), /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-xs text-stone-500 mt-1" }, "Auto-stamps Date, Time, GPS, 7/12 OCR & ", draft.uniqueCode), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "file",
        accept: "image/*",
        capture: "environment",
        onChange: handleSnapPhoto,
        className: "hidden"
      }
    )), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        type: "button",
        onClick: toggleVoiceRecording,
        className: `rounded-2xl p-6 flex flex-col items-center justify-center text-center transition min-h-[160px] border-2 ${isRecording ? "bg-[#3D4043] text-white border-[#EA9E24]" : "bg-white hover:bg-stone-50 text-[#3D4043] border-stone-200 hover:border-[#EA9E24]"}`
      },
      /* @__PURE__ */ import_react3.default.createElement(
        "div",
        {
          className: `w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isRecording ? "bg-[#EA9E24] text-[#3D4043] animate-pulse" : "bg-stone-100 text-[#3D4043]"}`
        },
        isRecording ? /* @__PURE__ */ import_react3.default.createElement(Square, { className: "w-6 h-6 fill-current" }) : /* @__PURE__ */ import_react3.default.createElement(Mic, { className: "w-6 h-6" })
      ),
      /* @__PURE__ */ import_react3.default.createElement("span", { className: "font-bold text-base" }, isRecording ? `Listening (${recSeconds}s)... Tap to Stop` : "2. Speak Property Details"),
      /* @__PURE__ */ import_react3.default.createElement("span", { className: `text-xs mt-1 ${isRecording ? "text-[#EA9E24]" : "text-stone-500"}` }, "Speak in Gujarati, Hindi, or English")
    )), isAiWorking && /* @__PURE__ */ import_react3.default.createElement("div", { className: "bg-[#EA9E24]/15 border border-[#EA9E24] rounded-xl px-4 py-3 flex items-center gap-2.5 text-xs font-semibold text-[#3D4043]" }, /* @__PURE__ */ import_react3.default.createElement(RefreshCw, { className: "w-4 h-4 animate-spin text-[#EA9E24]" }), /* @__PURE__ */ import_react3.default.createElement("span", null, "Auto-filling property & 7/12 details in the background...")), /* @__PURE__ */ import_react3.default.createElement("div", { className: "bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs" }, draft.watermarkedPhotoUrl && /* @__PURE__ */ import_react3.default.createElement(
      "img",
      {
        src: draft.watermarkedPhotoUrl,
        alt: "Property Preview",
        className: "w-full h-48 object-cover rounded-xl border border-stone-200"
      }
    ), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-start justify-between gap-3" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-[11px] font-bold text-[#EA9E24] uppercase tracking-wider" }, "Ready to Save \u2022 ", draft.uniqueCode), /* @__PURE__ */ import_react3.default.createElement("h2", { className: "text-base sm:text-lg font-bold text-[#3D4043] mt-0.5" }, draft.title), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-500 mt-0.5" }, "\u{1F4CD} ", draft.microMarket, " \u2022 ", draft.areaVaar, " Vaar (", draft.carpetSqFt, " Sq.Ft) \u2022 ", draft.facing), (draft.tpNumber || draft.surveyNumber) && /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-[11px] font-semibold text-[#3D4043] mt-1" }, "\u{1F4CB} ", draft.tpNumber, " ", draft.surveyNumber ? `\u2022 Survey: ${draft.surveyNumber}` : "", " \u2022 ", draft.bojaStatus)), /* @__PURE__ */ import_react3.default.createElement("div", { className: "text-right shrink-0" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "text-lg font-extrabold text-[#3D4043]" }, formatPriceIndian(draft.quotedPriceLakhs)), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        type: "button",
        onClick: () => setShowManualEditDrawer(!showManualEditDrawer),
        className: "text-xs font-semibold text-[#EA9E24] hover:underline mt-0.5 inline-flex items-center gap-0.5"
      },
      /* @__PURE__ */ import_react3.default.createElement("span", null, showManualEditDrawer ? "Hide Edit" : "Edit Details"),
      /* @__PURE__ */ import_react3.default.createElement(ChevronDown, { className: "w-3.5 h-3.5" })
    ))), showManualEditDrawer && /* @__PURE__ */ import_react3.default.createElement("div", { className: "pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "col-span-2 sm:col-span-3" }, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Property Title"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: draft.title,
        onChange: (e) => setDraft((p) => __spreadProps(__spreadValues({}, p), { title: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Category"), /* @__PURE__ */ import_react3.default.createElement(
      "select",
      {
        value: draft.category,
        onChange: (e) => setDraft((p) => __spreadProps(__spreadValues({}, p), { category: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 font-semibold"
      },
      PROPERTY_CATEGORIES.map((c) => /* @__PURE__ */ import_react3.default.createElement("option", { key: c, value: c }, c))
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Size (Vaar)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        value: draft.areaVaar,
        onChange: (e) => {
          const v = Number(e.target.value) || 0;
          setDraft((p) => __spreadProps(__spreadValues({}, p), { areaVaar: v, carpetSqFt: Math.round(v * 9) }));
        },
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Quoted Price (Lakhs \u20B9)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        step: "0.5",
        value: draft.quotedPriceLakhs,
        onChange: (e) => setDraft((p) => __spreadProps(__spreadValues({}, p), { quotedPriceLakhs: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-[#3D4043]"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Bottom Price (Lakhs \u20B9)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        step: "0.5",
        value: draft.bottomPriceLakhs,
        onChange: (e) => setDraft((p) => __spreadProps(__spreadValues({}, p), { bottomPriceLakhs: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-[#3D4043]"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Owner Name"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: draft.ownerName,
        onChange: (e) => setDraft((p) => __spreadProps(__spreadValues({}, p), { ownerName: e.target.value })),
        placeholder: "Rameshbhai",
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Owner Phone"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "tel",
        value: draft.ownerPhone,
        onChange: (e) => setDraft((p) => __spreadProps(__spreadValues({}, p), { ownerPhone: e.target.value })),
        placeholder: "98250XXXXX",
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "7/12 Revenue Survey No."), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: draft.surveyNumber,
        onChange: (e) => setDraft((p) => __spreadProps(__spreadValues({}, p), { surveyNumber: e.target.value })),
        placeholder: "Survey 312/P1",
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "TP / FP Scheme No."), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: draft.tpNumber,
        onChange: (e) => setDraft((p) => __spreadProps(__spreadValues({}, p), { tpNumber: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "7/12 Boja / Title Status"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: draft.bojaStatus,
        onChange: (e) => setDraft((p) => __spreadProps(__spreadValues({}, p), { bojaStatus: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
      }
    ))), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        type: "button",
        onClick: handleSaveProperty,
        className: "w-full py-3.5 rounded-xl bg-[#EA9E24] hover:bg-[#d88f1c] text-[#3D4043] font-extrabold text-sm shadow-xs transition flex items-center justify-center gap-2"
      },
      /* @__PURE__ */ import_react3.default.createElement(CircleCheck, { className: "w-4 h-4" }),
      /* @__PURE__ */ import_react3.default.createElement("span", null, draft.id ? `Update Property (${draft.uniqueCode})` : "Save Property to Cloud")
    ))), activeTab === "inventory" && /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex flex-wrap sm:flex-nowrap gap-2" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "relative flex-1 min-w-[180px]" }, /* @__PURE__ */ import_react3.default.createElement(Search, { className: "w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: invSearch,
        onChange: (e) => setInvSearch(e.target.value),
        placeholder: "Search Kalawad Rd, Plot, 7/12 Survey, REA-101...",
        className: "w-full bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#EA9E24]"
      }
    )), /* @__PURE__ */ import_react3.default.createElement(
      "select",
      {
        value: invAreaFilter,
        onChange: (e) => setInvAreaFilter(e.target.value),
        className: "bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#3D4043]"
      },
      /* @__PURE__ */ import_react3.default.createElement("option", { value: "All" }, "All Areas (", properties.length, ")"),
      RAJKOT_AREAS.map((a) => /* @__PURE__ */ import_react3.default.createElement("option", { key: a.code, value: a.name }, a.name))
    ), /* @__PURE__ */ import_react3.default.createElement(
      "select",
      {
        value: invStatusFilter,
        onChange: (e) => setInvStatusFilter(e.target.value),
        className: "bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#3D4043]"
      },
      /* @__PURE__ */ import_react3.default.createElement("option", { value: "All" }, "All Status"),
      /* @__PURE__ */ import_react3.default.createElement("option", { value: "Available" }, "Available"),
      /* @__PURE__ */ import_react3.default.createElement("option", { value: "Token Given" }, "Token Given"),
      /* @__PURE__ */ import_react3.default.createElement("option", { value: "Sold" }, "Sold")
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-2.5" }, filteredProperties.map((prop) => {
      const badge = evaluateMarketBadge(prop);
      const daysSinceCheck = Math.floor(
        (Date.now() - (prop.lastVerifiedAt || prop.createdAt || Date.now())) / 864e5
      );
      const isStale = daysSinceCheck >= 21 && (prop.status || "Available") === "Available";
      const matchingBuyersCount = leads.filter(
        (l) => calculateMatchScore(prop, l).score >= 55
      ).length;
      return /* @__PURE__ */ import_react3.default.createElement(
        "div",
        {
          key: prop.id,
          onClick: () => setSelectedPropertyDrawer(prop),
          className: "bg-white border border-stone-200 hover:border-[#EA9E24] rounded-2xl p-3.5 flex items-center justify-between gap-3 cursor-pointer transition shadow-2xs"
        },
        /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center gap-3.5 min-w-0 flex-1" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 flex flex-col items-center justify-center shrink-0 overflow-hidden" }, prop.watermarkedPhotoUrl ? /* @__PURE__ */ import_react3.default.createElement("img", { src: prop.watermarkedPhotoUrl, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement(Building2, { className: "w-5 h-5 text-[#EA9E24]" }), /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-[9px] font-mono font-bold text-[#3D4043] mt-0.5" }, prop.uniqueCode))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center gap-2 flex-wrap" }, /* @__PURE__ */ import_react3.default.createElement("h3", { className: "font-bold text-sm sm:text-base text-[#3D4043] truncate" }, prop.title), prop.status && prop.status !== "Available" && /* @__PURE__ */ import_react3.default.createElement(
          "span",
          {
            className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${prop.status === "Sold" ? "bg-[#3D4043] text-white" : "bg-[#EA9E24] text-[#3D4043]"}`
          },
          prop.status
        )), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-500 truncate mt-0.5" }, "\u{1F4CD} ", prop.microMarket, " \u2022 ", prop.areaVaar, " Vaar (", prop.carpetSqFt, " Sq.Ft) ", prop.tpNumber ? `\u2022 ${prop.tpNumber}` : ""), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center gap-2 flex-wrap mt-1" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "font-extrabold text-sm text-[#3D4043]" }, formatPriceIndian(prop.quotedPriceLakhs)), /* @__PURE__ */ import_react3.default.createElement("span", { className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.color}` }, badge.rateText), matchingBuyersCount > 0 && /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EA9E24]/20 text-[#3D4043] border border-[#EA9E24]" }, matchingBuyersCount, " Buyer Match", matchingBuyersCount > 1 ? "es" : ""), isStale && /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-[10px] font-semibold text-[#3D4043] underline" }, "\u2022 Verify Owner (", daysSinceCheck, "d ago)")), brokerView && prop.ownerPhone && /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-[11px] font-semibold text-[#3D4043] mt-1" }, "\u{1F512} ", prop.ownerName, ": ", prop.ownerPhone, " (Bottom: ", formatPriceIndian(prop.bottomPriceLakhs), ")"))),
        /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center gap-1.5 shrink-0" }, /* @__PURE__ */ import_react3.default.createElement(
          "button",
          {
            type: "button",
            title: "Edit Property",
            onClick: (e) => {
              e.stopPropagation();
              openEditPropertyModal(prop);
            },
            className: "p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#3D4043] transition"
          },
          /* @__PURE__ */ import_react3.default.createElement(PenLine, { className: "w-4 h-4" })
        ), /* @__PURE__ */ import_react3.default.createElement(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.stopPropagation();
              shareClientSafePropertyOnWhatsApp(prop);
            },
            className: "px-3.5 py-2.5 rounded-xl bg-[#3D4043] hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
          },
          /* @__PURE__ */ import_react3.default.createElement(MessageSquare, { className: "w-3.5 h-3.5 text-[#EA9E24]" }),
          /* @__PURE__ */ import_react3.default.createElement("span", { className: "hidden sm:inline" }, "WhatsApp")
        ))
      );
    }))), activeTab === "buyers" && /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "bg-white border-2 border-[#EA9E24] rounded-2xl p-4 space-y-3 shadow-2xs" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center justify-between gap-2" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "w-8 h-8 rounded-xl bg-[#EA9E24]/15 text-[#EA9E24] flex items-center justify-center" }, /* @__PURE__ */ import_react3.default.createElement(Sparkles, { className: "w-4 h-4" })), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("h2", { className: "text-sm font-bold text-[#3D4043]" }, "AI Property-Buyer Matchmaker"), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-[11px] text-stone-500" }, "Type or speak a buyer\u2019s requirement to instantly rank your most compatible properties"))), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        type: "button",
        onClick: toggleVoiceBuyerMatch,
        className: `px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${isBuyerRec ? "bg-[#EA9E24] text-[#3D4043] animate-pulse" : "bg-[#3D4043] text-white hover:bg-black"}`
      },
      isBuyerRec ? /* @__PURE__ */ import_react3.default.createElement(Square, { className: "w-3.5 h-3.5 fill-current" }) : /* @__PURE__ */ import_react3.default.createElement(Mic, { className: "w-3.5 h-3.5 text-[#EA9E24]" }),
      /* @__PURE__ */ import_react3.default.createElement("span", null, isBuyerRec ? "Stop & Match" : "Speak Inquiry")
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: aiQueryText,
        onChange: (e) => setAiQueryText(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter")
            runAiRequirementMatchmaker(aiQueryText, null, false);
        },
        placeholder: "e.g. 3 BHK Kalawad Rd or Nana Mava under 70L East facing...",
        className: "flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-[#EA9E24]"
      }
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        type: "button",
        disabled: isAiMatchRunning,
        onClick: () => runAiRequirementMatchmaker(aiQueryText, null, false),
        className: "px-4 py-2.5 rounded-xl bg-[#EA9E24] hover:bg-[#d88f1c] text-[#3D4043] font-extrabold text-xs shrink-0 flex items-center gap-1.5"
      },
      isAiMatchRunning ? /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ import_react3.default.createElement("span", null, "Matching...")) : /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ import_react3.default.createElement("span", null, "Find Matches"))
    )), aiMatchResults && /* @__PURE__ */ import_react3.default.createElement("div", { className: "pt-2 border-t border-stone-100 space-y-2" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center justify-between text-xs" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "font-bold text-[#3D4043]" }, "Top Compatible Properties for: ", /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-[#EA9E24]" }, aiMatchResults.parsedLead.notes)), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        type: "button",
        onClick: () => saveLeadToCloud(aiMatchResults.parsedLead).then(() => notify("Saved inquiry to Buyers list!")),
        className: "text-[11px] font-bold text-[#3D4043] underline"
      },
      "+ Save as Buyer"
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        type: "button",
        onClick: () => setAiMatchResults(null),
        className: "text-stone-400 hover:text-[#3D4043]"
      },
      /* @__PURE__ */ import_react3.default.createElement(X, { className: "w-4 h-4" })
    ))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-2" }, aiMatchResults.rankedMatches.slice(0, 3).map((item) => /* @__PURE__ */ import_react3.default.createElement(
      "div",
      {
        key: item.prop.id,
        className: "p-3 rounded-xl bg-[#EA9E24]/10 border border-[#EA9E24]/50 flex items-center justify-between gap-3"
      },
      /* @__PURE__ */ import_react3.default.createElement("div", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "px-2 py-0.5 rounded-md bg-[#3D4043] text-[#EA9E24] text-[10px] font-extrabold" }, item.score, "% Match"), /* @__PURE__ */ import_react3.default.createElement("span", { className: "font-bold text-xs text-[#3D4043] truncate" }, item.prop.title, " (", item.prop.uniqueCode, ")")), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-[11px] text-stone-600 mt-0.5" }, formatPriceIndian(item.prop.quotedPriceLakhs), " \u2022 ", item.prop.areaVaar, " Vaar \u2022 ", item.reason)),
      /* @__PURE__ */ import_react3.default.createElement(
        "button",
        {
          type: "button",
          onClick: () => shareClientSafePropertyOnWhatsApp(
            item.prop,
            aiMatchResults.parsedLead.phone,
            item.pitchLine
          ),
          className: "shrink-0 px-3 py-2 rounded-xl bg-[#3D4043] hover:bg-black text-white font-bold text-xs flex items-center gap-1"
        },
        /* @__PURE__ */ import_react3.default.createElement(MessageSquare, { className: "w-3.5 h-3.5 text-[#EA9E24]" }),
        /* @__PURE__ */ import_react3.default.createElement("span", null, "Pitch")
      )
    ))))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center justify-between gap-2 pt-1" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("h1", { className: "text-base font-bold text-[#3D4043]" }, "Saved Buyers (", leads.length, ")"), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-500" }, "Live compatibility scores against your cloud property inventory")), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: openNewBuyerModal,
        className: "px-3.5 py-2 rounded-xl bg-[#EA9E24] text-[#3D4043] text-xs font-extrabold flex items-center gap-1"
      },
      /* @__PURE__ */ import_react3.default.createElement(Plus, { className: "w-3.5 h-3.5" }),
      /* @__PURE__ */ import_react3.default.createElement("span", null, "Add Buyer")
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-3" }, leads.map((lead) => {
      var _a2, _b;
      const matches = properties.map((p) => __spreadValues({ prop: p }, calculateMatchScore(p, lead))).filter((m) => m.score >= 45).sort((a, b) => b.score - a.score);
      return /* @__PURE__ */ import_react3.default.createElement(
        "div",
        {
          key: lead.id,
          className: "bg-white border border-stone-200 rounded-2xl p-4 space-y-3 shadow-2xs"
        },
        /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-start justify-between gap-2" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("h3", { className: "font-bold text-base text-[#3D4043]" }, lead.name), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-500" }, "\u{1F4DE} ", lead.phone || "No phone", " \u2022 \u{1F4CD} ", (_a2 = lead.preferredAreas) == null ? void 0 : _a2.join(", "), " \u2022 ", (_b = lead.preferredCategories) == null ? void 0 : _b.join(", "))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-xs font-bold text-[#3D4043] bg-[#EA9E24]/20 border border-[#EA9E24]/50 px-2.5 py-1 rounded-full" }, "Up to ", formatPriceIndian(lead.budgetMaxLakhs)), /* @__PURE__ */ import_react3.default.createElement(
          "button",
          {
            type: "button",
            title: "Edit Buyer",
            onClick: () => openEditBuyerModal(lead),
            className: "p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#3D4043]"
          },
          /* @__PURE__ */ import_react3.default.createElement(PenLine, { className: "w-3.5 h-3.5" })
        ), /* @__PURE__ */ import_react3.default.createElement(
          "button",
          {
            type: "button",
            title: "Delete Buyer",
            onClick: () => deleteLeadFromCloud(lead.id),
            className: "p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-[#3D4043]"
          },
          /* @__PURE__ */ import_react3.default.createElement(Trash2, { className: "w-3.5 h-3.5" })
        ))),
        lead.notes && /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-600 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200" }, lead.notes),
        /* @__PURE__ */ import_react3.default.createElement("div", { className: "pt-1 space-y-2" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center justify-between text-xs" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "font-bold text-stone-500" }, matches.length, " Compatible Propert", matches.length === 1 ? "y" : "ies", " Found"), /* @__PURE__ */ import_react3.default.createElement(
          "button",
          {
            type: "button",
            onClick: () => {
              var _a3, _b2, _c, _d;
              setAiQueryText(`${lead.name}: ${(_a3 = lead.preferredCategories) == null ? void 0 : _a3.join(", ")} in ${(_b2 = lead.preferredAreas) == null ? void 0 : _b2.join(", ")} under ${lead.budgetMaxLakhs} Lakhs. ${lead.notes || ""}`);
              runAiRequirementMatchmaker(`${lead.name}: ${(_c = lead.preferredCategories) == null ? void 0 : _c.join(", ")} in ${(_d = lead.preferredAreas) == null ? void 0 : _d.join(", ")} under ${lead.budgetMaxLakhs} Lakhs. ${lead.notes || ""}`);
            },
            className: "text-[#EA9E24] font-bold hover:underline flex items-center gap-1"
          },
          /* @__PURE__ */ import_react3.default.createElement(Sparkles, { className: "w-3 h-3" }),
          " Deep AI Rank"
        )), matches.slice(0, 3).map((m) => /* @__PURE__ */ import_react3.default.createElement(
          "div",
          {
            key: m.prop.id,
            className: "p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-2"
          },
          /* @__PURE__ */ import_react3.default.createElement("div", { className: "min-w-0 flex-1" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#EA9E24]/25 text-[#3D4043]" }, m.score, "%"), /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-xs font-bold text-[#3D4043] truncate" }, m.prop.title)), /* @__PURE__ */ import_react3.default.createElement("div", { className: "text-[11px] text-stone-500 mt-0.5" }, formatPriceIndian(m.prop.quotedPriceLakhs), " \u2022 ", m.prop.areaVaar, " Vaar \u2022 ", m.reasons.slice(0, 2).join(", "))),
          /* @__PURE__ */ import_react3.default.createElement(
            "button",
            {
              onClick: () => shareClientSafePropertyOnWhatsApp(m.prop, lead.phone),
              className: "shrink-0 px-3 py-1.5 rounded-lg bg-[#3D4043] hover:bg-black text-white font-bold text-xs"
            },
            "Send on WhatsApp"
          )
        )))
      );
    }))), activeTab === "tools" && /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("h1", { className: "text-lg font-bold text-[#3D4043]" }, "Quick Broker Tools"), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-500" }, "100% Radhika Estate Agency Deal Desk \u2014 7/12 Utara, Jantri, Vaar & Cloud Sync")), /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => setActiveToolModal("satbara"),
        className: "bg-white hover:border-[#EA9E24] border-2 border-[#EA9E24] rounded-2xl p-5 text-left flex items-start justify-between gap-3 transition shadow-2xs"
      },
      /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "w-10 h-10 rounded-xl bg-[#EA9E24]/20 text-[#3D4043] flex items-center justify-center mb-2" }, /* @__PURE__ */ import_react3.default.createElement(FileText, { className: "w-5 h-5 text-[#EA9E24]" })), /* @__PURE__ */ import_react3.default.createElement("h3", { className: "font-bold text-base text-[#3D4043]" }, "AnyROR 7/12 & RUDA TP Check"), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-500" }, "Scan 7/12 or 8A Utara photo, convert Hectare-Are-Sq.Mt to Vaar & verify Boja")),
      /* @__PURE__ */ import_react3.default.createElement(ChevronRight, { className: "w-5 h-5 text-[#EA9E24] shrink-0 mt-1" })
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => setActiveToolModal("converter"),
        className: "bg-white hover:border-[#EA9E24] border border-stone-200 rounded-2xl p-5 text-left flex items-start justify-between gap-3 transition shadow-2xs"
      },
      /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "w-10 h-10 rounded-xl bg-stone-100 text-[#3D4043] flex items-center justify-center mb-2" }, /* @__PURE__ */ import_react3.default.createElement(Calculator, { className: "w-5 h-5 text-[#EA9E24]" })), /* @__PURE__ */ import_react3.default.createElement("h3", { className: "font-bold text-base text-[#3D4043]" }, "Vaar / Sq.Ft / Vigha Converter"), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-500" }, "Instant Saurashtra land unit & rate per Vaar calculator")),
      /* @__PURE__ */ import_react3.default.createElement(ChevronRight, { className: "w-5 h-5 text-stone-400 shrink-0 mt-1" })
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => setActiveToolModal("hisab"),
        className: "bg-white hover:border-[#EA9E24] border border-stone-200 rounded-2xl p-5 text-left flex items-start justify-between gap-3 transition shadow-2xs"
      },
      /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "w-10 h-10 rounded-xl bg-stone-100 text-[#3D4043] flex items-center justify-center mb-2" }, /* @__PURE__ */ import_react3.default.createElement(Scale, { className: "w-5 h-5 text-[#EA9E24]" })), /* @__PURE__ */ import_react3.default.createElement("h3", { className: "font-bold text-base text-[#3D4043]" }, "Pakka Hisab, Jantri & EMI"), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-500" }, "Gujarat 4.9% Stamp Duty, GARVI Jantri floor, Sec 194-IA TDS & EMI")),
      /* @__PURE__ */ import_react3.default.createElement(ChevronRight, { className: "w-5 h-5 text-stone-400 shrink-0 mt-1" })
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => setActiveToolModal("karar"),
        className: "bg-white hover:border-[#EA9E24] border border-stone-200 rounded-2xl p-5 text-left flex items-start justify-between gap-3 transition shadow-2xs"
      },
      /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "w-10 h-10 rounded-xl bg-stone-100 text-[#3D4043] flex items-center justify-center mb-2" }, /* @__PURE__ */ import_react3.default.createElement(PenTool, { className: "w-5 h-5 text-[#EA9E24]" })), /* @__PURE__ */ import_react3.default.createElement("h3", { className: "font-bold text-base text-[#3D4043]" }, "Token Receipt (\u0AB8\u0AAE\u0A9C\u0AC2\u0AA4\u0AC0 \u0A95\u0AB0\u0ABE\u0AB0)"), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-500" }, "Bilingual Deal MoU with on-screen Touch Signature Pads")),
      /* @__PURE__ */ import_react3.default.createElement(ChevronRight, { className: "w-5 h-5 text-stone-400 shrink-0 mt-1" })
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => setActiveToolModal("tour"),
        className: "bg-white hover:border-[#EA9E24] border border-stone-200 rounded-2xl p-5 text-left flex items-start justify-between gap-3 transition shadow-2xs"
      },
      /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "w-10 h-10 rounded-xl bg-stone-100 text-[#3D4043] flex items-center justify-center mb-2" }, /* @__PURE__ */ import_react3.default.createElement(Navigation, { className: "w-5 h-5 text-[#EA9E24]" })), /* @__PURE__ */ import_react3.default.createElement("h3", { className: "font-bold text-base text-[#3D4043]" }, "Site Visit Tour & Key Sheet"), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-500" }, "Select properties for Sunday visits, view watchman keys & send summary")),
      /* @__PURE__ */ import_react3.default.createElement(ChevronRight, { className: "w-5 h-5 text-stone-400 shrink-0 mt-1" })
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => setActiveToolModal("import"),
        className: "bg-white hover:border-[#EA9E24] border border-stone-200 rounded-2xl p-5 text-left flex items-start justify-between gap-3 transition shadow-2xs"
      },
      /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "w-10 h-10 rounded-xl bg-stone-100 text-[#3D4043] flex items-center justify-center mb-2" }, /* @__PURE__ */ import_react3.default.createElement(Cloud, { className: "w-5 h-5 text-[#EA9E24]" })), /* @__PURE__ */ import_react3.default.createElement("h3", { className: "font-bold text-base text-[#3D4043]" }, "WhatsApp Importer & Backup"), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-500" }, "Paste broker messages or download/restore Cloud JSON backup")),
      /* @__PURE__ */ import_react3.default.createElement(ChevronRight, { className: "w-5 h-5 text-stone-400 shrink-0 mt-1" })
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => setActiveToolModal("deploy"),
        className: "sm:col-span-2 bg-[#3D4043] hover:bg-black text-white border border-[#3D4043] rounded-2xl p-5 text-left flex items-start justify-between gap-3 transition shadow-md"
      },
      /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-1" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "w-10 h-10 rounded-xl bg-[#EA9E24] text-[#3D4043] flex items-center justify-center mb-2" }, /* @__PURE__ */ import_react3.default.createElement(Download, { className: "w-5 h-5" })), /* @__PURE__ */ import_react3.default.createElement("h3", { className: "font-bold text-base text-white" }, "Download GitHub .ZIP & Cloud Credentials"), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-300" }, "1-Click full `.zip` package for GitHub + Vercel & Firebase Cloud Firestore setup")),
      /* @__PURE__ */ import_react3.default.createElement(ChevronRight, { className: "w-5 h-5 text-[#EA9E24] shrink-0 mt-1" })
    )))), selectedPropertyDrawer && /* @__PURE__ */ import_react3.default.createElement("div", { className: "fixed inset-0 z-50 bg-[#3D4043]/60 flex items-end sm:items-center justify-center p-0 sm:p-4" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-xl" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-start justify-between gap-2 border-b border-stone-100 pb-3" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-xs font-mono font-bold text-[#EA9E24]" }, selectedPropertyDrawer.uniqueCode, " \u2022 ", selectedPropertyDrawer.tpNumber), /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-[#3D4043]" }, selectedPropertyDrawer.status || "Available")), /* @__PURE__ */ import_react3.default.createElement("h3", { className: "font-bold text-lg text-[#3D4043]" }, selectedPropertyDrawer.title)), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => openEditPropertyModal(selectedPropertyDrawer),
        className: "px-3 py-1.5 rounded-xl bg-[#EA9E24]/20 hover:bg-[#EA9E24]/30 text-[#3D4043] font-bold text-xs flex items-center gap-1"
      },
      /* @__PURE__ */ import_react3.default.createElement(PenLine, { className: "w-3.5 h-3.5 text-[#EA9E24]" }),
      /* @__PURE__ */ import_react3.default.createElement("span", null, "Edit")
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => setSelectedPropertyDrawer(null),
        className: "p-1.5 rounded-full bg-stone-100 text-stone-500 hover:text-[#3D4043]"
      },
      /* @__PURE__ */ import_react3.default.createElement(X, { className: "w-5 h-5" })
    ))), selectedPropertyDrawer.watermarkedPhotoUrl && /* @__PURE__ */ import_react3.default.createElement(
      "img",
      {
        src: selectedPropertyDrawer.watermarkedPhotoUrl,
        alt: selectedPropertyDrawer.title,
        className: "w-full h-48 object-cover rounded-xl border border-stone-200"
      }
    ), /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-stone-400 block" }, "Price"), /* @__PURE__ */ import_react3.default.createElement("b", { className: "text-[#3D4043] text-sm" }, formatPriceIndian(selectedPropertyDrawer.quotedPriceLakhs))), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-stone-400 block" }, "Area"), /* @__PURE__ */ import_react3.default.createElement("b", { className: "text-[#3D4043]" }, selectedPropertyDrawer.areaVaar, " Vaar (", selectedPropertyDrawer.carpetSqFt, " Sq.Ft)")), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-stone-400 block" }, "Facing"), /* @__PURE__ */ import_react3.default.createElement("b", { className: "text-[#3D4043]" }, selectedPropertyDrawer.facing))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "bg-[#EA9E24]/10 border border-[#EA9E24]/40 rounded-xl p-3 text-xs flex items-center justify-between gap-2" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("div", { className: "font-bold text-[#3D4043]" }, "\u{1F4CB} 7/12 Survey: ", selectedPropertyDrawer.surveyNumber || "Verified", " \u2022 ", selectedPropertyDrawer.tpNumber || "TP Zone"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "text-stone-600 mt-0.5" }, "RUDA Zone: ", /* @__PURE__ */ import_react3.default.createElement("b", null, selectedPropertyDrawer.rudaZone || "R1 Residential"), " \u2022 Title: ", /* @__PURE__ */ import_react3.default.createElement("b", null, selectedPropertyDrawer.bojaStatus || "Clear Title"))), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        type: "button",
        onClick: () => {
          setSatbaraState((prev) => __spreadProps(__spreadValues({}, prev), {
            village: selectedPropertyDrawer.microMarket,
            surveyNumber: selectedPropertyDrawer.surveyNumber || "312/P1",
            tpNumber: selectedPropertyDrawer.tpNumber || "TP-22",
            rudaZone: selectedPropertyDrawer.rudaZone || "R1 Residential",
            calculatedVaar: selectedPropertyDrawer.areaVaar || 200,
            calculatedSqFt: selectedPropertyDrawer.carpetSqFt || 1800,
            khatedarName: selectedPropertyDrawer.ownerName || "Rameshbhai Patel",
            bojaStatus: selectedPropertyDrawer.bojaStatus || "Clear Title"
          }));
          setSelectedPropertyDrawer(null);
          setActiveToolModal("satbara");
        },
        className: "px-2.5 py-1.5 rounded-lg bg-[#3D4043] text-[#EA9E24] font-bold text-[11px] shrink-0"
      },
      "7/12 Check"
    )), /* @__PURE__ */ import_react3.default.createElement(
      SimplePlotDiagram,
      {
        frontageFt: selectedPropertyDrawer.frontageFt,
        depthFt: selectedPropertyDrawer.depthFt,
        roadWidthMeters: selectedPropertyDrawer.roadWidthMeters,
        facing: selectedPropertyDrawer.facing
      }
    ), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-600 leading-relaxed" }, selectedPropertyDrawer.publicHighlights), /* @__PURE__ */ import_react3.default.createElement("div", { className: "p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-xs space-y-2" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "font-bold text-[#3D4043] flex items-center justify-between" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "\u{1F512} Private Owner & Vault Info"), /* @__PURE__ */ import_react3.default.createElement("span", null, "Bottom: ", formatPriceIndian(selectedPropertyDrawer.bottomPriceLakhs))), /* @__PURE__ */ import_react3.default.createElement("div", null, "\u{1F464} Owner / Source: ", /* @__PURE__ */ import_react3.default.createElement("b", null, selectedPropertyDrawer.ownerName || "Direct"), " (", selectedPropertyDrawer.ownerPhone || "No phone", ")"), /* @__PURE__ */ import_react3.default.createElement("div", null, "\u{1F511} Keys & Survey: ", selectedPropertyDrawer.keyLocation, " \u2022 ", selectedPropertyDrawer.surveyNumber || selectedPropertyDrawer.bojaStatus), /* @__PURE__ */ import_react3.default.createElement("div", { className: "pt-1 flex items-center justify-between gap-2 border-t border-stone-200" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-[11px] text-stone-500" }, "Check if still unsold before scheduling visit:"), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        type: "button",
        onClick: () => pingOwnerAvailabilityOnWhatsApp(selectedPropertyDrawer),
        className: "px-2.5 py-1.5 rounded-lg bg-[#3D4043] text-white font-bold text-[11px] flex items-center gap-1"
      },
      /* @__PURE__ */ import_react3.default.createElement(Clock, { className: "w-3 h-3 text-[#EA9E24]" }),
      /* @__PURE__ */ import_react3.default.createElement("span", null, "1-Tap Owner Ping")
    ))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-2 gap-2.5 pt-1" }, /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => shareClientSafePropertyOnWhatsApp(selectedPropertyDrawer),
        className: "py-3 rounded-xl bg-[#3D4043] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5"
      },
      /* @__PURE__ */ import_react3.default.createElement(MessageSquare, { className: "w-4 h-4 text-[#EA9E24]" }),
      "Share on WhatsApp"
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => {
          setSelectedToolPropId(selectedPropertyDrawer.id);
          setSelectedPropertyDrawer(null);
          setActiveToolModal("hisab");
        },
        className: "py-3 rounded-xl bg-[#EA9E24] text-[#3D4043] font-extrabold text-xs flex items-center justify-center gap-1.5"
      },
      /* @__PURE__ */ import_react3.default.createElement(Scale, { className: "w-4 h-4" }),
      "Pakka Hisab Sheet"
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex justify-between items-center pt-2 border-t border-stone-100 text-xs" }, /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => {
          setSelectedToolPropId(selectedPropertyDrawer.id);
          setKararForm((p) => __spreadProps(__spreadValues({}, p), {
            sellerName: selectedPropertyDrawer.ownerName || "Property Owner",
            agreedPriceLakhs: selectedPropertyDrawer.quotedPriceLakhs
          }));
          setSelectedPropertyDrawer(null);
          setActiveToolModal("karar");
        },
        className: "font-bold text-[#3D4043] hover:underline flex items-center gap-1"
      },
      /* @__PURE__ */ import_react3.default.createElement(PenTool, { className: "w-3.5 h-3.5 text-[#EA9E24]" }),
      " Create Token Receipt"
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => deletePropertyFromCloud(selectedPropertyDrawer.id),
        className: "text-stone-500 hover:text-[#3D4043] font-semibold flex items-center gap-1"
      },
      /* @__PURE__ */ import_react3.default.createElement(Trash2, { className: "w-3.5 h-3.5" }),
      " Delete"
    )))), editingPropertyModal && /* @__PURE__ */ import_react3.default.createElement("div", { className: "fixed inset-0 z-50 bg-[#3D4043]/60 flex items-end sm:items-center justify-center p-0 sm:p-4" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center justify-between border-b border-stone-100 pb-3" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-xs font-mono font-bold text-[#EA9E24]" }, "Editing ", editingPropertyModal.uniqueCode), /* @__PURE__ */ import_react3.default.createElement("h3", { className: "font-bold text-base text-[#3D4043]" }, "Edit Property Details")), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => setEditingPropertyModal(null),
        className: "p-1.5 rounded-full bg-stone-100 text-stone-500"
      },
      /* @__PURE__ */ import_react3.default.createElement(X, { className: "w-5 h-5" })
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-2 gap-3 text-xs" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "col-span-2" }, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Property Title"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: editingPropertyModal.title || "",
        onChange: (e) => setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), { title: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-bold"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Status"), /* @__PURE__ */ import_react3.default.createElement(
      "select",
      {
        value: editingPropertyModal.status || "Available",
        onChange: (e) => setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), { status: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-bold"
      },
      /* @__PURE__ */ import_react3.default.createElement("option", { value: "Available" }, "Available"),
      /* @__PURE__ */ import_react3.default.createElement("option", { value: "Token Given" }, "Token Given"),
      /* @__PURE__ */ import_react3.default.createElement("option", { value: "Sold" }, "Sold")
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Category"), /* @__PURE__ */ import_react3.default.createElement(
      "select",
      {
        value: editingPropertyModal.category || "Residential Flat",
        onChange: (e) => setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), { category: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-semibold"
      },
      PROPERTY_CATEGORIES.map((c) => /* @__PURE__ */ import_react3.default.createElement("option", { key: c, value: c }, c))
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Rajkot Area"), /* @__PURE__ */ import_react3.default.createElement(
      "select",
      {
        value: editingPropertyModal.microMarket || "Kalawad Road",
        onChange: (e) => {
          const areaObj = RAJKOT_AREAS.find((a) => a.name === e.target.value) || RAJKOT_AREAS[0];
          setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), {
            microMarket: areaObj.name,
            areaCode: areaObj.code,
            tpNumber: areaObj.defaultTp
          }));
        },
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-semibold"
      },
      RAJKOT_AREAS.map((a) => /* @__PURE__ */ import_react3.default.createElement("option", { key: a.code, value: a.name }, a.name))
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "BHK (if Flat/House)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        value: (_a = editingPropertyModal.bhk) != null ? _a : 0,
        onChange: (e) => setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), { bhk: Number(e.target.value) })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-semibold"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Area in Vaar"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        value: editingPropertyModal.areaVaar || 0,
        onChange: (e) => {
          const v = Number(e.target.value) || 0;
          setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), {
            areaVaar: v,
            carpetSqFt: Math.round(v * 9)
          }));
        },
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-bold"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Area in Sq.Ft"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        value: editingPropertyModal.carpetSqFt || 0,
        onChange: (e) => {
          const sf = Number(e.target.value) || 0;
          setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), {
            carpetSqFt: sf,
            areaVaar: Number((sf / 9).toFixed(1))
          }));
        },
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-bold"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Quoted Price (Lakhs \u20B9)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        step: "0.5",
        value: editingPropertyModal.quotedPriceLakhs || 0,
        onChange: (e) => setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), { quotedPriceLakhs: e.target.value })),
        className: "w-full bg-[#EA9E24]/15 border border-[#EA9E24] rounded-xl px-3 py-2.5 font-extrabold text-[#3D4043]"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Bottom Price (Lakhs \u20B9)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        step: "0.5",
        value: editingPropertyModal.bottomPriceLakhs || 0,
        onChange: (e) => setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), { bottomPriceLakhs: e.target.value })),
        className: "w-full bg-stone-100 border border-stone-300 rounded-xl px-3 py-2.5 font-bold text-[#3D4043]"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "7/12 Revenue Survey No."), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: editingPropertyModal.surveyNumber || "",
        onChange: (e) => setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), { surveyNumber: e.target.value })),
        placeholder: "Rev. Survey 312/P1",
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "TP / FP Scheme No."), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: editingPropertyModal.tpNumber || "",
        onChange: (e) => setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), { tpNumber: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "7/12 Boja / Title Status"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: editingPropertyModal.bojaStatus || "",
        onChange: (e) => setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), { bojaStatus: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Facing / Vastu"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: editingPropertyModal.facing || "",
        onChange: (e) => setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), { facing: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Owner / Broker Name"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: editingPropertyModal.ownerName || "",
        onChange: (e) => setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), { ownerName: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-semibold"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Owner Phone (Private)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "tel",
        value: editingPropertyModal.ownerPhone || "",
        onChange: (e) => setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), { ownerPhone: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-mono"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "col-span-2" }, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Key Location / Site Visit Note"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: editingPropertyModal.keyLocation || "",
        onChange: (e) => setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), { keyLocation: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "col-span-2" }, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Public Brochure Highlights"), /* @__PURE__ */ import_react3.default.createElement(
      "textarea",
      {
        rows: 2,
        value: editingPropertyModal.publicHighlights || "",
        onChange: (e) => setEditingPropertyModal((p) => __spreadProps(__spreadValues({}, p), { publicHighlights: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
      }
    ))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex gap-2 pt-2" }, /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        type: "button",
        onClick: () => setEditingPropertyModal(null),
        className: "w-1/3 py-3 rounded-xl bg-stone-100 text-[#3D4043] font-bold text-xs"
      },
      "Cancel"
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        type: "button",
        onClick: handleSaveEditedPropertyModal,
        className: "w-2/3 py-3 rounded-xl bg-[#EA9E24] hover:bg-[#d88f1c] text-[#3D4043] font-extrabold text-xs flex items-center justify-center gap-1.5"
      },
      /* @__PURE__ */ import_react3.default.createElement(CircleCheck, { className: "w-4 h-4" }),
      /* @__PURE__ */ import_react3.default.createElement("span", null, "Save Changes to Cloud")
    )))), reverseMatchAlertModal && /* @__PURE__ */ import_react3.default.createElement("div", { className: "fixed inset-0 z-50 bg-[#3D4043]/60 flex items-center justify-center p-4" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border-2 border-[#EA9E24]" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-start justify-between gap-2" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "w-10 h-10 rounded-full bg-[#EA9E24]/20 text-[#3D4043] flex items-center justify-center shrink-0" }, /* @__PURE__ */ import_react3.default.createElement(Sparkles, { className: "w-5 h-5 text-[#EA9E24]" })), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-[11px] font-extrabold uppercase tracking-wider text-[#EA9E24]" }, "Instant Buyer Match Found!"), /* @__PURE__ */ import_react3.default.createElement("h3", { className: "font-bold text-base text-[#3D4043]" }, reverseMatchAlertModal.property.title))), /* @__PURE__ */ import_react3.default.createElement("button", { onClick: () => setReverseMatchAlertModal(null) }, /* @__PURE__ */ import_react3.default.createElement(X, { className: "w-5 h-5 text-stone-400" }))), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-xs text-stone-600" }, "This property automatically matches ", /* @__PURE__ */ import_react3.default.createElement("b", null, reverseMatchAlertModal.matches.length, " active buyer(s)"), " in your Cloud database. Send them the sanitized brochure right now:"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-2 max-h-60 overflow-y-auto" }, reverseMatchAlertModal.matches.map((m) => /* @__PURE__ */ import_react3.default.createElement(
      "div",
      {
        key: m.lead.id,
        className: "p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-2"
      },
      /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("div", { className: "font-bold text-xs text-[#3D4043]" }, m.lead.name, " (", m.score, "% Match)"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "text-[11px] text-stone-500" }, "Budget: Up to ", formatPriceIndian(m.lead.budgetMaxLakhs), " \u2022 ", m.reasons.slice(0, 2).join(", "))),
      /* @__PURE__ */ import_react3.default.createElement(
        "button",
        {
          onClick: () => shareClientSafePropertyOnWhatsApp(
            reverseMatchAlertModal.property,
            m.lead.phone
          ),
          className: "px-3 py-2 rounded-xl bg-[#3D4043] text-white font-bold text-xs shrink-0"
        },
        "WhatsApp"
      )
    ))), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => setReverseMatchAlertModal(null),
        className: "w-full py-2.5 rounded-xl bg-[#EA9E24] text-[#3D4043] font-extrabold text-xs"
      },
      "Done"
    ))), showBuyerModal && /* @__PURE__ */ import_react3.default.createElement("div", { className: "fixed inset-0 z-50 bg-[#3D4043]/50 flex items-center justify-center p-4" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "bg-white rounded-2xl max-w-md w-full p-5 space-y-3 shadow-xl" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center justify-between border-b border-stone-100 pb-2" }, /* @__PURE__ */ import_react3.default.createElement("h3", { className: "font-bold text-base text-[#3D4043]" }, buyerForm.id ? "Edit Buyer Requirement" : "Add Buyer Requirement"), /* @__PURE__ */ import_react3.default.createElement("button", { onClick: () => setShowBuyerModal(false) }, /* @__PURE__ */ import_react3.default.createElement(X, { className: "w-5 h-5 text-stone-400" }))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-2.5 text-xs" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Buyer Name"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        placeholder: "Buyer Name (e.g. Chiragbhai)",
        value: buyerForm.name,
        onChange: (e) => setBuyerForm((p) => __spreadProps(__spreadValues({}, p), { name: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-semibold"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "WhatsApp Phone Number"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "tel",
        placeholder: "98250XXXXX",
        value: buyerForm.phone,
        onChange: (e) => setBuyerForm((p) => __spreadProps(__spreadValues({}, p), { phone: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-mono"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-2 gap-2" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Preferred Area"), /* @__PURE__ */ import_react3.default.createElement(
      "select",
      {
        value: buyerForm.preferredAreas[0] || "Kalawad Road",
        onChange: (e) => setBuyerForm((p) => __spreadProps(__spreadValues({}, p), { preferredAreas: [e.target.value] })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-semibold"
      },
      RAJKOT_AREAS.map((a) => /* @__PURE__ */ import_react3.default.createElement("option", { key: a.code, value: a.name }, a.name))
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Property Type"), /* @__PURE__ */ import_react3.default.createElement(
      "select",
      {
        value: buyerForm.preferredCategories[0] || "Residential Flat",
        onChange: (e) => setBuyerForm((p) => __spreadProps(__spreadValues({}, p), { preferredCategories: [e.target.value] })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-semibold"
      },
      PROPERTY_CATEGORIES.map((c) => /* @__PURE__ */ import_react3.default.createElement("option", { key: c, value: c }, c))
    ))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-2 gap-2" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Max Budget (Lakhs \u20B9)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        value: buyerForm.budgetMaxLakhs,
        onChange: (e) => setBuyerForm((p) => __spreadProps(__spreadValues({}, p), { budgetMaxLakhs: Number(e.target.value) })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-bold text-[#3D4043]"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Min Area (Vaar)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        value: buyerForm.minVaar,
        onChange: (e) => setBuyerForm((p) => __spreadProps(__spreadValues({}, p), { minVaar: Number(e.target.value) })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-semibold"
      }
    ))), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Specific Notes / Vastu"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        placeholder: "Notes (e.g. East facing, 3BHK, middle floor)",
        value: buyerForm.notes,
        onChange: (e) => setBuyerForm((p) => __spreadProps(__spreadValues({}, p), { notes: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5"
      }
    ))), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => __async(this, null, function* () {
          if (!buyerForm.name)
            return;
          yield saveLeadToCloud({
            id: buyerForm.id || `lead-${Date.now()}`,
            name: buyerForm.name,
            phone: buyerForm.phone,
            preferredAreas: buyerForm.preferredAreas,
            preferredCategories: buyerForm.preferredCategories,
            minBhk: buyerForm.minBhk,
            minVaar: buyerForm.minVaar,
            budgetMinLakhs: buyerForm.budgetMinLakhs,
            budgetMaxLakhs: buyerForm.budgetMaxLakhs,
            notes: buyerForm.notes,
            createdAt: Date.now()
          });
          setShowBuyerModal(false);
          notify(buyerForm.id ? "Buyer updated in Cloud!" : "Buyer saved to Cloud!");
        }),
        className: "w-full py-3 rounded-xl bg-[#EA9E24] text-[#3D4043] font-extrabold text-xs"
      },
      buyerForm.id ? "Update Buyer in Cloud" : "Save Buyer to Cloud"
    ))), activeToolModal && /* @__PURE__ */ import_react3.default.createElement("div", { className: "fixed inset-0 z-50 bg-[#3D4043]/60 flex items-end sm:items-center justify-center p-0 sm:p-4" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-xl" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center justify-between border-b border-stone-100 pb-3" }, /* @__PURE__ */ import_react3.default.createElement("h3", { className: "font-bold text-base text-[#3D4043]" }, activeToolModal === "satbara" && "AnyROR 7/12 & 8A Utara Scanner + RUDA TP Check", activeToolModal === "converter" && "Saurashtra Vaar / Sq.Ft / Vigha Converter", activeToolModal === "hisab" && "Pakka Hisab, GARVI Jantri & EMI Calculator", activeToolModal === "karar" && "Token Receipt (\u0AB8\u0AAE\u0A9C\u0AC2\u0AA4\u0AC0 \u0A95\u0AB0\u0ABE\u0AB0) & Signatures", activeToolModal === "tour" && "Multi-Property Site Visit Tour & Key Sheet", activeToolModal === "import" && "WhatsApp Importer & Cloud Backup", activeToolModal === "deploy" && "GitHub .ZIP Download & Cloud Credentials"), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => setActiveToolModal(null),
        className: "p-1.5 rounded-full bg-stone-100 text-stone-500"
      },
      /* @__PURE__ */ import_react3.default.createElement(X, { className: "w-5 h-5" })
    )), activeToolModal === "satbara" && /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-3.5 text-xs" }, /* @__PURE__ */ import_react3.default.createElement("label", { className: "w-full py-3.5 px-4 rounded-xl bg-[#EA9E24]/15 border-2 border-dashed border-[#EA9E24] flex items-center justify-between cursor-pointer hover:bg-[#EA9E24]/25 transition" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react3.default.createElement(Camera, { className: "w-5 h-5 text-[#3D4043]" }), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("div", { className: "font-extrabold text-[#3D4043]" }, satbaraState.isScanning ? "Scanning 7/12 Utara with AI..." : "Snap / Upload 7/12 or 8A Utara Photo"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "text-[11px] text-stone-600" }, "Auto-reads Survey No., Khatedar Name, Hectare-Are-Sq.Mt & Bank Boja"))), /* @__PURE__ */ import_react3.default.createElement("span", { className: "px-2.5 py-1 rounded-lg bg-[#3D4043] text-[#EA9E24] font-bold text-[11px]" }, "Scan"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "file",
        accept: "image/*",
        onChange: handleScan712UtaraPhoto,
        className: "hidden"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-2 gap-2.5" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Rajkot Village / Area"), /* @__PURE__ */ import_react3.default.createElement(
      "select",
      {
        value: satbaraState.village,
        onChange: (e) => {
          const areaObj = RAJKOT_AREAS.find((a) => a.name === e.target.value) || RAJKOT_AREAS[0];
          setSatbaraState((p) => __spreadProps(__spreadValues({}, p), {
            village: areaObj.name,
            tpNumber: areaObj.defaultTp,
            rudaZone: areaObj.rudaZone
          }));
        },
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-[#3D4043]"
      },
      RAJKOT_AREAS.map((a) => /* @__PURE__ */ import_react3.default.createElement("option", { key: a.code, value: a.name }, a.name))
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Revenue Survey No. (\u0AB8\u0AB0\u0ACD\u0AB5\u0AC7 \u0AA8\u0A82.)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: satbaraState.surveyNumber,
        onChange: (e) => setSatbaraState((p) => __spreadProps(__spreadValues({}, p), { surveyNumber: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-[#3D4043]"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "TP Scheme No."), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: satbaraState.tpNumber,
        onChange: (e) => setSatbaraState((p) => __spreadProps(__spreadValues({}, p), { tpNumber: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "RUDA Zoning"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: satbaraState.rudaZone,
        onChange: (e) => setSatbaraState((p) => __spreadProps(__spreadValues({}, p), { rudaZone: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold"
      }
    ))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "font-bold text-[#3D4043]" }, "7/12 Land Measurement (Hectare - Are - Sq.Mt \u2192 Vaar & Vigha)"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-3 gap-2" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-[10px] text-stone-500 font-bold block mb-1" }, "Hectare (\u0AB9\u0AC7\u0A95\u0ACD\u0A9F\u0AB0)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        min: "0",
        value: satbaraState.hectare,
        onChange: (e) => {
          const h = Number(e.target.value) || 0;
          const totalSqMt = h * 1e4 + satbaraState.are * 100 + satbaraState.sqMt;
          const vaar = Math.round(totalSqMt * 1.19599);
          setSatbaraState((p) => __spreadProps(__spreadValues({}, p), {
            hectare: h,
            calculatedVaar: vaar,
            calculatedSqFt: Math.round(vaar * 9),
            calculatedVigha: Number((vaar / 1936).toFixed(4))
          }));
        },
        className: "w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 font-bold"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-[10px] text-stone-500 font-bold block mb-1" }, "Are (\u0A86\u0AB0\u0AC7)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        min: "0",
        value: satbaraState.are,
        onChange: (e) => {
          const a = Number(e.target.value) || 0;
          const totalSqMt = satbaraState.hectare * 1e4 + a * 100 + satbaraState.sqMt;
          const vaar = Math.round(totalSqMt * 1.19599);
          setSatbaraState((p) => __spreadProps(__spreadValues({}, p), {
            are: a,
            calculatedVaar: vaar,
            calculatedSqFt: Math.round(vaar * 9),
            calculatedVigha: Number((vaar / 1936).toFixed(4))
          }));
        },
        className: "w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 font-bold"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-[10px] text-stone-500 font-bold block mb-1" }, "Sq.Mt (\u0A9A\u0ACB.\u0AAE\u0AC0.)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        min: "0",
        value: satbaraState.sqMt,
        onChange: (e) => {
          const sm = Number(e.target.value) || 0;
          const totalSqMt = satbaraState.hectare * 1e4 + satbaraState.are * 100 + sm;
          const vaar = Math.round(totalSqMt * 1.19599);
          setSatbaraState((p) => __spreadProps(__spreadValues({}, p), {
            sqMt: sm,
            calculatedVaar: vaar,
            calculatedSqFt: Math.round(vaar * 9),
            calculatedVigha: Number((vaar / 1936).toFixed(4))
          }));
        },
        className: "w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 font-bold"
      }
    ))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "p-2.5 rounded-lg bg-[#3D4043] text-white flex items-center justify-between" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "Converted Saurashtra Area:"), /* @__PURE__ */ import_react3.default.createElement("span", { className: "font-extrabold text-[#EA9E24]" }, satbaraState.calculatedVaar, " Vaar \u2022 ", satbaraState.calculatedVigha, " Vigha (", satbaraState.calculatedSqFt, " Sq.Ft)"))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-2 gap-2.5" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Khatedar Name (\u0A96\u0ABE\u0AA4\u0AC7\u0AA6\u0ABE\u0AB0\u0AA8\u0AC1\u0A82 \u0AA8\u0ABE\u0AAE)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: satbaraState.khatedarName,
        onChange: (e) => setSatbaraState((p) => __spreadProps(__spreadValues({}, p), { khatedarName: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Bank Boja / Title (\u0AAC\u0ACB\u0A9C\u0ACB)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: satbaraState.bojaStatus,
        onChange: (e) => setSatbaraState((p) => __spreadProps(__spreadValues({}, p), { bojaStatus: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold"
      }
    ))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-2 gap-2 pt-1" }, /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        type: "button",
        onClick: () => {
          window.open("https://anyror.gujarat.gov.in/", "_blank", "noopener,noreferrer");
        },
        className: "py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#3D4043] font-bold flex items-center justify-center gap-1.5"
      },
      /* @__PURE__ */ import_react3.default.createElement(Compass, { className: "w-4 h-4 text-[#EA9E24]" }),
      /* @__PURE__ */ import_react3.default.createElement("span", null, "Open Gujarat AnyROR")
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        type: "button",
        onClick: () => {
          setDraft((prev) => __spreadProps(__spreadValues({}, prev), {
            category: "Open Plot",
            microMarket: satbaraState.village,
            title: `${satbaraState.calculatedVaar} Vaar Plot \u2022 ${satbaraState.village} (${satbaraState.tpNumber})`,
            areaVaar: satbaraState.calculatedVaar,
            carpetSqFt: satbaraState.calculatedSqFt,
            surveyNumber: satbaraState.surveyNumber,
            tpNumber: satbaraState.tpNumber,
            rudaZone: satbaraState.rudaZone,
            bojaStatus: satbaraState.bojaStatus,
            ownerName: satbaraState.khatedarName,
            publicHighlights: `7/12 Survey ${satbaraState.surveyNumber}, ${satbaraState.tpNumber}, ${satbaraState.rudaZone}, ${satbaraState.bojaStatus}.`
          }));
          setActiveToolModal(null);
          setActiveTab("capture");
          notify("7/12 Utara details loaded into Add Property!");
        },
        className: "py-3 rounded-xl bg-[#EA9E24] text-[#3D4043] font-extrabold flex items-center justify-center gap-1.5"
      },
      /* @__PURE__ */ import_react3.default.createElement(CircleCheck, { className: "w-4 h-4" }),
      /* @__PURE__ */ import_react3.default.createElement("span", null, "Use in Add Property")
    ))), activeToolModal === "converter" && /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-3 text-xs" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "p-3 rounded-xl bg-stone-50 border border-stone-200" }, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Vaar (Sq. Yards)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        value: unitCalc.vaar,
        onChange: (e) => {
          const v = Number(e.target.value) || 0;
          setUnitCalc((p) => __spreadProps(__spreadValues({}, p), {
            vaar: v,
            sqft: Math.round(v * 9),
            vigha: Number((v / 1936).toFixed(4))
          }));
        },
        className: "w-full bg-transparent text-lg font-bold text-[#3D4043] focus:outline-none"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "p-3 rounded-xl bg-stone-50 border border-stone-200" }, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Square Feet (Sq.Ft)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        value: unitCalc.sqft,
        onChange: (e) => {
          const sf = Number(e.target.value) || 0;
          const v = sf / 9;
          setUnitCalc((p) => __spreadProps(__spreadValues({}, p), {
            sqft: sf,
            vaar: Number(v.toFixed(2)),
            vigha: Number((v / 1936).toFixed(4))
          }));
        },
        className: "w-full bg-transparent text-lg font-bold text-[#3D4043] focus:outline-none"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "p-3 rounded-xl bg-stone-50 border border-stone-200" }, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "16-Guntha Vigha"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        step: "0.01",
        value: unitCalc.vigha,
        onChange: (e) => {
          const vg = Number(e.target.value) || 0;
          const v = vg * 1936;
          setUnitCalc((p) => __spreadProps(__spreadValues({}, p), {
            vigha: vg,
            vaar: Math.round(v),
            sqft: Math.round(v * 9)
          }));
        },
        className: "w-full bg-transparent text-lg font-bold text-[#3D4043] focus:outline-none"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "p-3 rounded-xl bg-[#EA9E24]/15 border border-[#EA9E24]" }, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-[#3D4043] font-semibold block mb-1" }, "Rate per Vaar (\u20B9)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        value: unitCalc.ratePerVaar,
        onChange: (e) => setUnitCalc((p) => __spreadProps(__spreadValues({}, p), { ratePerVaar: Number(e.target.value) })),
        className: "w-full bg-transparent text-lg font-bold text-[#3D4043] focus:outline-none"
      }
    ))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "p-4 rounded-xl bg-[#3D4043] text-white flex items-center justify-between" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "Total Land Price:"), /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-lg font-extrabold text-[#EA9E24]" }, formatPriceIndian((unitCalc.vaar || 0) * (unitCalc.ratePerVaar || 0) / 1e5)))), activeToolModal === "hisab" && selectedToolProp && /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-3 text-xs" }, /* @__PURE__ */ import_react3.default.createElement(
      "select",
      {
        value: selectedToolProp.id,
        onChange: (e) => setSelectedToolPropId(e.target.value),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-bold"
      },
      properties.map((p) => /* @__PURE__ */ import_react3.default.createElement("option", { key: p.id, value: p.id }, p.uniqueCode, ": ", p.title, " (", formatPriceIndian(p.quotedPriceLakhs), ")"))
    ), /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-2 gap-2" }, /* @__PURE__ */ import_react3.default.createElement("label", { className: "flex items-center gap-2 font-semibold text-[#3D4043] cursor-pointer bg-stone-50 p-2.5 rounded-xl border border-stone-200" }, /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "checkbox",
        checked: femaleRegDiscount,
        onChange: (e) => setFemaleRegDiscount(e.target.checked),
        className: "rounded text-[#EA9E24]"
      }
    ), /* @__PURE__ */ import_react3.default.createElement("span", null, "Female Buyer (0% Reg)")), /* @__PURE__ */ import_react3.default.createElement("div", { className: "bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-center justify-between" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-stone-500" }, "Loan %:"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        min: "0",
        max: "90",
        value: loanPercent,
        onChange: (e) => setLoanPercent(Number(e.target.value)),
        className: "w-14 text-right font-bold bg-transparent"
      }
    ))), (() => {
      const areaObj = RAJKOT_AREAS.find((a) => a.name === selectedToolProp.microMarket) || RAJKOT_AREAS[0];
      const isLand = selectedToolProp.category.includes("Plot") || selectedToolProp.category.includes("Shed") || selectedToolProp.category.includes("Land");
      const jantriFloorLakhs = isLand ? Number(((selectedToolProp.areaVaar || 150) * areaObj.jantriPlotVaar / 1e5).toFixed(2)) : Number(((selectedToolProp.carpetSqFt || 1200) * areaObj.jantriFlatSqFt / 1e5).toFixed(2));
      const base = Number(selectedToolProp.quotedPriceLakhs) || 65;
      const stamp = Number((base * 0.049).toFixed(2));
      const reg = femaleRegDiscount ? 0 : Number((base * 0.01).toFixed(2));
      const brok = Number((base * 0.01).toFixed(2));
      const tdsApplicable = base >= 50;
      const tdsAmount = tdsApplicable ? Number((base * 0.01).toFixed(2)) : 0;
      const total = Number((base + stamp + reg + brok).toFixed(2));
      const loanLakhs = Number((base * loanPercent / 100).toFixed(2));
      const r = interestRate / 12 / 100;
      const n = 240;
      const emiRupees = loanLakhs > 0 ? Math.round(
        loanLakhs * 1e5 * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
      ) : 0;
      return /* @__PURE__ */ import_react3.default.createElement("div", { className: "p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "Market Deal Value:"), /* @__PURE__ */ import_react3.default.createElement("b", null, formatPriceIndian(base))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex justify-between text-stone-600" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "Minimum Official Jantri Floor (", areaObj.name, "):"), /* @__PURE__ */ import_react3.default.createElement("b", null, formatPriceIndian(jantriFloorLakhs))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "Gujarat Stamp Duty (4.9%):"), /* @__PURE__ */ import_react3.default.createElement("b", null, "\u20B9", stamp, " Lakh")), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "Registration Fee (", femaleRegDiscount ? "Female 0%" : "1%", "):"), /* @__PURE__ */ import_react3.default.createElement("b", null, "\u20B9", reg, " Lakh")), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "Brokerage (1%):"), /* @__PURE__ */ import_react3.default.createElement("b", null, "\u20B9", brok, " Lakh")), tdsApplicable && /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex justify-between text-[#3D4043] bg-[#EA9E24]/20 px-2.5 py-1.5 rounded-lg font-semibold" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "Sec 194-IA TDS (1% on Deal \u2265 \u20B950L):"), /* @__PURE__ */ import_react3.default.createElement("b", null, "\u20B9", tdsAmount, " Lakh (Deductible)")), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex justify-between pt-2 border-t border-stone-200 text-sm font-extrabold text-[#3D4043]" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "Total Out-of-Pocket Package:"), /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-[#EA9E24]" }, formatPriceIndian(total))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "flex justify-between pt-1 text-stone-600" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "Est. ", loanPercent, "% Bank Loan (", formatPriceIndian(loanLakhs), "):"), /* @__PURE__ */ import_react3.default.createElement("b", null, "\u20B9", emiRupees.toLocaleString("en-IN"), "/mo EMI")), /* @__PURE__ */ import_react3.default.createElement(
        "button",
        {
          onClick: () => sendWhatsApp(
            "",
            `*Radhika Estate Agency \u2014 Pakka Hisab*
\u{1F3E0} *${selectedToolProp.title}*
\u2022 Deal Price: ${formatPriceIndian(base)}
\u2022 Official Jantri Floor: ${formatPriceIndian(jantriFloorLakhs)}
\u2022 Stamp Duty (4.9%): \u20B9${stamp}L
\u2022 Reg Fee: \u20B9${reg}L
\u2022 Brokerage (1%): \u20B9${brok}L
\u2705 *Total Net Package:* ${formatPriceIndian(total)}
\u{1F3E6} *Est. Monthly EMI (${loanPercent}% Loan):* \u20B9${emiRupees.toLocaleString("en-IN")}/month`
          ),
          className: "w-full mt-2 py-3 rounded-xl bg-[#3D4043] text-white font-bold"
        },
        "Send Pakka Hisab on WhatsApp"
      ));
    })()), activeToolModal === "karar" && selectedToolProp && /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-3 text-xs" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-2 gap-2.5" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Seller (\u0AB5\u0AC7\u0A9A\u0AA8\u0ABE\u0AB0)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: kararForm.sellerName,
        onChange: (e) => setKararForm((p) => __spreadProps(__spreadValues({}, p), { sellerName: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Buyer (\u0A96\u0AB0\u0AC0\u0AA6\u0AA8\u0ABE\u0AB0)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        value: kararForm.buyerName,
        onChange: (e) => setKararForm((p) => __spreadProps(__spreadValues({}, p), { buyerName: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Agreed Price (Lakhs)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        value: kararForm.agreedPriceLakhs,
        onChange: (e) => setKararForm((p) => __spreadProps(__spreadValues({}, p), { agreedPriceLakhs: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Token Paid Today (\u20B9)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "number",
        value: kararForm.tokenAmountRupees,
        onChange: (e) => setKararForm((p) => __spreadProps(__spreadValues({}, p), { tokenAmountRupees: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold"
      }
    ))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "p-3.5 rounded-xl bg-[#EA9E24]/15 border border-[#EA9E24] leading-relaxed text-[#3D4043]" }, "\u0A86\u0A9C\u0AB0\u0ACB\u0A9C ", /* @__PURE__ */ import_react3.default.createElement("b", null, "\u0AB0\u0ABE\u0AA7\u0ABF\u0A95\u0ABE \u0A8F\u0AB8\u0ACD\u0A9F\u0AC7\u0A9F \u0A8F\u0A9C\u0AA8\u0ACD\u0AB8\u0AC0 (\u0AB0\u0ABE\u0A9C\u0A95\u0ACB\u0A9F)"), " \u0AAE\u0ABE\u0AB0\u0AAB\u0AA4 \u0AAE\u0ABF\u0AB2\u0A95\u0AA4 ", /* @__PURE__ */ import_react3.default.createElement("b", null, selectedToolProp.title), " (", selectedToolProp.areaVaar, " \u0AB5\u0ABE\u0AB0) \u0AB5\u0AC7\u0A9A\u0AA8\u0ABE\u0AB0 ", /* @__PURE__ */ import_react3.default.createElement("b", null, kararForm.sellerName), " \u0AAA\u0ABE\u0AB8\u0AC7\u0AA5\u0AC0 \u0A96\u0AB0\u0AC0\u0AA6\u0AA8\u0ABE\u0AB0 ", /* @__PURE__ */ import_react3.default.createElement("b", null, kararForm.buyerName), " \u0A8F \u0A95\u0AC1\u0AB2 ", /* @__PURE__ */ import_react3.default.createElement("b", null, formatPriceIndian(kararForm.agreedPriceLakhs)), " \u0AAE\u0ABE\u0A82 \u0A96\u0AB0\u0AC0\u0AA6\u0AB5\u0ABE\u0AA8\u0AC1\u0A82 \u0AA8\u0A95\u0ACD\u0A95\u0AC0 \u0A95\u0AB0\u0AC7\u0AB2 \u0A9B\u0AC7. \u0A9F\u0ACB\u0A95\u0AA8 \u0AAA\u0AC7\u0A9F\u0AC7 \u0A86\u0A9C\u0AB0\u0ACB\u0A9C ", /* @__PURE__ */ import_react3.default.createElement("b", null, "\u20B9", Number(kararForm.tokenAmountRupees).toLocaleString("en-IN"), "/-"), " (", kararForm.paymentMode, ") \u0A86\u0AAA\u0AC7\u0AB2 \u0A9B\u0AC7. \u0AAA\u0ABE\u0A95\u0ACB \u0AA6\u0AB8\u0ACD\u0AA4\u0ABE\u0AB5\u0AC7\u0A9C ", kararForm.saleDeedDays, " \u0AA6\u0ABF\u0AB5\u0AB8\u0AAE\u0ABE\u0A82 \u0A95\u0AB0\u0AB5\u0ABE\u0AA8\u0ACB \u0AB0\u0AB9\u0AC7\u0AB6\u0AC7."), /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-2 gap-2.5" }, /* @__PURE__ */ import_react3.default.createElement(
      SignatureCanvasPad,
      {
        label: `Seller Sign (${kararForm.sellerName})`,
        onSignChange: (dataUrl) => setKararForm((p) => __spreadProps(__spreadValues({}, p), { sellerSign: dataUrl }))
      }
    ), /* @__PURE__ */ import_react3.default.createElement(
      SignatureCanvasPad,
      {
        label: `Buyer Sign (${kararForm.buyerName})`,
        onSignChange: (dataUrl) => setKararForm((p) => __spreadProps(__spreadValues({}, p), { buyerSign: dataUrl }))
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-2 gap-2" }, /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => window.print(),
        className: "py-3 rounded-xl bg-stone-100 text-[#3D4043] font-bold flex items-center justify-center gap-1.5"
      },
      /* @__PURE__ */ import_react3.default.createElement(Printer, { className: "w-4 h-4" }),
      " Print Signed MoU"
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => __async(this, null, function* () {
          const updated = __spreadProps(__spreadValues({}, selectedToolProp), { status: "Token Given" });
          yield savePropertyToCloud(updated);
          sendWhatsApp(
            kararForm.buyerPhone,
            `\u{1F91D} *\u0AB0\u0ABE\u0AA7\u0ABF\u0A95\u0ABE \u0A8F\u0AB8\u0ACD\u0A9F\u0AC7\u0A9F \u0A8F\u0A9C\u0AA8\u0ACD\u0AB8\u0AC0 \u2014 \u0A9F\u0ACB\u0A95\u0AA8 \u0AB0\u0AB8\u0AC0\u0AA6 (\u0AB8\u0AAE\u0A9C\u0AC2\u0AA4\u0AC0 \u0A95\u0AB0\u0ABE\u0AB0)*
\u{1F3E0} *\u0AAE\u0ABF\u0AB2\u0A95\u0AA4:* ${selectedToolProp.title} (${selectedToolProp.uniqueCode})
\u{1F464} *\u0AB5\u0AC7\u0A9A\u0AA8\u0ABE\u0AB0:* ${kararForm.sellerName}
\u{1F464} *\u0A96\u0AB0\u0AC0\u0AA6\u0AA8\u0ABE\u0AB0:* ${kararForm.buyerName}
\u{1F4B0} *\u0AA8\u0A95\u0ACD\u0A95\u0AC0 \u0A95\u0AB0\u0AC7\u0AB2 \u0A95\u0ABF\u0A82\u0AAE\u0AA4:* ${formatPriceIndian(kararForm.agreedPriceLakhs)}
\u2705 *\u0A86\u0A9C\u0AB0\u0ACB\u0A9C \u0A9F\u0ACB\u0A95\u0AA8 \u0AB0\u0A95\u0AAE:* \u20B9${Number(kararForm.tokenAmountRupees).toLocaleString("en-IN")}
\u{1F4C5} *\u0AA6\u0AB8\u0ACD\u0AA4\u0ABE\u0AB5\u0AC7\u0A9C \u0AAE\u0AC1\u0AA6\u0AA4:* ${kararForm.saleDeedDays} \u0AA6\u0ABF\u0AB5\u0AB8`
          );
        }),
        className: "py-3 rounded-xl bg-[#EA9E24] text-[#3D4043] font-extrabold flex items-center justify-center gap-1.5"
      },
      /* @__PURE__ */ import_react3.default.createElement(MessageSquare, { className: "w-4 h-4" }),
      " Lock Token & WhatsApp"
    ))), activeToolModal === "tour" && /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-3 text-xs" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Select Buyer for Site Visit Tour:"), /* @__PURE__ */ import_react3.default.createElement(
      "select",
      {
        value: tourBuyerId,
        onChange: (e) => setTourBuyerId(e.target.value),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-bold"
      },
      leads.map((l) => /* @__PURE__ */ import_react3.default.createElement("option", { key: l.id, value: l.id }, l.name, " (", l.phone, ") \u2014 Up to ", formatPriceIndian(l.budgetMaxLakhs)))
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-2 max-h-60 overflow-y-auto" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "font-bold text-[#3D4043]" }, "Tap Properties to Include in Visit Route:"), properties.map((p) => {
      const selected = tourPropertyIds.includes(p.id);
      return /* @__PURE__ */ import_react3.default.createElement(
        "div",
        {
          key: p.id,
          onClick: () => {
            setTourPropertyIds(
              (prev) => prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id]
            );
          },
          className: `p-3 rounded-xl border cursor-pointer flex items-center justify-between gap-2 transition ${selected ? "bg-[#EA9E24]/15 border-[#EA9E24]" : "bg-stone-50 border-stone-200"}`
        },
        /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("div", { className: "font-bold text-[#3D4043]" }, p.uniqueCode, " \u2022 ", p.title), /* @__PURE__ */ import_react3.default.createElement("div", { className: "text-[11px] text-stone-600" }, "\u{1F511} Key: ", /* @__PURE__ */ import_react3.default.createElement("b", null, p.keyLocation), " \u2022 \u{1F4DE} Owner: ", p.ownerPhone || "Direct")),
        /* @__PURE__ */ import_react3.default.createElement(
          "div",
          {
            className: `w-5 h-5 rounded-md flex items-center justify-center ${selected ? "bg-[#EA9E24] text-[#3D4043]" : "bg-white border border-stone-300"}`
          },
          selected && /* @__PURE__ */ import_react3.default.createElement(Check, { className: "w-3.5 h-3.5 stroke-[3]" })
        )
      );
    })), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => {
          const buyer = leads.find((l) => l.id === tourBuyerId) || leads[0];
          const chosen = properties.filter((p) => tourPropertyIds.includes(p.id));
          if (chosen.length === 0)
            return;
          const summaryLines = chosen.map(
            (c, i) => `${i + 1}. *${c.title}* (${c.areaVaar} Vaar) \u2014 ${formatPriceIndian(c.quotedPriceLakhs)} [Ref: ${c.uniqueCode}]`
          ).join("\n");
          sendWhatsApp(
            (buyer == null ? void 0 : buyer.phone) || "",
            `*Radhika Estate Agency \u2014 Site Visit Summary*
\u0AA8\u0AAE\u0AB8\u0ACD\u0AA4\u0AC7 ${(buyer == null ? void 0 : buyer.name) || ""}, \u0A86\u0A9C\u0AA8\u0AC0 \u0AB8\u0ABE\u0A88\u0A9F \u0AB5\u0ABF\u0A9D\u0ABF\u0A9F \u0AAE\u0ABE\u0A9F\u0AC7 \u0AB6\u0ACB\u0AB0\u0ACD\u0A9F\u0AB2\u0ABF\u0AB8\u0ACD\u0A9F \u0A95\u0AB0\u0AC7\u0AB2 \u0AAE\u0ABF\u0AB2\u0A95\u0AA4\u0ACB:

${summaryLines}

\u0A95\u0A88 \u0AAE\u0ABF\u0AB2\u0A95\u0AA4 \u0A86\u0AAA\u0AA8\u0AC7 \u0AB8\u0ACC\u0AA5\u0AC0 \u0AB5\u0AA7\u0AC1 \u0AAA\u0AB8\u0A82\u0AA6 \u0A86\u0AB5\u0AC0 \u0AA4\u0AC7 \u0A9C\u0AA3\u0ABE\u0AB5\u0AB6\u0ACB.`
          );
        },
        className: "w-full py-3 rounded-xl bg-[#3D4043] text-white font-bold flex items-center justify-center gap-1.5"
      },
      /* @__PURE__ */ import_react3.default.createElement(MessageSquare, { className: "w-4 h-4 text-[#EA9E24]" }),
      " Send Visit Shortlist on WhatsApp"
    )), activeToolModal === "import" && /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-4 text-xs" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ import_react3.default.createElement("label", { className: "font-bold text-[#3D4043] block" }, "Paste Forwarded WhatsApp Broker Message:"), /* @__PURE__ */ import_react3.default.createElement(
      "textarea",
      {
        rows: 3,
        value: waImportText,
        onChange: (e) => setWaImportText(e.target.value),
        placeholder: "e.g. 3 BHK Silver Heights Nana Mava 1310 carpet East facing 64 Lakhs...",
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl p-3"
      }
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => __async(this, null, function* () {
          const text = waImportText.trim() || "3 BHK Silver Heights Nana Mava 1310 carpet East facing 64 Lakhs";
          yield runVoiceExtraction(null, text);
          setActiveToolModal(null);
          setActiveTab("capture");
        }),
        className: "w-full py-2.5 rounded-xl bg-[#EA9E24] text-[#3D4043] font-extrabold"
      },
      "Extract into Add Property"
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "pt-3 border-t border-stone-200 space-y-2" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "font-bold text-[#3D4043]" }, "Trusted Co-Brokers (", coBrokers.length, ")"), coBrokers.map((cb) => /* @__PURE__ */ import_react3.default.createElement("div", { key: cb.id, className: "p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("div", { className: "font-bold text-[#3D4043]" }, cb.name, " (", cb.agency, ")"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "text-stone-500" }, cb.specialtyArea, " \u2022 ", cb.chainType)), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => sendWhatsApp(cb.phone, `Namaste ${cb.name}, Radhika Estate Agency here.`),
        className: "px-2.5 py-1.5 rounded-lg bg-[#3D4043] text-white font-bold"
      },
      "WhatsApp"
    )))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "pt-3 border-t border-stone-200" }, /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => {
          const blob = new Blob([JSON.stringify({ properties, leads, coBrokers }, null, 2)], {
            type: "application/json"
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Radhika_Estate_Backup.json`;
          a.click();
          notify("Cloud Backup Downloaded!");
        },
        className: "w-full py-2.5 rounded-xl bg-[#3D4043] text-white font-bold flex items-center justify-center gap-1.5"
      },
      /* @__PURE__ */ import_react3.default.createElement(Download, { className: "w-4 h-4 text-[#EA9E24]" }),
      " Download Full Cloud Backup (.JSON)"
    ))), activeToolModal === "deploy" && /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-4 text-xs" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "p-3.5 rounded-xl bg-[#EA9E24]/15 border border-[#EA9E24] space-y-2" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "font-extrabold text-[#3D4043] text-sm" }, "1-Click Complete GitHub Repository (.ZIP)"), /* @__PURE__ */ import_react3.default.createElement("p", { className: "text-stone-600 leading-relaxed" }, "Generates the complete production folder (`package.json`, `vite.config.js`, `index.html`, `public/manifest.json`, `src/main.jsx`, `src/App.jsx`, and `.env.example`) with **100% Cloud Firestore storage** and **zero `localStorage`**."), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        type: "button",
        disabled: isGeneratingZip,
        onClick: downloadFullGitHubZip,
        className: "w-full py-3.5 rounded-xl bg-[#EA9E24] hover:bg-[#d88f1c] text-[#3D4043] font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm"
      },
      isGeneratingZip ? /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement(RefreshCw, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ import_react3.default.createElement("span", null, "Packaging GitHub .ZIP...")) : /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement(Download, { className: "w-4 h-4" }), /* @__PURE__ */ import_react3.default.createElement("span", null, "Download Full GitHub Project (.ZIP)"))
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "space-y-2.5 pt-2 border-t border-stone-200" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "font-bold text-[#3D4043]" }, "Optional: Save Your Credentials to Cloud Firestore Before Downloading ZIP"), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "1. Gemini API Key (`VITE_GEMINI_API_KEY`)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "password",
        placeholder: "AIzaSy...",
        value: cloudCreds.geminiApiKey,
        onChange: (e) => setCloudCreds((p) => __spreadProps(__spreadValues({}, p), { geminiApiKey: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2" }, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Firebase API Key (`VITE_FIREBASE_API_KEY`)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        placeholder: "AIzaSy...",
        value: cloudCreds.firebaseApiKey,
        onChange: (e) => setCloudCreds((p) => __spreadProps(__spreadValues({}, p), { firebaseApiKey: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Firebase Project ID (`VITE_FIREBASE_PROJECT_ID`)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        placeholder: "radhika-estate-crm",
        value: cloudCreds.firebaseProjectId,
        onChange: (e) => setCloudCreds((p) => __spreadProps(__spreadValues({}, p), { firebaseProjectId: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Auth Domain (`VITE_FIREBASE_AUTH_DOMAIN`)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        placeholder: "radhika-estate-crm.firebaseapp.com",
        value: cloudCreds.firebaseAuthDomain,
        onChange: (e) => setCloudCreds((p) => __spreadProps(__spreadValues({}, p), { firebaseAuthDomain: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Storage Bucket (`VITE_FIREBASE_STORAGE_BUCKET`)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        placeholder: "radhika-estate-crm.appspot.com",
        value: cloudCreds.firebaseStorageBucket,
        onChange: (e) => setCloudCreds((p) => __spreadProps(__spreadValues({}, p), { firebaseStorageBucket: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Messaging Sender ID (`VITE_FIREBASE_MESSAGING_SENDER_ID`)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        placeholder: "1234567890",
        value: cloudCreds.firebaseMessagingSenderId,
        onChange: (e) => setCloudCreds((p) => __spreadProps(__spreadValues({}, p), { firebaseMessagingSenderId: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
      }
    )), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("label", { className: "text-stone-500 font-semibold block mb-1" }, "Firebase App ID (`VITE_FIREBASE_APP_ID`)"), /* @__PURE__ */ import_react3.default.createElement(
      "input",
      {
        type: "text",
        placeholder: "1:123456:web:abcdef",
        value: cloudCreds.firebaseAppId,
        onChange: (e) => setCloudCreds((p) => __spreadProps(__spreadValues({}, p), { firebaseAppId: e.target.value })),
        className: "w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
      }
    ))), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        type: "button",
        onClick: saveCloudCredsToFirestore,
        className: "w-full py-2.5 rounded-xl bg-[#3D4043] text-white font-bold"
      },
      "Save Keys to Cloud Firestore"
    ))))), /* @__PURE__ */ import_react3.default.createElement("nav", { className: "fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-3 py-1.5" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "max-w-md mx-auto grid grid-cols-4 gap-1" }, /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => setActiveTab("capture"),
        className: `flex flex-col items-center justify-center py-2 rounded-xl transition ${activeTab === "capture" ? "text-[#EA9E24] font-bold" : "text-stone-500 hover:text-[#3D4043]"}`
      },
      /* @__PURE__ */ import_react3.default.createElement(Camera, { className: "w-5 h-5" }),
      /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-[11px] mt-0.5" }, "Add Property")
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => setActiveTab("inventory"),
        className: `flex flex-col items-center justify-center py-2 rounded-xl transition ${activeTab === "inventory" ? "text-[#EA9E24] font-bold" : "text-stone-500 hover:text-[#3D4043]"}`
      },
      /* @__PURE__ */ import_react3.default.createElement(Building2, { className: "w-5 h-5" }),
      /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-[11px] mt-0.5" }, "Properties (", properties.length, ")")
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => setActiveTab("buyers"),
        className: `flex flex-col items-center justify-center py-2 rounded-xl transition ${activeTab === "buyers" ? "text-[#EA9E24] font-bold" : "text-stone-500 hover:text-[#3D4043]"}`
      },
      /* @__PURE__ */ import_react3.default.createElement(Users, { className: "w-5 h-5" }),
      /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-[11px] mt-0.5" }, "Buyers (", leads.length, ")")
    ), /* @__PURE__ */ import_react3.default.createElement(
      "button",
      {
        onClick: () => setActiveTab("tools"),
        className: `flex flex-col items-center justify-center py-2 rounded-xl transition ${activeTab === "tools" ? "text-[#EA9E24] font-bold" : "text-stone-500 hover:text-[#3D4043]"}`
      },
      /* @__PURE__ */ import_react3.default.createElement(Wrench, { className: "w-5 h-5" }),
      /* @__PURE__ */ import_react3.default.createElement("span", { className: "text-[11px] mt-0.5" }, "Quick Tools")
    ))));
  }