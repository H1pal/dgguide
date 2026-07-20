import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ShoppingCart, Search, Bell, Check, MapPin, Award, Star } from 'lucide-react';

interface DeliverySimulatorProps {
  onStepChange: (guideText: string, ttsText: string, stepNum: number, totalSteps: number) => void;
  onComplete: () => void;
}

const DeliverySimulator: React.FC<DeliverySimulatorProps> = ({ onStepChange, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedPay, setSelectedPay] = useState<string | null>(null);

  // Sync guide prompts as delivery steps progress
  useEffect(() => {
    if (step === 1) {
      onStepChange(
        "배달의민족 첫 홈 화면입니다. 다양한 메뉴 카테고리 중 짜장면 그릇 모양이 있는 '중식' 카드를 가볍게 터치하세요.",
        "배달의민족 배달 홈 화면입니다. 화면 상단 중간에서 붉은색 짜장면 그릇 모양으로 반짝이는 중식 메뉴 카드를 찾아 손가락으로 가볍게 꾹 눌러주세요.",
        1,
        7
      );
    } else if (step === 2) {
      onStepChange(
        "동네에 배달되는 중국집들의 목록입니다. 평점이 사점 구점으로 가장 우수한 대성각(첫 번째 줄)을 터치하세요.",
        "배달이 가능한 중식당들의 전체 목록입니다. 평점이 좋고 인기가 많아 맨 위에 소개되고 있는 중국집 대성각 가게를 손으로 가볍게 터치해 보세요.",
        2,
        7
      );
    } else if (step === 3) {
      onStepChange(
        "대성각의 메뉴판입니다. 가장 대표적인 최고 인기 음식인 '짜장면 (7,000원)' 항목을 누르세요.",
        "식당의 세부 차림표 메뉴판입니다. 맨 위에 있는 대성각 비법 춘장의 고소하고 달콤한 칠천 원짜리 짜장면 메뉴를 손가락으로 꾹 눌러주세요.",
        3,
        7
      );
    } else if (step === 4) {
      onStepChange(
        "곱빼기 선택 등 상세 옵션을 확인하는 단계입니다. 그대로 하단의 민트색 '7,000원 장바구니 담기' 버튼을 누르세요.",
        "짜장면 수량과 세부 옵션을 고르는 창입니다. 특별히 변경할 부분이 없다면 맨 아래에 크게 반짝이는 민트색 칠천 원 장바구니 담기 단추를 곧바로 눌러 장바구니에 짜장면을 담으세요.",
        4,
        7
      );
    } else if (step === 5) {
      onStepChange(
        "장바구니 영수증 내역입니다. 음식값과 배달 팁이 맞는지 보시고 하단의 민트색 '9,000원 배달 주문하기'를 누르세요.",
        "내가 담은 음식을 최종 확인하는 영수증 장바구니 창입니다. 짜장면 값 칠천 원과 배달 수수료 이천 원이 더해진 총 구천 원 배달 주문하기 단추를 손으로 눌러주세요.",
        5,
        7
      );
    } else if (step === 6) {
      onStepChange(
        "결제 수단을 고르는 곳입니다. 맨 위에 있는 '배민페이' 노란색 카드를 누르고 아래의 '결제하기' 버튼을 누르세요.",
        "음식 값을 최종 지불하는 결제 선택 화면입니다. 이미 등록되어 있는 배민페이의 노란색 카드를 먼저 살포시 한 번 터치하고, 맨 아래의 결제하기 버튼을 손가락으로 꾹 눌러주세요.",
        6,
        7
      );
    } else if (step === 7) {
      onStepChange(
        "배달 주문이 성공적으로 완료되었습니다! 예상 배달 시간이 나오고 있네요. 하단의 '주문 완료 확인' 단추를 누르세요.",
        "정말 대단하십니다! 최종 주문이 성공적으로 처리되어 가게 주방에서 짜장면 요리를 요리조리 시작했습니다. 화면 맨 아래의 민트색 주문 완료 확인 단추를 눌러 미션을 영광 속에 완수해 보세요.",
        7,
        7
      );
    }
  }, [step]);

  // Mock category cards data
  const categories = [
    { name: "치킨", emoji: "🍗" },
    { name: "피자", emoji: "🍕" },
    { name: "중식", emoji: "🍜" }, // TARGET
    { name: "돈까스/일식", emoji: "🍣" },
    { name: "족발/보쌈", emoji: "🥩" },
    { name: "버거", emoji: "🍔" },
    { name: "분식", emoji: "🌶️" },
    { name: "카페/디저트", emoji: "☕" }
  ];

  return (
    <div className="h-full w-full flex flex-col bg-white font-sans relative overflow-hidden select-none">
      
      {/* BAEMIN TOP MINT NAVIGATION RAIL (EXCLUDED FROM MAIN SIM AREA BUT STYLED NATIVE) */}
      <div className="bg-[#2AC1BC] text-white h-14 flex items-center justify-between px-4 flex-shrink-0 z-30 shadow-sm select-none">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <MapPin size={16} className="fill-white" />
          <span className="font-black text-sm text-white tracking-tight">이화여대 학생문화관 ▼</span>
        </div>
        <div className="flex gap-4 text-white">
          <Bell size={20} className="stroke-[2.5]" />
          <div className="relative">
            <ShoppingCart size={20} className="stroke-[2.5]" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#2AC1BC]">
              {step >= 5 ? '1' : '0'}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* STEP 1: CATEGORY GRID */}
        {step === 1 && (
          <motion.div 
            key="category-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow p-4 flex flex-col overflow-y-auto"
          >
            {/* Mock search bar in Baemin */}
            <div className="bg-slate-100 p-3.5 rounded-2xl mb-5 flex items-center gap-2 text-slate-400 font-bold text-xs">
              <Search size={16} />
              <span>무엇을 드시고 싶으신가요?</span>
            </div>

            <h3 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mb-4">음식 카테고리 선택</h3>

            {/* Grid of categories */}
            <div className="grid grid-cols-4 gap-y-6 gap-x-2 text-center flex-1 py-1">
              {categories.map((cat, idx) => {
                const isTarget = cat.name === '중식';
                return (
                  <div 
                    key={idx}
                    onClick={() => {
                      if (isTarget) setStep(2);
                    }}
                    className="flex flex-col items-center gap-1.5 cursor-pointer select-none group"
                  >
                    {/* Pulsing Guide Ring on Jajangmyeon */}
                    {isTarget && (
                      <div className="absolute w-14 h-14 border-4 border-dashed border-[#2AC1BC] rounded-full animate-pulse"></div>
                    )}
                    
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm transition-transform group-active:scale-90 ${
                      isTarget 
                        ? 'bg-red-50 border-2 border-[#2AC1BC] relative z-10' 
                        : 'bg-slate-50 border border-slate-100 opacity-60'
                    }`}>
                      {cat.emoji}
                    </div>
                    <span className={`text-[11px] font-black tracking-tight ${
                      isTarget ? 'text-[#2AC1BC]' : 'text-slate-600'
                    }`}>
                      {cat.name}
                    </span>
                  </div>
                );
              })}
            </div>

          </motion.div>
        )}

        {/* STEP 2: CHINESE RESTAURANT LIST */}
        {step === 2 && (
          <motion.div 
            key="restaurant-list"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex flex-col overflow-hidden bg-slate-50"
          >
            {/* Back Header */}
            <div className="bg-white px-3 py-2 flex items-center gap-1.5 border-b border-slate-100 flex-shrink-0">
              <button onClick={() => setStep(1)} className="p-1 hover:bg-slate-100 rounded-full text-slate-600"><ChevronLeft size={22} /></button>
              <span className="font-extrabold text-slate-800 text-sm">중식(짜장면, 짬뽕) 가게들</span>
            </div>

            {/* Shop entries */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              
              {/* TARGET SHOP: 대성각 */}
              <div 
                onClick={() => setStep(3)}
                className="bg-white p-4 rounded-3xl border-2 border-dashed border-[#2AC1BC] shadow hover:shadow-md cursor-pointer transition-all active:scale-98 flex gap-4 relative"
              >
                {/* Golden pulsing ring indicator */}
                <div className="absolute inset-0 border-2 border-dashed border-[#2AC1BC] rounded-3xl animate-pulse pointer-events-none"></div>
                <div className="absolute right-4 top-4 w-3.5 h-3.5 bg-[#2AC1BC] rounded-full animate-ping"></div>

                <div className="w-18 h-18 bg-red-100 text-3xl rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0 select-none">
                  🍜
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">인기최고</span>
                    <h4 className="font-black text-slate-800 text-base truncate">대성각 중식당</h4>
                  </div>
                  <div className="flex items-center text-xs text-amber-500 font-extrabold gap-0.5 mt-1 select-none">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    <span>4.9 (999+)</span>
                    <span className="text-slate-300 mx-1">|</span>
                    <span className="text-slate-500">배달 25~35분</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-bold">
                    최소주문 12,000원 | 배달팁 2,000원
                  </p>
                </div>
              </div>

              {/* Other mock shop: 만리장성 */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/65 flex gap-4 opacity-50 pointer-events-none">
                <div className="w-18 h-18 bg-amber-50 text-3xl rounded-2xl flex items-center justify-center flex-shrink-0">
                  🥟
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-700 text-base truncate">만리장성 수제만두</h4>
                  <p className="text-xs text-amber-500 mt-1 font-bold">⭐ 4.7 (500+)</p>
                </div>
              </div>

              {/* Other mock shop: 백두산반점 */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/65 flex gap-4 opacity-50 pointer-events-none">
                <div className="w-18 h-18 bg-orange-50 text-3xl rounded-2xl flex items-center justify-center flex-shrink-0">
                  🍥
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-700 text-base truncate">백두산 짬뽕전문</h4>
                  <p className="text-xs text-amber-500 mt-1 font-bold">⭐ 4.5 (120+)</p>
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* STEP 3: RESTAURANT DETAIL & MENU SELECTION */}
        {step === 3 && (
          <motion.div 
            key="restaurant-menu"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex flex-col overflow-hidden select-none"
          >
            {/* Header */}
            <div className="px-3 py-2 flex items-center gap-1.5 border-b border-slate-100 flex-shrink-0">
              <button onClick={() => setStep(2)} className="p-1 hover:bg-slate-100 rounded-full text-slate-600"><ChevronLeft size={22} /></button>
              <span className="font-extrabold text-slate-800 text-sm">대성각 중식당</span>
            </div>

            {/* Banner info card */}
            <div className="bg-slate-900 text-white p-5 flex-shrink-0 flex flex-col justify-end h-28 relative overflow-hidden select-none">
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent z-10"></div>
              {/* background design */}
              <span className="text-8xl absolute -right-2 -bottom-2 opacity-15 rotate-12">🍜</span>

              <div className="relative z-20">
                <h3 className="text-lg font-black text-white">대성각</h3>
                <p className="text-xs text-slate-300 font-bold flex items-center gap-1 mt-0.5">
                  ⭐ 4.9 리얼 단골 999+ 만족도 1위 중국집
                </p>
              </div>
            </div>

            <div className="border-b border-slate-100 flex text-center text-xs font-black text-slate-400">
              <span className="flex-1 py-3 border-b-2 border-[#2AC1BC] text-[#2AC1BC]">추천 메뉴</span>
              <span className="flex-1 py-3 opacity-60">리뷰 (821)</span>
              <span className="flex-1 py-3 opacity-60">정보/위치</span>
            </div>

            {/* Menu options scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              
              {/* TARGET MENU: 짜장면 */}
              <div 
                onClick={() => setStep(4)}
                className="bg-white p-3.5 rounded-2xl border-2 border-dashed border-[#2AC1BC] shadow-sm hover:shadow cursor-pointer transition-all flex justify-between gap-3 relative"
              >
                {/* Pulsing Guide halos */}
                <div className="absolute inset-0 border-2 border-dashed border-[#2AC1BC] rounded-2xl animate-pulse pointer-events-none"></div>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2AC1BC] rounded-full animate-ping"></div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded">최고인기</span>
                    <h4 className="font-extrabold text-slate-800 text-base">짜장면</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal font-medium max-w-[170px]">
                    고소한 수제 춘장에 볶아내 소화가 잘되는 옛날 짜장면
                  </p>
                  <p className="text-sm font-black text-[#2AC1BC] mt-1">7,000원</p>
                </div>

                <div className="w-18 h-18 bg-rose-50 text-3xl rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                  🥣
                </div>
              </div>

              {/* Other menu item: Jjambbong */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/65 flex justify-between gap-3 opacity-50 pointer-events-none">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-700">해물 짬뽕</h4>
                  <p className="text-xs text-slate-400">얼큰하고 시원한 모듬 해물 가득 불맛 짬뽕</p>
                  <p className="text-sm font-bold text-slate-800">8,000원</p>
                </div>
                <div className="w-18 h-18 bg-orange-50 text-3xl rounded-xl flex items-center justify-center flex-shrink-0">
                  🍜
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* STEP 4: MENU DETAIL OPTION PAGE & ADD TO CART */}
        {step === 4 && (
          <motion.div 
            key="menu-options"
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex flex-col justify-between overflow-hidden select-none"
          >
            {/* Header */}
            <div className="px-3 py-2 flex items-center gap-1.5 border-b border-slate-100 flex-shrink-0 bg-slate-50">
              <button onClick={() => setStep(3)} className="p-1 hover:bg-slate-200 rounded-full text-slate-600"><ChevronLeft size={22} /></button>
              <span className="font-extrabold text-slate-800 text-sm">음식 상세 옵션</span>
            </div>

            {/* options scroll */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              <div className="text-center pb-4 border-b border-slate-100">
                <span className="text-5xl block mb-2">🥣</span>
                <h3 className="text-xl font-black text-slate-800">짜장면</h3>
                <p className="text-sm font-bold text-slate-400 mt-0.5">대성각 비법 수제 짜장</p>
                <p className="text-lg font-black text-slate-900 mt-2">7,000원</p>
              </div>

              {/* Options selection radio mimic */}
              <div className="space-y-3 font-bold text-sm text-slate-700">
                <span className="text-xs text-slate-400 font-extrabold block">곱빼기 추가 선택</span>
                
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" defaultChecked name="size" className="text-[#2AC1BC] focus:ring-[#2AC1BC] w-4 h-4" />
                    <span>일반 양 그대로 (기본)</span>
                  </label>
                  <span className="text-slate-400 text-xs">+0원</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-2xl opacity-65">
                  <label className="flex items-center gap-2">
                    <input type="radio" disabled name="size" className="text-[#2AC1BC] focus:ring-[#2AC1BC] w-4 h-4" />
                    <span>곱빼기 추가 (대량)</span>
                  </label>
                  <span className="text-[#2AC1BC] text-xs">+1,000원</span>
                </div>
              </div>

            </div>

            {/* TARGET BOTTOM MINT TRIGGER: ADD TO BASKET */}
            <div className="p-4 border-t border-slate-150 flex-shrink-0 relative">
              
              {/* Pulsing Guide Ring */}
              <div className="absolute inset-x-4 bottom-4 h-14 border-4 border-dashed border-yellow-500 rounded-2xl z-10 animate-pulse"></div>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-ping z-25"></div>

              <button
                onClick={() => setStep(5)}
                className="w-full py-4 bg-[#2AC1BC] hover:bg-[#20a7a3] text-white font-black text-base rounded-2xl shadow-md active:scale-95 transition-all z-20 relative"
              >
                7,000원 장바구니 담기
              </button>
            </div>

          </motion.div>
        )}

        {/* STEP 5: SHOPPING CART PAGE */}
        {step === 5 && (
          <motion.div 
            key="shopping-cart"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex flex-col justify-between overflow-hidden bg-slate-50 select-none"
          >
            {/* Header */}
            <div className="px-3 py-2 flex items-center gap-1.5 border-b border-slate-100 flex-shrink-0 bg-white">
              <button onClick={() => setStep(4)} className="p-1 hover:bg-slate-100 rounded-full text-slate-600"><ChevronLeft size={22} /></button>
              <span className="font-extrabold text-slate-800 text-sm">장바구니 영수증</span>
            </div>

            {/* Receipt list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-150 flex flex-col gap-4">
                
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
                  <span className="text-xl">🏠</span>
                  <h4 className="font-black text-slate-800 text-base">대성각 중식당 주문</h4>
                </div>

                {/* Items list summary */}
                <div className="flex justify-between items-start py-1">
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-slate-800 text-base">짜장면 1개</p>
                    <p className="text-xs text-slate-400 font-bold">● 곱빼기 선택: 일반 양 그대로</p>
                  </div>
                  <span className="font-black text-slate-800">7,000원</span>
                </div>

              </div>

              {/* Price Details Card */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-150 space-y-3 font-bold text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>총 음식 주문금액</span>
                  <span className="text-slate-800 font-extrabold">7,000원</span>
                </div>
                <div className="flex justify-between">
                  <span>우리 동네 배달수수료(배달팁)</span>
                  <span className="text-[#2AC1BC] font-extrabold">+ 2,000원</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-100 text-slate-900 font-black text-base">
                  <span>결제할 금액 합계</span>
                  <span className="text-red-500 font-black text-xl">9,000원</span>
                </div>
              </div>

            </div>

            {/* TARGET BOTTOM MINT TRIGGER: PAY SUBMIT */}
            <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0 relative">
              
              {/* Pulsing Guide halo */}
              <div className="absolute inset-x-4 bottom-4 h-14 border-4 border-dashed border-yellow-500 rounded-2xl z-10 animate-pulse"></div>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-ping z-25"></div>

              <button
                onClick={() => setStep(6)}
                className="w-full py-4 bg-[#2AC1BC] hover:bg-[#20a7a3] text-white font-black text-base rounded-2xl shadow-md active:scale-95 transition-all z-20 relative"
              >
                9,000원 배달 주문하기
              </button>
            </div>

          </motion.div>
        )}

        {/* STEP 6: PAYMENT METHOD SELECT SCREEN */}
        {step === 6 && (
          <motion.div 
            key="payment-page"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex flex-col justify-between overflow-hidden bg-slate-50 select-none"
          >
            {/* Header */}
            <div className="px-3 py-2 flex items-center gap-1.5 border-b border-slate-100 flex-shrink-0 bg-white">
              <button onClick={() => setStep(5)} className="p-1 hover:bg-slate-100 rounded-full text-slate-600"><ChevronLeft size={22} /></button>
              <span className="font-extrabold text-slate-800 text-sm">안전한 음식 값 결제</span>
            </div>

            {/* Payment methods scroll */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              
              <h4 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">주문 전용 간편 결제</h4>

              {/* TARGET PAYMENT TRIGGER: BAEMIN PAY (YELLOW) */}
              <div className="relative">
                {selectedPay !== 'baeminpay' && (
                  <div className="absolute inset-0 border-4 border-dashed border-blue-500 rounded-3xl z-10 animate-pulse pointer-events-none"></div>
                )}
                
                <div 
                  onClick={() => setSelectedPay('baeminpay')}
                  className={`p-4 bg-[#FFF000] text-slate-900 rounded-3xl shadow-sm cursor-pointer border-2 transition-all flex items-center justify-between ${
                    selectedPay === 'baeminpay' 
                      ? 'border-[#2AC1BC] ring-4 ring-[#2AC1BC]/25 shadow' 
                      : 'border-yellow-400 hover:bg-yellow-100 active:scale-98'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <p className="font-black text-slate-850 text-base flex items-center gap-1.5">
                        배민페이 <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">등록완료</span>
                      </p>
                      <p className="text-[10px] text-slate-600 font-bold">미리 등록한 통장 계좌에서 안전 이체</p>
                    </div>
                  </div>
                  
                  {/* Selected checkmark indicator inside banking */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                    selectedPay === 'baeminpay' ? 'bg-[#2AC1BC] border-white text-white' : 'border-slate-500 bg-white'
                  }`}>
                    {selectedPay === 'baeminpay' && <Check size={12} className="stroke-[3]" />}
                  </div>
                </div>
              </div>

              {/* Mock Payment method: Card */}
              <div className="p-4 bg-white text-slate-600 rounded-3xl border border-slate-200/65 flex items-center justify-between opacity-50 pointer-events-none">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-bold">일반 신용카드 결제 / 삼성페이</p>
                    <p className="text-[10px]">카드 정보를 수동 입력하여 지불하는 방식</p>
                  </div>
                </div>
              </div>

              {/* Mock Payment method: Phone bill */}
              <div className="p-4 bg-white text-slate-600 rounded-3xl border border-slate-200/65 flex items-center justify-between opacity-50 pointer-events-none">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-bold">휴대폰 소액 결제</p>
                  </div>
                </div>
              </div>

            </div>

            {/* FINAL SUBMIT BUTTON */}
            <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0 relative">
              
              {selectedPay === 'baeminpay' && (
                <>
                  <div className="absolute inset-x-4 bottom-4 h-14 border-4 border-dashed border-yellow-500 rounded-2xl z-10 animate-pulse"></div>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-ping z-25"></div>
                </>
              )}

              <button
                disabled={!selectedPay}
                onClick={() => setStep(7)}
                className={`w-full py-4 rounded-2xl font-black text-base shadow transition-all active:scale-95 z-20 relative ${
                  selectedPay 
                    ? 'bg-[#2AC1BC] hover:bg-[#20a7a3] text-white' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                9,000원 안전하게 결제하기
              </button>
            </div>

          </motion.div>
        )}

        {/* STEP 7: ORDER SUCCESS & TRACKING PAGE */}
        {step === 7 && (
          <motion.div 
            key="success-tracking"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-grow flex flex-col justify-between overflow-hidden p-4 bg-white select-none"
          >
            <div></div>

            {/* Big Success Details Card */}
            <div className="text-center flex flex-col items-center justify-center py-6 my-auto">
              
              {/* Success anim check */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-20 h-20 bg-[#2AC1BC] rounded-full flex items-center justify-center text-white text-4xl shadow-md border-4 border-teal-50 mb-6"
              >
                ✓
              </motion.div>

              <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-snug">주문 완료 성공!</h3>
              <p className="text-xs text-slate-400 font-bold mt-1">대성각 중식당에 잘 전달되었습니다.</p>

              {/* Delivery map mockup tracking progress indicator */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 w-full max-w-xs space-y-4 mt-6 text-sm">
                
                <div className="flex items-center justify-between text-xs font-black text-slate-400 select-none pb-2 border-b border-slate-200/50">
                  <span>🛵 배달 예상 시간</span>
                  <span className="text-red-500 font-black text-sm">약 35분 남음</span>
                </div>

                {/* Simulated delivery track dots */}
                <div className="flex items-center justify-between font-extrabold text-slate-700">
                  <div className="flex flex-col items-center gap-1">
                    <span className="w-5 h-5 bg-[#2AC1BC] rounded-full flex items-center justify-center text-white text-[10px] shadow-sm">✓</span>
                    <span className="text-[10px] text-[#2AC1BC]">주문 접수</span>
                  </div>
                  <div className="h-0.5 bg-[#2AC1BC] flex-1 mx-1 -translate-y-2"></div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-black text-[10px] font-black animate-pulse">●</span>
                    <span className="text-[10px] text-yellow-600">조리 시작</span>
                  </div>
                  <div className="h-0.5 bg-slate-200 flex-1 mx-1 -translate-y-2"></div>
                  <div className="flex flex-col items-center gap-1 opacity-45">
                    <span className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 text-[10px] font-black">●</span>
                    <span className="text-[10px]">배달 시작</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-inner text-xs font-bold text-slate-500 text-left leading-relaxed">
                  📢 <strong className="text-slate-800">안내:</strong> 라이더 매칭이 시작되었습니다. 음식이 조리되는 대로 이화여대 학생문화관 입구로 신속히 배달됩니다!
                </div>

              </div>

            </div>

            {/* CONFIRM DONE BOTTOM TRIGGER */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 w-full h-full border-4 border-dashed border-teal-500 rounded-2xl z-10 animate-pulse pointer-events-none"></div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-teal-500 rounded-full animate-ping z-20"></div>

              <button
                onClick={onComplete}
                className="w-full py-4 bg-[#2AC1BC] hover:bg-[#20a7a3] text-white font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all z-30 relative"
              >
                배달 실습 미션 완료
              </button>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default DeliverySimulator;
