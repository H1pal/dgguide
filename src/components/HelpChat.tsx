import { useState, useEffect, useRef } from "react";
import { 
  X, 
  Send, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ShieldAlert, 
  Lightbulb, 
  MessageSquare,
  CornerDownLeft,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

interface HelpChatProps {
  textSize: "normal" | "large" | "xlarge";
  activeScenario?: string | null;
  currentStep?: number;
}

export default function HelpChat({ textSize, activeScenario, currentStep }: HelpChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "반가워요, 어르신! 💕 저는 어르신의 스마트폰 사용을 다정하게 도와드리는 '도우미 AI'이랍니다.\n\n카카오톡 사용법, 모바일 은행 이체할 때 주의할 점, 배달 앱 주문 방법 등 궁금한 것이 있다면 무엇이든 편하게 물어보셔요. 아래 추천 질문을 손가락으로 꾹 누르시거나 직접 글씨를 써서 물어보실 수 있어요!",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Audio state
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Cleanup TTS on close/unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const sizeClasses = {
    normal: {
      text: "text-sm",
      title: "text-base font-bold",
      btn: "text-xs px-3 py-1.5",
      input: "text-sm"
    },
    large: {
      text: "text-base font-medium md:text-lg",
      title: "text-lg font-black md:text-xl",
      btn: "text-sm font-bold px-4 py-2",
      input: "text-base font-semibold"
    },
    xlarge: {
      text: "text-lg font-bold md:text-xl",
      title: "text-xl font-black md:text-2xl",
      btn: "text-base font-black px-5 py-2.5",
      input: "text-lg font-bold"
    }
  }[textSize];

  // Korean Speech Synthesis
  const speakMessage = (messageId: string, text: string) => {
    if (!window.speechSynthesis) return;

    if (speakingId === messageId) {
      stopSpeech();
      return;
    }

    try {
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();
    } catch (e) {
      console.error(e);
    }

    const cleanText = text.replace(/[❤️💕😊🔒💬🛵📱]/g, ""); // Remove emojis for cleaner TTS
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ko-KR";
    utterance.rate = 0.75; // Slower, clear rate for seniors

    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find(voice => 
      voice.lang.includes("ko-KR") || 
      voice.lang.includes("ko_KR") || 
      voice.name.includes("Korean") || 
      voice.name.includes("한국어")
    );
    if (koreanVoice) utterance.voice = koreanVoice;

    utterance.onstart = () => {
      setSpeakingId(messageId);
    };

    utterance.onend = () => {
      setSpeakingId(null);
    };

    utterance.onerror = () => {
      setSpeakingId(null);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  };

  // Chat message sending handler
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    stopSpeech();
    const userMessageId = `msg-${Date.now()}`;
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Prepare message history
      const history = [...messages, userMessage].map(msg => ({
        role: msg.role,
        text: msg.text
      }));

      const response = await fetch("/api/help-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          activeScenario,
          currentStep
        })
      });

      if (!response.ok) {
        throw new Error("서버와의 대화 연결에 실패했습니다.");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        text: data.text || "죄송해요 어르신, 제가 잠시 딴생각을 했나 봐요. 다시 한번만 말씀해 주시겠어요? 💕",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak automatically if it is standard practice
      speakMessage(assistantMessage.id, assistantMessage.text);

    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: `msg-err-${Date.now()}`,
        role: "assistant",
        text: "아이고 어르신, 인터넷 신호가 약해서 제가 잘 듣지 못했어요. 핸드폰 화면 아래 보내기 버튼을 다시 한번 눌러보셔요! 😊",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetQuestions = [
    { text: "송금할 때 사기 피하는 법 알려줘 🔒", label: "이체 안전 예방" },
    { text: "카카오톡 친구 추가는 어떻게 하나요? 💬", label: "친구 추가 법" },
    { text: "배달 주문할 때 주소가 맞는지 걱정돼요 🛵", label: "배달 주소 확인" },
    { text: "스마트폰 글씨 크기를 더 키우고 싶어요 📱", label: "글자 크게 보기" }
  ];

  return (
    <>
      {/* FLOATING ACTION BUTTON */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="relative flex items-center justify-center"
            >
              <button
                id="floating-ai-helper-btn"
                onClick={() => setIsOpen(true)}
                className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-4 border-white focus:outline-none focus:ring-4 focus:ring-blue-300"
                aria-label="AI 도움말 열기"
              >
                <HelpCircle className="w-9 h-9 text-white stroke-[2.5]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FLOATING CHAT WINDOW DRAWER (Centered with backdrop blur) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 cursor-pointer"
              onClick={() => { setIsOpen(false); stopSpeech(); }}
            />

            {/* Centered Chat Layout Wrapper */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="pointer-events-auto w-[92vw] sm:w-[440px] h-[80vh] sm:h-[640px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(37,99,235,0.3)] border-4 border-blue-500 flex flex-col overflow-hidden"
              >
                {/* CHAT HEADER (More compact) */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-blue-800 flex-shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center border border-white/30 relative">
                      <span className="text-lg">👵</span>
                      {/* Glowing online led dot */}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-blue-600 rounded-full animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm sm:text-base">
                        도우미 AI
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {speakingId && (
                      <button 
                        onClick={stopSpeech}
                        className="p-1.5 bg-red-500 hover:bg-red-600 rounded-xl transition-all"
                        title="소리 끄기"
                      >
                        <VolumeX size={14} className="text-white animate-pulse" />
                      </button>
                    )}
                    <button
                      onClick={() => { setIsOpen(false); stopSpeech(); }}
                      className="p-1.5 bg-blue-800/50 hover:bg-blue-800 rounded-xl transition-all"
                      aria-label="대화창 닫기"
                    >
                      <X size={18} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* PRESENT SCENARIO HINT DECORATOR (More compact) */}
                {activeScenario && (
                  <div className="bg-yellow-50 border-b border-yellow-200 px-3 py-1.5 text-xs font-bold text-yellow-800 flex items-center gap-1.5 flex-shrink-0">
                    <Sparkles size={12} className="text-yellow-600 animate-pulse flex-shrink-0" />
                    <span>
                      현재 <strong className="text-yellow-900">
                        {activeScenario === "kakaotalk" ? "카카오톡 실습" : activeScenario === "banking" ? "송금 실습" : "배달 주문 실습"}
                      </strong> 진행 중! 관련 힌트를 드릴 수 있습니다.
                    </span>
                  </div>
                )}

                {/* CHAT MESSAGES BODY */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] flex flex-col gap-1`}>
                        
                        {/* Speaker name */}
                        <span className={`text-[11px] font-bold text-slate-400 px-1 ${
                          msg.role === "user" ? "text-right" : "text-left"
                        }`}>
                          {msg.role === "user" ? "나" : "도우미 AI"}
                        </span>

                        {/* Chat Bubble container */}
                        <div className="relative group">
                          <div className={`p-3.5 rounded-2xl shadow-sm whitespace-pre-line leading-relaxed ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white rounded-tr-none font-bold"
                              : "bg-white text-slate-800 border border-slate-200 rounded-tl-none font-semibold"
                          } ${sizeClasses.text}`}>
                            {msg.text}
                          </div>

                          {/* TTS speaker trigger button on Assistant messages */}
                          {msg.role === "assistant" && (
                            <button
                              onClick={() => speakMessage(msg.id, msg.text)}
                              className={`absolute -bottom-3 -right-3 p-1.5 rounded-full shadow-md border transition-all ${
                                speakingId === msg.id
                                  ? "bg-red-500 text-white border-red-400 scale-110"
                                  : "bg-white text-blue-600 border-slate-200 hover:bg-slate-50 hover:scale-105"
                              }`}
                              title="목소리로 천천히 듣기"
                            >
                              {speakingId === msg.id ? (
                                <VolumeX size={13} className="animate-pulse" />
                              ) : (
                                <Volume2 size={13} />
                              )}
                            </button>
                          )}
                        </div>

                        <span className={`text-[9px] text-slate-400 mt-1 px-1 ${
                          msg.role === "user" ? "text-right" : "text-left"
                        }`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                      </div>
                    </div>
                  ))}

                  {/* Loader Loading bubbles */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-slate-400 px-1">도우미 AI</span>
                        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-300" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* PRESET CHIPS AND CONTROLS FOOTER (Highly optimized for maximum chat space) */}
                <div className="border-t border-slate-200 bg-white flex flex-col flex-shrink-0">
                  
                  {/* Preset suggestion chips list (extremely compact) */}
                  <div className="p-1.5 bg-slate-50 border-b border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
                    {presetQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q.text)}
                        className="bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] text-slate-700 font-extrabold px-2.5 py-1 rounded-full shadow-sm transition-all active:scale-95 flex-shrink-0 flex items-center gap-1"
                      >
                        <Lightbulb size={11} className="text-yellow-500" />
                        <span>{q.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* INPUT BAR (Compact layout, square button, expanded input box) */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage(inputText);
                    }}
                    className="p-2 flex gap-2 items-center bg-white"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="무엇이든 물어보셔요!"
                      disabled={isLoading}
                      className={`flex-1 min-w-0 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-2 border-slate-200 focus:border-blue-500 rounded-2xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${sizeClasses.input}`}
                    />
                    
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isLoading}
                      className={`w-[46px] h-[46px] rounded-2xl flex items-center justify-center transition-all active:scale-95 border-b-4 flex-shrink-0 ${
                        !inputText.trim() || isLoading
                          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                          : "bg-yellow-400 hover:bg-yellow-500 text-slate-900 border-yellow-600 font-black shadow-md"
                      }`}
                      aria-label="물어보기"
                    >
                      <Send size={18} className="flex-shrink-0" />
                    </button>
                  </form>

                  <div className="bg-blue-50/50 px-4 py-1.5 text-[10px] text-center text-blue-800 font-bold border-t border-blue-100">
                    ❤️ 귀로 듣고 싶으실 땐 답변 우측 아래의 <strong className="text-blue-700">파란색 스피커(🔊)</strong> 버튼을 꾹 누르셔요!
                  </div>

                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
