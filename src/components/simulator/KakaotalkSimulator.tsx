import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Check, 
  Search, 
  Menu, 
  Send, 
  ChevronLeft, 
  Image as ImageIcon, 
  Camera, 
  Gift, 
  MapPin, 
  PhoneCall, 
  Calendar, 
  Mic, 
  UserSquare2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface KakaotalkSimulatorProps {
  onStepChange: (guideText: string, ttsText: string, stepNum: number, totalSteps: number) => void;
  onComplete: () => void;
}

const KakaotalkSimulator: React.FC<KakaotalkSimulatorProps> = ({ onStepChange, onComplete }) => {
  const [step, setStep] = useState(1);
  const [photoSelected, setPhotoSelected] = useState(false);
  const [daughterReplying, setDaughterReplying] = useState(false);
  const [daughterReplied, setDaughterReplied] = useState(false);

  // Trigger onStepChange on step transitions
  useEffect(() => {
    if (step === 1) {
      onStepChange(
        "카카오톡 첫 화면(채팅 목록)입니다. '딸내미'가 보낸 빨간색 1번 숫자 배지가 표시된 채팅방을 손으로 가볍게 눌러 들어가 보세요.",
        "카카오톡 첫 화면입니다. 딸내미가 보낸 빨간색 숫자 일번 배지가 달려있는 첫 번째 대화방을 손가락으로 가볍게 꾹 눌러서 대화 창으로 들어가 보세요.",
        1,
        5
      );
    } else if (step === 2) {
      onStepChange(
        "대화 창에 들어왔습니다. 화면 왼쪽 아래에 노란색으로 반짝이는 '더하기 (+)' 버튼을 누르세요. 사진을 보내는 메뉴를 열 수 있습니다.",
        "딸내미와의 채팅 창에 들어왔습니다. 대화 창 왼쪽 맨 아래에 있는 반짝이는 노란색 더하기 버튼을 손가락으로 가볍게 눌러주세요. 숨겨진 사진 올리기 메뉴들을 열기 위한 버튼입니다.",
        2,
        5
      );
    } else if (step === 3) {
      onStepChange(
        "더보기 메뉴가 열렸습니다. 왼쪽 첫 번째에 있는 초록색 '앨범' 버튼을 누르세요. 스마트폰 안의 사진첩으로 들어갑니다.",
        "메뉴가 열렸습니다. 사진을 골라 전송하기 위해 왼쪽 첫 번째 자리에 있는 초록색 앨범 버튼을 손가락으로 가볍게 눌러주세요.",
        3,
        5
      );
    } else if (step === 4) {
      onStepChange(
        "첫 번째에 있는 예쁜 봄꽃 사진(진달래)을 먼저 누르고, 오른쪽 위에 생겨난 노란색 '전송' 버튼을 누르세요.",
        "사진첩이 열렸습니다. 첫 번째에 있는 어르신들이 가장 좋아하시는 예쁜 분홍빛 꽃 사진을 살포시 눌러주세요. 그 다음 오른쪽 맨 위에 활성화된 노란색 전송 버튼을 누르면 꽃 사진이 딸내미에게 전송됩니다.",
        4,
        5
      );
    } else if (step === 5) {
      onStepChange(
        "사진이 성공적으로 전송되었습니다! 잠시 기다리면 딸내미가 확인하고 반가운 답장을 보냅니다.",
        "진달래 꽃 사진이 아주 잘 날아갔습니다! 잠시만 숨을 돌려 기다리시면 딸내미가 예쁜 꽃을 확인한 후 반갑게 보낸 답장이 대화 창에 도착합니다.",
        5,
        5
      );
    }
  }, [step]);

  // Handle Step 5 Daughter reply delay simulation
  useEffect(() => {
    if (step === 5) {
      const typingTimer = setTimeout(() => {
        setDaughterReplying(true);
      }, 1500);

      const replyTimer = setTimeout(() => {
        setDaughterReplying(false);
        setDaughterReplied(true);
      }, 4000);

      const completeTimer = setTimeout(() => {
        onComplete();
      }, 7000);

      return () => {
        clearTimeout(typingTimer);
        clearTimeout(replyTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [step]);

  // Mock high quality gallery images with nice css gradients representation for seniors
  const albumImages = [
    { id: 1, emoji: "🌸", desc: "봄꽃", grad: "from-pink-300 to-rose-400" },
    { id: 2, emoji: "🐶", desc: "우리집 강아지", grad: "from-amber-200 to-amber-300" },
    { id: 3, emoji: "🍲", desc: "김치찌개", grad: "from-orange-300 to-red-400" },
    { id: 4, emoji: "⛰️", desc: "속리산 풍경", grad: "from-emerald-300 to-teal-500" },
    { id: 5, emoji: "👶", desc: "손주 얼굴", grad: "from-yellow-100 to-orange-200" },
    { id: 6, emoji: "🎂", desc: "생일 케이크", grad: "from-purple-300 to-pink-300" }
  ];

  return (
    <div className="h-full w-full flex flex-col bg-[#BACEE0] font-sans relative overflow-hidden select-none">
      
      {/* 1. SCENARIO SCREEN: CHATS LIST */}
      {step === 1 && (
        <div className="absolute inset-0 bg-white flex flex-col z-10">
          
          {/* KakaoTalk List Top Navigation Header */}
          <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 flex-shrink-0">
            <span className="text-xl font-black text-slate-800">채팅</span>
            <div className="flex gap-4 text-slate-600">
              <Search size={20} className="stroke-[2.5]" />
              <div className="relative">
                <Plus size={20} className="stroke-[2.5]" />
              </div>
              <Menu size={20} className="stroke-[2.5]" />
            </div>
          </div>

          {/* Search bar helper */}
          <div className="px-4 py-2 flex-shrink-0">
            <div className="bg-slate-100 rounded-xl py-2 px-3 flex items-center gap-2 text-xs text-slate-400 font-bold">
              <Search size={14} />
              <span>채팅방 이름, 대화내용 검색</span>
            </div>
          </div>

          {/* Chat List Scroll Container */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            
            {/* TARGET CHATROOM: Daughter */}
            <div 
              onClick={() => setStep(2)}
              className="p-4 flex items-center gap-3 bg-blue-50/50 relative cursor-pointer group active:bg-blue-100/50 transition-colors"
            >
              {/* Outer Pulsing Guideline Ring */}
              <div className="absolute inset-0 border-2 border-dashed border-blue-500 pointer-events-none rounded-xl animate-pulse"></div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>

              {/* Daughter profile avatar */}
              <div className="w-14 h-14 bg-pink-100 rounded-[22px] flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                👩‍🦰
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-800 text-base">딸내미</span>
                  <span className="text-xs text-slate-400 font-semibold">오전 10:35</span>
                </div>
                <p className="text-sm font-bold text-slate-500 truncate mt-0.5">
                  엄마, 사진 좀 보내주세요! 🌸
                </p>
              </div>

              {/* Unread Indicator Badge (Pulsing 1) */}
              <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-sm animate-bounce flex-shrink-0">
                1
              </div>
            </div>

            {/* Other Mock Chat 1: Son */}
            <div className="p-4 flex items-center gap-3 opacity-60 pointer-events-none">
              <div className="w-14 h-14 bg-blue-100 rounded-[22px] flex items-center justify-center text-2xl flex-shrink-0">
                👨
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-base">아들</span>
                  <span className="text-xs text-slate-400">어제</span>
                </div>
                <p className="text-sm text-slate-400 truncate mt-0.5">이번 주 주말에 맛있는거 들고 찾아뵐게요!</p>
              </div>
            </div>

            {/* Other Mock Chat 2: Alumni gathering */}
            <div className="p-4 flex items-center gap-3 opacity-60 pointer-events-none">
              <div className="w-14 h-14 bg-emerald-100 rounded-[22px] flex items-center justify-center text-2xl flex-shrink-0">
                ⛰️
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-base">고향동창회 모임</span>
                  <span className="text-xs text-slate-400">7월 15일</span>
                </div>
                <p className="text-sm text-slate-400 truncate mt-0.5">다음 등산 모임 일정 및 장소 확정 공지 확인하세요...</p>
              </div>
            </div>

          </div>

          {/* Bottom navigation bar mimic of KakaoTalk */}
          <div className="h-16 border-t border-slate-100 flex items-center justify-around flex-shrink-0 bg-slate-50 text-slate-400 text-[10px] font-black">
            <div className="flex flex-col items-center gap-1 opacity-50">
              <span className="text-lg">👤</span>
              <span>친구</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-slate-800">
              <span className="text-xl">💬</span>
              <span>채팅</span>
            </div>
            <div className="flex flex-col items-center gap-1 opacity-50">
              <span className="text-lg">👀</span>
              <span>뷰</span>
            </div>
            <div className="flex flex-col items-center gap-1 opacity-50">
              <span className="text-lg">🛒</span>
              <span>쇼핑</span>
            </div>
            <div className="flex flex-col items-center gap-1 opacity-50">
              <span className="text-lg">⚙️</span>
              <span>더보기</span>
            </div>
          </div>

        </div>
      )}

      {/* 2. CHATROOM SCREEN BACKDROP */}
      {step >= 2 && (
        <div className="flex-1 flex flex-col h-full w-full">
          
          {/* Active Chatroom Header */}
          <div className="h-12 bg-[#BACEE0] border-b border-slate-300/30 flex items-center justify-between px-3 flex-shrink-0 select-none z-30">
            <div className="flex items-center gap-1 text-slate-800">
              <button 
                onClick={() => setStep(1)}
                className="p-1 hover:bg-black/5 rounded-full transition-colors"
              >
                <ChevronLeft size={24} className="stroke-[2.5]" />
              </button>
              <span className="font-black text-base">딸내미</span>
              <span className="bg-slate-400/20 text-slate-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">2</span>
            </div>
            <div className="flex gap-3.5 text-slate-700">
              <Search size={18} className="stroke-[2.5]" />
              <Menu size={18} className="stroke-[2.5]" />
            </div>
          </div>

          {/* Chat Messages Scrolling Board */}
          <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4">
            
            {/* Centered Date Badge */}
            <div className="flex justify-center select-none">
              <span className="bg-black/10 text-white text-[10px] font-black px-3.5 py-1.5 rounded-full tracking-wide">
                2026년 7월 18일 토요일
              </span>
            </div>

            {/* Daughter message bubble */}
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-pink-100 rounded-[15px] flex items-center justify-center text-xl flex-shrink-0 shadow-inner select-none">
                👩‍🦰
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-extrabold block">딸내미</span>
                <div className="bg-white text-slate-800 p-3 rounded-2xl rounded-tl-sm text-sm font-bold shadow-sm max-w-[210px] leading-relaxed">
                  엄마, 사진 좀 보내주세요! 🌸
                </div>
              </div>
            </div>

            {/* USER SENT PHOTO (Shows on Step 5) */}
            {step === 5 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="flex justify-end gap-1.5 items-end"
              >
                <span className="text-[10px] text-slate-500 font-extrabold pb-1">오전 10:37</span>
                <div className="border-[3px] border-white rounded-2xl overflow-hidden shadow-md bg-white max-w-[150px] aspect-square relative">
                  <div className="w-full h-full bg-gradient-to-tr from-pink-300 to-rose-400 flex items-center justify-center text-6xl">
                    🌸
                  </div>
                </div>
              </motion.div>
            )}

            {/* DAUGHTER TYPING DELAY (Step 5) */}
            {step === 5 && daughterReplying && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 items-start"
              >
                <div className="w-10 h-10 bg-pink-100 rounded-[15px] flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
                  👩‍🦰
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-extrabold block">딸내미</span>
                  {/* Typing bubble bouncing animation */}
                  <div className="bg-white py-2 px-3 rounded-2xl rounded-tl-sm flex items-center gap-1 shadow-sm w-16 justify-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DAUGHTER REPLIED CHAT (Step 5) */}
            {step === 5 && daughterReplied && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2"
              >
                <div className="w-10 h-10 bg-pink-100 rounded-[15px] flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
                  👩‍🦰
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-extrabold block">딸내미</span>
                  <div className="bg-white text-slate-800 p-3 rounded-2xl rounded-tl-sm text-sm font-bold shadow-sm max-w-[210px] leading-relaxed border-2 border-emerald-400">
                    어머나! 꽃이 너무 이쁘네요 엄마! 고마워요 ㅎㅎ 😍🌸
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* Interactive Input Bar at bottom of chat */}
          <div className="bg-white border-t border-slate-200 h-14 flex items-center px-2.5 gap-2 flex-shrink-0 relative">
            
            {/* PULSING HIGHLIGHTS ON PLUS BUTTON */}
            {step === 2 && (
              <>
                <div className="absolute left-2.5 w-10 h-10 border-4 border-yellow-400 rounded-full z-40 animate-ping"></div>
                <div className="absolute left-2.5 w-10 h-10 bg-yellow-400/20 border-2 border-yellow-400 rounded-full pointer-events-none z-40"></div>
              </>
            )}

            {/* KakaoTalk + Button */}
            <button 
              onClick={() => {
                if (step === 2) setStep(3);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-150 transition-colors flex-shrink-0 z-50 ${
                step === 2 ? 'bg-yellow-400 text-black shadow-md font-black' : 'text-slate-400 bg-slate-50'
              }`}
            >
              <Plus size={24} className="stroke-[3]" />
            </button>

            {/* Text message mimic input bar */}
            <div className="flex-1 bg-slate-100 rounded-2xl h-10 px-3 flex items-center text-slate-400 text-xs font-bold pointer-events-none">
              메시지 입력...
            </div>

            <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 pointer-events-none">
              <Send size={18} />
            </button>
          </div>

          {/* 3. STEP 3 BOTTOM SHEET POPUP */}
          <AnimatePresence>
            {step === 3 && (
              <>
                {/* Backdrop shade */}
                <div className="absolute inset-0 bg-black/25 z-40" onClick={() => setStep(2)}></div>
                
                {/* Plus Menu Bottom Tray */}
                <motion.div 
                  initial={{ y: 220 }} 
                  animate={{ y: 0 }} 
                  exit={{ y: 220 }}
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] border-t border-slate-200 p-6 z-50 shadow-[0_-10px_35px_rgba(0,0,0,0.15)] flex flex-col gap-5 select-none"
                >
                  <div className="flex justify-between items-center text-xs font-black text-slate-400 pb-1 border-b border-slate-50">
                    <span>원하시는 기능을 누르세요 (아래 앨범 버튼)</span>
                    <span onClick={() => setStep(2)} className="cursor-pointer hover:text-slate-700">닫기 X</span>
                  </div>

                  <div className="grid grid-cols-4 gap-y-5 gap-x-2 text-center">
                    
                    {/* TARGET BUTTON: ALBUM */}
                    <div 
                      onClick={() => setStep(4)}
                      className="flex flex-col items-center gap-1.5 cursor-pointer relative group"
                    >
                      {/* Pulsing Guide Halo on Album */}
                      <div className="absolute -top-1 w-16 h-16 border-4 border-dashed border-emerald-500 rounded-full animate-pulse"></div>
                      <div className="absolute -top-1 w-16 h-16 bg-emerald-500/10 border border-emerald-500 rounded-full"></div>
                      <div className="absolute right-3 top-0 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>

                      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-[20px] flex items-center justify-center shadow-sm relative z-10 group-active:scale-95 transition-transform">
                        <ImageIcon size={26} className="stroke-[2.5]" />
                      </div>
                      <span className="text-[11px] font-black text-slate-800 z-10">앨범</span>
                    </div>

                    {/* Camera */}
                    <div className="flex flex-col items-center gap-1.5 opacity-40 pointer-events-none">
                      <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-[20px] flex items-center justify-center">
                        <Camera size={26} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600">카메라</span>
                    </div>

                    {/* Gift */}
                    <div className="flex flex-col items-center gap-1.5 opacity-40 pointer-events-none">
                      <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-[20px] flex items-center justify-center">
                        <Gift size={26} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600">선물하기</span>
                    </div>

                    {/* Remit */}
                    <div className="flex flex-col items-center gap-1.5 opacity-40 pointer-events-none">
                      <div className="w-14 h-14 bg-lime-100 text-lime-600 rounded-[20px] flex items-center justify-center">
                        <span className="text-lg font-black">₩</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-600">송금</span>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col items-center gap-1.5 opacity-40 pointer-events-none">
                      <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-[20px] flex items-center justify-center">
                        <MapPin size={26} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600">지도</span>
                    </div>

                    {/* Voice Call */}
                    <div className="flex flex-col items-center gap-1.5 opacity-40 pointer-events-none">
                      <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-[20px] flex items-center justify-center">
                        <PhoneCall size={26} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600">통화하기</span>
                    </div>

                    {/* Calendar */}
                    <div className="flex flex-col items-center gap-1.5 opacity-40 pointer-events-none">
                      <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-[20px] flex items-center justify-center">
                        <Calendar size={26} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600">일정</span>
                    </div>

                    {/* Contact card */}
                    <div className="flex flex-col items-center gap-1.5 opacity-40 pointer-events-none">
                      <div className="w-14 h-14 bg-cyan-100 text-cyan-600 rounded-[20px] flex items-center justify-center">
                        <UserSquare2 size={26} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600">연락처</span>
                    </div>

                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* 4. STEP 4 PHOTO SELECTOR FULLSCREEN PAGE */}
          <AnimatePresence>
            {step === 4 && (
              <motion.div 
                initial={{ opacity: 0, y: 100 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white flex flex-col z-50 select-none"
              >
                
                {/* Album Header */}
                <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setStep(3)}
                      className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <span className="font-extrabold text-slate-800 text-sm">전체 사진 선택</span>
                  </div>

                  {/* SUBMIT BUTTON - MUST SELECT PIC FIRST TO ACTIVATE */}
                  <button
                    onClick={() => {
                      if (photoSelected) {
                        setStep(5);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all active:scale-95 ${
                      photoSelected 
                        ? 'bg-yellow-400 text-black border-2 border-yellow-500 scale-105' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    전송{photoSelected ? ' (1)' : ''}
                  </button>
                </div>

                {/* Subtitle helper */}
                <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 text-[10px] sm:text-xs font-bold text-blue-800 leading-snug">
                  👉 첫 번째 진달래 꽃 사진(🌸)을 먼저 꾹 누르고, 오른쪽 위의 노란색 [전송] 단추를 누르세요!
                </div>

                {/* Photo Grid */}
                <div className="flex-grow p-3 overflow-y-auto bg-slate-50">
                  <div className="grid grid-cols-3 gap-2">
                    {albumImages.map((img) => {
                      const isTarget = img.id === 1;
                      const isSelected = photoSelected && isTarget;
                      
                      return (
                        <div 
                          key={img.id}
                          onClick={() => {
                            if (isTarget) {
                              setPhotoSelected(!photoSelected);
                            }
                          }}
                          className={`aspect-square rounded-xl bg-gradient-to-tr ${img.grad} flex flex-col items-center justify-center text-4xl relative cursor-pointer border-2 transition-all shadow-sm ${
                            isSelected 
                              ? 'border-yellow-400 scale-[0.98] ring-4 ring-yellow-400/50' 
                              : isTarget 
                                ? 'border-dashed border-blue-400 scale-100 hover:scale-102 hover:shadow' 
                                : 'border-transparent opacity-60'
                          }`}
                        >
                          <span>{img.emoji}</span>
                          <span className="text-[10px] font-bold text-slate-800 mt-1.5 bg-white/75 px-1.5 py-0.5 rounded-full select-none">
                            {img.desc}
                          </span>

                          {/* Pulsing high contrast guide ring on flower */}
                          {isTarget && !photoSelected && (
                            <>
                              <div className="absolute inset-0 border-4 border-dashed border-blue-500 rounded-xl animate-pulse"></div>
                              <div className="absolute top-1 right-1 w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
                            </>
                          )}

                          {/* Selected Check Badge Indicator */}
                          {isSelected && (
                            <motion.div 
                              initial={{ scale: 0.5 }} 
                              animate={{ scale: 1 }}
                              className="absolute top-1.5 right-1.5 w-6 h-6 bg-yellow-400 border border-yellow-500 rounded-full flex items-center justify-center shadow-md text-black font-black text-xs"
                            >
                              ✓
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

    </div>
  );
};

export default KakaotalkSimulator;
