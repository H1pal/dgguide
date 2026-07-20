import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  ChevronRight, 
  X, 
  Sparkles, 
  MessageSquare, 
  CreditCard, 
  Truck, 
  ArrowLeft, 
  Sliders, 
  Accessibility, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import SimulatorShell from './SimulatorShell';
import KakaotalkSimulator from './KakaotalkSimulator';
import BankingSimulator from './BankingSimulator';
import DeliverySimulator from './DeliverySimulator';

type Scenario = 'kakaotalk' | 'banking' | 'delivery';
type TextSize = 'normal' | 'large' | 'xlarge';

interface ActiveStepState {
  guideText: string;
  ttsText: string;
  stepNum: number;
  totalSteps: number;
}

interface ScenarioManagerProps {
  onClose?: () => void;
}

const ScenarioManager: React.FC<ScenarioManagerProps> = ({ onClose }) => {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [textSize, setTextSize] = useState<TextSize>('large');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState('');

  // Active step sync from sub-simulators
  const [stepState, setStepState] = useState<ActiveStepState>({
    guideText: '스마트폰 화면에서 가리키는 파란색 또는 반짝이는 버튼을 찾아 눌러보세요.',
    ttsText: '스마트폰 화면에서 가리키는 파란색 또는 반짝이는 버튼을 찾아 눌러보세요.',
    stepNum: 1,
    totalSteps: 5
  });

  // TTS State inside Simulator Workspace
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.75); // Slow voice speed for seniors
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Dynamic sizing styling
  const sizeClasses = {
    normal: {
      title: "text-lg font-bold text-slate-800",
      body: "text-sm text-slate-600 leading-relaxed",
      heading: "text-2xl font-black text-slate-900",
      coachBubble: "text-base font-bold text-slate-800 leading-snug"
    },
    large: {
      title: "text-xl font-bold text-slate-800 md:text-2xl",
      body: "text-base text-slate-600 leading-relaxed md:text-lg",
      heading: "text-3xl font-black text-slate-900 md:text-4xl",
      coachBubble: "text-lg font-extrabold text-slate-800 leading-normal"
    },
    xlarge: {
      title: "text-2xl font-black text-slate-800 md:text-3xl",
      body: "text-lg text-slate-600 leading-loose md:text-xl",
      heading: "text-4xl font-black text-slate-900 md:text-5xl",
      coachBubble: "text-xl font-black text-slate-950 leading-loose"
    }
  }[textSize];

  // Synchronized speaking function
  const speakScript = (text: string) => {
    if (!window.speechSynthesis) return;

    try {
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();
    } catch (e) {
      console.error(e);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = speechRate;
    utterance.pitch = 1.05; // Slightly warm/higher pitch for clarity

    const selectVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const koreanVoice = voices.find(v => 
        v.lang.includes('ko-KR') || 
        v.lang.includes('ko_KR') || 
        v.name.includes('Korean') || 
        v.name.includes('한국어')
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
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('TTS error:', e);
        }
        setIsSpeaking(false);
        setIsPaused(false);
      };

      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      selectVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        selectVoiceAndSpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
      setTimeout(selectVoiceAndSpeak, 100);
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
    } else if (stepState.ttsText) {
      speakScript(stepState.ttsText);
    }
  };

  // Speak automatically when stepState or speechRate changes
  useEffect(() => {
    if (activeScenario && stepState.ttsText && !showCelebration) {
      // Delay slightly for visual transition
      const timer = setTimeout(() => {
        speakScript(stepState.ttsText);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stepState.ttsText, speechRate, activeScenario, showCelebration]);

  // Clean up TTS on unmount or scenario switch
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [activeScenario]);

  const handleStepUpdate = (guideText: string, ttsText: string, stepNum: number, totalSteps: number) => {
    setStepState({ guideText, ttsText, stepNum, totalSteps });
  };

  const handleComplete = (scenarioName: string) => {
    stopSpeech();
    let text = '';
    if (scenarioName === 'kakaotalk') {
      text = '딸내미에게 멋진 꽃 사진 보내기 성공! 이젠 딸내미와 사진을 주고받으며 반갑게 소식을 전하실 수 있습니다. 👵💖';
    } else if (scenarioName === 'banking') {
      text = '축하합니다! 카카오뱅크를 통한 은행 송금 미션을 성공적으로 완료하셨습니다. 이제 자녀들에게 용돈을 직접 안전하게 이체할 수 있어요! 🏦✨';
    } else {
      text = '축하합니다! 배달의민족으로 맛있는 짜장면 주문 미션에 완전히 성공하셨습니다! 맛있는 식사가 곧 배달될 것만 같네요. 🍜🛵';
    }
    setCelebrationMsg(text);
    setShowCelebration(true);
    speakScript('축하합니다! 실전 연습 미션을 성공적으로 완수하셨습니다. 참 잘하셨습니다!');
  };

  const closeCelebration = () => {
    setShowCelebration(false);
    setActiveScenario(null);
  };

  // 1. SCENARIO SELECTION PAGE
  if (!activeScenario) {
    return (
      <div className="w-full min-h-screen bg-slate-100 flex flex-col items-center py-8 px-4 sm:px-6 overflow-y-auto relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-white hover:bg-red-500 hover:text-white rounded-full shadow-md text-slate-500 border border-slate-200 transition-all duration-200 hover:scale-105 active:scale-95 z-50 flex items-center justify-center"
            title="실습 종료"
          >
            <X size={24} />
          </button>
        )}
        <div className="max-w-4xl w-full flex flex-col gap-6 my-auto">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight leading-tight pt-1">
              실제 스마트폰 화면으로 직접 실습해보기
            </h2>
            <p className="text-sm sm:text-lg font-medium text-slate-500 max-w-2xl mx-auto">
              가장 자주 쓰는 앱들을 가상 스마트폰 안에서 직접 손으로 꾹꾹 눌러보며 단계별로 익혀 보세요. 틀려도 괜찮으니 안심하고 눌러보세요!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            
            {/* Kakaotalk Scenario Card */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setActiveScenario('kakaotalk')}
              className="bg-white rounded-[32px] border-2 border-slate-200 hover:border-yellow-400 p-6 md:p-8 flex flex-col justify-between shadow-md cursor-pointer transition-all h-[360px] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full blur-2xl -mr-8 -mt-8 opacity-70 group-hover:bg-yellow-200 transition-colors"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 bg-yellow-400 text-black rounded-2xl flex items-center justify-center font-black text-2xl shadow-md">
                  💬
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800">카카오톡 사진 전송</h3>
                  <p className="text-sm text-slate-500 font-bold mt-1">난이도: 쉬움 ★☆☆</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  사랑하는 딸내미에게 갤러리에 들어있는 예쁜 봄꽃 사진을 카카오톡으로 전송해봅니다.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 relative z-10">
                <span className="text-xs font-black text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-xl">카톡 채팅방</span>
                <span className="text-sm font-black text-slate-700 flex items-center gap-1 group-hover:text-yellow-600 transition-colors">
                  시작하기 <ChevronRight size={16} />
                </span>
              </div>
            </motion.div>

            {/* Banking Scenario Card */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setActiveScenario('banking')}
              className="bg-white rounded-[32px] border-2 border-slate-200 hover:border-blue-500 p-6 md:p-8 flex flex-col justify-between shadow-md cursor-pointer transition-all h-[360px] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-2xl -mr-8 -mt-8 opacity-70 group-hover:bg-blue-200 transition-colors"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-md">
                  🏦
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800">은행 계좌 송금</h3>
                  <p className="text-sm text-slate-500 font-bold mt-1">난이도: 보통 ★★☆</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  카카오뱅크 앱을 실행하여 나의 입출금 통장에서 딸내미 계좌로 5만원을 안전하게 이체해봅니다.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 relative z-10">
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">계좌이체 실습</span>
                <span className="text-sm font-black text-slate-700 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                  시작하기 <ChevronRight size={16} />
                </span>
              </div>
            </motion.div>

            {/* Delivery Scenario Card */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setActiveScenario('delivery')}
              className="bg-white rounded-[32px] border-2 border-slate-200 hover:border-teal-500 p-6 md:p-8 flex flex-col justify-between shadow-md cursor-pointer transition-all h-[360px] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 rounded-full blur-2xl -mr-8 -mt-8 opacity-70 group-hover:bg-teal-200 transition-colors"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 bg-[#2AC1BC] text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-md">
                  🍜
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800">음식 배달 주문</h3>
                  <p className="text-sm text-slate-500 font-bold mt-1">난이도: 어려움 ★★★</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  배달의민족 앱에서 주변 중식당 대성각을 찾고 짜장면 곱빼기 1그릇을 장바구니에 담아 주문합니다.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 relative z-10">
                <span className="text-xs font-black text-teal-600 bg-teal-50 px-3 py-1.5 rounded-xl">배달의민족</span>
                <span className="text-sm font-black text-slate-700 flex items-center gap-1 group-hover:text-teal-600 transition-colors">
                  시작하기 <ChevronRight size={16} />
                </span>
              </div>
            </motion.div>

          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 mt-4 max-w-2xl mx-auto">
            <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
            <p className="text-xs sm:text-sm text-amber-800 font-bold leading-relaxed">
              💡 실습 중 언제든 틀린 곳을 눌러도 스마트폰이 꺼지거나 결제되지 않습니다! 마음껏 연습해보세요. 막힐 때는 왼쪽 칠판에 있는 설명과 목소리 안내를 들으면 쉽게 따라할 수 있습니다.
            </p>
          </div>

        </div>
      </div>
    );
  }

  // Dynamic background themes for the simulator viewport backdrop
  let backdropBgClass = 'bg-slate-200';
  let ambientLights = null;
  let coachBubbleClass = 'bg-slate-900/10 border-slate-900/10 text-slate-700';

  if (activeScenario === 'kakaotalk') {
    backdropBgClass = 'bg-gradient-to-tr from-[#9bbbd4] via-[#BACEE0] to-[#e4ecf3]';
    ambientLights = (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-yellow-300/20 blur-[100px] animate-pulse duration-[8000ms]"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-300/30 blur-[120px] animate-pulse duration-[10000ms]"></div>
      </div>
    );
    coachBubbleClass = 'bg-white/85 border-slate-200/50 text-slate-700 shadow-sm backdrop-blur-md';
  } else if (activeScenario === 'banking') {
    backdropBgClass = 'bg-gradient-to-tr from-[#0b0f19] via-[#141e30] to-[#243b55]';
    ambientLights = (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-yellow-500/10 blur-[110px] animate-pulse duration-[9000ms]"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[130px] animate-pulse duration-[12000ms]"></div>
      </div>
    );
    coachBubbleClass = 'bg-slate-900/80 border-slate-800 text-slate-200 shadow-lg backdrop-blur-md';
  } else if (activeScenario === 'delivery') {
    backdropBgClass = 'bg-gradient-to-tr from-[#e6fcfc] via-[#2AC1BC]/10 to-[#f9fdfd]';
    ambientLights = (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#2AC1BC]/15 blur-[100px] animate-pulse duration-[7000ms]"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-teal-300/10 blur-[120px] animate-pulse duration-[11000ms]"></div>
      </div>
    );
    coachBubbleClass = 'bg-white/85 border-[#2AC1BC]/25 text-slate-700 shadow-sm backdrop-blur-md';
  }

  // 2. ACTIVE SIMULATOR FULL WORKSPACE SCREEN (DASHBOARD SPLIT-VIEW)
  return (
    <div className="w-full min-h-screen bg-slate-100 flex flex-col relative overflow-hidden" id="simulator-workspace">
      
      {/* Top Header Panel */}
      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-4 sm:px-6 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveScenario(null)}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-300 hover:text-white"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <span className="text-[10px] uppercase font-black bg-blue-600 text-white px-2 py-0.5 rounded tracking-wide">
              {activeScenario === 'kakaotalk' ? '카카오톡 실습' : activeScenario === 'banking' ? '송금 실습' : '배달 실습'}
            </span>
            <h1 className="text-base sm:text-lg font-black leading-tight">
              {activeScenario === 'kakaotalk' && '딸에게 사진 한 장 안전하게 전송하기'}
              {activeScenario === 'banking' && '카카오뱅크로 딸에게 용돈 5만원 송금하기'}
              {activeScenario === 'delivery' && '배달의민족으로 짜장면 곱빼기 배달 주문하기'}
            </h1>
          </div>
        </div>

        <button 
          onClick={() => setActiveScenario(null)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 rounded-xl text-xs font-black shadow transition-all"
        >
          <X size={14} />
          <span>실습 종료</span>
        </button>
      </header>

      {/* Main Split Columns Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 lg:overflow-hidden lg:h-[calc(100vh-64px)] overflow-y-auto h-auto">
        
        {/* Left Column: Education Guide Board (lg:col-span-5) */}
        <div className="lg:col-span-5 col-span-12 bg-white border-b lg:border-b-0 lg:border-r-2 border-slate-200 flex flex-col lg:overflow-y-auto p-4 sm:p-6 lg:p-8 justify-between gap-6 lg:h-full h-auto flex-shrink-0">
          
          <div className="space-y-6">
            
            {/* Guide Board Header with Sizer Controls */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-2xl">
                  <CheckCircle size={24} />
                </span>
                <span className="text-lg font-black text-slate-800">
                  친절한 실습 칠판
                </span>
              </div>

              {/* Senior Text Sizer */}
              <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded-xl shadow-inner">
                <Accessibility size={14} className="text-slate-500 ml-1 hidden xs:block" />
                <div className="flex gap-0.5 bg-white p-0.5 rounded-lg border border-slate-100">
                  {(['normal', 'large', 'xlarge'] as TextSize[]).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setTextSize(sz)}
                      className={`px-2 py-1 rounded text-xs font-black transition-all ${
                        textSize === sz 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {sz === 'normal' ? '작게' : sz === 'large' ? '보통' : '크게'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Smart Step Progress Ring */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 shadow-sm">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                현재 교육 진도
              </span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-28 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${(stepState.stepNum / stepState.totalSteps) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-black text-blue-600">
                  {stepState.stepNum}단계 / {stepState.totalSteps}단계
                </span>
              </div>
            </div>

            {/* Dynamic Guide Content in Big Font */}
            <div className="space-y-4">
              <div className="flex gap-3 items-start bg-blue-50/50 rounded-[28px] border border-blue-100 p-5 md:p-6 shadow-sm">
                <span className="text-3xl flex-shrink-0 mt-0.5" role="img" aria-label="teacher animate">👵</span>
                <div className="space-y-2">
                  <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">다정이 가이드 선생님</span>
                  <p className={sizeClasses.coachBubble}>
                    {stepState.guideText}
                  </p>
                </div>
              </div>
            </div>

            {/* Senior Friendly Audio Coaching Controller */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md">
                    {isSpeaking ? <Volume2 size={18} className="animate-bounce" /> : <VolumeX size={18} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">선생님 음성 해설 도우미</h4>
                    <p className="text-[10px] text-slate-400 font-bold">막힐 땐 소리를 켜고 들으며 따라해 보세요.</p>
                  </div>
                </div>

                {/* Speech rate control */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
                  <Sliders size={12} className="text-slate-400 ml-1" />
                  <span className="text-[10px] font-black text-slate-500 mr-1">속도:</span>
                  {[
                    { rate: 0.55, text: '느리게' },
                    { rate: 0.75, text: '조금느림' },
                    { rate: 1.0, text: '보통' }
                  ].map(opt => (
                    <button
                      key={opt.rate}
                      onClick={() => setSpeechRate(opt.rate)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                        speechRate === opt.rate 
                          ? 'bg-blue-600 text-white' 
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* TTS Controls Panel */}
              <div className="flex gap-2">
                <button
                  onClick={togglePauseSpeech}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-extrabold text-sm shadow-sm transition-all active:scale-95 ${
                    isSpeaking 
                      ? isPaused 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSpeaking ? (
                    isPaused ? (
                      <><Play size={16} /><span>음성 이어듣기</span></>
                    ) : (
                      <><Pause size={16} /><span>잠시 멈춤</span></>
                    )
                  ) : (
                    <><Volume2 size={16} /><span>안내 목소리 재생</span></>
                  )}
                </button>
                {isSpeaking && (
                  <button
                    onClick={stopSpeech}
                    className="flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-xl font-black text-xs transition-all active:scale-95 shadow-sm"
                  >
                    <Square size={14} />
                    <span>목소리 끄기</span>
                  </button>
                )}
              </div>

              {/* Subtitles (Text description of speech) */}
              <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-inner max-h-24 overflow-y-auto">
                <span className="text-[10px] font-black text-slate-400 flex items-center gap-1 mb-1">
                  🔊 목소리 흘러나오는 자막창:
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                  {stepState.ttsText}
                </p>
              </div>
            </div>

          </div>

          {/* Footer Safety Notice */}
          <div className="border-t border-slate-100 pt-4 text-xs font-bold text-slate-400 space-y-1">
            <p>👵 궁금해요: 스마트폰 화면에 있는 다른 버튼은 안 눌러지나요?</p>
            <p className="font-medium">🙋 가이드 대답: 현재 미션 단계와 무관한 버튼을 누르면, 안전하게 무시되고 올바른 위치를 알려줍니다. 실수해도 안심하고 마음껏 눌러보세요!</p>
          </div>

        </div>

        {/* Right Column: Centers the gorgeous Physical Smartphone Shell (lg:col-span-7) */}
        <div className={`lg:col-span-7 col-span-12 ${backdropBgClass} flex flex-col justify-center items-center p-4 sm:p-8 relative transition-all duration-500 lg:h-full min-h-[680px] sm:min-h-[760px] flex-shrink-0`}>
          
          {/* Ambient Glowing Orbs */}
          {ambientLights}
          
          {/* Subtle Instruction Coach */}
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 border px-5 py-2 rounded-full text-xs font-black z-10 hidden sm:flex items-center gap-1.5 shadow-sm transition-all duration-300 ${coachBubbleClass}`}>
            <span className="animate-bounce">👇</span>
            <span>오른쪽 가상 스마트폰 화면을 직접 눌러보세요</span>
          </div>

          <SimulatorShell activeScenario={activeScenario} currentStep={stepState.stepNum}>
            {activeScenario === 'kakaotalk' && (
              <KakaotalkSimulator 
                onStepChange={handleStepUpdate} 
                onComplete={() => handleComplete('kakaotalk')} 
              />
            )}
            {activeScenario === 'banking' && (
              <BankingSimulator 
                onStepChange={handleStepUpdate} 
                onComplete={() => handleComplete('banking')} 
              />
            )}
            {activeScenario === 'delivery' && (
              <DeliverySimulator 
                onStepChange={handleStepUpdate} 
                onComplete={() => handleComplete('delivery')} 
              />
            )}
          </SimulatorShell>

        </div>

      </div>

      {/* Celebration Custom Backdrop Modal */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 z-[999] bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white rounded-[40px] p-8 md:p-10 max-w-lg w-full text-center border-4 border-blue-500 shadow-2xl relative overflow-hidden"
            >
              {/* Confetti vector simulation */}
              <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="w-4 h-4 bg-red-400 absolute left-8 top-12 rounded-full animate-bounce delay-75"></div>
                <div className="w-3.5 h-3.5 bg-yellow-400 absolute right-12 top-20 rounded-full animate-ping"></div>
                <div className="w-5 h-5 bg-blue-400 absolute left-16 bottom-16 rounded-full animate-bounce delay-300"></div>
                <div className="w-3 h-3 bg-green-400 absolute right-20 bottom-12 rounded-full animate-bounce"></div>
              </div>

              <div className="w-24 h-24 bg-gradient-to-tr from-yellow-300 to-amber-400 rounded-full flex items-center justify-center text-5xl mx-auto shadow-md border-4 border-white mb-6">
                🎉
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight mb-4">
                미션 성공 완료! 🏅
              </h3>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-semibold mb-8">
                {celebrationMsg}
              </p>

              <button
                onClick={closeCelebration}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl shadow-lg transition-all transform active:scale-95"
              >
                다른 연습 하기
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ScenarioManager;
