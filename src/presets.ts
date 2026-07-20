/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface KioskPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  svgMarkup: string;
}

// Helper to convert SVG string to Base64 Image URL
export function getSvgDataUrl(svgString: string): string {
  const cleanSvg = svgString.trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
}

export const KIOSK_PRESETS: KioskPreset[] = [
  {
    id: "mcdonalds",
    name: "패스트푸드 햄버거 주문기",
    category: "음식점 / 패스트푸드",
    description: "햄버거 세트와 단품을 선택하고 장바구니에 담아 결제하는 화면입니다.",
    icon: "🍔",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 550" width="100%" height="100%">
  <!-- Frame -->
  <rect x="0" y="0" width="400" height="550" fill="#1e1e24" rx="16" />
  <rect x="10" y="10" width="380" height="530" fill="#f8f9fa" rx="12" />
  
  <!-- McDonald's Yellow/Red Header Banner -->
  <rect x="10" y="10" width="380" height="70" fill="#da291c" rx="12" />
  <!-- Yellow Arc Logo Decor -->
  <path d="M 200 60 A 25 25 0 0 1 230 35 A 25 25 0 0 1 260 60" stroke="#ffbc0d" stroke-width="8" fill="none" />
  <path d="M 140 60 A 25 25 0 0 1 170 35 A 25 25 0 0 1 200 60" stroke="#ffbc0d" stroke-width="8" fill="none" />
  <text x="30" y="50" fill="#ffffff" font-family="'Inter', 'Noto Sans KR', sans-serif" font-size="22" font-weight="bold">맥도날드 주문기</text>
  
  <!-- Category Tabs -->
  <rect x="20" y="95" width="80" height="35" fill="#ffbc0d" rx="6" />
  <text x="32" y="118" fill="#1e1e24" font-family="'Noto Sans KR'" font-size="13" font-weight="bold">추천메뉴</text>
  
  <rect x="110" y="95" width="80" height="35" fill="#e9ecef" rx="6" />
  <text x="130" y="117" fill="#495057" font-family="'Noto Sans KR'" font-size="13">버거단품</text>
  
  <rect x="200" y="95" width="80" height="35" fill="#e9ecef" rx="6" />
  <text x="220" y="117" fill="#495057" font-family="'Noto Sans KR'" font-size="13">세트메뉴</text>

  <rect x="290" y="95" width="90" height="35" fill="#e9ecef" rx="6" />
  <text x="310" y="117" fill="#495057" font-family="'Noto Sans KR'" font-size="13">음료/디저트</text>
  
  <!-- Content Area - Items Grid -->
  <!-- Item 1: Bulgogi Burger Set -->
  <rect x="20" y="150" width="170" height="180" fill="#ffffff" rx="8" stroke="#dee2e6" stroke-width="1" />
  <rect x="40" y="165" width="130" height="80" fill="#ffe3e3" rx="6" />
  <!-- Burger Icon representation -->
  <circle cx="105" cy="205" r="30" fill="#b15c1e" />
  <ellipse cx="105" cy="195" rx="28" ry="12" fill="#ffd166" />
  <rect x="75" y="202" width="60" height="6" fill="#06d6a0" />
  <rect x="78" y="208" width="54" height="10" fill="#ef476f" />
  <text x="30" y="265" fill="#212529" font-family="'Noto Sans KR'" font-size="14" font-weight="bold" text-anchor="middle" x-offset="105" transform="translate(75, 0)">불고기버거 세트</text>
  <text x="105" y="285" fill="#da291c" font-family="'Noto Sans KR'" font-size="14" font-weight="bold" text-anchor="middle">6,900원</text>
  <rect x="40" y="295" width="130" height="26" fill="#ffbc0d" rx="4" />
  <text x="105" y="312" fill="#1e1e24" font-family="'Noto Sans KR'" font-size="12" font-weight="bold" text-anchor="middle">장바구니 담기</text>
  
  <!-- Item 2: BigMac Set -->
  <rect x="210" y="150" width="170" height="180" fill="#ffffff" rx="8" stroke="#da291c" stroke-width="2" />
  <rect x="230" y="165" width="130" height="80" fill="#fff3cd" rx="6" />
  <!-- Burger BigMac Graphic -->
  <circle cx="295" cy="205" r="32" fill="#9c6644" />
  <ellipse cx="295" cy="190" rx="30" ry="10" fill="#ffb703" />
  <ellipse cx="295" cy="205" rx="30" ry="6" fill="#780000" />
  <rect x="265" y="196" width="60" height="5" fill="#52b788" />
  <rect x="265" y="210" width="60" height="5" fill="#52b788" />
  <text x="210" y="265" fill="#212529" font-family="'Noto Sans KR'" font-size="14" font-weight="bold" transform="translate(85, 0)" text-anchor="middle">빅맥 세트</text>
  <text x="295" y="285" fill="#da291c" font-family="'Noto Sans KR'" font-size="14" font-weight="bold" text-anchor="middle">7,500원</text>
  <rect x="230" y="295" width="130" height="26" fill="#da291c" rx="4" />
  <text x="295" y="312" fill="#ffffff" font-family="'Noto Sans KR'" font-size="12" font-weight="bold" text-anchor="middle">장바구니 담기</text>
  <rect x="210" y="150" width="60" height="22" fill="#da291c" rx="4" />
  <text x="240" y="166" fill="#ffffff" font-family="'Noto Sans KR'" font-size="11" font-weight="bold" text-anchor="middle">인기만점</text>

  <!-- Bottom Helper Notice Banner -->
  <rect x="20" y="350" width="360" height="45" fill="#e2f0d9" rx="6" />
  <text x="35" y="377" fill="#2e7d32" font-family="'Noto Sans KR'" font-size="13" font-weight="bold">도움말: 기계 아래쪽에 직원 호출용 벨이 있습니다.</text>

  <!-- Cart / Checkout Section -->
  <rect x="10" y="415" width="380" height="125" fill="#212529" rx="12" />
  
  <text x="30" y="445" fill="#ffffff" font-family="'Noto Sans KR'" font-size="15" font-weight="bold">담은 상품 (1개)</text>
  <text x="30" y="475" fill="#ffbc0d" font-family="'Noto Sans KR'" font-size="14">불고기버거 세트 1개</text>
  <text x="30" y="505" fill="#ffffff" font-family="'Noto Sans KR'" font-size="18" font-weight="bold">합계금액: <tspan fill="#ffbc0d">6,900원</tspan></text>
  
  <!-- Giant Checkout Button -->
  <rect x="240" y="435" width="130" height="85" fill="#ffbc0d" rx="8" />
  <text x="305" y="475" fill="#1e1e24" font-family="'Noto Sans KR'" font-size="20" font-weight="bold" text-anchor="middle">결제하기</text>
  <text x="305" y="500" fill="#da291c" font-family="'Noto Sans KR'" font-size="12" font-weight="bold" text-anchor="middle">(신용카드 전용)</text>
</svg>`
  },
  {
    id: "starbucks",
    name: "스타벅스 무인 카페 주문기",
    category: "무인 카페 / 음료",
    description: "아메리카노, 라떼 등 커피를 고르고 따뜻한 것과 차가운 것을 선택해 주문하는 화면입니다.",
    icon: "☕",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 550" width="100%" height="100%">
  <!-- Frame -->
  <rect x="0" y="0" width="400" height="550" fill="#111111" rx="16" />
  <rect x="10" y="10" width="380" height="530" fill="#f4f1ea" rx="12" />
  
  <!-- Starbucks Green Header -->
  <rect x="10" y="10" width="380" height="70" fill="#00704a" rx="12" />
  <!-- Mermaid Logo Decor -->
  <circle cx="340" cy="45" r="22" fill="#ffffff" />
  <circle cx="340" cy="45" r="19" fill="#00704a" />
  <path d="M 334 38 Q 340 50 346 38" stroke="#ffffff" stroke-width="2" fill="none" />
  <text x="30" y="52" fill="#ffffff" font-family="'Noto Sans KR', sans-serif" font-size="22" font-weight="bold">STARBUCKS CAFE</text>
  
  <!-- Top Menu Selector -->
  <text x="30" y="115" fill="#222222" font-family="'Noto Sans KR'" font-size="18" font-weight="bold">마실 음료를 손으로 누르세요</text>
  
  <!-- Beverage Grid -->
  <!-- Drink 1: Warm Americano -->
  <rect x="20" y="140" width="170" height="150" fill="#ffffff" rx="8" stroke="#dddddd" stroke-width="1" />
  <rect x="35" y="150" width="140" height="60" fill="#f8eedb" rx="6" />
  <!-- Coffee Cup SVG Representation -->
  <path d="M 90 170 L 120 170 L 115 200 L 95 200 Z" fill="#4a3b32" />
  <path d="M 120 175 C 126 175 126 187 120 187" stroke="#4a3b32" stroke-width="3" fill="none" />
  <!-- Hot Steam lines -->
  <path d="M 98 162 Q 101 155 98 150" stroke="#ffb703" stroke-width="2" fill="none" />
  <path d="M 105 162 Q 108 155 105 150" stroke="#ffb703" stroke-width="2" fill="none" />
  <text x="105" y="235" fill="#222222" font-family="'Noto Sans KR'" font-size="14" font-weight="bold" text-anchor="middle">따뜻한 아메리카노</text>
  <text x="105" y="258" fill="#c33c23" font-family="'Noto Sans KR'" font-size="14" font-weight="bold" text-anchor="middle">4,500원</text>
  <rect x="20" y="140" width="55" height="20" fill="#da291c" rx="4" />
  <text x="47" y="154" fill="#ffffff" font-family="'Noto Sans KR'" font-size="10" font-weight="bold" text-anchor="middle">인기</text>

  <!-- Drink 2: Ice Cafe Latte -->
  <rect x="210" y="140" width="170" height="150" fill="#ffffff" rx="8" stroke="#00704a" stroke-width="2" />
  <rect x="225" y="150" width="140" height="60" fill="#e8f4fd" rx="6" />
  <!-- Glass with Ice representation -->
  <rect x="280" y="165" width="28" height="35" rx="3" fill="#8ecae6" opacity="0.6" />
  <rect x="284" y="172" width="8" height="24" fill="#8a5a44" />
  <rect x="294" y="178" width="10" height="18" fill="#e6ccb2" />
  <line x1="295" y1="160" x2="305" y2="198" stroke="#da291c" stroke-width="2" />
  <text x="295" y="235" fill="#222222" font-family="'Noto Sans KR'" font-size="14" font-weight="bold" text-anchor="middle">아이스 카페라떼</text>
  <text x="295" y="258" fill="#00704a" font-family="'Noto Sans KR'" font-size="14" font-weight="bold" text-anchor="middle">5,000원</text>
  
  <!-- Drink 3: Grapefruit Honey Black Tea -->
  <rect x="20" y="305" width="170" height="140" fill="#ffffff" rx="8" stroke="#dddddd" stroke-width="1" />
  <rect x="35" y="315" width="140" height="55" fill="#fff0f0" rx="6" />
  <!-- Tea cup graphic -->
  <path d="M 90 330 L 120 330 L 115 355 L 95 355 Z" fill="#e07a5f" />
  <path d="M 105 322 Q 107 318 105 314" stroke="#e07a5f" stroke-width="1.5" fill="none" />
  <text x="105" y="395" fill="#222222" font-family="'Noto Sans KR'" font-size="13" font-weight="bold" text-anchor="middle">자몽 허니 블랙티</text>
  <text x="105" y="415" fill="#c33c23" font-family="'Noto Sans KR'" font-size="13" font-weight="bold" text-anchor="middle">5,700원</text>

  <!-- Drink 4: Green Tea Frappuccino -->
  <rect x="210" y="305" width="170" height="140" fill="#ffffff" rx="8" stroke="#dddddd" stroke-width="1" />
  <rect x="225" y="315" width="140" height="55" fill="#eaf4ec" rx="6" />
  <!-- Frappuccino Graphic -->
  <rect x="282" y="325" width="24" height="30" fill="#52b788" />
  <path d="M 282 325 C 282 318 306 318 306 325 Z" fill="#ffffff" />
  <line x1="294" y1="315" x2="294" y2="350" stroke="#00704a" stroke-width="2" />
  <text x="295" y="395" fill="#222222" font-family="'Noto Sans KR'" font-size="13" font-weight="bold" text-anchor="middle">제주 말차 프라푸치노</text>
  <text x="295" y="415" fill="#c33c23" font-family="'Noto Sans KR'" font-size="13" font-weight="bold" text-anchor="middle">6,300원</text>

  <!-- Big Selection Options / Instructions -->
  <rect x="15" y="458" width="370" height="75" fill="#00704a" rx="10" />
  <text x="35" y="488" fill="#ffffff" font-family="'Noto Sans KR'" font-size="14" font-weight="bold">아이스 카페라떼가 선택되었습니다.</text>
  <text x="35" y="514" fill="#ffb703" font-family="'Noto Sans KR'" font-size="15" font-weight="bold">👉 화면 오른쪽 아래 초록색 결제 단계를 누르세요!</text>

  <!-- Small Pay button directly nested inside -->
  <rect x="285" y="470" width="90" height="50" fill="#ffb703" rx="6" />
  <text x="330" y="500" fill="#111111" font-family="'Noto Sans KR'" font-size="16" font-weight="bold" text-anchor="middle">주문하기</text>
</svg>`
  },
  {
    id: "government",
    name: "주민등록등본 무인 민원 발급기",
    category: "동주민센터 / 무인 민원 발급기",
    description: "주민등록등본, 초본 등 공공 증명서를 선택하고 수수료를 지불하여 발급받는 기계입니다.",
    icon: "📄",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 550" width="100%" height="100%">
  <!-- Frame -->
  <rect x="0" y="0" width="400" height="550" fill="#243b55" rx="16" />
  <rect x="10" y="10" width="380" height="530" fill="#eef2f7" rx="12" />
  
  <!-- Gov Blue Header -->
  <rect x="10" y="10" width="380" height="75" fill="#141e30" rx="12" />
  <!-- South Korea Gov Logo Decor Emblem -->
  <circle cx="340" cy="48" r="18" fill="#4389a2" />
  <circle cx="340" cy="48" r="13" fill="none" stroke="#ffffff" stroke-width="2" />
  <text x="30" y="45" fill="#ffffff" font-family="'Noto Sans KR', sans-serif" font-size="18" font-weight="bold">대한민국 정부 무인발급기</text>
  <text x="30" y="68" fill="#a5d6a7" font-family="'Noto Sans KR'" font-size="11">원하시는 증명서를 눌러서 발급받으세요.</text>
  
  <!-- Step Instruction Area -->
  <rect x="20" y="95" width="360" height="55" fill="#ffffff" rx="6" stroke="#4389a2" stroke-width="1.5" />
  <text x="35" y="118" fill="#141e30" font-family="'Noto Sans KR'" font-size="14" font-weight="bold">어르신 안내:</text>
  <text x="35" y="138" fill="#d32f2f" font-family="'Noto Sans KR'" font-size="13" font-weight="bold">신분증 대신 지문 인식기(기기 아래)를 사용합니다.</text>
  
  <!-- Document Select Buttons -->
  <!-- Doc 1: Resident Register -->
  <rect x="20" y="165" width="360" height="70" fill="#1565c0" rx="8" />
  <!-- Document graphic outline -->
  <rect x="35" y="180" width="30" height="40" fill="#ffffff" rx="2" />
  <line x1="40" y1="190" x2="50" y2="190" stroke="#1565c0" stroke-width="2" />
  <line x1="40" y1="198" x2="55" y2="198" stroke="#1565c0" stroke-width="2" />
  <line x1="40" y1="206" x2="52" y2="206" stroke="#1565c0" stroke-width="2" />
  <text x="80" y="198" fill="#ffffff" font-family="'Noto Sans KR'" font-size="18" font-weight="bold">주민등록 등본 / 초본</text>
  <text x="80" y="218" fill="#e3f2fd" font-family="'Noto Sans KR'" font-size="13">수수료 : 1통당 200원 (현금/카드 가능)</text>
  <rect x="305" y="180" width="60" height="40" fill="#ffb703" rx="4" />
  <text x="335" y="205" fill="#111111" font-family="'Noto Sans KR'" font-size="14" font-weight="bold" text-anchor="middle">선택</text>

  <!-- Doc 2: Family Document -->
  <rect x="20" y="250" width="360" height="70" fill="#ffffff" rx="8" stroke="#cccccc" stroke-width="1" />
  <!-- Document graphic outline -->
  <rect x="35" y="265" width="30" height="40" fill="#e2f0d9" rx="2" />
  <text x="80" y="283" fill="#222222" font-family="'Noto Sans KR'" font-size="17" font-weight="bold">가족관계 등록부 (등본)</text>
  <text x="80" y="303" fill="#666666" font-family="'Noto Sans KR'" font-size="12">제적등본, 기본증명서, 혼인관계증명서 등</text>
  <rect x="305" y="265" width="60" height="40" fill="#eef2f7" rx="4" stroke="#cccccc" stroke-width="1" />
  <text x="335" y="290" fill="#444444" font-family="'Noto Sans KR'" font-size="14" text-anchor="middle">선택</text>

  <!-- Doc 3: Health Insurance -->
  <rect x="20" y="335" width="360" height="70" fill="#ffffff" rx="8" stroke="#cccccc" stroke-width="1" />
  <rect x="35" y="350" width="30" height="40" fill="#e8f4fd" rx="2" />
  <text x="80" y="368" fill="#222222" font-family="'Noto Sans KR'" font-size="17" font-weight="bold">건강보험 (납부확인서)</text>
  <text x="80" y="388" fill="#666666" font-family="'Noto Sans KR'" font-size="12">자격득실확인서, 보험료 납부확인 내역 등</text>
  <rect x="305" y="350" width="60" height="40" fill="#eef2f7" rx="4" stroke="#cccccc" stroke-width="1" />
  <text x="335" y="375" fill="#444444" font-family="'Noto Sans KR'" font-size="14" text-anchor="middle">선택</text>

  <!-- Fingerprint Sensor Area Instruction inside Screen -->
  <rect x="20" y="420" width="360" height="105" fill="#fff3cd" rx="8" stroke="#ffeba8" stroke-width="1" />
  <circle cx="65" cy="472" r="28" fill="#e0a96d" />
  <!-- Fingerprint pattern simple mimic -->
  <path d="M 65 452 A 15 15 0 0 1 80 472" stroke="#ffffff" stroke-width="3" fill="none" />
  <path d="M 58 458 A 10 10 0 0 1 72 472" stroke="#ffffff" stroke-width="3" fill="none" />
  <path d="M 65 464 A 4 4 0 0 1 69 472" stroke="#ffffff" stroke-width="3" fill="none" />
  <text x="110" y="455" fill="#7a5c00" font-family="'Noto Sans KR'" font-size="15" font-weight="bold">지문 인식기 대기 안내</text>
  <text x="110" y="478" fill="#d32f2f" font-family="'Noto Sans KR'" font-size="13" font-weight="bold">1. 위 파란색 주민등록등본을 먼저 누른 후,</text>
  <text x="110" y="498" fill="#333333" font-family="'Noto Sans KR'" font-size="12">2. 기기 아래 지문인식창에 엄지손가락을 대세요.</text>
</svg>`
  },
  {
    id: "hospital",
    name: "종합병원 처방전 / 수납 무인기",
    category: "종합병원 / 약국",
    description: "진료비를 신용카드로 결제하고 처방전을 종이로 발급받아 인쇄하는 무인 기계입니다.",
    icon: "🏥",
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 550" width="100%" height="100%">
  <!-- Frame -->
  <rect x="0" y="0" width="400" height="550" fill="#006466" rx="16" />
  <rect x="10" y="10" width="380" height="530" fill="#f0fdf4" rx="12" />
  
  <!-- Hospital Green Header -->
  <rect x="10" y="10" width="380" height="75" fill="#06d6a0" rx="12" />
  <!-- Green Cross emblem -->
  <rect x="330" y="30" width="30" height="30" fill="#ffffff" rx="4" />
  <rect x="341" y="35" width="8" height="20" fill="#06d6a0" />
  <rect x="335" y="41" width="20" height="8" fill="#06d6a0" />
  <text x="30" y="45" fill="#1b4332" font-family="'Noto Sans KR', sans-serif" font-size="20" font-weight="bold">연세 사랑 서울병원 무인 수납기</text>
  <text x="30" y="68" fill="#1b4332" font-family="'Noto Sans KR'" font-size="12">처방전 발행 및 진료비 수납기입니다.</text>
  
  <!-- Big Buttons -->
  <!-- Option 1: Print prescription -->
  <rect x="25" y="110" width="350" height="110" fill="#ffffff" rx="12" stroke="#06d6a0" stroke-width="2.5" />
  <!-- Mini Icon prescription -->
  <rect x="45" y="130" width="50" height="70" fill="#e8fdf5" rx="6" />
  <path d="M 60 145 H 80 M 60 160 H 80 M 60 175 H 75" stroke="#06d6a0" stroke-width="3" stroke-linecap="round" />
  <text x="115" y="152" fill="#1b4332" font-family="'Noto Sans KR'" font-size="22" font-weight="bold">처방전 발행</text>
  <text x="115" y="180" fill="#006466" font-family="'Noto Sans KR'" font-size="13" font-weight="bold">약국에 제출할 처방전(약 지어 먹는 종이)을</text>
  <text x="115" y="198" fill="#006466" font-family="'Noto Sans KR'" font-size="13" font-weight="bold">여기서 바로 출력합니다.</text>
  <rect x="290" y="145" width="70" height="40" fill="#06d6a0" rx="6" />
  <text x="325" y="170" fill="#ffffff" font-family="'Noto Sans KR'" font-size="14" font-weight="bold" text-anchor="middle">출력 시작</text>

  <!-- Option 2: Pay hospital bills -->
  <rect x="25" y="240" width="350" height="110" fill="#2d6a4f" rx="12" />
  <!-- Mini Icon Credit Card -->
  <rect x="45" y="260" width="50" height="70" fill="#40916c" rx="6" />
  <rect x="45" y="270" width="50" height="12" fill="#1b4332" />
  <circle cx="60" cy="295" r="5" fill="#ffb703" />
  <text x="115" y="282" fill="#ffffff" font-family="'Noto Sans KR'" font-size="22" font-weight="bold">진료비 수납 / 카드 결제</text>
  <text x="115" y="310" fill="#d8f3dc" font-family="'Noto Sans KR'" font-size="13">오늘 진료받으신 의료비를 기계로 결제하고</text>
  <text x="115" y="328" fill="#d8f3dc" font-family="'Noto Sans KR'" font-size="13">영수증을 받는 곳입니다.</text>
  <rect x="290" y="275" width="70" height="40" fill="#ffb703" rx="6" />
  <text x="325" y="300" fill="#111111" font-family="'Noto Sans KR'" font-size="14" font-weight="bold" text-anchor="middle">눌러주세요</text>

  <!-- Input / Notice -->
  <rect x="25" y="375" width="350" height="145" fill="#f8eedb" rx="10" stroke="#ffd166" stroke-width="1.5" />
  <text x="45" y="405" fill="#2d6a4f" font-family="'Noto Sans KR'" font-size="16" font-weight="bold">⚠️ 어르신 필독 (꼭 읽어보세요):</text>
  <text x="45" y="432" fill="#222222" font-family="'Noto Sans KR'" font-size="13" font-weight="bold">1. 진료 예약 시 받은 바코드나 환자 번호가 필요합니다.</text>
  <text x="45" y="455" fill="#222222" font-family="'Noto Sans KR'" font-size="13" font-weight="bold">2. 환자등록번호를 모르는 경우 창구 직원을 찾아주세요.</text>
  <text x="45" y="482" fill="#d32f2f" font-family="'Noto Sans KR'" font-size="14" font-weight="bold">👉 '처방전 발행' 또는 '진료비 수납' 큰 버튼을 누르세요!</text>
</svg>`
  }
];
