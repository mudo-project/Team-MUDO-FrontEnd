export type TextMessage = {
    kind: "text";
    id: number;
    sender?: string;
    initials?: string;
    time: string;
    text: string;
    own?: boolean;
    readCount?: number;
    deleted?: boolean;
};

export type TaskInstructionMessage = {
    kind: "task";
    id: number;
    taskId: string;
    own: boolean;
    instructor: string;
    instructorInitials: string;
    time: string;
    content: string;
    confirmed: number;
    assigneeCount: number;
};

export type TaskCompletionMessage = {
    kind: "task-completion";
    id: number;
    assigneeName: string;
    time: string;
    content: string;
    completed: number;
    total: number;
};

export type ChatMessage = TextMessage | TaskInstructionMessage | TaskCompletionMessage;

export function getMessageSearchText(message: ChatMessage): string {
    if (message.kind === "text") return message.deleted ? "" : message.text;
    return message.content;
}

export type TaskAssignee = {
    name: string;
    initials: string;
    done: boolean;
};

export type TaskDetail = {
    id: string;
    chatName: string;
    instructor: string;
    content: string;
    assignees: TaskAssignee[];
    dueDate: string;
    createdAt: string;
};

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
export const taskDetails: TaskDetail[] = [
    {
        id: "friday-classroom-notice",
        chatName: "전체 공지",
        instructor: "김지수",
        content: "금요일 보강 교실 변경 안내 메시지를 원생 전체에 발송해주세요.",
        assignees: [
            { name: "이민준", initials: "이민", done: true },
            { name: "박서연", initials: "박서", done: false },
        ],
        dueDate: "01.17",
        createdAt: "07.15 10:25",
    },
    {
        id: "math-timetable-review",
        chatName: "수학팀",
        instructor: "김지수",
        content: "2월 시간표 초안 작성 후 공유 부탁드립니다.",
        assignees: [
            { name: "이민준", initials: "이민", done: false },
        ],
        dueDate: "01.20",
        createdAt: "01.10 09:00",
    },
    {
        id: "math-classlog-submit",
        chatName: "수학팀",
        instructor: "김지수",
        content: "1월 2주차 수업 일지 제출해주세요.",
        assignees: [
            { name: "이민준", initials: "이민", done: false },
        ],
        dueDate: "01.14",
        createdAt: "01.07 09:00",
    },
    {
        id: "notice-prep-confirm",
        chatName: "전체 공지",
        instructor: "김지수",
        content: "설 연휴 전 수업 준비 완료 확인.",
        assignees: [
            { name: "이민준", initials: "이민", done: true },
            { name: "박서연", initials: "박서", done: true },
            { name: "정다은", initials: "정다", done: true },
        ],
        dueDate: "01.25",
        createdAt: "01.20 09:00",
    },
    {
        id: "notice-greeting",
        chatName: "전체 공지",
        instructor: "김지수",
        content: "안녕하세요",
        assignees: [
            { name: "이민준", initials: "이민", done: false },
        ],
        dueDate: "01.05",
        createdAt: "01.03 09:00",
    },
    {
        id: "math-printer-paper",
        chatName: "수학팀",
        instructor: "김지수",
        content: "프린터에 종이가 없습니다. 종이 복사해주세요.",
        assignees: [
            { name: "이민준", initials: "이민", done: false },
            { name: "박서연", initials: "박서", done: false },
        ],
        dueDate: "01.30",
        createdAt: "01.28 09:00",
    },
    {
        id: "math-timetable-check",
        chatName: "수학팀",
        instructor: "이민준",
        content: "9월 시간표 초안 검토 부탁드립니다.",
        assignees: [
            { name: "김지수", initials: "김지", done: false },
        ],
        dueDate: "07.25",
        createdAt: "07.20 15:30",
    },
];

export function getTaskDetail(id: string): TaskDetail | undefined {
    return taskDetails.find((task) => task.id === id);
}

