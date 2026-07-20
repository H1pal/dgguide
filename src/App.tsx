/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ChangeEvent } from "react";
import ScenarioManager from './components/simulator/ScenarioManager';
import HelpChat from "./components/HelpChat";
import { 
  Camera, 
  Upload, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  HelpCircle, 
  Accessibility, 
  ChevronRight, 
  Sparkles, 
  Loader2, 
  X, 
  FileText, 
  Lightbulb, 
  Info, 
  ArrowRight,
  RefreshCw,
  Sliders,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StepGuide {
  title: string;
  desc: string;
}

interface KioskElement {
  name: string;
  location: string;
  action: string;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}

interface AnalysisResult {
  screenType: string;
  keyAction: string;
  steps: StepGuide[];
  elements: KioskElement[];
  tips: string[];
  ttsScript: string;
}

type TextSize = "normal" | "large" | "xlarge";

export default function App() {
  // UI & Customization State
  const [textSize, setTextSize] = useState<TextSize>("large"); // Default to large for seniors
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);
  
  // Media State
  const [activeImage, setActiveImage] = useState<string>("");
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedElement, setSelectedElement] = useState<KioskElement | null>(null);

  // TTS State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.75); // Default 0.75x slower speech for seniors
  const [autoPlayTts, setAutoPlayTts] = useState<boolean>(true);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      stopSpeech();
    };
  }, []);

  // Helper for text sizing class mapping
  const sizeClasses = {
    normal: {
      base: "text-base leading-relaxed",
      title: "text-lg font-bold",
      heading: "text-2xl font-black",
      desc: "text-sm",
      key: "text-xl font-extrabold",
      badge: "text-xs px-2 py-1",
      button: "text-sm font-semibold px-4 py-2",
      icon: 18
    },
    large: {
      base: "text-lg leading-relaxed md:text-xl",
      title: "text-xl font-bold md:text-2xl",
      heading: "text-3xl font-black md:text-4xl",
      desc: "text-base",
      key: "text-2xl font-extrabold md:text-3xl",
      badge: "text-sm px-3 py-1.5",
      button: "text-base font-bold px-6 py-3",
      icon: 22
    },
    xlarge: {
      base: "text-xl leading-loose md:text-2xl",
      title: "text-2xl font-black md:text-3xl",
      heading: "text-4xl font-black md:text-5xl",
      desc: "text-lg",
      key: "text-3xl font-black md:text-4xl",
      badge: "text-base px-4 py-2",
      button: "text-lg font-black px-8 py-4",
      icon: 26
    }
  }[textSize];

  // Web Camera Controls
  const startCamera = async () => {
    setActiveTab("camera");
    setIsCameraActive(true);
    setCameraError("");
    setUploadedFileName("");
    setAnalysisResult(null);
    setSelectedElement(null);
    stopSpeech();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError("카메라를 켤 수 없습니다. 브라우저 권한을 확인하시거나 사진 올리기를 사용해 주세요.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setActiveImage(dataUrl);
        stopCamera();
      }
    }
  };

  // Image Upload handler
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    stopCamera();
    setAnalysisResult(null);
    setSelectedElement(null);
    stopSpeech();

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setActiveImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Highlight Location parser
  const getHighlightStyle = (element: KioskElement) => {
    if (
      element.top !== undefined &&
      element.left !== undefined &&
      element.width !== undefined &&
      element.height !== undefined
    ) {
      return {
        top: `${element.top}%`,
        left: `${element.left}%`,
        width: `${element.width}%`,
        height: `${element.height}%`
      };
    }

    const location = element.location || "";
    const norm = location.toLowerCase().replace(/\s+/g, "");
    
    // 1. Extreme Corners / Edges
    if (norm.includes("우측하단") || norm.includes("오른쪽아래") || norm.includes("오른쪽하단") || norm.includes("하단우측")) {
      return { top: "74%", left: "58%", width: "38%", height: "22%" };
    }
    if (norm.includes("우측상단") || norm.includes("오른쪽위") || norm.includes("오른쪽상단") || norm.includes("상단우측")) {
      return { top: "4%", left: "58%", width: "38%", height: "22%" };
    }
    if (norm.includes("좌측하단") || norm.includes("왼쪽아래") || norm.includes("왼쪽하단") || norm.includes("하단좌측")) {
      return { top: "74%", left: "4%", width: "38%", height: "22%" };
    }
    if (norm.includes("좌측상단") || norm.includes("왼쪽위") || norm.includes("왼쪽상단") || norm.includes("상단좌측")) {
      return { top: "4%", left: "4%", width: "38%", height: "22%" };
    }
    
    // 2. Center-relative positions
    if (norm.includes("가운데아래") || norm.includes("중앙아래") || norm.includes("아래쪽가운데") || norm.includes("하단가운데") || norm.includes("하단중앙") || norm.includes("가운데하단")) {
      return { top: "74%", left: "25%", width: "50%", height: "22%" };
    }
    if (norm.includes("가운데위") || norm.includes("중앙위") || norm.includes("위쪽가운데") || norm.includes("상단가운데") || norm.includes("상단중앙") || norm.includes("가운데상단")) {
      return { top: "4%", left: "25%", width: "50%", height: "20%" };
    }

    // 3. Side positions
    if (norm.includes("오른쪽") || norm.includes("우측")) {
      return { top: "35%", left: "55%", width: "42%", height: "30%" };
    }
    if (norm.includes("왼쪽") || norm.includes("좌측")) {
      return { top: "35%", left: "3%", width: "42%", height: "30%" };
    }
    
    // 4. Rows
    if (norm.includes("맨아래") || norm.includes("하단") || norm.includes("아래쪽")) {
      return { top: "76%", left: "8%", width: "84%", height: "20%" };
    }
    if (norm.includes("맨위") || norm.includes("상단") || norm.includes("위쪽")) {
      return { top: "4%", left: "8%", width: "84%", height: "18%" };
    }
    
    // 5. Center
    if (norm.includes("가운데") || norm.includes("중앙") || norm.includes("센터")) {
      return { top: "28%", left: "12%", width: "76%", height: "38%" };
    }
    if (norm.includes("전체")) {
      return { top: "2%", left: "2%", width: "96%", height: "96%" };
    }
    
    // Fallback centered
    return { top: "25%", left: "15%", width: "70%", height: "40%" };
  };

  // Server-side AI Kiosk screen analyze caller
  const analyzeKioskScreen = async () => {
    if (!activeImage) return;
    
    setIsAnalyzing(true);
    setAnalysisError("");
    setAnalysisResult(null);
    setSelectedElement(null);
    stopSpeech();

    try {
      const response = await fetch("/api/analyze-kiosk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: activeImage }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "서버 통신 실패 또는 이미지 분석에 실패했습니다.");
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);

      // Play automatic voice guidance if checked
      if (autoPlayTts && data.ttsScript) {
        // Short timeout for smoother rendering layout transition
        setTimeout(() => {
          speakScript(data.ttsScript);
        }, 800);
      }
    } catch (err: any) {
      console.error("Analysis failure:", err);
      setAnalysisError(err.message || "서버와 연결을 할 수 없거나 이미지 데이터 전송에 문제가 있습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Text-To-Speech (TTS) Logic with Senior-Focused Robustness
  const speakScript = (text: string) => {
    if (!window.speechSynthesis) {
      console.warn("이 브라우저는 음성 재생을 지원하지 않습니다.");
      return;
    }

    // Crucial bugfix: resume first and cancel any stuck speech queues
    try {
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();
    } catch (e) {
      console.error("TTS reset error:", e);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const koreanVoice = voices.find(voice => 
        voice.lang.includes("ko-KR") || 
        voice.lang.includes("ko_KR") || 
        voice.name.includes("Korean") || 
        voice.name.includes("한국어")
      );
      if (koreanVoice) {
        utterance.voice = koreanVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onerror = (e) => {
        // Safe filters for expected SpeechSynthesis interruptions/cancellations
        if (e.error === "interrupted" || e.error === "canceled") {
          console.log("음성 안내가 정상적으로 전환되거나 중단되었습니다.");
        } else if (e.error === "not-allowed") {
          console.warn("브라우저 자동 재생 정책에 의해 음성 재생을 시작하려면 화면 클릭이 필요합니다.");
        } else {
          console.warn("SpeechSynthesisUtterance note:", e);
        }
        setIsSpeaking(false);
        setIsPaused(false);
      };

      speechUtteranceRef.current = utterance;
      setIsSpeaking(true);
      setIsPaused(false);
      window.speechSynthesis.speak(utterance);
    };

    // Chrome/Safari voice loading robustness
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        setVoiceAndSpeak();
        window.speechSynthesis.onvoiceschanged = null; // Clean up handler
      };
      // fallback in case event doesn't trigger
      setTimeout(setVoiceAndSpeak, 150);
    }
  };

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const togglePauseSpeech = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else if (analysisResult?.ttsScript) {
      speakScript(analysisResult.ttsScript);
    }
  };

  // Trigger rate change during live speech
  useEffect(() => {
    if (isSpeaking && analysisResult?.ttsScript) {
      // Restart speech with new rate
      speakScript(analysisResult.ttsScript);
    }
  }, [speechRate]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased transition-colors duration-200 break-keep">
      
      {/* Upper Navigation & Sizer Rail */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-slate-200 shadow-sm px-4 py-3 md:py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 w-full lg:w-auto">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-slate-800 flex flex-wrap items-center gap-1 sm:gap-2">
                <span className="whitespace-nowrap">디지털 가이드</span>
                
              </h1>
              <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 font-semibold mt-0.5 leading-tight">
                어려운 기계 화면을 찰칵! AI가 다정하게 설명해 드립니다.
              </p>
            </div>
          </div>

          {/* Quick Helper Buttons & Sizer Customization */}
          <div className="flex flex-row flex-wrap items-center justify-between lg:justify-end gap-2 w-full lg:w-auto mt-2 lg:mt-0 border-t lg:border-t-0 border-slate-100 pt-2 lg:pt-0">
            
            {/* Help Guide Button for Mobile/Desktop */}
            <button 
              onClick={() => setShowSimulator(true)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap"
            >
              <Sparkles size={14} />
              <span>실전 연습하기</span>
            </button>
            <button 
              onClick={() => setShowGuideModal(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap"
            >
              <HelpCircle size={14} />
              <span>사용 방법</span>
            </button>

            {/* Senior Customization Panel */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-sm">
              <div className="hidden sm:flex items-center gap-1 text-slate-600 font-extrabold text-xs ml-1 whitespace-nowrap">
                <Accessibility size={14} />
                <span>글씨 조절:</span>
              </div>
              
              <div className="flex gap-1 bg-white p-0.5 rounded-lg border border-slate-100">
                <button 
                  id="btn-size-normal"
                  onClick={() => setTextSize("normal")}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                    textSize === "normal" 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  작게
                </button>
                <button 
                  id="btn-size-large"
                  onClick={() => setTextSize("large")}
                  className={`px-2.5 py-1 rounded-md text-xs font-black transition-all flex items-center gap-0.5 whitespace-nowrap ${
                    textSize === "large" 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  보통
                </button>
                <button 
                  id="btn-size-xlarge"
                  onClick={() => setTextSize("xlarge")}
                  className={`px-2.5 py-1 rounded-md text-xs font-black transition-all flex items-center gap-0.5 whitespace-nowrap ${
                    textSize === "xlarge" 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  크게
                </button>
              </div>
            </div>

          </div>

        </div>
      </header>

        {/* Existing Content */}
        {showSimulator && (
          <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center">
            <ScenarioManager onClose={() => setShowSimulator(false)} />
          </div>
        )}

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-5 flex flex-col gap-6" id="kiosk-capturer">
          
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md p-5 flex flex-col gap-4">
            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                <Camera size={20} />
              </span>
              화면 업로드 방식 정하기
            </h2>

            {/* Sub-tabs for Image input modes */}
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1.5 rounded-xl">
              <button
                id="tab-camera"
                onClick={startCamera}
                className={`py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                  activeTab === "camera" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Camera size={14} className="flex-shrink-0" />
                <span className="whitespace-nowrap">카메라로 올리기</span>
              </button>
              <button
                id="tab-upload"
                onClick={() => { setActiveTab("upload"); stopCamera(); }}
                className={`py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                  activeTab === "upload" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Upload size={14} className="flex-shrink-0" />
                <span className="whitespace-nowrap">사진으로 올리기</span>
              </button>
            </div>

            {/* Webcam Stream Active View */}
            {isCameraActive && (
              <div className="relative aspect-[3/4] bg-black rounded-xl overflow-hidden border border-gray-800 shadow-inner">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 w-full px-4">
                  <button
                    id="btn-capture"
                    onClick={capturePhoto}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-base font-bold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 border-2 border-white scale-105 active:scale-95 transition-all whitespace-nowrap"
                  >
                    <span className="w-4 h-4 bg-white rounded-full animate-ping flex-shrink-0" />
                    <span className="whitespace-nowrap">찰칵! 이 화면으로 올리기</span>
                  </button>
                  <button
                    id="btn-cancel-camera"
                    onClick={stopCamera}
                    className="bg-gray-800 hover:bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap"
                  >
                    카메라 끄기
                  </button>
                </div>
              </div>
            )}

            {/* File Upload Mode */}
            {activeTab === "upload" && !isCameraActive && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 cursor-pointer transition-colors"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="p-4 bg-blue-100 text-blue-600 rounded-full mb-3">
                  <Upload size={32} />
                </div>
                <p className="font-bold text-slate-700 text-base">스마트폰이나 컴퓨터 안의 <br/> 사진 선택</p>
                <p className="text-xs text-slate-500 mt-1">이곳을 클릭하여 이미지를 올려보세요.</p>
                {uploadedFileName && (
                  <span className="mt-3 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1">
                    선택됨: {uploadedFileName}
                  </span>
                )}
              </div>
            )}

            {/* Camera Fallback & Info Error */}
            {cameraError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm font-medium">
                {cameraError}
              </div>
            )}

            {/* Active Image Visual Screen Frame */}
            {activeImage && !isCameraActive && (
              <div className="flex flex-col gap-3">
                <div className="relative border-4 border-slate-800 rounded-2xl shadow-lg bg-gray-100 mx-auto max-w-[340px]">
                  
                  {/* Tablet Frame Header Decorator */}
                  <div className="bg-slate-800 h-5 w-full flex items-center justify-center gap-1.5 rounded-t-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <div className="w-12 h-1 rounded-full bg-slate-700" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  </div>

                  {/* Kiosk Image */}
                  <img 
                    src={activeImage} 
                    alt="Kiosk Screen" 
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-contain max-h-[460px] rounded-b-xl"
                  />

                  {/* Visual Highlighting Overlay Ring */}
                  {selectedElement && (() => {
                    const highlightStyle = getHighlightStyle(selectedElement);
                    const topVal = parseInt(highlightStyle.top) || 0;
                    const leftVal = parseInt(highlightStyle.left) || 0;
                    
                    // Decide vertical alignment: if near top, put tooltip below the box to prevent cut-off
                    const verticalClass = topVal < 18 ? "top-full mt-2" : "-top-7";
                    
                    // Decide horizontal alignment: if near edges, align to the edge instead of centering
                    let horizontalClass = "left-1/2 -translate-x-1/2";
                    if (leftVal < 15) {
                      horizontalClass = "left-1";
                    } else if (leftVal > 50) {
                      horizontalClass = "right-1";
                    }
                    
                    return (
                      <motion.div 
                         initial={{ scale: 0.9, opacity: 0 }}
                         animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                         transition={{ repeat: Infinity, duration: 1.5 }}
                         style={highlightStyle}
                         className="absolute border-4 border-[#ff0000] rounded-xl bg-yellow-400/10 shadow-[0_0_15px_rgba(255,0,0,0.8)] pointer-events-none z-[999999]"
                      >
                        {/* Dynamic Tooltip Label to prevent overflow/clipping */}
                        <div className={`bg-[#ff0000] text-white text-[10px] md:text-xs font-black px-2 py-0.5 rounded absolute whitespace-nowrap shadow-lg ${verticalClass} ${horizontalClass} z-[1000000]`}>
                          {selectedElement.name} ({selectedElement.location})
                        </div>
                      </motion.div>
                    );
                  })()}
                </div>

                <div className="text-center text-xs text-slate-500 font-medium">
                  {selectedElement ? (
                    <span className="text-blue-600 font-bold">
                      지도에 빨간 점멸상자가 가리키는 곳(&apos;{selectedElement.name}&apos;)을 눌러보세요!
                    </span>
                  ) : (
                    "위 이미지는 현재 어르신이 보고 계신 기계 화면입니다."
                  )}
                </div>
              </div>
            )}

            {/* BIG TRIGGER ANALYSIS BUTTON */}
            {activeImage && !isCameraActive && (
              <button
                id="btn-analyze"
                onClick={analyzeKioskScreen}
                disabled={isAnalyzing}
                className={`w-full ${
                  isAnalyzing 
                    ? "bg-slate-200 cursor-not-allowed text-slate-500" 
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg active:scale-95"
                } text-lg md:text-xl font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform mt-2 whitespace-nowrap`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={24} className="animate-spin flex-shrink-0" />
                    <span className="whitespace-nowrap">화면 분석중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={sizeClasses.icon} className="animate-pulse flex-shrink-0" />
                    <span className="whitespace-nowrap">AI에게 이 화면 물어보기</span>
                  </>
                )}
              </button>
            )}

          </div>

        </section>

        {/* Right Hand: Detailed AI Guide Panel */}
        <section className="lg:col-span-7 flex flex-col gap-6" id="ai-guide-panel">
          
          <AnimatePresence mode="wait">
            {!analysisResult && !isAnalyzing && (
              <motion.div 
                key="empty-guide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border-2 border-slate-200 shadow-md p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <HelpCircle size={44} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-4">
                  도움이 필요하신가요?
                </h3>
                
                <div className="max-w-md text-slate-600 space-y-3 mb-8">
                  <p className={sizeClasses.base}>
                    1. AI분석 방법 정하기에서 <strong className="text-blue-600">카메라로 올리기</strong> 버튼을 눌러 화면을 찍거나, <strong className="text-blue-600">사진으로 올리기</strong> 버튼을 눌러 화면 올려 문제점을 해결하세요.
                  </p>
                  <p className={sizeClasses.base}>
                    2. 그 다음 <strong className="text-blue-600">[AI에게 이 화면 물어보기]</strong> 파란색 버튼를 누르면 친절한 설명과 목소리가 나옵니다.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 max-w-sm">
                  <p className="text-xs text-blue-800 leading-relaxed font-semibold">
                    💡 <strong className="font-bold">꿀팁:</strong> 현재 화면 오른쪽 위 <strong className="text-blue-600">&apos;크게 보기&apos;</strong> 버튼을 누르시면 모든 한글 설명이 어르신 눈높이에 맞게 아주 크게 바뀝니다.
                  </p>
                </div>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div 
                key="analyzing-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border-2 border-slate-200 shadow-md p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
              >
                {/* Elderly Friendly loading visuals */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
                  <span className="text-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce">
                    🔎
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 mb-4">
                  화면을 AI가 열심히 살피고 있어요!
                </h3>
                
                <div className="max-w-md text-slate-500 space-y-2 mb-4">
                  <p className={`${sizeClasses.title} text-blue-600`}>
                    &ldquo;AI가 돋보기를 쓰고 어디를 먼저 누르면 되는지 공부하고 있어요.&rdquo;
                  </p>
                  <p className="text-sm">
                    글자와 버튼들의 숨겨진 기능까지 꼼꼼히 찾아서 친절한 목소리로 가져다 드릴게요. 잠시만 기다려주세요!
                  </p>
                </div>
              </motion.div>
            )}

            {analysisResult && !isAnalyzing && (
              <motion.div 
                key="results-ready"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-6"
              >
                
                {/* 1. TTS SPEAKER CARD */}
                <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-md p-5 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl relative">
                        {isSpeaking ? (
                          <>
                            <Volume2 size={24} className="animate-bounce" />
                            {/* Speech wave ripple */}
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                          </>
                        ) : (
                          <VolumeX size={24} />
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-800">
                          음성 안내
                        </h4>
                        <p className="text-xs text-slate-500 font-semibold">
                          귀로 편안하게 들으면서 화면을 직접 조작해 보세요.
                        </p>
                      </div>
                    </div>

                    {/* Speech AutoPlay Toggler */}
                    <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        checked={autoPlayTts}
                        onChange={(e) => setAutoPlayTts(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-600 w-4 h-4 flex-shrink-0"
                      />
                      <span className="text-xs font-bold text-slate-600 whitespace-nowrap">분석 시 자동 음성 안내 켜기</span>
                    </label>
                  </div>

                  {/* Audio Controls Grid */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-4">
                    
                    {/* Control Buttons */}
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                      <button
                        id="btn-tts-toggle"
                        onClick={togglePauseSpeech}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black shadow-sm transition-all whitespace-nowrap ${
                          isSpeaking 
                            ? isPaused 
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {isSpeaking ? (
                          isPaused ? (
                            <>
                              <Play size={18} className="flex-shrink-0" />
                              <span className="whitespace-nowrap">음성안내 이어듣기</span>
                            </>
                          ) : (
                            <>
                              <Pause size={18} className="flex-shrink-0" />
                              <span className="whitespace-nowrap">잠시 멈춤</span>
                            </>
                          )
                        ) : (
                          <>
                            <Volume2 size={18} className="flex-shrink-0" />
                            <span className="whitespace-nowrap">음성안내 듣기</span>
                          </>
                        )}
                      </button>
                      
                      {isSpeaking && (
                        <button
                          id="btn-tts-stop"
                          onClick={stopSpeech}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-black shadow-sm transition-all whitespace-nowrap"
                        >
                          <Square size={18} className="flex-shrink-0" />
                          <span className="whitespace-nowrap">음성안내 끄기</span>
                        </button>
                      )}
                    </div>

                    {/* Speech Speed controls (Senior friendly) */}
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-slate-200 w-full md:w-auto justify-between md:justify-start whitespace-nowrap">
                      <span className="text-xs font-black text-slate-500 flex items-center gap-1 whitespace-nowrap">
                        <Sliders size={12} className="flex-shrink-0" />
                        <span className="whitespace-nowrap">말하기 속도:</span>
                      </span>
                      <div className="flex gap-1">
                        {[
                          { rate: 0.55, label: "천천히" },
                          { rate: 0.75, label: "조금느리게" },
                          { rate: 1.0, label: "보통" }
                        ].map((item) => (
                          <button
                            key={item.rate}
                            id={`btn-rate-${item.rate}`}
                            onClick={() => setSpeechRate(item.rate)}
                            className={`px-2 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
                              speechRate === item.rate 
                                ? "bg-blue-600 text-white" 
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Speech Waveform visualizer */}
                  {isSpeaking && !isPaused && (
                    <div className="flex items-center justify-center gap-1 h-5 bg-slate-50 py-1.5 rounded-lg border border-slate-100">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                        <motion.span 
                          key={i}
                          animate={{ height: [4, 16, 4] }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 0.8 + (i % 3) * 0.2, 
                            delay: i * 0.05 
                          }}
                          className="w-1 bg-blue-600 rounded-full"
                        />
                      ))}
                    </div>
                  )}

                  {/* Subtitle preview for seniors */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 max-h-24 overflow-y-auto">
                    <p className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1">
                      <FileText size={12} />
                      자막 (목소리가 하는 말):
                    </p>
                    <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                      {analysisResult.ttsScript}
                    </p>
                  </div>

                  {/* Troubleshooting tip for blocked TTS */}
                  <div className="bg-blue-50/50 rounded-xl p-3.5 border border-blue-100 text-xs text-slate-600 space-y-1">
                    <p className="font-black text-slate-800 flex items-center gap-1">
                      📢 안내 음성이 안 나오거나 끊기시나요?
                    </p>
                    <p className="leading-relaxed">
                      스마트폰이나 브라우저의 소리 무음 모드, 혹은 자동 음성 재생 보안 정책 때문일 수 있습니다. 기기의 음량을 키우신 후 위의 <strong className="text-blue-600 font-bold">[🔊 소리로 안내 듣기]</strong> 버튼을 한 번 직접 손가락으로 꾹 눌러주시면 즉시 음성이 흘러나옵니다.
                    </p>
                  </div>

                </div>

                {/* 2. HIGHEST KEY ACTION BOX */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-md p-6 border-2 border-blue-400 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 transform translate-x-3 -translate-y-3 opacity-10 pointer-events-none">
                    <span className="text-9xl font-black">👆</span>
                  </div>
                  
                  <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm inline-block mb-3 animate-pulse">
                    지금 가장 먼저 하실 일 👆
                  </span>

                  <h3 className={`${sizeClasses.key} leading-snug font-black`}>
                    {analysisResult.keyAction}
                  </h3>

                  <div className="mt-4 flex items-center gap-2 bg-blue-800/30 border border-blue-400/30 rounded-lg px-3 py-2 text-sm font-semibold text-blue-50">
                    <span className="text-base">👵</span>
                    <span>화면에서 해당 글자나 버튼을 손으로 가볍게 꾹 눌러주세요!</span>
                  </div>
                </div>

                {/* 3. STEP BY STEP DETAILED GUIDE */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md p-5 md:p-6 flex flex-col gap-4">
                  <h3 className="text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                      <CheckCircle size={20} />
                    </span>
                    순서대로 차근차근 따라하세요
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {analysisResult.steps.map((step, idx) => (
                      <div 
                        key={idx} 
                        className="flex gap-4 p-4 rounded-xl bg-slate-50 hover:bg-blue-50/20 border border-slate-100 transition-all group"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                          {idx + 1}
                        </div>
                        <div className="space-y-1">
                          <h4 className={`${sizeClasses.title} font-black text-slate-800`}>
                            {step.title}
                          </h4>
                          <p className={`${sizeClasses.base} text-slate-600`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. INTERACTIVE BUTTON DICTIONARY */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md p-5 md:p-6 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <h3 className="text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2">
                      <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                        <Info size={20} />
                      </span>
                      화면에 보이는 글자/버튼 사전
                    </h3>
                    <span className="text-xs bg-blue-50 text-blue-700 font-extrabold px-2.5 py-1 rounded-full animate-pulse">
                      버튼을 누르면 화면에 위치가 표시돼요!
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 font-medium -mt-2">
                    아래 버튼 목록 중 궁금한 것을 마우스나 손가락으로 누르시면, 왼쪽 기계 화면 위에 빨간 상자로 어디 있는지 번쩍이며 가리켜 줍니다.
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    {analysisResult.elements.map((el, idx) => {
                      const isSelected = selectedElement?.name === el.name;
                      return (
                        <button
                          key={idx}
                          id={`btn-element-${idx}`}
                          onClick={() => setSelectedElement(isSelected ? null : el)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                            isSelected 
                              ? "bg-blue-50/50 border-blue-400 shadow-sm ring-2 ring-blue-400"
                              : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                            }`}>
                              {idx + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`${sizeClasses.title} text-slate-800 break-keep`}>{el.name}</span>
                                <span className="bg-blue-50 text-blue-800 text-xs font-extrabold px-2 py-0.5 rounded-md border border-blue-100 break-keep">
                                  위치: {el.location}
                                </span>
                              </div>
                              <p className={`${sizeClasses.desc} text-slate-500 font-medium mt-1 break-keep`}>
                                누르면 어떻게 되나요: {el.action}
                              </p>
                            </div>
                          </div>

                          <div className="self-end md:self-auto flex-shrink-0">
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 whitespace-nowrap ${
                              isSelected 
                                ? "bg-blue-600 text-white" 
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}>
                              {isSelected ? (
                                <>
                                  <Check size={12} strokeWidth={3} className="flex-shrink-0" />
                                  <span className="whitespace-nowrap">화면에 표시 중</span>
                                </>
                              ) : (
                                <span className="whitespace-nowrap">위치 짚어보기 👆</span>
                              )}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. LOVING GRANDCHILD TIPS */}
                <div className="bg-yellow-50 rounded-2xl border-l-8 border-yellow-400 shadow-sm p-6 relative overflow-hidden">
                  <div className="absolute -bottom-8 -right-8 text-8xl opacity-10 font-bold pointer-events-none select-none">
                    👵
                  </div>
                  
                  <h3 className="text-lg font-black text-yellow-900 flex items-center gap-2 mb-3">
                    <span className="p-1 bg-yellow-200 text-yellow-800 rounded-lg">
                      <Lightbulb size={18} />
                    </span>
                    AI가 추천하는 꿀팁
                  </h3>

                  <ul className="space-y-3">
                    {analysisResult.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start">
                        <span className="text-yellow-600 text-lg mt-0.5">🌟</span>
                        <p className={`${sizeClasses.base} text-yellow-900 font-semibold leading-relaxed`}>
                          {tip}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Reset Buttons */}
                <div className="flex justify-center mt-4">
                  <button
                    id="btn-restart"
                    onClick={() => {
                      setAnalysisResult(null);
                      setSelectedElement(null);
                      stopSpeech();
                    }}
                    className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm hover:shadow transition-all"
                  >
                    <RefreshCw size={16} />
                    새로운 사진으로 다시 시작하기
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Analysis Error Alert */}
          {analysisError && (
            <div className={`p-6 rounded-2xl shadow-md mt-4 border-2 leading-relaxed ${
              analysisError.includes("초과") || analysisError.includes("quota") || analysisError.includes("RESOURCE_EXHAUSTED") || analysisError.includes("429")
                ? "bg-amber-50 border-amber-300 text-slate-800"
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {analysisError.includes("초과") || analysisError.includes("quota") || analysisError.includes("RESOURCE_EXHAUSTED") || analysisError.includes("429") ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">☕</span>
                    <h4 className="font-black text-lg text-amber-800">인공지능(AI)이 잠시 쉬어가고 있어요</h4>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    오늘 준비된 무료 인공지능 분석 횟수(하루 20회)가 다 차서 AI가 잠시 쉬고 있습니다.
                  </p>
                  <p className="text-xs text-amber-900 bg-white/70 p-3.5 rounded-xl border border-amber-200/60 leading-relaxed font-semibold">
                    💡 <strong>도움말:</strong><br />
                    이 체험 공간은 여러 어르신이 함께 사용하는 곳이라 하루 분석 제한이 금방 마감될 수 있습니다. <strong>잠시 후(몇 분 뒤) 다시 시도</strong>해 주시면 즉시 분석이 원활히 이어질 수 있어요. 양해를 부탁드립니다!
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button 
                      onClick={analyzeKioskScreen}
                      className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1"
                    >
                      <span>다시 시도해보기</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h4 className="font-extrabold text-base mb-1">분석 중 문제가 생겼습니다</h4>
                  <p className="text-sm leading-relaxed">{analysisError}</p>
                  <button 
                    onClick={analyzeKioskScreen}
                    className="mt-3 text-xs bg-red-100 hover:bg-red-200 text-red-800 font-extrabold px-3 py-1.5 rounded-lg transition-all"
                  >
                    다시 시도하기
                  </button>
                </>
              )}
            </div>
          )}

        </section>

      </main>



      {/* Interactive Quick Guide Modal (Polished Theme Component) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full border-4 border-blue-500 shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-4 text-blue-600">
              <span className="text-5xl">📖</span>
              <div>
                <h3 className="text-2xl font-black text-slate-800">사용 방법 가이드</h3>
                <p className="text-sm text-slate-500">How to use Silver Smart Guide</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3.5 items-start">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-base flex-shrink-0">1</span>
                <div>
                  <p className="font-bold text-slate-800 text-base">화면 촬영 또는 사진 올리기</p>
                  <p className="text-sm text-slate-500">카메라 버튼을 눌러 스마트폰으로 기계 화면을 찍으시거나, 기계 사진 파일을 올리세요.</p>
                </div>
              </div>
              <div className="flex gap-3.5 items-start">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-base flex-shrink-0">2</span>
                <div>
                  <p className="font-bold text-slate-800 text-base">AI에게 물어보기 단추 누르기</p>
                  <p className="text-sm text-slate-500">파란색의 [AI에게 이 화면 물어보기] 버튼를 누르면 인공지능이 화면을 친절히 해석해 드립니다.</p>
                </div>
              </div>
              <div className="flex gap-3.5 items-start">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-base flex-shrink-0">3</span>
                <div>
                  <p className="font-bold text-slate-800 text-base">소리 안내 및 버튼 짚어보기 활용</p>
                  <p className="text-sm text-slate-500">설명 순서를 따라 하시고, 궁금한 버튼 이름을 누르면 화면 위의 위치를 빨간 상자로 가리켜 드립니다.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowGuideModal(false)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl shadow-lg transition-all active:scale-[0.98]"
            >
              사용하러 가기 (닫기)
            </button>
          </motion.div>
        </div>
      )}

      {/* Floating AI Help Chat Assistant */}
      <HelpChat textSize={textSize} />

    </div>
  );
}

