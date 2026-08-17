import {
    FolderOpen,
    GraduationCap,
    LucideIcon,
    MessageSquare,
    Sparkles,
    UploadCloud,
    Users,
    Wallet,
} from "lucide-react";

export const CONTACT_EMAIL = "ieum202608@gmail.com";
export const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("이음 도입 문의")}`;

export const NAV_LINKS = [
    { href: "#problem", label: "왜 이음인가" },
    { href: "#features", label: "핵심 기능" },
    { href: "#special", label: "특별 제공 기능" },
    { href: "#pricing", label: "요금제" },
];

export const PROBLEM_QUOTES = [
    {
        role: "학원 원장",
        quote: "직원 간 소통, 문서 작업, 결재 관련 서류 등 업무가 여러 플랫폼에서 따로 처리되고 있어요.",
    },
    {
        role: "행정 직원",
        quote: "카카오톡으로 업무 연락을 하다 보니 퇴근 후에도 업무·개인 생활의 경계가 무너져요.",
    },
    {
        role: "조교",
        quote: "업무 지시가 여러 채널로 와서 누락되는 경우가 많아요.",
    },
];

export const PROBLEM_INSIGHTS = [
    {
        title: "데이터 휘발 및 누락",
        description: "카카오톡으로 주고받는 업무 지시와 전달사항이 공유되지 않아 업무 흐름에 구멍이 생깁니다.",
    },
    {
        title: "불필요한 중복 업무",
        description: "출결은 전용 툴에, 업무 현황은 시트에, 자료는 드롭박스에. 같은 업무를 도구마다 새로 입력합니다.",
    },
    {
        title: "담당자 교체 시 업무 공백",
        description: "담당자가 바뀌면 이전 업무 기록은 미궁 속으로. 학원 전체의 운영 맥락 파악이 어려워집니다.",
    },
];

export const POSITIONING = [
    {
        name: "학원 관리 프로그램",
        tone: "border-[#E2E8F0] bg-white",
        points: ["학생 데이터·수납 관리 O", "사내 협업·전자결재 X", "직원 근태·급여 관리 X"],
        highlight: false,
    },
    {
        name: "일반 그룹웨어",
        tone: "border-[#E2E8F0] bg-white",
        points: ["사내 협업·결재 O", "반편성·출결·강의실 같은 학원 업무 메뉴 자체가 없음", "전산 담당자 없이는 세팅이 버거움"],
        highlight: false,
    },
    {
        name: "이음",
        tone: "border-[#2C8D50] bg-[#F3F9F5]",
        points: ["학생 데이터 관리 + 사내 그룹웨어를 한 번에", "학원 실무 그대로 반영한 메뉴 구성", "전산 담당자 없이도 바로 도입"],
        highlight: true,
    },
];

export interface FeaturePillar {
    icon: LucideIcon;
    title: string;
    description: string;
    items: string[];
}

export const FEATURE_PILLARS: FeaturePillar[] = [
    {
        icon: GraduationCap,
        title: "학원 운영",
        description: "원생 등록부터 수업·출결까지, 학원 핵심 업무를 한 화면에서",
        items: ["원생 관리", "강의 관리", "시간표 관리", "출석부 · 문자 발송", "문자 템플릿 관리"],
    },
    {
        icon: Users,
        title: "조직 운영",
        description: "직원 계정 발급부터 권한·근태까지, 조직 관리를 표준화",
        items: ["직원 계정 발급", "조립식 역할 · 권한 관리", "근태(출퇴근 · 연가) 관리"],
    },
    {
        icon: MessageSquare,
        title: "협업 관리",
        description: "일정·소통·자료 공유를 하나로 연결하는 협업 환경",
        items: ["메신저 · 업무지시 카드", "공지사항", "공유 폴더", "메모"],
    },
    {
        icon: Wallet,
        title: "경영 관리",
        description: "결재부터 지출 · 매출 분석까지 이어지는 경영 의사결정 지원",
        items: ["전자결재 · 결재 템플릿", "법인카드 정산", "급여명세서 자동 발급", "AI 매출 리포트"],
    },
];

export interface SpecialFeature {
    icon: LucideIcon;
    title: string;
    description: string;
}

export const SPECIAL_FEATURES: SpecialFeature[] = [
    {
        icon: UploadCloud,
        title: "초기 데이터 자동 등록",
        description:
            "학생 · 강의 · 수강 정보가 담긴 엑셀 · CSV만 올리면 초안을 검토한 뒤 자동으로 DB에 등록됩니다. 세팅 부담 없이 바로 시작할 수 있어요.",
    },
    {
        icon: Sparkles,
        title: "AI 매출 · 지출 리포트",
        description:
            "AI가 매달 학원의 매출 · 지출 · 순이익을 집계해 서술형 리포트로 정리합니다. 숫자 대신 결론만 확인하세요.",
    },
    {
        icon: FolderOpen,
        title: "학원 공유 폴더",
        description: "Google Drive와 연동된 공용 자료함으로, 시험지 · 서류 · 양식을 구성원 전체가 함께 관리합니다.",
    },
];

export const METRICS = [
    { value: "40%↑", label: "업무 처리 속도 향상 목표" },
    { value: "0건", label: "소통 누락 · 오류 제로화 목표" },
    { value: "25%↓", label: "운영 고정비 절감 목표" },
];

export const PRICING_PLANS = [
    {
        name: "무료 플랜",
        price: "월 4,000원",
        priceNote: "+ 서버 비용 별도 부담",
        highlight: false,
        rows: [
            ["직원 수", "20명까지"],
            ["학생 수", "50명까지"],
            ["S3 저장 용량", "500MB"],
            ["SMS 발송", "월 150건"],
            ["RDS 용량", "300MB"],
            ["AI 토큰", "월 100,000토큰"],
            ["메일 발송(Mailgun)", "월 100건"],
        ],
    },
    {
        name: "유료 플랜",
        price: "월 100,000원",
        priceNote: "직원 · 학생 규모가 큰 학원용",
        highlight: true,
        rows: [
            ["직원 수", "500명까지"],
            ["학생 수", "무제한"],
            ["S3 저장 용량", "5GB"],
            ["SMS 발송", "월 10,000건"],
            ["RDS 용량", "2GB"],
            ["AI 토큰", "월 1,000,000토큰"],
            ["메일 발송(Mailgun)", "월 10,000건"],
        ],
    },
];

export const ONBOARDING_STEPS = [
    {
        step: "01",
        title: "이메일로 도입 문의",
        description: "학원 이름, 규모, 궁금한 점을 이메일로 보내주세요.",
    },
    {
        step: "02",
        title: "대표 계정 발급",
        description: "저희가 학원 대표(원장) 계정을 만들어 드립니다.",
    },
    {
        step: "03",
        title: "구성원 계정 · 권한 생성",
        description: "대표 계정으로 직원 · 강사 · 조교 계정과 역할을 자유롭게 만들어 사용하세요.",
    },
];
