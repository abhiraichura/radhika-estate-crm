import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, Mic, MapPin, Lock, Eye,
  Building2, Users, Calculator, Search,
  CheckCircle2, Phone, FileText,
  RefreshCw, Trash2, Compass, Download, Upload,
  X, Cloud, Sparkles, Share2,
  Check, AlertCircle, Plus, Edit3, Scale, Navigation
} from 'lucide-react';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

// ============================================================================
// FIREBASE CLOUD & GEMINI AI INITIALIZATION
// ============================================================================
const resolvedFirebaseConfig = (() => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FIREBASE_API_KEY) {
      return {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
      };
    }
  } catch (e) {}
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    return typeof __firebase_config === 'string' ? JSON.parse(__firebase_config) : __firebase_config;
  }
  return { apiKey: "demo-key", authDomain: "demo.firebaseapp.com", projectId: "demo-project" };
})();

const getResolvedGeminiKey = (overrideKey = '') => {
  if (overrideKey && overrideKey.trim() !== '') return overrideKey.trim();
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY.trim();
    }
  } catch (e) {}
  if (typeof apiKey !== 'undefined' && apiKey) return apiKey;
  return '';
};

const app = initializeApp(resolvedFirebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'radhika-estate-agency-os';

// ============================================================================
// RAJKOT REAL ESTATE CONSTANTS & SAMPLE DATA
// ============================================================================
const RAJKOT_AREAS = [
  { name: "Kalawad Road", code: "KLWD", avgRateSqFt: 5500, jantriSqMt: 24500 },
  { name: "150 Ft Ring Road", code: "RNGR", avgRateSqFt: 6200, jantriSqMt: 28000 },
  { name: "Mavdi / Nana Mava", code: "MAVD", avgRateSqFt: 4800, jantriSqMt: 19500 },
  { name: "Raiya Road", code: "RAIY", avgRateSqFt: 5200, jantriSqMt: 22000 },
  { name: "University Road", code: "UNIV", avgRateSqFt: 5800, jantriSqMt: 25000 },
  { name: "Amin Marg / Race Course", code: "AMIN", avgRateSqFt: 7500, jantriSqMt: 34000 },
  { name: "Tagore Road / Jagnath", code: "TAGO", avgRateSqFt: 6800, jantriSqMt: 31000 },
  { name: "Gondal Road", code: "GOND", avgRateSqFt: 4200, jantriSqMt: 16500 },
  { name: "Jamnagar Road", code: "JAMN", avgRateSqFt: 4500, jantriSqMt: 17000 },
  { name: "Metoda / Shapar GIDC", code: "GIDC", avgRateSqFt: 3100, jantriSqMt: 11000 }
];

const PROPERTY_CATEGORIES = [
  "Residential Flat (3BHK/2BHK)",
  "Bungalow / Tenament",
  "Open Plot / Land",
  "Commercial Shop / Showroom",
  "Industrial Shed / GIDC"
];

// ============================================================================
// EXACT BRAND LOGO LOCK (Radhika Estate Agency)
// ============================================================================
function ExactRadhikaBrandLogo({ customLogoUrl, onUploadLogo }) {
  const fileInputRef = useRef(null);
  return (
    <div className="flex items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onUploadLogo}
      />
      <div
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        title="Tap to upload/lock your exact PHOTO-2026-10-14-16-28-58.JPG logo"
        className="cursor-pointer flex items-center gap-3 group"
      >
        {customLogoUrl ? (
          <img
            src={customLogoUrl}
            alt="Radhika Estate Agency"
            className="h-12 w-auto object-contain rounded"
          />
        ) : (
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 180 95" className="h-12 w-auto flex-shrink-0">
              <polygon points="22,82 22,52 30,46 30,82" fill="#EA9E24" />
              <polygon points="33,82 33,36 53,24 53,82" fill="#EA9E24" />
              <polygon points="43,30 43,10 61,20 61,82 56,82 56,22" fill="#3D4043" />
              <polygon points="65,82 65,36 73,41 73,82" fill="#3D4043" />
              <polygon points="79,82 106,42 133,82 121,82 106,59 91,82" fill="#EA9E24" />
              <rect x="101" y="68" width="4" height="4" fill="#EA9E24" />
              <rect x="107" y="68" width="4" height="4" fill="#EA9E24" />
              <rect x="101" y="74" width="4" height="4" fill="#EA9E24" />
              <rect x="107" y="74" width="4" height="4" fill="#EA9E24" />
              <polygon points="125,58 134,46 146,62 146,51 152,51 152,70 158,78 168,78 168,82 144,82" fill="#3D4043" />
              <rect x="12" y="80" width="80" height="3" fill="#EA9E24" />
            </svg>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-xl text-[#3D4043] tracking-tight leading-none">
                Radhika Estate Agency
              </span>
              <span className="text-[10px] font-extrabold text-[#EA9E24] tracking-widest uppercase mt-1">
                Rajkot Field CRM & Deal OS
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// UTILITY HELPERS & ROBUST GEMINI MULTIMODAL AI CALLER
// ============================================================================
function formatPriceIndian(amount) {
  if (!amount) return '₹0';
  const num = Number(amount);
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)} Lakh`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}

function generateUniquePropCode(areaCode = 'RJT') {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${areaCode}-${rand}`;
}

function generatePhotoFileName(areaCode = 'KLWD') {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const randHash = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `RJT_${areaCode}_${yyyy}${mm}${dd}_${hh}${min}${ss}_${randHash}.jpg`;
}

function safeParseJsonFromText(rawText) {
  if (!rawText) return {};
  const cleaned = String(rawText)
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e2) {}
    }
    return {};
  }
}

async function callGeminiStructuredAI({ prompt, inlineMimeType, inlineBase64, customKey }) {
  const activeKey = getResolvedGeminiKey(customKey);
  if (!activeKey) {
    throw new Error("Missing Gemini API Key. Add VITE_GEMINI_API_KEY in Vercel or paste your key in 7/12 & Tools.");
  }

  const parts = [{ text: prompt }];
  if (inlineMimeType && inlineBase64) {
    const cleanBase64 = inlineBase64.includes(',') ? inlineBase64.split(',')[1] : inlineBase64;
    const normalizedMime = inlineMimeType.split(';')[0].trim() || 'image/jpeg';
    parts.push({
      inlineData: {
        mimeType: normalizedMime,
        data: cleanBase64
      }
    });
  }

  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${activeKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        lastError = new Error(`Gemini (${modelName}) HTTP ${response.status}: ${errText}`);
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      return safeParseJsonFromText(rawText);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Gemini AI request failed.");
}

function getDefaultSampleProperties() {
  return [
    {
      id: 'prop-1',
      uniqueCode: 'KLWD-4821',
      title: 'Royal Heights 3 BHK Luxury Flat',
      category: 'Residential Flat (3BHK/2BHK)',
      areaName: 'Kalawad Road',
      sizeSqFt: 1350,
      sizeVaar: 150,
      bhk: '3 BHK',
      facing: 'East Vastu (86°)',
      priceQuoted: 7800000,
      priceBottom: 7400000,
      ownerName: 'Rameshbhai Patel',
      ownerPhone: '9825012345',
      keyLocation: 'Key with Society Watchman (Gate No. 2)',
      tpNumber: 'TP-14 (Kalawad)',
      fpNumber: 'FP-82',
      surveyNumber: 'Rev. Survey 214/P1',
      rudaZone: 'R1 - Residential Zone',
      publicNotes: 'Premium construction, modular kitchen, 2 covered car parking slots.',
      privateVaultNotes: 'Owner shifting to Ahmedabad urgently. Bottom price 73.5L possible.',
      photoUrl: '',
      status: 'Available',
      createdAt: new Date().toISOString()
    },
    {
      id: 'prop-2',
      uniqueCode: 'RNGR-9102',
      title: 'Corner Commercial Showroom',
      category: 'Commercial Shop / Showroom',
      areaName: '150 Ft Ring Road',
      sizeSqFt: 920,
      sizeVaar: 102,
      bhk: 'Commercial',
      facing: 'North-East (45°)',
      priceQuoted: 14500000,
      priceBottom: 13800000,
      ownerName: 'Ketankumar Shah',
      ownerPhone: '9426098765',
      keyLocation: 'Direct with Owner (Call 1 hr prior)',
      tpNumber: 'TP-22 (Nana Mava)',
      fpNumber: 'FP-109',
      surveyNumber: 'Rev. Survey 88/2',
      rudaZone: 'C1 - Commercial Zone',
      publicNotes: 'High footfall 150 ft wide road touch. Excellent for bank or brand showroom.',
      privateVaultNotes: 'Clear title, loan running with SBI Rs 40L. Brokerage 2% fixed.',
      photoUrl: '',
      status: 'Available',
      createdAt: new Date().toISOString()
    }
  ];
}

function getDefaultSampleBuyers() {
  return [
    {
      id: 'buyer-1',
      name: 'Chiragbhai Mehta',
      phone: '9879011223',
      requirementText: 'Looking for 3 BHK flat on Kalawad Road or University Road, budget up to 85 Lakhs, strictly East facing.',
      budgetMax: 8500000,
      preferredArea: 'Kalawad Road',
      minBhk: '3 BHK',
      createdAt: new Date().toISOString()
    },
    {
      id: 'buyer-2',
      name: 'Dipakbhai Korat (Investor)',
      phone: '9824255667',
      requirementText: 'Looking for Commercial Showroom or Open Plot on 150 Ft Ring Road or Mavdi, budget up to 1.60 Cr.',
      budgetMax: 16000000,
      preferredArea: '150 Ft Ring Road',
      minBhk: 'Commercial',
      createdAt: new Date().toISOString()
    }
  ];
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState('capture');
  const [clientViewMode, setClientViewMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cloudSynced, setCloudSynced] = useState(false);
  const [loadingCloud, setLoadingCloud] = useState(true);
  const [statusBanner, setStatusBanner] = useState('');
  const [customGeminiKey, setCustomGeminiKey] = useState('');

  // Cloud Data Collections
  const [properties, setProperties] = useState(getDefaultSampleProperties());
  const [buyers, setBuyers] = useState(getDefaultSampleBuyers());
  const [customLogoUrl, setCustomLogoUrl] = useState('');

  // Capture / Edit Form State
  const [editingPropId, setEditingPropId] = useState(null);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [capturingPhoto, setCapturingPhoto] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState('');
  const [rawPhotoBase64, setRawPhotoBase64] = useState('');
  const [photoFileName, setPhotoFileName] = useState('');
  const [gpsLocationLabel, setGpsLocationLabel] = useState('Rajkot GPS Ready');
  const [selectedArea, setSelectedArea] = useState(RAJKOT_AREAS[0]);
  const [propCategory, setPropCategory] = useState(PROPERTY_CATEGORIES[0]);
  const [propTitle, setPropTitle] = useState('');
  const [propSizeSqFt, setPropSizeSqFt] = useState('1350');
  const [propSizeVaar, setPropSizeVaar] = useState('150');
  const [propBhk, setPropBhk] = useState('3 BHK');
  const [propFacing, setPropFacing] = useState('East (85°)');
  const [propPriceQuoted, setPropPriceQuoted] = useState('7500000');
  const [propPriceBottom, setPropPriceBottom] = useState('7100000');
  const [propOwnerName, setPropOwnerName] = useState('');
  const [propOwnerPhone, setPropOwnerPhone] = useState('');
  const [propKeyLocation, setPropKeyLocation] = useState('Key with Society Watchman');
  const [propTpNumber, setPropTpNumber] = useState('TP-14');
  const [propFpNumber, setPropFpNumber] = useState('FP-82');
  const [propSurveyNumber, setPropSurveyNumber] = useState('Survey 214/P1');
  const [propRudaZone, setPropRudaZone] = useState('R1 - Residential Zone');
  const [propStatus, setPropStatus] = useState('Available');
  const [propPublicNotes, setPropPublicNotes] = useState('');
  const [propPrivateVaultNotes, setPropPrivateVaultNotes] = useState('');

  // Voice Note & Real Gemini AI Extraction State
  const [isRecording, setIsRecording] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const liveTranscriptRef = useRef('');

  // Buyer Form & AI Matchmaker State
  const [buyerSearchQuery, setBuyerSearchQuery] = useState('');
  const [editingBuyerId, setEditingBuyerId] = useState(null);
  const [newBuyerName, setNewBuyerName] = useState('');
  const [newBuyerPhone, setNewBuyerPhone] = useState('');
  const [newBuyerArea, setNewBuyerArea] = useState('Kalawad Road');
  const [newBuyerBudget, setNewBuyerBudget] = useState('8500000');
  const [newBuyerBhk, setNewBuyerBhk] = useState('3 BHK');
  const [newBuyerReq, setNewBuyerReq] = useState('');
  const [isBuyerVoiceRecording, setIsBuyerVoiceRecording] = useState(false);
  const [reverseMatchModalProp, setReverseMatchModalProp] = useState(null);

  // Quick Tools State
  const [activeToolModal, setActiveToolModal] = useState(null);
  const [calcSqFt, setCalcSqFt] = useState('1350');
  const [calcVaar, setCalcVaar] = useState('150');
  const [calcVigha, setCalcVigha] = useState('0.08');
  const [hisabPrice, setHisabPrice] = useState('7500000');
  const [hisabFemaleBuyer, setHisabFemaleBuyer] = useState(true);
  const [utaraHectare, setUtaraHectare] = useState('0');
  const [utaraAre, setUtaraAre] = useState('16');
  const [utaraSqMt, setUtaraSqMt] = useState('18');
  const [isScanningUtara, setIsScanningUtara] = useState(false);
  const [utaraScannedData, setUtaraScannedData] = useState({
    surveyNo: '214/P1',
    tpScheme: 'TP-14 (Kalawad-Munjka)',
    fpNo: 'FP-82',
    khatedar: 'Rameshbhai Karshanbhai Patel',
    rudaZone: 'R1 Residential Zone (RUDA DP 2031)',
    bojaStatus: 'Clear Title — No Bank Boja (બોજો મુક્ત)'
  });
  const [tokenReceiptData, setTokenReceiptData] = useState({
    buyerName: 'Chiragbhai Mehta',
    sellerName: 'Rameshbhai Patel',
    propertyDetails: '3 BHK Flat, Royal Heights, Kalawad Road, Rajkot',
    agreedPrice: '7500000',
    tokenAmount: '100000',
    completionDays: '60'
  });

  // Two Separate File Input Refs: One for Live Camera, One for Gallery/File Upload
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const utaraPhotoInputRef = useRef(null);

  const showToast = (msg) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(''), 5000);
  };

  // ============================================================================
  // 1. FIREBASE AUTHENTICATION
  // ============================================================================
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.warn("Firebase Auth fallback:", err.message);
        setLoadingCloud(false);
      }
    };
    initAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setLoadingCloud(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // ============================================================================
  // 2. GUARDED FIRESTORE SYNC
  // ============================================================================
  useEffect(() => {
    if (!currentUser) return;

    const propsColRef = collection(db, 'artifacts', appId, 'users', currentUser.uid, 'properties');
    const unsubProps = onSnapshot(
      propsColRef,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        if (list.length > 0) {
          setProperties(list);
        }
        setCloudSynced(true);
        setLoadingCloud(false);
      },
      (err) => {
        console.warn("Firestore sync notice:", err.message);
        setLoadingCloud(false);
      }
    );

    const buyersColRef = collection(db, 'artifacts', appId, 'users', currentUser.uid, 'buyers');
    const unsubBuyers = onSnapshot(
      buyersColRef,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        if (list.length > 0) {
          setBuyers(list);
        }
      },
      (err) => {
        console.warn("Firestore buyers sync notice:", err.message);
      }
    );

    const brandDocRef = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'settings', 'brand');
    const unsubBrand = onSnapshot(
      brandDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          if (docSnap.data().logoDataUrl) setCustomLogoUrl(docSnap.data().logoDataUrl);
          if (docSnap.data().geminiKey) setCustomGeminiKey(docSnap.data().geminiKey);
        }
      },
      () => {}
    );

    return () => {
      unsubProps();
      unsubBuyers();
      unsubBrand();
    };
  }, [currentUser]);

  const handleUploadBrandLogo = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setCustomLogoUrl(dataUrl);
      if (currentUser) {
        try {
          await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'settings', 'brand'), {
            logoDataUrl: dataUrl,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          showToast("Exact Brand Logo locked to Cloud Database!");
        } catch (err) {}
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCustomGeminiKey = async (newKeyVal) => {
    setCustomGeminiKey(newKeyVal);
    if (currentUser) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'settings', 'brand'), {
          geminiKey: newKeyVal.trim(),
          updatedAt: new Date().toISOString()
        }, { merge: true });
        showToast("Gemini AI Key Saved to Cloud Database!");
      } catch (err) {
        showToast("Gemini AI Key Set for Session!");
      }
    } else {
      showToast("Gemini AI Key Set!");
    }
  };

  // ============================================================================
  // 3. PHOTO CAPTURE OR GALLERY UPLOAD + GEMINI VISION AI SCANNER
  // ============================================================================
  const runPhotoVisionAI = async (base64Image) => {
    const imageToAnalyze = base64Image || rawPhotoBase64 || capturedPhotoUrl;
    if (!imageToAnalyze) {
      showToast("Please snap or upload a photo first!");
      return;
    }

    if (!getResolvedGeminiKey(customGeminiKey)) {
      showToast("Photo Stamped! Add your Gemini API key in '7/12 & Tools' for Vision AI OCR.");
      return;
    }

    try {
      setIsAiProcessing(true);
      showToast("Gemini Vision AI scanning photo for property details & phone numbers...");
      const aiResult = await callGeminiStructuredAI({
        prompt: `You are an expert real estate assistant for Radhika Estate Agency in Rajkot, Gujarat.
Analyze this uploaded property photo, For-Sale/To-Let board, visiting card, or brochure in ${selectedArea.name}, Rajkot.
1. If there is text (phone number, owner/builder name, project name, BHK, Sq.Ft, Vaar, price), extract it accurately.
2. Even if there is no text on the photo, visually analyze the architecture/interior/plot and suggest a professional listing title, category, and public brochure description for ${selectedArea.name}.
Return strictly valid JSON with keys:
{
  "title": "Suggested or extracted Property Title",
  "category": "Residential Flat (3BHK/2BHK) | Bungalow / Tenament | Open Plot / Land | Commercial Shop / Showroom | Industrial Shed / GIDC",
  "bhk": "3 BHK / Commercial / Plot",
  "sizeSqFt": 1350,
  "sizeVaar": 150,
  "priceQuoted": 7500000,
  "ownerName": "Extracted Name or empty string",
  "ownerPhone": "Extracted 10-digit Phone or empty string",
  "publicNotes": "Attractive visual highlights of this property for client brochure"
}`,
        inlineMimeType: 'image/jpeg',
        inlineBase64: imageToAnalyze,
        customKey: customGeminiKey
      });

      if (aiResult.title) setPropTitle(String(aiResult.title));
      if (aiResult.category && PROPERTY_CATEGORIES.includes(aiResult.category)) {
        setPropCategory(aiResult.category);
      }
      if (aiResult.bhk) setPropBhk(String(aiResult.bhk));
      if (aiResult.sizeSqFt && Number(aiResult.sizeSqFt) > 0) {
        setPropSizeSqFt(String(aiResult.sizeSqFt));
        setPropSizeVaar(String(Math.round(Number(aiResult.sizeSqFt) / 9)));
      }
      if (aiResult.priceQuoted && Number(aiResult.priceQuoted) > 0) {
        setPropPriceQuoted(String(aiResult.priceQuoted));
      }
      if (aiResult.ownerName) setPropOwnerName(String(aiResult.ownerName));
      if (aiResult.ownerPhone) setPropOwnerPhone(String(aiResult.ownerPhone));
      if (aiResult.publicNotes) setPropPublicNotes(String(aiResult.publicNotes));

      showToast("Gemini Vision AI Auto-Filled Property Details from Photo!");
    } catch (aiErr) {
      console.warn("Vision AI check:", aiErr.message);
      showToast(`Photo Stamped! (AI Note: ${aiErr.message.slice(0, 65)})`);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setCapturingPhoto(true);

    const code = generateUniquePropCode(selectedArea.code);
    const filename = generatePhotoFileName(selectedArea.code);
    setPhotoFileName(filename);
    if (!propTitle) {
      setPropTitle(`${propBhk} in ${selectedArea.name} (${code})`);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocationLabel(`${selectedArea.name} (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        },
        () => {
          setGpsLocationLabel(`${selectedArea.name}, Rajkot`);
        },
        { timeout: 3500 }
      );
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const rawDataUrl = ev.target.result;
      setRawPhotoBase64(rawDataUrl);

      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const maxW = 950;
        const scale = Math.min(1, maxW / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Burn Clean Radhika Estate Agency Metadata Bar
        ctx.fillStyle = 'rgba(61, 64, 67, 0.90)';
        ctx.fillRect(0, canvas.height - 46, canvas.width, 46);
        ctx.fillStyle = '#EA9E24';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`RADHIKA ESTATE AGENCY • ${code} • ${selectedArea.name.toUpperCase()}`, 14, canvas.height - 25);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '11px monospace';
        ctx.fillText(`${filename} • ${new Date().toLocaleString('en-IN')}`, 14, canvas.height - 9);

        const stampedDataUrl = canvas.toDataURL('image/jpeg', 0.84);
        setCapturedPhotoUrl(stampedDataUrl);
        setCapturingPhoto(false);

        // Automatically run Gemini Vision AI on the uploaded photo
        await runPhotoVisionAI(rawDataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ============================================================================
  // 4. REAL MICROPHONE VOICE NOTE + TEXT BOX + GEMINI AI AUTO-EXTRACTION
  // ============================================================================
  const applyExtractedPropertyFields = (aiData) => {
    if (!aiData) return;
    if (aiData.title) setPropTitle(String(aiData.title));
    if (aiData.areaName) {
      const matched = RAJKOT_AREAS.find(a =>
        a.name.toLowerCase().includes(String(aiData.areaName).toLowerCase()) ||
        String(aiData.areaName).toLowerCase().includes(a.name.split(' ')[0].toLowerCase())
      );
      if (matched) setSelectedArea(matched);
    }
    if (aiData.sizeSqFt && Number(aiData.sizeSqFt) > 0) {
      setPropSizeSqFt(String(aiData.sizeSqFt));
      setPropSizeVaar(String(Math.round(Number(aiData.sizeSqFt) / 9)));
    } else if (aiData.sizeVaar && Number(aiData.sizeVaar) > 0) {
      setPropSizeVaar(String(aiData.sizeVaar));
      setPropSizeSqFt(String(Math.round(Number(aiData.sizeVaar) * 9)));
    }
    if (aiData.bhk) setPropBhk(String(aiData.bhk));
    if (aiData.facing) setPropFacing(String(aiData.facing));
    if (aiData.priceQuoted && Number(aiData.priceQuoted) > 0) setPropPriceQuoted(String(aiData.priceQuoted));
    if (aiData.priceBottom && Number(aiData.priceBottom) > 0) setPropPriceBottom(String(aiData.priceBottom));
    if (aiData.ownerName) setPropOwnerName(String(aiData.ownerName));
    if (aiData.ownerPhone) setPropOwnerPhone(String(aiData.ownerPhone));
    if (aiData.keyLocation) setPropKeyLocation(String(aiData.keyLocation));
    if (aiData.publicNotes) setPropPublicNotes(String(aiData.publicNotes));
    if (aiData.privateVaultNotes) setPropPrivateVaultNotes(String(aiData.privateVaultNotes));
  };

  const runLocalSmartFallbackParser = (textInput) => {
    const textToParse = textInput || '';
    if (!textToParse.trim()) return;

    const lakhMatch = textToParse.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l\b|લાખ)/i);
    const crMatch = textToParse.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore|કરોડ)/i);
    const sqftMatch = textToParse.match(/(\d{3,5})\s*(?:sq|ft|sqft|ફૂટ)/i);
    const vaarMatch = textToParse.match(/(\d{2,4})\s*(?:vaar|var|yd|વાર)/i);
    const bhkMatch = textToParse.match(/(\d)\s*bhk/i);
    const phoneMatch = textToParse.match(/(?:\+91|0)?([6-9]\d{9})/);

    for (const areaObj of RAJKOT_AREAS) {
      const firstWord = areaObj.name.split(' ')[0].toLowerCase();
      if (textToParse.toLowerCase().includes(firstWord)) {
        setSelectedArea(areaObj);
        break;
      }
    }

    if (lakhMatch) setPropPriceQuoted(String(Math.round(parseFloat(lakhMatch[1]) * 100000)));
    if (crMatch) setPropPriceQuoted(String(Math.round(parseFloat(crMatch[1]) * 10000000)));
    if (sqftMatch) {
      setPropSizeSqFt(sqftMatch[1]);
      setPropSizeVaar(String(Math.round(Number(sqftMatch[1]) / 9)));
    } else if (vaarMatch) {
      setPropSizeVaar(vaarMatch[1]);
      setPropSizeSqFt(String(Number(vaarMatch[1]) * 9));
    }
    if (bhkMatch) setPropBhk(`${bhkMatch[1]} BHK`);
    if (phoneMatch) setPropOwnerPhone(phoneMatch[1]);
    setPropPublicNotes(textToParse);
    if (!propTitle) {
      setPropTitle(`${bhkMatch ? bhkMatch[1] + ' BHK' : propBhk} in ${selectedArea.name}`);
    }
  };

  const runGeminiOnTextOrAudio = async ({ transcriptText = '', audioBase64 = '', mimeType = 'audio/webm' }) => {
    setIsAiProcessing(true);
    const cleanText = transcriptText.startsWith('Listening...') ? '' : transcriptText.trim();

    // Always run instant regex extraction first so UI updates immediately
    if (cleanText) {
      runLocalSmartFallbackParser(cleanText);
    }

    try {
      const prompt = `You are an expert real estate broker assistant for Radhika Estate Agency in Rajkot, Gujarat.
Listen to the attached audio (if provided) and/or read the spoken/written property note (which may be in Gujarati, Hindi, or English) and extract structured fields.
Remember: 1 Vaar = 9 Sq.Ft. 1 Lakh = 100000. 1 Crore = 10000000.
Spoken/Written Note Context: "${cleanText}"
Current Area Context: "${selectedArea.name}"
Return strictly valid JSON with keys:
{
  "transcript": "accurate transcription or summary of what was said",
  "title": "Property Title (e.g. Royal Heights 3 BHK Flat)",
  "areaName": "Kalawad Road / 150 Ft Ring Road / Mavdi / Nana Mava / Raiya Road / University Road / Amin Marg / Tagore Road / Gondal Road / Jamnagar Road / Metoda",
  "sizeSqFt": 1350,
  "sizeVaar": 150,
  "bhk": "3 BHK",
  "facing": "East Vastu",
  "priceQuoted": 7800000,
  "priceBottom": 7400000,
  "ownerName": "Owner Name if mentioned",
  "ownerPhone": "10 digit phone if mentioned",
  "keyLocation": "Key info if mentioned",
  "publicNotes": "Clean highlights for buyer brochure",
  "privateVaultNotes": "Confidential broker notes"
}`;

      const result = await callGeminiStructuredAI({
        prompt,
        inlineMimeType: audioBase64 ? mimeType : null,
        inlineBase64: audioBase64 || null,
        customKey: customGeminiKey
      });

      if (result.transcript) {
        setAudioTranscript(result.transcript);
      }
      applyExtractedPropertyFields(result);
      showToast("Gemini AI Extracted & Auto-Filled All Property Fields!");
    } catch (err) {
      console.warn("Gemini AI Fallback Notice:", err.message);
      if (cleanText) {
        showToast("Smart Local Parser filled fields! (Check Gemini API Key in 7/12 & Tools for Cloud AI)");
      } else {
        showToast(`AI Note: ${err.message.slice(0, 75)}`);
      }
    } finally {
      setIsAiProcessing(false);
    }
  };

  const toggleRecordVoice = async () => {
    if (!isRecording) {
      setIsRecording(true);
      liveTranscriptRef.current = '';
      setAudioTranscript('Listening... Speak naturally in Gujarati, Hindi, or English...');
      audioChunksRef.current = [];

      // 1. Start Web Speech API for live transcript if supported
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'gu-IN'; // Supports Gujarati + English/Hindi code-switching in India
          rec.onresult = (ev) => {
            let txt = '';
            for (let i = 0; i < ev.results.length; i++) {
              txt += ev.results[i][0].transcript + ' ';
            }
            if (txt.trim()) {
              liveTranscriptRef.current = txt.trim();
              setAudioTranscript(txt.trim());
            }
          };
          rec.start();
          recognitionRef.current = rec;
        } catch (e) {}
      }

      // 2. Start MediaRecorder for multimodal Gemini Audio extraction
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
          };
          recorder.onstop = () => {
            stream.getTracks().forEach(t => t.stop());
            const capturedSpeechText = liveTranscriptRef.current || '';
            if (audioChunksRef.current.length > 0) {
              const detectedMime = recorder.mimeType || 'audio/webm';
              const blob = new Blob(audioChunksRef.current, { type: detectedMime });
              const reader = new FileReader();
              reader.onloadend = () => {
                runGeminiOnTextOrAudio({
                  transcriptText: capturedSpeechText,
                  audioBase64: reader.result,
                  mimeType: detectedMime
                });
              };
              reader.readAsDataURL(blob);
            } else {
              runGeminiOnTextOrAudio({ transcriptText: capturedSpeechText });
            }
          };
          recorder.start();
          mediaRecorderRef.current = recorder;
          return;
        } catch (micErr) {
          console.warn("Mic permission fallback:", micErr.message);
          setIsRecording(false);
          showToast("Microphone permission blocked by browser. Type or paste details in the AI box below!");
          return;
        }
      }
    } else {
      // Stop Recording
      setIsRecording(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      } else {
        runGeminiOnTextOrAudio({ transcriptText: liveTranscriptRef.current || audioTranscript });
      }
    }
  };

  // Buyer Voice Dictation with Gemini AI
  const toggleBuyerVoiceDictation = async () => {
    if (!isBuyerVoiceRecording) {
      setIsBuyerVoiceRecording(true);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const chunks = [];
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) chunks.push(e.data);
          };
          recorder.onstop = () => {
            stream.getTracks().forEach(t => t.stop());
            const mime = recorder.mimeType || 'audio/webm';
            const blob = new Blob(chunks, { type: mime });
            const reader = new FileReader();
            reader.onloadend = async () => {
              try {
                setIsAiProcessing(true);
                const parsed = await callGeminiStructuredAI({
                  prompt: `Listen to this Rajkot real estate buyer inquiry audio and extract JSON with keys: name (string), phone (string), preferredArea (string), budgetMax (number in INR), minBhk (string), requirementText (string summary).`,
                  inlineMimeType: mime,
                  inlineBase64: reader.result,
                  customKey: customGeminiKey
                });
                if (parsed.name) setNewBuyerName(String(parsed.name));
                if (parsed.phone) setNewBuyerPhone(String(parsed.phone));
                if (parsed.preferredArea) setNewBuyerArea(String(parsed.preferredArea));
                if (parsed.budgetMax) setNewBuyerBudget(String(parsed.budgetMax));
                if (parsed.minBhk) setNewBuyerBhk(String(parsed.minBhk));
                if (parsed.requirementText) setNewBuyerReq(String(parsed.requirementText));
                showToast("Gemini AI Extracted Buyer Requirement from Voice!");
              } catch (err) {
                showToast("Voice captured! Enter buyer details below.");
              } finally {
                setIsAiProcessing(false);
              }
            };
            reader.readAsDataURL(blob);
          };
          recorder.start();
          mediaRecorderRef.current = recorder;
          return;
        } catch (e) {
          setIsBuyerVoiceRecording(false);
          showToast("Mic access needed. Please allow microphone permission.");
        }
      }
    } else {
      setIsBuyerVoiceRecording(false);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    }
  };

  // Safe Matching Score Calculator
  const calculateMatchScore = (prop, buyer) => {
    let score = 62;
    const reasons = [];
    const buyerAreaStr = String(buyer?.preferredArea || '').toLowerCase();
    const propAreaStr = String(prop?.areaName || '').toLowerCase();
    const buyerBhkStr = String(buyer?.minBhk || '').toLowerCase();
    const propBhkStr = String(prop?.bhk || '').toLowerCase();

    if (buyerAreaStr && propAreaStr && propAreaStr.includes(buyerAreaStr)) {
      score += 22;
      reasons.push(`Exact Area (${prop.areaName})`);
    }
    if (buyer?.budgetMax && Number(prop?.priceQuoted) <= Number(buyer.budgetMax) * 1.08) {
      score += 11;
      reasons.push(`Fits Budget (${formatPriceIndian(prop.priceQuoted)})`);
    }
    if (buyerBhkStr && propBhkStr && propBhkStr.includes(buyerBhkStr)) {
      score += 4;
      reasons.push(`Matches ${prop.bhk}`);
    }
    return { score: Math.min(99, score), reasons };
  };

  // Save or Update Property in Cloud Database
  const handleSaveProperty = async (e) => {
    e.preventDefault();
    const idToUse = editingPropId || `prop-${Date.now()}`;
    const newProp = {
      id: idToUse,
      uniqueCode: editingPropId
        ? (properties.find(p => p.id === editingPropId)?.uniqueCode || generateUniquePropCode(selectedArea.code))
        : generateUniquePropCode(selectedArea.code),
      title: String(propTitle || `${propBhk} in ${selectedArea.name}`),
      category: String(propCategory),
      areaName: String(selectedArea.name),
      sizeSqFt: Number(propSizeSqFt) || 1350,
      sizeVaar: Number(propSizeVaar) || 150,
      bhk: String(propBhk || '3 BHK'),
      facing: String(propFacing || 'East'),
      priceQuoted: Number(propPriceQuoted) || 7500000,
      priceBottom: Number(propPriceBottom) || 7100000,
      ownerName: String(propOwnerName || 'Direct Owner'),
      ownerPhone: String(propOwnerPhone || '9825012345'),
      keyLocation: String(propKeyLocation || ''),
      tpNumber: String(propTpNumber || ''),
      fpNumber: String(propFpNumber || ''),
      surveyNumber: String(propSurveyNumber || ''),
      rudaZone: String(propRudaZone || ''),
      status: String(propStatus || 'Available'),
      publicNotes: String(propPublicNotes || ''),
      privateVaultNotes: String(propPrivateVaultNotes || ''),
      photoUrl: capturedPhotoUrl,
      createdAt: new Date().toISOString()
    };

    if (editingPropId) {
      setProperties(prev => prev.map(p => (p.id === editingPropId ? newProp : p)));
    } else {
      setProperties(prev => [newProp, ...prev]);
    }

    if (currentUser) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'properties', idToUse), newProp, { merge: true });
      } catch (err) {
        console.warn("Cloud write fallback:", err.message);
      }
    }

    setEditingPropId(null);
    setPropTitle('');
    setCapturedPhotoUrl('');
    setRawPhotoBase64('');
    setAudioTranscript('');
    setActiveTab('properties');
    setReverseMatchModalProp(newProp);
    showToast(editingPropId ? "Property Updated in Cloud!" : "Property Saved & Matched with Buyers!");
  };

  const startEditProperty = (prop) => {
    setEditingPropId(prop.id);
    const matchedArea = RAJKOT_AREAS.find(a => a.name === prop.areaName) || RAJKOT_AREAS[0];
    setSelectedArea(matchedArea);
    setPropTitle(String(prop.title || ''));
    setPropCategory(String(prop.category || PROPERTY_CATEGORIES[0]));
    setPropSizeSqFt(String(prop.sizeSqFt || 1350));
    setPropSizeVaar(String(prop.sizeVaar || 150));
    setPropBhk(String(prop.bhk || '3 BHK'));
    setPropFacing(String(prop.facing || 'East'));
    setPropPriceQuoted(String(prop.priceQuoted || 7500000));
    setPropPriceBottom(String(prop.priceBottom || 7100000));
    setPropOwnerName(String(prop.ownerName || ''));
    setPropOwnerPhone(String(prop.ownerPhone || ''));
    setPropKeyLocation(String(prop.keyLocation || ''));
    setPropTpNumber(String(prop.tpNumber || 'TP-14'));
    setPropFpNumber(String(prop.fpNumber || 'FP-82'));
    setPropSurveyNumber(String(prop.surveyNumber || ''));
    setPropRudaZone(String(prop.rudaZone || 'R1 - Residential Zone'));
    setPropStatus(String(prop.status || 'Available'));
    setPropPublicNotes(String(prop.publicNotes || ''));
    setPropPrivateVaultNotes(String(prop.privateVaultNotes || ''));
    setCapturedPhotoUrl(prop.photoUrl || '');
    setShowAdvancedFields(true);
    setActiveTab('capture');
  };

  const deleteProperty = async (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    if (currentUser) {
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'properties', id));
      } catch (err) {}
    }
    showToast("Property removed from Cloud.");
  };

  // Save or Update Buyer in Cloud Database
  const handleSaveBuyer = async (e) => {
    e.preventDefault();
    const idToUse = editingBuyerId || `buyer-${Date.now()}`;
    const newBuyer = {
      id: idToUse,
      name: String(newBuyerName || 'Walk-in Buyer'),
      phone: String(newBuyerPhone || '98250XXXXX'),
      preferredArea: String(newBuyerArea),
      budgetMax: Number(newBuyerBudget) || 8500000,
      minBhk: String(newBuyerBhk || '3 BHK'),
      requirementText: String(newBuyerReq || `Looking for ${newBuyerBhk} in ${newBuyerArea} under ${formatPriceIndian(newBuyerBudget)}`),
      createdAt: new Date().toISOString()
    };

    if (editingBuyerId) {
      setBuyers(prev => prev.map(b => (b.id === editingBuyerId ? newBuyer : b)));
    } else {
      setBuyers(prev => [newBuyer, ...prev]);
    }

    if (currentUser) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'buyers', idToUse), newBuyer, { merge: true });
      } catch (err) {}
    }

    setEditingBuyerId(null);
    setNewBuyerName('');
    setNewBuyerPhone('');
    setNewBuyerReq('');
    showToast(editingBuyerId ? "Buyer Updated in Cloud!" : "Buyer Added & Matched!");
  };

  // Scan 7/12 Utara Photo using Gemini Vision AI
  const handleScanUtaraPhoto = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setIsScanningUtara(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64Data = ev.target.result;
      try {
        const res = await callGeminiStructuredAI({
          prompt: `Analyze this Gujarat 7/12 or 8A revenue record (Satbara Utara). Extract JSON with keys: surveyNo (string), tpScheme (string), fpNo (string), khatedar (string), rudaZone (string), bojaStatus (string), hectare (number), are (number), sqMt (number).`,
          inlineMimeType: file.type || 'image/jpeg',
          inlineBase64: base64Data,
          customKey: customGeminiKey
        });
        setUtaraScannedData({
          surveyNo: res.surveyNo || '214/P1',
          tpScheme: res.tpScheme || 'TP-14 (Kalawad)',
          fpNo: res.fpNo || 'FP-82',
          khatedar: res.khatedar || 'Rameshbhai Patel',
          rudaZone: res.rudaZone || 'R1 Residential Zone',
          bojaStatus: res.bojaStatus || 'Clear Title'
        });
        if (res.hectare !== undefined) setUtaraHectare(String(res.hectare));
        if (res.are !== undefined) setUtaraAre(String(res.are));
        if (res.sqMt !== undefined) setUtaraSqMt(String(res.sqMt));
        showToast("7/12 Utara Scanned with Gemini Vision AI!");
      } catch (err) {
        showToast(`7/12 Utara Loaded! (${err.message.slice(0, 50)})`);
      } finally {
        setIsScanningUtara(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ============================================================================
  // 5. 1-TAP CLEAR PWA CACHE & SERVICE WORKER HARD RESET
  // ============================================================================
  const handleClearPwaCacheAndReload = async () => {
    showToast("Clearing PWA Service Worker & Browser Cache...");
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
      if ('caches' in window) {
        const cacheKeys = await window.caches.keys();
        await Promise.all(cacheKeys.map(key => window.caches.delete(key)));
      }
      try { window.sessionStorage.clear(); } catch (e) {}

      setTimeout(() => {
        const cleanUrl = window.location.origin + window.location.pathname + '?v=' + Date.now();
        window.location.replace(cleanUrl);
      }, 600);
    } catch (err) {
      window.location.reload();
    }
  };

  // Calculate 7/12 Utara Total Sq.Mt & Saurashtra Vaar
  const totalUtaraSqMt = (Number(utaraHectare) || 0) * 10000 + (Number(utaraAre) || 0) * 100 + (Number(utaraSqMt) || 0);
  const totalUtaraVaar = (totalUtaraSqMt * 1.19599).toFixed(1);
  const totalUtaraVigha = (totalUtaraSqMt / 1618.7).toFixed(2);
  const hasGeminiKeyActive = Boolean(getResolvedGeminiKey(customGeminiKey));

  return (
    <div className="min-h-screen bg-[#3D4043]/5 text-[#3D4043] flex flex-col font-sans antialiased selection:bg-[#EA9E24]/20">
      
      {/* ================================================================== */}
      {/* EXECUTIVE TOP HEADER WITH EXACT BRAND LOGO & DESKTOP NAV           */}
      {/* ================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b-2 border-[#EA9E24] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <ExactRadhikaBrandLogo
            customLogoUrl={customLogoUrl}
            onUploadLogo={handleUploadBrandLogo}
          />

          {/* Desktop Center Navigation Pills */}
          <div className="hidden md:flex items-center bg-[#3D4043]/5 p-1 rounded-2xl border border-[#3D4043]/10">
            <button
              onClick={() => setActiveTab('capture')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === 'capture'
                  ? 'bg-[#3D4043] text-[#FFFFFF] shadow-xs'
                  : 'text-[#3D4043] hover:bg-[#3D4043]/10'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-[#EA9E24]" />
              <span>Add Property</span>
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === 'properties'
                  ? 'bg-[#3D4043] text-[#FFFFFF] shadow-xs'
                  : 'text-[#3D4043] hover:bg-[#3D4043]/10'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#EA9E24]" />
              <span>Properties ({properties.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('buyers')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === 'buyers'
                  ? 'bg-[#3D4043] text-[#FFFFFF] shadow-xs'
                  : 'text-[#3D4043] hover:bg-[#3D4043]/10'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#EA9E24]" />
              <span>Buyers & AI Match ({buyers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === 'tools'
                  ? 'bg-[#3D4043] text-[#FFFFFF] shadow-xs'
                  : 'text-[#3D4043] hover:bg-[#3D4043]/10'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-[#EA9E24]" />
              <span>7/12 & Quick Tools</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Cloud + AI Status Pill */}
            <div
              onClick={() => setActiveTab('tools')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#3D4043] text-[#FFFFFF] rounded-xl text-[11px] font-bold cursor-pointer"
              title="Tap to configure AI or clear PWA cache"
            >
              <Cloud className="w-3.5 h-3.5 text-[#EA9E24]" />
              <span>v4.2 • {cloudSynced ? 'Cloud Synced' : 'Cloud Live'}</span>
              <span className="text-[#EA9E24]">•</span>
              <span>{hasGeminiKeyActive ? 'AI Connected' : 'Set AI Key'}</span>
            </div>

            {/* Client Safe Mode Toggle */}
            <button
              onClick={() => setClientViewMode(!clientViewMode)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                clientViewMode
                  ? 'bg-[#EA9E24] text-[#FFFFFF] border-[#EA9E24] shadow-xs'
                  : 'bg-[#FFFFFF] text-[#3D4043] border-[#3D4043]/25 hover:bg-[#3D4043]/5'
              }`}
            >
              {clientViewMode ? <Eye className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-[#EA9E24]" />}
              <span>{clientViewMode ? 'Client View' : 'Broker Vault'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Non-Intrusive Brand Toast Banner */}
      {statusBanner && (
        <div className="bg-[#3D4043] text-[#FFFFFF] text-xs font-bold px-4 py-2.5 text-center flex items-center justify-center gap-2 border-b border-[#EA9E24]">
          <Sparkles className="w-4 h-4 text-[#EA9E24]" />
          <span>{statusBanner}</span>
        </div>
      )}

      {/* ================================================================== */}
      {/* MAIN CONTENT CONTAINER                                              */}
      {/* ================================================================== */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-28 space-y-6">
        
        {/* Executive KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#FFFFFF] border border-[#3D4043]/15 rounded-2xl p-3.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3D4043]/60">Active Inventory</span>
              <p className="text-lg font-extrabold text-[#3D4043]">{properties.length} Listings</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#EA9E24]/15 text-[#EA9E24] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-[#FFFFFF] border border-[#3D4043]/15 rounded-2xl p-3.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3D4043]/60">Verified Buyers</span>
              <p className="text-lg font-extrabold text-[#3D4043]">{buyers.length} Inquiries</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#EA9E24]/15 text-[#EA9E24] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-[#FFFFFF] border border-[#3D4043]/15 rounded-2xl p-3.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3D4043]/60">Active Area</span>
              <p className="text-sm font-extrabold text-[#3D4043] truncate">{selectedArea.name}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#EA9E24]/15 text-[#EA9E24] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div
            onClick={handleClearPwaCacheAndReload}
            className="bg-[#3D4043] text-[#FFFFFF] rounded-2xl p-3.5 shadow-xs flex items-center justify-between cursor-pointer hover:opacity-95 transition-opacity"
            title="Tap to clear PWA cache and reload latest version"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EA9E24]">PWA System</span>
              <p className="text-xs font-extrabold text-[#FFFFFF] mt-0.5">Clear Cache & Reload</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#EA9E24] text-[#FFFFFF] flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* TAB 1: EXECUTIVE FIELD SCOUT CAPTURE                             */}
        {/* ================================================================ */}
        {activeTab === 'capture' && (
          <div className="space-y-5">
            <div className="bg-[#3D4043] text-[#FFFFFF] p-5 rounded-2xl border-l-4 border-[#EA9E24] shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#EA9E24]">
                  Zero-Typing Field Scout Engine
                </span>
                <h1 className="text-lg sm:text-xl font-extrabold mt-0.5">
                  {editingPropId ? 'Edit Property Listing' : 'Capture New Rajkot Property'}
                </h1>
                <p className="text-xs text-[#FFFFFF]/80 mt-0.5">
                  Snap a camera photo OR upload from gallery, and speak or type in Gujarati/Hindi/English — AI auto-fills the form.
                </p>
              </div>
              {editingPropId && (
                <button
                  onClick={() => {
                    setEditingPropId(null);
                    setPropTitle('');
                    setCapturedPhotoUrl('');
                    setRawPhotoBase64('');
                  }}
                  className="px-4 py-2 bg-[#EA9E24] text-[#FFFFFF] text-xs font-extrabold rounded-xl"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-5">
              {/* Micro-Market & Category Selector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FFFFFF] border border-[#3D4043]/15 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-extrabold text-[#3D4043]/70 uppercase tracking-wider">
                      1. Select Rajkot Micro-Market
                    </label>
                    <span className="text-[11px] font-extrabold text-[#EA9E24]">
                      Avg ₹{selectedArea.avgRateSqFt}/Sq.Ft
                    </span>
                  </div>
                  <select
                    value={selectedArea.name}
                    onChange={(e) => {
                      const found = RAJKOT_AREAS.find(a => a.name === e.target.value);
                      if (found) setSelectedArea(found);
                    }}
                    className="w-full font-extrabold text-sm text-[#3D4043] bg-[#3D4043]/5 px-3 py-2.5 rounded-xl border border-[#3D4043]/15 focus:outline-none focus:border-[#EA9E24]"
                  >
                    {RAJKOT_AREAS.map(a => (
                      <option key={a.code} value={a.name}>{a.name} ({a.code})</option>
                    ))}
                  </select>
                </div>

                <div className="bg-[#FFFFFF] border border-[#3D4043]/15 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-extrabold text-[#3D4043]/70 uppercase tracking-wider">
                      2. Property Category
                    </label>
                    <span className="text-[11px] font-bold text-[#3D4043]/60">
                      {gpsLocationLabel}
                    </span>
                  </div>
                  <select
                    value={propCategory}
                    onChange={(e) => setPropCategory(e.target.value)}
                    className="w-full font-extrabold text-sm text-[#3D4043] bg-[#3D4043]/5 px-3 py-2.5 rounded-xl border border-[#3D4043]/15 focus:outline-none focus:border-[#EA9E24]"
                  >
                    {PROPERTY_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2 BIG EXECUTIVE ACTION CARDS: PHOTO (CAMERA + GALLERY) & VOICE/TEXT AI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Card 1: Snap Camera OR Upload Photo from Gallery */}
                <div className="bg-[#FFFFFF] border-2 border-[#3D4043]/15 hover:border-[#EA9E24] rounded-2xl p-5 text-center flex flex-col items-center justify-between shadow-xs transition-all">
                  {/* Input 1: Direct Mobile Camera */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  {/* Input 2: Standard Photo Gallery / File Picker (NO capture attribute) */}
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />

                  {capturedPhotoUrl ? (
                    <div className="w-full space-y-3">
                      <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-xs border border-[#3D4043]/15">
                        <img src={capturedPhotoUrl} alt="Captured property" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 bg-[#3D4043]/95 text-[#FFFFFF] text-[10px] px-2.5 py-1 rounded-lg font-mono">
                          {photoFileName || 'RJT_STAMPED.jpg'}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCapturedPhotoUrl('');
                            setRawPhotoBase64('');
                          }}
                          className="absolute top-2 right-2 bg-[#3D4043] text-[#FFFFFF] p-1.5 rounded-xl shadow"
                          title="Remove photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current && cameraInputRef.current.click()}
                          className="py-2 px-2 bg-[#3D4043]/10 text-[#3D4043] rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Retake</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current && galleryInputRef.current.click()}
                          className="py-2 px-2 bg-[#3D4043]/10 text-[#3D4043] rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Gallery</span>
                        </button>
                        <button
                          type="button"
                          disabled={isAiProcessing}
                          onClick={() => runPhotoVisionAI()}
                          className="py-2 px-2 bg-[#EA9E24] text-[#FFFFFF] rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isAiProcessing ? 'Scanning...' : 'AI Scan'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full py-2 flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-2xl bg-[#3D4043] text-[#EA9E24] flex items-center justify-center mb-3 shadow-sm">
                        <Camera className="w-7 h-7" />
                      </div>
                      <span className="font-extrabold text-base text-[#3D4043]">
                        {capturingPhoto ? 'Stamping Radhika Watermark...' : '1. Property Photo & Vision AI'}
                      </span>
                      <span className="text-xs text-[#3D4043]/70 mt-1 mb-4">
                        Auto-stamps Unique ID, Date, Time & runs Gemini Vision OCR
                      </span>

                      <div className="grid grid-cols-2 gap-2.5 w-full">
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current && cameraInputRef.current.click()}
                          disabled={capturingPhoto}
                          className="py-3 px-3 bg-[#3D4043] text-[#FFFFFF] rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs hover:opacity-95"
                        >
                          <Camera className="w-4 h-4 text-[#EA9E24]" />
                          <span>Snap Camera</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current && galleryInputRef.current.click()}
                          disabled={capturingPhoto}
                          className="py-3 px-3 bg-[#EA9E24] text-[#FFFFFF] rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs hover:opacity-95"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Photo</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card 2: Speak OR Paste Property Details (Real Mic + Interactive AI Box) */}
                <div className="bg-[#FFFFFF] border-2 border-[#3D4043]/15 hover:border-[#EA9E24] rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all">
                  <div className="flex flex-col items-center text-center">
                    <button
                      type="button"
                      onClick={toggleRecordVoice}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2.5 shadow-sm transition-transform ${
                        isRecording
                          ? 'bg-[#EA9E24] text-[#FFFFFF] animate-pulse scale-105'
                          : 'bg-[#3D4043] text-[#EA9E24] hover:scale-105'
                      }`}
                    >
                      <Mic className="w-7 h-7" />
                    </button>
                    <span className="font-extrabold text-base text-[#3D4043]">
                      {isRecording
                        ? 'Recording Live... Tap Mic to Stop & Extract'
                        : isAiProcessing
                        ? 'Gemini AI Extracting Fields...'
                        : '2. Speak or Paste Property Note'}
                    </span>
                  </div>

                  <div className="w-full mt-3 space-y-2">
                    <textarea
                      rows={2}
                      value={audioTranscript}
                      onChange={(e) => setAudioTranscript(e.target.value)}
                      placeholder='Tap Mic to speak OR type/paste WhatsApp message here (e.g. "3 BHK flat Kalawad Road 150 Vaar 78 Lakh East facing Rameshbhai 9825012345")'
                      className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl text-xs font-bold text-[#3D4043] border border-[#3D4043]/15 focus:outline-none focus:border-[#EA9E24]"
                    />
                    <button
                      type="button"
                      disabled={isAiProcessing}
                      onClick={() => runGeminiOnTextOrAudio({ transcriptText: audioTranscript })}
                      className="w-full py-2.5 bg-[#EA9E24] text-[#FFFFFF] rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs hover:opacity-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isAiProcessing ? 'Running Gemini AI Extraction...' : 'AI Auto-Fill Fields from Note'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Structured Property Details Card */}
              <div className="bg-[#FFFFFF] border border-[#3D4043]/15 rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3D4043]/10 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EA9E24]">
                      Live Structured Sheet
                    </span>
                    <h3 className="font-extrabold text-base text-[#3D4043]">
                      {propTitle || `${propBhk} in ${selectedArea.name}`} • {formatPriceIndian(propPriceQuoted)}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                    className="px-3.5 py-1.5 bg-[#3D4043] text-[#FFFFFF] rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#EA9E24]" />
                    <span>{showAdvancedFields ? 'Hide Revenue/7-12 Fields' : 'Show 7/12 & TP Fields'}</span>
                  </button>
                </div>

                {/* Primary 4 Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#3D4043]/75 mb-1">Size (Sq.Ft)</label>
                    <input
                      type="number"
                      value={propSizeSqFt}
                      onChange={(e) => {
                        setPropSizeSqFt(e.target.value);
                        setPropSizeVaar(String(Math.round(Number(e.target.value) / 9)));
                      }}
                      className="w-full px-3 py-2.5 bg-[#3D4043]/5 rounded-xl text-sm font-extrabold border border-[#3D4043]/15"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#3D4043]/75 mb-1">Size (Vaar)</label>
                    <input
                      type="number"
                      value={propSizeVaar}
                      onChange={(e) => {
                        setPropSizeVaar(e.target.value);
                        setPropSizeSqFt(String(Number(e.target.value) * 9));
                      }}
                      className="w-full px-3 py-2.5 bg-[#3D4043]/5 rounded-xl text-sm font-extrabold border border-[#3D4043]/15"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#3D4043]/75 mb-1">Asking Price (₹)</label>
                    <input
                      type="number"
                      value={propPriceQuoted}
                      onChange={(e) => setPropPriceQuoted(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#3D4043]/5 rounded-xl text-sm font-extrabold border border-[#3D4043]/15"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#3D4043]/75 mb-1">BHK / Config</label>
                    <input
                      type="text"
                      value={propBhk}
                      onChange={(e) => setPropBhk(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#3D4043]/5 rounded-xl text-sm font-extrabold border border-[#3D4043]/15"
                    />
                  </div>
                </div>

                {/* Title & Broker Private Vault Row Always Accessible */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#3D4043]/75 mb-1">Property / Project Title</label>
                    <input
                      type="text"
                      value={propTitle}
                      onChange={(e) => setPropTitle(e.target.value)}
                      placeholder="e.g. Royal Heights 3 BHK"
                      className="w-full px-3 py-2.5 bg-[#3D4043]/5 rounded-xl text-sm font-bold border border-[#3D4043]/15"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#3D4043]/75 mb-1">Owner Name (Private Vault)</label>
                    <input
                      type="text"
                      value={propOwnerName}
                      onChange={(e) => setPropOwnerName(e.target.value)}
                      placeholder="Rameshbhai Patel"
                      className="w-full px-3 py-2.5 bg-[#3D4043]/5 rounded-xl text-sm font-bold border border-[#3D4043]/15"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#3D4043]/75 mb-1">Owner Phone (Private Vault)</label>
                    <input
                      type="text"
                      value={propOwnerPhone}
                      onChange={(e) => setPropOwnerPhone(e.target.value)}
                      placeholder="9825012345"
                      className="w-full px-3 py-2.5 bg-[#3D4043]/5 rounded-xl text-sm font-bold border border-[#3D4043]/15"
                    />
                  </div>
                </div>

                {/* Expandable 7/12 Revenue, RUDA TP & Vault Drawer */}
                {showAdvancedFields && (
                  <div className="pt-3 border-t border-[#3D4043]/10 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#3D4043]/75 mb-1">TP Scheme No.</label>
                        <input
                          type="text"
                          value={propTpNumber}
                          onChange={(e) => setPropTpNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#3D4043]/75 mb-1">FP Number</label>
                        <input
                          type="text"
                          value={propFpNumber}
                          onChange={(e) => setPropFpNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#3D4043]/75 mb-1">7/12 Survey No.</label>
                        <input
                          type="text"
                          value={propSurveyNumber}
                          onChange={(e) => setPropSurveyNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#3D4043]/75 mb-1">Vastu Facing</label>
                        <input
                          type="text"
                          value={propFacing}
                          onChange={(e) => setPropFacing(e.target.value)}
                          className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#3D4043]/75 mb-1">Bottom Price (₹ Vault)</label>
                        <input
                          type="number"
                          value={propPriceBottom}
                          onChange={(e) => setPropPriceBottom(e.target.value)}
                          className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#3D4043]/75 mb-1">Key Location</label>
                        <input
                          type="text"
                          value={propKeyLocation}
                          onChange={(e) => setPropKeyLocation(e.target.value)}
                          className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#3D4043]/75 mb-1">Status</label>
                        <select
                          value={propStatus}
                          onChange={(e) => setPropStatus(e.target.value)}
                          className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                        >
                          <option value="Available">Available</option>
                          <option value="Token Given">Token Given</option>
                          <option value="Sold">Sold</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#3D4043]/75 mb-1">Public Brochure Highlights</label>
                        <input
                          type="text"
                          value={propPublicNotes}
                          onChange={(e) => setPropPublicNotes(e.target.value)}
                          placeholder="Modular kitchen, 2 car parking..."
                          className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl text-xs border border-[#3D4043]/15"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#3D4043]/75 mb-1">Private Broker Notes</label>
                        <input
                          type="text"
                          value={propPrivateVaultNotes}
                          onChange={(e) => setPropPrivateVaultNotes(e.target.value)}
                          placeholder="Urgent sale / brokerage terms..."
                          className="w-full px-3 py-2 bg-[#EA9E24]/10 rounded-xl text-xs border border-[#EA9E24]/40"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-[#EA9E24] text-[#FFFFFF] font-extrabold text-sm rounded-xl shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{editingPropId ? 'Update Property in Cloud Database' : 'Save Property & Run AI Buyer Matchmaker'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: MY PROPERTIES (EXECUTIVE INVENTORY + EDIT + WHATSAPP)     */}
        {/* ================================================================ */}
        {activeTab === 'properties' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#3D4043] text-[#FFFFFF] p-4 rounded-2xl border-l-4 border-[#EA9E24]">
              <div>
                <h1 className="text-lg font-extrabold">
                  Radhika Property Bank ({properties.length})
                </h1>
                <p className="text-xs text-[#FFFFFF]/75">
                  {clientViewMode ? 'Client View Active — Owner contacts & bottom prices hidden' : 'Broker Vault Active — Full access'}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingPropId(null);
                  setActiveTab('capture');
                }}
                className="px-4 py-2 bg-[#EA9E24] text-[#FFFFFF] text-xs font-extrabold rounded-xl"
              >
                + Add Property
              </button>
            </div>

            <div className="space-y-3">
              {properties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-[#FFFFFF] border border-[#3D4043]/15 rounded-2xl p-4 shadow-xs flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-20 h-20 bg-[#3D4043]/10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#3D4043]/10">
                        {prop.photoUrl ? (
                          <img src={prop.photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-8 h-8 text-[#3D4043]/50" />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-mono bg-[#EA9E24]/20 text-[#3D4043] px-2 py-0.5 rounded font-extrabold">
                            {prop.uniqueCode}
                          </span>
                          <span className="text-xs font-extrabold text-[#3D4043]">{prop.areaName}</span>
                          <span className="text-[10px] bg-[#3D4043] text-[#FFFFFF] px-2 py-0.5 rounded font-bold">
                            {prop.status || 'Available'}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-base text-[#3D4043] mt-1">{prop.title}</h3>
                        <p className="text-xs font-extrabold text-[#EA9E24] mt-0.5">
                          {formatPriceIndian(prop.priceQuoted)} • {prop.sizeSqFt} Sq.Ft ({prop.sizeVaar} Vaar) • {String(prop.bhk)}
                        </p>
                        {prop.tpNumber && (
                          <p className="text-[11px] text-[#3D4043]/70 mt-0.5 font-medium">
                            {prop.tpNumber} • {prop.fpNumber} • {prop.surveyNumber} • {prop.facing}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Private Broker Vault Strip */}
                  {!clientViewMode && (
                    <div className="bg-[#3D4043]/5 px-3.5 py-2.5 rounded-xl border border-[#3D4043]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-extrabold text-[#3D4043]">Owner Vault: </span>
                        <span className="font-bold">{prop.ownerName} ({prop.ownerPhone})</span>
                        <span className="mx-2">•</span>
                        <span className="font-extrabold text-[#EA9E24]">Bottom: {formatPriceIndian(prop.priceBottom)}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#3D4043]/75">{prop.keyLocation}</span>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-[#3D4043]/10">
                    <button
                      onClick={() => startEditProperty(prop)}
                      className="px-3 py-1.5 bg-[#3D4043]/10 text-[#3D4043] rounded-xl text-xs font-extrabold hover:bg-[#3D4043]/20 flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setReverseMatchModalProp(prop)}
                      className="px-3 py-1.5 bg-[#3D4043] text-[#FFFFFF] rounded-xl text-xs font-extrabold flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#EA9E24]" />
                      <span>Matched Buyers</span>
                    </button>
                    <button
                      onClick={() => deleteProperty(prop.id)}
                      className="p-1.5 text-[#3D4043]/60 hover:text-[#3D4043] rounded-xl"
                      title="Delete Property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `*Radhika Estate Agency — Verified Rajkot Listing*\n\n*${prop.title}* (${prop.uniqueCode})\n📍 Area: ${prop.areaName}\n📐 Size: ${prop.sizeSqFt} Sq.Ft (${prop.sizeVaar} Vaar)\n🛏️ Configuration: ${prop.bhk} (${prop.facing})\n💰 Price: ${formatPriceIndian(prop.priceQuoted)}\n📝 Highlights: ${prop.publicNotes || 'Clear title, prime location.'}\n\n*Contact Radhika Estate Agency for Site Visit*`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-1.5 bg-[#EA9E24] text-[#FFFFFF] rounded-xl text-xs font-extrabold flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: BUYERS & AI PROPERTY-BUYER MATCHMAKER                     */}
        {/* ================================================================ */}
        {activeTab === 'buyers' && (
          <div className="space-y-5">
            <div className="bg-[#3D4043] text-[#FFFFFF] p-5 rounded-2xl border-l-4 border-[#EA9E24] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#EA9E24]">
                    AI Matchmaker Engine
                  </span>
                  <h2 className="text-base font-extrabold">
                    Instant Buyer-to-Property Compatibility
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={toggleBuyerVoiceDictation}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${
                    isBuyerVoiceRecording ? 'bg-[#EA9E24] text-[#FFFFFF] animate-pulse' : 'bg-[#FFFFFF]/15 text-[#FFFFFF]'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-[#EA9E24]" />
                  <span>{isBuyerVoiceRecording ? 'Stop & Extract' : 'Speak Buyer Inquiry'}</span>
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={buyerSearchQuery}
                  onChange={(e) => setBuyerSearchQuery(e.target.value)}
                  placeholder="Filter inventory by buyer requirement (e.g. 3 BHK Kalawad Road or Commercial Ring Road)..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] text-[#3D4043] text-xs font-bold focus:outline-none"
                />
              </div>

              {buyerSearchQuery.trim() !== '' && (
                <div className="bg-[#FFFFFF] text-[#3D4043] rounded-xl p-3 space-y-2">
                  <div className="text-xs font-extrabold text-[#EA9E24]">
                    Top Compatible Properties for "{buyerSearchQuery}":
                  </div>
                  {properties
                    .filter(
                      p =>
                        String(p?.title || '').toLowerCase().includes(buyerSearchQuery.toLowerCase()) ||
                        String(p?.areaName || '').toLowerCase().includes(buyerSearchQuery.toLowerCase()) ||
                        String(p?.bhk || '').toLowerCase().includes(buyerSearchQuery.toLowerCase())
                    )
                    .map(mProp => (
                      <div key={mProp.id} className="flex items-center justify-between border-b border-[#3D4043]/10 pb-2 last:border-0 last:pb-0">
                        <div>
                          <span className="font-extrabold text-xs">{mProp.title}</span>
                          <span className="block text-[11px] text-[#3D4043]/70">
                            {mProp.areaName} • {formatPriceIndian(mProp.priceQuoted)} • {mProp.sizeVaar} Vaar
                          </span>
                        </div>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`*Radhika Estate Agency — Matched Property*\n*${mProp.title}*\nArea: ${mProp.areaName}\nPrice: ${formatPriceIndian(mProp.priceQuoted)}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-[#EA9E24] text-[#FFFFFF] rounded-lg text-[11px] font-extrabold"
                        >
                          Pitch Now
                        </a>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Add / Edit Buyer Form */}
            <form onSubmit={handleSaveBuyer} className="bg-[#FFFFFF] border border-[#3D4043]/15 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-[#3D4043]">
                  {editingBuyerId ? 'Edit Buyer Lead' : 'Add New Buyer Requirement'}
                </h3>
                {editingBuyerId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBuyerId(null);
                      setNewBuyerName('');
                      setNewBuyerPhone('');
                    }}
                    className="text-xs font-bold underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  value={newBuyerName}
                  onChange={(e) => setNewBuyerName(e.target.value)}
                  placeholder="Buyer Name (e.g. Chiragbhai)"
                  className="px-3 py-2.5 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                />
                <input
                  type="text"
                  value={newBuyerPhone}
                  onChange={(e) => setNewBuyerPhone(e.target.value)}
                  placeholder="Phone (98250XXXXX)"
                  className="px-3 py-2.5 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                />
                <select
                  value={newBuyerArea}
                  onChange={(e) => setNewBuyerArea(e.target.value)}
                  className="px-3 py-2.5 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                >
                  {RAJKOT_AREAS.map(a => (
                    <option key={a.code} value={a.name}>{a.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={newBuyerBudget}
                  onChange={(e) => setNewBuyerBudget(e.target.value)}
                  placeholder="Max Budget (₹)"
                  className="px-3 py-2.5 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBuyerReq}
                  onChange={(e) => setNewBuyerReq(e.target.value)}
                  placeholder="Specific note (e.g. East facing, 3 BHK, urgent possession)..."
                  className="flex-1 px-3 py-2.5 bg-[#3D4043]/5 rounded-xl text-xs border border-[#3D4043]/15"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#EA9E24] text-[#FFFFFF] rounded-xl text-xs font-extrabold"
                >
                  {editingBuyerId ? 'Update Buyer' : '+ Save Buyer'}
                </button>
              </div>
            </form>

            {/* Buyer List with Automatic Compatible Properties */}
            <div className="space-y-3">
              {buyers.map((buyer) => {
                const rankedMatches = properties
                  .map(p => ({ prop: p, ...calculateMatchScore(p, buyer) }))
                  .filter(m => m.score >= 70)
                  .sort((a, b) => b.score - a.score);

                return (
                  <div key={buyer.id} className="bg-[#FFFFFF] border border-[#3D4043]/15 rounded-2xl p-4 space-y-3 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#3D4043]">{buyer.name} ({buyer.phone})</h4>
                        <p className="text-xs font-extrabold text-[#EA9E24]">
                          Max Budget: {formatPriceIndian(buyer.budgetMax)} • Prefers: {buyer.preferredArea}
                        </p>
                        <p className="text-xs text-[#3D4043]/75 mt-1">{buyer.requirementText}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingBuyerId(buyer.id);
                            setNewBuyerName(String(buyer.name || ''));
                            setNewBuyerPhone(String(buyer.phone || ''));
                            setNewBuyerArea(String(buyer.preferredArea || 'Kalawad Road'));
                            setNewBuyerBudget(String(buyer.budgetMax || 8500000));
                            setNewBuyerReq(String(buyer.requirementText || ''));
                          }}
                          className="px-2.5 py-1 bg-[#3D4043]/10 text-[#3D4043] rounded-lg text-xs font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            setBuyers(prev => prev.filter(b => b.id !== buyer.id));
                            if (currentUser) {
                              try {
                                await deleteDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'buyers', buyer.id));
                              } catch (err) {}
                            }
                          }}
                          className="p-1 text-[#3D4043]/50 hover:text-[#3D4043]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Matched Inventory for This Buyer */}
                    <div className="bg-[#3D4043]/5 p-3 rounded-xl space-y-2">
                      <div className="text-[11px] font-extrabold text-[#3D4043] uppercase">
                        AI Compatible Properties ({rankedMatches.length})
                      </div>
                      {rankedMatches.map(({ prop, score, reasons }) => (
                        <div key={prop.id} className="flex items-center justify-between bg-[#FFFFFF] p-2.5 rounded-xl border border-[#3D4043]/10">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-[#EA9E24] text-[#FFFFFF] rounded text-[10px] font-extrabold">
                                {score}% Match
                              </span>
                              <span className="font-bold text-xs text-[#3D4043]">{prop.title}</span>
                            </div>
                            <p className="text-[11px] text-[#3D4043]/70 mt-0.5">
                              {reasons.join(' • ')} • {formatPriceIndian(prop.priceQuoted)}
                            </p>
                          </div>
                          <a
                            href={`https://wa.me/91${String(buyer?.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Namaste ${buyer.name},\n\nWe have a verified property matching your requirement:\n*${prop.title}*\n📍 Area: ${prop.areaName}\n📐 Size: ${prop.sizeSqFt} Sq.Ft (${prop.sizeVaar} Vaar)\n💰 Asking: ${formatPriceIndian(prop.priceQuoted)}\n\n— *Radhika Estate Agency, Rajkot*`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-[#3D4043] text-[#FFFFFF] rounded-xl text-xs font-bold"
                          >
                            Pitch WhatsApp
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 4: QUICK TOOLS (7/12 UTARA, VAAR, PAKKA HISAB, AI KEY & CACHE)*/}
        {/* ================================================================ */}
        {activeTab === 'tools' && (
          <div className="space-y-4">
            <div className="bg-[#3D4043] text-[#FFFFFF] p-5 rounded-2xl border-l-4 border-[#EA9E24] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#EA9E24]">
                  Rajkot Deal Desk & System Utilities
                </span>
                <h1 className="text-lg font-extrabold">
                  7/12 Utara, Saurashtra Vaar, Pakka Hisab & AI / Cache Manager
                </h1>
              </div>
              <button
                onClick={handleClearPwaCacheAndReload}
                className="px-4 py-2.5 bg-[#EA9E24] text-[#FFFFFF] rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-xs"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Clear PWA Cache & Force Reload</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1: AnyROR 7/12 & 8A Utara + RUDA TP Check */}
              <div className="bg-[#FFFFFF] border border-[#3D4043]/15 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-[#EA9E24]/15 text-[#3D4043] rounded-md text-[10px] font-extrabold uppercase">
                    Gujarat Revenue & RUDA
                  </span>
                  <FileText className="w-5 h-5 text-[#EA9E24]" />
                </div>
                <h3 className="font-extrabold text-base text-[#3D4043]">
                  AnyROR 7/12 Utara & RUDA Zoning
                </h3>
                <p className="text-xs text-[#3D4043]/75">
                  Convert Hectare-Are-Sq.Mt (હેક્ટર-આરે-ચો.મી.) into Saurashtra Vaar & 16-Guntha Vigha and scan 7/12 photos with Gemini AI.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-[#3D4043]/70">Hectare (હે.)</label>
                    <input
                      type="number"
                      value={utaraHectare}
                      onChange={(e) => setUtaraHectare(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#3D4043]/70">Are (આરે)</label>
                    <input
                      type="number"
                      value={utaraAre}
                      onChange={(e) => setUtaraAre(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#3D4043]/70">Sq.Mt (ચો.મી.)</label>
                    <input
                      type="number"
                      value={utaraSqMt}
                      onChange={(e) => setUtaraSqMt(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                    />
                  </div>
                </div>
                <div className="bg-[#3D4043]/5 p-3 rounded-xl text-xs font-bold flex items-center justify-between">
                  <span>= {totalUtaraVaar} Vaar</span>
                  <span className="text-[#EA9E24]">= {totalUtaraVigha} Vigha (16-Guntha)</span>
                </div>
                <button
                  onClick={() => setActiveToolModal('utara')}
                  className="w-full py-2.5 bg-[#3D4043] text-[#FFFFFF] text-xs font-extrabold rounded-xl"
                >
                  Open 7/12 Vision Scanner & RUDA Verification
                </button>
              </div>

              {/* Card 2: Saurashtra Vaar / Sq.Ft / Vigha Converter */}
              <div className="bg-[#FFFFFF] border border-[#3D4043]/15 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-[#EA9E24]/15 text-[#3D4043] rounded-md text-[10px] font-extrabold uppercase">
                    Saurashtra Land Units
                  </span>
                  <Calculator className="w-5 h-5 text-[#EA9E24]" />
                </div>
                <h3 className="font-extrabold text-base text-[#3D4043]">
                  Instant Vaar ↔ Sq.Ft ↔ Vigha
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-[#3D4043]/70">Sq.Ft</label>
                    <input
                      type="number"
                      value={calcSqFt}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setCalcSqFt(e.target.value);
                        setCalcVaar(String((v / 9).toFixed(1)));
                        setCalcVigha(String((v / 17424).toFixed(3)));
                      }}
                      className="w-full px-2.5 py-1.5 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#3D4043]/70">Vaar (Sq.Yd)</label>
                    <input
                      type="number"
                      value={calcVaar}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setCalcVaar(e.target.value);
                        setCalcSqFt(String(Math.round(v * 9)));
                        setCalcVigha(String(((v * 9) / 17424).toFixed(3)));
                      }}
                      className="w-full px-2.5 py-1.5 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#3D4043]/70">Vigha</label>
                    <input
                      type="number"
                      value={calcVigha}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setCalcVigha(e.target.value);
                        setCalcSqFt(String(Math.round(v * 17424)));
                        setCalcVaar(String(Math.round((v * 17424) / 9)));
                      }}
                      className="w-full px-2.5 py-1.5 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#3D4043]/70">
                  Calibrated to Rajkot/Saurashtra standard (1 Vaar = 9 Sq.Ft, 1 Saurashtra Vigha = 1,936 Vaar / 17,424 Sq.Ft).
                </p>
              </div>

              {/* Card 3: Pakka Hisab */}
              <div className="bg-[#FFFFFF] border border-[#3D4043]/15 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-[#EA9E24]/15 text-[#3D4043] rounded-md text-[10px] font-extrabold uppercase">
                    Financial Deal Sheet
                  </span>
                  <Scale className="w-5 h-5 text-[#EA9E24]" />
                </div>
                <h3 className="font-extrabold text-base text-[#3D4043]">
                  "Pakka Hisab" Stamp Duty & EMI Sheet
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={hisabPrice}
                    onChange={(e) => setHisabPrice(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-[#3D4043]/5 rounded-xl text-xs font-bold border border-[#3D4043]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setHisabFemaleBuyer(!hisabFemaleBuyer)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      hisabFemaleBuyer ? 'bg-[#EA9E24] text-[#FFFFFF]' : 'bg-[#3D4043]/10 text-[#3D4043]'
                    }`}
                  >
                    {hisabFemaleBuyer ? 'Female Buyer (0% Reg)' : 'Male Buyer (1% Reg)'}
                  </button>
                </div>
                <div className="bg-[#3D4043]/5 p-3 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Gujarat Stamp Duty (4.9%):</span>
                    <span className="font-bold">{formatPriceIndian(Number(hisabPrice) * 0.049)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee ({hisabFemaleBuyer ? '0% Female' : '1% Male'}):</span>
                    <span className="font-bold">
                      {hisabFemaleBuyer ? '₹0 (Exempt)' : formatPriceIndian(Number(hisabPrice) * 0.01)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#3D4043]/10 pt-1 font-extrabold text-[#EA9E24]">
                    <span>Total Out-of-Pocket Package:</span>
                    <span>
                      {formatPriceIndian(
                        Number(hisabPrice) * (1 + 0.049 + (hisabFemaleBuyer ? 0 : 0.01))
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 4: Bilingual Gujarati Token Receipt (Samjuti Karar) */}
              <div className="bg-[#FFFFFF] border border-[#3D4043]/15 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-[#EA9E24]/15 text-[#3D4043] rounded-md text-[10px] font-extrabold uppercase">
                    Bilingual Legal MoU
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-[#EA9E24]" />
                </div>
                <h3 className="font-extrabold text-base text-[#3D4043]">
                  Gujarati Token Receipt (સમજૂતી કરાર)
                </h3>
                <p className="text-xs text-[#3D4043]/75">
                  Generate an instant bilingual Token Receipt / Banakhat Summary ready to share on WhatsApp.
                </p>
                <button
                  onClick={() => setActiveToolModal('token')}
                  className="w-full py-2.5 bg-[#EA9E24] text-[#FFFFFF] text-xs font-extrabold rounded-xl"
                >
                  Generate Token Receipt (સમજૂતી કરાર)
                </button>
              </div>
            </div>

            {/* Card 5: Direct Cloud Gemini AI Key Manager + PWA Cache Reset */}
            <div className="bg-[#3D4043] text-[#FFFFFF] rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA9E24]">
                    Cloud AI Key & PWA Cache Manager
                  </span>
                  <h3 className="font-extrabold text-base">
                    Direct Gemini API Key Lock & Hard Cache Reset
                  </h3>
                  <p className="text-xs text-[#FFFFFF]/75 mt-0.5">
                    If Vercel didn't bundle your VITE_GEMINI_API_KEY, paste your Gemini API key once below — it locks into your Firebase Cloud Database automatically so Voice & Photo AI work across all your devices.
                  </p>
                </div>
                <Sparkles className="w-6 h-6 text-[#EA9E24]" />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="password"
                  value={customGeminiKey}
                  onChange={(e) => setCustomGeminiKey(e.target.value)}
                  placeholder={hasGeminiKeyActive ? "Gemini API Key Active (Paste new key to override)..." : "Paste your AIzaSy... Gemini API Key here"}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] text-[#3D4043] text-xs font-bold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSaveCustomGeminiKey(customGeminiKey)}
                  className="px-5 py-2.5 bg-[#EA9E24] text-[#FFFFFF] text-xs font-extrabold rounded-xl"
                >
                  Save Gemini Key to Cloud
                </button>
              </div>

              <div className="pt-2 border-t border-[#FFFFFF]/15 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#FFFFFF]/80">
                  Status: <strong>{hasGeminiKeyActive ? 'Gemini AI Connected & Ready' : 'Waiting for Gemini Key'}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleClearPwaCacheAndReload}
                  className="py-2.5 px-4 bg-[#FFFFFF] text-[#3D4043] text-xs font-extrabold rounded-xl flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-[#EA9E24]" />
                  <span>Clear PWA Cache & Force Hard Reload</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================================================================== */}
      {/* MODAL 1: REVERSE BUYER MATCHMAKER POPUP                             */}
      {/* ================================================================== */}
      {reverseMatchModalProp && (
        <div className="fixed inset-0 z-50 bg-[#3D4043]/75 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] text-[#3D4043] max-w-lg w-full rounded-2xl p-5 space-y-4 shadow-xl border border-[#3D4043]/15">
            <div className="flex items-center justify-between border-b border-[#3D4043]/10 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#EA9E24]">
                  Instant AI Reverse Matchmaker
                </span>
                <h3 className="font-extrabold text-base">{reverseMatchModalProp.title}</h3>
              </div>
              <button
                onClick={() => setReverseMatchModalProp(null)}
                className="p-1.5 bg-[#3D4043]/10 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {buyers.map((b) => {
                const { score, reasons } = calculateMatchScore(reverseMatchModalProp, b);
                return (
                  <div key={b.id} className="p-3 bg-[#3D4043]/5 rounded-xl flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#EA9E24] text-[#FFFFFF] text-[10px] font-extrabold rounded">
                          {score}% Match
                        </span>
                        <span className="font-extrabold text-xs">{b.name}</span>
                      </div>
                      <p className="text-[11px] text-[#3D4043]/75 mt-1">
                        {reasons.join(' • ') || `Budget: ${formatPriceIndian(b.budgetMax)}`}
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/91${String(b?.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Namaste ${b.name},\n\nNew listing at *Radhika Estate Agency* matching your requirement:\n*${reverseMatchModalProp.title}*\n📍 Area: ${reverseMatchModalProp.areaName}\n📐 Size: ${reverseMatchModalProp.sizeSqFt} Sq.Ft (${reverseMatchModalProp.sizeVaar} Vaar)\n💰 Price: ${formatPriceIndian(reverseMatchModalProp.priceQuoted)}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#3D4043] text-[#FFFFFF] rounded-xl text-xs font-bold"
                    >
                      Send Pitch
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 2: ANYROR 7/12 UTARA & RUDA TP SCANNER                        */}
      {/* ================================================================== */}
      {activeToolModal === 'utara' && (
        <div className="fixed inset-0 z-50 bg-[#3D4043]/75 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] text-[#3D4043] max-w-lg w-full rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#3D4043]/10 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#EA9E24]">
                  Gujarat Revenue Record & RUDA Verification
                </span>
                <h3 className="font-extrabold text-base">7/12 & 8A Utara (સાતબાર ઉતારો)</h3>
              </div>
              <button onClick={() => setActiveToolModal(null)} className="p-1.5 bg-[#3D4043]/10 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              ref={utaraPhotoInputRef}
              type="file"
              accept="image/*"
              onChange={handleScanUtaraPhoto}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => utaraPhotoInputRef.current && utaraPhotoInputRef.current.click()}
              className="w-full py-2.5 bg-[#3D4043] text-[#FFFFFF] text-xs font-extrabold rounded-xl flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-[#EA9E24]" />
              <span>{isScanningUtara ? 'Scanning 7/12 Utara with Gemini AI...' : 'Upload / Scan 7/12 Utara Photo (AI OCR)'}</span>
            </button>

            <div className="bg-[#3D4043]/5 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-bold">Survey Number (સર્વે નં.):</span>
                <span>{utaraScannedData.surveyNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">TP / FP Scheme:</span>
                <span>{utaraScannedData.tpScheme} • {utaraScannedData.fpNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Khatedar Name (ખાતેદાર):</span>
                <span>{utaraScannedData.khatedar}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">RUDA Zoning:</span>
                <span>{utaraScannedData.rudaZone}</span>
              </div>
              <div className="flex justify-between text-[#EA9E24] font-extrabold">
                <span>Boja / Title Status:</span>
                <span>{utaraScannedData.bojaStatus}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPropSurveyNumber(`Survey ${utaraScannedData.surveyNo}`);
                  setPropTpNumber(utaraScannedData.tpScheme);
                  setPropFpNumber(utaraScannedData.fpNo);
                  setPropSizeVaar(String(Math.round(Number(totalUtaraVaar))));
                  setPropSizeSqFt(String(Math.round(Number(totalUtaraVaar) * 9)));
                  setActiveToolModal(null);
                  setShowAdvancedFields(true);
                  setActiveTab('capture');
                  showToast("7/12 Utara Details Applied to Property Form!");
                }}
                className="flex-1 py-2.5 bg-[#EA9E24] text-[#FFFFFF] text-xs font-extrabold rounded-xl"
              >
                Apply 7/12 Details to Property Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 3: BILINGUAL GUJARATI TOKEN RECEIPT (સમજૂતી કરાર)             */}
      {/* ================================================================== */}
      {activeToolModal === 'token' && (
        <div className="fixed inset-0 z-50 bg-[#3D4043]/75 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] text-[#3D4043] max-w-lg w-full rounded-2xl p-5 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#3D4043]/10 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#EA9E24]">
                  Radhika Estate Agency — Rajkot
                </span>
                <h3 className="font-extrabold text-base">
                  સમજૂતી કરાર / Token Receipt (MoU)
                </h3>
              </div>
              <button onClick={() => setActiveToolModal(null)} className="p-1.5 bg-[#3D4043]/10 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Seller Name (વેચનાર)</label>
                <input
                  type="text"
                  value={tokenReceiptData.sellerName}
                  onChange={(e) => setTokenReceiptData({ ...tokenReceiptData, sellerName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Buyer Name (ખરીદનાર)</label>
                <input
                  type="text"
                  value={tokenReceiptData.buyerName}
                  onChange={(e) => setTokenReceiptData({ ...tokenReceiptData, buyerName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-bold block mb-1">Property Description (મિલકતની વિગત)</label>
                <input
                  type="text"
                  value={tokenReceiptData.propertyDetails}
                  onChange={(e) => setTokenReceiptData({ ...tokenReceiptData, propertyDetails: e.target.value })}
                  className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Agreed Final Price (નક્કી કરેલ કિંમત ₹)</label>
                <input
                  type="number"
                  value={tokenReceiptData.agreedPrice}
                  onChange={(e) => setTokenReceiptData({ ...tokenReceiptData, agreedPrice: e.target.value })}
                  className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Token Paid Today (આજરોજ ટોકન ₹)</label>
                <input
                  type="number"
                  value={tokenReceiptData.tokenAmount}
                  onChange={(e) => setTokenReceiptData({ ...tokenReceiptData, tokenAmount: e.target.value })}
                  className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="bg-[#3D4043]/5 p-3.5 rounded-xl text-xs space-y-1.5 border border-[#3D4043]/15">
              <p className="font-extrabold text-[#3D4043]">
                રાધિકા એસ્ટેટ એજન્સી — રાજકોટ (સમજૂતી નોંધ)
              </p>
              <p>
                આજરોજ વેચનાર <strong>{tokenReceiptData.sellerName}</strong> પાસેથી ખરીદનાર <strong>{tokenReceiptData.buyerName}</strong> એ મિલકત <strong>{tokenReceiptData.propertyDetails}</strong> કુલ કિંમત <strong>{formatPriceIndian(tokenReceiptData.agreedPrice)}</strong> માં ખરીદવાનું નક્કી કરેલ છે, જેના ટોકન પેટે <strong>{formatPriceIndian(tokenReceiptData.tokenAmount)}</strong> ચૂકવેલ છે. બાકી રકમ {tokenReceiptData.completionDays} દિવસમાં ચૂકવી દસ્તાવેજ કરવાનો રહેશે.
              </p>
            </div>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `*રાધિકા એસ્ટેટ એજન્સી (Radhika Estate Agency) — સમજૂતી કરાર / Token Receipt*\n\n• વેચનાર (Seller): ${tokenReceiptData.sellerName}\n• ખરીદનાર (Buyer): ${tokenReceiptData.buyerName}\n• મિલકત (Property): ${tokenReceiptData.propertyDetails}\n• નક્કી કરેલ કિંમત (Agreed Price): ${formatPriceIndian(tokenReceiptData.agreedPrice)}\n• ચૂકવેલ ટોકન (Token Paid): ${formatPriceIndian(tokenReceiptData.tokenAmount)}\n• દસ્તાવેજ મુદત: ${tokenReceiptData.completionDays} Days\n\n*Witness & Broker: Radhika Estate Agency, Rajkot*`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-[#EA9E24] text-[#FFFFFF] text-xs font-extrabold rounded-xl flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Bilingual Token Receipt on WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* BOTTOM NAVIGATION BAR (STRICT BRAND COLORS)                         */}
      {/* ================================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#FFFFFF] border-t-2 border-[#EA9E24] py-2.5 px-4 z-40 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('capture')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'capture' ? 'text-[#EA9E24]' : 'text-[#3D4043]/65 hover:text-[#3D4043]'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[10px] font-extrabold">Add Property</span>
        </button>

        <button
          onClick={() => setActiveTab('properties')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'properties' ? 'text-[#EA9E24]' : 'text-[#3D4043]/65 hover:text-[#3D4043]'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px] font-extrabold">Properties ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('buyers')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'buyers' ? 'text-[#EA9E24]' : 'text-[#3D4043]/65 hover:text-[#3D4043]'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-extrabold">Buyers & AI Match</span>
        </button>

        <button
          onClick={() => setActiveTab('tools')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'tools' ? 'text-[#EA9E24]' : 'text-[#3D4043]/65 hover:text-[#3D4043]'
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span className="text-[10px] font-extrabold">7/12 & Tools</span>
        </button>
      </nav>
    </div>
  );
}
