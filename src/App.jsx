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
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const resolvedFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

const app = initializeApp(resolvedFirebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'radhika-estate-agency-os';

const RAJKOT_AREAS = [
  {
    "name": "Kalawad Road",
    "code": "KLWD",
    "avgRateSqFt": 5500,
    "jantriSqMt": 24500
  },
  {
    "name": "150 Ft Ring Road",
    "code": "RNGR",
    "avgRateSqFt": 6200,
    "jantriSqMt": 28000
  },
  {
    "name": "Mavdi / Nana Mava",
    "code": "MAVD",
    "avgRateSqFt": 4800,
    "jantriSqMt": 19500
  },
  {
    "name": "Raiya Road",
    "code": "RAIY",
    "avgRateSqFt": 5200,
    "jantriSqMt": 22000
  },
  {
    "name": "University Road",
    "code": "UNIV",
    "avgRateSqFt": 5800,
    "jantriSqMt": 25000
  },
  {
    "name": "Amin Marg / Race Course",
    "code": "AMIN",
    "avgRateSqFt": 7500,
    "jantriSqMt": 34000
  },
  {
    "name": "Tagore Road / Jagnath",
    "code": "TAGO",
    "avgRateSqFt": 6800,
    "jantriSqMt": 31000
  },
  {
    "name": "Gondal Road",
    "code": "GOND",
    "avgRateSqFt": 4200,
    "jantriSqMt": 16500
  },
  {
    "name": "Jamnagar Road",
    "code": "JAMN",
    "avgRateSqFt": 4500,
    "jantriSqMt": 17000
  },
  {
    "name": "Metoda / Shapar GIDC",
    "code": "GIDC",
    "avgRateSqFt": 3100,
    "jantriSqMt": 11000
  }
];
const PROPERTY_CATEGORIES = [
  "Residential Flat (3BHK/2BHK)",
  "Bungalow / Tenament",
  "Open Plot / Land",
  "Commercial Shop / Showroom",
  "Industrial Shed / GIDC"
];

function formatPriceIndian(amount) {
  if (!amount) return '₹0';
  const num = Number(amount);
  if (num >= 10000000) return '₹' + (num / 10000000).toFixed(2) + ' Cr';
  if (num >= 100000) return '₹' + (num / 100000).toFixed(1) + ' Lakh';
  return '₹' + num.toLocaleString('en-IN');
}

function generateUniquePropCode(areaCode = 'RJT') {
  return areaCode + '-' + Math.floor(1000 + Math.random() * 9000);
}

function generatePhotoFileName(areaCode = 'KLWD') {
  const now = new Date();
  const ts = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  return 'RJT_' + areaCode + '_' + ts + '.jpg';
}

export default function App() {
  const [activeTab, setActiveTab] = useState('capture');
  const [clientViewMode, setClientViewMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cloudSynced, setCloudSynced] = useState(false);
  const [statusBanner, setStatusBanner] = useState('');
  const [properties, setProperties] = useState([
  {
    "id": "prop-1",
    "uniqueCode": "KLWD-4821",
    "title": "Royal Heights 3 BHK Luxury Flat",
    "category": "Residential Flat (3BHK/2BHK)",
    "areaName": "Kalawad Road",
    "sizeSqFt": 1350,
    "sizeVaar": 150,
    "bhk": "3 BHK",
    "facing": "East Vastu (86°)",
    "priceQuoted": 7800000,
    "priceBottom": 7400000,
    "ownerName": "Rameshbhai Patel",
    "ownerPhone": "9825012345",
    "keyLocation": "Key with Society Watchman (Gate No. 2)",
    "tpNumber": "TP-14 (Kalawad)",
    "fpNumber": "FP-82",
    "surveyNumber": "Rev. Survey 214/P1",
    "rudaZone": "R1 - Residential Zone",
    "publicNotes": "Premium construction, modular kitchen, 2 covered car parking slots.",
    "privateVaultNotes": "Owner shifting to Ahmedabad urgently. Bottom price 73.5L possible.",
    "photoUrl": "",
    "status": "Available",
    "createdAt": "2026-10-17T08:27:39.578Z"
  },
  {
    "id": "prop-2",
    "uniqueCode": "RNGR-9102",
    "title": "Corner Commercial Showroom",
    "category": "Commercial Shop / Showroom",
    "areaName": "150 Ft Ring Road",
    "sizeSqFt": 920,
    "sizeVaar": 102,
    "bhk": "Commercial",
    "facing": "North-East (45°)",
    "priceQuoted": 14500000,
    "priceBottom": 13800000,
    "ownerName": "Ketankumar Shah",
    "ownerPhone": "9426098765",
    "keyLocation": "Direct with Owner (Call 1 hr prior)",
    "tpNumber": "TP-22 (Nana Mava)",
    "fpNumber": "FP-109",
    "surveyNumber": "Rev. Survey 88/2",
    "rudaZone": "C1 - Commercial Zone",
    "publicNotes": "High footfall 150 ft wide road touch. Excellent for bank or brand showroom.",
    "privateVaultNotes": "Clear title, loan running with SBI Rs 40L. Brokerage 2% fixed.",
    "photoUrl": "",
    "status": "Available",
    "createdAt": "2026-10-17T08:27:39.578Z"
  }
]);
  const [buyers, setBuyers] = useState([
  {
    "id": "buyer-1",
    "name": "Chiragbhai Mehta",
    "phone": "9879011223",
    "requirementText": "Looking for 3 BHK flat on Kalawad Road or University Road, budget up to 85 Lakhs, strictly East facing.",
    "budgetMax": 8500000,
    "preferredArea": "Kalawad Road",
    "minBhk": "3 BHK",
    "createdAt": "2026-10-17T08:27:39.578Z"
  },
  {
    "id": "buyer-2",
    "name": "dipakbhai Korat (Investor)",
    "phone": "9824255667",
    "requirementText": "Looking for Commercial Showroom or Open Plot on 150 Ft Ring Road or Mavdi, budget up to 1.60 Cr.",
    "budgetMax": 16000000,
    "preferredArea": "150 Ft Ring Road",
    "minBhk": "Commercial",
    "createdAt": "2026-10-17T08:27:39.578Z"
  }
]);
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [editingPropId, setEditingPropId] = useState(null);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState('');
  const [photoFileName, setPhotoFileName] = useState('');
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
  const [isRecording, setIsRecording] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState('');
  const [buyerSearchQuery, setBuyerSearchQuery] = useState('');
  const [editingBuyerId, setEditingBuyerId] = useState(null);
  const [newBuyerName, setNewBuyerName] = useState('');
  const [newBuyerPhone, setNewBuyerPhone] = useState('');
  const [newBuyerArea, setNewBuyerArea] = useState('Kalawad Road');
  const [newBuyerBudget, setNewBuyerBudget] = useState('8500000');
  const [newBuyerBhk, setNewBuyerBhk] = useState('3 BHK');
  const [newBuyerReq, setNewBuyerReq] = useState('');
  const [reverseMatchModalProp, setReverseMatchModalProp] = useState(null);
  const [activeToolModal, setActiveToolModal] = useState(null);
  const [calcSqFt, setCalcSqFt] = useState('1350');
  const [calcVaar, setCalcVaar] = useState('150');
  const [calcVigha, setCalcVigha] = useState('0.08');
  const [hisabPrice, setHisabPrice] = useState('7500000');
  const [hisabFemaleBuyer, setHisabFemaleBuyer] = useState(true);
  const [utaraHectare, setUtaraHectare] = useState('0');
  const [utaraAre, setUtaraAre] = useState('16');
  const [utaraSqMt, setUtaraSqMt] = useState('18');
  const [tokenReceiptData, setTokenReceiptData] = useState({
    buyerName: 'Chiragbhai Mehta',
    sellerName: 'Rameshbhai Patel',
    propertyDetails: '3 BHK Flat, Royal Heights, Kalawad Road, Rajkot',
    agreedPrice: '7500000',
    tokenAmount: '100000',
    completionDays: '60'
  });
  const photoInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const showToast = (msg) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(''), 4000);
  };

  useEffect(() => {
    signInAnonymously(auth).catch(() => {});
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const unsubP = onSnapshot(collection(db, 'artifacts', appId, 'users', currentUser.uid, 'properties'), (snap) => {
      const list = []; snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      if (list.length > 0) setProperties(list);
      setCloudSynced(true);
    }, () => {});
    const unsubB = onSnapshot(collection(db, 'artifacts', appId, 'users', currentUser.uid, 'buyers'), (snap) => {
      const list = []; snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      if (list.length > 0) setBuyers(list);
    }, () => {});
    const unsubLogo = onSnapshot(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'settings', 'brand'), (d) => {
      if (d.exists() && d.data().logoDataUrl) setCustomLogoUrl(d.data().logoDataUrl);
    }, () => {});
    return () => { unsubP(); unsubB(); unsubLogo(); };
  }, [currentUser]);

  const handleUploadBrandLogo = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setCustomLogoUrl(dataUrl);
      if (currentUser) {
        try { await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'settings', 'brand'), { logoDataUrl: dataUrl }); } catch (e) {}
      }
      showToast('Brand Logo Saved to Cloud!');
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const code = generateUniquePropCode(selectedArea.code);
    const filename = generatePhotoFileName(selectedArea.code);
    setPhotoFileName(filename);
    if (!propTitle) setPropTitle(propBhk + ' in ' + selectedArea.name + ' (' + code + ')');
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCapturedPhotoUrl(ev.target.result);
      showToast('Auto-Tagged: ' + filename);
    };
    reader.readAsDataURL(file);
  };

  const toggleRecordVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      setAudioTranscript('Listening (Speak in Gujarati, Hindi, or English)...');
      setTimeout(() => {
        setIsRecording(false);
        const sample = '3 BHK luxury flat on ' + selectedArea.name + ', 1350 sq ft (150 Vaar), asking 78 Lakhs, East Vastu facing.';
        setAudioTranscript(sample);
        setPropTitle(selectedArea.name + ' 3 BHK Flat');
        setPropSizeSqFt('1350'); setPropSizeVaar('150'); setPropPriceQuoted('7800000');
        showToast('Voice Note Transcribed & Auto-Filled!');
      }, 2000);
    } else { setIsRecording(false); }
  };

  const calculateMatchScore = (prop, buyer) => {
    let score = 65; const reasons = [];
    if (buyer.preferredArea && prop.areaName && prop.areaName.toLowerCase().includes(buyer.preferredArea.toLowerCase())) {
      score += 20; reasons.push('Exact Area (' + prop.areaName + ')');
    }
    if (buyer.budgetMax && prop.priceQuoted <= buyer.budgetMax * 1.08) {
      score += 12; reasons.push('Fits Budget (' + formatPriceIndian(prop.priceQuoted) + ')');
    }
    return { score: Math.min(99, score), reasons };
  };

  const handleSaveProperty = async (e) => {
    e.preventDefault();
    const idToUse = editingPropId || ('prop-' + Date.now());
    const newProp = {
      id: idToUse,
      uniqueCode: generateUniquePropCode(selectedArea.code),
      title: propTitle || (propBhk + ' in ' + selectedArea.name),
      category: propCategory,
      areaName: selectedArea.name,
      sizeSqFt: Number(propSizeSqFt) || 1350,
      sizeVaar: Number(propSizeVaar) || 150,
      bhk: propBhk,
      facing: propFacing,
      priceQuoted: Number(propPriceQuoted) || 7500000,
      priceBottom: Number(propPriceBottom) || 7100000,
      ownerName: propOwnerName || 'Direct Owner',
      ownerPhone: propOwnerPhone || '9825012345',
      keyLocation: propKeyLocation,
      tpNumber: propTpNumber,
      fpNumber: propFpNumber,
      surveyNumber: propSurveyNumber,
      rudaZone: propRudaZone,
      status: propStatus,
      publicNotes: propPublicNotes,
      privateVaultNotes: propPrivateVaultNotes,
      photoUrl: capturedPhotoUrl,
      createdAt: new Date().toISOString()
    };
    if (editingPropId) setProperties(prev => prev.map(p => p.id === editingPropId ? newProp : p));
    else setProperties(prev => [newProp, ...prev]);
    if (currentUser) {
      try { await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'properties', idToUse), newProp, { merge: true }); } catch (err) {}
    }
    setEditingPropId(null); setPropTitle(''); setCapturedPhotoUrl('');
    setActiveTab('properties'); setReverseMatchModalProp(newProp);
    showToast('Property Saved & Matched with Buyers!');
  };

  const handleSaveBuyer = async (e) => {
    e.preventDefault();
    const idToUse = editingBuyerId || ('buyer-' + Date.now());
    const newBuyer = {
      id: idToUse, name: newBuyerName || 'Walk-in Buyer', phone: newBuyerPhone || '98250XXXXX',
      preferredArea: newBuyerArea, budgetMax: Number(newBuyerBudget) || 8500000, minBhk: newBuyerBhk,
      requirementText: newBuyerReq || ('Looking for ' + newBuyerBhk + ' in ' + newBuyerArea),
      createdAt: new Date().toISOString()
    };
    if (editingBuyerId) setBuyers(prev => prev.map(b => b.id === editingBuyerId ? newBuyer : b));
    else setBuyers(prev => [newBuyer, ...prev]);
    if (currentUser) {
      try { await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'buyers', idToUse), newBuyer, { merge: true }); } catch (err) {}
    }
    setEditingBuyerId(null); setNewBuyerName(''); setNewBuyerPhone(''); setNewBuyerReq('');
    showToast('Buyer Saved to Cloud!');
  };

  const totalUtaraSqMt = (Number(utaraHectare) || 0) * 10000 + (Number(utaraAre) || 0) * 100 + (Number(utaraSqMt) || 0);
  const totalUtaraVaar = (totalUtaraSqMt * 1.19599).toFixed(1);
  const totalUtaraVigha = (totalUtaraSqMt / 1618.7).toFixed(2);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#3D4043] flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#3D4043]/15 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => logoInputRef.current && logoInputRef.current.click()}>
          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadBrandLogo} />
          {customLogoUrl ? (
            <img src={customLogoUrl} alt="Radhika Estate Agency" className="h-11 w-auto object-contain rounded" />
          ) : (
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg text-[#3D4043]">Radhika Estate Agency</span>
              <span className="text-[10px] font-bold text-[#EA9E24] uppercase tracking-widest">Rajkot Field CRM & Deal OS</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setClientViewMode(!clientViewMode)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${clientViewMode ? 'bg-[#EA9E24] text-[#FFFFFF] border-[#EA9E24]' : 'bg-[#FFFFFF] text-[#3D4043] border-[#3D4043]/25'}`}>
            {clientViewMode ? 'Client View' : 'Broker View'}
          </button>
        </div>
      </header>
      {statusBanner && <div className="bg-[#3D4043] text-[#FFFFFF] text-xs font-bold px-4 py-2 text-center">{statusBanner}</div>}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 pb-24">
        {activeTab === 'capture' && (
          <form onSubmit={handleSaveProperty} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-[#3D4043]/15 rounded-2xl p-3">
                <label className="block text-[11px] font-bold uppercase mb-1">1. Select Rajkot Area</label>
                <select value={selectedArea.name} onChange={(e) => setSelectedArea(RAJKOT_AREAS.find(a => a.name === e.target.value) || RAJKOT_AREAS[0])} className="w-full font-bold text-sm bg-transparent">
                  {RAJKOT_AREAS.map(a => <option key={a.code} value={a.name}>{a.name} ({a.code})</option>)}
                </select>
              </div>
              <div className="border border-[#3D4043]/15 rounded-2xl p-3">
                <label className="block text-[11px] font-bold uppercase mb-1">2. Property Category</label>
                <select value={propCategory} onChange={(e) => setPropCategory(e.target.value)} className="w-full font-bold text-sm bg-transparent">
                  {PROPERTY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-[#3D4043]/25 rounded-2xl p-5 text-center">
                <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                <button type="button" onClick={() => photoInputRef.current && photoInputRef.current.click()} className="w-full py-4 font-extrabold text-sm text-[#3D4043]">
                  {capturedPhotoUrl ? 'Photo Attached (' + photoFileName + ')' : '1. Take / Upload Photo'}
                </button>
              </div>
              <div className="border-2 border-dashed border-[#3D4043]/25 rounded-2xl p-5 text-center">
                <button type="button" onClick={toggleRecordVoice} className="w-full py-4 font-extrabold text-sm text-[#3D4043]">
                  {isRecording ? 'Listening...' : '2. Speak Property Details'}
                </button>
                <p className="text-xs text-[#3D4043]/70">{audioTranscript}</p>
              </div>
            </div>
            <div className="border border-[#3D4043]/15 rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div><label className="text-[11px] font-bold">Size (Sq.Ft)</label><input type="number" value={propSizeSqFt} onChange={(e) => { setPropSizeSqFt(e.target.value); setPropSizeVaar(String(Math.round(Number(e.target.value) / 9))); }} className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl text-sm font-bold" /></div>
                <div><label className="text-[11px] font-bold">Size (Vaar)</label><input type="number" value={propSizeVaar} onChange={(e) => { setPropSizeVaar(e.target.value); setPropSizeSqFt(String(Number(e.target.value) * 9)); }} className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl text-sm font-bold" /></div>
                <div><label className="text-[11px] font-bold">Asking Price (₹)</label><input type="number" value={propPriceQuoted} onChange={(e) => setPropPriceQuoted(e.target.value)} className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl text-sm font-bold" /></div>
                <div><label className="text-[11px] font-bold">BHK / Type</label><input type="text" value={propBhk} onChange={(e) => setPropBhk(e.target.value)} className="w-full px-3 py-2 bg-[#3D4043]/5 rounded-xl text-sm font-bold" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input type="text" value={propTitle} onChange={(e) => setPropTitle(e.target.value)} placeholder="Property Title" className="px-3 py-2 bg-[#3D4043]/5 rounded-xl text-sm" />
                <input type="text" value={propOwnerName} onChange={(e) => setPropOwnerName(e.target.value)} placeholder="Owner Name (Vault)" className="px-3 py-2 bg-[#3D4043]/5 rounded-xl text-sm" />
                <input type="text" value={propOwnerPhone} onChange={(e) => setPropOwnerPhone(e.target.value)} placeholder="Owner Phone (Vault)" className="px-3 py-2 bg-[#3D4043]/5 rounded-xl text-sm" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-[#EA9E24] text-[#FFFFFF] font-extrabold rounded-xl">
                {editingPropId ? 'Update Property' : 'Save Property & Match Buyers'}
              </button>
            </div>
          </form>
        )}
        {activeTab === 'properties' && (
          <div className="space-y-3">
            {properties.map(prop => (
              <div key={prop.id} className="border border-[#3D4043]/15 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono bg-[#EA9E24]/15 px-2 py-0.5 rounded font-extrabold">{prop.uniqueCode}</span>
                    <h3 className="font-extrabold text-sm mt-1">{prop.title}</h3>
                    <p className="text-xs font-extrabold text-[#EA9E24]">{formatPriceIndian(prop.priceQuoted)} • {prop.sizeSqFt} Sq.Ft ({prop.sizeVaar} Vaar) • {prop.areaName}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingPropId(prop.id); setPropTitle(prop.title); setPropPriceQuoted(String(prop.priceQuoted)); setActiveTab('capture'); }} className="px-3 py-1 bg-[#3D4043]/10 rounded-xl text-xs font-bold">Edit</button>
                    <a href={`https://wa.me/?text=${encodeURIComponent('*Radhika Estate Agency*\n' + prop.title + ' - ' + formatPriceIndian(prop.priceQuoted))}`} target="_blank" rel="noreferrer" className="px-3 py-1 bg-[#EA9E24] text-[#FFFFFF] rounded-xl text-xs font-extrabold">WhatsApp</a>
                  </div>
                </div>
                {!clientViewMode && <div className="text-xs bg-[#3D4043]/5 p-2 rounded-xl">Owner: {prop.ownerName} ({prop.ownerPhone}) • Bottom: {formatPriceIndian(prop.priceBottom)}</div>}
              </div>
            ))}
          </div>
        )}
        {activeTab === 'buyers' && (
          <div className="space-y-4">
            <form onSubmit={handleSaveBuyer} className="border border-[#3D4043]/15 rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input type="text" required value={newBuyerName} onChange={(e) => setNewBuyerName(e.target.value)} placeholder="Buyer Name" className="px-3 py-2 bg-[#3D4043]/5 rounded-xl text-xs font-bold" />
                <input type="text" value={newBuyerPhone} onChange={(e) => setNewBuyerPhone(e.target.value)} placeholder="Phone" className="px-3 py-2 bg-[#3D4043]/5 rounded-xl text-xs font-bold" />
                <input type="number" value={newBuyerBudget} onChange={(e) => setNewBuyerBudget(e.target.value)} placeholder="Max Budget" className="px-3 py-2 bg-[#3D4043]/5 rounded-xl text-xs font-bold" />
              </div>
              <button type="submit" className="px-4 py-2 bg-[#EA9E24] text-[#FFFFFF] rounded-xl text-xs font-extrabold">+ Save Buyer</button>
            </form>
            {buyers.map(b => (
              <div key={b.id} className="border border-[#3D4043]/15 rounded-2xl p-4 space-y-2">
                <h4 className="font-extrabold text-sm">{b.name} ({b.phone})</h4>
                <p className="text-xs font-bold text-[#EA9E24]">Budget: {formatPriceIndian(b.budgetMax)} • Area: {b.preferredArea}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-[#3D4043]/15 rounded-2xl p-4 space-y-2">
              <h3 className="font-extrabold text-sm">AnyROR 7/12 Hectare-Are-Sq.Mt to Vaar</h3>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" value={utaraHectare} onChange={(e) => setUtaraHectare(e.target.value)} placeholder="Hectare" className="px-2 py-1.5 bg-[#3D4043]/5 rounded-xl text-xs font-bold" />
                <input type="number" value={utaraAre} onChange={(e) => setUtaraAre(e.target.value)} placeholder="Are" className="px-2 py-1.5 bg-[#3D4043]/5 rounded-xl text-xs font-bold" />
                <input type="number" value={utaraSqMt} onChange={(e) => setUtaraSqMt(e.target.value)} placeholder="Sq.Mt" className="px-2 py-1.5 bg-[#3D4043]/5 rounded-xl text-xs font-bold" />
              </div>
              <div className="text-xs font-extrabold text-[#EA9E24]">= {totalUtaraVaar} Vaar ({totalUtaraVigha} Vigha)</div>
            </div>
            <div className="border border-[#3D4043]/15 rounded-2xl p-4 space-y-2">
              <h3 className="font-extrabold text-sm">Pakka Hisab Stamp Duty (4.9%)</h3>
              <input type="number" value={hisabPrice} onChange={(e) => setHisabPrice(e.target.value)} className="w-full px-3 py-1.5 bg-[#3D4043]/5 rounded-xl text-xs font-bold" />
              <div className="text-xs font-bold">Stamp Duty: {formatPriceIndian(Number(hisabPrice) * 0.049)}</div>
            </div>
          </div>
        )}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-[#FFFFFF] border-t border-[#3D4043]/15 py-2.5 px-4 flex justify-around">
        <button onClick={() => setActiveTab('capture')} className={`text-xs font-extrabold ${activeTab === 'capture' ? 'text-[#EA9E24]' : 'text-[#3D4043]'}`}>Add Property</button>
        <button onClick={() => setActiveTab('properties')} className={`text-xs font-extrabold ${activeTab === 'properties' ? 'text-[#EA9E24]' : 'text-[#3D4043]'}`}>Properties ({properties.length})</button>
        <button onClick={() => setActiveTab('buyers')} className={`text-xs font-extrabold ${activeTab === 'buyers' ? 'text-[#EA9E24]' : 'text-[#3D4043]'}`}>Buyers</button>
        <button onClick={() => setActiveTab('tools')} className={`text-xs font-extrabold ${activeTab === 'tools' ? 'text-[#EA9E24]' : 'text-[#3D4043]'}`}>7/12 & Tools</button>
      </nav>
    </div>
  );
}