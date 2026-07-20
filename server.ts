import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Set up larger limit for base64 image uploads
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Initialize Gemini client lazily/gracefully
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
    }
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

// API endpoint to analyze kiosk image
app.post("/api/analyze-kiosk", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "이미지 데이터가 올바르지 않습니다." });
    }

    // Extract base64 clean content
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";

    const client = getGeminiClient();

    const systemInstruction = `당신은 키오스크 조작에 어려움을 겪는 어르신(시니어)들을 돕는 다정하고 친절한 도우미 가이드입니다. 
제공된 키오스크 화면 이미지를 분석하여, 어르신이 지금 화면에서 어떻게 행동해야 하는지 다음 원칙에 따라 상세하고 명확하게 가이드해 주세요:

1. **지극히 친절하고 쉬운 말**: 전문 용어(예: UI, 인터페이스, 팝업, 탭, 세션 등)는 일절 배제하고, 어르신들이 바로 이해할 수 있는 쉬운 한글 단어로 순화하세요. (예: '터치하세요' -> '손가락으로 꾹 누르세요', '카테고리' -> '메뉴 종류')
2. **구체적인 위치 설명**: 단순 '결제 버튼'이 아니라 '화면 오른쪽 맨 아래에 있는 큰 노란색 결제하기 버튼'과 같이 위치와 색상, 크기를 짚어가며 상세히 알려주세요.
3. **가장 급한 일 먼저**: 지금 화면에서 무조건 먼저 해야 하는 '핵심 행동'을 맨 위에 명시하세요.
4. **단계별 구성**: 최대 4단계로 한 번에 처리해야 할 흐름을 명확히 정리해 주세요.
5. **글자 크기를 고려한 TTS**: 음성 대본은 마치 옆에서 손주가 나긋나긋하게 설명해 주듯 존댓말로 천천히 따뜻하게 들려주는 톤으로 작성하세요.
6. **정밀한 버튼/영역 좌표 탐지 (핵심)**:
   - 각 중요 요소(elements)에 대해, 업로드된 키오스크 이미지 내에서의 실제 위치 비율을 백분율(0 ~ 100 사이의 정수)로 정확히 추정하여 알려주세요.
   - \`top\`: 이미지의 맨 위(0%)에서부터 요소가 시작되는 세로 위치 비율 (0 ~ 100)
   - \`left\`: 이미지의 맨 왼쪽(0%)에서부터 요소가 시작되는 가로 위치 비율 (0 ~ 100)
   - \`width\`: 요소의 가로 너비 비율 (0 ~ 100)
   - \`height\`: 요소의 세로 높이 비율 (0 ~ 100)
   - 예: 화면 오른쪽 아래에 결제하기 버튼이 있다면, \`top: 74\`, \`left: 58\`, \`width: 38\`, \`height: 22\`와 같이 실제 이미지 위에서 해당 버튼을 완벽하게 감싸는 정밀한 사각형 값을 지정해 주세요.
7. **헷갈리기 쉬운 버튼과 복잡한 기능 위주로 사전(elements) 구성 (매우 중요)**:
   - '글자/버튼 사전'(\`elements\`)은 단순히 모든 일반 버튼이나 메인 그림을 뜻 없이 나열해서는 절대 안 됩니다.
   - 어르신들이 화면을 보았을 때 **무슨 뜻인지 한눈에 이해하기 어렵거나, 조작 시 실수하면 큰일 날 것 같아 망설여지거나, 헷갈리기 쉬운 특수한 버튼과 문구**들을 골라서 분석해 주세요.
   - (예: '이전' / '처음으로 / 전체 취소' 단추, '쿠폰 등록/바코드' 단추, '옵션 선택' 조건 단추, '포인트 적립'이나 '멤버십 할인' 분기 단추, 복잡한 '결제 방법(신용카드/모바일페이) 선택' 단추 등)
   - 누구나 한눈에 알아보는 쉬운 그림 대신, 어르신들의 시선에서 가장 높은 장벽이 될 헷갈리는 요소를 3~5개만 짚어 설명하세요.

출력은 반드시 지정된 JSON 스키마를 100% 준수하여 한글로 채워주세요.`;

    const prompt = "이 키오스크 화면을 보고 어르신이 헤매지 않고 결제나 주문을 마칠 수 있도록 눈높이에 맞춰 친절하게 분석하고, 특히 어르신들이 가장 헷갈리거나 실수하기 쉬운 복잡한 버튼과 기능들을 3~5개 정확히 선별하여 해당 버튼들의 정확한 이미지상 백분율 좌표(top, left, width, height)와 친근한 기능 해설을 함께 정성껏 추출해 주세요.";

    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            screenType: {
              type: Type.STRING,
              description: "이 화면이 어떤 키오스크의 어떤 단계인지 간단히 요약 (예: '카페 주문 - 음료 선택 화면')",
            },
            keyAction: {
              type: Type.STRING,
              description: "지금 이 화면에서 어르신이 가장 먼저 해야 할 핵심 조작 행동 (위치, 색상과 함께 한 줄로 명확히 작성)",
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "단계 구분 (예: '1단계: 메뉴 고르기')" },
                  desc: { type: Type.STRING, description: "해당 단계에서 해야 하는 구체적인 행동 설명" },
                },
                required: ["title", "desc"],
              },
              description: "따라하기 쉬운 단계별 조작 흐름 (최대 4개)",
            },
            elements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "화면에 보이는 헷갈리기 쉬운 중요 버튼/텍스트 이름" },
                  location: { type: Type.STRING, description: "위치 설명 (예: '화면 맨 아래 가운데', '오른쪽 하단')" },
                  action: { type: Type.STRING, description: "이 버튼이 진짜 무엇을 하는 곳이고 누르면 어떻게 되는지에 관한 친밀한 설명" },
                  top: { type: Type.INTEGER, description: "이 버튼이 위치한 이미지 상의 상단 Y 시작 위치 비율 (0 ~ 100 사이의 정수)" },
                  left: { type: Type.INTEGER, description: "이 버튼이 위치한 이미지 상의 좌측 X 시작 위치 비율 (0 ~ 100 사이의 정수)" },
                  width: { type: Type.INTEGER, description: "이 버튼 영역의 가로 폭 비율 (0 ~ 100 사이의 정수)" },
                  height: { type: Type.INTEGER, description: "이 버튼 영역의 세로 높이 비율 (0 ~ 100 사이의 정수)" },
                },
                required: ["name", "location", "action", "top", "left", "width", "height"],
              },
              description: "화면 내에서 어르신이 특히 헷갈리기 쉽거나 조작 실수 가능성이 높은 중요 버튼이나 기능 사전 (3~5개, 테두리를 그릴 정밀한 이미지상의 백분율 좌표 포함)",
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "어르신들이 실수하기 쉬운 부분에 대한 예방 꿀팁 또는 도움말 (예: '신용카드는 IC칩이 위로 가도록 끝까지 쏙 넣으셔야 해요')",
            },
            ttsScript: {
              type: Type.STRING,
              description: "음성 가이드 대본 (어르신이 들으면서 화면을 직접 만질 수 있게 천천히 이야기하는 구어체 한글 대본)",
            },
          },
          required: ["screenType", "keyAction", "steps", "elements", "tips", "ttsScript"],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Gemini로부터 분석 결과를 받지 못했습니다.");
    }
    const result = JSON.parse(responseText.trim());
    res.json(result);
  } catch (error: any) {
    const errorMessage = error.message || "";
    
    // Check if it is a quota limit, rate limit, or resource exhaustion
    const isQuotaOrApiError = 
      errorMessage.includes("quota") || 
      errorMessage.includes("RESOURCE_EXHAUSTED") || 
      errorMessage.includes("429") || 
      error.status === 429;

    if (isQuotaOrApiError) {
      console.warn("Gemini API quota exceeded or rate limited.");
      return res.status(429).json({ 
        error: "AI 토큰이 없습니다. 사용량이 초과되었거나 오늘 분석 가능한 한도에 도달했습니다. 잠시 후 다시 시도해 주세요." 
      });
    }

    // Check if it is a missing/invalid API key
    const isKeyError = 
      errorMessage.includes("apiKey") ||
      errorMessage.includes("API_KEY");
      
    if (isKeyError) {
      return res.status(401).json({
        error: "GEMINI_API_KEY가 올바르지 않거나 설정되지 않았습니다."
      });
    }

    console.error("Analysis Error:", error);
    res.status(500).json({ error: errorMessage || "키오스크 분석 도중 오류가 발생했습니다." });
  }
});

