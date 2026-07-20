import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface BankingSimulatorProps {
  onStepChange: (guideText: string, ttsText: string, stepNum: number, totalSteps: number) => void;
  onComplete: () => void;
}

const BankingSimulator: React.FC<BankingSimulatorProps> = ({ onStepChange, onComplete }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [pwdDots, setPwdDots] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Synchronize guide messages as steps progress
  useEffect(() => {
    if (step === 1) {
      onStepChange(
        "카카오뱅크 통장 화면입니다. 노란색 통장 카드 안에 있는 파란색 '이체' 버튼을 가볍게 누르세요. 송금을 시작합니다.",
        "카카오뱅크 메인 통장 화면입니다. 노란색 입출금 통장 카드 오른편에 조그맣게 놓여있는 파란색 이체 버튼을 손가락으로 가볍게 꾹 눌러주세요.",
        1,
        6
      );
    } else if (step === 2) {
      onStepChange(
        "돈을 보낼 대상을 선택합니다. 최근 보낸 사람 목록에서 첫 번째 줄에 있는 '딸내미'를 누르세요.",
        "돈을 누구에게 보낼지 정하는 화면입니다. 최근 보낸 사람 목록에서 맨 첫 번째 자리에 있는 딸내미 통장 카드를 손가락으로 살며시 눌러주세요.",
        2,
        6
      );
    } else if (step === 3) {
      onStepChange(
        "아래 숫자 패드 위쪽의 '5만' 버튼을 한 번만 가볍게 눌러 '50,000원'을 적은 뒤, 하단의 노란색 '다음' 단추를 누르세요.",
        "딸내미에게 보낼 금액을 적는 화면입니다. 아래 숫자 패드 바로 위에 있는 오만 원 단추를 한 번만 가볍게 눌러주시면 오만 원이 자동으로 채워집니다. 그 다음 아래쪽에 생겨난 노란색 다음 버튼을 꾹 눌러주세요.",
        3,
        6
      );
    } else if (step === 4) {
      const displayAmt = amount ? `${parseInt(amount).toLocaleString()}원` : '50,000원';
      onStepChange(
        `딸내미 계좌로 ${displayAmt}을 보내는 최종 내역 확인입니다. 아래의 노란색 '확인' 버튼을 누르세요.`,
        `돈을 보내기 직전 확인하는 화면입니다. 받는 사람이 딸내미가 맞는지, 금액이 ${displayAmt}이 맞는지 눈으로 확인하신 다음 맨 아래의 노란색 확인 버튼을 힘차게 눌러주세요.`,
        4,
        6
      );
    } else if (step === 5) {
      if (isProcessing) {
        onStepChange(
          "비밀번호가 확인되었습니다. 안전하게 이체 처리를 진행하는 중입니다. 잠시만 기다려 주세요.",
          "비밀번호가 안전하게 확인되었습니다. 카카오뱅크 정밀 보안망을 통해 돈을 딸내미님께 즉시 송금 중입니다. 일 이초만 지켜봐 주세요.",
          5,
          6
        );
      } else {
        onStepChange(
          "안전한 금융 거래를 위해 보안 비밀번호 6자리를 입력할 차례입니다. 숫자 자판을 아무 숫자나 총 6번 눌러주세요.",
          "보안 비밀번호 여섯 자리를 입력하는 단계입니다. 금융 거래 사고를 막기 위한 최종 서명입니다. 아래의 숫자 자판을 손가락으로 아무 숫자나 차례대로 여섯 번 꾹꾹 눌러주시면 이체가 완료됩니다.",
          5,
          6
        );
      }
    } else if (step === 6) {
      onStepChange(
        "송금이 완벽하게 성공했습니다! 마지막으로 하단의 파란색 '확인' 버튼을 누르면 실습 미션이 성황리에 종료됩니다.",
        "이체가 완전히 끝났습니다! 정말 고생하셨습니다. 화면 아래쪽에 있는 파란색 확인 단추를 눌러서 미션을 축하 속에 마무리해 보세요.",
        6,
        6
      );
    }
  }, [step, isProcessing]);

  // Keypad controls for amount selection
  const handleKeypad = (val: string) => {
    if (val === 'back') {
      setAmount(prev => prev.slice(0, -1));
    } else if (val === '5만') {
      setAmount('50000');
    } else if (val === '1만') {
      const current = parseInt(amount || '0');
      setAmount(String(current + 10000));
    } else {
      if (amount.length < 8) {
        setAmount(prev => (prev === '0' ? val : prev + val));
      }
    }
  };

  // Password dots progress trigger
  const handlePwdTap = () => {
    if (pwdDots < 6) {
      const nextDots = pwdDots + 1;
      setPwdDots(nextDots);
      if (nextDots === 6) {
        // Password fully entered, proceed to processing, then success screen
        setTimeout(() => {
          setIsProcessing(true);
          setTimeout(() => {
            setIsProcessing(false);
            setStep(6);
          }, 2500); // 2.5 second delay for realistic bank processing
        }, 600);
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#F4F5F7] font-sans relative overflow-hidden select-none">
      
      <AnimatePresence mode="wait">
        
        {/* STEP 1: KAKAO BANK MAIN HOME PAGE */}
        {step === 1 && (
          <motion.div 
            key="banking-home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-4 bg-[#F4F5F7] select-none"
          >
            {/* Header branding */}
            <div className="flex items-center justify-between py-2 flex-shrink-0 mb-3">
              <span className="font-black text-slate-800 text-lg flex items-center gap-1.5">
                <span className="text-yellow-400 text-xl">●</span> 카카오뱅크
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">⚙️</div>
            </div>

            {/* Account Card (Yellow checking card) */}
            <div className="bg-[#FFE400] text-slate-900 rounded-[28px] p-5 shadow-md border border-yellow-400 relative flex flex-col justify-between h-[210px] mb-5">
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-slate-700 underline">입출금통장</span>
                  <span className="text-[10px] text-slate-500 font-bold">3333-12-3456789</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
                  2,021,100원
                </h3>
              </div>

              {/* Action grid (Card vs Transfer) */}
              <div className="grid grid-cols-2 gap-2 mt-5 select-none relative">
                <button className="bg-white/30 hover:bg-white/45 text-slate-800 font-bold py-3 px-4 rounded-xl text-sm transition-all pointer-events-none opacity-45">
                  카드 사용
                </button>

                {/* TARGET TRIGGER TRANSFER BUTTON */}
                <div className="relative">
                  {/* Pulsing Guide indicators */}
                  <div className="absolute inset-0 w-full h-full border-4 border-dashed border-blue-600 rounded-xl z-10 animate-ping"></div>
                  <div className="absolute inset-0 w-full h-full bg-blue-600/10 border-2 border-blue-600 rounded-xl z-10 pointer-events-none"></div>
                  <div className="absolute -top-1.5 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping z-20"></div>

                  <button 
                    onClick={() => setStep(2)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-4 rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-1 z-30 relative"
                  >
                    이체하기 ➔
                  </button>
                </div>
              </div>

            </div>

            {/* Lower Decor List */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex-1 flex flex-col justify-center text-center py-8">
              <span className="text-2xl mb-1 block">🛡️</span>
              <p className="text-xs font-bold text-slate-500">
                디지털 금융 범죄 예방을 위해 보이스피싱 경고가 항상 제공됩니다. 의심스러운 송금 요청은 112로 상담하세요.
              </p>
            </div>

          </motion.div>
        )}

        {/* STEP 2: RECIPIENT SELECT PAGE */}
        {step === 2 && (
          <motion.div 
            key="banking-recipients"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-4 bg-white select-none"
          >
            {/* Header */}
            <div className="flex items-center gap-2 py-2 mb-4 border-b border-slate-50">
              <button onClick={() => setStep(1)} className="p-1 hover:bg-slate-100 rounded-full text-slate-600"><ChevronLeft size={22} /></button>
              <span className="font-black text-slate-800 text-base">누구에게 돈을 보낼까요?</span>
            </div>

            <div className="bg-slate-100 rounded-xl py-2.5 px-3 flex items-center gap-2 text-xs text-slate-400 font-bold mb-5">
              <span>🔍 이름, 초성, 또는 계좌번호 직접 쓰기</span>
            </div>

            <h4 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mb-3">최근 보낸 사람</h4>
            
            <div className="space-y-2 flex-1 overflow-y-auto">
              
              {/* TARGET: DAUGHTER */}
              <div 
                onClick={() => setStep(3)}
                className="p-3.5 rounded-2xl border-2 border-dashed border-blue-500 bg-blue-50/20 flex items-center justify-between cursor-pointer relative hover:bg-blue-50 active:scale-95 transition-all"
              >
                {/* Golden pulsing effect */}
                <div className="absolute inset-0 border-2 border-dashed border-blue-600 rounded-2xl animate-pulse pointer-events-none"></div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-pink-100 rounded-full flex items-center justify-center text-xl shadow-inner">👩‍🦰</div>
                  <div>
                    <p className="font-extrabold text-slate-800 text-base">딸내미</p>
                    <p className="text-xs font-bold text-slate-400">카카오뱅크 3333-99-8877665</p>
                  </div>
                </div>
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">선택 ➔</span>
              </div>

              {/* Other mock item 1: Son */}
              <div className="p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between opacity-50 pointer-events-none">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-blue-100 rounded-full flex items-center justify-center text-xl">👨</div>
                  <div>
                    <p className="font-bold text-slate-700">아들</p>
                    <p className="text-xs text-slate-400">국민은행 4321-09-87654</p>
                  </div>
                </div>
              </div>

              {/* Other mock item 2: Alumni */}
              <div className="p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between opacity-50 pointer-events-none">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-emerald-100 rounded-full flex items-center justify-center text-xl">👤</div>
                  <div>
                    <p className="font-bold text-slate-700">동창 김영희</p>
                    <p className="text-xs text-slate-400">신한은행 110-222-33333</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* STEP 3: AMOUNT ENTER PAGE */}
        {step === 3 && (
          <motion.div 
            key="banking-amount"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-4 bg-white justify-between select-none"
          >
            {/* Top Back */}
            <div className="flex items-center gap-2 py-1 mb-1 flex-shrink-0">
              <button onClick={() => setStep(2)} className="p-1 hover:bg-slate-100 rounded-full text-slate-600"><ChevronLeft size={22} /></button>
              <span className="font-extrabold text-slate-400 text-xs">보낼 대상을 확인하세요 (딸내미)</span>
            </div>

            {/* Big Amount Screen Area */}
            <div className="flex-1 flex flex-col justify-center items-center py-4 text-center">
              <span className="text-slate-400 text-xs font-bold block mb-0.5">카카오뱅크 3333-99-8877665</span>
              <h3 className="text-base font-bold text-slate-500 mb-1">딸내미에게 얼마나 보낼까요?</h3>
              <p className="text-3xl font-black text-slate-900 tracking-tight h-12 flex items-center justify-center">
                {amount ? `${parseInt(amount).toLocaleString()}원` : '0원'}
              </p>
              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">내 입출금통장 잔액: 2,021,100원</span>
            </div>

            {/* Quick Sizer Amount Selector Keys */}
            <div className="grid grid-cols-3 gap-2 py-1.5 flex-shrink-0">
              
              <button 
                onClick={() => handleKeypad('1만')}
                className="py-2 bg-slate-50 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 border border-slate-150 active:scale-95 transition-all"
              >
                + 1만원
              </button>

              {/* TARGET TRIGGER: 5만 */}
              <div className="relative">
                <div className="absolute inset-0 border-2 border-dashed border-blue-500 rounded-xl animate-pulse pointer-events-none"></div>
                <button 
                  onClick={() => handleKeypad('5만')}
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black rounded-xl text-xs border-2 border-blue-400 active:scale-95 transition-all relative z-10"
                >
                  + 5만원 🌟
                </button>
              </div>

              <button 
                onClick={() => setAmount('')}
                className="py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-300 active:scale-95 transition-all"
              >
                지우기
              </button>

            </div>

            {/* Numeric Keypad Grid */}
            <div className="grid grid-cols-3 gap-y-1.5 gap-x-4 text-center font-bold text-slate-700 text-lg py-2 flex-shrink-0 bg-slate-50 rounded-2xl border border-slate-100 mb-2 p-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '00', 0, 'back'].map((num, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleKeypad(String(num))}
                  className="py-2 hover:bg-white rounded-xl hover:shadow-sm active:scale-90 transition-all text-xs font-black"
                >
                  {num === 'back' ? '←' : num}
                </button>
              ))}
            </div>

            {/* NEXT TRIGGER BOTTOM BUTTON */}
            <div className="relative flex-shrink-0">
              {amount === '50000' && (
                <>
                  <div className="absolute inset-0 w-full h-full border-4 border-dashed border-yellow-500 rounded-2xl z-15 animate-pulse"></div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-ping z-25"></div>
                </>
              )}
              <button 
                disabled={!amount}
                onClick={() => setStep(4)}
                className={`w-full py-3.5 rounded-2xl font-black text-xs shadow transition-all active:scale-95 z-20 relative flex items-center justify-center gap-1.5 ${
                  amount 
                    ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {amount ? (
                  <>
                    <span>💰 {parseInt(amount).toLocaleString()}원 돈 보내기</span>
                    <span>➔</span>
                  </>
                ) : (
                  <span>금액을 입력하고 돈 보내기 ➔</span>
                )}
              </button>
            </div>

          </motion.div>
        )}

        {/* STEP 4: CONFIRM TRANSFER DATA PAGE */}
        {step === 4 && (
          <motion.div 
            key="banking-confirm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-4 bg-[#F4F5F7] justify-between select-none"
          >
            {/* Header */}
            <div className="flex items-center gap-2 py-2 flex-shrink-0">
              <button onClick={() => setStep(3)} className="p-1 hover:bg-slate-200 rounded-full text-slate-600"><ChevronLeft size={22} /></button>
              <span className="font-extrabold text-slate-800 text-sm">입력 내용 최종 확인</span>
            </div>

            {/* Check summary receipt */}
            <div className="bg-white rounded-[28px] p-6 shadow-md border border-slate-100 flex-1 flex flex-col justify-center gap-5 my-4">
              
              <div className="text-center pb-4 border-b border-slate-100 space-y-1">
                <span className="text-3xl block">👵</span>
                <h4 className="text-sm font-bold text-slate-400">송금 대상</h4>
                <p className="text-xl font-black text-slate-800">딸내미님 계좌로</p>
                <p className="text-[10px] text-slate-400 font-bold">카카오뱅크 3333-99-8877665</p>
              </div>

              <div className="space-y-3 font-bold text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>보낼 금액</span>
                  <span className="text-slate-900 font-extrabold text-base">
                    {amount ? `${parseInt(amount).toLocaleString()}원` : '50,000원'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>송금 수수료</span>
                  <span className="text-blue-600 font-extrabold">0원 (면제)</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-50">
                  <span>출금 통장</span>
                  <span className="text-slate-800">입출금통장 (카카오뱅크)</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-3 text-[10px] text-blue-800 leading-relaxed font-bold border border-blue-100">
                ⚠️ <strong className="text-blue-700">알림:</strong> 확인 버튼을 누르면 바로 서명 단계로 이동하며, 이체가 즉시 처리됩니다.
              </div>

            </div>

            {/* GIANT FINAL TRANSFER TRIGGER */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 w-full h-full border-4 border-dashed border-yellow-500 rounded-2xl z-10 animate-pulse"></div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-ping z-20"></div>

              <button
                onClick={() => setStep(5)}
                className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all z-30 relative"
              >
                {amount ? `${parseInt(amount).toLocaleString()}원 확인` : '50,000원 확인'}
              </button>
            </div>

          </motion.div>
        )}

        {/* STEP 5: PASSWORD KEYPAD SECURITY PAGE */}
        {step === 5 && (
          <motion.div 
            key="banking-password"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col p-4 bg-[#141e30] text-white justify-between select-none z-50 absolute inset-0"
          >
            {isProcessing ? (
              /* Processing screen */
              <div className="flex-grow flex flex-col justify-center items-center text-center p-6 space-y-6">
                <div className="relative flex justify-center items-center w-24 h-24">
                  {/* Glowing background circles */}
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping"></div>
                  
                  {/* Outer spinning dash border */}
                  <div className="absolute inset-0 border-4 border-dashed border-t-yellow-400 border-b-yellow-400 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                  
                  {/* Inner security shield */}
                  <div className="w-16 h-16 bg-blue-600/20 border-2 border-blue-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    <ShieldCheck size={32} className="text-blue-400 animate-bounce" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white tracking-tight">이체 처리 중</h3>
                  <p className="text-xs font-semibold text-slate-400">송금을 안전하게 처리하고 있습니다.</p>
                </div>
                
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-left space-y-2 w-full max-w-xs text-xs font-bold text-slate-300 shadow-inner">
                  <div className="flex justify-between border-b border-slate-800/60 pb-2 mb-2">
                    <span className="text-slate-400">구분</span>
                    <span className="text-white">카카오뱅크 보안송금</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">보내는 사람</span>
                    <span className="text-white">나 (엄마)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">받는 사람</span>
                    <span className="text-white">딸내미 👵💖</span>
                  </div>
                  <div className="flex justify-between text-yellow-400 pt-1 border-t border-slate-800/40">
                    <span>이체 금액</span>
                    <span className="font-black text-sm">50,000원</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Header branding */}
                <div className="flex justify-center py-4 flex-shrink-0 text-slate-400 font-bold text-xs select-none">
                  <ShieldCheck size={14} className="mr-1 text-emerald-400" /> 안전하고 편리한 카카오뱅크 금융보안
                </div>

                {/* Pwd display screen */}
                <div className="flex-1 flex flex-col justify-center items-center text-center py-6">
                  <h3 className="text-lg font-extrabold text-slate-100 mb-2">인증 비밀번호 입력</h3>
                  <p className="text-xs text-slate-400 font-bold mb-8">은행 거래 승인을 위해 비밀번호 6자리를 적으세요.</p>
                  
                  {/* password dots rendering */}
                  <div className="flex gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          i < pwdDots 
                            ? 'bg-yellow-400 border-yellow-400 scale-110 shadow-[0_0_8px_rgba(250,204,21,0.6)]' 
                            : 'border-slate-500 bg-transparent'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Instruction helper */}
                <div className="text-center text-xs font-bold text-yellow-400 px-4 py-2 border border-dashed border-yellow-400/25 rounded-xl bg-yellow-400/5 mb-4 animate-pulse">
                  👉 아래의 숫자 자판을 아무 숫자나 총 6번 터치하세요!
                </div>

                {/* Secure Randomized Numeric Keypad inside banking screen */}
                <div className="grid grid-cols-3 gap-y-3 text-center font-black text-xl py-4 flex-shrink-0 bg-slate-900/60 rounded-3xl border border-slate-800 p-2 mb-2">
                  {[7, 2, 9, 4, 1, 6, 8, 3, 5, '', 0, '✓'].map((num, idx) => (
                    <button 
                      key={idx} 
                      onClick={handlePwdTap}
                      className="py-3.5 hover:bg-slate-800 rounded-2xl active:scale-90 transition-all font-black text-base text-slate-200"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* STEP 6: TRANSFER SUCCESS COMPLETION PAGE */}
        {step === 6 && (
          <motion.div 
            key="banking-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col p-4 bg-white justify-between select-none"
          >
            <div></div>

            {/* Big Success Animation & Card */}
            <div className="flex flex-col items-center justify-center text-center p-6 my-auto">
              
              {/* Green check anim circle */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white text-4xl shadow-lg border-4 border-emerald-100 mb-6"
              >
                ✓
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center"
              >
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black border border-emerald-200 tracking-wider mb-2 animate-bounce">
                  이체 성공 🎉
                </span>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-2">
                  송금 완료
                </h3>
                <p className="text-xs font-bold text-slate-500">딸내미님께 안전하게 전송되었습니다.</p>
              </motion.div>
              
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 w-full max-w-xs space-y-2 mt-4 shadow-sm text-sm">
                <p className="text-slate-500 font-bold">수신인</p>
                <p className="text-lg font-extrabold text-slate-800">딸내미 👵💖</p>
                <p className="text-slate-400 text-xs font-bold">카카오뱅크 3333-99-8877665</p>
                <div className="border-t border-slate-200/50 pt-2 mt-2">
                  <p className="text-slate-500 font-bold">이체 금액</p>
                  <p className="text-2xl font-black text-blue-600">50,000원</p>
                </div>
              </div>

            </div>

            {/* CONFIRM / DONE BOTTOM TRIGGER */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 w-full h-full border-4 border-dashed border-blue-500 rounded-2xl z-10 animate-pulse pointer-events-none"></div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-ping z-20"></div>

              <button
                onClick={onComplete}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all z-30 relative"
              >
                이체 실습 확인
              </button>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default BankingSimulator;
