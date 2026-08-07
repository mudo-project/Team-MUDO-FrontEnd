// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
export type DummyNoticeFile = {
    name: string;
    size: string;
    extension: string;
};

export type DummyNotice = {
    id: number;
    title: string;
    category: string;
    author: string;
    authorRole: string;
    date: string;
    datetime: string;
    important?: boolean;
    attachment?: boolean;
    content: string;
    viewCount: number;
    readCount: number;
    totalMemberCount: number;
    file?: DummyNoticeFile;
};

export const dummyNotices: DummyNotice[] = [
    {
        id: 1,
        title: "8월 급여 지급일 안내",
        category: "인사",
        author: "김지수",
        authorRole: "대표",
        date: "08.01",
        datetime: "2026.08.01 09:10",
        important: true,
        attachment: true,
        content: `안녕하세요, 원장 김지수입니다.

8월 급여 지급일을 아래와 같이 안내드립니다.

‣ 지급일: 2026년 8월 25일 (화)
‣ 지급 방법: 각 직원 등록 계좌 이체
‣ 문의: 행정팀 정다은

급여 관련 이상이 있을 경우 지급일 전날까지 행정팀에 연락주시기 바랍니다.
감사합니다.`,
        viewCount: 13,
        readCount: 3,
        totalMemberCount: 5,
        file: { name: "2026년 8월 급여명세서 양식.xlsx", size: "42 KB", extension: "XLS" },
    },
    {
        id: 2,
        title: "2학기 개강 준비 및 교사 회의 일정 안내",
        category: "업무",
        author: "김지수",
        authorRole: "대표",
        date: "07.30",
        datetime: "2026.07.30 10:00",
        important: true,
        attachment: true,
        content: `2학기 개강 준비를 위한 교사 회의를 아래와 같이 진행합니다.

‣ 일시: 2026년 8월 18일 (화) 오후 3시
‣ 장소: 3층 교사 회의실

참석 대상 전원 참석 부탁드립니다.`,
        viewCount: 9,
        readCount: 4,
        totalMemberCount: 5,
        file: { name: "2학기_개강준비_체크리스트.docx", size: "18 KB", extension: "DOC" },
    },
    {
        id: 3,
        title: "강의실 에어컨 정기 점검 안내 (8/7)",
        category: "시설",
        author: "정다은",
        authorRole: "행정팀",
        date: "08.03",
        datetime: "2026.08.03 14:20",
        content: `8월 7일(금) 전체 강의실 에어컨 정기 점검이 진행됩니다.

점검 시간 동안 일부 강의실 사용이 제한될 수 있으니 참고해 주시기 바랍니다.`,
        viewCount: 5,
        readCount: 2,
        totalMemberCount: 5,
    },
    {
        id: 4,
        title: "하반기 강사 모집 공고",
        category: "업무",
        author: "김지수",
        authorRole: "대표",
        date: "07.25",
        datetime: "2026.07.25 11:15",
        attachment: true,
        content: `하반기 강사 채용을 아래와 같이 공고합니다.

‣ 모집 분야: 수학, 영어
‣ 지원 방법: 이력서 제출 (행정팀)`,
        viewCount: 21,
        readCount: 5,
        totalMemberCount: 5,
        file: { name: "하반기_강사모집_공고문.pdf", size: "120 KB", extension: "PDF" },
    },
    {
        id: 5,
        title: "8월 전체 회의 일정 변경 안내",
        category: "업무",
        author: "정다은",
        authorRole: "행정팀",
        date: "07.22",
        datetime: "2026.07.22 16:40",
        content: `8월 전체 회의 일정이 아래와 같이 변경되었습니다.

‣ 변경 전: 8월 4일 → 변경 후: 8월 6일`,
        viewCount: 7,
        readCount: 3,
        totalMemberCount: 5,
    },
    {
        id: 6,
        title: "원생 개인정보 보호 지침 준수 안내",
        category: "인사",
        author: "김지수",
        authorRole: "대표",
        date: "07.18",
        datetime: "2026.07.18 09:30",
        attachment: true,
        content: `원생 개인정보 보호를 위해 아래 지침을 준수해 주시기 바랍니다.

‣ 개인정보가 포함된 서류는 지정된 캐비닛에 보관
‣ 외부 반출 시 사전 승인 필요`,
        viewCount: 15,
        readCount: 4,
        totalMemberCount: 5,
        file: { name: "개인정보보호_지침.pdf", size: "64 KB", extension: "PDF" },
    },
];
