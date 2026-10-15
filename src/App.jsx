import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Camera, Mic, Square, MapPin, Lock, Unlock,
  Building2, Users, Calculator, Search,
  CheckCircle2, Phone, MessageSquare, FileText,
  RefreshCw, Trash2, Compass, Download, Upload,
  X, Cloud, Eye, ChevronRight, ChevronDown,
  PenTool, Printer, Scale, Star, Wrench,
  Edit3, Sparkles, Navigation, Clock, Share2,
  Check, AlertCircle, Volume2, Plus
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
// FIREBASE CLOUD INITIALIZATION (STRICT RULE 1, 2, 3 COMPLIANCE)
// ============================================================================
const firebaseConfig = typeof __firebase_config !== 'undefined' && __firebase_config
  ? JSON.parse(__firebase_config)
  : { apiKey: "demo-key", authDomain: "demo.firebaseapp.com", projectId: "demo-project" };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'radhika-estate-agency-os';

// ============================================================================
// RADHIKA ESTATE AGENCY - EXACT UNALTERED BRAND LOGO LOCK
// Displays the exact uploaded PHOTO-2026-10-14-16-28-58.JPG image or allows
// locking the original JPG directly into Cloud Firestore so it is never altered.
// ============================================================================
const ExactRadhikaBrandLogo = ({ customLogoUrl, onUploadLogo }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="inline-flex items-center gap-2 select-none">
      <label
        title="Tap to lock your exact PHOTO-2026-10-14-16-28-58.JPG logo file"
        className="cursor-pointer flex items-center gap-2.5 group"
      >
        {customLogoUrl ? (
          <img
            src={customLogoUrl}
            alt="Radhika Estate Agency"
            className="h-11 sm:h-12 w-auto object-contain bg-white rounded-lg"
          />
        ) : !imgError ? (
          <img
            src="PHOTO-2026-10-14-16-28-58.JPG"
            alt="Radhika Estate Agency"
            onError={() => setImgError(true)}
            className="h-11 sm:h-12 w-auto object-contain bg-white"
          />
        ) : (
          <div className="flex items-center gap-2.5">
            <svg
              viewBox="0 0 420 190"
              className="h-11 sm:h-12 w-auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="420" height="190" fill="#FFFFFF" />
              <polygon points="124,78 136,70 136,120 124,120" fill="#EA9E24" />
              <polygon points="141,60 173,41 173,120 141,120" fill="#EA9E24" />
              <polygon points="160,21 186,36 186,120 178,120 178,38 160,29" fill="#3D4043" />
              <polygon points="191,51 203,58 203,120 191,120" fill="#3D4043" />
              <polygon
                points="110,120 212,120 212,114 220,114 249,71 278,114 286,114 286,120 269,120 249,89 229,120"
                fill="#EA9E24"
              />
              <rect x="240" y="99" width="7.5" height="7.5" fill="#EA9E24" />
              <rect x="250.5" y="99" width="7.5" height="7.5" fill="#EA9E24" />
              <rect x="240" y="109.5" width="7.5" height="7.5" fill="#EA9E24" />
              <rect x="250.5" y="109.5" width="7.5" height="7.5" fill="#EA9E24" />
              <polygon
                points="273,90 286,73 300,93 300,80 309,80 309,107 315,114 315,120 295,120 284,102 278,96"
                fill="#3D4043"
              />
              <text
                x="210"
                y="162"
                textAnchor="middle"
                fill="#434649"
                fontFamily="Inter, system-ui, sans-serif"
                fontWeight="700"
                fontSize="31"
                letterSpacing="-0.5"
              >
                Radhika Estate Agency
              </text>
            </svg>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={onUploadLogo}
          className="hidden"
        />
      </label>
    </div>
  );
};

// ============================================================================
// RAJKOT MICRO-MARKETS & CLEAN SAMPLE DATA
// ============================================================================
const RAJKOT_AREAS = [
  { name: 'Kalawad Road', code: 'KLWD', lat: 22.2839, lng: 70.7582, avgFlatSqFt: 5400, avgPlotVaar: 88000, jantriFlatSqFt: 2850, jantriPlotVaar: 42000, defaultTp: 'TP-22 (Mota Mava)', rudaZone: 'R1 Residential Prime' },
  { name: '150 Ft Ring Road', code: '150R', lat: 22.2753, lng: 70.7792, avgFlatSqFt: 5800, avgPlotVaar: 105000, jantriFlatSqFt: 3200, jantriPlotVaar: 51000, defaultTp: 'TP-16 (Ring Road)', rudaZone: 'Commercial / R2' },
  { name: 'Mavdi', code: 'MAVD', lat: 22.2569, lng: 70.7768, avgFlatSqFt: 4100, avgPlotVaar: 64000, jantriFlatSqFt: 2100, jantriPlotVaar: 29500, defaultTp: 'TP-14 (Mavdi)', rudaZone: 'R1 Residential' },
  { name: 'Nana Mava', code: 'NMAV', lat: 22.2736, lng: 70.7644, avgFlatSqFt: 5100, avgPlotVaar: 82000, jantriFlatSqFt: 2650, jantriPlotVaar: 39000, defaultTp: 'TP-20 (Nana Mava)', rudaZone: 'R1 Residential Prime' },
  { name: 'Raiya Road', code: 'RAIY', lat: 22.3012, lng: 70.7615, avgFlatSqFt: 4800, avgPlotVaar: 76000, jantriFlatSqFt: 2450, jantriPlotVaar: 35000, defaultTp: 'TP-28 (Raiya)', rudaZone: 'R1 Residential' },
  { name: 'Amin Marg', code: 'AMIN', lat: 22.2864, lng: 70.7810, avgFlatSqFt: 6200, avgPlotVaar: 118000, jantriFlatSqFt: 3500, jantriPlotVaar: 58000, defaultTp: 'TP-09 (Amin Marg)', rudaZone: 'R1 Luxury Residential' },
  { name: 'University Road', code: 'UNIV', lat: 22.2918, lng: 70.7429, avgFlatSqFt: 5300, avgPlotVaar: 85000, jantriFlatSqFt: 2700, jantriPlotVaar: 41000, defaultTp: 'TP-25 (Munjka)', rudaZone: 'R1 Institutional' },
  { name: 'Metoda GIDC', code: 'METO', lat: 22.2385, lng: 70.6621, avgFlatSqFt: 2900, avgPlotVaar: 24500, jantriFlatSqFt: 1500, jantriPlotVaar: 12500, defaultTp: 'Metoda GIDC Ph-2', rudaZone: 'GIDC Industrial' }
];

const PROPERTY_CATEGORIES = [
  'Residential Flat',
  'Tenament / Bungalow',
  'Open Plot',
  'Commercial Shop / Office',
  'Industrial GIDC Shed',
  'Agricultural Land'
];

const SAMPLE_PROPERTIES = [
  {
    id: 'prop-rea-101',
    uniqueCode: 'REA-101',
    photoFileName: 'REA_KLWD_20261015_163012.jpg',
    title: '3 BHK Royal Luxuria • Kalawad Road',
    category: 'Residential Flat',
    status: 'Available',
    microMarket: 'Kalawad Road',
    areaCode: 'KLWD',
    lat: 22.2839,
    lng: 70.7582,
    bhk: 3,
    carpetSqFt: 1320,
    areaVaar: 146.6,
    floorNo: '5th Floor',
    facing: 'North-East (Ishanya)',
    vastuCompassDeg: 68,
    frontageFt: 34,
    depthFt: 39,
    roadWidthMeters: 18,
    tpNumber: 'TP-22 (Mota Mava)',
    surveyNumber: 'Rev. Survey 312/P1',
    rudaZone: 'R1 Residential Prime',
    bojaStatus: 'Clear Title • No Bank Boja',
    cornerPlot: true,
    quotedPriceLakhs: 64.5,
    bottomPriceLakhs: 61.5,
    sourceType: 'Direct Owner',
    ownerName: 'Rameshbhai Patel',
    ownerPhone: '9825012345',
    keyLocation: 'Watchman Bhimabhai at Gate 1',
    publicHighlights: 'East-Ishanya Vastu entry, 2 car parkings, modular kitchen ready, 18m TP road touch.',
    voiceTranscript: '3 BHK flat on Kalawad Road behind Crystal Mall, 1320 carpet, 5th floor, asking 64.5 lakhs.',
    clientViews: 6,
    lastVerifiedAt: Date.now() - 4 * 86400000,
    createdAt: Date.now() - 4 * 86400000
  },
  {
    id: 'prop-rea-102',
    uniqueCode: 'REA-102',
    photoFileName: 'REA_MAVD_20261012_111540.jpg',
    title: '200 Vaar Corner Plot • Mavdi TP-14',
    category: 'Open Plot',
    status: 'Available',
    microMarket: 'Mavdi',
    areaCode: 'MAVD',
    lat: 22.2569,
    lng: 70.7768,
    bhk: 0,
    carpetSqFt: 1800,
    areaVaar: 200,
    floorNo: 'NA Open Plot',
    facing: 'East (Surya Entry)',
    vastuCompassDeg: 84,
    frontageFt: 40,
    depthFt: 45,
    roadWidthMeters: 12,
    tpNumber: 'TP-14 (Mavdi)',
    surveyNumber: 'Survey No. 188/2',
    rudaZone: 'R1 Residential',
    bojaStatus: '7/12 Clear • NA Order Approved',
    cornerPlot: true,
    quotedPriceLakhs: 126,
    bottomPriceLakhs: 120,
    sourceType: 'Co-Broker (50:50)',
    ownerName: 'Via Hareshbhai (Omkar Estate)',
    ownerPhone: '9825055555',
    keyLocation: 'Open Plot - Direct Site Visit',
    publicHighlights: '40ft × 45ft corner plot on 12m TP road, AnyROR 7/12 & NA Title clear.',
    voiceTranscript: '200 Vaar corner plot in Mavdi TP 14, 40 by 45 dimensions, total 1.26 Cr.',
    clientViews: 3,
    lastVerifiedAt: Date.now() - 24 * 86400000,
    createdAt: Date.now() - 24 * 86400000
  },
  {
    id: 'prop-rea-103',
    uniqueCode: 'REA-103',
    photoFileName: 'REA_METO_20261010_142005.jpg',
    title: '900 Vaar Industrial Shed • Metoda GIDC',
    category: 'Industrial GIDC Shed',
    status: 'Available',
    microMarket: 'Metoda GIDC',
    areaCode: 'METO',
    lat: 22.2385,
    lng: 70.6621,
    bhk: 0,
    carpetSqFt: 8100,
    areaVaar: 900,
    floorNo: 'Ground + Mezzanine',
    facing: 'North (Kuber Entry)',
    vastuCompassDeg: 12,
    frontageFt: 60,
    depthFt: 135,
    roadWidthMeters: 24,
    tpNumber: 'Metoda GIDC Gate 2',
    surveyNumber: 'GIDC Plot #G-2104',
    rudaZone: 'GIDC Industrial',
    bojaStatus: 'GIDC Lease Clear',
    cornerPlot: false,
    quotedPriceLakhs: 210,
    bottomPriceLakhs: 196,
    sourceType: 'Direct Owner',
    ownerName: 'Vikasbhai Virani',
    ownerPhone: '9909911223',
    keyLocation: 'Manager Manojbhai on site',
    publicHighlights: '60ft × 135ft Heavy Industrial Shed on 24m road, 125 HP power connection ready.',
    voiceTranscript: 'Metoda GIDC Gate 2 shed, 900 vaar, 60 by 135 ft, asking 2.10 Cr.',
    clientViews: 9,
    lastVerifiedAt: Date.now() - 8 * 86400000,
    createdAt: Date.now() - 8 * 86400000
  }
];

const SAMPLE_LEADS = [
  {
    id: 'lead-201',
    name: 'Chiragbhai Kotecha',
    phone: '9824288990',
    preferredAreas: ['Kalawad Road', 'Nana Mava', '150 Ft Ring Road'],
    preferredCategories: ['Residential Flat'],
    minBhk: 3,
    minVaar: 120,
    budgetMinLakhs: 55,
    budgetMaxLakhs: 72,
    notes: 'East / Ishanya facing, middle floor, ready possession.',
    createdAt: Date.now() - 2 * 86400000
  },
  {
    id: 'lead-202',
    name: 'Ketanbhai Sorathiya',
    phone: '9879122334',
    preferredAreas: ['Mavdi', '150 Ft Ring Road'],
    preferredCategories: ['Open Plot', 'Tenament / Bungalow'],
    minBhk: 0,
    minVaar: 180,
    budgetMinLakhs: 105,
    budgetMaxLakhs: 135,
    notes: 'Looking for 180-220 Vaar corner plot in Mavdi TP-14.',
    createdAt: Date.now() - 5 * 86400000
  }
];

const INITIAL_CO_BROKERS = [
  {
    id: 'cb-1',
    name: 'Hareshbhai Patel',
    agency: 'Omkar Estate (Mavdi)',
    phone: '9825055555',
    specialtyArea: 'Mavdi & 150 Ft Ring Road',
    trustScore: 5,
    chainType: 'Direct 50:50 Split',
    notes: 'Direct contact with Mavdi TP-14 plot owners.'
  },
  {
    id: 'cb-2',
    name: 'Sanjaybhai Kotecha',
    agency: 'Saurashtra Prime Deals',
    phone: '9879044444',
    specialtyArea: 'Kalawad Road & Nana Mava',
    trustScore: 4,
    chainType: 'Direct 50:50 Split',
    notes: 'Strong luxury 3/4 BHK builder inventory on Kalawad Rd.'
  }
];

// ============================================================================
// HELPER UTILITIES
// ============================================================================
const formatPriceIndian = (lakhs) => {
  const num = Number(lakhs) || 0;
  if (num >= 100) return `₹${(num / 100).toFixed(2)} Cr`;
  return `₹${Number(num.toFixed(2))} Lakh`;
};

const generateUniquePropCode = () => `REA-${Math.floor(100 + Math.random() * 900)}`;

const generatePhotoFileName = (areaCode = 'KLWD') => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `REA_${areaCode}_${yyyy}${mm}${dd}_${hh}${min}.jpg`;
};

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const res = reader.result || '';
      resolve(res.includes(',') ? res.split(',')[1] : res);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const evaluateMarketBadge = (prop) => {
  const areaObj = RAJKOT_AREAS.find((a) => a.name === prop.microMarket) || RAJKOT_AREAS[0];
  const isLand = prop.category.includes('Plot') || prop.category.includes('Shed') || prop.category.includes('Land');
  if (isLand) {
    const rate = Math.round(((Number(prop.quotedPriceLakhs) || 0) * 100000) / Math.max(1, Number(prop.areaVaar) || 1));
    const diff = Math.round(((rate - areaObj.avgPlotVaar) / areaObj.avgPlotVaar) * 100);
    if (diff <= -8) return { label: 'Good Value', rateText: `₹${rate.toLocaleString('en-IN')}/Vaar`, color: 'text-emerald-700 bg-emerald-50' };
    if (diff >= 15) return { label: 'Above Avg', rateText: `₹${rate.toLocaleString('en-IN')}/Vaar`, color: 'text-amber-800 bg-amber-50' };
    return { label: 'Market Rate', rateText: `₹${rate.toLocaleString('en-IN')}/Vaar`, color: 'text-slate-600 bg-slate-100' };
  }
  const rate = Math.round(((Number(prop.quotedPriceLakhs) || 0) * 100000) / Math.max(1, Number(prop.carpetSqFt) || 1));
  const diff = Math.round(((rate - areaObj.avgFlatSqFt) / areaObj.avgFlatSqFt) * 100);
  if (diff <= -8) return { label: 'Good Value', rateText: `₹${rate.toLocaleString('en-IN')}/Sq.Ft`, color: 'text-emerald-700 bg-emerald-50' };
  if (diff >= 15) return { label: 'Above Avg', rateText: `₹${rate.toLocaleString('en-IN')}/Sq.Ft`, color: 'text-amber-800 bg-amber-50' };
  return { label: 'Market Rate', rateText: `₹${rate.toLocaleString('en-IN')}/Sq.Ft`, color: 'text-slate-600 bg-slate-100' };
};