// API endpoint for AI Help Chat
app.post("/api/help-chat", async (req, res) => {
  try {
    const { messages, activeScenario, currentStep } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "대화 내역이 올바르지 않습니다." });
    }

    const client = getGeminiClient();

    // Map chat messages to the format expected by the SDK
    const contents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.text || msg.content || "" }],
    }));

    // Dynamic prompt additions based on scenario context
    let contextExplanation = "";
    if (activeScenario) {
      let scenarioKorean = "";
      if (activeScenario === "kakaotalk") scenarioKorean = "카카오톡 친구 추가 및 사기꾼 대처하기";
      else if (activeScenario === "banking") scenarioKorean = "모바일 뱅킹 송금하기";
      else if (activeScenario === "delivery") scenarioKorean = "배달 앱으로 음식 주문하기";

      contextExplanation = `\n[현재 학습 상황 안내]\n어르신은 현재 '${scenarioKorean}' 시뮬레이션을 진행하고 있으며, 현재 전체 단계 중 ${currentStep || 1}번째 단계에 머물러 계십니다. 이 점을 참고하셔서 필요한 경우 맞춤형 힌트를 주셔도 좋습니다.`;
    }

    const systemInstruction = `당신은 스마트폰과 모바일 앱(카카오톡, 모바일 뱅킹, 배달 앱) 사용에 서투르신 어르신(시니어)들을 돕는 '말동무 AI 스마트폰 선생님'입니다.
어르신들이 디지털 세상에서 소외되지 않도록 세상에서 가장 다정하고, 따뜻하며, 인내심 깊은 목소리로 답해 주셔야 합니다.

[중요 지시사항: 마크다운(Markdown) 사용 금지 및 간결성]
1. 절대로 마크다운(Markdown) 문법을 사용하지 마십시오. 별표(**, *), 샵(#), 대시(-), 번호 매기기(1.), 백틱(\`) 등 그 어떤 마크다운 기호도 답변에 포함되어서는 안 됩니다.
2. 오직 일반 텍스트(한글, 숫자, 쉼표, 마침표, 물음표, 느낌표, 줄바꿈)와 이모티콘만 사용하십시오.
3. 답변은 어르신이 읽기 편하도록 군더더기 없이 간결하게 핵심만 2~4문장 내외로 대답해 주세요. 긴 문장보다는 짧고 편안한 대화 형식이어야 합니다.

[답변 원칙]
1. 지극히 다정하고 효도하는 손주 톤: "어르신 걱정하지 마셔요!", "~하셔요", "~했답니다" 처럼 친밀하고 따스한 존댓말로 천천히 설명하듯 답해 주세요. 하트(❤️, 💕, 😊)나 응원의 이모티콘을 적절히 섞어주면 좋습니다.
2. 쉬운 용어 사용: '인터페이스', '로그인', '인증서', '세션', 'UI', '디바이스', '클릭', '앱' 같은 외국어나 전문 용어는 최대한 배제하거나 한글로 풀어서 설명해 주세요:
   - 로그인 -> '내 이름과 비밀번호로 들어가기'
   - 공인인증서/간편인증 -> '비밀 번호나 모바일 신분증(모바일 도장)'
   - 이체/송금 -> '은행 돈 보내기'
   - 계좌번호 -> '은행 통장 주소(번호)'
   - 터치/클릭 -> '손가락으로 가볍게 누르기'
   - 스마트폰 화면/인터페이스 -> '휴대폰 유리창 화면'
3. 핵심적인 안전 및 보안 수칙 (매우 중요):
   - 보이스피싱, 스미싱(사기 문자) 예방 교육을 수시로 친절히 안내해 주세요.
   - 예: "딸이나 아들이라며 핸드폰 액정 깨졌다고 문자로 돈을 요구하면 꼭 전화를 걸어 목소리를 직접 확인하기 전까진 돈을 보내면 안 돼요!"
   - 은행 송금 시: "모르는 사람이 알려준 계좌로 돈을 보낼 때는 비밀번호나 신용카드 정보를 함부로 문자로 보내주면 안 돼요!"
4. 실습 진행 시 맞춤형 답변:
   - 질문에 현재 실습 중인 앱 정보(예: 카카오톡, 모바일 뱅킹, 배달 앱)가 주어지면, 해당 상황에 꼭 맞는 유용한 꿀팁이나 조언을 제공해 주세요.${contextExplanation}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Gemini로부터 답변을 받지 못했습니다.");
    }

    res.json({ text: responseText });
  } catch (error: any) {
    const errorMessage = error.message || "";
    const isQuotaOrApiError = 
      errorMessage.includes("quota") || 
      errorMessage.includes("RESOURCE_EXHAUSTED") || 
      errorMessage.includes("429") || 
      error.status === 429;

    if (isQuotaOrApiError) {
      return res.status(429).json({ 
        text: "우아! 어르신들의 관심이 뜨겁네요. 지금 대화 상대가 잠시 가득 찼으니, 조금 이따가 다시 한 번 정답게 저를 불러주셔요! ❤️" 
      });
    }

    const isKeyError = errorMessage.includes("apiKey") || errorMessage.includes("API_KEY");
    if (isKeyError) {
      return res.status(401).json({
        text: "아이고, 저와 연결해 주는 비밀번호 자물쇠(API KEY)에 문제가 생겼나 봐요. 관리자에게 알려주시면 고쳐 드릴게요!"
      });
    }

    console.error("Help Chat Error:", error);
    res.status(500).json({ text: "어르신, 대답하는 중에 잠시 휴대폰 신호가 약해졌나 봐요. 한 번만 다시 말씀해 주시겠어요? 😊" });
  }
});

// Setup Vite or Static serve
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupServer();
