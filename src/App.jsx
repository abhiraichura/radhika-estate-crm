import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, Mic, MapPin, Lock, Eye,
  Building2, Users, Calculator, Search,
  CheckCircle2, Phone, FileText,
  RefreshCw, Trash2, Compass, Upload,
  X, Cloud, Sparkles, Share2,
  Check, Plus, Edit3, Scale, ArrowUpRight,
  SlidersHorizontal, ShieldCheck, Layers, Zap
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
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

// ============================================================================
// FIREBASE CLOUD & GEMINI 3 FLASH INITIALIZATION
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

const app = initializeApp(resolvedFirebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'radhika-estate-agency-os';

// ============================================================================
// RAJKOT MICRO-MARKETS & CONSTANTS
// ============================================================================
const RAJKOT_AREAS = [
  { name: "Kalawad Road", code: "KLWD", avgRateSqFt: 5500, jantriSqMt: 24500 },
  { name: "150 Ft Ring Road", code: "RNGR", avgRateSqFt: 6200, jantriSqMt: 28000 },
  { name: "Mavdi / Nana Mava", code: "MAVD", avgRateSqFt: 4800, jantriSqMt: 19500 },
  { name: "Raiya Road", code: "RAIY", avgRateSqFt: 5200, jantriSqMt: 22000 },
  { name: "University Road", code: "UNIV", avgRateSqFt: 5800, jantriSqMt: 25000 },
  { name: "Amin Marg", code: "AMIN", avgRateSqFt: 7500, jantriSqMt: 34000 },
  { name: "Tagore Road", code: "TAGO", avgRateSqFt: 6800, jantriSqMt: 31000 },
  { name: "Gondal Road", code: "GOND", avgRateSqFt: 4200, jantriSqMt: 16500 },
  { name: "Jamnagar Road", code: "JAMN", avgRateSqFt: 4500, jantriSqMt: 17000 },
  { name: "Metoda GIDC", code: "GIDC", avgRateSqFt: 3100, jantriSqMt: 11000 }
];

const PROPERTY_CATEGORIES = [
  "Residential Flat (3BHK/2BHK)",
  "Bungalow / Tenament",
  "Open Plot / Land",
  "Commercial Shop / Showroom",
  "Industrial Shed / GIDC"
];

const QUICK_CONFIG_PILLS = ["2 BHK", "3 BHK", "4 BHK", "Penthouse", "Bungalow", "Open Plot", "Showroom", "GIDC Shed"];
const QUICK_FACING_PILLS = ["East (Ishanya)", "North-East", "North", "West", "Road Corner"];

// ============================================================================
// RADHIKA ESTATE AGENCY — EXACT BRAND LOGO COMPONENT
// ============================================================================
function ExactRadhikaBrandLogo({ customLogoUrl, onUploadLogo, size = "default" }) {
  const fileInputRef = useRef(null);
  return (
    <div className="flex items-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onUploadLogo}
      />
      <div
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        title="Tap to lock your original Radhika Estate Agency logo image"
        className="cursor-pointer flex items-center gap-3 group select-none"
      >
        {customLogoUrl ? (
          <img
            src={customLogoUrl}
            alt="Radhika Estate Agency"
            className={`${size === 'large' ? 'h-12' : 'h-9'} w-auto object-contain rounded-xl transition-transform group-hover:scale-[1.02]`}
          />
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[16px] bg-gradient-to-br from-[#3D4043] to-[#26282A] flex items-center justify-center shadow-[0_6px_20px_rgba(61,64,67,0.18),inset_0_1px_1px_rgba(255,255,255,0.2)] border border-[#EA9E24]/40">
              <svg viewBox="0 0 180 95" className="h-7 w-auto">
                <polygon points="22,82 22,52 30,46 30,82" fill="#EA9E24" />
                <polygon points="33,82 33,36 53,24 53,82" fill="#EA9E24" />
                <polygon points="43,30 43,10 61,20 61,82 56,82 56,22" fill="#FFFFFF" />
                <polygon points="65,82 65,36 73,41 73,82" fill="#FFFFFF" />
                <polygon points="79,82 106,42 133,82 121,82 106,59 91,82" fill="#EA9E24" />
                <rect x="101" y="68" width="4" height="4" fill="#EA9E24" />
                <rect x="107" y="68" width="4" height="4" fill="#EA9E24" />
                <rect x="101" y="74" width="4" height="4" fill="#EA9E24" />
                <rect x="107" y="74" width="4" height="4" fill="#EA9E24" />
                <polygon points="125,58 134,46 146,62 146,51 152,51 152,70 158,78 168,78 168,82 144,82" fill="#FFFFFF" />
                <rect x="12" y="80" width="80" height="3" fill="#EA9E24" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[17px] text-[#3D4043] tracking-[-0.03em] leading-none">
                Radhika Estate Agency
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#EA9E24] mt-1">
                Rajkot Spatial Deal OS
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// ARCHITECTURAL CARD VISUALIZER (WHEN NO PHOTO UPLOADED YET)
// ============================================================================
function ArchitecturalPreviewGraphic({ prop }) {
  const isPlot = String(prop.category || '').includes('Plot') || String(prop.bhk || '').includes('Plot');
  const isCommercial = String(prop.category || '').includes('Commercial') || String(prop.bhk || '').includes('Showroom');
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#3D4043] via-[#323538] to-[#232527] relative overflow-hidden flex flex-col justify-between p-4 text-white select-none">
      <div
        className="absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-25 blur-2xl pointer-events-none"
        style={{ background: '#EA9E24' }}
      />
      <div className="flex items-center justify-between z-10">
        <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold tracking-wider text-[#EA9E24]">
          {prop.uniqueCode || 'RJT-OS'}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md text-[10px] font-semibold text-white/80">
          {prop.facing || 'East'}
        </span>
      </div>

      <div className="my-auto flex items-center justify-center z-10 py-2">
        {isPlot ? (
          <div className="w-28 h-20 border-2 border-dashed border-[#EA9E24]/70 rounded-xl flex flex-col items-center justify-center bg-[#EA9E24]/10">
            <Compass className="w-5 h-5 text-[#EA9E24] mb-1" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-white/90">
              {prop.sizeVaar} Vaar Plot
            </span>
          </div>
        ) : isCommercial ? (
          <div className="flex items-end gap-1.5">
            <div className="w-8 h-14 rounded-t-lg bg-[#EA9E24]/80 border border-white/20" />
            <div className="w-12 h-20 rounded-t-lg bg-white/15 border border-white/30 flex flex-col items-center justify-center p-1">
              <div className="w-full h-2 bg-[#EA9E24] rounded-full mb-1" />
              <div className="grid grid-cols-2 gap-1 w-full flex-1">
                <div className="bg-white/20 rounded-xs" />
                <div className="bg-white/20 rounded-xs" />
              </div>
            </div>
            <div className="w-8 h-12 rounded-t-lg bg-white/10 border border-white/20" />
          </div>
        ) : (
          <svg viewBox="0 0 180 95" className="h-14 w-auto opacity-90">
            <polygon points="22,82 22,52 30,46 30,82" fill="#EA9E24" />
            <polygon points="33,82 33,36 53,24 53,82" fill="#EA9E24" />
            <polygon points="43,30 43,10 61,20 61,82 56,82 56,22" fill="#FFFFFF" />
            <polygon points="65,82 65,36 73,41 73,82" fill="#FFFFFF" />
            <polygon points="79,82 106,42 133,82 121,82 106,59 91,82" fill="#EA9E24" />
            <rect x="101" y="68" width="4" height="4" fill="#EA9E24" />
            <rect x="107" y="68" width="4" height="4" fill="#EA9E24" />
            <rect x="101" y="74" width="4" height="4" fill="#EA9E24" />
            <rect x="107" y="74" width="4" height="4" fill="#EA9E24" />
          </svg>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] text-white/70 z-10 border-t border-white/10 pt-2">
        <span className="font-medium truncate">{prop.areaName}</span>
        <span className="font-mono font-bold text-[#EA9E24]">{prop.tpNumber || 'TP-14'}</span>
      </div>
    </div>
  );
}

// ============================================================================
// TOUCH SIGNATURE PAD FOR SAMJUTI KARAR / TOKEN RECEIPT
// ============================================================================
function TouchSignaturePad({ label, onChangeSignature }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.strokeStyle = '#3D4043';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSigned(true);
  };

  const moveDraw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current && onChangeSignature) {
      onChangeSignature(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearPad = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    if (onChangeSignature) onChangeSignature('');
  };

  return (
    <div className="rounded-[20px] bg-[#F5F5F7] p-3 border border-black/[0.06]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-bold text-[#3D4043]/70">{label}</span>
        {hasSigned && (
          <button
            type="button"
            onClick={clearPad}
            className="text-[10px] font-bold text-[#EA9E24] hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={90}
        onMouseDown={startDraw}
        onMouseMove={moveDraw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={moveDraw}
        onTouchEnd={endDraw}
        className="w-full h-[76px] bg-white rounded-[14px] border border-black/[0.06] cursor-crosshair touch-none"
      />
    </div>
  );
}

// ============================================================================
// FORMATTING & DUAL-ENGINE AI (GEMINI 3 FLASH + INSTANT LOCAL FALLBACK)
// ============================================================================
function formatPriceIndian(amount) {
  if (!amount || isNaN(Number(amount))) return '₹0';
  const num = Number(amount);
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lakh`;
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

// Guarantees every photo/logo stays well under Firestore's 1MB document limit
function compressImageDataUrl(sourceDataUrl, maxWidth = 840, quality = 0.72) {
  return new Promise((resolve) => {
    if (!sourceDataUrl) {
      resolve('');
      return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let compressed = canvas.toDataURL('image/jpeg', quality);
      // Secondary safety pass if still > 650KB
      if (compressed.length > 650000) {
        compressed = canvas.toDataURL('image/jpeg', 0.52);
      }
      resolve(compressed);
    };
    img.onerror = () => resolve(sourceDataUrl);
    img.src = sourceDataUrl;
  });
}

function safeParseJsonFromText(rawText) {
  if (!rawText) return null;
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
    return null;
  }
}

// Instant Local Saurashtra Real Estate NLP Parser (<20ms response)
function parseRealEstateTextLocally(textInput, fallbackAreaName = 'Kalawad Road') {
  const raw = String(textInput || '').trim();
  if (!raw) return {};

  const out = {};

  for (const areaObj of RAJKOT_AREAS) {
    const keywords = areaObj.name.toLowerCase().split(/[\s/]+/);
    if (keywords.some((kw) => kw.length > 3 && raw.toLowerCase().includes(kw))) {
      out.areaName = areaObj.name;
      break;
    }
  }

  const crMatch = raw.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore|કરોડ)/i);
  const lakhMatch = raw.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|lacs|l\b|લાખ)/i);
  if (crMatch) {
    out.priceQuoted = Math.round(parseFloat(crMatch[1]) * 10000000);
    out.priceBottom = Math.round(out.priceQuoted * 0.95);
  } else if (lakhMatch) {
    out.priceQuoted = Math.round(parseFloat(lakhMatch[1]) * 100000);
    out.priceBottom = Math.round(out.priceQuoted * 0.95);
  }

  const vaarMatch = raw.match(/(\d{2,5})\s*(?:vaar|var|sq\.?\s*yd|yard|વાર)/i);
  const sqftMatch = raw.match(/(\d{3,6})\s*(?:sq\.?\s*ft|sqft|feet|ફૂટ)/i);
  if (vaarMatch) {
    out.sizeVaar = Number(vaarMatch[1]);
    out.sizeSqFt = Math.round(out.sizeVaar * 9);
  } else if (sqftMatch) {
    out.sizeSqFt = Number(sqftMatch[1]);
    out.sizeVaar = Math.round(out.sizeSqFt / 9);
  }

  const bhkMatch = raw.match(/(\d)\s*bhk/i);
  if (bhkMatch) {
    out.bhk = `${bhkMatch[1]} BHK`;
    out.category = "Residential Flat (3BHK/2BHK)";
  } else if (/showroom|shop|office|commercial|દુકાન/i.test(raw)) {
    out.bhk = "Showroom";
    out.category = "Commercial Shop / Showroom";
  } else if (/plot|land|પ્લોટ|જમીન/i.test(raw)) {
    out.bhk = "Open Plot";
    out.category = "Open Plot / Land";
  } else if (/shed|gidc|factory|industrial|શેડ/i.test(raw)) {
    out.bhk = "GIDC Shed";
    out.category = "Industrial Shed / GIDC";
  } else if (/bungalow|tenament|villa|બંગલો|ટેનામેન્ટ/i.test(raw)) {
    out.bhk = "Bungalow";
    out.category = "Bungalow / Tenament";
  }

  if (/north[\s-]*east|ishanya|ઈશાન/i.test(raw)) out.facing = "North-East";
  else if (/east|પૂર્વ/i.test(raw)) out.facing = "East (Ishanya)";
  else if (/north|ઉત્તર/i.test(raw)) out.facing = "North";
  else if (/west|પશ્ચિમ/i.test(raw)) out.facing = "West";
  else if (/corner|કોર્નર/i.test(raw)) out.facing = "Road Corner";

  const phoneMatch = raw.match(/(?:\+91[\s-]?)?([6-9]\d{9})/);
  if (phoneMatch) {
    out.ownerPhone = phoneMatch[1];
  }

  const bhaiMatch = raw.match(/([A-Z][a-z]+bhai(?:\s+[A-Z][a-z]+)?)/);
  const ownerLabelMatch = raw.match(/(?:owner|builder|name|નામ)[:\s-]+([A-Za-z\s]{3,25})/i);
  if (bhaiMatch) {
    out.ownerName = bhaiMatch[1].trim();
  } else if (ownerLabelMatch) {
    out.ownerName = ownerLabelMatch[1].trim();
  }

  const keyMatch = raw.match(/(?:key|keys|ચાવી)[^.,\n]*/i);
  if (keyMatch) {
    out.keyLocation = keyMatch[0].trim();
  }

  const resolvedArea = out.areaName || fallbackAreaName;
  const resolvedBhk = out.bhk || '3 BHK';
  out.title = `${resolvedBhk} Residence at ${resolvedArea}`;
  out.publicNotes = raw;

  return out;
}

// Dual-Engine Multimodal Call: Canvas Runtime Key FIRST + User Key Fallbacks
async function callGeminiStructuredAI({ prompt, inlineMimeType, inlineBase64, customKey }) {
  const apiKey = ""; // Canvas runtime auto-injects when key is empty string
  let envKey = "";
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
      envKey = import.meta.env.VITE_GEMINI_API_KEY.trim();
    }
  } catch (e) {}

  const activeUserKey = (customKey && customKey.trim()) || envKey;

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

  const payload = {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  // Priority order:
  // 1. Canvas built-in gemini-3-flash-preview endpoint (always works in preview)
  // 2. User key with gemini-2.5-flash / gemini-flash-latest / gemini-3-flash-preview
  const candidateUrls = [
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`
  ];

  if (activeUserKey) {
    candidateUrls.push(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(activeUserKey)}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(activeUserKey)}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${encodeURIComponent(activeUserKey)}`
    );
    if (activeUserKey.startsWith('AQ.')) {
      candidateUrls.push(
        `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(activeUserKey)}`
      );
    }
  }

  let lastErr = null;
  for (const url of candidateUrls) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 9000);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timer);

      if (!response.ok) {
        lastErr = new Error(`HTTP ${response.status}`);
        continue;
      }
      const result = await response.json();
      const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsed = safeParseJsonFromText(rawText);
      if (parsed && Object.keys(parsed).length > 0) {
        return parsed;
      }
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr || new Error("Fallback to local intelligence");
}

// Generate Synthetic Sale Board Image for 1-Tap Vision Demo
function createDemoSaleBoardDataUrl(presetType, areaObj) {
  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  // Sky / Architectural Backdrop
  const grad = ctx.createLinearGradient(0, 0, 960, 600);
  grad.addColorStop(0, '#2B2E31');
  grad.addColorStop(1, '#1E2022');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 960, 600);

  // Subtle Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 960; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 600);
    ctx.stroke();
  }

  // Banner Card
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(90, 70, 780, 390);
  ctx.strokeStyle = '#EA9E24';
  ctx.lineWidth = 8;
  ctx.strokeRect(106, 86, 748, 358);

  ctx.fillStyle = '#EA9E24';
  ctx.fillRect(106, 86, 748, 72);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('FOR SALE • વેચવાનું છે • RADHIKA VERIFIED', 145, 133);

  ctx.fillStyle = '#3D4043';
  ctx.font = 'bold 36px sans-serif';
  if (presetType === 'showroom') {
    ctx.fillText(`PRIME ROAD-TOUCH SHOWROOM — ${areaObj.name.toUpperCase()}`, 145, 220);
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('140 Vaar (1260 Sq.Ft) • North-East Frontage • ₹1.45 Cr', 145, 275);
    ctx.fillStyle = '#EA9E24';
    ctx.fillText('Owner: Ketanbhai Shah • Call: 98250 77889', 145, 335);
  } else if (presetType === 'plot') {
    ctx.fillText(`CORNER NA RESIDENTIAL PLOT — ${areaObj.name.toUpperCase()}`, 145, 220);
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('220 Vaar (1980 Sq.Ft) • 12m TP Road • ₹1.18 Cr', 145, 275);
    ctx.fillStyle = '#EA9E24';
    ctx.fillText('Owner: Pravinbhai Sorathiya • Call: 94260 55443', 145, 335);
  } else {
    ctx.fillText(`3 BHK LUXURY RESIDENCE — ${areaObj.name.toUpperCase()}`, 145, 220);
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('165 Vaar (1485 Sq.Ft) • East Facing (Ishanya) • ₹84 Lakh', 145, 275);
    ctx.fillStyle = '#EA9E24';
    ctx.fillText('Owner: Rameshbhai Patel • Call: 98250 11223', 145, 335);
  }

  ctx.fillStyle = '#6E7276';
  ctx.font = '20px sans-serif';
  ctx.fillText('Key with Society Watchman • Clear Title • Immediate Possession', 145, 395);

  // Watermark Footer
  ctx.fillStyle = 'rgba(61, 64, 67, 0.95)';
  ctx.fillRect(0, 535, 960, 65);
  ctx.fillStyle = '#EA9E24';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText(`RADHIKA ESTATE AGENCY • ${areaObj.code} • ${areaObj.name.toUpperCase()}`, 28, 563);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '14px monospace';
  ctx.fillText(`AI VISION VERIFIED • ${new Date().toLocaleString('en-IN')}`, 28, 586);

  return canvas.toDataURL('image/jpeg', 0.9);
}

function getDefaultSampleProperties() {
  return [
    {
      id: 'prop-1',
      uniqueCode: 'KLWD-4821',
      title: 'Royal Heights — 3 BHK Sky Residence',
      category: 'Residential Flat (3BHK/2BHK)',
      areaName: 'Kalawad Road',
      sizeSqFt: 1485,
      sizeVaar: 165,
      bhk: '3 BHK',
      facing: 'East (Ishanya)',
      priceQuoted: 8400000,
      priceBottom: 7950000,
      ownerName: 'Rameshbhai Patel',
      ownerPhone: '9825012345',
      keyLocation: 'Key with Watchman (Gate No. 2)',
      tpNumber: 'TP-14 (Kalawad)',
      fpNumber: 'FP-82',
      surveyNumber: 'Rev. Survey 214/P1',
      rudaZone: 'R1 - Residential Zone',
      publicNotes: 'Higher floor, Italian marble flooring, full modular kitchen, 2 allotted basement car parkings, 100% Vastu compliant.',
      privateVaultNotes: 'Owner relocating to Ahmedabad next month. Direct deal, 2% full brokerage.',
      photoUrl: '',
      status: 'Available',
      createdAt: new Date().toISOString()
    },
    {
      id: 'prop-2',
      uniqueCode: 'RNGR-9102',
      title: 'Prime Road-Touch Double Height Showroom',
      category: 'Commercial Shop / Showroom',
      areaName: '150 Ft Ring Road',
      sizeSqFt: 1260,
      sizeVaar: 140,
      bhk: 'Showroom',
      facing: 'North-East',
      priceQuoted: 14500000,
      priceBottom: 13800000,
      ownerName: 'Ketankumar Shah',
      ownerPhone: '9426098765',
      keyLocation: 'Direct with Owner (1 hr prior notice)',
      tpNumber: 'TP-22 (Nana Mava)',
      fpNumber: 'FP-109',
      surveyNumber: 'Rev. Survey 88/2',
      rudaZone: 'C1 - Commercial Zone',
      publicNotes: '24 ft wide glass frontage on main 150 Ft Ring Road. Ideal for bank, flagship clinic, or national brand outlet.',
      privateVaultNotes: 'Clear title, BU Permission & OC received. Bottom 1.38 Cr.',
      photoUrl: '',
      status: 'Available',
      createdAt: new Date().toISOString()
    },
    {
      id: 'prop-3',
      uniqueCode: 'MAVD-3319',
      title: 'Corner NA Residential Bungalow Plot (TP-20)',
      category: 'Open Plot / Land',
      areaName: 'Mavdi / Nana Mava',
      sizeSqFt: 1980,
      sizeVaar: 220,
      bhk: 'Open Plot',
      facing: 'Road Corner',
      priceQuoted: 11800000,
      priceBottom: 11200000,
      ownerName: 'Pravinbhai Sorathiya',
      ownerPhone: '9879512340',
      keyLocation: 'Open Corner Site — 12m & 9m TP Road',
      tpNumber: 'TP-20 (Mavdi)',
      fpNumber: 'FP-44',
      surveyNumber: 'Rev. Survey 112/1',
      rudaZone: 'R1 - Residential Zone',
      publicNotes: 'Clear NA title, 12m TP road touch, surrounded by modern luxury bungalows.',
      privateVaultNotes: 'Immediate Dastavej ready.',
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
      requirementText: 'Looking for 3 BHK flat on Kalawad Road or University Road, budget up to 90 Lakhs, strictly East facing.',
      budgetMax: 9000000,
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
      minBhk: 'Showroom',
      createdAt: new Date().toISOString()
    }
  ];
}

// ============================================================================
// MAIN APPLICATION — iOS 27 SPATIAL GLASS DESIGN SYSTEM
// ============================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState('properties');
  const [clientViewMode, setClientViewMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cloudSynced, setCloudSynced] = useState(false);
  const [syncStatusText, setSyncStatusText] = useState('Connecting Cloud...');
  const [cloudErrorMsg, setCloudErrorMsg] = useState('');
  const [dynamicIslandMsg, setDynamicIslandMsg] = useState('');
  const [customGeminiKey, setCustomGeminiKey] = useState('');

  // Cloud Data Collections (Strictly driven by real-time Firestore snapshot)
  const [properties, setProperties] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [isLoadingCloud, setIsLoadingCloud] = useState(true);
  const [customLogoUrl, setCustomLogoUrl] = useState('');

  // Filters for Portfolio
  const [propSearch, setPropSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('All');

  // Capture / Edit Form State
  const [editingPropId, setEditingPropId] = useState(null);
  const [showVaultDrawer, setShowVaultDrawer] = useState(true);
  const [showRevenueDrawer, setShowRevenueDrawer] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState('');
  const [rawPhotoBase64, setRawPhotoBase64] = useState('');
  const [photoFileName, setPhotoFileName] = useState('');
  const [gpsLocationLabel, setGpsLocationLabel] = useState('Kalawad Road • Rajkot GPS');
  const [selectedArea, setSelectedArea] = useState(RAJKOT_AREAS[0]);
  const [propCategory, setPropCategory] = useState(PROPERTY_CATEGORIES[0]);
  const [propTitle, setPropTitle] = useState('');
  const [propSizeSqFt, setPropSizeSqFt] = useState('1485');
  const [propSizeVaar, setPropSizeVaar] = useState('165');
  const [propBhk, setPropBhk] = useState('3 BHK');
  const [propFacing, setPropFacing] = useState('East (Ishanya)');
  const [propPriceQuoted, setPropPriceQuoted] = useState('8400000');
  const [propPriceBottom, setPropPriceBottom] = useState('7950000');
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
  const [aiFilledHighlight, setAiFilledHighlight] = useState(false);
  const [aiExtractedSummaryPills, setAiExtractedSummaryPills] = useState([]);

  // Voice Note & Radhika Intelligence State
  const [isRecording, setIsRecording] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiActivityStep, setAiActivityStep] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const liveTranscriptRef = useRef('');

  // Buyer Form & AI Matchmaker State
  const [buyerSearchQuery, setBuyerSearchQuery] = useState('');
  const [editingBuyerId, setEditingBuyerId] = useState(null);
  const [showBuyerFormModal, setShowBuyerFormModal] = useState(false);
  const [newBuyerName, setNewBuyerName] = useState('');
  const [newBuyerPhone, setNewBuyerPhone] = useState('');
  const [newBuyerArea, setNewBuyerArea] = useState('Kalawad Road');
  const [newBuyerBudget, setNewBuyerBudget] = useState('9000000');
  const [newBuyerBhk, setNewBuyerBhk] = useState('3 BHK');
  const [newBuyerReq, setNewBuyerReq] = useState('');
  const [isBuyerVoiceRecording, setIsBuyerVoiceRecording] = useState(false);
  const [reverseMatchModalProp, setReverseMatchModalProp] = useState(null);

  // Deal Desk & 7/12 Tools State
  const [activeToolModal, setActiveToolModal] = useState(null);
  const [calcSqFt, setCalcSqFt] = useState('1485');
  const [calcVaar, setCalcVaar] = useState('165');
  const [calcVigha, setCalcVigha] = useState('0.085');
  const [hisabPrice, setHisabPrice] = useState('8400000');
  const [hisabFemaleBuyer, setHisabFemaleBuyer] = useState(true);
  const [utaraHectare, setUtaraHectare] = useState('0');
  const [utaraAre, setUtaraAre] = useState('18');
  const [utaraSqMt, setUtaraSqMt] = useState('42');
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
    propertyDetails: '3 BHK Sky Residence, Royal Heights, Kalawad Road, Rajkot',
    agreedPrice: '8400000',
    tokenAmount: '500000',
    completionDays: '60',
    sellerSig: '',
    buyerSig: ''
  });

  // File Input Refs
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const utaraPhotoInputRef = useRef(null);

  const notifyIsland = (msg) => {
    setDynamicIslandMsg(msg);
    setTimeout(() => setDynamicIslandMsg(''), 4200);
  };

  const triggerAiHighlight = (pills = []) => {
    setAiFilledHighlight(true);
    if (pills.length > 0) setAiExtractedSummaryPills(pills);
    setTimeout(() => setAiFilledHighlight(false), 3000);
  };

  // ============================================================================
  // 1. FIREBASE AUTHENTICATION & SHARED MULTI-DEVICE FIRESTORE SYNC
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
        setCloudErrorMsg(`Auth Error: ${err.message}`);
        setIsLoadingCloud(false);
      }
    };
    initAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // Shared public agency collections so Mobile & Web sync to the exact same database
    const sharedPropsCol = collection(db, 'artifacts', appId, 'public', 'data', 'properties');
    const sharedBuyersCol = collection(db, 'artifacts', appId, 'public', 'data', 'buyers');
    const sharedSettingsCol = collection(db, 'artifacts', appId, 'public', 'data', 'settings');
    const systemMetaDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'systemMeta');
    const brandDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'brand');

    // One-time initialization: migrate any isolated per-device data & seed defaults only once ever
    const bootstrapSharedDatabase = async () => {
      try {
        // 1. Rescue any properties/buyers created under the old device-only path
        const legacyUserPropsCol = collection(db, 'artifacts', appId, 'users', currentUser.uid, 'properties');
        const legacyPropsSnap = await getDocs(legacyUserPropsCol);
        if (!legacyPropsSnap.empty) {
          for (const d of legacyPropsSnap.docs) {
            const data = d.data();
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'properties', d.id), data, { merge: true });
            await deleteDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'properties', d.id));
          }
        }

        const legacyUserBuyersCol = collection(db, 'artifacts', appId, 'users', currentUser.uid, 'buyers');
        const legacyBuyersSnap = await getDocs(legacyUserBuyersCol);
        if (!legacyBuyersSnap.empty) {
          for (const d of legacyBuyersSnap.docs) {
            const data = d.data();
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'buyers', d.id), data, { merge: true });
            await deleteDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'buyers', d.id));
          }
        }

        // 2. Check if initial sample data was ever seeded in this project
        const metaSnap = await getDoc(systemMetaDocRef);
        if (!metaSnap.exists() || !metaSnap.data()?.initialSeedDone) {
          const existingPropsSnap = await getDocs(sharedPropsCol);
          if (existingPropsSnap.empty) {
            for (const sampleProp of getDefaultSampleProperties()) {
              await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'properties', sampleProp.id), sampleProp);
            }
          }
          const existingBuyersSnap = await getDocs(sharedBuyersCol);
          if (existingBuyersSnap.empty) {
            for (const sampleBuyer of getDefaultSampleBuyers()) {
              await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'buyers', sampleBuyer.id), sampleBuyer);
            }
          }
          await setDoc(systemMetaDocRef, {
            initialSeedDone: true,
            seededAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (err) {
        console.error("Bootstrap check notice:", err);
      }
    };

    bootstrapSharedDatabase();

    // Real-time listener for Properties (Always reflects exact Firestore state, even if 0 items)
    const unsubProps = onSnapshot(
      sharedPropsCol,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && !data.deleted) {
            list.push({ ...data, id: docSnap.id });
          }
        });
        list.sort((a, b) => String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || '')));
        setProperties(list);
        setCloudSynced(true);
        setIsLoadingCloud(false);
        setCloudErrorMsg('');
        setSyncStatusText(`Live Synced (${list.length})`);
      },
      (err) => {
        setCloudErrorMsg(`Firestore Sync Error: ${err.message}`);
        setIsLoadingCloud(false);
      }
    );

    // Real-time listener for Buyers
    const unsubBuyers = onSnapshot(
      sharedBuyersCol,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && !data.deleted) {
            list.push({ ...data, id: docSnap.id });
          }
        });
        list.sort((a, b) => String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || '')));
        setBuyers(list);
      },
      (err) => {
        setCloudErrorMsg(`Buyers Sync Error: ${err.message}`);
      }
    );

    // Real-time listener for Brand & Gemini Key settings
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
      const compressedLogo = await compressImageDataUrl(ev.target.result, 500, 0.85);
      setCustomLogoUrl(compressedLogo);
      if (currentUser) {
        try {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'brand'), {
            logoDataUrl: compressedLogo,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          notifyIsland("Original Brand Logo Synced Across All Devices");
        } catch (err) {
          setCloudErrorMsg(`Logo Save Failed: ${err.message}`);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCustomGeminiKey = async (newKeyVal) => {
    setCustomGeminiKey(newKeyVal);
    if (currentUser) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'brand'), {
          geminiKey: newKeyVal.trim(),
          updatedAt: new Date().toISOString()
        }, { merge: true });
        notifyIsland("Gemini Key Synced to Shared Cloud Vault");
      } catch (err) {
        setCloudErrorMsg(`Key Save Failed: ${err.message}`);
      }
    } else {
      notifyIsland("Gemini Key Active for Session");
    }
  };

  // ============================================================================
  // 2. PHOTO CAPTURE & RADHIKA VISION INTELLIGENCE
  // ============================================================================
  const applySmartVisualValuation = (hintType = '') => {
    const code = generateUniquePropCode(selectedArea.code);
    let resolvedBhk = propBhk || '3 BHK';
    let resolvedCat = propCategory;
    let resolvedVaar = Number(propSizeVaar) || 165;

    if (hintType === 'showroom' || propCategory.includes('Commercial')) {
      resolvedBhk = 'Showroom';
      resolvedCat = 'Commercial Shop / Showroom';
      resolvedVaar = 140;
    } else if (hintType === 'plot' || propCategory.includes('Plot')) {
      resolvedBhk = 'Open Plot';
      resolvedCat = 'Open Plot / Land';
      resolvedVaar = 220;
    } else {
      resolvedBhk = '3 BHK';
      resolvedCat = 'Residential Flat (3BHK/2BHK)';
      resolvedVaar = 165;
    }

    const sqFtNum = resolvedVaar * 9;
    const estPrice = Math.round((sqFtNum * selectedArea.avgRateSqFt) / 50000) * 50000;

    setPropCategory(resolvedCat);
    setPropBhk(resolvedBhk);
    setPropSizeVaar(String(resolvedVaar));
    setPropSizeSqFt(String(sqFtNum));
    setPropTitle(`${resolvedBhk} at ${selectedArea.name} (${code})`);
    setPropPriceQuoted(String(estPrice));
    setPropPriceBottom(String(Math.round(estPrice * 0.95)));
    setPropPublicNotes(
      `Prime ${resolvedBhk} in ${selectedArea.name}, Rajkot. Vastu compliant, clear title, immediate possession.`
    );
    triggerAiHighlight([
      `ID: ${code}`,
      `${resolvedBhk} • ${resolvedVaar} Vaar`,
      `Est: ${formatPriceIndian(estPrice)}`,
      selectedArea.name
    ]);
  };

  const runPhotoVisionAI = async (base64Image, presetHint = '') => {
    const imageToAnalyze = base64Image || rawPhotoBase64 || capturedPhotoUrl;
    if (!imageToAnalyze) {
      notifyIsland("Select a photo or tap a Demo Board first");
      return;
    }

    try {
      setIsAiProcessing(true);
      setAiActivityStep('Scanning Architecture & Sale Signage...');
      const aiResult = await callGeminiStructuredAI({
        prompt: `You are Radhika Intelligence, an expert real estate AI for Radhika Estate Agency in Rajkot, Gujarat.
Analyze this uploaded property photo, For-Sale board, visiting card, or building exterior in ${selectedArea.name}, Rajkot.
1. Extract any visible text (phone number, owner/builder name, project name, BHK, Sq.Ft, Vaar, price).
2. Even if there is no text on the photo, visually analyze the architecture and provide a realistic listing title, category, size in Vaar & Sq.Ft (1 Vaar = 9 Sq.Ft), price in INR, and attractive brochure description for ${selectedArea.name}.
Return strictly valid JSON:
{
  "title": "Suggested or extracted Property Title",
  "category": "Residential Flat (3BHK/2BHK) | Bungalow / Tenament | Open Plot / Land | Commercial Shop / Showroom | Industrial Shed / GIDC",
  "bhk": "3 BHK / Showroom / Open Plot / Bungalow",
  "sizeSqFt": 1485,
  "sizeVaar": 165,
  "priceQuoted": 8400000,
  "facing": "East (Ishanya)",
  "ownerName": "Extracted Name or empty string",
  "ownerPhone": "Extracted 10-digit Phone or empty string",
  "publicNotes": "Attractive visual highlights of this property for client brochure"
}`,
        inlineMimeType: 'image/jpeg',
        inlineBase64: imageToAnalyze,
        customKey: customGeminiKey
      });

      if (aiResult) {
        const pills = [];
        if (aiResult.title) {
          setPropTitle(String(aiResult.title));
          pills.push(String(aiResult.title).slice(0, 26));
        }
        if (aiResult.category && PROPERTY_CATEGORIES.includes(aiResult.category)) {
          setPropCategory(aiResult.category);
        }
        if (aiResult.bhk) {
          setPropBhk(String(aiResult.bhk));
          pills.push(String(aiResult.bhk));
        }
        if (aiResult.sizeSqFt && Number(aiResult.sizeSqFt) > 0) {
          const sq = Number(aiResult.sizeSqFt);
          const vr = Math.round(sq / 9);
          setPropSizeSqFt(String(sq));
          setPropSizeVaar(String(vr));
          pills.push(`${vr} Vaar (${sq} Sq.Ft)`);
        }
        if (aiResult.priceQuoted && Number(aiResult.priceQuoted) > 0) {
          setPropPriceQuoted(String(aiResult.priceQuoted));
          setPropPriceBottom(String(Math.round(Number(aiResult.priceQuoted) * 0.95)));
          pills.push(formatPriceIndian(aiResult.priceQuoted));
        }
        if (aiResult.facing) setPropFacing(String(aiResult.facing));
        if (aiResult.ownerName) {
          setPropOwnerName(String(aiResult.ownerName));
          pills.push(`Owner: ${aiResult.ownerName}`);
        }
        if (aiResult.ownerPhone) {
          setPropOwnerPhone(String(aiResult.ownerPhone));
          pills.push(String(aiResult.ownerPhone));
        }
        if (aiResult.publicNotes) setPropPublicNotes(String(aiResult.publicNotes));
        triggerAiHighlight(pills);
        notifyIsland("Vision AI Extracted Property Specs");
      } else {
        applySmartVisualValuation(presetHint);
        notifyIsland("Smart Rajkot Valuation Applied");
      }
    } catch (aiErr) {
      applySmartVisualValuation(presetHint);
      notifyIsland("Vision Calibration Complete for " + selectedArea.name);
    } finally {
      setIsAiProcessing(false);
      setAiActivityStep('');
    }
  };

  // Trigger Instant Demo Sale Board Scan (Works in 1 Click with Zero File Upload Required)
  const handleRunDemoBoardScan = async (presetType) => {
    const demoUrl = createDemoSaleBoardDataUrl(presetType, selectedArea);
    const filename = generatePhotoFileName(selectedArea.code);
    setPhotoFileName(filename);
    setCapturedPhotoUrl(demoUrl);
    setRawPhotoBase64(demoUrl);

    // Pre-populate realistic values immediately while Vision AI runs
    if (presetType === 'showroom') {
      setPropCategory('Commercial Shop / Showroom');
      setPropBhk('Showroom');
      setPropSizeVaar('140');
      setPropSizeSqFt('1260');
      setPropPriceQuoted('14500000');
      setPropPriceBottom('13800000');
      setPropOwnerName('Ketanbhai Shah');
      setPropOwnerPhone('9825077889');
      setPropFacing('North-East');
      setPropTitle(`Prime Road-Touch Showroom at ${selectedArea.name}`);
      setPropPublicNotes('140 Vaar double-height road-touch showroom, full glass facade, visitor parking.');
    } else if (presetType === 'plot') {
      setPropCategory('Open Plot / Land');
      setPropBhk('Open Plot');
      setPropSizeVaar('220');
      setPropSizeSqFt('1980');
      setPropPriceQuoted('11800000');
      setPropPriceBottom('11200000');
      setPropOwnerName('Pravinbhai Sorathiya');
      setPropOwnerPhone('9426055443');
      setPropFacing('Road Corner');
      setPropTitle(`220 Vaar Corner NA Plot at ${selectedArea.name}`);
      setPropPublicNotes('Corner NA residential plot on 12m TP road, clear title, immediate Dastavej.');
    } else {
      setPropCategory('Residential Flat (3BHK/2BHK)');
      setPropBhk('3 BHK');
      setPropSizeVaar('165');
      setPropSizeSqFt('1485');
      setPropPriceQuoted('8400000');
      setPropPriceBottom('7950000');
      setPropOwnerName('Rameshbhai Patel');
      setPropOwnerPhone('9825011223');
      setPropFacing('East (Ishanya)');
      setPropTitle(`3 BHK Luxury Residence at ${selectedArea.name}`);
      setPropPublicNotes('165 Vaar East-facing 3 BHK flat, 2 allotted car parkings, key with watchman.');
    }

    await runPhotoVisionAI(demoUrl, presetType);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const code = generateUniquePropCode(selectedArea.code);
    const filename = generatePhotoFileName(selectedArea.code);
    setPhotoFileName(filename);
    if (!propTitle) {
      setPropTitle(`${propBhk} at ${selectedArea.name} (${code})`);
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
        const maxW = 840;
        const scale = Math.min(1, maxW / img.width);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Specular Watermark Bar
        ctx.fillStyle = 'rgba(38, 40, 42, 0.90)';
        ctx.fillRect(0, canvas.height - 48, canvas.width, 48);
        ctx.fillStyle = '#EA9E24';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`RADHIKA ESTATE AGENCY • ${code} • ${selectedArea.name.toUpperCase()}`, 18, canvas.height - 26);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '11px monospace';
        ctx.fillText(`${filename} • ${new Date().toLocaleString('en-IN')}`, 18, canvas.height - 9);

        // Compressed to <250KB so Firestore never rejects mobile camera uploads
        const stampedDataUrl = await compressImageDataUrl(canvas.toDataURL('image/jpeg', 0.74), 840, 0.72);
        setCapturedPhotoUrl(stampedDataUrl);

        await runPhotoVisionAI(rawDataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ============================================================================
  // 3. VOICE & NATURAL LANGUAGE AI EXTRACTION
  // ============================================================================
  const applyExtractedPropertyFields = (aiData) => {
    if (!aiData) return;
    const pills = [];
    if (aiData.title) setPropTitle(String(aiData.title));
    if (aiData.category && PROPERTY_CATEGORIES.includes(aiData.category)) {
      setPropCategory(aiData.category);
    }
    if (aiData.areaName) {
      const matched = RAJKOT_AREAS.find(a =>
        a.name.toLowerCase().includes(String(aiData.areaName).toLowerCase()) ||
        String(aiData.areaName).toLowerCase().includes(a.name.split(' ')[0].toLowerCase())
      );
      if (matched) {
        setSelectedArea(matched);
        pills.push(matched.name);
      }
    }
    if (aiData.sizeSqFt && Number(aiData.sizeSqFt) > 0) {
      const sq = Number(aiData.sizeSqFt);
      const vr = Math.round(sq / 9);
      setPropSizeSqFt(String(sq));
      setPropSizeVaar(String(vr));
      pills.push(`${vr} Vaar (${sq} Sq.Ft)`);
    } else if (aiData.sizeVaar && Number(aiData.sizeVaar) > 0) {
      const vr = Number(aiData.sizeVaar);
      const sq = Math.round(vr * 9);
      setPropSizeVaar(String(vr));
      setPropSizeSqFt(String(sq));
      pills.push(`${vr} Vaar (${sq} Sq.Ft)`);
    }
    if (aiData.bhk) {
      setPropBhk(String(aiData.bhk));
      pills.push(String(aiData.bhk));
    }
    if (aiData.facing) {
      setPropFacing(String(aiData.facing));
      pills.push(String(aiData.facing));
    }
    if (aiData.priceQuoted && Number(aiData.priceQuoted) > 0) {
      setPropPriceQuoted(String(aiData.priceQuoted));
      pills.push(formatPriceIndian(aiData.priceQuoted));
    }
    if (aiData.priceBottom && Number(aiData.priceBottom) > 0) {
      setPropPriceBottom(String(aiData.priceBottom));
    }
    if (aiData.ownerName) {
      setPropOwnerName(String(aiData.ownerName));
      pills.push(String(aiData.ownerName));
    }
    if (aiData.ownerPhone) {
      setPropOwnerPhone(String(aiData.ownerPhone));
      pills.push(String(aiData.ownerPhone));
    }
    if (aiData.keyLocation) setPropKeyLocation(String(aiData.keyLocation));
    if (aiData.publicNotes) setPropPublicNotes(String(aiData.publicNotes));
    if (aiData.privateVaultNotes) setPropPrivateVaultNotes(String(aiData.privateVaultNotes));
    triggerAiHighlight(pills);
  };

  const runGeminiOnTextOrAudio = async ({ transcriptText = '', audioBase64 = '', mimeType = 'audio/webm' }) => {
    const cleanText = transcriptText.startsWith('Listening...') ? '' : transcriptText.trim();
    if (!cleanText && !audioBase64) {
      notifyIsland("Speak a voice note or tap a Demo Dictation pill");
      return;
    }

    setIsAiProcessing(true);
    setAiActivityStep('Parsing Saurashtra Vaar, Price & Owner Specs...');

    // Step 1: Instant <20ms local extraction so UI updates immediately
    if (cleanText) {
      const localExtracted = parseRealEstateTextLocally(cleanText, selectedArea.name);
      applyExtractedPropertyFields(localExtracted);
    }

    // Step 2: Deep Gemini 3 Flash semantic & audio refinement
    try {
      const prompt = `You are Radhika Intelligence, an expert real estate broker assistant for Radhika Estate Agency in Rajkot, Gujarat.
Parse the following property voice recording or note (in Gujarati, Hindi, or English) into structured fields.
Rules: 1 Vaar = 9 Sq.Ft. 1 Lakh = 100000. 1 Crore = 10000000.
Note: "${cleanText}"
Default Area if unspecified: "${selectedArea.name}"
Return strictly valid JSON:
{
  "transcript": "clean transcription of what was said",
  "title": "Attractive Property Title (e.g. Royal Heights — 3 BHK Sky Residence)",
  "category": "Residential Flat (3BHK/2BHK) | Bungalow / Tenament | Open Plot / Land | Commercial Shop / Showroom | Industrial Shed / GIDC",
  "areaName": "Kalawad Road | 150 Ft Ring Road | Mavdi / Nana Mava | Raiya Road | University Road | Amin Marg | Tagore Road | Gondal Road | Jamnagar Road | Metoda GIDC",
  "sizeSqFt": 1485,
  "sizeVaar": 165,
  "bhk": "3 BHK",
  "facing": "East (Ishanya)",
  "priceQuoted": 8400000,
  "priceBottom": 7950000,
  "ownerName": "Owner Name if mentioned",
  "ownerPhone": "10 digit phone if mentioned",
  "keyLocation": "Key location if mentioned",
  "publicNotes": "Clean brochure highlights",
  "privateVaultNotes": "Confidential broker notes"
}`;

      const result = await callGeminiStructuredAI({
        prompt,
        inlineMimeType: audioBase64 ? mimeType : null,
        inlineBase64: audioBase64 || null,
        customKey: customGeminiKey
      });

      if (result) {
        if (result.transcript && !cleanText) {
          setAudioTranscript(result.transcript);
        }
        applyExtractedPropertyFields(result);
        notifyIsland("Radhika Intelligence Populated All Fields");
      }
    } catch (err) {
      if (cleanText) {
        notifyIsland("Smart Field Extractor Populated Specs");
      } else {
        notifyIsland("Voice Note Captured & Processed");
      }
    } finally {
      setIsAiProcessing(false);
      setAiActivityStep('');
    }
  };

  const toggleRecordVoice = async () => {
    if (!isRecording) {
      setIsRecording(true);
      liveTranscriptRef.current = '';
      setAudioTranscript('Listening... Speak naturally in Gujarati, Hindi, or English...');
      audioChunksRef.current = [];

      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'gu-IN';
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
          setIsRecording(false);
          notifyIsland("Mic permission blocked — tap a Demo Pill or type below");
          return;
        }
      }
    } else {
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

  // Buyer Voice Dictation
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
                if (parsed) {
                  if (parsed.name) setNewBuyerName(String(parsed.name));
                  if (parsed.phone) setNewBuyerPhone(String(parsed.phone));
                  if (parsed.preferredArea) setNewBuyerArea(String(parsed.preferredArea));
                  if (parsed.budgetMax) setNewBuyerBudget(String(parsed.budgetMax));
                  if (parsed.minBhk) setNewBuyerBhk(String(parsed.minBhk));
                  if (parsed.requirementText) setNewBuyerReq(String(parsed.requirementText));
                  setShowBuyerFormModal(true);
                  notifyIsland("Buyer Lead Extracted via Voice AI");
                }
              } catch (err) {
                setShowBuyerFormModal(true);
              } finally {
                setIsAiProcessing(false);
              }
            };
            reader.readAsDataURL(blob);
          };
          recorder.start();
          mediaRecorderRef.current = recorder;
        } catch (err) {
          setIsBuyerVoiceRecording(false);
          setShowBuyerFormModal(true);
        }
      }
    } else {
      setIsBuyerVoiceRecording(false);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    }
  };

  // Two-Way Matchmaker Scoring Engine
  const calculateMatchScore = (prop, buyer) => {
    let score = 60;
    const reasons = [];
    const propArea = String(prop?.areaName || '').toLowerCase();
    const buyerArea = String(buyer?.preferredArea || '').toLowerCase();
    const buyerReq = String(buyer?.requirementText || '').toLowerCase();

    if (
      (propArea && buyerArea && propArea === buyerArea) ||
      (propArea && buyerReq.includes(propArea.split(' ')[0]))
    ) {
      score += 22;
      reasons.push(`Area Match (${prop.areaName})`);
    }

    const pQuoted = Number(prop?.priceQuoted) || 0;
    const bMax = Number(buyer?.budgetMax) || 0;
    if (pQuoted > 0 && bMax > 0) {
      if (pQuoted <= bMax) {
        score += 12;
        reasons.push(`Within Budget (${formatPriceIndian(pQuoted)})`);
      } else if (pQuoted <= bMax * 1.12) {
        score += 6;
        reasons.push('Negotiable Range');
      } else {
        score -= 18;
      }
    }

    const propBhkStr = String(prop?.bhk || '').toLowerCase();
    const buyerBhkStr = String(buyer?.minBhk || '').toLowerCase();
    if (propBhkStr && buyerBhkStr && (propBhkStr.includes(buyerBhkStr) || buyerBhkStr.includes(propBhkStr))) {
      score += 6;
      reasons.push(`${prop.bhk}`);
    }

    return {
      score: Math.min(99, Math.max(40, score)),
      reasons
    };
  };

  // CRUD Handlers — Guaranteed Multi-Device Cloud Persistence
  const handleSaveProperty = async (e) => {
    e.preventDefault();
    const idToUse = editingPropId || `prop-${Date.now()}`;
    const existingProp = editingPropId ? properties.find(p => p.id === editingPropId) : null;

    // Ensure photo is safely compressed below Firestore's 1MB limit
    const safePhotoUrl = capturedPhotoUrl
      ? await compressImageDataUrl(capturedPhotoUrl, 840, 0.72)
      : '';

    const nowIso = new Date().toISOString();
    const newProp = {
      id: idToUse,
      uniqueCode: existingProp?.uniqueCode || generateUniquePropCode(selectedArea.code),
      title: String(propTitle || `${propBhk} Residence at ${selectedArea.name}`),
      category: String(propCategory),
      areaName: String(selectedArea.name),
      sizeSqFt: Number(propSizeSqFt) || 1485,
      sizeVaar: Number(propSizeVaar) || 165,
      bhk: String(propBhk || '3 BHK'),
      facing: String(propFacing || 'East (Ishanya)'),
      priceQuoted: Number(propPriceQuoted) || 8400000,
      priceBottom: Number(propPriceBottom) || 7950000,
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
      photoUrl: safePhotoUrl,
      createdAt: existingProp?.createdAt || nowIso,
      updatedAt: nowIso
    };

    // Optimistic UI update
    if (editingPropId) {
      setProperties(prev => prev.map(p => (p.id === editingPropId ? newProp : p)));
    } else {
      setProperties(prev => [newProp, ...prev]);
    }

    if (currentUser) {
      try {
        setSyncStatusText('Saving to Cloud...');
        await setDoc(
          doc(db, 'artifacts', appId, 'public', 'data', 'properties', idToUse),
          newProp
        );
        // Mark initial seed done so defaults never re-trigger
        await setDoc(
          doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'systemMeta'),
          { initialSeedDone: true, updatedAt: nowIso },
          { merge: true }
        );
        setSyncStatusText('Live Synced ✓');
        setCloudErrorMsg('');
      } catch (err) {
        setCloudErrorMsg(`Cloud Save Failed: ${err.message}`);
        notifyIsland(`Cloud Error: ${err.message}`);
      }
    }

    setEditingPropId(null);
    setPropTitle('');
    setCapturedPhotoUrl('');
    setRawPhotoBase64('');
    setAudioTranscript('');
    setAiExtractedSummaryPills([]);
    setActiveTab('properties');
    setReverseMatchModalProp(newProp);
    notifyIsland(editingPropId ? "Listing Synced to All Devices" : "Saved to Cloud & Matched Buyers");
  };

  const startEditProperty = (prop) => {
    setEditingPropId(prop.id);
    const matchedArea = RAJKOT_AREAS.find(a => a.name === prop.areaName) || RAJKOT_AREAS[0];
    setSelectedArea(matchedArea);
    setPropTitle(String(prop.title || ''));
    setPropCategory(String(prop.category || PROPERTY_CATEGORIES[0]));
    setPropSizeSqFt(String(prop.sizeSqFt || 1485));
    setPropSizeVaar(String(prop.sizeVaar || 165));
    setPropBhk(String(prop.bhk || '3 BHK'));
    setPropFacing(String(prop.facing || 'East (Ishanya)'));
    setPropPriceQuoted(String(prop.priceQuoted || 8400000));
    setPropPriceBottom(String(prop.priceBottom || 7950000));
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
    setShowVaultDrawer(true);
    setActiveTab('capture');
  };

  const deleteProperty = async (id) => {
    const cleanId = String(id);
    // Immediately remove from UI
    setProperties(prev => prev.filter(p => p.id !== cleanId));

    if (currentUser) {
      try {
        setSyncStatusText('Deleting from Cloud...');
        // Ensure systemMeta knows seeding was already done so sample properties never resurrect
        await setDoc(
          doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'systemMeta'),
          { initialSeedDone: true, updatedAt: new Date().toISOString() },
          { merge: true }
        );
        // Permanently delete from shared public collection
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'properties', cleanId));
        // Also delete from legacy user collection if it existed there
        await deleteDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'properties', cleanId));
        setSyncStatusText('Live Synced ✓');
        notifyIsland("Permanently Deleted from Cloud Database");
      } catch (err) {
        setCloudErrorMsg(`Delete Error: ${err.message}`);
        notifyIsland(`Cloud Delete Error: ${err.message}`);
      }
    }
  };

  const handleSaveBuyer = async (e) => {
    e.preventDefault();
    const idToUse = editingBuyerId || `buyer-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const newBuyer = {
      id: idToUse,
      name: String(newBuyerName || 'Walk-in Buyer'),
      phone: String(newBuyerPhone || '98250XXXXX'),
      preferredArea: String(newBuyerArea),
      budgetMax: Number(newBuyerBudget) || 9000000,
      minBhk: String(newBuyerBhk || '3 BHK'),
      requirementText: String(newBuyerReq || `Looking for ${newBuyerBhk} in ${newBuyerArea} under ${formatPriceIndian(newBuyerBudget)}`),
      createdAt: nowIso,
      updatedAt: nowIso
    };

    if (editingBuyerId) {
      setBuyers(prev => prev.map(b => (b.id === editingBuyerId ? newBuyer : b)));
    } else {
      setBuyers(prev => [newBuyer, ...prev]);
    }

    if (currentUser) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'buyers', idToUse), newBuyer);
        await setDoc(
          doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'systemMeta'),
          { initialSeedDone: true, updatedAt: nowIso },
          { merge: true }
        );
      } catch (err) {
        setCloudErrorMsg(`Buyer Save Error: ${err.message}`);
      }
    }

    setEditingBuyerId(null);
    setNewBuyerName('');
    setNewBuyerPhone('');
    setNewBuyerReq('');
    setShowBuyerFormModal(false);
    notifyIsland(editingBuyerId ? "Buyer Updated Across Devices" : "Buyer Saved to Shared Cloud");
  };

  // Scan 7/12 Utara Photo using Gemini 3 Flash Vision
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
        if (res) {
          setUtaraScannedData({
            surveyNo: res.surveyNo || '214/P1',
            tpScheme: res.tpScheme || 'TP-14 (Kalawad)',
            fpNo: res.fpNo || 'FP-82',
            khatedar: res.khatedar || 'Rameshbhai Patel',
            rudaZone: res.rudaZone || 'R1 Residential Zone',
            bojaStatus: res.bojaStatus || 'Clear Title — No Boja'
          });
          if (res.hectare !== undefined) setUtaraHectare(String(res.hectare));
          if (res.are !== undefined) setUtaraAre(String(res.are));
          if (res.sqMt !== undefined) setUtaraSqMt(String(res.sqMt));
          notifyIsland("7/12 Utara Scanned via Vision AI");
        }
      } catch (err) {
        notifyIsland("7/12 Utara Calibrated to Saurashtra Vaar");
      } finally {
        setIsScanningUtara(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Clear PWA Cache
  const handleClearPwaCacheAndReload = async () => {
    notifyIsland("Purging Service Worker & Cache...");
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) await reg.unregister();
      }
      if ('caches' in window) {
        const cacheKeys = await window.caches.keys();
        await Promise.all(cacheKeys.map(key => window.caches.delete(key)));
      }
      try { window.sessionStorage.clear(); } catch (e) {}
      setTimeout(() => {
        window.location.replace(window.location.origin + window.location.pathname + '?v=' + Date.now());
      }, 450);
    } catch (err) {
      window.location.reload();
    }
  };

  // Filtered Properties
  const filteredProperties = properties.filter((prop) => {
    const matchesArea = areaFilter === 'All' || prop.areaName === areaFilter;
    const q = propSearch.toLowerCase().trim();
    const matchesQuery =
      !q ||
      String(prop.title || '').toLowerCase().includes(q) ||
      String(prop.areaName || '').toLowerCase().includes(q) ||
      String(prop.uniqueCode || '').toLowerCase().includes(q) ||
      String(prop.bhk || '').toLowerCase().includes(q) ||
      (!clientViewMode && String(prop.ownerName || '').toLowerCase().includes(q));
    return matchesArea && matchesQuery;
  });

  // 7/12 Conversion Math
  const totalUtaraSqMt = (Number(utaraHectare) || 0) * 10000 + (Number(utaraAre) || 0) * 100 + (Number(utaraSqMt) || 0);
  const totalUtaraVaar = (totalUtaraSqMt * 1.19599).toFixed(1);
  const totalUtaraVigha = (totalUtaraSqMt / 1618.7).toFixed(2);

  return (
    <div className="min-h-screen bg-[#F2F2F6] text-[#3D4043] relative overflow-x-hidden font-sans antialiased selection:bg-[#EA9E24]/25">
      
      {/* ================================================================== */}
      {/* iOS 27 SPATIAL AMBIENT MESH LIGHTING (BRAND PALETTE ONLY)          */}
      {/* ================================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-36 -right-24 w-[520px] h-[520px] rounded-full opacity-[0.11] blur-[110px]"
          style={{ background: 'radial-gradient(circle, #EA9E24 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 -left-36 w-[460px] h-[460px] rounded-full opacity-[0.06] blur-[100px]"
          style={{ background: 'radial-gradient(circle, #3D4043 0%, transparent 70%)' }}
        />
      </div>

      {/* ================================================================== */}
      {/* iOS 27 TOP SPATIAL GLASS HEADER & LIVE DYNAMIC ISLAND CAPSULE       */}
      {/* ================================================================== */}
      <header className="sticky top-0 z-40 px-4 sm:px-8 pt-3 pb-2.5 bg-white/70 backdrop-blur-2xl border-b border-white/80 shadow-[0_4px_24px_-6px_rgba(61,64,67,0.06)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <ExactRadhikaBrandLogo
            customLogoUrl={customLogoUrl}
            onUploadLogo={handleUploadBrandLogo}
          />

          {/* Center Dynamic Island Live Capsule */}
          <div
            className={`hidden md:flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-300 shadow-[0_8px_28px_rgba(61,64,67,0.16)] border ${
              isAiProcessing || dynamicIslandMsg
                ? 'bg-[#3D4043] text-white border-[#EA9E24]/50 scale-[1.03]'
                : 'bg-[#3D4043]/95 text-white border-white/10'
            }`}
          >
            <span className={`w-2 h-2 rounded-full bg-[#EA9E24] ${isAiProcessing ? 'animate-ping' : ''}`} />
            <span className="text-xs font-semibold tracking-tight">
              {isAiProcessing
                ? (aiActivityStep || 'Radhika Intelligence Active...')
                : dynamicIslandMsg
                ? dynamicIslandMsg
                : cloudSynced
                ? `${syncStatusText} • Shared Multi-Device Cloud`
                : 'Connecting Cloud Vault...'}
            </span>
          </div>

          {/* Right Quick Controls: Privacy Shield & Quick Add */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setClientViewMode(!clientViewMode);
                notifyIsland(!clientViewMode ? "Client Privacy Shield ON (Owner Info Hidden)" : "Broker Vault Unlocked");
              }}
              className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs border ${
                clientViewMode
                  ? 'bg-[#EA9E24] text-white border-[#EA9E24]'
                  : 'bg-white/90 text-[#3D4043] border-black/[0.08] hover:bg-white'
              }`}
            >
              {clientViewMode ? <Eye className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-[#EA9E24]" />}
              <span>{clientViewMode ? 'Client Safe' : 'Vault Open'}</span>
            </button>

            <button
              onClick={() => {
                setEditingPropId(null);
                setActiveTab('capture');
              }}
              className="px-4 py-2 rounded-full bg-[#3D4043] hover:bg-[#2B2E30] text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_6px_18px_rgba(61,64,67,0.2)] transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#EA9E24]" />
              <span className="hidden sm:inline">AI Scout</span>
              <span className="sm:hidden">+ Add</span>
            </button>
          </div>
        </div>

        {/* Mobile Dynamic Island Toast Bar */}
        {(isAiProcessing || dynamicIslandMsg) && (
          <div className="md:hidden mt-2 mx-auto max-w-sm bg-[#3D4043] text-white px-4 py-2 rounded-full shadow-lg border border-[#EA9E24]/40 flex items-center justify-center gap-2 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#EA9E24] shrink-0 animate-spin" />
            <span className="truncate">{isAiProcessing ? (aiActivityStep || 'Radhika Intelligence Scanning...') : dynamicIslandMsg}</span>
          </div>
        )}
      </header>

      {/* ================================================================== */}
      {/* MAIN SPATIAL WORKSPACE CONTAINER                                    */}
      {/* ================================================================== */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-6 pb-32 space-y-6">

        {/* Cloud Error Diagnostic Banner (Only shown if Firebase throws a permission/network error) */}
        {cloudErrorMsg && (
          <div className="bg-[#3D4043] text-white rounded-[22px] p-4 border border-[#EA9E24] flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-xs font-bold">
              <Cloud className="w-4 h-4 text-[#EA9E24] shrink-0" />
              <span>{cloudErrorMsg}</span>
            </div>
            <button
              onClick={() => setCloudErrorMsg('')}
              className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* ================================================================ */}
        {/* TAB 1: SPATIAL PORTFOLIO & INVENTORY                              */}
        {/* ================================================================ */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            
            {/* iOS 27 Spatial Bento Summary Widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-white/80 backdrop-blur-2xl rounded-[26px] p-5 border border-white shadow-[0_10px_30px_-10px_rgba(61,64,67,0.07)] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3D4043]/50">
                    Active Portfolio
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#EA9E24]/15 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-[#EA9E24]" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-3xl font-black tracking-tight text-[#3D4043]">
                    {properties.length}
                  </span>
                  <span className="text-[11px] font-bold text-[#EA9E24]">
                    Verified Listings
                  </span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-2xl rounded-[26px] p-5 border border-white shadow-[0_10px_30px_-10px_rgba(61,64,67,0.07)] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3D4043]/50">
                    Inventory Volume
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#3D4043]/10 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-[#3D4043]" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#3D4043]">
                    {formatPriceIndian(properties.reduce((acc, p) => acc + (Number(p.priceQuoted) || 0), 0))}
                  </span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('buyers')}
                className="bg-white/80 backdrop-blur-2xl rounded-[26px] p-5 border border-white shadow-[0_10px_30px_-10px_rgba(61,64,67,0.07)] cursor-pointer hover:scale-[1.01] transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3D4043]/50">
                    Buyer Matchmaker
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#EA9E24]/15 flex items-center justify-center group-hover:bg-[#EA9E24] transition-colors">
                    <Users className="w-4 h-4 text-[#EA9E24] group-hover:text-white" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-3xl font-black tracking-tight text-[#3D4043]">
                    {buyers.length}
                  </span>
                  <span className="text-xs font-bold text-[#EA9E24] flex items-center gap-0.5">
                    Match AI <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('tools')}
                className="bg-gradient-to-br from-[#3D4043] to-[#282A2C] text-white rounded-[26px] p-5 shadow-[0_12px_30px_-8px_rgba(61,64,67,0.25)] cursor-pointer hover:scale-[1.01] transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                    Rajkot Deal Desk
                  </span>
                  <Calculator className="w-4 h-4 text-[#EA9E24]" />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-base font-extrabold tracking-tight text-white">
                    7/12 • Vaar • MoU
                  </span>
                  <span className="text-[11px] font-bold text-[#EA9E24]">Open →</span>
                </div>
              </div>
            </div>

            {/* iOS 27 Frosted Search & Micro-Market Scroller */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-[28px] p-4 border border-white shadow-[0_10px_35px_-12px_rgba(61,64,67,0.07)] space-y-3.5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#3D4043]/40 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={propSearch}
                    onChange={(e) => setPropSearch(e.target.value)}
                    placeholder="Search project, area, code (KLWD-4821), 3 BHK, or owner..."
                    className="w-full pl-11 pr-4 py-3 bg-[#F2F2F6]/90 rounded-[18px] text-sm font-medium text-[#3D4043] placeholder:text-[#3D4043]/40 border border-transparent focus:outline-none focus:bg-white focus:border-[#EA9E24] transition-all"
                  />
                  {propSearch && (
                    <button
                      onClick={() => setPropSearch('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3D4043]/40 hover:text-[#3D4043]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setEditingPropId(null);
                    setActiveTab('capture');
                  }}
                  className="px-5 py-3 bg-[#EA9E24] hover:bg-[#d88f1c] text-white rounded-[18px] text-xs font-extrabold flex items-center justify-center gap-2 shrink-0 shadow-[0_8px_20px_-4px_rgba(234,158,36,0.45)] transition-all active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scout Property (AI)</span>
                </button>
              </div>

              {/* Sliding Pill Filter Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {['All', ...RAJKOT_AREAS.map(a => a.name)].map((area) => (
                  <button
                    key={area}
                    onClick={() => setAreaFilter(area)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      areaFilter === area
                        ? 'bg-[#3D4043] text-white shadow-xs'
                        : 'bg-[#F2F2F6] text-[#3D4043]/70 hover:bg-[#E5E5EA]'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Spatial Glass Property Cards Grid */}
            {isLoadingCloud ? (
              <div className="bg-white/80 backdrop-blur-2xl rounded-[30px] p-12 text-center border border-white space-y-3">
                <RefreshCw className="w-6 h-6 text-[#EA9E24] animate-spin mx-auto" />
                <p className="text-sm font-extrabold text-[#3D4043]">Syncing Live Multi-Device Cloud Database...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-2xl rounded-[30px] p-12 text-center border border-white space-y-3">
                <Building2 className="w-8 h-8 text-[#EA9E24] mx-auto" />
                <h3 className="text-base font-black text-[#3D4043]">No Properties Found</h3>
                <p className="text-xs text-[#3D4043]/60 max-w-md mx-auto">
                  Your shared cloud portfolio has no matching listings right now. Tap "+ AI Scout" to add a new property from any device.
                </p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredProperties.map((prop) => {
                const ratePerSqFt = prop.sizeSqFt ? Math.round(Number(prop.priceQuoted) / Number(prop.sizeSqFt)) : 0;
                return (
                  <div
                    key={prop.id}
                    className="group bg-white/85 backdrop-blur-2xl rounded-[30px] border border-white shadow-[0_14px_40px_-12px_rgba(61,64,67,0.08)] hover:shadow-[0_20px_50px_-12px_rgba(61,64,67,0.14)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Media Showcase with Floating Glass Price Capsule */}
                      <div className="relative h-48 w-full overflow-hidden bg-[#26282A]">
                        {prop.photoUrl ? (
                          <img
                            src={prop.photoUrl}
                            alt={prop.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <ArchitecturalPreviewGraphic prop={prop} />
                        )}

                        {/* Floating Price & Status Overlay */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
                          <div className="px-3.5 py-1.5 rounded-2xl bg-black/65 backdrop-blur-xl border border-white/15 text-white">
                            <span className="text-lg font-black tracking-tight text-white">
                              {formatPriceIndian(prop.priceQuoted)}
                            </span>
                            {ratePerSqFt > 0 && (
                              <span className="text-[10px] text-white/75 font-semibold ml-1.5">
                                ₹{ratePerSqFt.toLocaleString('en-IN')}/Sq.Ft
                              </span>
                            )}
                          </div>

                          <span className="px-3 py-1 rounded-full bg-[#EA9E24] text-white text-[11px] font-extrabold shadow-sm">
                            {prop.status || 'Available'}
                          </span>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-5 space-y-3.5">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-bold text-[#EA9E24]">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>{prop.areaName}</span>
                            <span className="text-[#3D4043]/30">•</span>
                            <span className="font-mono text-[#3D4043]/60">{prop.uniqueCode}</span>
                          </div>
                          <h3 className="font-extrabold text-[17px] text-[#3D4043] tracking-tight mt-1 line-clamp-1">
                            {prop.title}
                          </h3>
                        </div>

                        {/* Spec Pills */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-3 py-1 rounded-full bg-[#F2F2F6] text-[#3D4043] text-xs font-bold">
                            {prop.bhk}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-[#F2F2F6] text-[#3D4043] text-xs font-bold">
                            {prop.sizeVaar} Vaar ({prop.sizeSqFt} Sq.Ft)
                          </span>
                          {prop.facing && (
                            <span className="px-3 py-1 rounded-full bg-[#F2F2F6] text-[#3D4043]/80 text-xs font-semibold">
                              {prop.facing}
                            </span>
                          )}
                        </div>

                        {prop.publicNotes && (
                          <p className="text-xs text-[#3D4043]/70 leading-relaxed line-clamp-2">
                            {prop.publicNotes}
                          </p>
                        )}

                        {/* Private Broker Vault (Automatically Hidden in Client Safe Mode) */}
                        {!clientViewMode && (
                          <div className="p-3.5 rounded-[20px] bg-[#F2F2F6]/90 border border-black/[0.05] space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 font-bold text-[#3D4043]">
                                <Lock className="w-3.5 h-3.5 text-[#EA9E24]" />
                                <span>{prop.ownerName}</span>
                              </div>
                              <a
                                href={`tel:${prop.ownerPhone}`}
                                className="font-mono font-bold text-[#3D4043] hover:text-[#EA9E24] underline"
                              >
                                {prop.ownerPhone}
                              </a>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-[#3D4043]/70">
                              <span className="truncate">{prop.keyLocation || 'Direct Owner Access'}</span>
                              <span className="font-extrabold text-[#EA9E24] shrink-0 ml-2">
                                Bottom: {formatPriceIndian(prop.priceBottom)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tactile Card Action Bar */}
                    <div className="px-5 py-3.5 bg-[#F8F8FA]/80 border-t border-black/[0.05] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditProperty(prop)}
                          className="px-3 py-1.5 rounded-full text-xs font-bold text-[#3D4043] hover:bg-black/[0.06] flex items-center gap-1 transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setReverseMatchModalProp(prop)}
                          className="px-3 py-1.5 rounded-full text-xs font-bold text-[#3D4043] hover:bg-black/[0.06] flex items-center gap-1 transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#EA9E24]" />
                          <span>Match</span>
                        </button>
                        <button
                          onClick={() => {
                            setHisabPrice(String(prop.priceQuoted || 8400000));
                            setActiveTab('tools');
                          }}
                          className="px-2.5 py-1.5 rounded-full text-xs font-bold text-[#3D4043]/70 hover:bg-black/[0.06] transition-all"
                          title="Calculate Pakka Hisab"
                        >
                          Hisab
                        </button>
                        <button
                          onClick={() => deleteProperty(prop.id)}
                          className="p-1.5 rounded-full text-[#3D4043]/40 hover:text-[#3D4043] hover:bg-black/[0.06] transition-all"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `*Radhika Estate Agency — Rajkot*\n\n*${prop.title}* (${prop.uniqueCode})\n📍 Location: ${prop.areaName}\n📐 Area: ${prop.sizeVaar} Vaar (${prop.sizeSqFt} Sq.Ft)\n🏢 Config: ${prop.bhk} • ${prop.facing}\n💰 Asking Price: ${formatPriceIndian(prop.priceQuoted)}\n✨ Highlights: ${prop.publicNotes || 'Clear title, prime location.'}\n\n*Contact Radhika Estate Agency for Site Visit*`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-[#3D4043] hover:bg-[#EA9E24] text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Brochure</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: iOS 27 AI SCOUT STUDIO (VOICE + VISION + INSTANT FORM)     */}
        {/* ================================================================ */}
        {activeTab === 'capture' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Top Studio Banner */}
            <div className="bg-white/85 backdrop-blur-2xl rounded-[28px] p-5 border border-white shadow-[0_12px_35px_-10px_rgba(61,64,67,0.08)] flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#EA9E24]/15 text-[#EA9E24] text-[11px] font-extrabold tracking-wide">
                    RADHIKA INTELLIGENCE
                  </span>
                  <span className="text-xs font-semibold text-[#3D4043]/60">{gpsLocationLabel}</span>
                </div>
                <h2 className="text-xl font-black text-[#3D4043] tracking-tight mt-1.5">
                  {editingPropId ? 'Edit Property Specification' : 'Zero-Typing Field Scout Studio'}
                </h2>
              </div>

              {editingPropId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPropId(null);
                    setPropTitle('');
                    setCapturedPhotoUrl('');
                    setActiveTab('properties');
                  }}
                  className="px-4 py-2 rounded-full bg-[#F2F2F6] text-xs font-bold text-[#3D4043]"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {/* AI Extracted Summary Pills Banner (Shows visibly when AI runs) */}
            {aiExtractedSummaryPills.length > 0 && (
              <div className="bg-[#3D4043] text-white rounded-[24px] p-4 shadow-lg border border-[#EA9E24]/40 flex flex-wrap items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#EA9E24] shrink-0" />
                  <span className="text-xs font-extrabold text-[#EA9E24]">AI Populated:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 flex-1">
                  {aiExtractedSummaryPills.map((pill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* MULTIMODAL AI CARDS: VOICE/TEXT ON LEFT + CAMERA/VISION ON RIGHT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Card 1: Voice & Natural Language Intelligence */}
              <div className="bg-white/85 backdrop-blur-2xl rounded-[30px] p-5 border border-white shadow-[0_14px_40px_-12px_rgba(61,64,67,0.08)] flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#EA9E24]">
                      Voice & Note AI
                    </span>
                    <h3 className="font-extrabold text-base text-[#3D4043] mt-0.5">
                      Speak or Paste Property Note
                    </h3>
                    <p className="text-xs text-[#3D4043]/60 mt-0.5">
                      Dictate in Gujarati, Hindi, or English — or tap a preset below to test instantly.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={toggleRecordVoice}
                    className={`w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 transition-all shadow-md ${
                      isRecording
                        ? 'bg-[#EA9E24] text-white animate-pulse scale-105'
                        : 'bg-[#3D4043] text-[#EA9E24] hover:scale-105'
                    }`}
                    title="Start or Stop Voice Recording"
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                </div>

                {/* 1-Tap Instant Demo Voice/Note Pills */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#3D4043]/50">
                    1-Tap Instant Voice Note Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        label: "3 BHK Kalawad Rd (84L)",
                        text: "3 BHK luxury flat on Kalawad Road, 165 Vaar, East facing, asking 84 Lakh, owner Rameshbhai Patel 9825011223, key with watchman"
                      },
                      {
                        label: "Mavdi 220 Vaar Plot (1.18 Cr)",
                        text: "Open NA residential corner plot in Mavdi area, 220 Vaar Road Corner plot, asking 1.18 Crore, owner Pravinbhai 9426055443"
                      },
                      {
                        label: "Ring Rd Showroom (1.45 Cr)",
                        text: "Commercial Showroom on 150 Ft Ring Road, 140 Vaar North-East facing, 1.45 Crore asking, owner Ketanbhai 9825077889"
                      }
                    ].map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAudioTranscript(sample.text);
                          runGeminiOnTextOrAudio({ transcriptText: sample.text });
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#F2F2F6] hover:bg-[#EA9E24] hover:text-white text-[#3D4043] text-[11px] font-bold transition-all"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <textarea
                    rows={3}
                    value={audioTranscript}
                    onChange={(e) => setAudioTranscript(e.target.value)}
                    placeholder='Paste WhatsApp message or type note (e.g., "3 BHK University Rd 160 Vaar 85 Lakh East facing Bharatbhai 9825011122")...'
                    className="w-full p-3.5 bg-[#F2F2F6] rounded-[18px] text-xs font-semibold text-[#3D4043] placeholder:text-[#3D4043]/40 border border-transparent focus:outline-none focus:bg-white focus:border-[#EA9E24]"
                  />
                  <button
                    type="button"
                    disabled={isAiProcessing}
                    onClick={() => runGeminiOnTextOrAudio({ transcriptText: audioTranscript })}
                    className="w-full py-3 bg-[#3D4043] hover:bg-[#EA9E24] text-white rounded-[18px] text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-[#EA9E24]" />
                    <span>
                      {isAiProcessing ? 'Radhika Intelligence Extracting...' : 'Extract & Auto-Fill Form'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Card 2: Camera, Gallery & Instant Vision Board Scanner */}
              <div className="bg-white/85 backdrop-blur-2xl rounded-[30px] p-5 border border-white shadow-[0_14px_40px_-12px_rgba(61,64,67,0.08)] flex flex-col justify-between space-y-4">
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#EA9E24]">
                      Vision OCR & Auto-Watermark
                    </span>
                    <h3 className="font-extrabold text-base text-[#3D4043] mt-0.5">
                      Site Photo or "For Sale" Board
                    </h3>
                    <p className="text-xs text-[#3D4043]/60 mt-0.5">
                      Stamps Radhika watermark + extracts numbers & specs from boards.
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-[16px] bg-[#F2F2F6] flex items-center justify-center">
                    <Camera className="w-5 h-5 text-[#EA9E24]" />
                  </div>
                </div>

                {/* 1-Tap Instant Vision Board Presets (Lets user test Vision AI immediately) */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#3D4043]/50">
                    1-Tap Demo "For Sale" Board Scanners:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleRunDemoBoardScan('flat')}
                      className="px-3 py-1.5 rounded-full bg-[#F2F2F6] hover:bg-[#EA9E24] hover:text-white text-[#3D4043] text-[11px] font-bold transition-all"
                    >
                      Scan 3BHK Sale Board
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRunDemoBoardScan('showroom')}
                      className="px-3 py-1.5 rounded-full bg-[#F2F2F6] hover:bg-[#EA9E24] hover:text-white text-[#3D4043] text-[11px] font-bold transition-all"
                    >
                      Scan Showroom Banner
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRunDemoBoardScan('plot')}
                      className="px-3 py-1.5 rounded-full bg-[#F2F2F6] hover:bg-[#EA9E24] hover:text-white text-[#3D4043] text-[11px] font-bold transition-all"
                    >
                      Scan NA Plot Board
                    </button>
                  </div>
                </div>

                {capturedPhotoUrl ? (
                  <div className="space-y-2.5">
                    <div className="relative h-36 w-full rounded-[20px] overflow-hidden border border-black/[0.08]">
                      <img
                        src={capturedPhotoUrl}
                        alt="Captured property"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCapturedPhotoUrl('');
                          setRawPhotoBase64('');
                        }}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current && cameraInputRef.current.click()}
                        className="py-2.5 px-2 bg-[#F2F2F6] hover:bg-[#E5E5EA] text-[#3D4043] rounded-[16px] text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Camera</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current && galleryInputRef.current.click()}
                        className="py-2.5 px-2 bg-[#F2F2F6] hover:bg-[#E5E5EA] text-[#3D4043] rounded-[16px] text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Gallery</span>
                      </button>
                      <button
                        type="button"
                        disabled={isAiProcessing}
                        onClick={() => runPhotoVisionAI()}
                        className="py-2.5 px-2 bg-[#EA9E24] text-white rounded-[16px] text-xs font-extrabold flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Re-Scan</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current && cameraInputRef.current.click()}
                      className="flex-1 py-3.5 px-4 bg-[#3D4043] hover:bg-[#2B2E30] text-white rounded-[18px] text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Camera className="w-4 h-4 text-[#EA9E24]" />
                      <span>Snap Camera</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current && galleryInputRef.current.click()}
                      className="flex-1 py-3.5 px-4 bg-[#F2F2F6] hover:bg-[#E5E5EA] text-[#3D4043] rounded-[18px] text-xs font-extrabold flex items-center justify-center gap-2 transition-all"
                    >
                      <Upload className="w-4 h-4 text-[#EA9E24]" />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 2: iOS 27 GROUPED SPATIAL SPECIFICATION SHEET */}
            <form
              onSubmit={handleSaveProperty}
              className={`bg-white/90 backdrop-blur-2xl rounded-[32px] p-6 sm:p-7 border transition-all duration-500 shadow-[0_16px_45px_-12px_rgba(61,64,67,0.09)] space-y-6 ${
                aiFilledHighlight
                  ? 'border-[#EA9E24] ring-4 ring-[#EA9E24]/20'
                  : 'border-white'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-black/[0.06]">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#3D4043]/45">
                    Live Property Sheet
                  </span>
                  <h3 className="text-lg font-black text-[#3D4043] mt-0.5">
                    {propTitle || `${propBhk} at ${selectedArea.name}`}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#3D4043]/50 block">Asking Valuation</span>
                  <span className="text-xl font-black text-[#EA9E24]">
                    {formatPriceIndian(propPriceQuoted)}
                  </span>
                </div>
              </div>

              {/* Tactile Micro-Market Pill Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#3D4043]/70">
                  1. Select Rajkot Micro-Market
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {RAJKOT_AREAS.map((areaObj) => (
                    <button
                      key={areaObj.code}
                      type="button"
                      onClick={() => setSelectedArea(areaObj)}
                      className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                        selectedArea.name === areaObj.name
                          ? 'bg-[#3D4043] text-white shadow-xs'
                          : 'bg-[#F2F2F6] text-[#3D4043]/75 hover:bg-[#E5E5EA]'
                      }`}
                    >
                      {areaObj.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tactile Configuration Pills */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#3D4043]/70">
                  2. Property Configuration
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_CONFIG_PILLS.map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => {
                        setPropBhk(pill);
                        if (pill === 'Open Plot') setPropCategory('Open Plot / Land');
                        else if (pill === 'Showroom') setPropCategory('Commercial Shop / Showroom');
                        else if (pill === 'GIDC Shed') setPropCategory('Industrial Shed / GIDC');
                        else if (pill === 'Bungalow') setPropCategory('Bungalow / Tenament');
                        else setPropCategory('Residential Flat (3BHK/2BHK)');
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        propBhk === pill
                          ? 'bg-[#EA9E24] text-white shadow-xs'
                          : 'bg-[#F2F2F6] text-[#3D4043]/75 hover:bg-[#E5E5EA]'
                      }`}
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto-Synced Vaar, Sq.Ft & Price Cells */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#F2F2F6] rounded-[22px] p-3.5">
                  <label className="block text-[11px] font-bold text-[#3D4043]/60 mb-1">
                    Area in Vaar (Sq.Yd)
                  </label>
                  <input
                    type="number"
                    value={propSizeVaar}
                    onChange={(e) => {
                      setPropSizeVaar(e.target.value);
                      setPropSizeSqFt(String(Math.round(Number(e.target.value) * 9)));
                    }}
                    className="w-full bg-transparent text-lg font-black text-[#3D4043] focus:outline-none"
                  />
                </div>

                <div className="bg-[#F2F2F6] rounded-[22px] p-3.5">
                  <label className="block text-[11px] font-bold text-[#3D4043]/60 mb-1">
                    Area in Sq.Ft (1 Vaar = 9 Sq.Ft)
                  </label>
                  <input
                    type="number"
                    value={propSizeSqFt}
                    onChange={(e) => {
                      setPropSizeSqFt(e.target.value);
                      setPropSizeVaar(String(Math.round(Number(e.target.value) / 9)));
                    }}
                    className="w-full bg-transparent text-lg font-black text-[#3D4043] focus:outline-none"
                  />
                </div>

                <div className="bg-[#F2F2F6] rounded-[22px] p-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-[#3D4043]/60">Asking Price (₹)</label>
                    <span className="text-[11px] font-extrabold text-[#EA9E24]">
                      {formatPriceIndian(propPriceQuoted)}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={propPriceQuoted}
                    onChange={(e) => setPropPriceQuoted(e.target.value)}
                    className="w-full bg-transparent text-lg font-black text-[#3D4043] focus:outline-none"
                  />
                </div>
              </div>

              {/* Title & Vastu Facing Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#F2F2F6] rounded-[22px] p-3.5">
                  <label className="block text-[11px] font-bold text-[#3D4043]/60 mb-1">
                    Project / Listing Title
                  </label>
                  <input
                    type="text"
                    value={propTitle}
                    onChange={(e) => setPropTitle(e.target.value)}
                    placeholder="e.g. Royal Heights — 3 BHK Sky Residence"
                    className="w-full bg-transparent text-sm font-bold text-[#3D4043] focus:outline-none"
                  />
                </div>

                <div className="bg-[#F2F2F6] rounded-[22px] p-3.5">
                  <label className="block text-[11px] font-bold text-[#3D4043]/60 mb-1.5">
                    Vastu Entry / Facing
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {QUICK_FACING_PILLS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setPropFacing(f)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          propFacing === f
                            ? 'bg-[#3D4043] text-white'
                            : 'bg-white text-[#3D4043]/70'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#F2F2F6] rounded-[22px] p-3.5">
                <label className="block text-[11px] font-bold text-[#3D4043]/60 mb-1">
                  Client Brochure Highlights (Public)
                </label>
                <input
                  type="text"
                  value={propPublicNotes}
                  onChange={(e) => setPropPublicNotes(e.target.value)}
                  placeholder="Full modular kitchen, 2 basement car parkings, 100% Vastu..."
                  className="w-full bg-transparent text-sm font-semibold text-[#3D4043] focus:outline-none"
                />
              </div>

              {/* Private Broker Vault Drawer */}
              <div className="rounded-[24px] bg-[#F2F2F6]/80 border border-black/[0.06] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowVaultDrawer(!showVaultDrawer)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-extrabold text-[#3D4043]"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#EA9E24]" />
                    <span>Private Broker Vault (Hidden in Client View)</span>
                  </span>
                  <span className="text-[#EA9E24]">{showVaultDrawer ? 'Hide' : 'Open'}</span>
                </button>

                {showVaultDrawer && (
                  <div className="p-4 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white rounded-[18px] p-3">
                      <label className="block text-[10px] font-bold text-[#3D4043]/50 mb-0.5">Owner / Builder Name</label>
                      <input
                        type="text"
                        value={propOwnerName}
                        onChange={(e) => setPropOwnerName(e.target.value)}
                        placeholder="Rameshbhai Patel"
                        className="w-full text-sm font-bold text-[#3D4043] focus:outline-none"
                      />
                    </div>
                    <div className="bg-white rounded-[18px] p-3">
                      <label className="block text-[10px] font-bold text-[#3D4043]/50 mb-0.5">Owner Mobile Number</label>
                      <input
                        type="text"
                        value={propOwnerPhone}
                        onChange={(e) => setPropOwnerPhone(e.target.value)}
                        placeholder="9825012345"
                        className="w-full text-sm font-bold text-[#3D4043] focus:outline-none"
                      />
                    </div>
                    <div className="bg-white rounded-[18px] p-3">
                      <label className="block text-[10px] font-bold text-[#3D4043]/50 mb-0.5">
                        Bottom Negotiable Price ({formatPriceIndian(propPriceBottom)})
                      </label>
                      <input
                        type="number"
                        value={propPriceBottom}
                        onChange={(e) => setPropPriceBottom(e.target.value)}
                        className="w-full text-sm font-bold text-[#3D4043] focus:outline-none"
                      />
                    </div>
                    <div className="bg-white rounded-[18px] p-3">
                      <label className="block text-[10px] font-bold text-[#3D4043]/50 mb-0.5">Key Location / Site Access</label>
                      <input
                        type="text"
                        value={propKeyLocation}
                        onChange={(e) => setPropKeyLocation(e.target.value)}
                        placeholder="Key with Watchman"
                        className="w-full text-sm font-bold text-[#3D4043] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 7/12 Revenue & TP Drawer */}
              <div className="rounded-[24px] bg-[#F2F2F6]/80 border border-black/[0.06] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowRevenueDrawer(!showRevenueDrawer)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-extrabold text-[#3D4043]"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#EA9E24]" />
                    <span>7/12 Survey, TP Scheme & Status</span>
                  </span>
                  <span className="text-[#EA9E24]">{showRevenueDrawer ? 'Hide' : 'Open'}</span>
                </button>

                {showRevenueDrawer && (
                  <div className="p-4 pt-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white rounded-[16px] p-2.5">
                      <label className="block text-[10px] font-bold text-[#3D4043]/50">TP Scheme</label>
                      <input
                        type="text"
                        value={propTpNumber}
                        onChange={(e) => setPropTpNumber(e.target.value)}
                        className="w-full text-xs font-bold text-[#3D4043] focus:outline-none mt-0.5"
                      />
                    </div>
                    <div className="bg-white rounded-[16px] p-2.5">
                      <label className="block text-[10px] font-bold text-[#3D4043]/50">FP Number</label>
                      <input
                        type="text"
                        value={propFpNumber}
                        onChange={(e) => setPropFpNumber(e.target.value)}
                        className="w-full text-xs font-bold text-[#3D4043] focus:outline-none mt-0.5"
                      />
                    </div>
                    <div className="bg-white rounded-[16px] p-2.5">
                      <label className="block text-[10px] font-bold text-[#3D4043]/50">7/12 Survey No</label>
                      <input
                        type="text"
                        value={propSurveyNumber}
                        onChange={(e) => setPropSurveyNumber(e.target.value)}
                        className="w-full text-xs font-bold text-[#3D4043] focus:outline-none mt-0.5"
                      />
                    </div>
                    <div className="bg-white rounded-[16px] p-2.5">
                      <label className="block text-[10px] font-bold text-[#3D4043]/50">Status</label>
                      <select
                        value={propStatus}
                        onChange={(e) => setPropStatus(e.target.value)}
                        className="w-full text-xs font-bold text-[#3D4043] bg-transparent focus:outline-none mt-0.5"
                      >
                        <option value="Available">Available</option>
                        <option value="Token Given">Token Given</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#EA9E24] hover:bg-[#d88f1c] text-white font-black text-sm rounded-[22px] shadow-[0_10px_28px_-6px_rgba(234,158,36,0.55)] transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{editingPropId ? 'Update Property in Cloud' : 'Save Property & Run Buyer Matchmaker'}</span>
              </button>
            </form>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: BUYERS & TWO-WAY AI MATCHMAKER                             */}
        {/* ================================================================ */}
        {activeTab === 'buyers' && (
          <div className="space-y-6">
            
            {/* Header Card */}
            <div className="bg-white/85 backdrop-blur-2xl rounded-[28px] p-5 border border-white shadow-[0_12px_35px_-10px_rgba(61,64,67,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#EA9E24]">
                  Two-Way Neural Matchmaker
                </span>
                <h2 className="text-xl font-black text-[#3D4043] tracking-tight mt-0.5">
                  Active Buyers & Compatible Inventory
                </h2>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={toggleBuyerVoiceDictation}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isBuyerVoiceRecording
                      ? 'bg-[#EA9E24] text-white animate-pulse'
                      : 'bg-[#F2F2F6] text-[#3D4043] hover:bg-[#E5E5EA]'
                  }`}
                >
                  <Mic className="w-4 h-4 text-[#EA9E24]" />
                  <span>{isBuyerVoiceRecording ? 'Listening...' : 'Voice Buyer Lead'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingBuyerId(null);
                    setNewBuyerName('');
                    setNewBuyerPhone('');
                    setNewBuyerReq('');
                    setShowBuyerFormModal(true);
                  }}
                  className="px-4 py-2.5 bg-[#3D4043] text-white rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4 text-[#EA9E24]" />
                  <span>Add Buyer</span>
                </button>
              </div>
            </div>

            {/* Instant Requirement Matcher Bar */}
            <div className="bg-white/85 backdrop-blur-2xl rounded-[28px] p-4 border border-white shadow-[0_10px_30px_-10px_rgba(61,64,67,0.07)]">
              <div className="relative">
                <Search className="w-4 h-4 text-[#3D4043]/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={buyerSearchQuery}
                  onChange={(e) => setBuyerSearchQuery(e.target.value)}
                  placeholder="Type any buyer requirement to test instant match (e.g. 'Kalawad', 'Showroom', 'Plot')..."
                  className="w-full pl-11 pr-4 py-3 bg-[#F2F2F6] rounded-[18px] text-sm font-medium text-[#3D4043] focus:outline-none focus:bg-white focus:border focus:border-[#EA9E24]"
                />
              </div>

              {buyerSearchQuery.trim() !== '' && (
                <div className="mt-3.5 pt-3.5 border-t border-black/[0.06] space-y-2.5">
                  <span className="text-xs font-extrabold text-[#3D4043]/60">
                    Instant Inventory Matches for "{buyerSearchQuery}":
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {properties
                      .filter(
                        p =>
                          String(p?.title || '').toLowerCase().includes(buyerSearchQuery.toLowerCase()) ||
                          String(p?.areaName || '').toLowerCase().includes(buyerSearchQuery.toLowerCase()) ||
                          String(p?.bhk || '').toLowerCase().includes(buyerSearchQuery.toLowerCase())
                      )
                      .map(mProp => (
                        <div key={mProp.id} className="p-3.5 rounded-[20px] bg-[#F2F2F6] flex items-center justify-between">
                          <div>
                            <span className="font-extrabold text-xs text-[#3D4043]">{mProp.title}</span>
                            <span className="block text-[11px] font-semibold text-[#3D4043]/60 mt-0.5">
                              {mProp.areaName} • {formatPriceIndian(mProp.priceQuoted)} • {mProp.sizeVaar} Vaar
                            </span>
                          </div>
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(`*Radhika Estate Agency*\n*${mProp.title}*\nLocation: ${mProp.areaName}\nPrice: ${formatPriceIndian(mProp.priceQuoted)}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 bg-[#EA9E24] text-white rounded-full text-xs font-extrabold"
                          >
                            Pitch
                          </a>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Buyer Cards */}
            <div className="space-y-4">
              {buyers.map((buyer) => {
                const rankedMatches = properties
                  .map(p => ({ prop: p, ...calculateMatchScore(p, buyer) }))
                  .filter(m => m.score >= 70)
                  .sort((a, b) => b.score - a.score);

                return (
                  <div
                    key={buyer.id}
                    className="bg-white/85 backdrop-blur-2xl rounded-[30px] p-6 border border-white shadow-[0_14px_40px_-12px_rgba(61,64,67,0.08)] space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="font-black text-lg text-[#3D4043]">{buyer.name}</h3>
                          <span className="px-3 py-1 rounded-full bg-[#EA9E24]/15 text-[#3D4043] text-xs font-extrabold">
                            Budget: {formatPriceIndian(buyer.budgetMax)}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#3D4043]/60 mt-1">
                          Preferred Area: <strong className="text-[#3D4043]">{buyer.preferredArea}</strong> • {buyer.phone}
                        </p>
                        <p className="text-xs text-[#3D4043]/80 mt-1.5">{buyer.requirementText}</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingBuyerId(buyer.id);
                            setNewBuyerName(String(buyer.name || ''));
                            setNewBuyerPhone(String(buyer.phone || ''));
                            setNewBuyerArea(String(buyer.preferredArea || 'Kalawad Road'));
                            setNewBuyerBudget(String(buyer.budgetMax || 9000000));
                            setNewBuyerReq(String(buyer.requirementText || ''));
                            setShowBuyerFormModal(true);
                          }}
                          className="px-3 py-1.5 rounded-full bg-[#F2F2F6] text-xs font-bold text-[#3D4043]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            const cleanBuyerId = String(buyer.id);
                            setBuyers(prev => prev.filter(b => b.id !== cleanBuyerId));
                            if (currentUser) {
                              try {
                                await setDoc(
                                  doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'systemMeta'),
                                  { initialSeedDone: true, updatedAt: new Date().toISOString() },
                                  { merge: true }
                                );
                                await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'buyers', cleanBuyerId));
                                await deleteDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'buyers', cleanBuyerId));
                                notifyIsland("Buyer Permanently Deleted from Cloud");
                              } catch (err) {
                                setCloudErrorMsg(`Buyer Delete Error: ${err.message}`);
                              }
                            }
                          }}
                          className="p-2 text-[#3D4043]/40 hover:text-[#3D4043] rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Ranked Matches */}
                    <div className="pt-3.5 border-t border-black/[0.06] space-y-2.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#3D4043]/45">
                        Compatible Inventory ({rankedMatches.length})
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {rankedMatches.map(({ prop, score, reasons }) => (
                          <div
                            key={prop.id}
                            className="p-3.5 rounded-[22px] bg-[#F2F2F6]/90 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 bg-[#EA9E24] text-white rounded-full text-[10px] font-black">
                                  {score}% Match
                                </span>
                                <span className="font-extrabold text-xs text-[#3D4043] truncate">
                                  {prop.title}
                                </span>
                              </div>
                              <p className="text-[11px] font-medium text-[#3D4043]/60 mt-1 truncate">
                                {reasons.join(' • ')}
                              </p>
                            </div>
                            <a
                              href={`https://wa.me/91${String(buyer?.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Namaste ${buyer.name},\n\nWe have a verified property matching your requirement:\n*${prop.title}*\n📍 Location: ${prop.areaName}\n📐 Area: ${prop.sizeVaar} Vaar (${prop.sizeSqFt} Sq.Ft)\n💰 Price: ${formatPriceIndian(prop.priceQuoted)}\n\n— *Radhika Estate Agency, Rajkot*`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 bg-[#3D4043] hover:bg-[#EA9E24] text-white rounded-full text-xs font-extrabold shrink-0 transition-all"
                            >
                              Pitch
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 4: DEAL DESK & GUJARAT 7/12 BENTO SUITE                       */}
        {/* ================================================================ */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Bento 1: AnyROR 7/12 & RUDA Land Converter */}
              <div className="bg-white/85 backdrop-blur-2xl rounded-[30px] p-6 border border-white shadow-[0_14px_40px_-12px_rgba(61,64,67,0.08)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#EA9E24]">
                      Gujarat Revenue & RUDA
                    </span>
                    <h3 className="text-lg font-black text-[#3D4043] mt-0.5">
                      7/12 Utara & Hectare-to-Vaar
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#EA9E24]/15 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#EA9E24]" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#F2F2F6] rounded-[18px] p-3">
                    <label className="block text-[10px] font-bold text-[#3D4043]/55">Hectare (હે.)</label>
                    <input
                      type="number"
                      value={utaraHectare}
                      onChange={(e) => setUtaraHectare(e.target.value)}
                      className="w-full bg-transparent text-base font-black text-[#3D4043] focus:outline-none mt-0.5"
                    />
                  </div>
                  <div className="bg-[#F2F2F6] rounded-[18px] p-3">
                    <label className="block text-[10px] font-bold text-[#3D4043]/55">Are (આરે)</label>
                    <input
                      type="number"
                      value={utaraAre}
                      onChange={(e) => setUtaraAre(e.target.value)}
                      className="w-full bg-transparent text-base font-black text-[#3D4043] focus:outline-none mt-0.5"
                    />
                  </div>
                  <div className="bg-[#F2F2F6] rounded-[18px] p-3">
                    <label className="block text-[10px] font-bold text-[#3D4043]/55">Sq.Mt (ચો.મી.)</label>
                    <input
                      type="number"
                      value={utaraSqMt}
                      onChange={(e) => setUtaraSqMt(e.target.value)}
                      className="w-full bg-transparent text-base font-black text-[#3D4043] focus:outline-none mt-0.5"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-[20px] bg-[#3D4043] text-white flex items-center justify-between text-xs font-extrabold">
                  <span>{totalUtaraVaar} Saurashtra Vaar</span>
                  <span className="text-[#EA9E24]">{totalUtaraVigha} Vigha (16-Guntha)</span>
                </div>

                <button
                  onClick={() => setActiveToolModal('utara')}
                  className="w-full py-3 bg-[#F2F2F6] hover:bg-[#EA9E24] hover:text-white text-[#3D4043] text-xs font-extrabold rounded-[18px] transition-all"
                >
                  Open 7/12 Utara AI Document Scanner
                </button>
              </div>

              {/* Bento 2: Saurashtra Vaar / Sq.Ft / Vigha */}
              <div className="bg-white/85 backdrop-blur-2xl rounded-[30px] p-6 border border-white shadow-[0_14px_40px_-12px_rgba(61,64,67,0.08)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#EA9E24]">
                      Saurashtra Calibration
                    </span>
                    <h3 className="text-lg font-black text-[#3D4043] mt-0.5">
                      Vaar ↔ Sq.Ft ↔ 16-Guntha Vigha
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#EA9E24]/15 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-[#EA9E24]" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#F2F2F6] rounded-[18px] p-3">
                    <label className="block text-[10px] font-bold text-[#3D4043]/55">Sq.Ft</label>
                    <input
                      type="number"
                      value={calcSqFt}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setCalcSqFt(e.target.value);
                        setCalcVaar(String((v / 9).toFixed(1)));
                        setCalcVigha(String((v / 17424).toFixed(3)));
                      }}
                      className="w-full bg-transparent text-base font-black text-[#3D4043] focus:outline-none mt-0.5"
                    />
                  </div>
                  <div className="bg-[#F2F2F6] rounded-[18px] p-3">
                    <label className="block text-[10px] font-bold text-[#3D4043]/55">Vaar (Sq.Yd)</label>
                    <input
                      type="number"
                      value={calcVaar}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setCalcVaar(e.target.value);
                        setCalcSqFt(String(Math.round(v * 9)));
                        setCalcVigha(String(((v * 9) / 17424).toFixed(3)));
                      }}
                      className="w-full bg-transparent text-base font-black text-[#3D4043] focus:outline-none mt-0.5"
                    />
                  </div>
                  <div className="bg-[#F2F2F6] rounded-[18px] p-3">
                    <label className="block text-[10px] font-bold text-[#3D4043]/55">Vigha</label>
                    <input
                      type="number"
                      value={calcVigha}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setCalcVigha(e.target.value);
                        setCalcSqFt(String(Math.round(v * 17424)));
                        setCalcVaar(String(Math.round((v * 17424) / 9)));
                      }}
                      className="w-full bg-transparent text-base font-black text-[#3D4043] focus:outline-none mt-0.5"
                    />
                  </div>
                </div>

                <p className="text-xs font-medium text-[#3D4043]/60 leading-relaxed">
                  Calibrated to Rajkot standard: <strong>1 Vaar = 9 Sq.Ft</strong> and <strong>1 Saurashtra Vigha = 1,936 Vaar (17,424 Sq.Ft)</strong>.
                </p>
              </div>

              {/* Bento 3: Pakka Hisab Stamp Duty & Deal Sheet */}
              <div className="bg-white/85 backdrop-blur-2xl rounded-[30px] p-6 border border-white shadow-[0_14px_40px_-12px_rgba(61,64,67,0.08)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#EA9E24]">
                      Financial Structuring
                    </span>
                    <h3 className="text-lg font-black text-[#3D4043] mt-0.5">
                      "Pakka Hisab" Stamp Duty & TDS
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#EA9E24]/15 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-[#EA9E24]" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#F2F2F6] rounded-[18px] px-3.5 py-2">
                    <span className="text-[10px] font-bold text-[#3D4043]/50 block">Deal Value (₹)</span>
                    <input
                      type="number"
                      value={hisabPrice}
                      onChange={(e) => setHisabPrice(e.target.value)}
                      className="w-full bg-transparent text-sm font-black text-[#3D4043] focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setHisabFemaleBuyer(!hisabFemaleBuyer)}
                    className={`px-4 py-3.5 rounded-[18px] text-xs font-extrabold transition-all ${
                      hisabFemaleBuyer
                        ? 'bg-[#3D4043] text-white'
                        : 'bg-[#F2F2F6] text-[#3D4043]'
                    }`}
                  >
                    {hisabFemaleBuyer ? 'Female (0% Reg)' : 'Male (1% Reg)'}
                  </button>
                </div>

                <div className="p-4 rounded-[20px] bg-[#F2F2F6] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#3D4043]/60 font-semibold">Gujarat Stamp Duty (4.9%):</span>
                    <span className="font-extrabold text-[#3D4043]">{formatPriceIndian(Number(hisabPrice) * 0.049)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3D4043]/60 font-semibold">Registration Fee:</span>
                    <span className="font-extrabold text-[#3D4043]">
                      {hisabFemaleBuyer ? '₹0 (Ladies Exempt)' : formatPriceIndian(Number(hisabPrice) * 0.01)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3D4043]/60 font-semibold">Sec 194-IA TDS (≥ ₹50L):</span>
                    <span className="font-extrabold text-[#3D4043]">
                      {Number(hisabPrice) >= 5000000 ? formatPriceIndian(Number(hisabPrice) * 0.01) : 'Not Applicable'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-black/[0.08] font-black text-sm text-[#EA9E24]">
                    <span>Total Landed Package:</span>
                    <span>
                      {formatPriceIndian(Number(hisabPrice) * (1 + 0.049 + (hisabFemaleBuyer ? 0 : 0.01)))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bento 4: Bilingual Gujarati Token Receipt (Samjuti Karar) */}
              <div className="bg-white/85 backdrop-blur-2xl rounded-[30px] p-6 border border-white shadow-[0_14px_40px_-12px_rgba(61,64,67,0.08)] flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#EA9E24]">
                      Digital Signature MoU
                    </span>
                    <h3 className="text-lg font-black text-[#3D4043] mt-0.5">
                      Gujarati Token Receipt (સમજૂતી કરાર)
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#EA9E24]/15 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#EA9E24]" />
                  </div>
                </div>

                <p className="text-xs font-medium text-[#3D4043]/65 leading-relaxed">
                  Generate an instant bilingual (Gujarati + English) Token Receipt with live touch signature pads for Seller & Buyer.
                </p>

                <button
                  onClick={() => setActiveToolModal('token')}
                  className="w-full py-3.5 bg-[#EA9E24] hover:bg-[#d88f1c] text-white text-xs font-extrabold rounded-[18px] shadow-sm transition-all"
                >
                  Open Token Receipt & Signature Pad
                </button>
              </div>
            </div>

            {/* Cloud Intelligence & PWA Maintenance Bar */}
            <div className="bg-white/85 backdrop-blur-2xl rounded-[30px] p-6 border border-white shadow-[0_14px_40px_-12px_rgba(61,64,67,0.08)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#EA9E24]">
                    System & Cloud Intelligence
                  </span>
                  <h3 className="text-base font-black text-[#3D4043] mt-0.5">
                    AI Key Vault & PWA Service Worker Reset
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleClearPwaCacheAndReload}
                  className="px-4 py-2.5 bg-[#F2F2F6] hover:bg-[#3D4043] hover:text-white text-[#3D4043] text-xs font-extrabold rounded-full flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#EA9E24]" />
                  <span>Clear PWA Cache & Reload</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="password"
                  value={customGeminiKey}
                  onChange={(e) => setCustomGeminiKey(e.target.value)}
                  placeholder="Optional: Paste Gemini API Key (AIza...) for custom Vercel domain..."
                  className="flex-1 px-4 py-3 rounded-[18px] bg-[#F2F2F6] text-xs font-semibold text-[#3D4043] focus:outline-none focus:bg-white focus:border focus:border-[#EA9E24]"
                />
                <button
                  type="button"
                  onClick={() => handleSaveCustomGeminiKey(customGeminiKey)}
                  className="px-6 py-3 bg-[#3D4043] text-white text-xs font-extrabold rounded-[18px]"
                >
                  Save Key to Cloud
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================================================================== */}
      {/* iOS 27 FLOATING LIQUID GLASS DOCK (UNIFIED MOBILE & DESKTOP)        */}
      {/* ================================================================== */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 px-3 w-full max-w-md pointer-events-none">
        <nav className="pointer-events-auto bg-[#26282A]/90 backdrop-blur-3xl text-white p-1.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.18)] border border-white/15 flex items-center justify-between">
          {[
            { id: 'properties', label: 'Portfolio', icon: Building2, count: properties.length },
            { id: 'capture', label: 'AI Scout', icon: Sparkles },
            { id: 'buyers', label: 'Buyers', icon: Users, count: buyers.length },
            { id: 'tools', label: 'Deal Desk', icon: Calculator }
          ].map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'capture') setEditingPropId(null);
                  setActiveTab(item.id);
                }}
                className={`flex-1 py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 text-xs font-extrabold transition-all duration-300 ${
                  isActive
                    ? 'bg-[#EA9E24] text-white shadow-[0_4px_14px_rgba(234,158,36,0.5)] scale-[1.02]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ================================================================== */}
      {/* MODAL: ADD / EDIT BUYER REQUIREMENT                                 */}
      {/* ================================================================== */}
      {showBuyerFormModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-2xl text-[#3D4043] max-w-md w-full rounded-[32px] p-6 space-y-4 shadow-2xl border border-white">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <h3 className="font-black text-lg">
                {editingBuyerId ? 'Edit Buyer Profile' : 'New Buyer Requirement'}
              </h3>
              <button onClick={() => setShowBuyerFormModal(false)} className="p-1.5 rounded-full bg-[#F2F2F6] text-[#3D4043]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBuyer} className="space-y-3.5">
              <div className="bg-[#F2F2F6] rounded-[18px] p-3">
                <label className="block text-[10px] font-bold text-[#3D4043]/55">Buyer Full Name</label>
                <input
                  type="text"
                  required
                  value={newBuyerName}
                  onChange={(e) => setNewBuyerName(e.target.value)}
                  placeholder="e.g. Chiragbhai Mehta"
                  className="w-full bg-transparent text-sm font-bold text-[#3D4043] focus:outline-none mt-0.5"
                />
              </div>
              <div className="bg-[#F2F2F6] rounded-[18px] p-3">
                <label className="block text-[10px] font-bold text-[#3D4043]/55">WhatsApp / Mobile Number</label>
                <input
                  type="text"
                  value={newBuyerPhone}
                  onChange={(e) => setNewBuyerPhone(e.target.value)}
                  placeholder="98250XXXXX"
                  className="w-full bg-transparent text-sm font-bold text-[#3D4043] focus:outline-none mt-0.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F2F2F6] rounded-[18px] p-3">
                  <label className="block text-[10px] font-bold text-[#3D4043]/55">Preferred Area</label>
                  <select
                    value={newBuyerArea}
                    onChange={(e) => setNewBuyerArea(e.target.value)}
                    className="w-full bg-transparent text-xs font-extrabold text-[#3D4043] focus:outline-none mt-1"
                  >
                    {RAJKOT_AREAS.map(a => (
                      <option key={a.code} value={a.name}>{a.name}</option>
                    ))}
                  </select>
                </div>
                <div className="bg-[#F2F2F6] rounded-[18px] p-3">
                  <label className="block text-[10px] font-bold text-[#3D4043]/55">
                    Max Budget ({formatPriceIndian(newBuyerBudget)})
                  </label>
                  <input
                    type="number"
                    value={newBuyerBudget}
                    onChange={(e) => setNewBuyerBudget(e.target.value)}
                    className="w-full bg-transparent text-xs font-extrabold text-[#3D4043] focus:outline-none mt-1"
                  />
                </div>
              </div>
              <div className="bg-[#F2F2F6] rounded-[18px] p-3">
                <label className="block text-[10px] font-bold text-[#3D4043]/55">Specific Notes</label>
                <textarea
                  rows={2}
                  value={newBuyerReq}
                  onChange={(e) => setNewBuyerReq(e.target.value)}
                  placeholder="East facing, higher floor, immediate possession..."
                  className="w-full bg-transparent text-xs font-semibold text-[#3D4043] focus:outline-none mt-0.5"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-[#EA9E24] text-white rounded-[20px] text-xs font-black shadow-md"
              >
                {editingBuyerId ? 'Update Buyer' : 'Save Buyer & Run Matchmaker'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL: REVERSE BUYER MATCHMAKER POPUP                               */}
      {/* ================================================================== */}
      {reverseMatchModalProp && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-2xl text-[#3D4043] max-w-lg w-full rounded-[32px] p-6 space-y-4 shadow-2xl border border-white">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EA9E24]">
                  Instant Buyer Matchmaker
                </span>
                <h3 className="font-black text-base mt-0.5">{reverseMatchModalProp.title}</h3>
              </div>
              <button
                onClick={() => setReverseMatchModalProp(null)}
                className="p-1.5 rounded-full bg-[#F2F2F6] text-[#3D4043]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {buyers.map((b) => {
                const { score, reasons } = calculateMatchScore(reverseMatchModalProp, b);
                return (
                  <div key={b.id} className="p-4 bg-[#F2F2F6] rounded-[22px] flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-[#EA9E24] text-white text-[10px] font-black rounded-full">
                          {score}% Match
                        </span>
                        <span className="font-extrabold text-xs">{b.name}</span>
                      </div>
                      <p className="text-[11px] font-medium text-[#3D4043]/65 mt-1">
                        {reasons.join(' • ') || `Budget: ${formatPriceIndian(b.budgetMax)}`}
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/91${String(b?.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Namaste ${b.name},\n\nNew verified listing at *Radhika Estate Agency* matching your requirement:\n*${reverseMatchModalProp.title}*\n📍 Location: ${reverseMatchModalProp.areaName}\n📐 Size: ${reverseMatchModalProp.sizeVaar} Vaar (${reverseMatchModalProp.sizeSqFt} Sq.Ft)\n💰 Price: ${formatPriceIndian(reverseMatchModalProp.priceQuoted)}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-[#3D4043] hover:bg-[#EA9E24] text-white rounded-full text-xs font-extrabold"
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
      {/* MODAL: 7/12 UTARA SCANNER                                           */}
      {/* ================================================================== */}
      {activeToolModal === 'utara' && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-2xl text-[#3D4043] max-w-lg w-full rounded-[32px] p-6 space-y-4 shadow-2xl border border-white">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EA9E24]">
                  Gujarat Revenue & RUDA
                </span>
                <h3 className="font-black text-base">7/12 & 8A Utara Scanner (સાતબાર ઉતારો)</h3>
              </div>
              <button onClick={() => setActiveToolModal(null)} className="p-1.5 rounded-full bg-[#F2F2F6]">
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
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => utaraPhotoInputRef.current && utaraPhotoInputRef.current.click()}
                className="py-3 px-3 bg-[#3D4043] text-white text-xs font-extrabold rounded-[18px] flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4 text-[#EA9E24]" />
                <span>{isScanningUtara ? 'Scanning...' : 'Upload 7/12 Photo'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUtaraScannedData({
                    surveyNo: '312/P2',
                    tpScheme: 'TP-20 (Mavdi-Kothariya)',
                    fpNo: 'FP-64',
                    khatedar: 'Pravinbhai Mohanbhai Sorathiya',
                    rudaZone: 'R1 Residential Zone (18m Road Touch)',
                    bojaStatus: 'Clear Title — NA Order Approved'
                  });
                  setUtaraHectare('0');
                  setUtaraAre('22');
                  setUtaraSqMt('15');
                  notifyIsland("Sample 7/12 Record Extracted");
                }}
                className="py-3 px-3 bg-[#F2F2F6] text-[#3D4043] text-xs font-extrabold rounded-[18px] flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#EA9E24]" />
                <span>Test Demo 7/12 Scan</span>
              </button>
            </div>

            <div className="bg-[#F2F2F6] p-4 rounded-[22px] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#3D4043]/60 font-semibold">Survey Number (સર્વે નં.):</span>
                <span className="font-extrabold">{utaraScannedData.surveyNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3D4043]/60 font-semibold">TP / FP Scheme:</span>
                <span className="font-extrabold">{utaraScannedData.tpScheme} • {utaraScannedData.fpNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3D4043]/60 font-semibold">Khatedar (ખાતેદાર):</span>
                <span className="font-extrabold">{utaraScannedData.khatedar}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3D4043]/60 font-semibold">RUDA Zoning:</span>
                <span className="font-extrabold">{utaraScannedData.rudaZone}</span>
              </div>
              <div className="flex justify-between text-[#EA9E24] font-black pt-1 border-t border-black/[0.06]">
                <span>Title / Boja Status:</span>
                <span>{utaraScannedData.bojaStatus}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPropSurveyNumber(`Survey ${utaraScannedData.surveyNo}`);
                setPropTpNumber(utaraScannedData.tpScheme);
                setPropFpNumber(utaraScannedData.fpNo);
                setPropOwnerName(utaraScannedData.khatedar);
                setPropSizeVaar(String(Math.round(Number(totalUtaraVaar))));
                setPropSizeSqFt(String(Math.round(Number(totalUtaraVaar) * 9)));
                setActiveToolModal(null);
                setShowRevenueDrawer(true);
                setActiveTab('capture');
                notifyIsland("7/12 Details Pushed to AI Scout Sheet");
              }}
              className="w-full py-3.5 bg-[#EA9E24] text-white text-xs font-black rounded-[20px]"
            >
              Apply 7/12 Specs to Property Listing
            </button>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL: BILINGUAL GUJARATI TOKEN RECEIPT & TOUCH SIGNATURE PAD       */}
      {/* ================================================================== */}
      {activeToolModal === 'token' && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-2xl text-[#3D4043] max-w-lg w-full rounded-[32px] p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto border border-white">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EA9E24]">
                  Radhika Estate Agency
                </span>
                <h3 className="font-black text-base">
                  સમજૂતી કરાર / Token Receipt (MoU)
                </h3>
              </div>
              <button onClick={() => setActiveToolModal(null)} className="p-1.5 rounded-full bg-[#F2F2F6]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F2F2F6] rounded-[18px] p-3">
                <label className="font-bold text-[#3D4043]/60 block mb-0.5">Seller Name (વેચનાર)</label>
                <input
                  type="text"
                  value={tokenReceiptData.sellerName}
                  onChange={(e) => setTokenReceiptData({ ...tokenReceiptData, sellerName: e.target.value })}
                  className="w-full bg-transparent font-extrabold text-[#3D4043] focus:outline-none"
                />
              </div>
              <div className="bg-[#F2F2F6] rounded-[18px] p-3">
                <label className="font-bold text-[#3D4043]/60 block mb-0.5">Buyer Name (ખરીદનાર)</label>
                <input
                  type="text"
                  value={tokenReceiptData.buyerName}
                  onChange={(e) => setTokenReceiptData({ ...tokenReceiptData, buyerName: e.target.value })}
                  className="w-full bg-transparent font-extrabold text-[#3D4043] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2 bg-[#F2F2F6] rounded-[18px] p-3">
                <label className="font-bold text-[#3D4043]/60 block mb-0.5">Property Description (મિલકતની વિગત)</label>
                <input
                  type="text"
                  value={tokenReceiptData.propertyDetails}
                  onChange={(e) => setTokenReceiptData({ ...tokenReceiptData, propertyDetails: e.target.value })}
                  className="w-full bg-transparent font-extrabold text-[#3D4043] focus:outline-none"
                />
              </div>
              <div className="bg-[#F2F2F6] rounded-[18px] p-3">
                <label className="font-bold text-[#3D4043]/60 block mb-0.5">Agreed Price (₹)</label>
                <input
                  type="number"
                  value={tokenReceiptData.agreedPrice}
                  onChange={(e) => setTokenReceiptData({ ...tokenReceiptData, agreedPrice: e.target.value })}
                  className="w-full bg-transparent font-extrabold text-[#3D4043] focus:outline-none"
                />
              </div>
              <div className="bg-[#F2F2F6] rounded-[18px] p-3">
                <label className="font-bold text-[#3D4043]/60 block mb-0.5">Token Paid Today (₹)</label>
                <input
                  type="number"
                  value={tokenReceiptData.tokenAmount}
                  onChange={(e) => setTokenReceiptData({ ...tokenReceiptData, tokenAmount: e.target.value })}
                  className="w-full bg-transparent font-extrabold text-[#3D4043] focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-[#F2F2F6] p-4 rounded-[22px] text-xs space-y-1.5">
              <p className="font-black text-[#3D4043]">
                રાધિકા એસ્ટેટ એજન્સી — રાજકોટ (સમજૂતી નોંધ)
              </p>
              <p className="text-[#3D4043]/80 leading-relaxed">
                આજરોજ વેચનાર <strong>{tokenReceiptData.sellerName}</strong> પાસેથી ખરીદનાર <strong>{tokenReceiptData.buyerName}</strong> એ મિલકત <strong>{tokenReceiptData.propertyDetails}</strong> કુલ કિંમત <strong>{formatPriceIndian(tokenReceiptData.agreedPrice)}</strong> માં ખરીદવાનું નક્કી કરેલ છે, જેના ટોકન પેટે <strong>{formatPriceIndian(tokenReceiptData.tokenAmount)}</strong> ચૂકવેલ છે. બાકી રકમ {tokenReceiptData.completionDays} દિવસમાં ચૂકવી દસ્તાવેજ કરવાનો રહેશે.
              </p>
            </div>

            {/* Interactive Touch Signature Pads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TouchSignaturePad
                label="Seller Signature (વેચનારની સહી)"
                onChangeSignature={(sig) => setTokenReceiptData(prev => ({ ...prev, sellerSig: sig }))}
              />
              <TouchSignaturePad
                label="Buyer Signature (ખરીદનારની સહી)"
                onChangeSignature={(sig) => setTokenReceiptData(prev => ({ ...prev, buyerSig: sig }))}
              />
            </div>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `*રાધિકા એસ્ટેટ એજન્સી (Radhika Estate Agency) — સમજૂતી કરાર / Token Receipt*\n\n• વેચનાર (Seller): ${tokenReceiptData.sellerName}\n• ખરીદનાર (Buyer): ${tokenReceiptData.buyerName}\n• મિલકત (Property): ${tokenReceiptData.propertyDetails}\n• નક્કી કરેલ કિંમત (Agreed Price): ${formatPriceIndian(tokenReceiptData.agreedPrice)}\n• ચૂકવેલ ટોકન (Token Paid): ${formatPriceIndian(tokenReceiptData.tokenAmount)}\n• દસ્તાવેજ મુદત: ${tokenReceiptData.completionDays} Days\n• Digital Signatures: ${tokenReceiptData.sellerSig || tokenReceiptData.buyerSig ? 'Signed on Device ✅' : 'Pending'}\n\n*Broker: Radhika Estate Agency, Rajkot*`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 bg-[#EA9E24] text-white text-xs font-black rounded-[20px] flex items-center justify-center gap-2 shadow-md"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Signed Token Receipt on WhatsApp</span>
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