// Clean 2D Plot / Shop Frontage Diagram (Used Inside Property Drawer & Tools)
const SimplePlotDiagram = ({ frontageFt = 35, depthFt = 45, roadWidthMeters = 18, facing = 'East' }) => {
  const f = Math.max(10, Number(frontageFt) || 32);
  const d = Math.max(10, Number(depthFt) || 40);
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-4">
      <div className="w-28 h-20 border-2 border-[#EA9E24] bg-amber-50/60 rounded-lg flex flex-col items-center justify-center text-center p-1 shrink-0">
        <span className="text-xs font-extrabold text-[#3D4043]">{f}ft × {d}ft</span>
        <span className="text-[10px] font-semibold text-slate-500">{Math.round((f * d) / 9)} Vaar</span>
        <span className="text-[9px] font-bold text-emerald-700 mt-0.5">▲ {facing.split(' ')[0]} Entry</span>
      </div>
      <div className="text-xs space-y-1 flex-1">
        <div className="font-bold text-[#3D4043]">Frontage × Depth Layout</div>
        <div className="text-slate-600">Frontage: <b>{f} ft</b> • Depth: <b>{d} ft</b></div>
        <div className="text-slate-600">Road in Front: <b>{roadWidthMeters}m TP Road</b></div>
      </div>
    </div>
  );
};

// Clean Watermark Renderer for Captured Photos
const stampPhotoWithMetadata = (sourceImg, meta) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 520;
    const ctx = canvas.getContext('2d');

    const drawFooter = () => {
      ctx.fillStyle = 'rgba(61, 64, 67, 0.92)';
      ctx.fillRect(0, 448, 800, 72);
      ctx.fillStyle = '#EA9E24';
      ctx.fillRect(0, 448, 800, 3);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`Radhika Estate Agency  •  ${meta.uniqueCode}  •  ${meta.microMarket}, Rajkot`, 18, 476);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '13px sans-serif';
      ctx.fillText(
        `File: ${meta.fileName}   |   Captured: ${meta.timestampStr}   |   GPS: ${Number(meta.lat).toFixed(4)}°N, ${Number(meta.lng).toFixed(4)}°E`,
        18,
        502
      );
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };

    if (sourceImg) {
      const img = new Image();
      img.onload = () => {
        const scale = Math.max(800 / img.width, 520 / img.height);
        const x = 400 - (img.width / 2) * scale;
        const y = 260 - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        drawFooter();
      };
      img.src = sourceImg;
    } else {
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(0, 0, 800, 520);
      drawFooter();
    }
  });
};

// Comprehensive Multi-Factor Compatibility Engine (Returns Score 0-100 + Reasons)
const calculateMatchScore = (property, lead) => {
  if (!property || !lead) return { score: 0, reasons: [] };
  if (property.status === 'Sold') return { score: 0, reasons: ['Property Sold'] };

  let score = 0;
  const reasons = [];

  // 1. Category Match (Up to 35 pts)
  const prefCats = Array.isArray(lead.preferredCategories) ? lead.preferredCategories : [];
  if (prefCats.includes(property.category)) {
    score += 35;
    reasons.push(`Exact ${property.category}`);
  } else if (
    prefCats.some(
      (c) =>
        (c.includes('Plot') && property.category.includes('Bungalow')) ||
        (c.includes('Bungalow') && property.category.includes('Plot'))
    )
  ) {
    score += 18;
    reasons.push('Compatible Land/Tenament');
  }

  // 2. Micro-Market Location Match (Up to 30 pts)
  const prefAreas = Array.isArray(lead.preferredAreas) ? lead.preferredAreas : [];
  if (prefAreas.includes(property.microMarket)) {
    score += 30;
    reasons.push(`In ${property.microMarket}`);
  } else if (prefAreas.length === 0) {
    score += 15;
  }

  // 3. Budget Alignment (Up to 25 pts)
  const price = Number(property.quotedPriceLakhs) || 0;
  const bottom = Number(property.bottomPriceLakhs) || price;
  const maxB = Number(lead.budgetMaxLakhs) || 9999;
  const minB = Number(lead.budgetMinLakhs) || 0;

  if (price <= maxB && price >= minB * 0.8) {
    score += 25;
    reasons.push(`Within ₹${maxB}L Budget`);
  } else if (bottom <= maxB * 1.05) {
    score += 18;
    reasons.push('Negotiable Bottom Fits Budget');
  } else if (price <= maxB * 1.15) {
    score += 10;
    reasons.push('Stretch Budget (+12%)');
  }

  // 4. Size / BHK / Vastu Bonus (Up to 10 pts)
  const minBhk = Number(lead.minBhk) || 0;
  const minVaar = Number(lead.minVaar) || 0;
  if (minBhk > 0 && Number(property.bhk) >= minBhk) {
    score += 5;
    reasons.push(`${property.bhk} BHK`);
  }
  if (minVaar > 0 && Number(property.areaVaar) >= minVaar * 0.9) {
    score += 5;
    reasons.push(`${property.areaVaar} Vaar`);
  }
  if (
    (lead.notes || '').toLowerCase().includes('east') &&
    (property.facing || '').toLowerCase().includes('east')
  ) {
    score = Math.min(100, score + 5);
    reasons.push('East/Ishanya Vastu Match');
  }

  return { score: Math.min(100, score), reasons };
};

// Interactive Digital Signature Pad Component for Gujarati Token Receipt
const SignatureCanvasPad = ({ label, onSignChange }) => {
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
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
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
    if (onSignChange && canvasRef.current) {
      onSignChange(canvasRef.current.toDataURL());
    }
  };

  const clearPad = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    if (onSignChange) onSignChange(null);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-center">
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1 px-1">
        <span>{label}</span>
        {hasSigned && (
          <button
            type="button"
            onClick={clearPad}
            className="text-rose-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={200}
        height={64}
        onMouseDown={startDraw}
        onMouseMove={moveDraw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={moveDraw}
        onTouchEnd={endDraw}
        className="w-full h-16 bg-white border border-dashed border-slate-300 rounded-lg cursor-crosshair touch-none"
      />
    </div>
  );
};

const callGeminiWithBackoff = async (payload, retries = 2, delay = 800) => {
  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, delay));
      return callGeminiWithBackoff(payload, retries - 1, delay * 2);
    }
    throw err;
  }
};