export type Chat = {
    id: string;
    name: string;
    preview: string;
    time: string;
    unread?: number;
    initials: string;
    participantsCount: number;
    messages: ChatMessage[];
};

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
export const chats: Chat[] = [
    {
        id: "all-notice",
        name: "전체 공지",
        preview: "설 연휴 근무 일정 공지합니다.",
        time: "오전 10:23",
        unread: 2,
        initials: "전체",
        participantsCount: 8,
        messages: [
            { kind: "text", id: 1, sender: "김지수", initials: "김지", time: "오전 9:00", text: "안녕하세요! 이번 주 토요일은 설 연휴 전 마지막 수업일입니다. 모든 강사분들 수업 준비 잘 부탁드립니다.", readCount: 3 },
            { kind: "text", id: 2, sender: "이민준", initials: "이민", time: "오전 9:15", text: "네, 알겠습니다. 수업 준비 완료했습니다.", readCount: 2 },
            { kind: "text", id: 3, sender: "김지수", initials: "김지", time: "오전 10:23", text: "설 연휴 근무 일정 공지합니다. 1/27(월) ~ 1/29(수) 휴원, 1/30(목)부터 정상 운영입니다.", readCount: 1 },
            { kind: "task", id: 4, taskId: "friday-classroom-notice", own: true, instructor: "김지수", instructorInitials: "김지", time: "07.15 10:25", content: "금요일 보강 교실 변경 안내 메시지를 원생 전체에 발송해주세요.", confirmed: 1, assigneeCount: 2 },
            { kind: "text", id: 5, sender: "박서연", initials: "박서", time: "오전 10:30", text: "알겠습니다, 바로 진행하겠습니다!" },
            { kind: "task-completion", id: 6, assigneeName: "이민준", time: "오전 11:45", content: "금요일 보강 교실 변경 안내 메시지를 원생 전체에 발송해주세요.", completed: 1, total: 2 },
            { kind: "task-completion", id: 7, assigneeName: "박서연", time: "오후 1:12", content: "금요일 보강 교실 변경 안내 메시지를 원생 전체에 발송해주세요.", completed: 2, total: 2 },
        ],
    },
    {
        id: "math-team",
        name: "수학팀",
        preview: "이민준: 내일 수업 자료 공유해요",
        time: "어제",
        initials: "수학",
        participantsCount: 4,
        messages: [
            { kind: "text", id: 1, sender: "이민준", initials: "이민", time: "어제 오후 3:20", text: "내일 수업 자료 공유해요", readCount: 2 },
            { kind: "task", id: 2, taskId: "math-timetable-check", own: false, instructor: "이민준", instructorInitials: "이민", time: "07.20 15:30", content: "9월 시간표 초안 검토 부탁드립니다.", confirmed: 0, assigneeCount: 1 },
            { kind: "text", id: 3, own: true, time: "어제 오후 3:25", text: "네 확인했습니다!" },
        ],
    },
    {
        id: "park-seoyeon",
        name: "박서연",
        preview: "연가 처리 됐나요?",
        time: "어제",
        unread: 1,
        initials: "박서",
        participantsCount: 2,
        messages: [
            { kind: "text", id: 1, sender: "박서연", initials: "박서", time: "어제 오후 5:10", text: "연가 처리 됐나요?" },
        ],
    },
    {
        id: "admin-team",
        name: "행정팀",
        preview: "정다은: 청구서 발송 완료했습니다",
        time: "월요일",
        initials: "행정",
        participantsCount: 3,
        messages: [
            { kind: "text", id: 1, sender: "정다은", initials: "정다", time: "월요일 오후 4:00", text: "청구서 발송 완료했습니다." },
            { kind: "text", id: 2, own: true, time: "월요일 오후 4:10", text: "수고하셨습니다." },
        ],
    },
    {
        id: "kang-dohyun",
        name: "강도현",
        preview: "알겠습니다!",
        time: "월요일",
        initials: "강도",
        participantsCount: 2,
        messages: [
            { kind: "text", id: 1, own: true, time: "월요일 오전 11:00", text: "이번 주 시간표 변경 확인해주세요." },
            { kind: "text", id: 2, sender: "강도현", initials: "강도", time: "월요일 오전 11:05", text: "알겠습니다!" },
        ],
    },
];

export const DEFAULT_CHAT_ID = chats[0].id;