// ============================================================================
// MAIN APPLICATION COMPONENT (ZERO-CLUTTER MOBILE UX + FULL EDITING & AI MATCH)
// ============================================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [cloudStatus, setCloudStatus] = useState('Synced');

  // 4 Simple Screens: 'capture' | 'inventory' | 'buyers' | 'tools'
  const [activeTab, setActiveTab] = useState('capture');

  // Database Collections
  const [properties, setProperties] = useState(SAMPLE_PROPERTIES);
  const [leads, setLeads] = useState(SAMPLE_LEADS);
  const [coBrokers, setCoBrokers] = useState(INITIAL_CO_BROKERS);
  const [customLogoUrl, setCustomLogoUrl] = useState(null);

  // Single Privacy Toggle: false = Client View (Safe), true = Broker View (All Details)
  const [brokerView, setBrokerView] = useState(false);

  // Clean Modals / Drawers & Editing States
  const [toast, setToast] = useState(null);
  const [selectedPropertyDrawer, setSelectedPropertyDrawer] = useState(null);
  const [editingPropertyModal, setEditingPropertyModal] = useState(null); // Full Property Edit Modal
  const [reverseMatchAlertModal, setReverseMatchAlertModal] = useState(null); // Auto-triggered after saving/updating a property
  const [activeToolModal, setActiveToolModal] = useState(null); // 'converter' | 'hisab' | 'karar' | 'import' | 'tour'

  // Site Visit Tour Selection State
  const [tourPropertyIds, setTourPropertyIds] = useState(['prop-rea-101', 'prop-rea-102']);
  const [tourBuyerId, setTourBuyerId] = useState('lead-201');

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  // Firebase Auth & Sync
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        setCloudStatus('Offline Ready');
      }
    };
    initAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) setCloudStatus('Cloud Synced');
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const propsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'properties');
    const leadsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'leads');
    const settingsDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'brand');

    const unsubProps = onSnapshot(
      propsCol,
      async (snap) => {
        if (snap.empty) {
          for (const p of SAMPLE_PROPERTIES) {
            await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'properties', p.id), p);
          }
        } else {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setProperties(list);
        }
      },
      () => {}
    );

    const unsubLeads = onSnapshot(
      leadsCol,
      async (snap) => {
        if (snap.empty) {
          for (const l of SAMPLE_LEADS) {
            await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'leads', l.id), l);
          }
        } else {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setLeads(list);
        }
      },
      () => {}
    );

    const unsubBrand = onSnapshot(
      settingsDoc,
      (snap) => {
        if (snap.exists() && snap.data().logoDataUrl) {
          setCustomLogoUrl(snap.data().logoDataUrl);
        }
      },
      () => {}
    );

    return () => {
      unsubProps();
      unsubLeads();
      unsubBrand();
    };
  }, [user]);

  const handleUploadBrandLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setCustomLogoUrl(dataUrl);
      if (user) {
        try {
          await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'brand'), {
            logoDataUrl: dataUrl,
            updatedAt: Date.now()
          });
        } catch (err) {}
      }
      notify('Your exact Radhika Estate Agency logo is now locked in Cloud!');
    };
    reader.readAsDataURL(file);
  };

  const savePropertyToCloud = async (propObj) => {
    setProperties((prev) => [propObj, ...prev.filter((p) => p.id !== propObj.id)]);
    if (selectedPropertyDrawer && selectedPropertyDrawer.id === propObj.id) {
      setSelectedPropertyDrawer(propObj);
    }
    if (user) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'properties', propObj.id), propObj);
      } catch (e) {}
    }
  };

  const deletePropertyFromCloud = async (id) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setSelectedPropertyDrawer(null);
    setEditingPropertyModal(null);
    if (user) {
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'properties', id));
      } catch (e) {}
    }
    notify('Property deleted.');
  };

  const saveLeadToCloud = async (leadObj) => {
    setLeads((prev) => [leadObj, ...prev.filter((l) => l.id !== leadObj.id)]);
    if (user) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'leads', leadObj.id), leadObj);
      } catch (e) {}
    }
  };

  const deleteLeadFromCloud = async (id) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (user) {
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'leads', id));
      } catch (e) {}
    }
    notify('Buyer removed.');
  };

  // ==========================================================================
  // SCREEN 1: ZERO-CLUTTER "ADD PROPERTY" (OR EDIT MODE)
  // ==========================================================================
  const createBlankCapture = () => {
    const code = generateUniquePropCode();
    return {
      uniqueCode: code,
      photoFileName: generatePhotoFileName('KLWD'),
      timestampStr: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      title: `3 BHK Flat • Kalawad Road`,
      category: 'Residential Flat',
      status: 'Available',
      microMarket: 'Kalawad Road',
      areaCode: 'KLWD',
      lat: 22.2839,
      lng: 70.7582,
      watermarkedPhotoUrl: null,
      voiceTranscript: '',
      audioBlobUrl: null,
      bhk: 3,
      carpetSqFt: 1260,
      areaVaar: 140,
      frontageFt: 32,
      depthFt: 40,
      roadWidthMeters: 18,
      floorNo: 'Middle Floor',
      facing: 'East (Surya Entry)',
      vastuCompassDeg: 82,
      tpNumber: 'TP-22 (Mota Mava)',
      surveyNumber: '',
      rudaZone: 'R1 Residential Prime',
      bojaStatus: 'Clear Title',
      quotedPriceLakhs: 65,
      bottomPriceLakhs: 62,
      sourceType: 'Direct Owner',
      ownerName: '',
      ownerPhone: '',
      keyLocation: 'With Owner',
      publicHighlights: 'Prime Rajkot locality, clear title, ready for visit.'
    };
  };

  const [draft, setDraft] = useState(createBlankCapture);
  const [showManualEditDrawer, setShowManualEditDrawer] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [isAiWorking, setIsAiWorking] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recTimerRef = useRef(null);

  // Action 1: Take or Upload Photo (Quietly tags ID, Time, GPS & Watermark)
  const handleSnapPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const code = generateUniquePropCode();
    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });

    let detectedArea = RAJKOT_AREAS.find((a) => a.name === draft.microMarket) || RAJKOT_AREAS[0];
    let liveLat = detectedArea.lat;
    let liveLng = detectedArea.lng;

    if (navigator.geolocation) {
      try {
        const pos = await new Promise((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 2500 })
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
      } catch (err) {}
    }

    const fileName = generatePhotoFileName(detectedArea.code);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const rawUrl = ev.target.result;
      const stampedUrl = await stampPhotoWithMetadata(rawUrl, {
        uniqueCode: code,
        fileName,
        microMarket: detectedArea.name,
        timestampStr: nowStr,
        lat: liveLat,
        lng: liveLng
      });

      setDraft((prev) => ({
        ...prev,
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
        title: `${prev.category} • ${detectedArea.name}`
      }));

      notify(`Photo stamped (${code} • ${detectedArea.name})`);

      // Quiet background OCR if banner or 7/12 text is visible
      setIsAiWorking(true);
      try {
        const base64Image = rawUrl.split(',')[1];
        const payload = {
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Look at this Rajkot property or 7/12 document photo. Extract any visible phone number, owner/builder name, project title, BHK, area in Vaar, or category (${PROPERTY_CATEGORIES.join(', ')}).`
                },
                { inlineData: { mimeType: file.type || 'image/jpeg', data: base64Image } }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                detectedCategory: { type: 'STRING' },
                title: { type: 'STRING' },
                phoneNumber: { type: 'STRING' },
                contactPerson: { type: 'STRING' },
                bhk: { type: 'NUMBER' },
                areaVaar: { type: 'NUMBER' },
                summary: { type: 'STRING' }
              }
            }
          }
        };
        const res = await callGeminiWithBackoff(payload);
        const rawJson = res?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          setDraft((prev) => ({
            ...prev,
            category: PROPERTY_CATEGORIES.includes(parsed.detectedCategory) ? parsed.detectedCategory : prev.category,
            title: parsed.title ? `${parsed.title} • ${prev.microMarket}` : prev.title,
            ownerPhone: parsed.phoneNumber || prev.ownerPhone,
            ownerName: parsed.contactPerson || prev.ownerName,
            bhk: parsed.bhk ?? prev.bhk,
            areaVaar: parsed.areaVaar || prev.areaVaar,
            carpetSqFt: parsed.areaVaar ? Math.round(parsed.areaVaar * 9) : prev.carpetSqFt,
            publicHighlights: parsed.summary || prev.publicHighlights
          }));
        }
      } catch (err) {
      } finally {
        setIsAiWorking(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Action 2: Speak Property Details (Multimodal Audio -> Auto-Fills Everything)
  const runVoiceExtraction = async (audioBlob, sampleText) => {
    setIsAiWorking(true);
    try {
      const parts = [
        {
          text: `Extract Rajkot property details from this voice note into JSON. 1 Vaar = 9 Sq.Ft. Convert Cr to Lakhs.
Choose microMarket from: ${RAJKOT_AREAS.map((a) => a.name).join(', ')}.
Choose category from: ${PROPERTY_CATEGORIES.join(', ')}.
${sampleText ? `Dictation: ${sampleText}` : ''}`
        }
      ];
      if (audioBlob) {
        const b64 = await blobToBase64(audioBlob);
        parts.push({ inlineData: { mimeType: audioBlob.type || 'audio/webm', data: b64 } });
      }

      const payload = {
        contents: [{ role: 'user', parts }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              transcriptSummary: { type: 'STRING' },
              title: { type: 'STRING' },
              category: { type: 'STRING' },
              microMarket: { type: 'STRING' },
              bhk: { type: 'NUMBER' },
              carpetSqFt: { type: 'NUMBER' },
              areaVaar: { type: 'NUMBER' },
              quotedPriceLakhs: { type: 'NUMBER' },
              facing: { type: 'STRING' },
              ownerName: { type: 'STRING' },
              ownerPhone: { type: 'STRING' },
              publicHighlights: { type: 'STRING' }
            }
          }
        }
      };

      const res = await callGeminiWithBackoff(payload);
      const textOut = res?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textOut) {
        const d = JSON.parse(textOut);
        const areaObj =
          RAJKOT_AREAS.find((a) => a.name.toLowerCase() === (d.microMarket || '').toLowerCase()) ||
          RAJKOT_AREAS.find((a) => a.name === draft.microMarket) ||
          RAJKOT_AREAS[0];
        const vaar = d.areaVaar ? Number(d.areaVaar) : d.carpetSqFt ? Number((d.carpetSqFt / 9).toFixed(1)) : draft.areaVaar;
        const sqft = d.carpetSqFt ? Math.round(d.carpetSqFt) : Math.round(vaar * 9);

        setDraft((prev) => ({
          ...prev,
          voiceTranscript: d.transcriptSummary || sampleText || 'Voice note recorded',
          microMarket: areaObj.name,
          areaCode: areaObj.code,
          tpNumber: areaObj.defaultTp,
          category: PROPERTY_CATEGORIES.includes(d.category) ? d.category : prev.category,
          title: d.title || `${d.bhk ? d.bhk + ' BHK ' : ''}${d.category || prev.category} • ${areaObj.name}`,
          bhk: d.bhk ?? prev.bhk,
          areaVaar: vaar,
          carpetSqFt: sqft,
          quotedPriceLakhs: d.quotedPriceLakhs ?? prev.quotedPriceLakhs,
          bottomPriceLakhs: d.quotedPriceLakhs ? Number((d.quotedPriceLakhs * 0.95).toFixed(1)) : prev.bottomPriceLakhs,
          facing: d.facing || prev.facing,
          ownerName: d.ownerName || prev.ownerName,
          ownerPhone: d.ownerPhone || prev.ownerPhone,
          publicHighlights: d.publicHighlights || d.transcriptSummary || prev.publicHighlights
        }));
        notify('Voice note extracted automatically!');
      }
    } catch (e) {
      notify('Voice note attached.');
    } finally {
      setIsAiWorking(false);
    }
  };

  const toggleVoiceRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      clearInterval(recTimerRef.current);
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setDraft((prev) => ({ ...prev, audioBlobUrl: audioUrl }));
        stream.getTracks().forEach((t) => t.stop());
        await runVoiceExtraction(audioBlob, '');
      };
      recorder.start();
      setIsRecording(true);
      setRecSeconds(0);
      recTimerRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    } catch (err) {
      // Instant simulation if microphone isn't connected on desktop preview
      await runVoiceExtraction(
        null,
        '3 BHK flat on Kalawad Road near Crystal Mall, 1350 sq ft carpet, East facing, asking 66 Lakhs, owner Rameshbhai 9825012345.'
      );
    }
  };

  const handleSaveProperty = async () => {
    const isEditingExisting = Boolean(draft.id);
    const savedProp = {
      ...draft,
      id: draft.id || `prop-${Date.now()}`,
      status: draft.status || 'Available',
      quotedPriceLakhs: Number(draft.quotedPriceLakhs) || 65,
      bottomPriceLakhs: Number(draft.bottomPriceLakhs) || 62,
      areaVaar: Number(draft.areaVaar) || 140,
      carpetSqFt: Number(draft.carpetSqFt) || 1260,
      clientViews: draft.clientViews || 1,
      lastVerifiedAt: Date.now(),
      createdAt: draft.createdAt || Date.now()
    };
    await savePropertyToCloud(savedProp);
    setDraft(createBlankCapture());
    setShowManualEditDrawer(false);

    // Automatically check if this property matches any active buyers (Reverse Matchmaker)
    const instantMatches = leads
      .map((l) => ({ lead: l, ...calculateMatchScore(savedProp, l) }))
      .filter((m) => m.score >= 55)
      .sort((a, b) => b.score - a.score);

    if (instantMatches.length > 0) {
      setReverseMatchAlertModal({
        property: savedProp,
        matches: instantMatches
      });
    } else {
      notify(isEditingExisting ? `Updated ${savedProp.uniqueCode}!` : `Saved ${savedProp.uniqueCode} to Properties!`);
    }
    setActiveTab('inventory');
  };

  // Load any existing property into the Full Edit Modal or Capture form
  const openEditPropertyModal = (prop) => {
    setEditingPropertyModal({ ...prop });
  };

  const handleSaveEditedPropertyModal = async () => {
    if (!editingPropertyModal) return;
    const updated = {
      ...editingPropertyModal,
      quotedPriceLakhs: Number(editingPropertyModal.quotedPriceLakhs) || 0,
      bottomPriceLakhs: Number(editingPropertyModal.bottomPriceLakhs) || 0,
      areaVaar: Number(editingPropertyModal.areaVaar) || 0,
      carpetSqFt: Number(editingPropertyModal.carpetSqFt) || 0,
      frontageFt: Number(editingPropertyModal.frontageFt) || 30,
      depthFt: Number(editingPropertyModal.depthFt) || 40,
      roadWidthMeters: Number(editingPropertyModal.roadWidthMeters) || 12,
      lastVerifiedAt: Date.now()
    };
    await savePropertyToCloud(updated);
    setEditingPropertyModal(null);
    notify(`Updated ${updated.uniqueCode} successfully!`);
  };

  // ==========================================================================
  // WHATSAPP SHARING, AI BUYER MATCHMAKER & TOOLS STATE
  // ==========================================================================
  const [invSearch, setInvSearch] = useState('');
  const [invAreaFilter, setInvAreaFilter] = useState('All');
  const [invStatusFilter, setInvStatusFilter] = useState('All');

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (invAreaFilter !== 'All' && p.microMarket !== invAreaFilter) return false;
      if (invStatusFilter !== 'All' && (p.status || 'Available') !== invStatusFilter) return false;
      const q = invSearch.toLowerCase();
      if (!q) return true;
      return (
        (p.title || '').toLowerCase().includes(q) ||
        (p.uniqueCode || '').toLowerCase().includes(q) ||
        (p.microMarket || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.ownerName || '').toLowerCase().includes(q)
      );
    });
  }, [properties, invAreaFilter, invStatusFilter, invSearch]);

  const sendWhatsApp = (phone, text) => {
    const digits = (phone || '').replace(/\D/g, '');
    const formatted = digits.length === 10 ? `91${digits}` : digits;
    const url = formatted
      ? `https://wa.me/${formatted}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareClientSafePropertyOnWhatsApp = (prop, phone = '', customPitch = '') => {
    const msg =
      `*Radhika Estate Agency — Rajkot*\n\n` +
      (customPitch ? `${customPitch}\n\n` : '') +
      `🏠 *${prop.title}*\n` +
      `📍 *Area:* ${prop.microMarket} (${prop.tpNumber || 'Prime Zone'})\n` +
      `📐 *Size:* ${prop.areaVaar} Vaar (${prop.carpetSqFt} Sq.Ft)\n` +
      `🧭 *Facing:* ${prop.facing || 'East Facing'}\n` +
      `💰 *Price:* ${formatPriceIndian(prop.quotedPriceLakhs)}\n` +
      `✨ *Details:* ${prop.publicHighlights}\n\n` +
      `📞 Contact *Radhika Estate Agency* for site visit (Ref: ${prop.uniqueCode}).`;
    sendWhatsApp(phone, msg);
  };

  const pingOwnerAvailabilityOnWhatsApp = async (prop) => {
    const updated = { ...prop, lastVerifiedAt: Date.now() };
    await savePropertyToCloud(updated);
    const msg =
      `નમસ્તે ${prop.ownerName || 'સર'}, *રાધિકા એસ્ટેટ એજન્સી (રાજકોટ)* માંથી.\n\n` +
      `આપની મિલકત *${prop.title}* (${prop.uniqueCode}) હાલમાં વેચાણ માટે ઉપલબ્ધ છે? અમારા ગ્રાહકને સાઈટ વિઝિટ કરાવવી છે. કૃપા કરી જણાવશો.`;
    sendWhatsApp(prop.ownerPhone, msg);
  };

  // AI Instant Buyer Requirement Matcher (Type or Speak Any Requirement -> Ranked Compatible Properties + AI Pitch)
  const [aiQueryText, setAiQueryText] = useState('');
  const [isAiMatchRunning, setIsAiMatchRunning] = useState(false);
  const [aiMatchResults, setAiMatchResults] = useState(null); // { parsedLead, rankedMatches }
  const [isBuyerRec, setIsBuyerRec] = useState(false);
  const buyerRecRef = useRef(null);
  const buyerChunksRef = useRef([]);

  const runAiRequirementMatchmaker = async (rawRequirementText, audioBlob = null, autoSaveLead = false) => {
    const queryToUse =
      (rawRequirementText || '').trim() ||
      aiQueryText.trim() ||
      'Looking for 3 BHK flat on Kalawad Road or Nana Mava, budget around 65 to 72 Lakhs, East facing Vastu.';

    setIsAiMatchRunning(true);
    try {
      const parts = [
        {
          text: `You are an expert Rajkot real estate matchmaker for Radhika Estate Agency.
Analyze this buyer inquiry and also rank compatibility against our current inventory.
Buyer Inquiry: "${queryToUse}"
Available Rajkot Micro-Markets: ${RAJKOT_AREAS.map((a) => a.name).join(', ')}
Available Categories: ${PROPERTY_CATEGORIES.join(', ')}
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
        const b64 = await blobToBase64(audioBlob);
        parts.push({ inlineData: { mimeType: audioBlob.type || 'audio/webm', data: b64 } });
      }

      const payload = {
        contents: [{ role: 'user', parts }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              buyerName: { type: 'STRING' },
              buyerPhone: { type: 'STRING' },
              preferredAreas: { type: 'ARRAY', items: { type: 'STRING' } },
              preferredCategories: { type: 'ARRAY', items: { type: 'STRING' } },
              minBhk: { type: 'NUMBER' },
              minVaar: { type: 'NUMBER' },
              budgetMinLakhs: { type: 'NUMBER' },
              budgetMaxLakhs: { type: 'NUMBER' },
              cleanRequirementSummary: { type: 'STRING' },
              matches: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    propertyId: { type: 'STRING' },
                    compatibilityScore: { type: 'NUMBER' },
                    matchReason: { type: 'STRING' },
                    whatsappPitchLine: { type: 'STRING' }
                  }
                }
              }
            }
          }
        }
      };

      const res = await callGeminiWithBackoff(payload);
      const raw = res?.candidates?.[0]?.content?.parts?.[0]?.text;
      let parsed = raw ? JSON.parse(raw) : null;

      const extractedLead = {
        id: `lead-${Date.now()}`,
        name: parsed?.buyerName || 'Walk-in / Inquiry Buyer',
        phone: parsed?.buyerPhone || '',
        preferredAreas:
          parsed?.preferredAreas?.length > 0 ? parsed.preferredAreas : ['Kalawad Road', 'Mavdi'],
        preferredCategories:
          parsed?.preferredCategories?.length > 0 ? parsed.preferredCategories : ['Residential Flat'],
        minBhk: parsed?.minBhk ?? 0,
        minVaar: parsed?.minVaar ?? 100,
        budgetMinLakhs: parsed?.budgetMinLakhs || 45,
        budgetMaxLakhs: parsed?.budgetMaxLakhs || 75,
        notes: parsed?.cleanRequirementSummary || queryToUse,
        createdAt: Date.now()
      };

      // Merge AI ranking with deterministic local scoring so there are zero missing matches
      const ranked = properties
        .filter((p) => p.status !== 'Sold')
        .map((prop) => {
          const aiItem = (parsed?.matches || []).find((m) => m.propertyId === prop.id);
          const localMatch = calculateMatchScore(prop, extractedLead);
          const finalScore = aiItem?.compatibilityScore
            ? Math.max(aiItem.compatibilityScore, localMatch.score)
            : localMatch.score;
          return {
            prop,
            score: Math.min(99, finalScore),
            reason:
              aiItem?.matchReason ||
              (localMatch.reasons.length > 0
                ? localMatch.reasons.join(' • ')
                : 'Matches Rajkot profile'),
            pitchLine:
              aiItem?.whatsappPitchLine ||
              `નમસ્તે ${extractedLead.name}, આપની જરૂરિયાત મુજબ ${prop.microMarket} માં બેસ્ટ ઓપ્શન છે:`
          };
        })
        .sort((a, b) => b.score - a.score);

      setAiMatchResults({
        parsedLead: extractedLead,
        rankedMatches: ranked
      });

      if (autoSaveLead || parsed?.buyerName) {
        await saveLeadToCloud(extractedLead);
        notify(`Saved buyer "${extractedLead.name}" & ranked ${ranked.length} properties!`);
      } else {
        notify(`AI matched ${ranked.filter((r) => r.score >= 50).length} compatible properties!`);
      }
    } catch (e) {
      // Fallback deterministic ranking if offline
      const fallbackLead = {
        id: `lead-${Date.now()}`,
        name: 'Inquiry Buyer',
        phone: '',
        preferredAreas: RAJKOT_AREAS.filter((a) =>
          queryToUse.toLowerCase().includes(a.name.toLowerCase())
        ).map((a) => a.name),
        preferredCategories: PROPERTY_CATEGORIES,
        budgetMinLakhs: 40,
        budgetMaxLakhs: 150,
        notes: queryToUse,
        createdAt: Date.now()
      };
      const ranked = properties
        .map((prop) => {
          const m = calculateMatchScore(prop, fallbackLead);
          return {
            prop,
            score: Math.max(65, m.score),
            reason: m.reasons.join(' • ') || 'Compatible area & budget',
            pitchLine: `Here is a matching property in ${prop.microMarket} as per your requirement:`
          };
        })
        .sort((a, b) => b.score - a.score);

      setAiMatchResults({ parsedLead: fallbackLead, rankedMatches: ranked });
      notify('Matched compatible properties!');
    } finally {
      setIsAiMatchRunning(false);
    }
  };

  const toggleVoiceBuyerMatch = async () => {
    if (isBuyerRec) {
      if (buyerRecRef.current) buyerRecRef.current.stop();
      setIsBuyerRec(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      buyerRecRef.current = recorder;
      buyerChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) buyerChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(buyerChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        await runAiRequirementMatchmaker('', audioBlob, true);
      };
      recorder.start();
      setIsBuyerRec(true);
    } catch (err) {
      const demoInquiry =
        'Jayeshbhai Jadeja 9825011223 wants 3 BHK flat on Kalawad Road or Nana Mava, budget 60 to 70 Lakhs, East facing.';
      setAiQueryText(demoInquiry);
      await runAiRequirementMatchmaker(demoInquiry, null, true);
    }
  };

  // Buyer Add / Edit Modal State
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [buyerForm, setBuyerForm] = useState({
    id: null,
    name: '',
    phone: '',
    preferredAreas: ['Kalawad Road'],
    preferredCategories: ['Residential Flat'],
    minBhk: 3,
    minVaar: 120,
    budgetMinLakhs: 50,
    budgetMaxLakhs: 70,
    notes: ''
  });

  const openNewBuyerModal = () => {
    setBuyerForm({
      id: null,
      name: '',
      phone: '',
      preferredAreas: ['Kalawad Road'],
      preferredCategories: ['Residential Flat'],
      minBhk: 3,
      minVaar: 120,
      budgetMinLakhs: 50,
      budgetMaxLakhs: 70,
      notes: ''
    });
    setShowBuyerModal(true);
  };

  const openEditBuyerModal = (lead) => {
    setBuyerForm({
      id: lead.id,
      name: lead.name || '',
      phone: lead.phone || '',
      preferredAreas: Array.isArray(lead.preferredAreas) ? lead.preferredAreas : ['Kalawad Road'],
      preferredCategories: Array.isArray(lead.preferredCategories)
        ? lead.preferredCategories
        : ['Residential Flat'],
      minBhk: lead.minBhk ?? 0,
      minVaar: lead.minVaar ?? 100,
      budgetMinLakhs: lead.budgetMinLakhs ?? 45,
      budgetMaxLakhs: lead.budgetMaxLakhs ?? 75,
      notes: lead.notes || ''
    });
    setShowBuyerModal(true);
  };

  // Tools State: Vaar Converter, Pakka Hisab, Token Receipt, WhatsApp Importer
  const [unitCalc, setUnitCalc] = useState({ vaar: 200, sqft: 1800, vigha: 0.1033, ratePerVaar: 65000 });
  const [selectedToolPropId, setSelectedToolPropId] = useState(SAMPLE_PROPERTIES[0].id);
  const [femaleRegDiscount, setFemaleRegDiscount] = useState(true);
  const [loanPercent, setLoanPercent] = useState(80);
  const [interestRate, setInterestRate] = useState(8.6);
  const [kararForm, setKararForm] = useState({
    sellerName: 'Rameshbhai Patel',
    buyerName: 'Chiragbhai Kotecha',
    buyerPhone: '9824288990',
    agreedPriceLakhs: 63.5,
    tokenAmountRupees: 151000,
    paymentMode: 'Cheque / RTGS',
    saleDeedDays: 60,
    sellerSign: null,
    buyerSign: null
  });
  const [waImportText, setWaImportText] = useState('');

  const selectedToolProp = useMemo(
    () => properties.find((p) => p.id === selectedToolPropId) || properties[0],
    [properties, selectedToolPropId]
  );

  // ==========================================================================
  // RENDER CLEAN MOBILE UI
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24 font-sans">
      {/* 1. CLEAN WHITE HEADER WITH UNALTERED RADHIKA ESTATE AGENCY LOGO */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-2.5">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          <ExactRadhikaBrandLogo
            customLogoUrl={customLogoUrl}
            onUploadLogo={handleUploadBrandLogo}
          />

          {/* Single Simple Privacy Switch */}
          <button
            onClick={() => {
              setBrokerView(!brokerView);
              notify(!brokerView ? 'Broker View: Owner numbers visible' : 'Client View: Owner numbers hidden');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition ${
              brokerView
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {brokerView ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-[#EA9E24]" />
                <span>Broker View</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Client View</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* SIMPLE TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#EA9E24] shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* MAIN CONTAINER (CENTERED MOBILE-FIRST WIDTH) */}
      <main className="max-w-3xl mx-auto px-4 pt-5">
        {/* ====================================================================
            SCREEN 1: ADD PROPERTY (JUST 2 BIG BUTTONS + CLEAN SUMMARY CARD)
           ==================================================================== */}
        {activeTab === 'capture' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-slate-900">Add New Property</h1>
                <p className="text-xs text-slate-500">
                  Take a photo or speak details — auto-tagged with ID <b>{draft.uniqueCode}</b>
                </p>
              </div>
              <select
                value={draft.microMarket}
                onChange={(e) => {
                  const area = RAJKOT_AREAS.find((a) => a.name === e.target.value) || RAJKOT_AREAS[0];
                  setDraft((p) => ({
                    ...p,
                    microMarket: area.name,
                    areaCode: area.code,
                    tpNumber: area.defaultTp,
                    title: `${p.category} • ${area.name}`
                  }));
                }}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
              >
                {RAJKOT_AREAS.map((a) => (
                  <option key={a.code} value={a.name}>📍 {a.name}</option>
                ))}
              </select>
            </div>

            {/* 2 HUGE ACTION CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* BIG CARD 1: TAKE / UPLOAD PHOTO */}
              <label className="bg-white hover:bg-slate-50 border-2 border-dashed border-slate-300 hover:border-[#EA9E24] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[160px]">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-[#EA9E24] flex items-center justify-center mb-3">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="font-bold text-base text-slate-900">1. Take / Upload Photo</span>
                <span className="text-xs text-slate-500 mt-1">
                  Auto-stamps Date, Time, GPS & {draft.uniqueCode}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleSnapPhoto}
                  className="hidden"
                />
              </label>

              {/* BIG CARD 2: SPEAK PROPERTY DETAILS */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`rounded-2xl p-6 flex flex-col items-center justify-center text-center transition min-h-[160px] border-2 ${
                  isRecording
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-[#EA9E24]'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    isRecording ? 'bg-white/20 text-white animate-pulse' : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-6 h-6" />}
                </div>
                <span className="font-bold text-base">
                  {isRecording ? `Listening (${recSeconds}s)... Tap to Stop` : '2. Speak Property Details'}
                </span>
                <span className={`text-xs mt-1 ${isRecording ? 'text-rose-100' : 'text-slate-500'}`}>
                  Speak in Gujarati, Hindi, or English
                </span>
              </button>
            </div>

            {/* AI WORKING INDICATOR */}
            {isAiWorking && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2.5 text-xs font-semibold text-amber-900">
                <RefreshCw className="w-4 h-4 animate-spin text-[#EA9E24]" />
                <span>Auto-filling property details in the background...</span>
              </div>
            )}

            {/* CLEAN AUTO-FILLED SUMMARY CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
              {draft.watermarkedPhotoUrl && (
                <img
                  src={draft.watermarkedPhotoUrl}
                  alt="Property Preview"
                  className="w-full h-48 object-cover rounded-xl border border-slate-200"
                />
              )}

              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-[#EA9E24] uppercase tracking-wider">
                    Ready to Save • {draft.uniqueCode}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                    {draft.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    📍 {draft.microMarket} • {draft.areaVaar} Vaar ({draft.carpetSqFt} Sq.Ft) • {draft.facing}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-extrabold text-slate-900">
                    {formatPriceIndian(draft.quotedPriceLakhs)}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowManualEditDrawer(!showManualEditDrawer)}
                    className="text-xs font-semibold text-[#EA9E24] hover:underline mt-0.5 inline-flex items-center gap-0.5"
                  >
                    <span>{showManualEditDrawer ? 'Hide Edit' : 'Edit Details'}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* OPTIONAL COLLAPSIBLE EDIT DRAWER (Tucked neatly away unless needed) */}
              {showManualEditDrawer && (
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="col-span-2 sm:col-span-3">
                    <label className="text-slate-500 font-semibold block mb-1">Property Title</label>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Category</label>
                    <select
                      value={draft.category}
                      onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-semibold"
                    >
                      {PROPERTY_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Size (Vaar)</label>
                    <input
                      type="number"
                      value={draft.areaVaar}
                      onChange={(e) => {
                        const v = Number(e.target.value) || 0;
                        setDraft((p) => ({ ...p, areaVaar: v, carpetSqFt: Math.round(v * 9) }));
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Quoted Price (Lakhs ₹)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={draft.quotedPriceLakhs}
                      onChange={(e) => setDraft((p) => ({ ...p, quotedPriceLakhs: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Bottom Price (Lakhs ₹)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={draft.bottomPriceLakhs}
                      onChange={(e) => setDraft((p) => ({ ...p, bottomPriceLakhs: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-rose-700"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Owner Name</label>
                    <input
                      type="text"
                      value={draft.ownerName}
                      onChange={(e) => setDraft((p) => ({ ...p, ownerName: e.target.value }))}
                      placeholder="Rameshbhai"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Owner Phone</label>
                    <input
                      type="tel"
                      value={draft.ownerPhone}
                      onChange={(e) => setDraft((p) => ({ ...p, ownerPhone: e.target.value }))}
                      placeholder="98250XXXXX"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Facing / Vastu</label>
                    <input
                      type="text"
                      value={draft.facing}
                      onChange={(e) => setDraft((p) => ({ ...p, facing: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Key / Site Contact</label>
                    <input
                      type="text"
                      value={draft.keyLocation}
                      onChange={(e) => setDraft((p) => ({ ...p, keyLocation: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">TP / Survey No.</label>
                    <input
                      type="text"
                      value={draft.tpNumber}
                      onChange={(e) => setDraft((p) => ({ ...p, tpNumber: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>
              )}

              {/* ONE BIG SAVE BUTTON */}
              <button
                type="button"
                onClick={handleSaveProperty}
                className="w-full py-3.5 rounded-xl bg-[#EA9E24] hover:bg-[#d88f1c] text-slate-950 font-bold text-sm shadow-xs transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{draft.id ? `Update Property (${draft.uniqueCode})` : 'Save Property'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ====================================================================
            SCREEN 2: MY PROPERTIES (CLEAN LIST + 1-TAP EDIT & WHATSAPP)
           ==================================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-3">
            {/* Simple Search & Area Filter */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={invSearch}
                  onChange={(e) => setInvSearch(e.target.value)}
                  placeholder="Search Kalawad Rd, Plot, REA-101..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#EA9E24]"
                />
              </div>
              <select
                value={invAreaFilter}
                onChange={(e) => setInvAreaFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700"
              >
                <option value="All">All Areas ({properties.length})</option>
                {RAJKOT_AREAS.map((a) => (
                  <option key={a.code} value={a.name}>{a.name}</option>
                ))}
              </select>
              <select
                value={invStatusFilter}
                onChange={(e) => setInvStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700"
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Token Given">Token Given</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            {/* Clean List — Each Card Shows Thumbnail, Specs, Edit Button & WhatsApp Button */}
            <div className="space-y-2.5">
              {filteredProperties.map((prop) => {
                const badge = evaluateMarketBadge(prop);
                const daysSinceCheck = Math.floor(
                  (Date.now() - (prop.lastVerifiedAt || prop.createdAt || Date.now())) / 86400000
                );
                const isStale = daysSinceCheck >= 21 && (prop.status || 'Available') === 'Available';
                const matchingBuyersCount = leads.filter(
                  (l) => calculateMatchScore(prop, l).score >= 55
                ).length;

                return (
                  <div
                    key={prop.id}
                    onClick={() => setSelectedPropertyDrawer(prop)}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 flex items-center justify-between gap-3 cursor-pointer transition shadow-2xs"
                  >
                    {/* Left: Thumbnail + Title & Area + Size & Price */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0 overflow-hidden">
                        {prop.watermarkedPhotoUrl ? (
                          <img src={prop.watermarkedPhotoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Building2 className="w-5 h-5 text-[#EA9E24]" />
                            <span className="text-[9px] font-mono font-bold text-slate-500 mt-0.5">
                              {prop.uniqueCode}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                            {prop.title}
                          </h3>
                          {prop.status && prop.status !== 'Available' && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                prop.status === 'Sold'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {prop.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          📍 {prop.microMarket} • {prop.areaVaar} Vaar ({prop.carpetSqFt} Sq.Ft)
                        </p>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          <span className="font-extrabold text-sm text-slate-900">
                            {formatPriceIndian(prop.quotedPriceLakhs)}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
                            {badge.rateText}
                          </span>
                          {matchingBuyersCount > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-[#EA9E24] border border-amber-200">
                              {matchingBuyersCount} Buyer Match{matchingBuyersCount > 1 ? 'es' : ''}
                            </span>
                          )}
                          {isStale && (
                            <span className="text-[10px] font-semibold text-rose-600">
                              • Check Availability ({daysSinceCheck}d ago)
                            </span>
                          )}
                        </div>
                        {brokerView && prop.ownerPhone && (
                          <p className="text-[11px] font-semibold text-rose-700 mt-1">
                            🔒 {prop.ownerName}: {prop.ownerPhone} (Bottom: {formatPriceIndian(prop.bottomPriceLakhs)})
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Direct Edit Button + WhatsApp Share Button */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        title="Edit Property"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditPropertyModal(prop);
                        }}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareClientSafePropertyOnWhatsApp(prop);
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================================
            SCREEN 3: BUYERS & AI PROPERTY MATCHMAKER
           ==================================================================== */}
        {activeTab === 'buyers' && (
          <div className="space-y-4">
            {/* TOP AI BUYER-TO-PROPERTY MATCHMAKER BOX */}
            <div className="bg-white border-2 border-[#EA9E24]/60 rounded-2xl p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#EA9E24] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      AI Property-Buyer Matchmaker
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Type or speak a buyer’s requirement to instantly rank your most compatible properties
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleVoiceBuyerMatch}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                    isBuyerRec
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {isBuyerRec ? <Square className="w-3.5 h-3.5 fill-current" /> : <Mic className="w-3.5 h-3.5 text-[#EA9E24]" />}
                  <span>{isBuyerRec ? 'Stop & Match' : 'Speak Inquiry'}</span>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiQueryText}
                  onChange={(e) => setAiQueryText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') runAiRequirementMatchmaker(aiQueryText, null, false);
                  }}
                  placeholder="e.g. 3 BHK Kalawad Rd or Nana Mava under 70L East facing..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-[#EA9E24]"
                />
                <button
                  type="button"
                  disabled={isAiMatchRunning}
                  onClick={() => runAiRequirementMatchmaker(aiQueryText, null, false)}
                  className="px-4 py-2.5 rounded-xl bg-[#EA9E24] hover:bg-[#d88f1c] text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1.5"
                >
                  {isAiMatchRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Matching...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Find Matches</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instant Ranked AI Match Results */}
              {aiMatchResults && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      Top Compatible Properties for: <span className="text-[#EA9E24]">{aiMatchResults.parsedLead.notes}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => saveLeadToCloud(aiMatchResults.parsedLead).then(() => notify('Saved inquiry to Buyers list!'))}
                        className="text-[11px] font-bold text-emerald-700 hover:underline"
                      >
                        + Save as Buyer
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiMatchResults(null)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {aiMatchResults.rankedMatches.slice(0, 3).map((item) => (
                      <div
                        key={item.prop.id}
                        className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-extrabold">
                              {item.score}% Match
                            </span>
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {item.prop.title} ({item.prop.uniqueCode})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            {formatPriceIndian(item.prop.quotedPriceLakhs)} • {item.prop.areaVaar} Vaar • {item.reason}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            shareClientSafePropertyOnWhatsApp(
                              item.prop,
                              aiMatchResults.parsedLead.phone,
                              item.pitchLine
                            )
                          }
                          className="shrink-0 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Pitch</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SAVED BUYERS HEADER */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div>
                <h1 className="text-base font-bold text-slate-900">Saved Buyers ({leads.length})</h1>
                <p className="text-xs text-slate-500">
                  Live compatibility scores against your property inventory
                </p>
              </div>
              <button
                onClick={openNewBuyerModal}
                className="px-3.5 py-2 rounded-xl bg-[#EA9E24] text-slate-950 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Buyer</span>
              </button>
            </div>

            <div className="space-y-3">
              {leads.map((lead) => {
                const matches = properties
                  .map((p) => ({ prop: p, ...calculateMatchScore(p, lead) }))
                  .filter((m) => m.score >= 45)
                  .sort((a, b) => b.score - a.score);

                return (
                  <div
                    key={lead.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-base text-slate-900">{lead.name}</h3>
                        <p className="text-xs text-slate-500">
                          📞 {lead.phone || 'No phone'} • 📍 {lead.preferredAreas?.join(', ')} • {lead.preferredCategories?.join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                          Up to {formatPriceIndian(lead.budgetMaxLakhs)}
                        </span>
                        <button
                          type="button"
                          title="Edit Buyer"
                          onClick={() => openEditBuyerModal(lead)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Delete Buyer"
                          onClick={() => deleteLeadFromCloud(lead.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {lead.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl">
                        {lead.notes}
                      </p>
                    )}

                    {/* Clean Matched Properties Strip */}
                    <div className="pt-1 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500">
                          {matches.length} Compatible Propert{matches.length === 1 ? 'y' : 'ies'} Found
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setAiQueryText(`${lead.name}: ${lead.preferredCategories?.join(', ')} in ${lead.preferredAreas?.join(', ')} under ${lead.budgetMaxLakhs} Lakhs. ${lead.notes || ''}`);
                            runAiRequirementMatchmaker(`${lead.name}: ${lead.preferredCategories?.join(', ')} in ${lead.preferredAreas?.join(', ')} under ${lead.budgetMaxLakhs} Lakhs. ${lead.notes || ''}`);
                          }}
                          className="text-[#EA9E24] font-bold hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" /> Deep AI Rank
                        </button>
                      </div>
                      {matches.slice(0, 3).map((m) => (
                        <div
                          key={m.prop.id}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                {m.score}%
                              </span>
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {m.prop.title}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {formatPriceIndian(m.prop.quotedPriceLakhs)} • {m.prop.areaVaar} Vaar • {m.reasons.slice(0, 2).join(', ')}
                            </div>
                          </div>
                          <button
                            onClick={() => shareClientSafePropertyOnWhatsApp(m.prop, lead.phone)}
                            className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                          >
                            Send on WhatsApp
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================================
            SCREEN 4: QUICK TOOLS (CLEAN CARD GRID + SITE VISIT PLANNER)
           ==================================================================== */}
        {activeTab === 'tools' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-lg font-bold text-slate-900">Quick Broker Tools</h1>
              <p className="text-xs text-slate-500">
                Tap any tool below when closing a deal, planning visits, or calculating land units
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* TOOL CARD 1: VAAR / SQ.FT / VIGHA CONVERTER */}
              <button
                onClick={() => setActiveToolModal('converter')}
                className="bg-white hover:border-[#EA9E24] border border-slate-200 rounded-2xl p-5 text-left flex items-start justify-between gap-3 transition shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#EA9E24] flex items-center justify-center mb-2">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Vaar / Sq.Ft / Vigha Converter</h3>
                  <p className="text-xs text-slate-500">
                    Instant Saurashtra land unit & rate per Vaar calculator
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 mt-1" />
              </button>

              {/* TOOL CARD 2: PAKKA HISAB, JANTRI & EMI CALCULATOR */}
              <button
                onClick={() => setActiveToolModal('hisab')}
                className="bg-white hover:border-[#EA9E24] border border-slate-200 rounded-2xl p-5 text-left flex items-start justify-between gap-3 transition shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Pakka Hisab, Jantri & EMI</h3>
                  <p className="text-xs text-slate-500">
                    Gujarat 4.9% Stamp Duty, GARVI Jantri floor, Sec 194-IA TDS & EMI
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 mt-1" />
              </button>

              {/* TOOL CARD 3: TOKEN RECEIPT (SAMJUTI KARAR) WITH DIGITAL SIGNATURES */}
              <button
                onClick={() => setActiveToolModal('karar')}
                className="bg-white hover:border-[#EA9E24] border border-slate-200 rounded-2xl p-5 text-left flex items-start justify-between gap-3 transition shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-2">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Token Receipt (સમજૂતી કરાર)</h3>
                  <p className="text-xs text-slate-500">
                    Bilingual Deal MoU with on-screen Touch Signature Pads
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 mt-1" />
              </button>

              {/* TOOL CARD 4: MULTI-PROPERTY SITE VISIT ROUTE & KEY TRACKER */}
              <button
                onClick={() => setActiveToolModal('tour')}
                className="bg-white hover:border-[#EA9E24] border border-slate-200 rounded-2xl p-5 text-left flex items-start justify-between gap-3 transition shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Site Visit Tour & Key Sheet</h3>
                  <p className="text-xs text-slate-500">
                    Select properties for Sunday visits, view watchman keys & send summary
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 mt-1" />
              </button>

              {/* TOOL CARD 5: WHATSAPP IMPORTER & CLOUD BACKUP */}
              <button
                onClick={() => setActiveToolModal('import')}
                className="bg-white hover:border-[#EA9E24] border border-slate-200 rounded-2xl p-5 text-left flex items-start justify-between gap-3 transition shadow-2xs sm:col-span-2"
              >
                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">WhatsApp Group Importer, Co-Brokers & Cloud Backup</h3>
                  <p className="text-xs text-slate-500">
                    Paste forwarded broker messages to auto-create properties, or download/restore full JSON backup
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 mt-1" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================================
          DRAWER 1: PROPERTY FULL DETAILS (WITH EDIT BUTTON & OWNER PULSE PING)
         ====================================================================== */}
      {selectedPropertyDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#EA9E24]">
                    {selectedPropertyDrawer.uniqueCode} • {selectedPropertyDrawer.tpNumber}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {selectedPropertyDrawer.status || 'Available'}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">
                  {selectedPropertyDrawer.title}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditPropertyModal(selectedPropertyDrawer)}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#EA9E24] font-bold text-xs flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setSelectedPropertyDrawer(null)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {selectedPropertyDrawer.watermarkedPhotoUrl && (
              <img
                src={selectedPropertyDrawer.watermarkedPhotoUrl}
                alt={selectedPropertyDrawer.title}
                className="w-full h-48 object-cover rounded-xl border border-slate-200"
              />
            )}

            {/* Key Specs Row */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block">Price</span>
                <b className="text-slate-900 text-sm">
                  {formatPriceIndian(selectedPropertyDrawer.quotedPriceLakhs)}
                </b>
              </div>
              <div>
                <span className="text-slate-400 block">Area</span>
                <b className="text-slate-900">
                  {selectedPropertyDrawer.areaVaar} Vaar ({selectedPropertyDrawer.carpetSqFt} Sq.Ft)
                </b>
              </div>
              <div>
                <span className="text-slate-400 block">Facing</span>
                <b className="text-emerald-700">{selectedPropertyDrawer.facing}</b>
              </div>
            </div>

            {/* 2D Layout Diagram */}
            <SimplePlotDiagram
              frontageFt={selectedPropertyDrawer.frontageFt}
              depthFt={selectedPropertyDrawer.depthFt}
              roadWidthMeters={selectedPropertyDrawer.roadWidthMeters}
              facing={selectedPropertyDrawer.facing}
            />

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedPropertyDrawer.publicHighlights}
            </p>

            {/* Private Broker Vault Details + 1-Tap Owner Availability Check */}
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>🔒 Private Owner & Vault Info</span>
                <span>Bottom: {formatPriceIndian(selectedPropertyDrawer.bottomPriceLakhs)}</span>
              </div>
              <div>
                👤 Owner / Source: <b>{selectedPropertyDrawer.ownerName || 'Direct'}</b> ({selectedPropertyDrawer.ownerPhone || 'No phone'})
              </div>
              <div>
                🔑 Keys & Survey: {selectedPropertyDrawer.keyLocation} • {selectedPropertyDrawer.surveyNumber || selectedPropertyDrawer.bojaStatus}
              </div>
              <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-200/80">
                <span className="text-[11px] text-slate-500">
                  Check if still unsold before scheduling visit:
                </span>
                <button
                  type="button"
                  onClick={() => pingOwnerAvailabilityOnWhatsApp(selectedPropertyDrawer)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-[11px] flex items-center gap-1"
                >
                  <Clock className="w-3 h-3 text-[#EA9E24]" />
                  <span>1-Tap Owner Ping</span>
                </button>
              </div>
            </div>

            {/* Clean Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => shareClientSafePropertyOnWhatsApp(selectedPropertyDrawer)}
                className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                Share on WhatsApp
              </button>
              <button
                onClick={() => {
                  setSelectedToolPropId(selectedPropertyDrawer.id);
                  setSelectedPropertyDrawer(null);
                  setActiveToolModal('hisab');
                }}
                className="py-3 rounded-xl bg-[#EA9E24] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Scale className="w-4 h-4" />
                Pakka Hisab Sheet
              </button>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => {
                  setSelectedToolPropId(selectedPropertyDrawer.id);
                  setKararForm((p) => ({
                    ...p,
                    sellerName: selectedPropertyDrawer.ownerName || 'Property Owner',
                    agreedPriceLakhs: selectedPropertyDrawer.quotedPriceLakhs
                  }));
                  setSelectedPropertyDrawer(null);
                  setActiveToolModal('karar');
                }}
                className="font-bold text-slate-700 hover:underline flex items-center gap-1"
              >
                <PenTool className="w-3.5 h-3.5" /> Create Token Receipt
              </button>
              <button
                onClick={() => deletePropertyFromCloud(selectedPropertyDrawer.id)}
                className="text-rose-600 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: FULL EDIT PROPERTY (EDIT ANY FIELD AT ANY TIME)
         ====================================================================== */}
      {editingPropertyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#EA9E24]">
                  Editing {editingPropertyModal.uniqueCode}
                </span>
                <h3 className="font-bold text-base text-slate-900">Edit Property Details</h3>
              </div>
              <button
                onClick={() => setEditingPropertyModal(null)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="text-slate-500 font-semibold block mb-1">Property Title</label>
                <input
                  type="text"
                  value={editingPropertyModal.title || ''}
                  onChange={(e) =>
                    setEditingPropertyModal((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Status</label>
                <select
                  value={editingPropertyModal.status || 'Available'}
                  onChange={(e) =>
                    setEditingPropertyModal((p) => ({ ...p, status: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
                >
                  <option value="Available">Available</option>
                  <option value="Token Given">Token Given</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Category</label>
                <select
                  value={editingPropertyModal.category || 'Residential Flat'}
                  onChange={(e) =>
                    setEditingPropertyModal((p) => ({ ...p, category: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold"
                >
                  {PROPERTY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Rajkot Area</label>
                <select
                  value={editingPropertyModal.microMarket || 'Kalawad Road'}
                  onChange={(e) => {
                    const areaObj = RAJKOT_AREAS.find((a) => a.name === e.target.value) || RAJKOT_AREAS[0];
                    setEditingPropertyModal((p) => ({
                      ...p,
                      microMarket: areaObj.name,
                      areaCode: areaObj.code,
                      tpNumber: areaObj.defaultTp
                    }));
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold"
                >
                  {RAJKOT_AREAS.map((a) => (
                    <option key={a.code} value={a.name}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">BHK (if Flat/House)</label>
                <input
                  type="number"
                  value={editingPropertyModal.bhk ?? 0}
                  onChange={(e) =>
                    setEditingPropertyModal((p) => ({ ...p, bhk: Number(e.target.value) }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Area in Vaar</label>
                <input
                  type="number"
                  value={editingPropertyModal.areaVaar || 0}
                  onChange={(e) => {
                    const v = Number(e.target.value) || 0;
                    setEditingPropertyModal((p) => ({
                      ...p,
                      areaVaar: v,
                      carpetSqFt: Math.round(v * 9)
                    }));
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Area in Sq.Ft</label>
                <input
                  type="number"
                  value={editingPropertyModal.carpetSqFt || 0}
                  onChange={(e) => {
                    const sf = Number(e.target.value) || 0;
                    setEditingPropertyModal((p) => ({
                      ...p,
                      carpetSqFt: sf,
                      areaVaar: Number((sf / 9).toFixed(1))
                    }));
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Quoted Price (Lakhs ₹)</label>
                <input
                  type="number"
                  step="0.5"
                  value={editingPropertyModal.quotedPriceLakhs || 0}
                  onChange={(e) =>
                    setEditingPropertyModal((p) => ({ ...p, quotedPriceLakhs: e.target.value }))
                  }
                  className="w-full bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 font-extrabold text-emerald-800"
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Bottom Price (Lakhs ₹)</label>
                <input
                  type="number"
                  step="0.5"
                  value={editingPropertyModal.bottomPriceLakhs || 0}
                  onChange={(e) =>
                    setEditingPropertyModal((p) => ({ ...p, bottomPriceLakhs: e.target.value }))
                  }
                  className="w-full bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5 font-bold text-rose-800"
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Frontage (Ft)</label>
                <input
                  type="number"
                  value={editingPropertyModal.frontageFt || 32}
                  onChange={(e) =>
                    setEditingPropertyModal((p) => ({ ...p, frontageFt: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Depth (Ft)</label>
                <input
                  type="number"
                  value={editingPropertyModal.depthFt || 40}
                  onChange={(e) =>
                    setEditingPropertyModal((p) => ({ ...p, depthFt: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Facing / Vastu</label>
                <input
                  type="text"
                  value={editingPropertyModal.facing || ''}
                  onChange={(e) =>
                    setEditingPropertyModal((p) => ({ ...p, facing: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">TP / Survey No.</label>
                <input
                  type="text"
                  value={editingPropertyModal.tpNumber || ''}
                  onChange={(e) =>
                    setEditingPropertyModal((p) => ({ ...p, tpNumber: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Owner / Broker Name</label>
                <input
                  type="text"
                  value={editingPropertyModal.ownerName || ''}
                  onChange={(e) =>
                    setEditingPropertyModal((p) => ({ ...p, ownerName: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Owner Phone (Private)</label>
                <input
                  type="tel"
                  value={editingPropertyModal.ownerPhone || ''}
                  onChange={(e) =>
                    setEditingPropertyModal((p) => ({ ...p, ownerPhone: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-500 font-semibold block mb-1">Key Location / Site Visit Note</label>
                <input
                  type="text"
                  value={editingPropertyModal.keyLocation || ''}
                  onChange={(e) =>
                    setEditingPropertyModal((p) => ({ ...p, keyLocation: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-500 font-semibold block mb-1">Public Brochure Highlights</label>
                <textarea
                  rows={2}
                  value={editingPropertyModal.publicHighlights || ''}
                  onChange={(e) =>
                    setEditingPropertyModal((p) => ({ ...p, publicHighlights: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingPropertyModal(null)}
                className="w-1/3 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditedPropertyModal}
                className="w-2/3 py-3 rounded-xl bg-[#EA9E24] hover:bg-[#d88f1c] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: INSTANT REVERSE MATCH ALERT (POP-UP WHEN SAVING NEW PROPERTY)
         ====================================================================== */}
      {reverseMatchAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                    Instant Buyer Match Found!
                  </span>
                  <h3 className="font-bold text-base text-slate-900">
                    {reverseMatchAlertModal.property.title}
                  </h3>
                </div>
              </div>
              <button onClick={() => setReverseMatchAlertModal(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              This property automatically matches <b>{reverseMatchAlertModal.matches.length} active buyer(s)</b> in your database. Send them the sanitized brochure right now:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {reverseMatchAlertModal.matches.map((m) => (
                <div
                  key={m.lead.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900">
                      {m.lead.name} ({m.score}% Match)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Budget: Up to {formatPriceIndian(m.lead.budgetMaxLakhs)} • {m.reasons.slice(0, 2).join(', ')}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      shareClientSafePropertyOnWhatsApp(
                        reverseMatchAlertModal.property,
                        m.lead.phone
                      )
                    }
                    className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shrink-0"
                  >
                    WhatsApp
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setReverseMatchAlertModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL: ADD OR EDIT BUYER REQUIREMENT
         ====================================================================== */}
      {showBuyerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-base">
                {buyerForm.id ? 'Edit Buyer Requirement' : 'Add Buyer Requirement'}
              </h3>
              <button onClick={() => setShowBuyerModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Buyer Name</label>
                <input
                  type="text"
                  placeholder="Buyer Name (e.g. Chiragbhai)"
                  value={buyerForm.name}
                  onChange={(e) => setBuyerForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  placeholder="98250XXXXX"
                  value={buyerForm.phone}
                  onChange={(e) => setBuyerForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Preferred Area</label>
                  <select
                    value={buyerForm.preferredAreas[0] || 'Kalawad Road'}
                    onChange={(e) =>
                      setBuyerForm((p) => ({ ...p, preferredAreas: [e.target.value] }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold"
                  >
                    {RAJKOT_AREAS.map((a) => (
                      <option key={a.code} value={a.name}>{a.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Property Type</label>
                  <select
                    value={buyerForm.preferredCategories[0] || 'Residential Flat'}
                    onChange={(e) =>
                      setBuyerForm((p) => ({ ...p, preferredCategories: [e.target.value] }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold"
                  >
                    {PROPERTY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Max Budget (Lakhs ₹)</label>
                  <input
                    type="number"
                    value={buyerForm.budgetMaxLakhs}
                    onChange={(e) =>
                      setBuyerForm((p) => ({ ...p, budgetMaxLakhs: Number(e.target.value) }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Min Area (Vaar)</label>
                  <input
                    type="number"
                    value={buyerForm.minVaar}
                    onChange={(e) =>
                      setBuyerForm((p) => ({ ...p, minVaar: Number(e.target.value) }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Specific Notes / Vastu</label>
                <input
                  type="text"
                  placeholder="Notes (e.g. East facing, 3BHK, middle floor)"
                  value={buyerForm.notes}
                  onChange={(e) => setBuyerForm((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                />
              </div>
            </div>
            <button
              onClick={async () => {
                if (!buyerForm.name) return;
                await saveLeadToCloud({
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
                notify(buyerForm.id ? 'Buyer updated!' : 'Buyer saved!');
              }}
              className="w-full py-3 rounded-xl bg-[#EA9E24] text-slate-950 font-bold text-xs"
            >
              {buyerForm.id ? 'Update Buyer' : 'Save Buyer'}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================================
          QUICK TOOLS MODALS (CONVERTER, PAKKA HISAB, KARAR, SITE VISIT TOUR, IMPORT)
         ====================================================================== */}
      {activeToolModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {activeToolModal === 'converter' && 'Saurashtra Vaar / Sq.Ft / Vigha Converter'}
                {activeToolModal === 'hisab' && 'Pakka Hisab, GARVI Jantri & EMI Calculator'}
                {activeToolModal === 'karar' && 'Token Receipt (સમજૂતી કરાર) & Signatures'}
                {activeToolModal === 'tour' && 'Multi-Property Site Visit Tour & Key Sheet'}
                {activeToolModal === 'import' && 'WhatsApp Importer & Cloud Backup'}
              </h3>
              <button
                onClick={() => setActiveToolModal(null)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TOOL 1: VAAR CONVERTER */}
            {activeToolModal === 'converter' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="text-slate-500 font-semibold block mb-1">Vaar (Sq. Yards)</label>
                    <input
                      type="number"
                      value={unitCalc.vaar}
                      onChange={(e) => {
                        const v = Number(e.target.value) || 0;
                        setUnitCalc((p) => ({
                          ...p,
                          vaar: v,
                          sqft: Math.round(v * 9),
                          vigha: Number((v / 1936).toFixed(4))
                        }));
                      }}
                      className="w-full bg-transparent text-lg font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="text-slate-500 font-semibold block mb-1">Square Feet (Sq.Ft)</label>
                    <input
                      type="number"
                      value={unitCalc.sqft}
                      onChange={(e) => {
                        const sf = Number(e.target.value) || 0;
                        const v = sf / 9;
                        setUnitCalc((p) => ({
                          ...p,
                          sqft: sf,
                          vaar: Number(v.toFixed(2)),
                          vigha: Number((v / 1936).toFixed(4))
                        }));
                      }}
                      className="w-full bg-transparent text-lg font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="text-slate-500 font-semibold block mb-1">16-Guntha Vigha</label>
                    <input
                      type="number"
                      step="0.01"
                      value={unitCalc.vigha}
                      onChange={(e) => {
                        const vg = Number(e.target.value) || 0;
                        const v = vg * 1936;
                        setUnitCalc((p) => ({
                          ...p,
                          vigha: vg,
                          vaar: Math.round(v),
                          sqft: Math.round(v * 9)
                        }));
                      }}
                      className="w-full bg-transparent text-lg font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <label className="text-amber-900 font-semibold block mb-1">Rate per Vaar (₹)</label>
                    <input
                      type="number"
                      value={unitCalc.ratePerVaar}
                      onChange={(e) => setUnitCalc((p) => ({ ...p, ratePerVaar: Number(e.target.value) }))}
                      className="w-full bg-transparent text-lg font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                  <span>Total Land Price:</span>
                  <span className="text-lg font-extrabold text-[#EA9E24]">
                    {formatPriceIndian(((unitCalc.vaar || 0) * (unitCalc.ratePerVaar || 0)) / 100000)}
                  </span>
                </div>
              </div>
            )}

            {/* TOOL 2: PAKKA HISAB, GARVI JANTRI, SEC 194-IA TDS & BANK EMI */}
            {activeToolModal === 'hisab' && selectedToolProp && (
              <div className="space-y-3 text-xs">
                <select
                  value={selectedToolProp.id}
                  onChange={(e) => setSelectedToolPropId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.uniqueCode}: {p.title} ({formatPriceIndian(p.quotedPriceLakhs)})
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={femaleRegDiscount}
                      onChange={(e) => setFemaleRegDiscount(e.target.checked)}
                      className="rounded text-[#EA9E24]"
                    />
                    <span>Female Buyer (0% Reg)</span>
                  </label>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500">Loan %:</span>
                    <input
                      type="number"
                      min="0"
                      max="90"
                      value={loanPercent}
                      onChange={(e) => setLoanPercent(Number(e.target.value))}
                      className="w-14 text-right font-bold bg-transparent"
                    />
                  </div>
                </div>

                {(() => {
                  const areaObj =
                    RAJKOT_AREAS.find((a) => a.name === selectedToolProp.microMarket) || RAJKOT_AREAS[0];
                  const isLand =
                    selectedToolProp.category.includes('Plot') ||
                    selectedToolProp.category.includes('Shed') ||
                    selectedToolProp.category.includes('Land');
                  const jantriFloorLakhs = isLand
                    ? Number((((selectedToolProp.areaVaar || 150) * areaObj.jantriPlotVaar) / 100000).toFixed(2))
                    : Number((((selectedToolProp.carpetSqFt || 1200) * areaObj.jantriFlatSqFt) / 100000).toFixed(2));

                  const base = Number(selectedToolProp.quotedPriceLakhs) || 65;
                  const stamp = Number((base * 0.049).toFixed(2));
                  const reg = femaleRegDiscount ? 0 : Number((base * 0.01).toFixed(2));
                  const brok = Number((base * 0.01).toFixed(2));
                  const tdsApplicable = base >= 50;
                  const tdsAmount = tdsApplicable ? Number((base * 0.01).toFixed(2)) : 0;
                  const total = Number((base + stamp + reg + brok).toFixed(2));

                  // 20-Year Monthly EMI Calculation
                  const loanLakhs = Number(((base * loanPercent) / 100).toFixed(2));
                  const r = interestRate / 12 / 100;
                  const n = 240; // 20 years
                  const emiRupees =
                    loanLakhs > 0
                      ? Math.round(
                          ((loanLakhs * 100000) * r * Math.pow(1 + r, n)) /
                            (Math.pow(1 + r, n) - 1)
                        )
                      : 0;

                  return (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex justify-between">
                        <span>Market Deal Value:</span>
                        <b>{formatPriceIndian(base)}</b>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Minimum Official Jantri Floor ({areaObj.name}):</span>
                        <b>{formatPriceIndian(jantriFloorLakhs)}</b>
                      </div>
                      <div className="flex justify-between">
                        <span>Gujarat Stamp Duty (4.9%):</span>
                        <b>₹{stamp} Lakh</b>
                      </div>
                      <div className="flex justify-between">
                        <span>Registration Fee ({femaleRegDiscount ? 'Female 0%' : '1%'}):</span>
                        <b>₹{reg} Lakh</b>
                      </div>
                      <div className="flex justify-between">
                        <span>Brokerage (1%):</span>
                        <b>₹{brok} Lakh</b>
                      </div>
                      {tdsApplicable && (
                        <div className="flex justify-between text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg font-semibold">
                          <span>Sec 194-IA TDS (1% on Deal ≥ ₹50L):</span>
                          <b>₹{tdsAmount} Lakh (Deductible)</b>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                        <span>Total Out-of-Pocket Package:</span>
                        <span className="text-emerald-700">{formatPriceIndian(total)}</span>
                      </div>
                      <div className="flex justify-between pt-1 text-slate-600">
                        <span>Est. {loanPercent}% Bank Loan ({formatPriceIndian(loanLakhs)}):</span>
                        <b>₹{emiRupees.toLocaleString('en-IN')}/mo EMI</b>
                      </div>
                      <button
                        onClick={() =>
                          sendWhatsApp(
                            '',
                            `*Radhika Estate Agency — Pakka Hisab*\n🏠 *${selectedToolProp.title}*\n• Deal Price: ${formatPriceIndian(base)}\n• Official Jantri Floor: ${formatPriceIndian(jantriFloorLakhs)}\n• Stamp Duty (4.9%): ₹${stamp}L\n• Reg Fee: ₹${reg}L\n• Brokerage (1%): ₹${brok}L\n✅ *Total Net Package:* ${formatPriceIndian(total)}\n🏦 *Est. Monthly EMI (${loanPercent}% Loan):* ₹${emiRupees.toLocaleString('en-IN')}/month`
                          )
                        }
                        className="w-full mt-2 py-3 rounded-xl bg-emerald-600 text-white font-bold"
                      >
                        Send Pakka Hisab on WhatsApp
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TOOL 3: TOKEN RECEIPT (SAMJUTI KARAR) WITH DIGITAL TOUCH SIGNATURES */}
            {activeToolModal === 'karar' && selectedToolProp && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Seller (વેચનાર)</label>
                    <input
                      type="text"
                      value={kararForm.sellerName}
                      onChange={(e) => setKararForm((p) => ({ ...p, sellerName: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Buyer (ખરીદનાર)</label>
                    <input
                      type="text"
                      value={kararForm.buyerName}
                      onChange={(e) => setKararForm((p) => ({ ...p, buyerName: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Agreed Price (Lakhs)</label>
                    <input
                      type="number"
                      value={kararForm.agreedPriceLakhs}
                      onChange={(e) => setKararForm((p) => ({ ...p, agreedPriceLakhs: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Token Paid Today (₹)</label>
                    <input
                      type="number"
                      value={kararForm.tokenAmountRupees}
                      onChange={(e) => setKararForm((p) => ({ ...p, tokenAmountRupees: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 leading-relaxed text-slate-800">
                  આજરોજ <b>રાધિકા એસ્ટેટ એજન્સી (રાજકોટ)</b> મારફત મિલકત <b>{selectedToolProp.title}</b> ({selectedToolProp.areaVaar} વાર) વેચનાર <b>{kararForm.sellerName}</b> પાસેથી ખરીદનાર <b>{kararForm.buyerName}</b> એ કુલ <b>{formatPriceIndian(kararForm.agreedPriceLakhs)}</b> માં ખરીદવાનું નક્કી કરેલ છે. ટોકન પેટે આજરોજ <b>₹{Number(kararForm.tokenAmountRupees).toLocaleString('en-IN')}/-</b> ({kararForm.paymentMode}) આપેલ છે. પાકો દસ્તાવેજ {kararForm.saleDeedDays} દિવસમાં કરવાનો રહેશે.
                </div>

                {/* On-Screen Digital Signature Pads */}
                <div className="grid grid-cols-2 gap-2.5">
                  <SignatureCanvasPad
                    label={`Seller Sign (${kararForm.sellerName})`}
                    onSignChange={(dataUrl) => setKararForm((p) => ({ ...p, sellerSign: dataUrl }))}
                  />
                  <SignatureCanvasPad
                    label={`Buyer Sign (${kararForm.buyerName})`}
                    onSignChange={(dataUrl) => setKararForm((p) => ({ ...p, buyerSign: dataUrl }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => window.print()}
                    className="py-3 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" /> Print Signed MoU
                  </button>
                  <button
                    onClick={async () => {
                      const updated = { ...selectedToolProp, status: 'Token Given' };
                      await savePropertyToCloud(updated);
                      sendWhatsApp(
                        kararForm.buyerPhone,
                        `🤝 *રાધિકા એસ્ટેટ એજન્સી — ટોકન રસીદ (સમજૂતી કરાર)*\n🏠 *મિલકત:* ${selectedToolProp.title} (${selectedToolProp.uniqueCode})\n👤 *વેચનાર:* ${kararForm.sellerName}\n👤 *ખરીદનાર:* ${kararForm.buyerName}\n💰 *નક્કી કરેલ કિંમત:* ${formatPriceIndian(kararForm.agreedPriceLakhs)}\n✅ *આજરોજ ટોકન રકમ:* ₹${Number(kararForm.tokenAmountRupees).toLocaleString('en-IN')}\n📅 *દસ્તાવેજ મુદત:* ${kararForm.saleDeedDays} દિવસ`
                      );
                    }}
                    className="py-3 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" /> Lock Token & WhatsApp
                  </button>
                </div>
              </div>
            )}

            {/* TOOL 4: MULTI-PROPERTY SITE VISIT TOUR & KEY TRACKER */}
            {activeToolModal === 'tour' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Select Buyer for Site Visit Tour:</label>
                  <select
                    value={tourBuyerId}
                    onChange={(e) => setTourBuyerId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
                  >
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.phone}) — Up to {formatPriceIndian(l.budgetMaxLakhs)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <div className="font-bold text-slate-700">Tap Properties to Include in Visit Route:</div>
                  {properties.map((p) => {
                    const selected = tourPropertyIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setTourPropertyIds((prev) =>
                            prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                          );
                        }}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between gap-2 transition ${
                          selected
                            ? 'bg-amber-50/80 border-[#EA9E24]'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900">
                            {p.uniqueCode} • {p.title}
                          </div>
                          <div className="text-[11px] text-slate-600">
                            🔑 Key: <b>{p.keyLocation}</b> • 📞 Owner: {p.ownerPhone || 'Direct'}
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center ${
                            selected ? 'bg-[#EA9E24] text-slate-950' : 'bg-white border border-slate-300'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    const buyer = leads.find((l) => l.id === tourBuyerId) || leads[0];
                    const chosen = properties.filter((p) => tourPropertyIds.includes(p.id));
                    if (chosen.length === 0) return;
                    const summaryLines = chosen
                      .map(
                        (c, i) =>
                          `${i + 1}. *${c.title}* (${c.areaVaar} Vaar) — ${formatPriceIndian(c.quotedPriceLakhs)} [Ref: ${c.uniqueCode}]`
                      )
                      .join('\n');
                    sendWhatsApp(
                      buyer?.phone || '',
                      `*Radhika Estate Agency — Site Visit Summary*\nનમસ્તે ${buyer?.name || ''}, આજની સાઈટ વિઝિટ માટે શોર્ટલિસ્ટ કરેલ મિલકતો:\n\n${summaryLines}\n\nકઈ મિલકત આપને સૌથી વધુ પસંદ આવી તે જણાવશો.`
                    );
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" /> Send Visit Shortlist to Buyer on WhatsApp
                </button>
              </div>
            )}

            {/* TOOL 5: WHATSAPP IMPORTER & CLOUD BACKUP */}
            {activeToolModal === 'import' && (
              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">
                    Paste Forwarded WhatsApp Broker Message:
                  </label>
                  <textarea
                    rows={3}
                    value={waImportText}
                    onChange={(e) => setWaImportText(e.target.value)}
                    placeholder="e.g. 3 BHK Silver Heights Nana Mava 1310 carpet East facing 64 Lakhs..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                  />
                  <button
                    onClick={async () => {
                      const text = waImportText.trim() || '3 BHK Silver Heights Nana Mava 1310 carpet East facing 64 Lakhs';
                      await runVoiceExtraction(null, text);
                      setActiveToolModal(null);
                      setActiveTab('capture');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#EA9E24] text-slate-950 font-bold"
                  >
                    Extract into Add Property
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="font-bold text-slate-700">Trusted Co-Brokers ({coBrokers.length})</div>
                  {coBrokers.map((cb) => (
                    <div key={cb.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{cb.name} ({cb.agency})</div>
                        <div className="text-slate-500">{cb.specialtyArea} • {cb.chainType}</div>
                      </div>
                      <button
                        onClick={() => sendWhatsApp(cb.phone, `Namaste ${cb.name}, Radhika Estate Agency here.`)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                      >
                        WhatsApp
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify({ properties, leads, coBrokers }, null, 2)], {
                        type: 'application/json'
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Radhika_Estate_Backup.json`;
                      a.click();
                      notify('Cloud Backup Downloaded!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Download Full Backup (.JSON)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================
          SIMPLE 4-TAB BOTTOM NAVIGATION BAR
         ====================================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-3 py-1.5">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <button
            onClick={() => setActiveTab('capture')}
            className={`flex flex-col items-center justify-center py-2 rounded-xl transition ${
              activeTab === 'capture'
                ? 'text-[#EA9E24] font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">Add Property</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex flex-col items-center justify-center py-2 rounded-xl transition ${
              activeTab === 'inventory'
                ? 'text-[#EA9E24] font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">Properties ({properties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('buyers')}
            className={`flex flex-col items-center justify-center py-2 rounded-xl transition ${
              activeTab === 'buyers'
                ? 'text-[#EA9E24] font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">Buyers ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex flex-col items-center justify-center py-2 rounded-xl transition ${
              activeTab === 'tools'
                ? 'text-[#EA9E24] font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">Quick Tools</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
